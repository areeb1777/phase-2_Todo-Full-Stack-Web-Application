import sys
import os

# Ensure backend root is on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.auth import get_password_hash, create_access_token
# Import ALL models so Base.metadata knows about every table
from app.models import User, Todo, Conversation, Message  # noqa: F401

# In-memory SQLite with StaticPool so all connections share the same DB
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def test_db():
    """Create all tables, yield a session, then tear down."""
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def test_client(test_db):
    """FastAPI TestClient with DB dependency overridden to use test_db."""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    from main import app
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(test_db):
    """Create a test user directly in the database."""
    user = User(
        email="testuser@example.com",
        password_hash=get_password_hash("testpass123"),
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_token(test_user):
    """JWT token for the test user."""
    return create_access_token({"sub": str(test_user.id)})


@pytest.fixture(scope="function")
def auth_headers(auth_token):
    """Authorization headers with Bearer token."""
    return {"Authorization": f"Bearer {auth_token}"}
