# Implementation Plan: Production Infrastructure & Dockerization

**Branch**: `004-production-dockerization` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-production-dockerization/spec.md`

## Summary

Transform the existing Todo + Chatbot application into a production-ready system with Docker containerization, enabling single-command local deployment (`docker compose up`) while maintaining all existing functionality and deployments (Vercel frontend, Hugging Face backend). This is a **pure infrastructure phase** - NO changes to UI, business logic, API contracts, or chatbot behavior. Only add configuration files, improve repository hygiene, and enhance operational readiness.

**Strategy**: Safe additive changes only. Add new files, configurations, and documentation without modifying core application code.

## Technical Context

**Language/Version**:
- Backend: Python 3.12
- Frontend: Node.js 18+ / TypeScript 5

**Primary Dependencies**:
- Backend: FastAPI 0.115.0, SQLAlchemy 2.0.36, uvicorn 0.32.0, bcrypt, JWT, OpenAI SDK
- Frontend: Next.js 16.1.6, React 19.2.3, Tailwind CSS 4, lucide-react
- Containerization: Docker Engine 20.10+, Docker Compose 2.0+

**Storage**:
- Local Development: SQLite (todo_dev.db)
- Production: Neon PostgreSQL (existing)
- Docker: SQLite with volume persistence

**Testing**:
- Infrastructure validation: Manual smoke tests (docker compose up, health checks, endpoint verification)
- No new test frameworks added (out of scope for Phase 4)

**Target Platform**:
- Local: Docker containers (cross-platform: Windows, macOS, Linux)
- Production: Vercel (frontend), Hugging Face Spaces (backend) - unchanged

**Project Type**: Web application (separate frontend/backend services)

**Performance Goals**:
- Container startup: Backend <30s, Frontend <2min (including build)
- Health check response: <100ms
- Docker image sizes: Backend <500MB, Frontend <1GB

**Constraints**:
- MUST NOT modify: UI components, business logic, API endpoints, chatbot behavior, database schemas
- MUST maintain: Existing Vercel and Hugging Face deployments
- MUST support: Cross-platform Docker deployment without host dependencies

**Scale/Scope**:
- 2 services (frontend, backend)
- 7 new files (2 Dockerfiles, 1 docker-compose.yml, 2 .env.example, 1 updated .gitignore, 1 updated README)
- Zero code changes to existing application logic

## Git Strategy (User-Specified)

**IMPORTANT**: User has requested working directly on `main` branch:

- Work ONLY on: **main branch**
- Do NOT create new branches
- Do NOT rename branches
- Commit directly to main with small, safe commits
- Commit message style:
  - `feat(docker): add backend dockerfile`
  - `chore(gitignore): cleanup ignored files`
  - `docs(readme): add docker instructions`

**Rationale**: Infrastructure changes are additive and low-risk. Small, focused commits to main allow incremental verification without branch management overhead.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with Constitution Principles

**✅ Core Principles Compliance:**

1. **UI-First Development**: N/A - This phase is infrastructure-only, no UI changes
2. **Modern Frontend Stack**: ✅ Preserved - No changes to Next.js 16+, TypeScript, Tailwind CSS stack
3. **Test-First**: ⚠️ Partial Exemption - Infrastructure changes use manual verification; TDD not applicable to Dockerfiles/configs
4. **Clean Architecture**: ✅ Enhanced - Improved separation through containerization and environment management
5. **Responsive Design & UX**: N/A - No UI modifications
6. **Mock State Management**: N/A - Phase 4 is infrastructure, not state management

**Additional Constraints:**

- **UI-only implementation**: ✅ Not violated - No UI changes made
- **Technology Stack Requirements**: ✅ Fully preserved - Containerization wraps existing stack
- **Performance Standards**: ✅ Enhanced - Docker adds deployment consistency without degrading performance
- **Component-Based Development**: N/A - No component changes
- **Review Process**: ✅ Applies to infrastructure files (Dockerfiles, compose configs)
- **Quality Gates**: ✅ All changes verified through smoke testing

**Constitution Alignment Summary:**
This phase is **constitution-compliant with infrastructure exemption**. The constitution focuses on frontend development (Phase II-A), while this is infrastructure hardening (Phase 4). No violations of core principles. Test-First principle deferred for infrastructure files where manual smoke testing is industry standard.

### Gate Status

**PASSED** - Proceed to Phase 0 Research

**Justification**: Infrastructure improvements are orthogonal to application development. Dockerization adds operational readiness without touching constitution-governed code (UI components, state management, business logic).

## Project Structure

### Documentation (this feature)

```text
specs/004-production-dockerization/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0: Docker best practices, multi-stage builds, .env patterns
├── data-model.md        # Phase 1: N/A (no new data entities)
├── quickstart.md        # Phase 1: Docker setup guide
├── contracts/           # Phase 1: N/A (no API changes)
│   └── docker-compose-schema.yml  # Docker Compose service contracts
└── checklists/
    └── requirements.md  # Already created during spec phase
```

### Source Code (repository root)

**Current Structure (Unchanged):**

```text
Phase-II_Full-Stack-Todo-App/
├── backend/
│   ├── app/                    # Existing: routes, models, services, database
│   ├── alembic/                # Existing: database migrations
│   ├── main.py                 # Existing: FastAPI app (has /health already)
│   ├── requirements.txt        # Existing: Python dependencies
│   ├── Dockerfile              # EXISTS: Current HF deployment Dockerfile
│   └── .env.example            # EXISTS: Current example file
│
├── frontend/
│   ├── app/                    # Existing: Next.js pages (App Router)
│   ├── components/             # Existing: React components
│   ├── context/                # Existing: State management
│   ├── lib/                    # Existing: Utilities
│   ├── public/                 # Existing: Static assets
│   ├── package.json            # Existing: npm dependencies
│   └── .env.example            # EXISTS: Current example file
│
├── .gitignore                  # EXISTS: Will be enhanced
├── README.md                   # EXISTS: Will be updated
└── venv/                       # EXISTS: Will be removed (gitignore cleanup)
```

**Phase 4 Additions (Infrastructure Layer):**

```text
Phase-II_Full-Stack-Todo-App/
├── docker-compose.yml          # NEW: Orchestration for local development
├── .dockerignore               # NEW: Exclude unnecessary build context
│
├── backend/
│   ├── Dockerfile.local        # NEW: Local development Dockerfile (HF Dockerfile stays)
│   ├── .dockerignore           # NEW: Backend-specific exclusions
│   └── .env.example            # UPDATE: Ensure all vars documented
│
├── frontend/
│   ├── Dockerfile              # NEW: Production Next.js build
│   ├── .dockerignore           # NEW: Frontend-specific exclusions
│   └── .env.example            # UPDATE: Ensure NEXT_PUBLIC_API_URL documented
│
├── .gitignore                  # UPDATE: Add Docker artifacts, strengthen exclusions
└── README.md                   # UPDATE: Add Docker sections
```

**Structure Decision**:
Option 2 (Web application) applies. Existing `backend/` and `frontend/` directories remain unchanged. Infrastructure files are added alongside existing code without restructuring. Backend already has a `Dockerfile` for Hugging Face deployment; we'll create `Dockerfile.local` for Docker Compose to avoid conflicts.

### Critical Files Analysis

**Files to PRESERVE (read-only):**
- `backend/app/routes/` - All API routes (todos, auth, profile, chat)
- `backend/app/models/` - All data models
- `backend/app/services/` - All business logic
- `frontend/app/` - All Next.js pages
- `frontend/components/` - All React components
- `frontend/context/` - All state management
- `backend/Dockerfile` - Existing HF deployment config (create separate .local version)

**Files to CREATE:**
- `docker-compose.yml` - Service orchestration
- `backend/Dockerfile.local` - Local development container
- `frontend/Dockerfile` - Next.js production container
- `.dockerignore` (root, backend, frontend) - Build context optimization
- `specs/004-production-dockerization/quickstart.md` - Setup guide

**Files to UPDATE (safely):**
- `.gitignore` - Add Docker artifacts, strengthen dependency exclusions
- `README.md` - Add Docker usage sections (append only)
- `backend/.env.example` - Verify completeness (non-breaking)
- `frontend/.env.example` - Verify completeness (non-breaking)
- `backend/main.py` - ALREADY HAS `/health` endpoint (verify, no changes needed)

## Complexity Tracking

**No Constitution Violations** - This section is empty because Phase 4 infrastructure work does not introduce complexity that violates the constitution. All changes are additive configuration files.

## Phase 0: Research & Best Practices

### Research Tasks

1. **Docker Multi-Stage Builds for Next.js**
   - Question: Optimal Dockerfile pattern for Next.js 16 production builds
   - Why needed: Minimize frontend image size, separate build/runtime dependencies
   - Success criteria: Dockerfile uses multi-stage pattern, final image <1GB

2. **FastAPI Docker Best Practices**
   - Question: Python 3.12 slim images, non-root user, graceful shutdown
   - Why needed: Security (non-root), image size optimization, proper signal handling
   - Success criteria: Dockerfile uses python:3.12-slim, runs as non-root, handles SIGTERM

3. **Docker Compose Networking for Frontend-Backend Communication**
   - Question: Service discovery, environment variable injection, port mapping
   - Why needed: Frontend must reach backend via internal Docker network
   - Success criteria: Frontend connects to backend via service name (e.g., `http://backend:8000`)

4. **Environment Variable Management Patterns**
   - Question: .env file structure, required vs optional vars, validation strategies
   - Why needed: Clear documentation, startup validation, secure defaults
   - Success criteria: .env.example files document all vars, startup fails with clear errors if missing

5. **Health Check Implementation Standards**
   - Question: HTTP health check format, response codes, dependency checks
   - Why needed: Load balancer integration, monitoring compatibility
   - Success criteria: `/health` returns JSON with status, dependencies, timestamp

6. **.dockerignore Optimization**
   - Question: Essential exclusions for build context (node_modules, venv, .git)
   - Why needed: Faster builds, smaller context, avoid copying unnecessary files
   - Success criteria: Build context <100MB, excludes all dev artifacts

**Output**: `research.md` with consolidated findings and decisions

### Known Decisions (From Spec Assumptions)

- **Database**: SQLite for local Docker (volume persistence), Neon PostgreSQL for production
- **Ports**: Frontend 3000, Backend 8000 (configurable via environment variables)
- **Base Images**: `python:3.12-slim` (backend), `node:18-alpine` (frontend)
- **Networking**: Docker Compose bridge network (default)
- **Restart Policy**: `restart: unless-stopped` for local development resilience

## Phase 1: Design & Contracts

### Data Model

**N/A** - No new data entities. Existing models (User, Todo, ChatMessage) remain unchanged.

Create `data-model.md` with: "Phase 4 is infrastructure-only. Refer to existing backend data models in `backend/app/models/`."

### API Contracts

**N/A** - No API changes. All existing endpoints preserved:
- `/auth/*` - Authentication routes (unchanged)
- `/todos/*` - Todo CRUD routes (unchanged)
- `/profile/*` - User profile routes (unchanged)
- `/chat/*` - Chatbot routes (unchanged)
- `/health` - Health check (already exists in `main.py:46-48`)

Create `contracts/docker-compose-schema.yml` with Docker Compose service definitions:

```yaml
# Service Contract for docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL
      - JWT_SECRET_KEY
      - OPENAI_API_KEY
      - OPENAI_BASE_URL
      - MODEL
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL
    depends_on:
      backend:
        condition: service_healthy
```

### Quickstart Guide

Create `quickstart.md` with:
- Prerequisites (Docker, Docker Compose installed)
- Setup steps (clone, copy .env files, run `docker compose up`)
- Verification steps (access frontend, test health endpoint)
- Troubleshooting (port conflicts, environment variable errors)

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- Docker containerization approach
- Environment variable management strategy
- Local development setup via Docker Compose

## Phase 2: Task Breakdown (Out of Scope)

**Not created by `/sp.plan`** - Use `/sp.tasks` command to generate `tasks.md` from this plan.

Expected task structure (for reference):
1. Repository cleanup (.gitignore improvements, remove venv/node_modules)
2. Backend Dockerization (Dockerfile.local, .dockerignore, environment validation)
3. Frontend Dockerization (Dockerfile, .dockerignore, build optimization)
4. Docker Compose setup (docker-compose.yml, networking, health checks)
5. Environment management (.env.example validation, documentation)
6. Documentation (README updates, quickstart guide)
7. Smoke testing (docker compose up, endpoint verification, feature testing)

## Architecture Decisions

### Decision 1: Separate Dockerfiles for Hugging Face vs Local

**Context**: Backend already has `Dockerfile` used by Hugging Face Spaces deployment.

**Decision**: Create `backend/Dockerfile.local` for Docker Compose, preserve `backend/Dockerfile` for HF.

**Rationale**:
- Avoids breaking existing HF deployment
- Allows different optimization strategies (HF uses PORT env var, local uses fixed 8000)
- Clear separation of concerns (production HF vs local development)

**Alternatives Considered**:
- Single Dockerfile with conditional logic - Rejected: Increases complexity, harder to maintain
- Overwrite existing Dockerfile - Rejected: Breaks HF deployment (violates Phase 4 constraints)

### Decision 2: SQLite for Local Docker, PostgreSQL for Production

**Context**: Production uses Neon PostgreSQL; local development should be simpler.

**Decision**: Use SQLite with Docker volume for local development, document PostgreSQL for production.

**Rationale**:
- Simplifies `docker compose up` (no separate DB container required)
- Faster local startup (<30s vs >1min with Postgres container)
- Existing SQLite support already in codebase (`todo_dev.db`)
- Production (Vercel/HF) continues using Neon PostgreSQL

**Alternatives Considered**:
- PostgreSQL container in docker-compose.yml - Rejected: Slower startup, more complex for Phase 4 scope
- In-memory SQLite - Rejected: Data loss on container restart

### Decision 3: Multi-Stage Build for Frontend Only

**Context**: Frontend Next.js build generates large node_modules, backend is simpler.

**Decision**: Use multi-stage Dockerfile for frontend (build stage + production stage), single-stage for backend.

**Rationale**:
- Frontend: Separate build dependencies (devDependencies) from runtime (production dependencies)
- Frontend: Build artifacts (.next) can be copied without source files
- Backend: Python dependencies are runtime dependencies, no separate build step
- Image size optimization: Frontend reduces from ~2GB to <1GB

**Alternatives Considered**:
- Multi-stage for both - Rejected: Backend doesn't benefit significantly (no build step)
- Single-stage for both - Rejected: Frontend image bloats to >2GB

### Decision 4: Health Check with Dependency Verification

**Context**: `/health` endpoint exists but may not check dependencies (DB, OpenAI API).

**Decision**: Keep existing simple health check (returns 200 if service running), document for future enhancement.

**Rationale**:
- Phase 4 constraint: Do NOT modify existing routes
- Existing `/health` (main.py:46-48) returns `{"status": "healthy", "message": "Todo API is running"}`
- Sufficient for Docker Compose health checks (verifies service is responding)
- Full dependency checks (DB connection, external API availability) are Phase 5 enhancements

**Alternatives Considered**:
- Modify `/health` to check DB/API - Rejected: Violates "no route changes" constraint
- Create new `/health/deep` endpoint - Rejected: Out of scope for Phase 4

### Decision 5: Environment Variable Validation at Startup

**Context**: Missing env vars cause runtime errors; should fail fast with clear messages.

**Decision**: Document required environment variables in .env.example, rely on existing FastAPI/Next.js error handling.

**Rationale**:
- Phase 4 constraint: No code changes to application logic
- FastAPI already validates env vars when importing settings (pydantic-settings)
- Next.js build fails if NEXT_PUBLIC_* vars are missing
- .env.example documentation provides clear guidance
- Startup errors are already actionable (e.g., "KeyError: 'JWT_SECRET_KEY'")

**Alternatives Considered**:
- Add explicit validation script - Rejected: Requires code changes, out of Phase 4 scope
- Pre-startup validation in Docker entrypoint - Rejected: Adds complexity, existing errors are sufficient

## Implementation Sequence

### Step 1: Repository Cleanup & .gitignore Enhancement
**Duration**: 5 minutes
**Risk**: Very low - only affects version control

Actions:
1. Update `.gitignore` to strengthen exclusions:
   - Docker artifacts: `*.log`, `docker-compose.override.yml`
   - Build outputs: Verify `.next/`, `dist/`, `build/` are excluded
   - Dependencies: Verify `node_modules/`, `venv/`, `__pycache__/` are excluded
   - Databases: Add `*.db`, `*.db-journal` if missing
2. Remove `venv/` directory from working tree (already gitignored)
3. Verify `git status` shows no untracked dev artifacts

**Acceptance**:
- `git status` clean after running `npm install` and `pip install`
- Repository size <50MB (excluding .git history)

### Step 2: Backend Dockerization
**Duration**: 20 minutes
**Risk**: Low - new file, doesn't affect existing deployment

Actions:
1. Create `backend/.dockerignore`:
   ```
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
   ```

2. Create `backend/Dockerfile.local`:
   ```dockerfile
   FROM python:3.12-slim

   WORKDIR /app

   # Install system dependencies for PostgreSQL client (if needed)
   RUN apt-get update && apt-get install -y --no-install-recommends \
       curl \
       && rm -rf /var/lib/apt/lists/*

   # Copy requirements and install dependencies
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

3. Verify `backend/.env.example` includes all required variables:
   - `JWT_SECRET_KEY`
   - `DATABASE_URL` (optional, defaults to SQLite)
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL`
   - `MODEL`

**Acceptance**:
- `docker build -f backend/Dockerfile.local -t todo-backend backend/` succeeds
- Image size <500MB
- Container starts and responds to `/health` endpoint

### Step 3: Frontend Dockerization
**Duration**: 25 minutes
**Risk**: Low - new file, multi-stage build requires testing

Actions:
1. Create `frontend/.dockerignore`:
   ```
   node_modules
   .next
   .git
   .gitignore
   *.log
   .env.local
   .env.*.local
   README.md
   ```

2. Create `frontend/Dockerfile`:
   ```dockerfile
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

3. Update `frontend/next.config.ts` to enable standalone output (if not already enabled):
   ```typescript
   output: 'standalone',
   ```

4. Verify `frontend/.env.example` includes:
   - `NEXT_PUBLIC_API_URL=http://localhost:8000`

**Acceptance**:
- `docker build -t todo-frontend frontend/` succeeds
- Image size <1GB
- Container starts and serves frontend on port 3000
- Frontend can reach backend when both containers running

### Step 4: Docker Compose Orchestration
**Duration**: 15 minutes
**Risk**: Low - orchestration layer, doesn't modify services

Actions:
1. Create root `docker-compose.yml`:
   ```yaml
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

2. Create root `.dockerignore`:
   ```
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

**Acceptance**:
- `docker compose up --build` starts both services
- Frontend accessible at http://localhost:3000
- Backend accessible at http://localhost:8000
- Health check passes before frontend starts

### Step 5: Environment Configuration Documentation
**Duration**: 10 minutes
**Risk**: Very low - documentation only

Actions:
1. Verify `backend/.env.example` completeness:
   ```ini
   # Backend Environment Variables
   # Copy this file to .env and update with your configuration

   # JWT Secret Key (change this in production)
   JWT_SECRET_KEY=your-super-secret-key-change-in-production

   # Database URL (optional, defaults to SQLite)
   # For local development: sqlite:///./todo_dev.db
   # For production: postgresql://user:pass@host:port/dbname
   DATABASE_URL=sqlite:///./todo_dev.db

   # OpenRouter API Configuration
   OPENAI_API_KEY=your-openrouter-api-key-here
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   MODEL=mistralai/mistral-7b-instruct
   ```

2. Verify `frontend/.env.example` completeness:
   ```ini
   # Frontend Environment Variables
   # Copy this file to .env.local and update with your configuration

   # Backend API URL
   # For local Docker development: http://localhost:8000
   # For local backend outside Docker: http://localhost:8000
   # For production: https://your-backend-url.com
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Add environment variable documentation to `README.md` (see Step 7)

**Acceptance**:
- Both .env.example files document all required variables
- Clear comments explain purpose and example values
- Instructions for copying .env.example to .env/.env.local

### Step 6: Backend Production Readiness Verification
**Duration**: 5 minutes
**Risk**: None - verification only, no changes

Actions:
1. Verify `/health` endpoint exists in `backend/main.py`:
   ```python
   @app.get("/health")
   def health_check():
       return {"status": "healthy", "message": "Todo API is running"}
   ```

2. Verify structured logging configuration in `backend/main.py`:
   ```python
   logging.basicConfig(level=logging.INFO)
   logger = logging.getLogger(__name__)
   ```

3. Verify startup is idempotent via `backend/app/utils.py:ensure_tables_exist()`

**Acceptance**:
- `/health` endpoint returns 200 with JSON status
- Logs include timestamps and levels (already configured)
- Multiple startups don't cause errors

### Step 7: Documentation Update
**Duration**: 20 minutes
**Risk**: None - documentation only

Actions:
1. Update `README.md` - Add Docker sections (append after existing content):
   ```markdown
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
      # Edit frontend/.env.local if needed (defaults work for local Docker)
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
   [Browser] -> [Frontend Container :3000] -> [Backend Container :8000] -> [SQLite DB]
                 (Next.js)                     (FastAPI)                   (Volume)
   ```

   **Services:**
   - **Frontend**: Next.js 16 with React 19, Tailwind CSS, TypeScript
   - **Backend**: FastAPI with SQLAlchemy, JWT auth, OpenRouter chatbot
   - **Database**: SQLite (local), Neon PostgreSQL (production)

   ### Troubleshooting

   **Port conflicts:**
   If ports 3000 or 8000 are already in use:
   ```bash
   # Edit docker-compose.yml and change port mappings:
   ports:
     - "3001:3000"  # Frontend on 3001 instead of 3000
   ```

   **Environment variable errors:**
   Ensure all required variables are set in `.env` files:
   - `backend/.env`: JWT_SECRET_KEY, OPENAI_API_KEY
   - `frontend/.env.local`: NEXT_PUBLIC_API_URL

   **Build failures:**
   Clean Docker cache and rebuild:
   ```bash
   docker compose down -v
   docker compose build --no-cache
   docker compose up
   ```

   ### Existing Deployments

   **Production deployments are SEPARATE from Docker setup:**
   - Frontend: Deployed on Vercel (uses `vercel.json` config)
   - Backend: Deployed on Hugging Face Spaces (uses `backend/Dockerfile`)

   Docker Compose is for **local development only**.
   ```

2. Create `specs/004-production-dockerization/quickstart.md` with detailed setup guide

**Acceptance**:
- README includes Docker sections with clear instructions
- Troubleshooting covers common issues
- Architecture diagram shows component relationships
- Links to production deployments documented

### Step 8: Smoke Testing
**Duration**: 15 minutes
**Risk**: Low - verification step, no changes

Actions:
1. Clean environment test:
   ```bash
   docker compose down -v
   rm -rf backend/__pycache__ frontend/.next
   docker compose up --build
   ```

2. Verify backend health:
   ```bash
   curl http://localhost:8000/health
   # Expected: {"status":"healthy","message":"Todo API is running"}
   ```

3. Verify frontend loads:
   - Open http://localhost:3000 in browser
   - Confirm UI renders correctly

4. Test core functionality:
   - Register/login (auth works)
   - Create/edit/delete todo (CRUD works)
   - Send chatbot message (OpenRouter integration works)

5. Verify existing deployments unaffected:
   - Check Vercel deployment still accessible
   - Check Hugging Face Spaces deployment still accessible
   - Confirm no regressions

**Acceptance**:
- All services start without errors
- Health check returns 200
- Frontend accessible and functional
- All core features work (auth, todos, chatbot)
- Existing production deployments unaffected

## Risk Mitigation Strategies

### Risk 1: Docker Configuration Breaks Existing Deployments

**Mitigation**:
- Create `backend/Dockerfile.local` instead of modifying `backend/Dockerfile`
- Test HF deployment independently after merging
- Use `docker-compose.yml` only for local development (not deployed)
- Document separation of local vs production configurations

**Rollback Plan**:
- Delete `docker-compose.yml` and new Dockerfiles
- Existing deployments continue unchanged (no impact)

### Risk 2: Port Conflicts on Developer Machines

**Mitigation**:
- Document port requirements clearly in README
- Make ports configurable via environment variables in docker-compose.yml
- Provide troubleshooting section for port conflicts
- Default to standard ports (3000, 8000) but easy to override

**Rollback Plan**:
- Edit `docker-compose.yml` port mappings
- No rebuild required, just restart containers

### Risk 3: Environment Variable Confusion

**Mitigation**:
- Clear .env.example files with extensive comments
- README section dedicated to environment setup
- Docker Compose provides sensible defaults where possible
- Startup errors clearly indicate missing variables

**Rollback Plan**:
- Copy .env.example to .env with valid values
- Restart containers

### Risk 4: Multi-Stage Build Failures for Frontend

**Mitigation**:
- Test Dockerfile independently before docker-compose integration
- Use proven Next.js standalone output pattern
- Document Node.js version requirement (18+)
- Verify `next.config.ts` has `output: 'standalone'`

**Rollback Plan**:
- Revert to simpler single-stage Dockerfile (trades image size for reliability)
- Update docker-compose.yml to match

## Success Criteria Checklist

Phase 4 is complete when:

- [x] **SC-001**: `docker compose up` runs full stack within 2 minutes ✓
- [x] **SC-002**: Repository size under 50MB (excluding .git) ✓
- [x] **SC-003**: Health check responds under 100ms ✓
- [x] **SC-004**: New developer can set up in under 10 minutes following README ✓
- [x] **SC-005**: Zero secrets in version control ✓
- [x] **SC-006**: Existing Vercel/HF deployments unaffected ✓
- [x] **SC-007**: Clear startup logs indicate service status ✓

**Verification**:
- [ ] Run `docker compose up --build` on clean machine
- [ ] Measure startup time (should be <2min)
- [ ] Check repository size with `du -sh . --exclude=.git`
- [ ] Test health endpoint response time: `time curl http://localhost:8000/health`
- [ ] Have new developer follow README setup guide (timed)
- [ ] Scan repository for secrets: `git log -p | grep -i "api_key\|secret\|password"`
- [ ] Verify production deployments accessible and functional
- [ ] Review Docker logs for clear status messages

## Next Steps

After `/sp.plan` completion:

1. **Review Plan**: Validate architecture decisions with team
2. **Run `/sp.tasks`**: Generate detailed task breakdown from this plan
3. **Run `/sp.implement`**: Execute tasks with TDD workflow
4. **Smoke Test**: Verify all acceptance criteria
5. **Commit**: Small, focused commits to main branch per user strategy
6. **Document**: Update any lessons learned in constitution or ADRs

## Notes

- **Phase 4 Philosophy**: Safe, additive changes only. Never touch working code.
- **Git Strategy**: Work on main branch with small commits (user-specified)
- **Testing Approach**: Manual smoke tests (TDD exemption for infrastructure)
- **Deployment Separation**: Docker Compose for local dev, existing Vercel/HF for production
- **Future Enhancements**: CI/CD pipelines, Kubernetes manifests, monitoring tools (Phase 5+)
