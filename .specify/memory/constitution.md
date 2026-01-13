<!-- SYNC IMPACT REPORT
Version change: 1.1.0 → 3.0.0
Modified principles:
- Removed I-VII principles from Phase II Constitution
- Added I. Reusable Intelligence (New)
- Added II. Subagent Orchestration (New)
- Added III. Blueprint & Skill-First Implementation (New)
- Added IV. Safe AI-to-Backend Interface
- Added V. Minimal Viable Change
- Added VI. Test-First Development
Removed sections: Phase II specific constraints and success criteria
Added sections: All new principles for Agentic Todo System
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated (Constitution Check section)
- .specify/templates/spec-template.md ⚠ pending (may need updates for new principles)
- .specify/templates/tasks-template.md ⚠ pending (may need updates for new principles)
Follow-up TODOs: None
-->

# Phase III Constitution – Agentic Todo System

## Core Principles

### I. Reusable Intelligence (New)
All AI logic must be encapsulated in **Agent Skills** (`.claude/skills/`). This ensures logic like "Urdu Translation" or "Task Summarization" is decoupled from the main agent and reusable across the project.

### II. Subagent Orchestration (New)
Complex workflows (e.g., processing voice -> updating DB -> confirming in Urdu) must be delegated to specialized **Claude Code Subagents**. The main agent acts only as a router.

### III. Blueprint & Skill-First Implementation (New)
Development must use **Cloud-Native Blueprints** via Agent Skills to ensure infrastructure (Neon DB, FastAPI) is provisioned and managed programmatically by the agents.

### IV. Safe AI-to-Backend Interface
The AI layer MUST interact with the database exclusively through the **Official MCP SDK**. Direct SQL queries by the AI are prohibited to ensure safe, auditable, and consistent data access patterns.

### V. Minimal Viable Change
All changes should follow the smallest viable diff principle. Do not refactor unrelated code during feature development. Focus only on the specific requirements at hand.

### VI. Test-First Development
All code must be developed using Test-Driven Development (TDD). Tests are written before implementation, ensuring functionality is verified from the start.

## Additional Constraints
Technology stack requirements: Python 3.11+, FastAPI, NeonDB, Claude Code Subagents, MCP SDK
Security Requirements: All database interactions must go through MCP SDK, no direct SQL access allowed
Deployment Policy: Infrastructure-as-Code using cloud-native blueprints

## Development Workflow
Review Process: All PRs must verify compliance with constitution principles
Quality Gates: Code review must check for proper use of Agent Skills, subagent orchestration, and MCP SDK compliance
Testing Requirements: Integration tests required for all Agent Skill interactions

## Governance
This constitution supersedes all other development practices. Amendments require documentation of the change, approval from project maintainers, and a migration plan if backward compatibility is affected.

All PRs/reviews must verify compliance with Agent Skills usage, subagent orchestration, blueprint-first implementation, and safe database access via MCP SDK. Complexity must be justified with clear benefits outweighing the additional overhead.

**Version**: 3.0.0 | **Ratified**: 2025-12-20 | **Last Amended**: 2026-01-09