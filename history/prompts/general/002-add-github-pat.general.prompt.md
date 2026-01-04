---
id: "002"
title: "Add GitHub personal access token"
stage: "general"
date_iso: "2026-01-01"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "001-todo-web-app"
user: "User"
command: "Claude Code CLI"
labels: ["mcp", "github", "token", "authentication"]
links: {}
spec: "null"
ticket: "null"
adr: "null"
pr: "null"
files:
  - ".claude/settings.local.json"
tests: []
---

# Prompt

add personal access token <YOUR_GITHUB_PAT_HERE>

# Response

Added the GitHub Personal Access Token to the GitHub MCP configuration in `.claude/settings.local.json` via the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable. The GitHub MCP server is now configured and ready to use with repository access.
