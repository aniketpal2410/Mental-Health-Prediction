"""Prediction logic – builds the DataFrame and calls the pipeline."""

import logging

import pandas as pd

from model_loader import get_model
from schemas import MentalHealthInput

logger = logging.getLogger(__name__)

# The exact column order the pipeline was trained on.
FEATURE_COLUMNS = [
    "Study_Hours",
    "Age",
    "Avg_Daily_Usage_Hours",
    "Daily_Unlocks",
    "Physical_Activity_Hours",
    "Sleep_Hours_Per_Night",
    "Stress_Level",
    "Gender",
    "Academic_Level",
    "Most_Used_Platform",
    "Purpose_Of_Use",
    "Grouped_Country",
]


from config import SCORE_THRESHOLDS


def get_score_interpretation(score: float) -> dict:
    """Translate predicted mental health score into risk level, status title, and message.

    Empirical analysis of the model's RandomForestRegressor reveals:
    - Higher score indicates better mental wellbeing (Lower Risk).
    - Lower score indicates higher digital strain / poor recovery (Higher Risk).
    - Distribution: Min ~3.60, Q1 ~5.10, Median ~6.10, Q3 ~7.10, Max ~9.40.

    Parameters
    ----------
    score : float
        Predicted mental health score.

    Returns
    -------
    dict
        Dictionary containing risk_level, status_title, and message.
    """
    if score >= SCORE_THRESHOLDS["LOW_RISK_MIN"]:
        return {
            "risk_level": "Low",
            "status_title": "Healthy Mental Balance",
            "message": (
                "Your daily lifestyle habits and recovery indicators look very positive!\n"
                "Keep maintaining a balanced lifestyle with regular sleep and exercise."
            ),
        }
    elif score >= SCORE_THRESHOLDS["MODERATE_RISK_MIN"]:
        return {
            "risk_level": "Moderate",
            "status_title": "Moderate Mental Balance",
            "message": (
                "Your daily habits are fairly balanced, with opportunities\n"
                "to improve your sleep, daily screen breaks, and study routine."
            ),
        }
    else:
        return {
            "risk_level": "High",
            "status_title": "Elevated Digital Strain",
            "message": (
                "Your inputs indicate significant screen strain and reduced recovery.\n"
                "Prioritize restful sleep, physical activity, and healthy digital boundaries."
            ),
        }


def predict(input_data: MentalHealthInput) -> dict:
    """Run a single prediction through the loaded sklearn pipeline.

    Parameters
    ----------
    input_data : MentalHealthInput
        Validated user input.

    Returns
    -------
    dict
        A dictionary containing predicted_score, risk_level, status_title, and message.
    """
    pipeline = get_model()

    # Build a single-row DataFrame with the exact column names and order
    row = {
        "Study_Hours": input_data.Study_Hours,
        "Age": input_data.Age,
        "Avg_Daily_Usage_Hours": input_data.Avg_Daily_Usage_Hours,
        "Daily_Unlocks": input_data.Daily_Unlocks,
        "Physical_Activity_Hours": input_data.Physical_Activity_Hours,
        "Sleep_Hours_Per_Night": input_data.Sleep_Hours_Per_Night,
        "Stress_Level": input_data.Stress_Level,
        "Gender": input_data.Gender,
        "Academic_Level": input_data.Academic_Level,
        "Most_Used_Platform": input_data.Most_Used_Platform,
        "Purpose_Of_Use": input_data.Purpose_Of_Use,
        "Grouped_Country": input_data.Grouped_Country,
    }

    df = pd.DataFrame([row], columns=FEATURE_COLUMNS)

    logger.debug("Prediction input:\n%s", df.to_string())

    prediction = pipeline.predict(df)
    score = round(float(prediction[0]), 2)

    interpretation = get_score_interpretation(score)
    logger.info("Predicted score: %s, Risk: %s", score, interpretation["risk_level"])

    return {
        "predicted_score": score,
        **interpretation,
    }

