---
id: 1
title: Update Constitution
stage: constitution
date: 2026-01-12
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: claude
command: sp.constitution
labels: [constitution, frontend, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
We are now starting Phase II of the Hackathon II Todo project.

IMPORTANT CONSTRAINTS:
- This iteration is UI-FIRST ONLY.
- Do NOT implement backend, API calls, database, or authentication yet.
- Use mock / in-memory frontend state only.
- Focus entirely on building a clean, modern, responsive Todo UI.

TECH STACK:
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- lucide-react icons
- App Router layout structure
- Client components only where interactivity is required

GOAL:
Create a professional, production-quality Todo App UI similar to modern apps
(Notion / Linear / Todoist style — clean, minimal, usable).

UI REQUIREMENTS:
1. App Layout
   - Centered container
   - Header with app title "Todo App"
   - Subtle icon using lucide-react
   - Light background, card-based UI

2. Task Input
   - Input for task title
   - Optional description field (expandable)
   - "Add Task" button with Plus icon
   - Keyboard friendly (Enter to add)

3. Task List
   - List of tasks displayed in cards or rows
   - Each task shows:
     - Title
     - Optional description
     - Completion status
   - Completed tasks visually different (strike-through / muted)

4. Task Actions
   - Mark complete toggle (checkbox or icon)
   - Delete task button with Trash icon
   - Smooth hover and transition effects

5. States
   - Empty state when no tasks exist
   - Loading-like skeleton (optional UI only)

6. Responsiveness
   - Mobile-first design
   - Works cleanly on small screens

PROJECT STRUCTURE:
- /frontend/app
- /frontend/components
- /frontend/lib (for mock data logic)
- No backend folder usage yet

SPEC-DRIVEN RULE:
- Generate UI based on specs only
- Do not assume backend APIs
- Keep code clean, readable, and scalable for future backend integration

OUTPUT EXPECTATION:
- A visually polished Todo UI
- Fully functional on frontend using local state
- Ready to be connected to FastAPI + Neon DB in next iteration

This is Phase II-A (Frontend UI Completion).
Backend integration will be done in a separate spec iteration later.
```

## Response snapshot

Updated the project constitution to reflect the Hackathon II Todo App requirements with a UI-first approach. The new constitution includes:

1. Core Principles focusing on UI-first development, modern frontend stack, test-first approach, clean architecture, responsive design, and mock state management
2. Additional constraints for UI-only implementation during Phase II-A
3. Technology stack requirements
4. Development workflow guidelines
5. Governance section

## Outcome

- ✅ Impact: Updated constitution now properly governs Phase II-A (Frontend UI Completion) of the Hackathon II Todo project
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with new principles and guidelines
- 🔁 Next prompts: Ready to proceed with frontend development following the new constitution
- 🧠 Reflection: The constitution now clearly defines the scope and constraints for the UI-first development phase

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementing the Todo App UI following the new constitution