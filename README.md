# AI Chatbot with Reusable Intelligence

This project implements an AI Chatbot with Reusable Intelligence features, including multilingual support (English/Urdu), voice command processing, and task management capabilities. The system follows the Phase III Constitution principles with specialized subagents for different functions, MCP SDK for safe database access, and Agent Skills for reusable intelligence.

## Features

- **Multilingual Support**: Bidirectional translation between English and Urdu with proper RTL formatting
- **Voice Command Processing**: Voice input handling with intent extraction
- **Task Management**: Create, list, update, and delete tasks through chat interface
- **Subagent Orchestration**: Specialized subagents for different functions (ManagerBot, TodoWorker, voice-processor)
- **Safe Database Access**: All database operations through MCP SDK
- **Reusable Intelligence**: Agent Skills for modular functionality

## Architecture

### Backend (FastAPI)
- **Models**: SQLModel-based data models for conversations, messages, tasks, and users
- **Services**: Translation, voice processing, and chat services
- **API**: REST endpoints for chat and task management
- **Tools**: MCP server for safe database operations

### Frontend (React)
- **Components**: ChatInterface with voice input, TaskDisplay, and RTL support
- **Services**: API service for backend communication
- **Integration**: OpenAI ChatKit for chat interface

### Agent Skills
- **urdu-translator**: Bidirectional translation between English and Urdu
- **task-formatter**: Standardizes task display formatting
- **task-logic**: Business rules for task management
- **multilingual-support**: Urdu grammar and RTL formatting rules

### Subagents
- **ManagerBot**: High-level router delegating tasks to specialized subagents
- **TodoWorker**: Handles task CRUD operations via MCP tools
- **voice-processor**: Processes voice input and extracts intent

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or NeonDB)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create and activate virtual environment: `python -m venv venv && source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Copy environment file: `cp .env.example .env` and update configurations
5. Start the server: `python -m src.main` or `uvicorn src.main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

- `POST /api/chat`: Process chat messages and return AI responses
- `GET /api/conversations`: List user conversations
- `GET /api/conversations/{id}`: Get conversation history
- `GET /api/tasks`: List user tasks
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/{id}`: Update a task
- `DELETE /api/tasks/{id}`: Delete a task
- `PATCH /api/tasks/{id}/complete`: Mark task as completed

## Environment Variables

- `SERVER_HOST`: Host for the server (default: localhost)
- `SERVER_PORT`: Port for the server (default: 8000)
- `DATABASE_URL`: Connection string for the database
- `MCP_SERVER_URL`: URL for MCP server
- `MCP_API_KEY`: API key for MCP server access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.