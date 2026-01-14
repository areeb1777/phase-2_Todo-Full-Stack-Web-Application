from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid
from app.database import Base
from sqlalchemy.types import TypeDecorator
from sqlalchemy.orm import relationship
import sqlalchemy

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(32) storing as string.
    """
    impl = sqlalchemy.CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(sqlalchemy.CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                # hexstring
                return "%.32x" % value.int

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value

class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    profile_picture = Column(String(500), nullable=True, default=None)  # URL to profile picture
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Todo(Base):
    __tablename__ = "todos"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)

    # Relationship to User
    user = relationship("User", back_populates="todos")


# Add relationship to User model
User.todos = relationship("Todo", back_populates="user", cascade="all, delete-orphan")