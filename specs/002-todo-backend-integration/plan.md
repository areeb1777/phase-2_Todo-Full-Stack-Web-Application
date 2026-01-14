# Implementation Plan: Todo App Backend & Database Integration

**Branch**: `002-backend-integration` | **Date**: 2026-01-13 | **Spec**: [link](spec.md)
**Input**: Feature specification from `/specs/002-todo-backend-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a FastAPI backend with Neon PostgreSQL database to store and manage Todo items, replacing the existing mock/in-memory state in the Next.js frontend. The backend will provide REST APIs for full CRUD operations while maintaining the existing UI without changes.

## Technical Context

**Language/Version**: Python 3.10+
**Primary Dependencies**: FastAPI, SQLAlchemy, Neon PostgreSQL, python-dotenv
**Storage**: Neon PostgreSQL database with UUID primary keys
**Testing**: pytest for backend API testing
**Target Platform**: Linux server environment (WSL/Cloud)
**Project Type**: Web application with separate frontend and backend
**Performance Goals**: API response times under 2 seconds, support for 100 concurrent users
**Constraints**: Maintain existing frontend UI without changes, secure database connection
**Scale/Scope**: Individual user todo management, up to 1000 todos per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **UI-First Development**: PASSED - This backend integration respects the existing UI-first approach by maintaining all frontend components unchanged while adding backend support
- **Modern Frontend Stack**: PASSED - Backend integration will not modify the existing Next.js/TypeScript/Tailwind stack
- **Test-First**: COMPLIANT - Backend API endpoints will have comprehensive tests before implementation
- **Clean Architecture**: PASSED - Clear separation between frontend and backend with well-defined API contracts
- **Responsive Design & UX**: PASSED - No UI changes required, maintaining existing user experience
- **Mock State Management**: TRANSITIONING - Moving from mock state to persistent database storage as planned in Phase II-B

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-backend-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # DB engine and session
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic schemas
│   └── routes/
│       └── todos.py         # Todo CRUD routes
├── requirements.txt
├── .env                     # Database connection (user-provided)
└── .gitignore

frontend/                    # Existing Next.js UI
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── TaskInput.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
└── ...

tests/
├── backend/
│   ├── conftest.py
│   ├── test_todos.py
│   └── integration/
└── frontend/               # Existing frontend tests
    └── ...
```

**Structure Decision**: Web application with separate backend and frontend directories. The existing frontend remains unchanged while a new backend directory is added with FastAPI application structure following best practices.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [N/A] | [N/A] |
