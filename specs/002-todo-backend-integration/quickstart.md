# Quickstart Guide: Todo App Backend Integration

## Overview
This guide provides step-by-step instructions to set up, develop, and deploy the FastAPI backend for the Todo application with Neon PostgreSQL database.

## Prerequisites

### System Requirements
- Python 3.10 or higher
- pip package manager
- Git for version control
- Access to Neon PostgreSQL database (connection URL will be provided)

### Development Tools
- Virtual environment manager (venv or virtualenv)
- Text editor or IDE (VS Code, PyCharm, etc.)
- Terminal/command line access

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
git clone [repository-url]
cd [project-root-directory]
```

### 2. Create Backend Directory Structure
```bash
mkdir -p backend/app/backend/routes
```

### 3. Set Up Python Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install Dependencies
Create `requirements.txt`:
```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.36
asyncpg==0.30.0
psycopg2-binary==2.9.9
pydantic==2.9.2
pydantic-settings==2.6.0
uuid7==0.1.0
python-dotenv==1.0.1
pytest==8.3.3
httpx==0.27.2
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

### 5. Create Environment Configuration
Create `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```
*Note: The actual DATABASE_URL will be provided by the user*

## Backend Application Structure

### File Organization
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # Database engine and session
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic schemas
│   └── routes/
│       └── todos.py            # Todo CRUD routes
├── requirements.txt
├── .env                        # Database connection
├── .gitignore
└── run.py                      # Development server runner
```

### 6. Create Backend Files

**Create `app/__init__.py`:**
```python
"""Todo App Backend Package"""
```

**Create `app/database.py`:**
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "__TO_BE_PROVIDED_BY_USER__")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Create `app/models.py`:**
```python
from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**Create `app/schemas.py`:**
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: UUID
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
```

**Create `app/routes/todos.py`:**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("/", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    todos = db.query(Todo).order_by(desc(Todo.created_at)).all()
    return todos

@router.post("/", response_model=TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.put("/{id}", response_model=TodoResponse)
def update_todo(id: str, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/{id}", status_code=204)
def delete_todo(id: str, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return
```

**Create `app/main.py`:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import todos
from app.database import engine, Base
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="API for managing todo items in the Todo application",
    version="1.0.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Create `run.py` (for development):**
```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

**Create `.gitignore`:**
```
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git/
.mypy_cache/
.pytest_cache/
.hypothesis/
.DS_Store
.env
.env.local
.env.dev
*.swp
*.swo
*~
```

## Running the Application

### 7. Start the Development Server
```bash
cd backend
source venv/bin/activate  # Activate virtual environment if not already activated
python run.py
```

Or using uvicorn directly:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 8. API Documentation
- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

## Testing the API

### 9. Run Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

### 10. Manual Testing with curl
```bash
# Create a new todo
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo", "description": "This is a test"}'

# Get all todos
curl http://localhost:8000/todos

# Update a todo
curl -X PUT http://localhost:8000/todos/{todo-id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:8000/todos/{todo-id}
```

## Frontend Integration

### 11. Update Frontend to Use Backend API
Replace the existing in-memory state management in the frontend with API calls to the backend:

```javascript
// Example API service for frontend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const todoApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/todos`);
    return response.json();
  },

  async create(todoData) {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    return response.json();
  },

  async update(id, todoData) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    return response.json();
  },

  async delete(id) {
    await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
  }
};
```

## Deployment

### 12. Production Deployment
1. Update environment variables for production
2. Set up a production-ready ASGI server (Gunicorn + Uvicorn)
3. Configure reverse proxy (Nginx)
4. Set up process manager (Supervisor)
5. Configure SSL certificates

### 13. Environment-Specific Configuration
For different environments, set appropriate environment variables:
- Development: `DATABASE_URL=postgresql://localhost/todo_dev`
- Staging: `DATABASE_URL=postgresql://staging-db-url`
- Production: `DATABASE_URL=postgresql://production-db-url`

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Verify DATABASE_URL in .env file
2. **Port Already in Use**: Change port in run.py or kill existing process
3. **Missing Dependencies**: Run `pip install -r requirements.txt` again
4. **Migration Issues**: Ensure database tables are created properly

### Health Checks
- API health: `GET /` should return status 200
- Database connectivity: Check if all endpoints return proper responses
- CORS configuration: Verify frontend can make requests to backend

## Next Steps
1. Integrate with the existing Next.js frontend
2. Add authentication when needed
3. Implement error handling and logging
4. Add monitoring and metrics
5. Set up automated testing pipeline