#!/usr/bin/env python3
"""
Script to reset the database tables in the database with the correct schema
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.database import Base, engine
from app.models import Todo, User
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_database_tables():
    """Drop and recreate all database tables with the correct schema"""
    logger.info("Resetting database tables...")

    try:
        # Connect to the database
        with engine.connect() as conn:
            # Begin a transaction
            trans = conn.begin()

            try:
                # Drop all existing tables
                logger.info("Dropping all existing tables...")
                Base.metadata.drop_all(bind=conn)

                # Create all tables with the correct schema using SQLAlchemy
                logger.info("Creating all tables with correct schema...")
                Base.metadata.create_all(bind=conn)

                # Commit the transaction
                trans.commit()
                logger.info("✅ All database tables reset successfully!")

            except Exception as e:
                # Rollback the transaction on error
                trans.rollback()
                logger.error(f"❌ Error resetting tables: {e}")
                raise e

    except Exception as e:
        logger.error(f"❌ Error connecting to database: {e}")
        return False

    return True

if __name__ == "__main__":
    logger.info("Starting database tables reset...")
    success = reset_database_tables()

    if success:
        logger.info("✅ Table reset completed successfully!")
        print("\n✅ Database tables have been reset with the correct schema.")
        print("You can now restart your application and add todos successfully.")
    else:
        logger.error("❌ Table reset failed!")
        sys.exit(1)