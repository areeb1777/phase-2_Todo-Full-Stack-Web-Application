"""
MCP Tool: Add Task

This tool allows the AI agent to add a new task to the user's todo list.
"""
from typing import Dict, Any
from app.services.todo_service import create_todo
from app.database import get_db
from app.schemas import TodoCreate


def add_task(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """
    Add a new task to the user's todo list.

    Args:
        user_id: The ID of the user to add the task for
        title: The title of the task
        description: Optional description of the task

    Returns:
        Dictionary containing the result of the operation
    """
    try:
        # Create a database session
        db_gen = get_db()
        db = next(db_gen)

        try:
            # Create the task using the existing service
            todo_data = TodoCreate(title=title, description=description)
            new_todo = create_todo(db, todo_data, user_id)

            # Convert to dict for return
            result = {
                "success": True,
                "task_id": str(new_todo.id),
                "title": new_todo.title,
                "description": new_todo.description,
                "completed": new_todo.completed,
                "message": f"Task '{new_todo.title}' added successfully"
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to add task: {str(e)}"
            }
        finally:
            db.close()

        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"System error occurred while adding task: {str(e)}"
        }


# Define the function schema for the AI model
ADD_TASK_SCHEMA = {
    "name": "add_task",
    "description": "Add a new task to the user's todo list",
    "parameters": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "The ID of the user to add the task for"
            },
            "title": {
                "type": "string",
                "description": "The title of the task to add"
            },
            "description": {
                "type": "string",
                "description": "Optional description of the task",
                "default": ""
            }
        },
        "required": ["user_id", "title"]
    }
}