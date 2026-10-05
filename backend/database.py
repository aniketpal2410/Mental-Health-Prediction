"""Database session and engine setup using SQLAlchemy."""

import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from config import DATABASE_URL

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
# pool_pre_ping ensures stale connections are re-verified before checkout
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    """Create tables if they don't already exist.

    Does not drop or alter existing data.
    """
    try:
        import models  # noqa: F401 - ensure models are registered on Base
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified / created successfully.")
    except Exception as exc:
        logger.error("Database initialization failed: %s", exc)
        raise


def get_db():
    """FastAPI dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Check if the database connection is currently alive."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.warning("Database connection check failed: %s", exc)
        return False
