"""
OpenRouter Client

This module provides a client for interacting with the OpenRouter API
to handle AI-powered chat functionality.
"""
import os
from typing import Dict, List, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class OpenRouterClient:
    """
    Client for interacting with OpenRouter API
    """
    def __init__(self):
        """
        Initialize the OpenRouter client with API configuration.
        """
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("MODEL", "mistralai/mistral-7b-instruct")

        if not self.api_key:
            print("WARNING: OPENAI_API_KEY not found. AI functionality will be limited.")
            self.client = None
        else:
            self.client = OpenAI(base_url=self.base_url, api_key=self.api_key)

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Make a chat completion request to the OpenRouter API.

        Args:
            messages: List of messages in the conversation
            tools: Optional list of tools that the model can use
            temperature: Controls randomness in the response (0.0 to 1.0)

        Returns:
            Response from the OpenRouter API
        """
        try:
            if not self.client:
                # Return a simulated response when API key is not available
                return {
                    "choices": [{
                        "message": {
                            "content": "AI functionality is currently unavailable. Please set up your API key to use AI features.",
                            "role": "assistant"
                        }
                    }],
                    "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
                }

            params = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature
            }

            # Add tools if provided
            if tools:
                params["tools"] = tools

            response = self.client.chat.completions.create(**params)
            return response.model_dump()
        except Exception as e:
            raise Exception(f"Error calling OpenRouter API: {str(e)}")

    def extract_tool_calls(self, response: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Extract tool calls from the API response.

        Args:
            response: Response from the OpenRouter API

        Returns:
            List of tool calls extracted from the response
        """
        tool_calls = []

        if "choices" in response and len(response["choices"]) > 0:
            choice = response["choices"][0]
            if "message" in choice and choice["message"] is not None:
                message = choice["message"]

                if hasattr(message, 'tool_calls') and message.tool_calls:
                    for tool_call in message.tool_calls:
                        tool_calls.append({
                            "id": tool_call.id,
                            "function": {
                                "name": tool_call.function.name,
                                "arguments": tool_call.function.arguments
                            },
                            "type": tool_call.type
                        })
                elif "function_call" in message and message.function_call:
                    # Legacy function call format
                    tool_calls.append({
                        "id": "legacy_call",
                        "function": {
                            "name": message.function_call.name,
                            "arguments": message.function_call.arguments
                        },
                        "type": "function"
                    })

        return tool_calls

    def format_response_text(self, response: Dict[str, Any]) -> str:
        """
        Extract the text response from the API response.

        Args:
            response: Response from the OpenRouter API

        Returns:
            Formatted text response
        """
        if (
            "choices" in response
            and len(response["choices"]) > 0
            and "message" in response["choices"][0]
        ):
            message = response["choices"][0]["message"]
            if "content" in message and message["content"]:
                return message["content"].strip()

        return ""


# Global instance of the client
openrouter_client = OpenRouterClient()