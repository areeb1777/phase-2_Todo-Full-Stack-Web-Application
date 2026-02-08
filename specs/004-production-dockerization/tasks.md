# Tasks: Production Infrastructure & Dockerization

**Input**: Design documents from `/specs/004-production-dockerization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual smoke tests only (infrastructure validation). No automated test frameworks added per Phase 4 scope.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each deliverable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `backend/`, `frontend/`, root-level configs
- All Dockerfiles and configs in their respective service directories
- Root-level: `docker-compose.yml`, `.dockerignore`, updated `.gitignore`, updated `README.md`

---

## Phase 1: User Story 3 - Clean Repository Structure (Priority: P2)

**Goal**: Ensure repository hygiene with proper gitignore rules and removal of tracked artifacts

**Independent Test**: Clone repository, build both services, run `git status` - no untracked dev artifacts should appear

**Why First**: Repository cleanup must happen before Docker setup to avoid copying unnecessary files into build contexts. This enables faster builds and smaller images.

### Implementation for User Story 3

- [x] T001 [US3] Update `.gitignore` at repository root with Docker artifacts
  ```
  Add to .gitignore:
  # Docker artifacts
  *.log
  docker-compose.override.yml

  # Ensure existing exclusions (verify, don't duplicate):
  node_modules/
  venv/
  __pycache__/
  .next/
  dist/
  build/
  *.db
  *.db-journal
  .env
  !.env.example
  ```

- [x] T002 [US3] Remove `venv/` directory from working tree if present
  ```bash
  rm -rf venv/
  ```

- [x] T003 [US3] Verify git status is clean after building projects
  ```bash
  # Test acceptance:
  cd backend && pip install -r requirements.txt && cd ..
  cd frontend && npm install && cd ..
  git status  # Should show no untracked files
  du -sh . --exclude=.git  # Should be <50MB
  ```

**Checkpoint**: Repository is clean and ready for Docker setup. Commit with `chore(gitignore): cleanup ignored files and remove venv`

---

## Phase 2: User Story 2 - Secure Environment Configuration (Priority: P1)

**Goal**: Document all required environment variables in .env.example files with clear comments

**Independent Test**: Verify no secrets in git history, .env.example files exist with placeholders, app fails gracefully when vars missing

**Why Second**: Environment configuration must be documented before Docker setup so containers can reference these variables. Security baseline established early.

### Implementation for User Story 2

- [x] T004 [P] [US2] Verify and update `backend/.env.example` with all required variables
  ```ini
  # File: backend/.env.example
  # Ensure includes (add if missing, update comments):

  # JWT Secret Key (REQUIRED - change in production)
  JWT_SECRET_KEY=your-super-secret-key-change-in-production

  # Database URL (OPTIONAL - defaults to SQLite)
  # Local: sqlite:///./todo_dev.db
  # Production: postgresql://user:pass@host:port/dbname
  DATABASE_URL=sqlite:///./todo_dev.db

  # OpenRouter API Configuration (REQUIRED for chatbot)
  OPENAI_API_KEY=your-openrouter-api-key-here
  OPENAI_BASE_URL=https://openrouter.ai/api/v1
  MODEL=mistralai/mistral-7b-instruct
  ```

- [x] T005 [P] [US2] Verify and update `frontend/.env.example` with required variables
  ```ini
  # File: frontend/.env.example
  # Ensure includes:

  # Backend API URL (REQUIRED)
  # For Docker Compose: http://localhost:8000
  # For production: https://your-backend-url.com
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

- [x] T006 [US2] Verify no secrets exist in git history
  ```bash
  # Test acceptance:
  git log -p | grep -i "api_key\|secret\|password" || echo "No secrets found"
  # If secrets found: must be placeholder values, not actual secrets
  ```

- [x] T007 [US2] Test application fails gracefully with missing env vars
  ```bash
  # Rename .env temporarily, start backend, verify clear error
  # Expected: KeyError with variable name shown
  ```

**Checkpoint**: Environment variables documented and secured. Commit with `chore(env): document all environment variables in .env.example`

---

## Phase 3: User Story 1 - One-Command Local Deployment (Priority: P1) 🎯 MVP

**Goal**: Enable `docker compose up` to start full stack locally

**Independent Test**: Run `docker compose up` in fresh clone - both services start, frontend accessible at localhost:3000, backend at localhost:8000

**Why Third**: Core Docker infrastructure. This is the primary deliverable of Phase 4. Once complete, developers can run the entire stack with one command.

### Step 1: Backend Dockerization

- [x] T008 [P] [US1] Create `backend/.dockerignore` with build context exclusions
  ```
  # File: backend/.dockerignore
  __pycache__
  *.pyc
  *.pyo
  *.pyd
  .Python
  venv/
  env/
  .env
  *.db
  *.db-journal
  .git
  .gitignore
  README.md
  tests/
  ```

- [x] T009 [US1] Create `backend/Dockerfile.local` with Python 3.12 slim image
  ```dockerfile
  # File: backend/Dockerfile.local
  FROM python:3.12-slim

  WORKDIR /app

  # Install curl for health checks
  RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      && rm -rf /var/lib/apt/lists/*

  # Copy and install dependencies
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  # Copy application code
  COPY . .

  # Create non-root user
  RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
  USER appuser

  # Expose port
  EXPOSE 8000

  # Health check
  HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

  # Run application
  CMD ["python", "run.py"]
  ```

- [x] T010 [US1] Test backend Docker build and run
  ```bash
  # Test acceptance:
  cd backend
  docker build -f Dockerfile.local -t todo-backend .
  docker run -d -p 8000:8000 --name test-backend todo-backend
  curl http://localhost:8000/health  # Should return 200
  docker stop test-backend && docker rm test-backend
  docker images todo-backend  # Size should be <500MB
  ```

**Checkpoint**: Backend containerized successfully. Commit with `feat(docker): add backend dockerfile for local development`

### Step 2: Frontend Dockerization

- [x] T011 [P] [US1] Create `frontend/.dockerignore` with build context exclusions
  ```
  # File: frontend/.dockerignore
  node_modules
  .next
  .git
  .gitignore
  *.log
  .env.local
  .env.*.local
  README.md
  ```

- [x] T012 [US1] Update `frontend/next.config.ts` to enable standalone output
  ```typescript
  # File: frontend/next.config.ts
  # Add to config object:
  output: 'standalone',
  ```

- [x] T013 [US1] Create `frontend/Dockerfile` with multi-stage build
  ```dockerfile
  # File: frontend/Dockerfile
  # Build stage
  FROM node:18-alpine AS builder

  WORKDIR /app

  # Copy package files
  COPY package*.json ./

  # Install dependencies
  RUN npm ci

  # Copy source code
  COPY . .

  # Build application
  ENV NEXT_TELEMETRY_DISABLED=1
  RUN npm run build

  # Production stage
  FROM node:18-alpine AS runner

  WORKDIR /app

  ENV NODE_ENV=production
  ENV NEXT_TELEMETRY_DISABLED=1

  # Create non-root user
  RUN addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 nextjs

  # Copy built application
  COPY --from=builder /app/public ./public
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

  USER nextjs

  EXPOSE 3000

  ENV PORT=3000
  ENV HOSTNAME="0.0.0.0"

  CMD ["node", "server.js"]
  ```

- [x] T014 [US1] Test frontend Docker build and run
  ```bash
  # Test acceptance:
  cd frontend
  docker build -t todo-frontend .
  docker run -d -p 3000:3000 --name test-frontend \
    -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
    todo-frontend
  curl -I http://localhost:3000  # Should return 200
  docker stop test-frontend && docker rm test-frontend
  docker images todo-frontend  # Size should be <1GB
  ```

**Checkpoint**: Frontend containerized successfully. Commit with `feat(docker): add frontend dockerfile with multi-stage build`

### Step 3: Docker Compose Orchestration

- [x] T015 [US1] Create root `.dockerignore` for compose context
  ```
  # File: .dockerignore (repository root)
  node_modules
  venv
  __pycache__
  .git
  .env
  *.log
  .next
  *.db
  specs/
  history/
  .specify/
  ```

- [x] T016 [US1] Create `docker-compose.yml` with backend and frontend services
  ```yaml
  # File: docker-compose.yml (repository root)
  version: '3.8'

  services:
    backend:
      build:
        context: ./backend
        dockerfile: Dockerfile.local
      ports:
        - "8000:8000"
      environment:
        - DATABASE_URL=sqlite:///./todo_dev.db
        - JWT_SECRET_KEY=${JWT_SECRET_KEY:-change-me-in-production}
        - OPENAI_API_KEY=${OPENAI_API_KEY}
        - OPENAI_BASE_URL=${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}
        - MODEL=${MODEL:-mistralai/mistral-7b-instruct}
      volumes:
        - backend-data:/app
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
        interval: 30s
        timeout: 10s
        retries: 3
        start_period: 40s
      restart: unless-stopped

    frontend:
      build:
        context: ./frontend
      ports:
        - "3000:3000"
      environment:
        - NEXT_PUBLIC_API_URL=http://localhost:8000
      depends_on:
        backend:
          condition: service_healthy
      restart: unless-stopped

  volumes:
    backend-data:
  ```

- [x] T017 [US1] Test full stack with docker compose
  ```bash
  # Test acceptance:
  docker compose up --build -d
  # Wait for services to start (~2 minutes)
  docker compose ps  # Both services should show "Up (healthy)"
  curl http://localhost:8000/health  # Returns 200
  curl -I http://localhost:3000  # Returns 200
  docker compose down -v
  ```

**Checkpoint**: Full stack runs with `docker compose up`. Commit with `feat(docker): add docker-compose orchestration for local development`

---

## Phase 4: User Story 4 - Production Health Monitoring (Priority: P2)

**Goal**: Verify existing health check endpoint and logging are properly configured

**Independent Test**: Backend /health endpoint returns 200, logs include timestamps and levels

**Why Fourth**: Health check already exists (backend/main.py:46-48). This phase is verification only to ensure Docker health checks work correctly. No code changes per Phase 4 constraints.

### Implementation for User Story 4

- [x] T018 [US4] Verify `/health` endpoint exists and returns correct format in `backend/main.py`
  ```python
  # File: backend/main.py (VERIFY ONLY - should exist at lines 46-48)
  @app.get("/health")
  def health_check():
      return {"status": "healthy", "message": "Todo API is running"}
  ```

- [x] T019 [US4] Verify structured logging is configured in `backend/main.py`
  ```python
  # File: backend/main.py (VERIFY ONLY - should exist at lines 12-13)
  logging.basicConfig(level=logging.INFO)
  logger = logging.getLogger(__name__)
  ```

- [x] T020 [US4] Verify startup is idempotent in `backend/app/utils.py`
  ```python
  # File: backend/app/utils.py (VERIFY ONLY)
  # Should have ensure_tables_exist() function
  ```

- [x] T021 [US4] Test health check endpoint manually
  ```bash
  # Test acceptance (with Docker running):
  docker compose up -d backend
  time curl http://localhost:8000/health  # Response <100ms
  # Expected: {"status":"healthy","message":"Todo API is running"}
  docker compose logs backend | grep INFO  # Logs show timestamps
  docker compose down
  ```

**Checkpoint**: Health monitoring verified and functional. No commit needed (verification only, no changes).

---

## Phase 5: User Story 5 - Deployment Documentation (Priority: P3)

**Goal**: Comprehensive README with Docker setup, architecture, and troubleshooting

**Independent Test**: New developer follows README and successfully runs `docker compose up` within 10 minutes

**Why Fifth**: Documentation is the final polish. System is fully functional without it, but docs improve developer experience and onboarding.

### Implementation for User Story 5

- [ ] T022 [US5] Add Docker Deployment section to `README.md`
  ```markdown
  # File: README.md (APPEND after existing content)

  ## Docker Deployment (Local Development)

  ### Prerequisites
  - Docker Engine 20.10+
  - Docker Compose 2.0+

  ### Quick Start

  1. Clone the repository:
     ```bash
     git clone <repo-url>
     cd Phase-II_Full-Stack-Todo-App
     ```

  2. Set up environment variables:
     ```bash
     # Backend
     cp backend/.env.example backend/.env
     # Edit backend/.env and add your OPENAI_API_KEY

     # Frontend
     cp frontend/.env.example frontend/.env.local
     # Edit frontend/.env.local if needed (defaults work)
     ```

  3. Start the application:
     ```bash
     docker compose up --build
     ```

  4. Access the application:
     - Frontend: http://localhost:3000
     - Backend API: http://localhost:8000/docs
     - Health Check: http://localhost:8000/health

  ### Architecture

  ```
  [Browser] -> [Frontend :3000] -> [Backend :8000] -> [SQLite DB]
               (Next.js)            (FastAPI)         (Volume)
  ```

  **Services:**
  - Frontend: Next.js 16 with React 19, Tailwind CSS, TypeScript
  - Backend: FastAPI with SQLAlchemy, JWT auth, OpenRouter chatbot
  - Database: SQLite (local), Neon PostgreSQL (production)

  ### Troubleshooting

  **Port conflicts:**
  ```bash
  # Edit docker-compose.yml port mappings
  ports:
    - "3001:3000"  # Frontend on 3001
  ```

  **Environment variable errors:**
  - Ensure `backend/.env` has JWT_SECRET_KEY and OPENAI_API_KEY
  - Ensure `frontend/.env.local` has NEXT_PUBLIC_API_URL

  **Build failures:**
  ```bash
  docker compose down -v
  docker compose build --no-cache
  docker compose up
  ```

  ### Existing Deployments

  **Production deployments are SEPARATE from Docker:**
  - Frontend: Vercel (uses `vercel.json`)
  - Backend: Hugging Face Spaces (uses `backend/Dockerfile`)

  Docker Compose is for **local development only**.
  ```

- [ ] T023 [US5] Test README instructions with fresh developer perspective
  ```bash
  # Test acceptance:
  # Follow README from clean state
  # Time the setup process (should be <10 minutes)
  # Verify all links work (localhost:3000, localhost:8000)
  # Test troubleshooting steps
  ```

**Checkpoint**: Documentation complete and validated. Commit with `docs(readme): add docker usage guide and troubleshooting`

---

## Phase 6: Final Verification & Acceptance

**Goal**: Comprehensive smoke testing of all user stories and existing functionality

**Independent Test**: Full system works via Docker, no regressions in existing features, deployments unaffected

### Final Verification Tasks

- [ ] T024 Clean environment test
  ```bash
  # Test acceptance:
  docker compose down -v
  rm -rf backend/__pycache__ frontend/.next
  docker compose up --build
  # Wait for startup (~2 minutes)
  # Both services should be healthy
  ```

- [ ] T025 Test User Story 1: One-Command Deployment
  ```bash
  # Verify:
  docker compose up  # Both services start without errors
  curl http://localhost:3000  # Frontend loads
  curl http://localhost:8000/docs  # Backend API docs accessible
  ```

- [ ] T026 Test User Story 2: Environment Configuration
  ```bash
  # Verify:
  git log -p | grep -i "api_key\|secret" | grep -v "example"
  # Should find no actual secrets
  cat backend/.env.example  # All variables documented
  cat frontend/.env.example  # NEXT_PUBLIC_API_URL documented
  ```

- [ ] T027 Test User Story 3: Repository Cleanliness
  ```bash
  # Verify:
  npm install  # Install dependencies
  git status  # Should show clean (no untracked node_modules)
  du -sh . --exclude=.git  # Size <50MB
  ```

- [ ] T028 Test User Story 4: Health Monitoring
  ```bash
  # Verify:
  time curl http://localhost:8000/health  # <100ms response
  docker compose logs backend | grep "INFO"  # Structured logs present
  ```

- [ ] T029 Test User Story 5: Documentation
  ```bash
  # Verify:
  # Follow README quick start
  # Check architecture diagram is clear
  # Test troubleshooting steps
  # Time setup (should be <10 minutes)
  ```

- [ ] T030 Test core application functionality (NO REGRESSIONS)
  ```bash
  # Open http://localhost:3000 in browser
  # Test:
  # 1. Register new account (auth works)
  # 2. Login with credentials (auth works)
  # 3. Create a todo (CRUD works)
  # 4. Edit a todo (CRUD works)
  # 5. Delete a todo (CRUD works)
  # 6. Send message to chatbot (OpenRouter integration works)
  # 7. Verify UI unchanged (compare screenshots if needed)
  ```

- [ ] T031 Verify existing deployments unaffected
  ```bash
  # Check production deployments:
  # 1. Visit Vercel frontend URL - should work as before
  # 2. Visit Hugging Face Spaces backend - should work as before
  # 3. Test production features (register, login, todos, chatbot)
  # 4. Confirm no regressions in production
  ```

- [ ] T032 Verify all commits are on main branch with correct format
  ```bash
  # Verify:
  git log --oneline -10  # Check commit messages
  # Expected format examples:
  # chore(gitignore): cleanup ignored files and remove venv
  # chore(env): document all environment variables
  # feat(docker): add backend dockerfile for local development
  # feat(docker): add frontend dockerfile with multi-stage build
  # feat(docker): add docker-compose orchestration
  # docs(readme): add docker usage guide and troubleshooting

  git branch  # Should show only main branch (no feature branches)
  ```

**Checkpoint**: Phase 4 complete. All acceptance criteria met.

---

## Definition of Done

Phase 4 is complete when ALL of the following are verified:

✅ **User Story 1** (P1): `docker compose up` runs full stack successfully
- Both frontend and backend services start
- Frontend accessible at http://localhost:3000
- Backend accessible at http://localhost:8000
- Services communicate correctly

✅ **User Story 2** (P1): Environment configuration secured
- No secrets in git history
- All .env.example files complete with comments
- Application fails gracefully with clear errors when vars missing

✅ **User Story 3** (P2): Repository is clean
- `git status` clean after builds
- Repository size <50MB (excluding .git)
- All dev artifacts properly gitignored

✅ **User Story 4** (P2): Health monitoring functional
- `/health` endpoint returns 200 in <100ms
- Structured logging with timestamps
- Idempotent startup

✅ **User Story 5** (P3): Documentation comprehensive
- README includes Docker sections
- Architecture diagram present
- Troubleshooting guide covers common issues
- New developer can set up in <10 minutes

✅ **No Regressions**: Existing functionality unaffected
- Auth works (register, login)
- Todos work (create, read, update, delete)
- Chatbot works (OpenRouter integration)
- UI unchanged
- Production deployments (Vercel, Hugging Face) still functional

✅ **Git Strategy**: All commits on main branch only
- Small, focused commits
- Conventional commit format (feat/chore/docs)
- No feature branches created

---

## Dependency Graph

```
Phase 1 (US3: Repository Cleanup)
└─> Phase 2 (US2: Environment Config)
    └─> Phase 3 (US1: Docker Setup) 🎯 MVP
        ├─> Backend Dockerization (T008-T010)
        ├─> Frontend Dockerization (T011-T014)
        └─> Docker Compose (T015-T017)
            └─> Phase 4 (US4: Health Monitoring)
                └─> Phase 5 (US5: Documentation)
                    └─> Phase 6 (Final Verification)
```

**Critical Path**: US3 → US2 → US1 → US4 → US5 → Verification

**Parallel Opportunities**:
- T001-T003 (US3) can run in any order
- T004 and T005 (US2) can run in parallel
- T008 and T011 (US1 backend/frontend dockerization) can run in parallel after T001-T007
- T018-T020 (US4) are verification tasks, can run in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

Complete User Stories 1, 2, and 3 for MVP:
- US3: Clean repository (T001-T003)
- US2: Secure environment config (T004-T007)
- US1: Docker setup (T008-T017)

**MVP Delivers**: Developers can run `docker compose up` and have a fully functional local environment with secure configuration and clean repository.

### Incremental Delivery

1. **Sprint 1** (MVP): US3 + US2 + US1 (T001-T017) - ~60 minutes
2. **Sprint 2** (Enhancement): US4 (T018-T021) - ~10 minutes
3. **Sprint 3** (Polish): US5 (T022-T023) - ~20 minutes
4. **Sprint 4** (Validation): Final verification (T024-T032) - ~15 minutes

**Total Estimated Time**: ~115 minutes (matching plan.md implementation sequence)

### Suggested Execution Order

For manual implementation (following user's git strategy):

1. Execute Phase 1 (US3: Repository Cleanup) - T001-T003
2. Commit: `chore(gitignore): cleanup ignored files and remove venv`
3. Execute Phase 2 (US2: Environment Config) - T004-T007
4. Commit: `chore(env): document all environment variables in .env.example`
5. Execute Phase 3 Step 1 (Backend Docker) - T008-T010
6. Commit: `feat(docker): add backend dockerfile for local development`
7. Execute Phase 3 Step 2 (Frontend Docker) - T012-T014
8. Commit: `feat(docker): add frontend dockerfile with multi-stage build`
9. Execute Phase 3 Step 3 (Docker Compose) - T015-T017
10. Commit: `feat(docker): add docker-compose orchestration for local development`
11. Execute Phase 4 (US4: Health Monitoring) - T018-T021 (verification only, no commit)
12. Execute Phase 5 (US5: Documentation) - T022-T023
13. Commit: `docs(readme): add docker usage guide and troubleshooting`
14. Execute Phase 6 (Final Verification) - T024-T032
15. Final validation and Phase 4 sign-off

---

## Task Summary

**Total Tasks**: 32
- **Setup/Cleanup**: 3 tasks (T001-T003)
- **Environment Config**: 4 tasks (T004-T007)
- **Docker Infrastructure**: 10 tasks (T008-T017)
- **Health Monitoring**: 4 tasks (T018-T021)
- **Documentation**: 2 tasks (T022-T023)
- **Final Verification**: 9 tasks (T024-T032)

**Parallelizable Tasks**: 8 tasks marked with [P]
**User Story Distribution**:
- US1 (One-Command Deployment): 10 tasks
- US2 (Environment Config): 4 tasks
- US3 (Repository Cleanup): 3 tasks
- US4 (Health Monitoring): 4 tasks
- US5 (Documentation): 2 tasks
- Final Verification: 9 tasks

**Critical Path Duration**: ~115 minutes (matching plan.md estimates)

---

## Notes

- **No Test Tasks**: Infrastructure validation uses manual smoke tests. No automated test frameworks added per Phase 4 constraints.
- **Git Strategy**: All work on main branch with small commits per user specification.
- **Phase 4 Constraints**: Zero changes to UI, business logic, API contracts, or chatbot behavior. Only infrastructure files modified.
- **Existing Deployments**: Vercel (frontend) and Hugging Face Spaces (backend) must remain functional throughout.
- **File References**: All tasks include exact file paths for clarity and immediate executability.
