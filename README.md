# TaskFlow Pro

![CI](https://github.com/areeb1777/Phase-II_Full-Stack-Todo-App/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

## Overview

TaskFlow Pro is a full-stack todo application with JWT authentication, AI-powered chatbot assistance, profile management, and dark/light theme support. Built with Next.js 16+ and FastAPI, it demonstrates a production-ready architecture with CI/CD, Docker orchestration, and comprehensive test coverage.

## Features

- **Authentication** — Register, login, JWT-based session management with multi-user isolation
- **Todo CRUD** — Create, read, update, and delete tasks with completion tracking
- **AI Chatbot** — Natural-language task assistant powered by OpenRouter (Mistral 7B)
- **Profile Management** — Profile picture upload, account settings
- **Theme Toggle** — Dark/light theme with localStorage persistence and system preference detection
- **Responsive UI** — Mobile-first design with Tailwind CSS

## Architecture

```
Browser
  |
  v
Next.js 16+ Frontend (Vercel)
  |  REST API calls
  v
FastAPI Backend (HF Spaces)
  |          |
  v          v
SQLite /   OpenRouter AI
PostgreSQL   (Mistral 7B)
```

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 16+ (App Router), React 19, TypeScript  |
| Styling        | Tailwind CSS 4, Lucide React icons              |
| Backend        | FastAPI, Python 3.12, Pydantic                  |
| Database       | SQLite (dev) / Neon PostgreSQL (prod)            |
| Auth           | JWT (PyJWT), bcrypt password hashing             |
| AI             | OpenRouter API, Mistral 7B Instruct              |
| Infrastructure | Docker Compose, GitHub Actions CI/CD             |
| Testing        | pytest (backend), Jest + Testing Library (frontend) |

## Development Journey

| Phase | Focus                  | Highlights                                            |
| ----- | ---------------------- | ----------------------------------------------------- |
| 1     | Frontend UI            | Next.js App Router, Tailwind CSS, responsive design   |
| 2     | Backend Integration    | FastAPI REST API, SQLAlchemy ORM, JWT authentication   |
| 3     | AI Chatbot             | OpenRouter integration, conversational task management |
| 4     | Docker                 | Multi-stage builds, Compose orchestration              |
| 5     | Quality & Showcase     | Tests, CI/CD, structured logging, documentation        |

## Quick Start (Docker)

```bash
# Clone and start
git clone <repository-url>
cd Phase-II_Full-Stack-Todo-App

# Set environment variables
export OPENAI_API_KEY=your-openrouter-api-key
export JWT_SECRET_KEY=your-secret-key

# Build and run
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Local Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # for testing
python run.py
```

Backend runs on http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000.

### Running Tests

```bash
# Backend tests
cd backend && pytest -v

# Frontend tests
cd frontend && npm test
```

## Environment Variables

| Variable              | Description                        | Default                             |
| --------------------- | ---------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend           | `http://localhost:8000`             |
| `JWT_SECRET_KEY`      | Secret key for JWT signing         | `change-me-in-production`           |
| `DATABASE_URL`        | Database connection string         | `sqlite:///./todo.db`               |
| `OPENAI_API_KEY`      | OpenRouter API key (for chatbot)   | —                                   |
| `OPENAI_BASE_URL`     | AI provider base URL               | `https://openrouter.ai/api/v1`     |
| `MODEL`               | AI model identifier                | `mistralai/mistral-7b-instruct`    |
| `LOG_LEVEL`           | Backend log level                  | `INFO`                              |
| `PORT`                | Backend server port                | `7860`                              |

## Deployment

| Service  | Platform               | URL                              |
| -------- | ---------------------- | -------------------------------- |
| Frontend | Vercel                 | <!-- Add Vercel URL -->          |
| Backend  | Hugging Face Spaces    | <!-- Add HF Spaces URL -->       |

## Screenshots

<!-- Add screenshots here -->

---

Made with Next.js and FastAPI
