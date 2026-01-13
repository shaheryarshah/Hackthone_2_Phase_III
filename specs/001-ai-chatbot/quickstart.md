# Quickstart Guide: AI Chatbot with Reusable Intelligence

## Overview
This guide provides instructions for setting up and running the AI Chatbot with Reusable Intelligence system. The system provides multilingual support (English/Urdu), voice command processing, and task management capabilities.

## Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend)
- PostgreSQL or NeonDB
- MCP SDK installed and configured
- OpenAI API key (for ChatKit)

## Environment Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run database migrations:
   ```bash
   python -m src.models.migrations
   ```

6. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Agent Skills Setup
The system uses Agent Skills for reusable intelligence:

1. Create skill files in `.claude/skills/`:
   - `task-logic.md` - Business rules for todo management
   - `multilingual-support.md` - Urdu grammar and RTL formatting rules
   - `urdu-translator.md` - Bidirectional translation logic

2. The skills will be automatically loaded by the system.

## Subagent Configuration
The system uses specialized subagents as required by the constitution:

1. ManagerBot - High-level router that delegates tasks to appropriate subagents
2. TodoWorker - Handles task CRUD operations via MCP tools only
3. VoiceProcessor - Processes voice input and extracts intent (will be implemented)

## MCP Integration
The system uses MCP SDK for all database operations:
- All data access goes through MCP tools
- Direct database queries are prohibited
- MCP server wraps existing Phase II logic

## Running the Application
1. Start the backend server on port 8000
2. Start the frontend server on port 3000
3. Access the application at `http://localhost:3000`

## API Endpoints
- `POST /api/chat` - Process chat messages and get AI responses
- `GET/POST/PUT/DELETE /api/tasks` - Task management operations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/{id}` - Get conversation history

## Testing
1. Run backend tests:
   ```bash
   pytest
   ```

2. Run frontend tests:
   ```bash
   npm test
   ```

## Voice Input
The application supports voice-to-text input:
1. Click the microphone icon in the chat interface
2. Speak your command
3. The system will process your voice input and respond appropriately

## Multilingual Support
The system supports both English and Urdu:
1. Language detection happens automatically
2. Responses are provided in the appropriate language
3. Users can set language preferences in settings