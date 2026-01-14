# Quickstart Guide: Authentication and Multi-User Support

## Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (or use SQLite for development)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env to configure your DATABASE_URL
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local to configure NEXT_PUBLIC_API_URL
```

### 4. Database Setup
The application will automatically create the required tables on startup. The reset_table.py script can be used to reset the database:

```bash
cd backend
source venv/bin/activate
python reset_table.py
```

### 5. Start the Applications

#### Backend Server
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 7861
```

#### Frontend Server
```bash
cd frontend
npm run dev
```

## API Usage

### Authentication Flow

1. **Register a new user**:
```bash
curl -X POST http://localhost:7861/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

2. **Login to get JWT token**:
```bash
curl -X POST http://localhost:7861/auth/login \
  -d "username=user@example.com&password=securepassword"
```

3. **Use token for authenticated requests**:
```bash
curl -X GET http://localhost:7861/todos \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and get JWT |
| GET | `/auth/me` | Get current user info |
| GET | `/todos` | Get authenticated user's todos |
| POST | `/todos` | Create a new todo for user |
| PUT | `/todos/{id}` | Update a specific todo |
| DELETE | `/todos/{id}` | Delete a specific todo |

## Frontend Pages

- `http://localhost:3000` - Main todo dashboard (requires authentication)
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/register` - Registration page

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/dbname
# Or for development: DATABASE_URL=sqlite:///./todo_dev.db
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:7861
```

## Testing Multi-User Isolation

A test script is provided to verify that users can only access their own tasks:

```bash
# Run the multi-user isolation test
python test_multi_user.py
```

This script will:
1. Create two users
2. Log in as each user
3. Create tasks for each user
4. Verify that each user only sees their own tasks
5. Test that users cannot access each other's tasks

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure your DATABASE_URL is correctly configured in the backend .env file.

2. **JWT Secret Issues**: Make sure JWT_SECRET_KEY is set in the backend environment.

3. **CORS Issues**: The backend is configured to allow all origins during development.

4. **Password Length Issues**: Passwords longer than 72 bytes are automatically truncated due to bcrypt limitations.

### Resetting Everything
To reset the application state:
1. Stop both servers
2. Run the reset script: `python backend/reset_table.py`
3. Restart both servers

## Security Notes

- JWT tokens have a default 30-minute expiration
- Passwords are hashed using bcrypt with salt
- All API endpoints require authentication except auth endpoints
- User data is isolated at the database query level
- Tokens are stored in browser localStorage (consider HttpOnly cookies for production)