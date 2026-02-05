"""
Todo Service Module

This module provides service functions for todo operations that can be used by MCP tools
and other parts of the application.
"""
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate
import logging

logger = logging.getLogger(__name__)


def create_todo(db: Session, todo: TodoCreate, user_id: str) -> Todo:
    """
    Create a new todo item for a user.

    Args:
        db: Database session
        todo: TodoCreate schema with title and description
        user_id: ID of the user to create the todo for

    Returns:
        Created Todo object
    """
    try:
        db_todo = Todo(**todo.dict(), user_id=user_id)
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except SQLAlchemyError as e:
        logger.error(f"Database error in create_todo: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in create_todo: {e}")
        db.rollback()
        raise


def get_user_todos(db: Session, user_id: str) -> list:
    """
    Get all todos for a specific user.

    Args:
        db: Database session
        user_id: ID of the user whose todos to retrieve

    Returns:
        List of Todo objects
    """
    try:
        from sqlalchemy import desc
        todos = db.query(Todo).filter(Todo.user_id == user_id).order_by(desc(Todo.created_at)).all()
        return todos
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_user_todos: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_user_todos: {e}")
        raise


def get_todo_by_id(db: Session, todo_id: str, user_id: str) -> Todo:
    """
    Get a specific todo by ID for a user.

    Args:
        db: Database session
        todo_id: ID of the todo to retrieve
        user_id: ID of the user who owns the todo

    Returns:
        Todo object if found, None otherwise
    """
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        return todo
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_todo_by_id: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_todo_by_id: {e}")
        raise


def update_todo(db: Session, todo_id: str, todo_update: TodoUpdate, user_id: str) -> Todo:
    """
    Update a specific todo for a user.

    Args:
        db: Database session
        todo_id: ID of the todo to update
        todo_update: TodoUpdate schema with fields to update
        user_id: ID of the user who owns the todo

    Returns:
        Updated Todo object
    """
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if not db_todo:
            raise ValueError("Todo not found or not owned by current user")

        update_data = todo_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)

        db.commit()
        db.refresh(db_todo)
        return db_todo
    except SQLAlchemyError as e:
        logger.error(f"Database error in update_todo: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in update_todo: {e}")
        db.rollback()
        raise


def delete_todo(db: Session, todo_id: str, user_id: str) -> bool:
    """
    Delete a specific todo for a user.

    Args:
        db: Database session
        todo_id: ID of the todo to delete
        user_id: ID of the user who owns the todo

    Returns:
        True if deletion was successful, False otherwise
    """
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if not db_todo:
            raise ValueError("Todo not found or not owned by current user")

        db.delete(db_todo)
        db.commit()
        return True
    except SQLAlchemyError as e:
        logger.error(f"Database error in delete_todo: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error in delete_todo: {e}")
        db.rollback()
        raise