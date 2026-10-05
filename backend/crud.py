"""CRUD operations for PredictionResult database records."""

import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from models import PredictionResult
from schemas import SaveResultRequest

logger = logging.getLogger(__name__)


def save_prediction_result(db: Session, data: SaveResultRequest) -> PredictionResult:
    """Save an assessment and its ML prediction score to the database."""
    record = PredictionResult(
        visitor_id=data.visitor_id,
        name=data.name.strip() if data.name else None,
        # Inputs
        age=data.Age,
        gender=data.Gender,
        grouped_country=data.Grouped_Country,
        academic_level=data.Academic_Level,
        most_used_platform=data.Most_Used_Platform,
        purpose_of_use=data.Purpose_Of_Use,
        avg_daily_usage_hours=data.Avg_Daily_Usage_Hours,
        daily_unlocks=data.Daily_Unlocks,
        study_hours=data.Study_Hours,
        physical_activity_hours=data.Physical_Activity_Hours,
        sleep_hours_per_night=data.Sleep_Hours_Per_Night,
        stress_level=data.Stress_Level,
        # Outputs
        mental_health_score=data.mental_health_score,
        risk_level=data.risk_level,
        status_title=data.status_title,
        result_message=data.result_message,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    logger.info("Saved prediction result ID: %d for visitor: %s", record.id, record.visitor_id)
    return record


def get_history_by_visitor(db: Session, visitor_id: str) -> List[PredictionResult]:
    """Retrieve all prediction records for a specific visitor, ordered newest first."""
    return (
        db.query(PredictionResult)
        .filter(PredictionResult.visitor_id == visitor_id)
        .order_by(PredictionResult.created_at.desc())
        .all()
    )


def get_result_by_id(db: Session, result_id: int, visitor_id: str) -> Optional[PredictionResult]:
    """Retrieve a single prediction result verifying visitor ownership."""
    return (
        db.query(PredictionResult)
        .filter(
            PredictionResult.id == result_id,
            PredictionResult.visitor_id == visitor_id,
        )
        .first()
    )


def delete_result_by_id(db: Session, result_id: int, visitor_id: str) -> bool:
    """Delete a prediction result verifying visitor ownership.

    Returns True if found and deleted, False otherwise.
    """
    record = (
        db.query(PredictionResult)
        .filter(
            PredictionResult.id == result_id,
            PredictionResult.visitor_id == visitor_id,
        )
        .first()
    )
    if not record:
        return False

    db.delete(record)
    db.commit()
    logger.info("Deleted prediction result ID: %d for visitor: %s", result_id, visitor_id)
    return True
