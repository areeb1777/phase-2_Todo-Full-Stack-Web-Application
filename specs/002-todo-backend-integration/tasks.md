# Implementation Tasks: Todo App Backend & Database Integration

**Feature**: Todo App Backend & Database Integration
**Branch**: `002-backend-integration`
**Created**: 2026-01-13
**Input**: User requirements and implementation plan

## Overview
This document breaks down the implementation of the Todo App backend integration into specific, actionable tasks. Each task is designed to be independently executable with clear acceptance criteria.

## User Story Mapping
- **US1** (P1): Persist Todos in Database
- **US2** (P1): Full CRUD Operations via API
- **US3** (P2): Frontend-Backend Integration
- **US4** (P3): Error Handling and Loading States

## Phase 1: Setup Tasks

### Project Initialization
- [X] T001 Create backend directory structure at `backend/`
- [X] T002 [P] Create app package structure at `backend/app/__init__.py`
- [X] T003 Create requirements.txt with FastAPI dependencies
- [X] T004 Create .env file template with DATABASE_URL placeholder
- [X] T005 Create .gitignore for backend files

## Phase 2: Foundational Tasks

### Database Foundation
- [X] T006 Setup SQLAlchemy database engine in `backend/app/database.py`
- [X] T007 Create database session dependency in `backend/app/database.py`
- [X] T008 Configure environment variable loading with python-dotenv

### FastAPI Application Foundation
- [X] T009 Create FastAPI app instance in `backend/app/main.py`
- [X] T010 Configure CORS middleware in `backend/app/main.py`
- [X] T011 Add table auto-creation on startup in `backend/app/main.py`

## Phase 3: User Story 1 - Persist Todos in Database (P1)

### Goal
Enable storage of todo items in Neon PostgreSQL database so they persist across browser refreshes.

### Independent Test Criteria
- Create a todo, refresh the page, and verify the todo still exists
- Multiple todos are restored after closing and reopening the browser

### Implementation Tasks
- [X] T012 [US1] Define Todo ORM model in `backend/app/models.py`
- [X] T013 [US1] Configure database table with UUID primary key, title, description, completed, created_at fields
- [X] T014 [US1] Add database migration support to auto-create tables on startup

## Phase 4: User Story 2 - Full CRUD Operations via API (P1)

### Goal
Provide full Create, Read, Update, and Delete operations through backend API endpoints.

### Independent Test Criteria
- Perform all four operations (create, read, update, delete) and verify database state matches UI
- All operations complete successfully and data is synchronized with database

### Implementation Tasks
- [X] T015 [US2] Create Pydantic schemas in `backend/app/schemas.py` for Todo entities
- [X] T016 [US2] Create Pydantic schemas for Create and Update requests
- [X] T017 [US2] Implement GET /todos endpoint to fetch all todos
- [X] T018 [US2] Implement POST /todos endpoint to create new todos
- [X] T019 [US2] Implement PUT /todos/{id} endpoint to update todos
- [X] T020 [US2] Implement DELETE /todos/{id} endpoint to delete todos
- [X] T021 [US2] Add proper response models matching frontend data shape
- [X] T022 [US2] Add input validation using Pydantic schemas
- [X] T023 [US2] Ensure todos are sorted by creation time (newest first)

## Phase 5: User Story 3 - Frontend-Backend Integration (P2)

### Goal
Connect existing Next.js frontend UI to backend API without changing visual appearance.

### Independent Test Criteria
- All frontend interactions trigger appropriate backend API calls
- UI updates reflect database changes
- Application loads todos from backend on page load

### Implementation Tasks
- [X] T024 [US3] Create API service layer in frontend to interact with backend
- [X] T025 [US3] Replace local state management with API calls in `frontend/app/page.tsx`
- [X] T026 [US3] Update todo creation flow to use POST /todos API
- [X] T027 [US3] Update todo completion toggle to use PUT /todos/{id} API
- [X] T028 [US3] Update todo deletion flow to use DELETE /todos/{id} API
- [X] T029 [US3] Add initial todo loading on page mount from GET /todos API
- [X] T030 [US3] Ensure UI visuals remain unchanged during integration
- [X] T031 [US3] Add environment variable for API URL in frontend

## Phase 6: User Story 4 - Error Handling and Loading States (P3)

### Goal
Provide graceful error handling and loading states during API operations.

### Independent Test Criteria
- Loading indicators shown during API requests
- Appropriate error feedback when requests fail
- Network errors handled gracefully

### Implementation Tasks
- [X] T032 [US4] Add loading state management in frontend components
- [X] T033 [US4] Show loading indicators during API operations
- [X] T034 [US4] Add error handling for API failures in frontend
- [X] T035 [US4] Display user-friendly error messages
- [X] T036 [US4] Add retry mechanism for failed requests
- [X] T037 [US4] Handle database connection errors in backend gracefully

## Phase 7: Deployment Preparation

### Hugging Face Spaces Compatibility
- [X] T038 Configure uvicorn entrypoint for Hugging Face deployment
- [X] T039 Set backend to run on port 7860 as required
- [X] T040 Update requirements.txt with Hugging Face compatible versions
- [X] T041 Create run script for Hugging Face Spaces at `backend/run.py`
- [X] T042 Add health check endpoint at `/` in `backend/app/main.py`

## Phase 8: Polish & Cross-Cutting Concerns

### Final Integration & Testing
- [X] T043 Test full end-to-end flow from frontend to backend
- [X] T044 Verify data persistence across browser refreshes
- [X] T045 Test all CRUD operations work correctly
- [X] T046 Verify UI remains unchanged after backend integration
- [X] T047 Run backend locally with `uvicorn app.main:app --host 0.0.0.0 --port 7860`
- [X] T048 Verify CORS configuration allows frontend access
- [X] T049 Document API endpoints for frontend integration
- [X] T050 Create deployment instructions for Hugging Face Spaces

## Dependencies

### User Story Completion Order
1. US1 (Persist Todos) must be completed before US2 (CRUD Operations)
2. US2 (CRUD Operations) must be completed before US3 (Frontend Integration)
3. US3 (Frontend Integration) should be completed before US4 (Error Handling)

### Critical Path
T001 → T002 → T003 → T006 → T009 → T012 → T015 → T017 → T024 → T025

## Parallel Execution Examples

### Per User Story
**US1 Tasks** (can run in parallel):
- T012 (ORM model) ↔ T006 (DB setup)

**US2 Tasks** (can run in parallel):
- T015 (schemas) ↔ T017 (GET endpoint)
- T018 (POST endpoint) ↔ T019 (PUT endpoint) ↔ T020 (DELETE endpoint)

**US3 Tasks** (can run in parallel):
- T024 (API service) ↔ T025 (state replacement)
- T026 (create flow) ↔ T027 (update flow) ↔ T028 (delete flow)

## Implementation Strategy

### MVP Approach
1. **MVP 1**: Complete US1 (database persistence) + US2 (CRUD endpoints)
2. **MVP 2**: Add US3 (frontend integration)
3. **Complete**: Add US4 (error handling) + deployment readiness

### Incremental Delivery
- Focus on getting the backend API fully functional first
- Then integrate with frontend while preserving UI
- Finally add error handling and polish

### Success Criteria
- [ ] Backend runs locally and connects to database when URL is provided
- [ ] Full CRUD operations work through API
- [ ] Frontend UI remains visually unchanged
- [ ] Todos persist across browser refreshes
- [ ] Backend is deployable on Hugging Face Spaces using specified command
- [ ] No hardcoded credentials anywhere in the code