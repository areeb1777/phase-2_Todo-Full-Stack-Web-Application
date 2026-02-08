# Quickstart Guide: Docker Deployment

**Feature**: 004-production-dockerization
**Date**: 2026-02-08
**Audience**: Developers setting up local environment

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Engine 20.10+** ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose 2.0+** (included with Docker Desktop, or install separately)
- **Git** (to clone the repository)

### Verify Installation

```bash
docker --version
# Expected: Docker version 20.10.0 or higher

docker compose version
# Expected: Docker Compose version v2.0.0 or higher
```

## Quick Start (5 Minutes)

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/phase-2_Todo-Full-Stack-Web-Application.git
cd Phase-II_Full-Stack-Todo-App
```

### Step 2: Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenRouter API key:

```ini
# Backend Environment Variables

# JWT Secret Key (REQUIRED - change in production)
JWT_SECRET_KEY=your-super-secret-key-change-in-production

# Database URL (OPTIONAL - defaults to SQLite)
DATABASE_URL=sqlite:///./todo_dev.db

# OpenRouter API Configuration (REQUIRED for chatbot)
OPENAI_API_KEY=your-openrouter-api-key-here  # ⬅️ ADD YOUR KEY HERE
OPENAI_BASE_URL=https://openrouter.ai/api/v1
MODEL=mistralai/mistral-7b-instruct
```

**Where to get OpenRouter API key:**
1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Navigate to API Keys section
3. Create new API key
4. Copy and paste into `OPENAI_API_KEY`

#### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` (default values work for Docker setup):

```ini
# Frontend Environment Variables

# Backend API URL (REQUIRED)
# For Docker Compose: http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Start Application

```bash
cd ..  # Return to repository root
docker compose up --build
```

**What happens:**
1. Builds backend Docker image (~2 minutes first time)
2. Builds frontend Docker image (~3 minutes first time)
3. Starts backend container (waits for health check)
4. Starts frontend container (after backend is healthy)

**Expected output:**
```
[+] Building 125.3s (24/24) FINISHED
[+] Running 2/2
 ✔ Container backend   Started
 ✔ Container frontend  Started

backend  | INFO:     Started server process [1]
backend  | INFO:     Waiting for application startup.
backend  | INFO:     Application startup complete.
backend  | INFO:     Uvicorn running on http://0.0.0.0:8000

frontend | ▲ Next.js 16.1.6
frontend | - Local:        http://localhost:3000
frontend | ✓ Ready in 1.2s
```

### Step 4: Access Application

Open your browser and navigate to:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Health**: [http://localhost:8000/health](http://localhost:8000/health)

### Step 5: Test Functionality

1. **Register an account**: Click "Sign Up" on the frontend
2. **Create a todo**: Add a task to your todo list
3. **Test chatbot**: Send a message to the AI chatbot
4. **Verify persistence**: Stop and restart containers, data should persist

```bash
# Stop containers
docker compose down

# Restart containers (data persists)
docker compose up
```

## Usage Patterns

### Daily Development

**Start services:**
```bash
docker compose up
```

**Stop services (keep data):**
```bash
# Press Ctrl+C in terminal
# OR
docker compose down
```

**View logs:**
```bash
# All services
docker compose logs

# Backend only
docker compose logs backend

# Frontend only
docker compose logs frontend

# Follow logs (live tail)
docker compose logs -f
```

**Restart services:**
```bash
# Restart all
docker compose restart

# Restart backend only
docker compose restart backend
```

### Advanced Operations

**Rebuild after code changes:**
```bash
docker compose up --build
```

**Run in detached mode (background):**
```bash
docker compose up -d
```

**Stop and remove volumes (fresh start):**
```bash
docker compose down -v
# ⚠️ This deletes all data (todos, users, etc.)
```

**Execute commands in containers:**
```bash
# Backend shell
docker compose exec backend bash

# Frontend shell
docker compose exec frontend sh

# Run backend migrations
docker compose exec backend alembic upgrade head

# Check backend Python version
docker compose exec backend python --version
```

**View container resource usage:**
```bash
docker compose stats
```

**Inspect container details:**
```bash
docker compose ps
docker inspect <container_id>
```

## Troubleshooting

### Problem: Port Already in Use

**Error:**
```
Error response from daemon: Ports are not available: exposing port
TCP 0.0.0.0:3000 -> 0.0.0.0:0: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Solution 1: Stop Conflicting Service**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Solution 2: Change Port Mapping**

Edit `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Change host port to 3001

  backend:
    ports:
      - "8001:8000"  # Change host port to 8001
```

Update `frontend/.env.local`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Problem: Missing Environment Variable

**Error:**
```
KeyError: 'OPENAI_API_KEY'
```

**Solution:**
1. Ensure `backend/.env` exists (copy from `backend/.env.example`)
2. Add `OPENAI_API_KEY=your-key-here` to `backend/.env`
3. Restart containers: `docker compose restart backend`

### Problem: Frontend Can't Connect to Backend

**Symptom:**
- Frontend loads but API calls fail with "Network Error"

**Solution:**
1. Verify backend is running: `docker compose ps`
2. Check backend health: `curl http://localhost:8000/health`
3. Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`:
   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:8000  # Must match backend port
   ```
4. Check browser console for CORS errors (should not occur with current setup)

### Problem: Build Fails

**Error:**
```
ERROR [backend 5/7] RUN pip install --no-cache-dir -r requirements.txt
```

**Solution:**
1. Clean Docker build cache:
   ```bash
   docker compose build --no-cache
   ```
2. Check `requirements.txt` for syntax errors
3. Verify internet connection (Docker needs to download packages)

### Problem: Container Keeps Restarting

**Symptom:**
```bash
docker compose ps
# backend   restarting   ...
```

**Solution:**
1. Check logs for errors:
   ```bash
   docker compose logs backend
   ```
2. Common causes:
   - Missing environment variable (add to `.env`)
   - Database migration error (run `alembic upgrade head`)
   - Port conflict (change port mapping)
3. Stop auto-restart and debug:
   ```bash
   docker compose stop backend
   docker compose run --rm backend bash
   # Debug inside container
   ```

### Problem: Database Locked

**Error:**
```
sqlite3.OperationalError: database is locked
```

**Solution:**
1. SQLite doesn't handle concurrent writes well
2. Ensure only one backend container running:
   ```bash
   docker compose ps
   # Should show only ONE backend container
   ```
3. If error persists, restart with fresh database:
   ```bash
   docker compose down -v
   docker compose up
   ```

### Problem: Slow Build Times

**Symptom:**
- Docker builds take >5 minutes

**Solution:**
1. Ensure `.dockerignore` files exist (excludes unnecessary files)
2. Use layer caching (don't modify `Dockerfile` frequently)
3. Increase Docker resources (Docker Desktop → Settings → Resources):
   - CPU: 4+ cores
   - Memory: 4+ GB
   - Disk: Enable VirtioFS (macOS) or WSL 2 (Windows)

## Configuration Reference

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET_KEY` | Yes | N/A | Secret key for JWT token signing (min 32 chars) |
| `OPENAI_API_KEY` | Yes | N/A | OpenRouter API key for chatbot |
| `DATABASE_URL` | No | `sqlite:///./todo_dev.db` | Database connection string |
| `OPENAI_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `MODEL` | No | `mistralai/mistral-7b-instruct` | LLM model identifier |

#### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | N/A | Backend API URL (must be accessible from browser) |

### Port Mappings

| Service | Container Port | Host Port | URL |
|---------|----------------|-----------|-----|
| Backend | 8000 | 8000 | http://localhost:8000 |
| Frontend | 3000 | 3000 | http://localhost:3000 |

### Volume Mounts

| Volume | Container Path | Purpose |
|--------|----------------|---------|
| `backend-data` | `/app` | Persists SQLite database and backend data |

## Performance Metrics

Expected performance on modern hardware (2023+):

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial build time | <5 minutes | `time docker compose build` |
| Startup time | <2 minutes | `time docker compose up` |
| Backend response | <100ms | `curl -w "%{time_total}" http://localhost:8000/health` |
| Frontend load | <2 seconds | Browser DevTools Network tab |
| Memory (backend) | ~200MB | `docker stats` |
| Memory (frontend) | ~300MB | `docker stats` |
| Image size (backend) | <500MB | `docker images` |
| Image size (frontend) | <1GB | `docker images` |

## Next Steps

After successful setup:

1. **Explore the application**: Register, create todos, test chatbot
2. **Review documentation**: Check `README.md` for full feature list
3. **Customize configuration**: Modify `.env` files for your needs
4. **Deploy to production**: See deployment guides for Vercel (frontend) and Hugging Face (backend)

## Getting Help

- **Docker issues**: [Docker Documentation](https://docs.docker.com/)
- **Application issues**: Check `README.md` or open GitHub issue
- **API reference**: http://localhost:8000/docs (when running)

## Differences from Production

This Docker setup is for **local development only**:

| Aspect | Local Docker | Production |
|--------|--------------|-----------|
| Frontend | Docker container | Vercel deployment |
| Backend | Docker container | Hugging Face Spaces |
| Database | SQLite in volume | Neon PostgreSQL |
| HTTPS | No (HTTP only) | Yes (automatic) |
| Domain | localhost | Custom domains |
| Scaling | Single instance | Auto-scaling |

Production deployments use separate configurations and are NOT affected by Docker setup.
