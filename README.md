# TaskFlow Pro - Professional Todo Application

## Overview
TaskFlow Pro is a modern, professional todo application with multi-user support, dark/light theme, and advanced user management features. Built with Next.js 16+ and FastAPI, it provides a seamless task management experience with robust authentication and security.

## Features

### Authentication & Security
- User registration and login with secure JWT authentication
- Multi-user isolation - each user sees only their own tasks
- Password hashing with bcrypt
- Session management

### User Experience
- **Dark/Light Theme Support** - Toggle between themes with localStorage persistence
- **Professional UI** - Modern, clean design with consistent color palette
- **Responsive Design** - Works on all device sizes
- **Profile Management** - User profiles with profile picture upload capability
- **Settings Panel** - Comprehensive account and security settings

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Add descriptions to tasks
- Timestamps on all tasks
- Task statistics and overview

### Advanced Features
- Profile picture upload functionality
- Enhanced error handling and user feedback
- Loading states and animations
- Professional navigation with mobile support
- Activity tracking

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Runtime**: Node.js
- **Styling**: Tailwind CSS with custom theme variables
- **Icons**: Lucide React
- **State Management**: React Context API
- **Languages**: TypeScript, JavaScript

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (with PostgreSQL compatibility)
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens with secure hashing
- **Validation**: Pydantic

## Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- pip package manager

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Reset the database (optional, to start fresh):
```bash
python reset_table.py
```

5. Start the backend server:
```bash
python run.py
```
The backend will start on `http://localhost:7860`.

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`.

## Environment Variables

### Frontend
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:7860
```

### Backend
The backend uses default configurations but can be customized if needed.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Profile Management
- `GET /profile/me` - Get current user profile
- `PUT /profile/picture` - Upload profile picture
- `PATCH /profile/update` - Update profile information

### Todo Management
- `GET /todos` - Get all user's todos
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## Theme Configuration

The application supports both light and dark themes:

### Light Theme (Default)
- Background: #ffffff (white)
- Foreground: #1f2937 (gray-800)
- Primary: #3b82f6 (blue-500)
- Card: #ffffff (white)

### Dark Theme
- Background: #0f172a (slate-900)
- Foreground: #f8fafc (slate-50)
- Primary: #60a5fa (blue-400)
- Card: #1e293b (slate-800)

Themes are persisted in localStorage and respect system preferences.

## Error Handling

The application includes comprehensive error handling:
- Network error detection
- Authentication failures
- Form validation
- Server error responses
- User-friendly error messages

## Profile Picture Upload

Users can upload profile pictures that are:
- Stored as base64 encoded strings in the database
- Displayed on the profile page and in the navbar
- Persisted between sessions

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention via SQLAlchemy ORM
- Cross-site request forgery protection
- Secure session management

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `python run.py` - Start development server
- `python reset_table.py` - Reset database tables

## Deployment

### Frontend Deployment
The frontend can be deployed to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Azure Static Web Apps

### Backend Deployment
The backend can be deployed to platforms like:
- Hugging Face Spaces
- Railway
- Heroku
- AWS EC2/App Runner
- Google Cloud Run

#### CORS Configuration for Production
When deploying the backend, update the CORS settings in `backend/app/main.py` to include your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Add your domain here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin"]
)
```

## Docker Deployment (Local Development)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Phase-II_Full-Stack-Todo-App
```

2. **Set up environment variables**:

Create a `.env` file in the project root (or export these variables):
```bash
# Required for chatbot functionality
export OPENAI_API_KEY=your-openrouter-api-key-here

# Optional: Change JWT secret for production
export JWT_SECRET_KEY=your-super-secret-key-change-in-production

# Optional: Customize OpenRouter settings
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export MODEL=mistralai/mistral-7b-instruct
```

Or copy from `.env.example` files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your values
```

3. **Start the application**:
```bash
docker compose up --build
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Architecture

The Docker setup consists of two services:

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                 │
│  Port: 3000                         │
│  - Multi-stage build                │
│  - Standalone output mode           │
│  - Non-root user (nextjs)           │
└──────────────┬──────────────────────┘
               │ depends_on (health)
               ▼
┌─────────────────────────────────────┐
│  Backend (FastAPI)                  │
│  Port: 8000                         │
│  - Health check endpoint            │
│  - SQLite database (persistent)     │
│  - Non-root user (appuser)          │
│  - Volume: backend-data             │
└─────────────────────────────────────┘
```

### Docker Commands

**Start services** (with build):
```bash
docker compose up --build
```

**Start services** (detached mode):
```bash
docker compose up -d
```

**View logs**:
```bash
docker compose logs -f
docker compose logs -f backend  # Backend only
docker compose logs -f frontend # Frontend only
```

**Stop services**:
```bash
docker compose down
```

**Stop and remove volumes** (⚠️ deletes database):
```bash
docker compose down -v
```

**Rebuild specific service**:
```bash
docker compose build backend
docker compose build frontend
```

### Troubleshooting

#### Port Already in Use

If ports 3000 or 8000 are already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Change host port to 8001
  frontend:
    ports:
      - "3001:3000"  # Change host port to 3001
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001  # Update backend URL
```

#### Missing Environment Variables

**Error**: `OPENAI_API_KEY not found`

**Solution**: Ensure you've set the required environment variables:
```bash
export OPENAI_API_KEY=your-key-here
docker compose up --build
```

Or add them to a `.env` file in the project root.

#### Build Failures

**Frontend build fails** with "Module not found":
```bash
# Clean and rebuild
docker compose down
docker compose build --no-cache frontend
docker compose up
```

**Backend build fails**:
```bash
# Check Python dependencies
docker compose build --no-cache backend
docker compose logs backend
```

#### Health Check Failing

If the backend health check fails repeatedly:

1. **Check logs**:
```bash
docker compose logs backend
```

2. **Verify health endpoint**:
```bash
curl http://localhost:8000/health
```

3. **Increase start period** in `docker-compose.yml`:
```yaml
healthcheck:
  start_period: 60s  # Increase from 40s
```

#### Database Issues

**Reset the database** (⚠️ deletes all data):
```bash
docker compose down -v
docker compose up --build
```

### Production Deployment Note

**Important**: This Docker setup is optimized for **local development only**.

For **production deployments**, the application is currently deployed using:
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Hugging Face Spaces (with PostgreSQL database)

The Docker setup uses:
- SQLite database (vs. PostgreSQL in production)
- Development-friendly configurations
- Local environment variables

Do not use `docker-compose.yml` for production deployments. Existing cloud deployments remain unchanged.

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `.next` directory (standalone mode enabled).

### Backend for Production
For production deployment, consider using:
- Gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
- Or deploy to Hugging Face Spaces (current production setup)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Troubleshooting

### Common Issues
- **Database Connection**: Ensure SQLite file permissions are correct
- **CORS Errors**: Verify backend CORS settings match your frontend domain
- **Authentication**: Check that JWT tokens are properly stored in localStorage
- **Profile Pictures**: Ensure backend supports file uploads in production

### Development Tips
- Use `npm run dev` for frontend hot-reloading
- Restart backend when changing models
- Clear browser cache when testing authentication flows

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ using Next.js and FastAPI