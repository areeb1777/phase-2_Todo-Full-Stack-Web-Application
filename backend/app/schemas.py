from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)

class UserCreate(UserBase):
    password: str = Field(..., min_length=1)

class UserUpdate(BaseModel):
    email: Optional[str] = Field(None, min_length=1, max_length=255)

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

# Todo Schemas
class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: UUID
    completed: bool
    created_at: datetime
    user_id: UUID  # Include user_id to show which user owns the task

    class Config:
        from_attributes = True


# Conversation Schemas
class ConversationBase(BaseModel):
    user_id: UUID


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    pass


class ConversationResponse(ConversationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Message Schemas
class MessageBase(BaseModel):
    conversation_id: UUID
    role: str = Field(..., pattern=r"^(user|assistant)$")  # 'user' or 'assistant'
    content: str = Field(..., max_length=2000)


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    content: Optional[str] = Field(None, max_length=2000)


class MessageResponse(MessageBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True