"""
MCP Tool: Complete Task

This tool allows the AI agent to mark a task as completed for a user.
"""
from typing import Dict, Any
from app.services.todo_service import update_todo, get_todo_by_id
from app.database import get_db
from app.schemas import TodoUpdate


def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Mark a task as completed for a user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to mark as completed

    Returns:
        Dictionary containing the result of the operation
    """
    try:
        # Create a database session
        db_gen = get_db()
        db = next(db_gen)

        try:
            # Get the current task to check if it exists
            current_todo = get_todo_by_id(db, task_id, user_id)
            if not current_todo:
                return {
                    "success": False,
                    "error": "Task not found or not owned by user",
                    "message": "Task not found or not owned by user"
                }

            # If task is already completed, inform the user
            if current_todo.completed:
                return {
                    "success": True,
                    "task_id": str(current_todo.id),
                    "title": current_todo.title,
                    "message": f"Task '{current_todo.title}' was already completed"
                }

            # Create update data to mark as completed
            todo_update = TodoUpdate(completed=True)

            # Update the task using the existing service
            updated_todo = update_todo(db, task_id, todo_update, user_id)

            result = {
                "success": True,
                "task_id": str(updated_todo.id),
                "title": updated_todo.title,
                "completed": updated_todo.completed,
                "message": f"Task '{updated_todo.title}' marked as completed successfully"
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to complete task: {str(e)}"
            }
        finally:
            db.close()

        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"System error occurred while completing task: {str(e)}"
        }


# Define the function schema for the AI model
COMPLETE_TASK_SCHEMA = {
    "name": "complete_task",
    "description": "Mark a task as completed for a user",
    "parameters": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "The ID of the user who owns the task"
            },
            "task_id": {
                "type": "string",
                "description": "The ID of the task to mark as completed"
            }
        },
        "required": ["user_id", "task_id"]
    }
}