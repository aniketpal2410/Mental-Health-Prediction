"""Application configuration loaded from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory is the backend/ folder
BASE_DIR = Path(__file__).resolve().parent

# Load .env file from project root or backend directory if present
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")
load_dotenv()

# Database configuration (PostgreSQL via psycopg3)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/mindcare",
)

# Model configuration
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(BASE_DIR / "models" / "Mental_Health_Model.pkl"),
)

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# CORS – origins allowed to call this API
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://localhost:5174",
).split(",")

# Score thresholds for mental health interpretation
# Higher score indicates better mental health balance (lower risk).
# Empirical distribution from trained RandomForestRegressor:
# Leaf values: 3.60 to 9.40 | Q1: 5.10 | Median: 6.10 | Q3: 7.10 | Mean: 6.21
SCORE_THRESHOLDS = {
    "LOW_RISK_MIN": 7.2,       # >= 7.2 indicates Low Risk / Healthy Balance
    "MODERATE_RISK_MIN": 5.3,  # 5.3 to 7.19 indicates Moderate Risk
}
