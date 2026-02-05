"""
Chat Route

This module defines the API endpoints for the AI chatbot functionality.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Conversation, Message
from app.schemas import ConversationResponse, MessageResponse
from app.agent.agent import ai_agent
from app.services.todo_service import get_user_todos
from app.services.conversation_service import (
    create_conversation, get_conversation_by_id, get_user_conversations,
    create_message, get_conversation_messages, update_conversation_timestamp
)
from uuid import UUID
from pydantic import BaseModel
import json

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

@router.post("/{user_id}")
def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Handle chat requests from users and process them with the AI agent.

    Args:
        user_id: The ID of the user making the request
        request: ChatRequest containing message and optional conversation_id
        db: Database session

    Returns:
        Dictionary containing response and tool calls
    """
    try:
        # Verify the user exists
        user = db.query(User).filter(User.id == UUID(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Extract message and conversation_id from request
        message = request.message
        conversation_id = request.conversation_id

        # Get or create conversation
        if conversation_id:
            # Try to get existing conversation
            conversation = get_conversation_by_id(db, conversation_id, user_id)
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            # Create new conversation
            conversation = create_conversation(db, user_id)
            conversation_id = str(conversation.id)

        # Get conversation history
        conversation_history = get_conversation_messages(db, conversation_id)

        # Format conversation history for the AI agent
        formatted_history = []
        for msg in conversation_history:
            formatted_history.append({
                "role": msg.role,
                "content": msg.content
            })

        # Store user message in database
        user_message = create_message(db, conversation_id, "user", message)

        # Process the request with the AI agent
        result = ai_agent.process_request(message, formatted_history, user_id)

        # Execute any tool calls and potentially update the response
        final_response = result.get("response", "")

        if result.get("tool_calls"):
            for tool_call in result["tool_calls"]:
                tool_result = ai_agent.execute_tool_call(tool_call, user_id)

                # Log tool execution result (for debugging)
                print(f"Tool call result: {tool_result}")

                # If this is a list_tasks call, update the response with actual tasks
                if tool_call.get("function", {}).get("name") == "list_tasks":
                    if tool_result.get("result", {}).get("success"):
                        tasks = tool_result["result"].get("tasks", [])
                        if tasks:
                            task_list = "\n".join([f"- {task['title']}" for task in tasks])
                            final_response = f"Here are your tasks:\n{task_list}"
                        else:
                            final_response = "You currently don't have any tasks. Would you like to add a new task?"
                    else:
                        final_response = "Sorry, I couldn't retrieve your tasks. Please try again."

                # If this is an add_task call, update the response
                elif tool_call.get("function", {}).get("name") == "add_task":
                    if tool_result.get("result", {}).get("success"):
                        task_title = tool_result["result"].get("title", "the task")
                        final_response = f"Task \"{task_title}\" has been added successfully."
                    else:
                        final_response = "Sorry, I couldn't add the task. Please try again."

                # If this is a complete_task call, update the response
                elif tool_call.get("function", {}).get("name") == "complete_task":
                    if tool_result.get("result", {}).get("success"):
                        final_response = "Task has been marked as completed."
                    else:
                        final_response = "Sorry, I couldn't complete the task. Please try again."

                # If this is a delete_task call, update the response
                elif tool_call.get("function", {}).get("name") == "delete_task":
                    if tool_result.get("result", {}).get("success"):
                        final_response = "Task has been deleted."
                    else:
                        final_response = "Sorry, I couldn't delete the task. Please try again."

        # Store assistant response in database
        assistant_message = create_message(db, conversation_id, "assistant", final_response)

        # Update conversation timestamp
        update_conversation_timestamp(db, conversation_id)

        # Return response with conversation ID (use final_response if it was updated by tool execution)
        response = {
            "conversation_id": str(conversation.id),
            "response": final_response,
            "tool_calls": result.get("tool_calls", []),
            "success": result.get("success", True)
        }

        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/{user_id}/conversations")
def get_user_conversations_route(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all conversations for a user.

    Args:
        user_id: The ID of the user
        db: Database session

    Returns:
        List of user's conversations
    """
    try:
        # Verify the user exists
        user = db.query(User).filter(User.id == UUID(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get user's conversations using service
        conversations = get_user_conversations(db, user_id)

        # Convert to response format
        result = []
        for conv in conversations:
            conv_data = {
                "id": str(conv.id),
                "user_id": str(conv.user_id),
                "created_at": conv.created_at.isoformat(),
                "updated_at": conv.updated_at.isoformat() if conv.updated_at else None
            }
            result.append(conv_data)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/{user_id}/conversations/{conversation_id}/messages")
def get_conversation_messages_route(
    user_id: str,
    conversation_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all messages in a specific conversation.

    Args:
        user_id: The ID of the user
        conversation_id: The ID of the conversation
        db: Database session

    Returns:
        List of messages in the conversation
    """
    try:
        # Verify the user exists
        user = db.query(User).filter(User.id == UUID(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify conversation belongs to user
        conversation = db.query(Conversation).filter(
            Conversation.id == UUID(conversation_id),
            Conversation.user_id == UUID(user_id)
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Get messages in the conversation
        messages = db.query(Message).filter(
            Message.conversation_id == UUID(conversation_id)
        ).order_by(Message.created_at.asc()).all()

        # Convert to response format
        result = []
        for msg in messages:
            msg_data = {
                "id": str(msg.id),
                "conversation_id": str(msg.conversation_id),
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            result.append(msg_data)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")