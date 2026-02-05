# Quickstart Guide: AI-Powered Todo Chatbot

## Prerequisites

- Python 3.12+
- Node.js 18+ (for frontend)
- PostgreSQL database (or Neon for cloud)
- OpenRouter API key

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Set up backend environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   OPENAI_API_KEY=your_openrouter_api_key_here
   MODEL=mistralai/mistral-7b-instruct
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

## Database Setup

1. **Apply database migrations** (after adding the new models):
   ```bash
   cd backend
   python -m alembic upgrade head
   ```

## Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   uvicorn app:app --reload --port 8000
   ```

2. **Start the frontend server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

### Chat Endpoint
```
POST /api/{user_id}/chat
```

**Request Body**:
```json
{
  "conversation_id": 12345,
  "message": "add buy groceries tomorrow"
}
```

**Response**:
```json
{
  "conversation_id": 12345,
  "response": "I've added 'buy groceries' to your tasks for tomorrow.",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {
        "user_id": 1,
        "title": "buy groceries",
        "description": "",
        "due_date": "tomorrow"
      }
    }
  ]
}
```

## Development Workflow

1. **Run tests**:
   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd frontend
   npm test
   ```

2. **Add new MCP tools**:
   - Create new files in `backend/mcp/tools/`
   - Follow the existing pattern for tool implementations
   - Register the tools with the agent

3. **Update system prompts**:
   - Modify prompts in `backend/agent/prompts.py`
   - Ensure prompts support both English and Roman Urdu

## Troubleshooting

- **OpenRouter API errors**: Verify your API key and check the OpenRouter dashboard for rate limits
- **Database connection issues**: Ensure your PostgreSQL server is running and credentials are correct
- **Authentication problems**: Check that JWT tokens are properly configured and passed in requests