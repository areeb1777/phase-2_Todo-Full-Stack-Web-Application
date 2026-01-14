#!/usr/bin/env python3
"""
Database initialization script for Neon PostgreSQL
Run this script to create tables in your Neon database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.utils import ensure_tables_exist
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_neon_database():
    """Initialize the Neon database tables"""
    logger.info("Starting Neon database initialization...")

    try:
        # Ensure tables exist
        success = ensure_tables_exist()

        if success:
            logger.info("✅ Database tables created successfully in Neon!")
            logger.info("You can now add todos through the application.")
        else:
            logger.error("❌ Failed to create database tables")

    except Exception as e:
        logger.error(f"❌ Error initializing database: {e}")
        return False

    return True

if __name__ == "__main__":
    success = init_neon_database()
    if success:
        print("\n✅ Database initialization completed successfully!")
        print("Your Neon database is now ready to use.")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)