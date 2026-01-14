from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from app.database import get_db
from app.models import Todo, User
from app.schemas import TodoCreate, TodoUpdate, TodoResponse
from app.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("/", response_model=List[TodoResponse])
def get_todos(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Filter todos by the current user's ID
        todos = db.query(Todo).filter(Todo.user_id == current_user.id).order_by(desc(Todo.created_at)).all()
        return todos
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_todos: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching todos")
    except Exception as e:
        logger.error(f"Unexpected error in get_todos: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.post("/", response_model=TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Create a new todo associated with the current user
        db_todo = Todo(**todo.dict(), user_id=current_user.id)
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except SQLAlchemyError as e:
        logger.error(f"Database error in create_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail=f"Database error occurred while creating todo: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in create_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.put("/{id}", response_model=TodoResponse)
def update_todo(id: str, todo_update: TodoUpdate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Find the todo and ensure it belongs to the current user
        db_todo = db.query(Todo).filter(Todo.id == id, Todo.user_id == current_user.id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found or not owned by current user")

        update_data = todo_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)

        db.commit()
        db.refresh(db_todo)
        return db_todo
    except SQLAlchemyError as e:
        logger.error(f"Database error in update_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail=f"Database error occurred while updating todo: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in update_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.delete("/{id}", status_code=204)
def delete_todo(id: str, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Find the todo and ensure it belongs to the current user
        db_todo = db.query(Todo).filter(Todo.id == id, Todo.user_id == current_user.id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found or not owned by current user")

        db.delete(db_todo)
        db.commit()
        return
    except SQLAlchemyError as e:
        logger.error(f"Database error in delete_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail=f"Database error occurred while deleting todo: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in delete_todo: {e}")
        db.rollback()  # Rollback the transaction on error
        raise HTTPException(status_code=500, detail="An unexpected error occurred")