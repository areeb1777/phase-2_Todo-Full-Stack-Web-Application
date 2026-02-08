# Research: Final Cleanup, Quality & Professional Showcase

**Feature**: 005-final-cleanup-showcase
**Date**: 2026-02-08

## Research Summary

Phase 5 is additive-only (no unknowns in the traditional sense). Research focused on auditing the current state and selecting the right testing tools for the existing stack.

## Decision 1: Backend Test Framework

**Decision**: pytest + httpx with FastAPI TestClient
**Rationale**: pytest is the standard Python testing framework. FastAPI's TestClient requires httpx as a dependency. SQLite in-memory databases provide full isolation without external services.
**Alternatives considered**:
- unittest: More verbose, less ergonomic for fixture management
- pytest-asyncio: Unnecessary — FastAPI TestClient handles async internally

## Decision 2: Frontend Test Framework

**Decision**: Jest + @testing-library/react
**Rationale**: Jest is the most widely supported test runner for Next.js. @testing-library/react follows the "test like users interact" philosophy. Next.js provides a built-in `next/jest` preset that handles all configuration (module aliases, transforms, CSS mocking).
**Alternatives considered**:
- Vitest: Faster but less mature Next.js integration with App Router
- Cypress/Playwright: E2E testing is out of scope for Phase 5 basic component tests

## Decision 3: CI/CD Platform

**Decision**: GitHub Actions with two parallel jobs (backend + frontend)
**Rationale**: Repository is hosted on GitHub. Actions is free for public repos. Two separate jobs allow parallel execution and independent failure visibility.
**Alternatives considered**:
- Single job: Slower, harder to identify which layer failed
- Docker-based CI: Too slow for quality checks, unnecessary overhead

## Decision 4: Logging Format

**Decision**: Standard Python logging with structured format string (`asctime | level | name | message`)
**Rationale**: The backend already uses Python's `logging` module with `basicConfig`. A centralized config with a structured formatter is the smallest change that provides consistent output. No new dependencies needed.
**Alternatives considered**:
- structlog (JSON logging): Adds dependency, overkill for this project size
- loguru: Replaces stdlib logging, unnecessary migration risk

## Decision 5: README Structure

**Decision**: 11-section professional README based on user requirements
**Rationale**: User explicitly specified the required sections. The existing README has good content but needs restructuring for portfolio presentation.
**Alternatives considered**: None — user requirements are explicit.

## Current State Audit Findings

| Area | Status | Action Needed |
| ---- | ------ | ------------- |
| Git-tracked junk | Clean (0 artifacts) | Verify only |
| .gitignore coverage | Comprehensive | Verify .github/workflows/ not ignored |
| Backend tests | None exist | Create pytest suite |
| Frontend tests | None exist | Create Jest suite |
| CI/CD | None exists | Create GitHub Actions workflow |
| Logging | Basic (logging.basicConfig) | Add structured formatter |
| README | Exists (260+ lines) | Professional rewrite |
| Spec history | Intact (phases 1-4) | Must preserve |
