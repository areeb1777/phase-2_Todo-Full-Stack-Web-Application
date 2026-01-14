from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import logging

load_dotenv()

# Force SQLite for development/testing to avoid connection issues
DATABASE_URL = "sqlite:///./todo_dev.db"

try:
    engine = create_engine(DATABASE_URL)
    logging.info("Database engine created successfully with SQLite")
except Exception as e:
    logging.error(f"Failed to create database engine: {e}")
    engine = create_engine("sqlite:///./todo_dev.db")
    print("Using SQLite for development")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()