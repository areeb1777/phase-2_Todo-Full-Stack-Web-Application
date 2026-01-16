---
title: Todo API
emoji: ✅
colorFrom: blue
colorTo: green
sdk: docker
sdk_version: "latest"
python_version: "3.12"
app_file: app.py
pinned: false
---

# Todo API for Hugging Face Space

This is a FastAPI-based Todo application backend deployed on Hugging Face Spaces.

## Features
- User authentication and registration
- Todo management (create, read, update, delete)
- Profile management
- Secure JWT-based authentication

## Endpoints
- `/` - Root endpoint
- `/health` - Health check
- `/todos` - Todo management endpoints
- `/auth` - Authentication endpoints
- `/profile` - Profile management endpoints

## Tech Stack
- FastAPI
- SQLAlchemy
- PostgreSQL (via Neon)
- JWT Authentication
- Bcrypt for password hashing

## Deployment
This application is designed to run on Hugging Face Spaces with the following configuration:
- Python 3.12
- uvicorn ASGI server
- Port 7860

## Environment Variables Required
- `JWT_SECRET_KEY` - Secret key for JWT token signing
- `DATABASE_URL` - Database connection string (PostgreSQL recommended)