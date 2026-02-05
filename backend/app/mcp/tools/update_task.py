"""
MCP Tool: Update Task

This tool allows the AI agent to update an existing task for a user.
"""
from typing import Dict, Any
from app.services.todo_service import update_todo, get_todo_by_id
from app.database import get_db
from app.schemas import TodoUpdate


def update_task(user_id: str, task_id: str, title: str = None, description: str = None) -> Dict[str, Any]:
    """
    Update an existing task for a user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to update
        title: New title for the task (optional)
        description: New description for the task (optional)

    Returns:
        Dictionary containing the result of the operation
    """
    try:
        # Create a database session
        db_gen = get_db()
        db = next(db_gen)

        try:
            # Prepare update data
            update_data = {}
            if title is not None:
                update_data['title'] = title
            if description is not None:
                update_data['description'] = description

            # Create TodoUpdate object with only the provided fields
            todo_update = TodoUpdate(**{k: v for k, v in update_data.items()})

            # Update the task using the existing service
            updated_todo = update_todo(db, task_id, todo_update, user_id)

            result = {
                "success": True,
                "task_id": str(updated_todo.id),
                "title": updated_todo.title,
                "description": updated_todo.description,
                "completed": updated_todo.completed,
                "message": f"Task '{updated_todo.title}' updated successfully"
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to update task: {str(e)}"
            }
        finally:
            db.close()

        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"System error occurred while updating task: {str(e)}"
        }


# Define the function schema for the AI model
UPDATE_TASK_SCHEMA = {
    "name": "update_task",
    "description": "Update an existing task for a user",
    "parameters": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "The ID of the user who owns the task"
            },
            "task_id": {
                "type": "string",
                "description": "The ID of the task to update"
            },
            "title": {
                "type": "string",
                "description": "New title for the task (optional)"
            },
            "description": {
                "type": "string",
                "description": "New description for the task (optional)"
            }
        },
        "required": ["user_id", "task_id"]
    }
}