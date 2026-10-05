"""Mental Health Prediction API – FastAPI application with PostgreSQL database."""

import logging
from contextlib import asynccontextmanager
from typing import List

import sklearn
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from config import CORS_ORIGINS, DEBUG
from crud import (
    delete_result_by_id,
    get_history_by_visitor,
    get_result_by_id,
    save_prediction_result,
)
from database import check_db_connection, get_db, init_db
from model_loader import is_model_loaded, load_model
from prediction import FEATURE_COLUMNS, predict
from schemas import (
    DeleteResultResponse,
    ErrorResponse,
    HealthResponse,
    HistoryItemResponse,
    MentalHealthInput,
    ModelInfoResponse,
    PredictionResponse,
    SavedResultDetailResponse,
    SaveResultRequest,
    SaveResultResponse,
)

# ── Logging ──
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ──

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model and verify database tables on startup."""
    logger.info("Starting up – loading ML model …")
    try:
        load_model()
        logger.info("Model ready.")
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
        raise

    logger.info("Verifying database schema …")
    try:
        init_db()
    except Exception as exc:
        logger.warning(
            "Database not reachable during startup initialization: %s. "
            "Tables will be verified when PostgreSQL is active.",
            exc,
        )

    yield
    logger.info("Shutting down.")


# ── App factory ──

app = FastAPI(
    title="Mental Health Prediction API",
    description=(
        "Predicts a mental health score from social media usage, "
        "academic habits, and lifestyle features using a pre-trained "
        "Random Forest regression pipeline, with persistent PostgreSQL storage."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ──

@app.get(
    "/api/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check",
)
async def health_check():
    """Returns API health status, ML model status, and PostgreSQL connectivity."""
    return HealthResponse(
        status="healthy",
        model_loaded=is_model_loaded(),
        database_connected=check_db_connection(),
    )


@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    responses={500: {"model": ErrorResponse}},
    tags=["Prediction"],
    summary="Predict mental health score",
)
async def predict_mental_health(input_data: MentalHealthInput):
    """Accept user features and return a predicted mental health score with interpretation.

    The input is validated, converted to a pandas DataFrame, and passed
    directly to the loaded sklearn pipeline (no manual preprocessing).
    """
    try:
        result = predict(input_data)
        return PredictionResponse(**result)
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )


# ── Results & History Persistence Routes ──

@app.post(
    "/api/results/save",
    response_model=SaveResultResponse,
    responses={500: {"model": ErrorResponse}},
    tags=["Database"],
    summary="Save assessment and prediction result",
)
async def save_result(
    payload: SaveResultRequest,
    db: Session = Depends(get_db),
):
    """Save an assessment together with its actual ML prediction to PostgreSQL."""
    try:
        record = save_prediction_result(db, payload)
        return SaveResultResponse(
            success=True,
            message="Result saved successfully",
            result_id=record.id,
        )
    except Exception as exc:
        logger.exception("Failed to save prediction result to database")
        raise HTTPException(
            status_code=500,
            detail=f"Unable to save result: {str(exc)}",
        )


@app.get(
    "/api/results/history/{visitor_id}",
    response_model=List[HistoryItemResponse],
    responses={500: {"model": ErrorResponse}},
    tags=["Database"],
    summary="Get user prediction history",
)
async def get_history(
    visitor_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve history of saved predictions belonging exclusively to visitor_id (newest first)."""
    try:
        records = get_history_by_visitor(db, visitor_id)
        return records
    except Exception as exc:
        logger.exception("Failed to query history for visitor %s", visitor_id)
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load history: {str(exc)}",
        )


@app.get(
    "/api/results/{result_id}",
    response_model=SavedResultDetailResponse,
    responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Database"],
    summary="Get a single saved prediction",
)
async def get_saved_result(
    result_id: int,
    visitor_id: str = Query(..., description="Visitor UUID for ownership verification"),
    db: Session = Depends(get_db),
):
    """Retrieve a single saved prediction verifying visitor ownership."""
    try:
        record = get_result_by_id(db, result_id, visitor_id)
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Saved result not found or access denied.",
            )
        return record
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to retrieve result %d", result_id)
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load result: {str(exc)}",
        )


@app.delete(
    "/api/results/{result_id}",
    response_model=DeleteResultResponse,
    responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Database"],
    summary="Delete a saved prediction",
)
async def delete_saved_result(
    result_id: int,
    visitor_id: str = Query(..., description="Visitor UUID for ownership verification"),
    db: Session = Depends(get_db),
):
    """Delete a saved prediction, strictly enforcing visitor ownership."""
    try:
        deleted = delete_result_by_id(db, result_id, visitor_id)
        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Saved result not found or access denied.",
            )
        return DeleteResultResponse(
            success=True,
            message="Result deleted successfully",
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to delete result %d", result_id)
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete result: {str(exc)}",
        )


@app.get(
    "/api/model-info",
    response_model=ModelInfoResponse,
    tags=["Model Info"],
    summary="Model metadata",
)
async def model_info():
    """Return metadata about the loaded model and its expected features."""
    from model_loader import get_model

    try:
        pipeline = get_model()

        # Extract step names
        steps = [name for name, _ in pipeline.steps]

        return ModelInfoResponse(
            model_type="RandomForestRegressor",
            sklearn_version_trained="1.6.1",
            sklearn_version_runtime=sklearn.__version__,
            pipeline_steps=steps,
            total_input_features=len(FEATURE_COLUMNS),
            numerical_features=[
                "Study_Hours",
                "Age",
                "Avg_Daily_Usage_Hours",
                "Daily_Unlocks",
                "Physical_Activity_Hours",
                "Sleep_Hours_Per_Night",
            ],
            categorical_features={
                "Stress_Level": ["Low", "Medium", "High", "Very High"],
                "Gender": ["Male", "Female"],
                "Academic_Level": ["High School", "Undergraduate", "Graduate"],
                "Most_Used_Platform": [
                    "Facebook", "Instagram", "KakaoTalk", "LINE",
                    "LinkedIn", "Snapchat", "TikTok", "Twitter",
                    "VKontakte", "WeChat", "WhatsApp", "YouTube",
                ],
                "Purpose_Of_Use": [
                    "Education", "Entertainment", "Networking", "News",
                ],
                "Grouped_Country": [
                    "Australia", "Canada", "France", "Germany", "India",
                    "Mexico", "Other", "Turkey", "UK", "USA",
                ],
            },
        )
    except Exception as exc:
        logger.exception("Failed to retrieve model info")
        raise HTTPException(
            status_code=500,
            detail=f"Could not retrieve model info: {str(exc)}",
        )


# ── Entrypoint ──

if __name__ == "__main__":
    import uvicorn
    from config import HOST, PORT

    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)
