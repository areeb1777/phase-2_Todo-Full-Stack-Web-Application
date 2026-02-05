"""
Utility functions for the Todo API
"""

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from app.database import engine, Base
from app.models import Todo, User, Conversation, Message
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ensure_tables_exist():
    """Ensure database tables exist, create them if they don't"""
    try:
        # Create all tables (including Conversation and Message)
        Base.metadata.create_all(bind=engine)

        logger.info("Database tables created/accessed successfully")
        return True
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        return False

def test_connection():
    """Test the database connection"""
    try:
        with engine.connect() as conn:
            # Simple test query
            result = conn.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False