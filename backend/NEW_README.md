# Todo API for Hugging Face Space with AI Chatbot

This is a FastAPI-based Todo application backend deployed on Hugging Face Spaces with integrated AI chatbot functionality.

## Features
- User authentication and registration
- Todo management (create, read, update, delete)
- Profile management
- Secure JWT-based authentication
- AI-powered chatbot for task management
- Natural language processing for English and Roman Urdu
- Conversation persistence
- MCP tools for task operations

## Endpoints
- `/` - Root endpoint
- `/health` - Health check
- `/todos` - Todo management endpoints
- `/auth` - Authentication endpoints
- `/profile` - Profile management endpoints
- `/chat/{user_id}` - AI chatbot endpoints for task management

## AI Chatbot Endpoints

- `POST /chat/{user_id}` - Process chat messages and return AI responses
- `GET /chat/{user_id}/conversations` - Get user's conversations
- `GET /chat/{user_id}/conversations/{conversation_id}/messages` - Get messages in a conversation

## Environment Variables for Chatbot

- `OPENAI_BASE_URL` - Base URL for OpenRouter API (default: https://openrouter.ai/api/v1)
- `OPENAI_API_KEY` - API key for OpenRouter
- `MODEL` - Model to use (default: mistralai/mistral-7b-instruct)

## Architecture

The AI chatbot uses:
- FastAPI for the web framework
- OpenRouter API for AI processing
- MCP tools to interface with existing todo services
- PostgreSQL/SQLite for conversation persistence

## Tech Stack
- FastAPI
- SQLAlchemy
- PostgreSQL (via Neon) / SQLite for development
- JWT Authentication
- Bcrypt for password hashing
- OpenAI-compatible client for OpenRouter integration

## Deployment
This application is designed to run on Hugging Face Spaces with the following configuration:
- Python 3.12
- uvicorn ASGI server
- Port 7860