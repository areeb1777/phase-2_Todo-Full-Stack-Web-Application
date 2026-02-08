# Tasks: Final Cleanup, Quality & Professional Showcase

**Input**: Design documents from `/specs/005-final-cleanup-showcase/`
**Prerequisites**: plan.md (loaded), spec.md (loaded), research.md (loaded), quickstart.md (loaded)

**Global Rules**:
- Work ONLY on main branch — NO new branches
- NO feature changes, UI edits, backend logic edits, Docker edits
- DO NOT delete SpecKit/spec history folders
- Only cleanup + quality improvements
- Small safe conventional commits per group

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)

---

## Phase 1: Repository Cleanup — US1 (Priority: P1)

**Goal**: Ensure the repository contains only source code, with .gitignore preventing all build artifacts.

**Independent Test**: Run `git ls-files | grep -E '__pycache__|\.pyc|node_modules|\.next|dist/|build/'` and confirm zero results.

- [ ] T001 [US1] Verify no build artifacts tracked by git — run `git ls-files` grep for `__pycache__`, `*.pyc`, `node_modules/`, `.next/`, `dist/`, `build/`, `venv/`, `temp/`, `*.log`
- [ ] T002 [US1] Remove any tracked junk with `git rm --cached` if T001 finds anything (do NOT delete local files)
- [ ] T003 [US1] Verify .gitignore covers all patterns: `__pycache__/`, `*.pyc`, `node_modules/`, `.next/`, `dist/`, `build/`, `venv/`, `logs/`, `temp/`, `*.db`, `*.log` in `.gitignore`
- [ ] T004 [US1] Verify `.github/workflows/` is NOT in `.gitignore` (must be trackable for CI/CD)
- [ ] T005 [US1] Run `git status` to confirm clean working tree with only expected untracked files

**Commit**: `chore: verify repository cleanup and gitignore coverage`

**Checkpoint**: Repository verified clean. No junk tracked. .gitignore comprehensive.

---

## Phase 2: Backend Tests — US2 (Priority: P2)

**Goal**: pytest test suite covering auth, todos, and health endpoints using in-memory SQLite.

**Independent Test**: Run `cd backend && pip install -r requirements-dev.txt && pytest -v` — all tests pass.

### Setup

- [ ] T006 [US2] Create `backend/requirements-dev.txt` with pytest and httpx dependencies
- [ ] T007 [US2] Install test dependencies — run `pip install -r backend/requirements-dev.txt`

### Test Files

- [ ] T008 [US2] Create `backend/tests/__init__.py` (empty init file)
- [ ] T009 [US2] Create `backend/tests/conftest.py` with shared fixtures:
  - `test_engine`: SQLite in-memory (`sqlite:///:memory:`)
  - `test_db`: Create all tables via `Base.metadata.create_all`, yield session, drop all tables
  - `test_client`: FastAPI `TestClient` with overridden `get_db` dependency
  - `auth_token`: Create test user with hashed password, return JWT via `create_access_token({"sub": str(user.id)})`
  - `auth_headers`: Return `{"Authorization": "Bearer <token>"}` dict
- [ ] T010 [P] [US2] Create `backend/tests/test_health.py`:
  - `test_health_endpoint`: GET /health → 200, body contains `"status": "healthy"`
- [ ] T011 [P] [US2] Create `backend/tests/test_auth.py`:
  - `test_register_user`: POST /auth/register with `{"email": "test@test.com", "password": "testpass123"}` → 200, response contains email and id
  - `test_login_user`: Register user first, then POST /auth/login with form data `username=test@test.com&password=testpass123` → 200, response contains `access_token`
  - `test_get_current_user`: GET /auth/me with auth_headers → 200, response contains user email
- [ ] T012 [P] [US2] Create `backend/tests/test_todos.py`:
  - `test_create_todo`: POST /todos/ with auth_headers and `{"title": "Test Todo"}` → 201, response contains title
  - `test_get_todos`: Create a todo first, then GET /todos/ with auth_headers → 200, response is a list
  - `test_update_todo`: Create todo, then PUT /todos/{id} with `{"completed": true}` → 200, completed is true
  - `test_delete_todo`: Create todo, then DELETE /todos/{id} → 204

### Verification

- [ ] T013 [US2] Run `pytest -v` in backend directory — all 8 tests pass
- [ ] T014 [US2] Verify tests use in-memory SQLite only (no external service dependencies)

**Commit**: `test: add backend pytest test suite for auth, todos, and health`

**Checkpoint**: Backend has 8+ passing tests. Tests are self-contained with in-memory SQLite.

---

## Phase 3: Frontend Tests — US2 (Priority: P2)

**Goal**: Jest test suite for basic page and component rendering.

**Independent Test**: Run `cd frontend && npm test` — all tests pass.

### Setup

- [ ] T015 [US2] Install Jest and testing dependencies in `frontend/package.json` devDependencies:
  - `jest`, `@jest/globals`, `ts-jest`, `jest-environment-jsdom`
  - `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`
  - Run: `cd frontend && npm install --save-dev jest @jest/globals ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest`
- [ ] T016 [US2] Add test scripts to `frontend/package.json`:
  - `"test": "jest"`
  - `"test:watch": "jest --watch"`
- [ ] T017 [US2] Create `frontend/jest.config.ts`:
  - Use `next/jest` preset via `createJestConfig`
  - Set `testEnvironment: "jsdom"`
  - Set `setupFilesAfterSetup: ["<rootDir>/jest.setup.ts"]`
  - Map `@/` path alias to `<rootDir>/`
- [ ] T018 [US2] Create `frontend/jest.setup.ts`:
  - Import `@testing-library/jest-dom`

### Test Files

- [ ] T019 [P] [US2] Create `frontend/__tests__/login.test.tsx`:
  - Mock `next/navigation` (useRouter returns `{ push: jest.fn(), refresh: jest.fn() }`)
  - Mock `@/lib/api` (todoApi methods)
  - Mock `@/context/AuthContext` (useAuth returns mock values)
  - Render LoginPage, assert: email input, password input, and submit/login button exist
- [ ] T020 [P] [US2] Create `frontend/__tests__/register.test.tsx`:
  - Same mocking strategy as login test
  - Render RegisterPage, assert: email input, password input, and submit/register button exist
- [ ] T021 [P] [US2] Create `frontend/__tests__/components.test.tsx`:
  - Import EmptyState component from `@/components/EmptyState`
  - Render EmptyState, assert placeholder text is visible

### Verification

- [ ] T022 [US2] Run `npm test` in frontend directory — all 3 tests pass
- [ ] T023 [US2] Verify tests mock external dependencies (no real API calls)

**Commit**: `test: add frontend jest test suite for pages and components`

**Checkpoint**: Frontend has 3+ passing tests. Tests use mocks, no real API calls.

---

## Phase 4: CI/CD Pipeline — US3 (Priority: P3)

**Goal**: GitHub Actions workflow that runs tests and builds on every push.

**Independent Test**: Push to GitHub and verify Actions tab shows green workflow.

- [ ] T024 [US3] Create directory `.github/workflows/`
- [ ] T025 [US3] Create `.github/workflows/ci.yml` with two parallel jobs:

  **Backend job** (`backend-test`):
  - runs-on: `ubuntu-latest`
  - Steps: checkout, setup Python 3.12, `pip install -r backend/requirements.txt -r backend/requirements-dev.txt`, `cd backend && pytest -v`

  **Frontend job** (`frontend-test`):
  - runs-on: `ubuntu-latest`
  - Steps: checkout, setup Node 20, `cd frontend && npm ci`, `cd frontend && npm test`, `cd frontend && npm run build`

  **Triggers**: `on: [push, pull_request]`

- [ ] T026 [US3] Verify workflow YAML syntax is valid (proper indentation, correct action versions)

**Commit**: `ci: add github actions pipeline for backend and frontend`

**Checkpoint**: CI/CD pipeline created. Will trigger on next push.

---

## Phase 5: Structured Logging — US4 (Priority: P4)

**Goal**: Consistent structured log format across backend without changing behavior.

**Independent Test**: Start backend, verify logs show `timestamp | LEVEL | module | message` format.

- [ ] T027 [US4] Create `backend/app/logging_config.py`:
  - Function `setup_logging()` that configures root logger
  - Format: `%(asctime)s | %(levelname)-8s | %(name)s | %(message)s`
  - Date format: `%Y-%m-%d %H:%M:%S`
  - Level from env var `LOG_LEVEL` (default: `INFO`)
  - Apply to root logger with `logging.basicConfig()`
- [ ] T028 [US4] Add 2 lines to `backend/app/main.py`:
  - Import: `from app.logging_config import setup_logging`
  - Call: `setup_logging()` before FastAPI app creation (near top of file, after existing imports)
  - NO other changes to main.py
- [ ] T029 [US4] Verify backend starts correctly and logs use new format
- [ ] T030 [US4] Verify all existing API endpoints still return identical responses

**Commit**: `chore: add structured logging configuration`

**Checkpoint**: Logs are structured. Zero behavior changes. All endpoints work.

---

## Phase 6: Professional README — US5 (Priority: P5)

**Goal**: Portfolio-quality README with all 11 required sections.

**Independent Test**: Open README.md on GitHub — all sections present, formatting clean.

- [ ] T031 [US5] Read current `README.md` to understand existing content
- [ ] T032 [US5] Rewrite `README.md` with these 11 sections:
  1. **Project Title** with CI status badge (`![CI](repo-url/actions/workflows/ci.yml/badge.svg)`) and tech badges
  2. **Overview** — 2-3 sentence project description
  3. **Features** — bulleted list: auth, todo CRUD, AI chatbot, profile management, theme toggle
  4. **Architecture** — text diagram: Browser → Next.js Frontend → FastAPI Backend → SQLite/PostgreSQL + OpenRouter AI
  5. **Tech Stack** — table organized by layer (frontend, backend, infrastructure, AI)
  6. **Development Journey** — Phase 1 (Frontend UI) → Phase 2 (Backend Integration) → Phase 3 (AI Chatbot) → Phase 4 (Docker) → Phase 5 (Quality & Showcase)
  7. **Quick Start (Docker)** — `docker compose up --build`, access URLs
  8. **Local Development Setup** — manual steps for frontend (`npm install && npm run dev`) and backend (`pip install && python run.py`)
  9. **Environment Variables** — table with all env vars, descriptions, and defaults
  10. **Deployment** — Vercel (frontend) + Hugging Face Spaces (backend) with placeholder URLs
  11. **Screenshots** — placeholder section (`<!-- Add screenshots here -->`)
- [ ] T033 [US5] Verify markdown formatting renders correctly (no broken tables, proper headings)

**Commit**: `docs: professional readme for portfolio showcase`

**Checkpoint**: README is portfolio-quality with all 11 sections.

---

## Phase 7: LinkedIn Post — US6 (Priority: P6)

**Goal**: Professional LinkedIn showcase text saved as project artifact.

**Independent Test**: Read LINKEDIN_POST.md — engaging, professional, covers all achievements.

- [ ] T034 [US6] Create `LINKEDIN_POST.md` with professional LinkedIn post text:
  - Opening: "Hackathon II — All phases completed and live now"
  - Paragraph 1: Project overview (full-stack Todo app with AI chatbot)
  - Paragraph 2: Technical highlights (Next.js 16, FastAPI, JWT auth, OpenRouter AI)
  - Paragraph 3: DevOps & quality (Docker Compose, GitHub Actions CI/CD, pytest + Jest)
  - Paragraph 4: Deployment (Vercel frontend, Hugging Face Spaces backend)
  - Closing: Call-to-action with GitHub repo link placeholder and live demo URL placeholder
  - Hashtags: #FullStack #AI #NextJS #FastAPI #Docker #CICD #Hackathon
- [ ] T035 [US6] Review post for professional tone and conciseness

**Commit**: `docs: add linkedin showcase post`

**Checkpoint**: LinkedIn post artifact ready for publishing.

---

## Phase 8: Final Verification

**Purpose**: End-to-end validation that all Phase 5 changes are correct and nothing is broken.

- [ ] T036 Run `cd backend && pytest -v` — all backend tests pass
- [ ] T037 Run `cd frontend && npm test` — all frontend tests pass
- [ ] T038 Run `docker compose up --build` — both services start and health check passes
- [ ] T039 Verify: no UI changes (visual spot check at http://localhost:3000)
- [ ] T040 Verify: no route changes (test auth + todo endpoints at http://localhost:8000/docs)
- [ ] T041 Verify: spec history intact — `specs/001-*`, `specs/002-*`, `specs/003-*`, `specs/004-*` all present
- [ ] T042 Verify: all commits follow conventional format (`chore:`, `test:`, `ci:`, `docs:`)

**Checkpoint**: Phase 5 complete. All quality layers added. Application unchanged. Ready for showcase.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Cleanup)**: No dependencies — do first
- **Phase 2 (Backend Tests)**: No dependencies — can start after Phase 1
- **Phase 3 (Frontend Tests)**: No dependencies — can start after Phase 1
- **Phase 4 (CI/CD)**: Depends on Phase 2 + Phase 3 (needs test commands)
- **Phase 5 (Logging)**: No dependencies — can run parallel with Phase 2/3
- **Phase 6 (README)**: Depends on Phases 2-5 (references tests, CI/CD, logging)
- **Phase 7 (LinkedIn)**: Depends on Phase 6 (references project)
- **Phase 8 (Verification)**: Depends on all previous phases

### Parallel Opportunities

```
Phase 1 (Cleanup)
    ↓
Phase 2 (Backend Tests) ──┐
Phase 3 (Frontend Tests) ─┤── can run in parallel
Phase 5 (Logging) ────────┘
    ↓
Phase 4 (CI/CD) ← after 2+3
    ↓
Phase 6 (README) ← after all above
    ↓
Phase 7 (LinkedIn) ← after README
    ↓
Phase 8 (Verification) ← final
```

Within phases, tasks marked [P] can run in parallel:
- T010, T011, T012 (backend test files)
- T019, T020, T021 (frontend test files)

### Commit Sequence

```
1. chore: verify repository cleanup and gitignore coverage
2. test: add backend pytest test suite for auth, todos, and health
3. test: add frontend jest test suite for pages and components
4. ci: add github actions pipeline for backend and frontend
5. chore: add structured logging configuration
6. docs: professional readme for portfolio showcase
7. docs: add linkedin showcase post
```

---

## Implementation Strategy

### Sequential Execution (Solo Developer)

1. Complete Phase 1 (Cleanup) → verify clean
2. Complete Phase 2 (Backend Tests) → verify pytest passes
3. Complete Phase 3 (Frontend Tests) → verify jest passes
4. Complete Phase 4 (CI/CD) → push and verify Actions
5. Complete Phase 5 (Logging) → verify log format
6. Complete Phase 6 (README) → verify on GitHub
7. Complete Phase 7 (LinkedIn) → review post
8. Complete Phase 8 (Verification) → final check

### Summary

| Metric | Value |
| ------ | ----- |
| Total tasks | 42 |
| Phase 1 (Cleanup) | 5 tasks |
| Phase 2 (Backend Tests) | 9 tasks |
| Phase 3 (Frontend Tests) | 9 tasks |
| Phase 4 (CI/CD) | 3 tasks |
| Phase 5 (Logging) | 4 tasks |
| Phase 6 (README) | 3 tasks |
| Phase 7 (LinkedIn) | 2 tasks |
| Phase 8 (Verification) | 7 tasks |
| Parallel opportunities | 6 task groups |
| Commits | 7 conventional commits |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All tests must be self-contained (in-memory DB, mocked APIs)
- Commit after each phase/group — not after every task
- Phase 8 is mandatory — validates nothing is broken
- DO NOT modify: UI, features, routes, Docker, chatbot, spec history
