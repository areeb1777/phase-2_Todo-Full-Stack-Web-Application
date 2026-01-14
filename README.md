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

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `out` directory.

### Backend for Production
For production deployment, consider using:
- Gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
- Or containerize with Docker

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