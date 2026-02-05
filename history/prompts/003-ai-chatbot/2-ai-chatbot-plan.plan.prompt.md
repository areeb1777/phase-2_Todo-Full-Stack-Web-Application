---
id: 2
title: ai-chatbot-plan
stage: plan
date: 2026-02-03
surface: agent
model: Claude Sonnet 4.5
feature: ai-chatbot
branch: 003-ai-chatbot
user: claude
command: /sp.plan
labels: ["plan", "ai", "chatbot", "todo", "architecture"]
links:
  spec: ../specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-ai-chatbot/plan.md
 - specs/003-ai-chatbot/research.md
 - specs/003-ai-chatbot/data-model.md
 - specs/003-ai-chatbot/contracts/chat-api.yaml
 - specs/003-ai-chatbot/quickstart.md
tests:
 - specs/003-ai-chatbot/plan.md validated against constitution
 - specs/003-ai-chatbot/data-model.md reviewed for consistency
 - specs/003-ai-chatbot/contracts/chat-api.yaml validates as OpenAPI 3.0
---

## Prompt

# Plan: Phase III – AI Todo Chatbot with OpenRouter

## Technical Goal
Design a clean, extensible architecture to integrate an AI conversational chatbot into the existing Phase II Full-Stack Todo system.

The system must:
- reuse all existing CRUD services
- introduce an AI Agent layer
- expose MCP tools
- integrate OpenRouter as LLM provider
- remain stateless
- follow monorepo structure

No business logic duplication allowed.

---

# Architecture Overview

Flow:

Frontend (Chat UI)
→ FastAPI /chat endpoint
→ Agent Service
→ MCP Tools
→ Existing Task Services
→ Database

The AI layer only orchestrates actions and calls tools.
All real logic stays in current services.

---

# Backend Design

## New Modules

backend/
│
├── routes/
│   └── chat.py              # chat endpoint
│
├── agent/
│   ├── agent.py            # agent runner
│   ├── openrouter_client.py# OpenRouter wrapper
│   └── prompts.py          # system prompts
│
├── mcp/
│   ├── server.py           # MCP server
│   └── tools/
│       ├── add_task.py
│       ├── list_tasks.py
│       ├── update_task.py
│       ├── complete_task.py
│       └── delete_task.py
│
├── models/
│   ├── conversation.py     # conversation model
│   └── message.py          # message model

Also add to existing:
├── models/
│   └── [existing models]
├── schemas/
│   └── [existing schemas]
├── services/
│   └── [existing services]

Authentication via existing auth token.

UI should be minimal and responsive.

---

# Database Plan

## conversations
id
user_id
created_at
updated_at

## messages
id
conversation_id
role
content
created_at

Indexes:
- conversation_id
- user_id

---

# Agent Design

System Prompt Rules:
- understand English and Roman Urdu
- always call tools for actions
- never hallucinate task changes
- confirm actions
- be concise and friendly

Tool calling must be mandatory for CRUD.

---

# AI Provider Plan

Provider: OpenRouter

Client must:
- use OpenAI compatible format
- support function calling
- allow model swap

Default model:
mistralai/mistral-7b-instruct

Future:
meta-llama/llama-3-8b-instruct
google/gemini-flash-1.5

---

# API Contracts

POST /api/{user_id}/chat

Request:
{
  conversation_id?: number,
  message: string
}

Response:
{
  conversation_id: number,
  response: string,
  tool_calls: array
}

---

# Separation of Concerns

Layer responsibilities:

Frontend → UI only
Routes → HTTP only
Agent → AI logic only
Tools → Task wrappers only
Services → Business logic only
DB → Persistence only

No cross mixing allowed.

---

# Non Functional

- stateless
- modular
- testable
- provider pluggable
- fast response (<3s)
- local development friendly

---

# Migration Safety

Phase II APIs must remain unchanged.

If chatbot removed, system must still work normally.

---

# Deliverables

- chat endpoint
- agent service
- MCP tools
- conversation models
- chat UI
- OpenRouter integration

All implemented via spec-driven workflow only.

## Response snapshot

# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot` | **Date**: 2026-02-03 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/003-ai-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI-powered conversational chatbot that allows users to manage tasks using natural language (English + Roman Urdu). The system integrates with OpenRouter as the LLM provider, exposes MCP tools for task operations, and maintains conversation history in the database while reusing existing CRUD services without duplicating business logic.

## Technical Context

**Language/Version**: Python 3.12, TypeScript/JavaScript for frontend components
**Primary Dependencies**: FastAPI, OpenAI-compatible client for OpenRouter, SQLAlchemy, existing Phase II services
**Storage**: PostgreSQL database (Neon) with new conversation/message tables
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Linux server deployment with web-based frontend
**Project Type**: Web application (existing frontend + backend extension)
**Performance Goals**: <3 second response times for AI interactions, 90% accuracy in intent recognition
**Constraints**: Stateless backend, multi-language support (English/Roman Urdu), clean separation between AI layer and business logic
**Scale/Scope**: Individual user conversations, persistent across sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Initial Check**:
- **UI-First Development**: The chat UI has been planned as a new page in the Next.js app with React components
- **Modern Frontend Stack**: Will use Next.js 16+, TypeScript, Tailwind CSS as per constitution
- **Test-First**: All components must be tested following TDD principles
- **Clean Architecture**: Clear separation designed between UI, AI agent, MCP tools, and existing services
- **Responsive Design**: Chat interface will be mobile-responsive following existing patterns

**Post-Design Check**:
- **UI-First Development**: ✓ Confirmed - Chat UI component planned with TypeScript and Tailwind CSS
- **Modern Frontend Stack**: ✓ Confirmed - Using Next.js 16+, TypeScript, Tailwind CSS as required
- **Test-First**: ✓ Confirmed - Testing strategy defined for all new components and services
- **Clean Architecture**: ✓ Confirmed - Clear separation achieved between AI layer, tools, and business logic
- **Responsive Design**: ✓ Confirmed - Chat interface designed to be mobile-responsive
- **Migration Safety**: ✓ Confirmed - Existing APIs remain unchanged, new functionality added alongside

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-chatbot/
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
├── routes/
│   └── chat.py              # chat endpoint
├── agent/
│   ├── agent.py            # agent runner
│   ├── openrouter_client.py# OpenRouter wrapper
│   └── prompts.py          # system prompts
├── mcp/
│   ├── server.py           # MCP server
│   └── tools/
│       ├── add_task.py
│       ├── list_tasks.py
│       ├── update_task.py
│       ├── complete_task.py
│       └── delete_task.py
├── models/
│   ├── conversation.py     # conversation model
│   └── message.py          # message model
├── schemas/
│   ├── conversation.py     # conversation schema
│   └── message.py          # message schema
├── app.py                 # main application
├── app_interface.py       # existing app interface
└── requirements.txt       # dependencies

frontend/
├── app/
│   ├── chat/              # chat page
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx  # main chat component
│   ├── MessageBubble.tsx  # message display component
│   └── TaskConfirmation.tsx # task confirmation display
├── lib/
│   ├── api.ts            # API client for chat endpoint
│   └── types.ts          # type definitions
├── context/
│   └── AuthContext.tsx   # authentication context (existing)
├── package.json
├── next.config.ts
└── tailwind.config.js

# Existing structure reused
├── backend/              # existing backend with new chat additions
└── frontend/             # existing frontend with new chat UI
```

**Structure Decision**: Web application structure selected as this extends the existing Phase II Full-Stack Todo application. The backend will have new chat-related modules while reusing existing task services. The frontend will have a new chat interface that integrates with existing authentication and follows the Next.js 16+ App Router pattern.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A - All constitution checks passed |

## Outcome

- ✅ Impact: Comprehensive implementation plan created for AI-powered todo chatbot with OpenRouter integration, including research, data models, API contracts, and quickstart guide
- 🧪 Tests: Plan validated against constitution requirements with all gates passed
- 📁 Files: Created plan.md, research.md, data-model.md, contracts/chat-api.yaml, quickstart.md in specs/003-ai-chatbot/
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan successfully designed clean architecture with separation of concerns between AI agent, MCP tools, and existing services

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All constitution checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks with /sp.tasks command