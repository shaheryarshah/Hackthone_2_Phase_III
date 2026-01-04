---
id: 001
title: Phase II Extended Features
stage: constitution
date: 2026-01-02
surface: agent
model: claude-sonnet-4.5
feature: none
branch: 001-todo-web-app
user: user
command: /sp.constitution
labels: ["constitution","phase-ii","governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - None
---

## Prompt

# Phase II Constitution – Extended Features

## Purpose
Enhance the existing Todo full-stack application with usability and intelligent features.

## Scope
- Extend existing backend APIs
- Extend existing frontend UI
- No breaking changes to existing functionality

## Mandatory Rules
- Spec-driven development only
- Backward compatibility required
- Existing CRUD must remain unchanged
- Business logic remains in backend

## Technology Constraints
- Backend: FastAPI
- Frontend: Next.js
- Database: existing DB (schema can evolve)

## Quality Rules
- Features must be optional per task
- Defaults must be safe
- Filters and sorting must be server-driven

## Success Criteria
- Users can organize, search, and prioritize tasks
- Tasks can recur automatically
- Due dates and reminders function correctly

## Response snapshot

Updated constitution to version 1.1.0 with Phase II specifications:
- Added Principle VII: Backward Compatibility (no breaking changes)
- Extended Technology Constraints to allow DB schema evolution
- Added 5 new Quality Rules for Phase II features (optional, safe defaults, server-driven filtering, etc.)
- Expanded Success Criteria to include Phase I (foundation) and Phase II (extended features)
- Enhanced Governance section with amendment requirements and versioning policy
- Updated dates: Last Amended to 2026-01-02

## Outcome

- ✅ Impact: Constitution successfully amended to support Phase II extended features while maintaining backward compatibility
- 🧪 Tests: None (governance update)
- 📁 Files: Updated .specify/memory/constitution.md with new principle and expanded quality rules
- 🔁 Next prompts: Use /sp.specify to create feature specifications for Phase II features
- 🧠 Reflection: Constitution now clearly distinguishes between Phase I foundation and Phase II extended features, with backward compatibility as a core principle

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
