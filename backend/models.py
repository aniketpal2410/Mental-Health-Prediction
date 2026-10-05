"""SQLAlchemy ORM models for the Mental Health application."""

from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from database import Base


class PredictionResult(Base):
    """Stores saved mental health assessment inputs and prediction outputs."""

    __tablename__ = "prediction_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    visitor_id = Column(String(64), nullable=False, index=True)
    name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Input Features
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    grouped_country = Column(String(50), nullable=False)
    academic_level = Column(String(50), nullable=False)
    most_used_platform = Column(String(50), nullable=False)
    purpose_of_use = Column(String(50), nullable=False)
    avg_daily_usage_hours = Column(Float, nullable=False)
    daily_unlocks = Column(Integer, nullable=False)
    study_hours = Column(Float, nullable=False)
    physical_activity_hours = Column(Float, nullable=False)
    sleep_hours_per_night = Column(Float, nullable=False)
    stress_level = Column(String(20), nullable=False)

    # Prediction Outputs
    mental_health_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    status_title = Column(String(100), nullable=False)
    result_message = Column(Text, nullable=False)
