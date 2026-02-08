# Data Model: Production Infrastructure & Dockerization

**Feature**: 004-production-dockerization
**Date**: 2026-02-08
**Phase**: 1 (Design & Contracts)

## Overview

Phase 4 (Production Infrastructure & Dockerization) is an **infrastructure-only phase** with zero changes to application data models. This document confirms that no new entities, fields, or relationships are introduced.

## Existing Data Models (Unchanged)

All data models remain in their current state within `backend/app/models/`:

### User Model
**Location**: `backend/app/models/user.py`
**Purpose**: Authentication and user management
**Fields**: id, email, password_hash, created_at, updated_at (exact fields per existing implementation)
**Relationships**: One-to-many with Todo model

### Todo Model
**Location**: `backend/app/models/todo.py`
**Purpose**: Task management
**Fields**: id, title, description, completed, user_id, created_at, updated_at (exact fields per existing implementation)
**Relationships**: Many-to-one with User model

### ChatMessage Model
**Location**: `backend/app/models/` (if exists)
**Purpose**: Chatbot conversation history
**Fields**: As defined in existing implementation
**Relationships**: As defined in existing implementation

## Infrastructure Data (New Concepts)

While no application data models change, Phase 4 introduces infrastructure concepts that behave like data entities:

### Docker Service Configuration
**Type**: Infrastructure configuration (not persisted in database)
**Location**: `docker-compose.yml`
**Attributes**:
- service_name (backend, frontend)
- build_context (./backend, ./frontend)
- ports (8000:8000, 3000:3000)
- environment_variables (key-value pairs)
- health_check_config (test command, interval, timeout, retries)
- restart_policy (unless-stopped)

**Purpose**: Defines how containers are built, networked, and orchestrated

### Environment Variable Specification
**Type**: Configuration metadata (not persisted in database)
**Location**: `.env.example` files, docker-compose.yml
**Attributes**:
- variable_name (e.g., JWT_SECRET_KEY)
- variable_type (required, optional)
- default_value (if optional)
- description (usage documentation)
- example_value (for .env.example)

**Purpose**: Documents required and optional configuration parameters

### Health Check Status
**Type**: Runtime state (ephemeral, not persisted)
**Location**: Docker daemon, health check endpoint response
**Attributes**:
- service_name (backend, frontend)
- status (healthy, unhealthy, starting)
- last_check_timestamp
- consecutive_failures
- response_code (200, 503, etc.)

**Purpose**: Represents operational health of services

## Database Persistence Strategy (Unchanged)

**Local Development (Docker)**:
- Database: SQLite (`todo_dev.db`)
- Persistence: Docker volume (`backend-data`)
- Schema: Unchanged from existing implementation
- Migrations: Existing Alembic migrations continue to work

**Production (Vercel + Hugging Face)**:
- Database: Neon PostgreSQL (existing connection)
- Schema: Unchanged from existing implementation
- Migrations: Existing Alembic migrations continue to work

**Key Point**: Docker introduces volume persistence for SQLite file, but does NOT change schema, models, or migration strategy.

## Data Migration Notes

**No migrations required** for Phase 4 because:
1. Zero changes to User, Todo, ChatMessage models
2. Zero new tables or columns
3. Zero changes to relationships or constraints
4. Docker volume ensures data persists between container restarts
5. Existing Alembic migrations remain valid and executable

## Schema Validation

To verify no schema changes occurred during Phase 4:

```bash
# Compare schema before and after Docker changes
# (Run from repository root)

# Before Docker implementation
cd backend
python -c "from app.database import Base; from app.models import *; print(Base.metadata.tables.keys())"

# After Docker implementation (should be identical)
docker compose up -d backend
docker compose exec backend python -c "from app.database import Base; from app.models import *; print(Base.metadata.tables.keys())"
```

Expected output (both): `dict_keys(['users', 'todos', ...])`

## Summary

- **New Data Models**: 0
- **Modified Data Models**: 0
- **New Fields**: 0
- **New Relationships**: 0
- **Database Migrations**: 0
- **Schema Changes**: 0

**Status**: ✅ Phase 4 maintains complete data model compatibility

**Reference**: For actual data models, see `backend/app/models/` directory in the existing codebase.
