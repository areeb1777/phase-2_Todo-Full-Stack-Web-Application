"""
MCP Tool: List Tasks

This tool allows the AI agent to list tasks for a user.
"""
from typing import Dict, Any, List
from app.services.todo_service import get_user_todos
from app.database import get_db


def list_tasks(user_id: str, status: str = "all") -> Dict[str, Any]:
    """
    List tasks for a user based on status.

    Args:
        user_id: The ID of the user whose tasks to list
        status: Filter tasks by status ('all', 'pending', 'completed')

    Returns:
        Dictionary containing the list of tasks
    """
    try:
        # Create a database session
        db_gen = get_db()
        db = next(db_gen)

        try:
            # Get tasks using the existing service
            todos = get_user_todos(db, user_id)

            # Filter by status if specified
            if status == "pending":
                filtered_todos = [todo for todo in todos if not todo.completed]
            elif status == "completed":
                filtered_todos = [todo for todo in todos if todo.completed]
            else:  # all
                filtered_todos = todos

            # Convert to list of dictionaries
            tasks = []
            for todo in filtered_todos:
                task_dict = {
                    "id": str(todo.id),
                    "title": todo.title,
                    "description": todo.description,
                    "completed": todo.completed,
                    "created_at": todo.created_at.isoformat() if todo.created_at else None
                }
                tasks.append(task_dict)

            result = {
                "success": True,
                "tasks": tasks,
                "count": len(tasks),
                "status_filter": status,
                "message": f"Retrieved {len(tasks)} tasks with status '{status}'"
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
                "message": f"Failed to list tasks: {str(e)}"
            }
        finally:
            db.close()

        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"System error occurred while listing tasks: {str(e)}"
        }


# Define the function schema for the AI model
LIST_TASKS_SCHEMA = {
    "name": "list_tasks",
    "description": "List tasks for a user, optionally filtered by status",
    "parameters": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "The ID of the user whose tasks to list"
            },
            "status": {
                "type": "string",
                "description": "Filter tasks by status",
                "enum": ["all", "pending", "completed"],
                "default": "all"
            }
        },
        "required": ["user_id"]
    }
}