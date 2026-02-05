"""
AI Agent Service

This module contains the AI agent that processes user requests and coordinates
with the MCP tools to manage tasks.
"""
import json
from typing import Dict, Any, List
from app.agent.openrouter_client import openrouter_client
from app.agent.prompts import DEFAULT_SYSTEM_PROMPT
from app.mcp.tools.add_task import ADD_TASK_SCHEMA
from app.mcp.tools.list_tasks import LIST_TASKS_SCHEMA
from app.mcp.tools.update_task import UPDATE_TASK_SCHEMA
from app.mcp.tools.complete_task import COMPLETE_TASK_SCHEMA
from app.mcp.tools.delete_task import DELETE_TASK_SCHEMA


class AIAgent:
    """
    AI Agent that processes user requests and uses tools to manage tasks.
    """
    def __init__(self):
        """
        Initialize the AI Agent with tools and client.
        """
        try:
            self.client = openrouter_client
        except Exception as e:
            print(f"Warning: Could not initialize OpenRouter client: {e}")
            # Create a mock client for fallback
            from unittest.mock import MagicMock
            self.client = MagicMock()
            self.client.chat_completion = lambda *args, **kwargs: {
                "choices": [{"message": {"content": "AI functionality is temporarily unavailable. Please set up your API key to use AI features.", "role": "assistant"}}],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            }
            self.client.extract_tool_calls = lambda response: []
            self.client.format_response_text = lambda response: response.get("choices", [{}])[0].get("message", {}).get("content", "")

        self.tools = [
            ADD_TASK_SCHEMA,
            LIST_TASKS_SCHEMA,
            UPDATE_TASK_SCHEMA,
            COMPLETE_TASK_SCHEMA,
            DELETE_TASK_SCHEMA
        ]

    def process_request(self, user_message: str, conversation_history: List[Dict[str, str]] = None, user_id: str = None) -> Dict[str, Any]:
        """
        Process a user request and return the response.

        Args:
            user_message: The message from the user
            conversation_history: Previous messages in the conversation
            user_id: The ID of the user making the request

        Returns:
            Dictionary containing the agent's response and any tool calls
        """
        # Prepare messages for the AI model
        messages = []

        # Add system prompt
        messages.append({
            "role": "system",
            "content": DEFAULT_SYSTEM_PROMPT
        })

        # Add conversation history if provided (limit to last 10 messages to manage context)
        if conversation_history:
            # Limit history to prevent exceeding token limits
            limited_history = conversation_history[-10:]  # Last 10 messages
            messages.extend(limited_history)

        # Add the current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        try:
            # Check if client is available (API key is set)
            if not self.client or (hasattr(self.client, 'client') and self.client.client is None):
                # Even without API key, we should still detect and prepare tools based on the message
                # Extract potential tool calls from the user message
                user_msg_lower = user_message.lower()

                # Check if this looks like a task management command and extract tool calls
                tool_calls = self._extract_mock_tool_calls(user_msg_lower, user_id)

                # Generate appropriate response based on the detected action
                if 'add' in user_msg_lower or 'create' in user_msg_lower:
                    # Extract task title from the message
                    import re
                    task_match = re.search(r'(?:add|create)\s+(.+)', user_msg_lower)
                    task_title = task_match.group(1).strip() if task_match else "a task"

                    # Ensure we have the tool call for adding the task
                    if not tool_calls:  # Only add if not already detected by _extract_mock_tool_calls
                        # Extract task details
                        task_match = re.search(r'(?:add|create)\s+(.+)', user_msg_lower)
                        task_name = task_match.group(1).strip() if task_match else "New task"

                        arguments = f'{{"title": "{task_name}", "description": "{task_name}"}}'
                        if user_id:
                            arguments = f'{{"user_id": "{user_id}", "title": "{task_name}", "description": "{task_name}"}}'

                        tool_calls = [{
                            "id": "add_task_1",
                            "function": {
                                "name": "add_task",
                                "arguments": arguments
                            },
                            "type": "function"
                        }]

                    text_response = f"Task \"{task_title}\" has been added successfully."
                elif 'list' in user_msg_lower and ('task' in user_msg_lower or 'todo' in user_msg_lower):
                    # For list command, we should execute the list_tasks tool
                    # This will be executed by the route after the agent returns
                    if not tool_calls:  # Only add if not already detected by _extract_mock_tool_calls
                        tool_calls = [{
                            "id": f"list_tasks_{int(__import__('time').time())}",
                            "function": {
                                "name": "list_tasks",
                                "arguments": json.dumps({"user_id": user_id})
                            },
                            "type": "function"
                        }]

                    # We'll generate the response after tool execution in the route
                    text_response = "Retrieving your tasks..."  # This will be replaced by route
                elif 'complete' in user_msg_lower or 'done' in user_msg_lower:
                    text_response = "Task marked as completed."
                elif 'delete' in user_msg_lower or 'remove' in user_msg_lower:
                    text_response = "Task has been removed."
                else:
                    # No tool calls detected, return a general response
                    response = self._mock_chat_completion(messages, user_msg_lower)
                    text_response = response.get("response", "How can I assist you?")

                result = {
                    "response": text_response,
                    "tool_calls": tool_calls,  # Include the detected tool calls for the route to execute
                    "success": True
                }

                return result

            # Try calling the OpenRouter API with tools first
            try:
                response = self.client.chat_completion(
                    messages=messages,
                    tools=self.tools,
                    temperature=0.7
                )

                # Extract tool calls if any
                tool_calls = self.client.extract_tool_calls(response)

                # Format the text response
                text_response = self.client.format_response_text(response)

                # If no text response but there are tool calls, generate a default response
                if not text_response and tool_calls:
                    text_response = "Processing your request..."

                result = {
                    "response": text_response,
                    "tool_calls": tool_calls,
                    "success": True
                }

                return result
            except Exception as tool_error:
                # If tools fail, fall back to mock processing
                print(f"Warning: Tool calling failed ({tool_error}), falling back to mock processing")

                # Use the same mock logic as in the initial check
                user_msg_lower = user_message.lower()

                # Check if this looks like a task management command and extract tool calls
                tool_calls = self._extract_mock_tool_calls(user_msg_lower, user_id)

                # Generate appropriate response based on the detected action
                if 'add' in user_msg_lower or 'create' in user_msg_lower:
                    # Extract task title from the message
                    import re
                    task_match = re.search(r'(?:add|create)\s+(.+)', user_msg_lower)
                    task_title = task_match.group(1).strip() if task_match else "a task"

                    # Ensure we have the tool call for adding the task
                    if not tool_calls:  # Only add if not already detected by _extract_mock_tool_calls
                        # Extract task details
                        task_match = re.search(r'(?:add|create)\s+(.+)', user_msg_lower)
                        task_name = task_match.group(1).strip() if task_match else "New task"

                        arguments = f'{{"title": "{task_name}", "description": "{task_name}"}}'
                        if user_id:
                            arguments = f'{{"user_id": "{user_id}", "title": "{task_name}", "description": "{task_name}"}}'

                        tool_calls = [{
                            "id": "add_task_1",
                            "function": {
                                "name": "add_task",
                                "arguments": arguments
                            },
                            "type": "function"
                        }]

                    text_response = f"Task \"{task_title}\" has been added successfully."
                elif 'list' in user_msg_lower and ('task' in user_msg_lower or 'todo' in user_msg_lower):
                    # For list command, we should execute the list_tasks tool
                    # This will be executed by the route after the agent returns
                    if not tool_calls:  # Only add if not already detected by _extract_mock_tool_calls
                        tool_calls = [{
                            "id": f"list_tasks_{int(__import__('time').time())}",
                            "function": {
                                "name": "list_tasks",
                                "arguments": json.dumps({"user_id": user_id})
                            },
                            "type": "function"
                        }]

                    # We'll generate the response after tool execution in the route
                    text_response = "Retrieving your tasks..."  # This will be replaced by route
                elif 'complete' in user_msg_lower or 'done' in user_msg_lower:
                    text_response = "Task marked as completed."
                elif 'delete' in user_msg_lower or 'remove' in user_msg_lower:
                    text_response = "Task has been removed."
                else:
                    # No tool calls detected, return a general response
                    response = self._mock_chat_completion(messages, user_msg_lower)
                    text_response = response.get("response", "How can I assist you?")

                result = {
                    "response": text_response,
                    "tool_calls": tool_calls,  # Include the detected tool calls for the route to execute
                    "success": True
                }

                return result

        except Exception as e:
            return {
                "response": "Sorry, I encountered an error while processing your request. Please try again.",
                "tool_calls": [],
                "success": False,
                "error": str(e)
            }

    def _mock_chat_completion(self, messages: List[Dict[str, str]], user_message_lower: str) -> Dict[str, Any]:
        """
        Mock chat completion for when API key is not available.
        """
        # Simple rule-based responses for common commands
        if 'list' in user_message_lower and ('task' in user_message_lower or 'todo' in user_message_lower):
            return {
                "response": "Here are your tasks:\n- Complete project proposal\n- Schedule team meeting\n- Review documentation"
            }
        elif 'add' in user_message_lower or 'create' in user_message_lower:
            return {
                "response": "I've added your task to the list. It will be saved to your todo list."
            }
        elif 'complete' in user_message_lower or 'done' in user_message_lower:
            return {
                "response": "I've marked that task as completed."
            }
        elif 'delete' in user_message_lower or 'remove' in user_message_lower:
            return {
                "response": "I've removed that task from your list."
            }
        else:
            return {
                "response": "I can help you manage your tasks. Try commands like 'list tasks', 'add [task name]', 'complete task [number]', or 'delete task [number]'."
            }

    def _extract_mock_tool_calls(self, user_message_lower: str, user_id: str = None) -> List[Dict[str, Any]]:
        """
        Extract mock tool calls based on user message.
        """
        tool_calls = []

        if 'list' in user_message_lower and ('task' in user_message_lower or 'todo' in user_message_lower):
            arguments = "{}"
            if user_id:
                arguments = f'{{"user_id": "{user_id}"}}'

            tool_calls.append({
                "id": "list_tasks_1",
                "function": {
                    "name": "list_tasks",
                    "arguments": arguments
                },
                "type": "function"
            })
        elif 'add' in user_message_lower or 'create' in user_message_lower:
            # Extract task from message
            import re
            task_match = re.search(r'(?:add|create)\s+(.+)', user_message_lower)
            task_name = task_match.group(1).strip() if task_match else "New task"

            arguments = f'{{"title": "{task_name}", "description": "{task_name}"}}'
            if user_id:
                arguments = f'{{"user_id": "{user_id}", "title": "{task_name}", "description": "{task_name}"}}'

            tool_calls.append({
                "id": "add_task_1",
                "function": {
                    "name": "add_task",
                    "arguments": arguments
                },
                "type": "function"
            })
        elif 'complete' in user_message_lower or ('done' in user_message_lower and 'task' in user_message_lower):
            # Need to find the task ID based on the task name mentioned in the message
            task_id = "1"  # Default fallback

            # Extract task name from message
            import re
            task_match = re.search(r'(?:complete|done|mark as done).*?(?:task)?\s*(.+)', user_message_lower)
            if not task_match:
                task_match = re.search(r'(?:task)?\s*(.+?)\s*(?:complete|done)', user_message_lower)

            if task_match and user_id:
                task_name = task_match.group(1).strip()

                # Import and use the list_tasks function to find the matching task
                try:
                    from app.mcp.tools.list_tasks import list_tasks
                    tasks_result = list_tasks(user_id=user_id)

                    if tasks_result.get("success"):
                        tasks = tasks_result.get("tasks", [])
                        # Find the task that matches the name (case-insensitive, partial match)
                        for task in tasks:
                            if task_name.lower() in task.get("title", "").lower():
                                task_id = task["id"]
                                break

                except Exception as e:
                    print(f"Error finding task ID for completion: {e}")

            arguments = f'{{"user_id": "{user_id}", "task_id": "{task_id}"}}'

            tool_calls.append({
                "id": f"complete_task_{task_id[:8]}",
                "function": {
                    "name": "complete_task",
                    "arguments": arguments
                },
                "type": "function"
            })
        elif 'delete' in user_message_lower or 'remove' in user_message_lower:
            # Need to find the task ID based on the task name mentioned in the message
            task_id = "1"  # Default fallback

            # Extract task name from message
            import re
            task_match = re.search(r'(?:delete|remove).*?(?:task)?\s*(.+)', user_message_lower)
            if not task_match:
                task_match = re.search(r'(?:task)?\s*(.+?)\s*(?:delete|remove)', user_message_lower)

            if task_match and user_id:
                task_name = task_match.group(1).strip()

                # Import and use the list_tasks function to find the matching task
                try:
                    from app.mcp.tools.list_tasks import list_tasks
                    tasks_result = list_tasks(user_id=user_id)

                    if tasks_result.get("success"):
                        tasks = tasks_result.get("tasks", [])
                        # Find the task that matches the name (case-insensitive, partial match)
                        for task in tasks:
                            if task_name.lower() in task.get("title", "").lower():
                                task_id = task["id"]
                                break

                except Exception as e:
                    print(f"Error finding task ID for deletion: {e}")

            arguments = f'{{"user_id": "{user_id}", "task_id": "{task_id}"}}'

            tool_calls.append({
                "id": f"delete_task_{task_id[:8]}",
                "function": {
                    "name": "delete_task",
                    "arguments": arguments
                },
                "type": "function"
            })

        return tool_calls

    def execute_tool_call(self, tool_call: Dict[str, Any], user_id: str = None) -> Dict[str, Any]:
        """
        Execute a tool call and return the result.

        Args:
            tool_call: The tool call to execute
            user_id: The user ID for the tool call (optional, will be added to arguments if missing)

        Returns:
            Result of the tool call execution
        """
        try:
            function_name = tool_call.get("function", {}).get("name")
            arguments_str = tool_call.get("function", {}).get("arguments")

            if not arguments_str:
                return {
                    "error": "No arguments provided for tool call",
                    "result": None
                }

            # Parse the arguments
            try:
                arguments = json.loads(arguments_str)
            except json.JSONDecodeError:
                return {
                    "error": f"Invalid JSON arguments: {arguments_str}",
                    "result": None
                }

            # Ensure user_id is in arguments if needed and not already present
            if user_id and 'user_id' not in arguments:
                arguments['user_id'] = user_id

            # Execute the appropriate tool based on the function name
            if function_name == "add_task":
                from app.mcp.tools.add_task import add_task
                result = add_task(**arguments)
            elif function_name == "list_tasks":
                from app.mcp.tools.list_tasks import list_tasks
                result = list_tasks(**arguments)
            elif function_name == "update_task":
                from app.mcp.tools.update_task import update_task
                result = update_task(**arguments)
            elif function_name == "complete_task":
                from app.mcp.tools.complete_task import complete_task
                result = complete_task(**arguments)
            elif function_name == "delete_task":
                from app.mcp.tools.delete_task import delete_task
                result = delete_task(**arguments)
            else:
                return {
                    "error": f"Unknown function: {function_name}",
                    "result": None
                }

            return {
                "result": result,
                "error": None
            }

        except Exception as e:
            return {
                "error": f"Error executing tool call {tool_call.get('function', {}).get('name', 'unknown')}: {str(e)}",
                "result": None
            }


# Global instance of the agent
ai_agent = AIAgent()