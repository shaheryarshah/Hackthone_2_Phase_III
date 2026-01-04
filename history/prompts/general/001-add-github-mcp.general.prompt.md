---
id: "001"
title: "Add GitHub MCP configuration"
stage: "general"
date_iso: "2026-01-01"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "001-todo-web-app"
user: "User"
command: "Claude Code CLI"
labels: ["mcp", "github", "configuration"]
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

add github mcp "inputs": [
    {
      "type": "promptString",
      "id": "github_mcp_pat",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ]
}

# Response

Added the GitHub MCP configuration to `.claude/settings.local.json` with:
- Command: `uvx` with args `["mcp-server-github"]`
- Input: `github_mcp_pat` - password-type prompt for GitHub Personal Access Token

The configuration is ready for use. When you restart Claude Code, you'll be prompted to enter your GitHub PAT.
