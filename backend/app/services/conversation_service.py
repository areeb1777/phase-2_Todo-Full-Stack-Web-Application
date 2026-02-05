"""
Conversation Service Module

This module provides service functions for conversation operations that can be used by
the chat endpoint and other parts of the application.
"""
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from app.models import Conversation, Message
from app.schemas import ConversationCreate, MessageCreate
from uuid import UUID
import logging

logger = logging.getLogger(__name__)


def create_conversation(db: Session, user_id: str) -> Conversation:
    """
    Create a new conversation for a user.

    Args:
        db: Database session
        user_id: ID of the user to create the conversation for

    Returns:
        Created Conversation object
    """
    try:
        # Validate UUID format before creating
        user_uuid = UUID(user_id)
        db_conversation = Conversation(user_id=user_uuid)
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        return db_conversation
    except ValueError as ve:
        logger.error(f"Invalid UUID format in create_conversation: {ve}")
        db.rollback()
        raise ValueError(f"Invalid user ID format: {user_id}")
    except SQLAlchemyError as e:
        logger.error(f"Database error in create_conversation: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in create_conversation: {e}")
        db.rollback()
        raise


def get_conversation_by_id(db: Session, conversation_id: str, user_id: str) -> Conversation:
    """
    Get a specific conversation by ID for a user.

    Args:
        db: Database session
        conversation_id: ID of the conversation to retrieve
        user_id: ID of the user who owns the conversation

    Returns:
        Conversation object if found, None otherwise
    """
    try:
        # Validate UUID formats before querying
        conv_uuid = UUID(conversation_id)
        user_uuid = UUID(user_id)

        conversation = db.query(Conversation).filter(
            Conversation.id == conv_uuid,
            Conversation.user_id == user_uuid
        ).first()
        return conversation
    except ValueError as ve:
        logger.error(f"Invalid UUID format in get_conversation_by_id: {ve}")
        raise ValueError(f"Invalid conversation ID or user ID format")
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_conversation_by_id: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_conversation_by_id: {e}")
        raise


def get_user_conversations(db: Session, user_id: str) -> list:
    """
    Get all conversations for a specific user.

    Args:
        db: Database session
        user_id: ID of the user whose conversations to retrieve

    Returns:
        List of Conversation objects
    """
    try:
        # Validate UUID format before querying
        user_uuid = UUID(user_id)

        conversations = db.query(Conversation).filter(
            Conversation.user_id == user_uuid
        ).order_by(Conversation.created_at.desc()).all()
        return conversations
    except ValueError as ve:
        logger.error(f"Invalid UUID format in get_user_conversations: {ve}")
        raise ValueError(f"Invalid user ID format: {user_id}")
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_user_conversations: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_user_conversations: {e}")
        raise


def create_message(db: Session, conversation_id: str, role: str, content: str) -> Message:
    """
    Create a new message in a conversation.

    Args:
        db: Database session
        conversation_id: ID of the conversation to add the message to
        role: Role of the message sender ('user' or 'assistant')
        content: Content of the message

    Returns:
        Created Message object
    """
    try:
        # Validate UUID format before creating
        conv_uuid = UUID(conversation_id)

        db_message = Message(
            conversation_id=conv_uuid,
            role=role,
            content=content
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message
    except ValueError as ve:
        logger.error(f"Invalid UUID format in create_message: {ve}")
        db.rollback()
        raise ValueError(f"Invalid conversation ID format: {conversation_id}")
    except SQLAlchemyError as e:
        logger.error(f"Database error in create_message: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in create_message: {e}")
        db.rollback()
        raise


def get_conversation_messages(db: Session, conversation_id: str) -> list:
    """
    Get all messages in a specific conversation.

    Args:
        db: Database session
        conversation_id: ID of the conversation whose messages to retrieve

    Returns:
        List of Message objects
    """
    try:
        # Validate UUID format before querying
        conv_uuid = UUID(conversation_id)

        messages = db.query(Message).filter(
            Message.conversation_id == conv_uuid
        ).order_by(Message.created_at.asc()).all()
        return messages
    except ValueError as ve:
        logger.error(f"Invalid UUID format in get_conversation_messages: {ve}")
        raise ValueError(f"Invalid conversation ID format: {conversation_id}")
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_conversation_messages: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_conversation_messages: {e}")
        raise


def update_conversation_timestamp(db: Session, conversation_id: str) -> bool:
    """
    Update the updated_at timestamp for a conversation.

    Args:
        db: Database session
        conversation_id: ID of the conversation to update

    Returns:
        True if update was successful, False otherwise
    """
    try:
        from sqlalchemy import text

        # Directly update the timestamp using raw SQL to trigger the onupdate
        result = db.execute(
            text("UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = :id"),
            {"id": str(UUID(conversation_id))}
        )

        db.commit()

        return result.rowcount > 0
    except SQLAlchemyError as e:
        logger.error(f"Database error in update_conversation_timestamp: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in update_conversation_timestamp: {e}")
        db.rollback()
        raise