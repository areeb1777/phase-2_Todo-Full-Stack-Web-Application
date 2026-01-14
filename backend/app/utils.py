"""
Utility functions for the Todo API
"""

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from app.database import engine, Base
from app.models import Todo, User
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ensure_tables_exist():
    """Ensure database tables exist, create them if they don't"""
    try:
        # Try to create the tables
        Base.metadata.create_all(bind=engine)

        # Test the connection by trying to access the todos table
        with engine.connect() as conn:
            # This will raise an exception if the table doesn't exist
            result = conn.execute(text("SELECT COUNT(*) FROM todos LIMIT 1"))

        logger.info("Database tables exist and are accessible")
        return True
    except Exception as e:
        logger.error(f"Error checking/creating tables: {e}")
        try:
            # Try to create tables again
            Base.metadata.create_all(bind=engine)
            logger.info("Tables created successfully")
            return True
        except Exception as e2:
            logger.error(f"Failed to create tables: {e2}")
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