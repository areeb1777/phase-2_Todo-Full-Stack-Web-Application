"""
Application startup script
Handles database initialization and other startup tasks
"""

from app.database import engine, Base
from contextlib import contextmanager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create database tables if they don't exist"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        # Don't crash the application if table creation fails
        logger.info("Continuing without table creation...")

def startup_tasks():
    """Run all startup tasks"""
    logger.info("Running startup tasks...")
    create_tables()
    logger.info("Startup tasks completed.")

if __name__ == "__main__":
    startup_tasks()