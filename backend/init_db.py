"""
Database initialization script
Run this separately to create database tables when needed
"""

from app.database import engine, Base

def init_database():
    """Initialize the database tables"""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()