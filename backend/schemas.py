"""Pydantic request / response schemas for the Mental Health Prediction API."""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


# ── Categorical value sets (must match what the trained pipeline expects) ──

STRESS_LEVELS = Literal["Low", "Medium", "High", "Very High"]

GENDERS = Literal["Male", "Female"]

ACADEMIC_LEVELS = Literal["High School", "Undergraduate", "Graduate"]

PLATFORMS = Literal[
    "Facebook", "Instagram", "KakaoTalk", "LINE", "LinkedIn",
    "Snapchat", "TikTok", "Twitter", "VKontakte", "WeChat",
    "WhatsApp", "YouTube",
]

PURPOSES = Literal["Education", "Entertainment", "Networking", "News"]

COUNTRIES = Literal[
    "Australia", "Canada", "France", "Germany", "India",
    "Mexico", "Other", "Turkey", "UK", "USA",
]


# ── Request bodies ──

class MentalHealthInput(BaseModel):
    """Input payload accepted by POST /api/predict."""

    Age: int = Field(..., ge=10, le=100, description="Age of the individual")
    Gender: GENDERS = Field(..., description="Gender")
    Grouped_Country: COUNTRIES = Field(..., description="Country / region group")
    Academic_Level: ACADEMIC_LEVELS = Field(..., description="Academic level")
    Most_Used_Platform: PLATFORMS = Field(..., description="Most used social media platform")
    Purpose_Of_Use: PURPOSES = Field(..., description="Primary purpose of social media use")
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24, description="Average daily social media usage in hours")
    Daily_Unlocks: int = Field(..., ge=0, description="Number of daily phone unlocks")
    Study_Hours: float = Field(..., ge=0, le=24, description="Daily study hours")
    Physical_Activity_Hours: float = Field(..., ge=0, le=24, description="Daily physical activity hours")
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24, description="Sleep hours per night")
    Stress_Level: STRESS_LEVELS = Field(..., description="Self-reported stress level")

    model_config = {"json_schema_extra": {
        "examples": [
            {
                "Age": 21,
                "Gender": "Male",
                "Grouped_Country": "India",
                "Academic_Level": "Undergraduate",
                "Most_Used_Platform": "Instagram",
                "Purpose_Of_Use": "Entertainment",
                "Avg_Daily_Usage_Hours": 5.0,
                "Daily_Unlocks": 80,
                "Study_Hours": 3.0,
                "Physical_Activity_Hours": 1.5,
                "Sleep_Hours_Per_Night": 6.5,
                "Stress_Level": "Medium",
            }
        ]
    }}


class SaveResultRequest(BaseModel):
    """Input payload accepted by POST /api/results/save."""

    visitor_id: str = Field(..., description="Anonymous client visitor UUID")
    name: Optional[str] = Field(None, description="Optional user name")

    # Assessment input features
    Age: int = Field(..., ge=10, le=100)
    Gender: str
    Grouped_Country: str
    Academic_Level: str
    Most_Used_Platform: str
    Purpose_Of_Use: str
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24)
    Daily_Unlocks: int = Field(..., ge=0)
    Study_Hours: float = Field(..., ge=0, le=24)
    Physical_Activity_Hours: float = Field(..., ge=0, le=24)
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24)
    Stress_Level: str

    # Prediction outputs
    mental_health_score: float = Field(..., description="Actual ML prediction score")
    risk_level: str = Field(..., description="Interpreted risk level")
    status_title: str = Field(..., description="Status title headline")
    result_message: str = Field(..., description="Detailed lifestyle feedback message")


# ── Response bodies ──

class PredictionResponse(BaseModel):
    """Response returned by POST /api/predict."""
    predicted_score: float = Field(..., description="Predicted mental health score")
    risk_level: str = Field(..., description="Interpreted risk level: Low, Moderate, or High")
    status_title: str = Field(..., description="Headline interpretation of mental health balance")
    message: str = Field(..., description="Detailed lifestyle guidance and feedback")


class SaveResultResponse(BaseModel):
    """Response returned by POST /api/results/save."""
    success: bool = True
    message: str = "Result saved successfully"
    result_id: int


class HistoryItemResponse(BaseModel):
    """Single item in the history list returned by GET /api/results/history/{visitor_id}."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    visitor_id: str
    name: Optional[str] = None
    mental_health_score: float
    risk_level: str
    status_title: str
    result_message: str
    created_at: datetime


class SavedResultDetailResponse(BaseModel):
    """Full detail of a saved prediction returned by GET /api/results/{result_id}."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    visitor_id: str
    name: Optional[str] = None
    created_at: datetime

    # Inputs
    age: int
    gender: str
    grouped_country: str
    academic_level: str
    most_used_platform: str
    purpose_of_use: str
    avg_daily_usage_hours: float
    daily_unlocks: int
    study_hours: float
    physical_activity_hours: float
    sleep_hours_per_night: float
    stress_level: str

    # Prediction Data
    mental_health_score: float
    risk_level: str
    status_title: str
    result_message: str


class DeleteResultResponse(BaseModel):
    """Response returned by DELETE /api/results/{result_id}."""
    success: bool = True
    message: str = "Result deleted successfully"


class HealthResponse(BaseModel):
    """Response returned by GET /api/health."""
    status: str
    model_loaded: bool
    database_connected: bool


class ModelInfoResponse(BaseModel):
    """Response returned by GET /api/model-info."""
    model_type: str
    sklearn_version_trained: str
    sklearn_version_runtime: str
    pipeline_steps: list[str]
    total_input_features: int
    numerical_features: list[str]
    categorical_features: dict[str, list[str]]


class ErrorResponse(BaseModel):
    """Generic error envelope."""
    detail: str
