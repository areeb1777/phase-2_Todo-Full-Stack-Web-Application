"""
MCP Tool: Delete Task

This tool allows the AI agent to delete a task for a user.
"""
from typing import Dict, Any
from app.services.todo_service import delete_todo, get_todo_by_id
from app.database import get_db


def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Delete a task for a user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to delete

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

            # Delete the task using the existing service
            success = delete_todo(db, task_id, user_id)

            if success:
                result = {
                    "success": True,
                    "task_id": task_id,
                    "message": f"Task '{current_todo.title}' deleted successfully"
                }
            else:
                result = {
                    "success": False,
                    "error": "Failed to delete task",
                    "message": "Failed to delete task"
                }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to delete task: {str(e)}"
            }
        finally:
            db.close()

        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"System error occurred while deleting task: {str(e)}"
        }


# Define the function schema for the AI model
DELETE_TASK_SCHEMA = {
    "name": "delete_task",
    "description": "Delete a task for a user",
    "parameters": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "The ID of the user who owns the task"
            },
            "task_id": {
                "type": "string",
                "description": "The ID of the task to delete"
            }
        },
        "required": ["user_id", "task_id"]
    }
}