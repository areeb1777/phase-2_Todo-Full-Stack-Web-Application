# Todo Backend API

This is the backend API for the Todo application, built with FastAPI and connected to Neon PostgreSQL.

## Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL database (Neon recommended)

### Installation

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env .env.local
# Edit .env.local and add your DATABASE_URL
```

### Running Locally

To run the backend locally:

```bash
cd backend
python run.py
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 7860 --reload
```

The API will be available at `http://localhost:7860`

### API Documentation

Interactive API documentation is available at:
- `http://localhost:7860/docs` (Swagger UI)
- `http://localhost:7860/redoc` (ReDoc)

## Deployment

### Hugging Face Spaces

To deploy on Hugging Face Spaces:

1. The backend is configured to run on port 7860
2. The entrypoint is configured in `run.py`
3. Make sure your `DATABASE_URL` is set in environment variables

### Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo
- `GET /` - Health check endpoint

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)

## Database Schema

The application uses a single `todos` table with the following columns:
- `id` - UUID (primary key)
- `title` - VARCHAR(255) (required)
- `description` - TEXT (optional)
- `completed` - BOOLEAN (default: false)
- `created_at` - TIMESTAMP WITH TIME ZONE (default: NOW())

Tables are automatically created on startup.