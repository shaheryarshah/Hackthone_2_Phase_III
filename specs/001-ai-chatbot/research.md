# Research: AI Chatbot with Reusable Intelligence

## Phase A: Intelligence Layer (The "Brain")

### Decision: Agent Skills Implementation
**Rationale**: Following the constitution principle of Reusable Intelligence, business logic for todo management will be encapsulated in `.claude/skills/task-logic.md` to ensure reusability across the project.

**Alternatives considered**:
- Direct implementation in main application: Rejected due to violation of constitution principle
- Separate microservice: Rejected as over-engineering for this feature scope

### Decision: Multilingual Support Implementation
**Rationale**: Urdu grammar and RTL formatting rules will be defined in `.claude/skills/multilingual-support.md` to support bidirectional translation between English and Urdu as required by FR-001.

**Alternatives considered**:
- Using third-party translation API directly: Rejected as it doesn't follow the Agent Skills pattern
- Hardcoded translation tables: Rejected as not maintainable or reusable

### Decision: Subagent Configuration
**Rationale**: Following the constitution principle of Subagent Orchestration, we'll configure specialized subagents:
- ManagerBot: High-level router to delegate tasks to appropriate subagents
- TodoWorker: Limited to MCP tool access only, handling task CRUD operations

**Alternatives considered**:
- Single monolithic agent: Rejected as it violates the subagent orchestration principle
- More granular subagents: Rejected as it would add unnecessary complexity for this scope

## Phase B: Infrastructure & MCP

### Decision: Data Model Extension
**Rationale**: Update SQLModel to include Conversation and Message tables for chat memory as required by FR-005 (store conversation history in persistent database).

**Fields identified**:
- Conversation: id, user_id, created_at, updated_at, metadata
- Message: id, conversation_id, sender_type, content, timestamp, language

**Alternatives considered**:
- Using existing task model: Rejected as conversations are separate from tasks
- Noisier schema: Rejected to maintain minimal viable change principle

### Decision: MCP Server Implementation
**Rationale**: Build the MCP Server using the Python SDK to wrap existing Phase II logic as tools, ensuring compliance with FR-006 (integrate with MCP tools for secure operations).

**Tools to be implemented**:
- add_task: Create new tasks via MCP
- list_tasks: Retrieve tasks via MCP
- update_task: Modify tasks via MCP
- delete_task: Remove tasks via MCP

**Alternatives considered**:
- Direct database access: Rejected as it violates the constitution's safe AI-to-backend interface
- HTTP API calls: Rejected as MCP SDK is the required approach per constitution

## Phase C: UI/UX Integration

### Decision: Frontend Framework
**Rationale**: Deploy OpenAI ChatKit on the frontend to provide a robust chat interface while maintaining focus on backend intelligence layer.

**Alternatives considered**:
- Custom chat implementation: Rejected as it would increase scope and timeline
- Other chat libraries: OpenAI ChatKit chosen for its established reliability

### Decision: Voice Input Implementation
**Rationale**: Implement the voice-to-text toggle in the input bar using browser's Web Speech API for accessibility.

**Technical approach**:
- Use SpeechRecognition API for voice-to-text conversion
- Add button toggle to activate/deactivate voice input
- Process audio in browser before sending to backend

**Alternatives considered**:
- Server-side voice processing: Rejected as it would increase latency
- Third-party voice services: Rejected to maintain control over privacy

### Decision: API Integration
**Rationale**: Connect the frontend to the new /api/chat endpoint to enable chat functionality with the backend intelligence layer.

**Endpoint design**:
- POST /api/chat: Process user message and return AI response
- Includes support for text and voice input
- Language detection and translation handling

**Alternatives considered**:
- WebSocket connection: Rejected as unnecessary complexity for this scope
- Multiple separate endpoints: Rejected for simplicity

## Implementation Considerations

### Technology Stack Alignment
- Python 3.11+ with FastAPI: Confirmed alignment with constitution
- PostgreSQL (NeonDB): Confirmed for persistence requirements
- React frontend: Confirmed for UI requirements
- MCP SDK: Required for database access per constitution

### Performance Requirements
- Translation accuracy: 95%+ (SC-001) - achievable with modern translation models
- Voice recognition: 90%+ (SC-002) - achievable with Web Speech API
- Task operations: <2s 98% of time (SC-003) - achievable with MCP SDK and proper indexing

### Security & Compliance
- All database access through MCP SDK (constitution requirement)
- Language detection and translation handled securely
- Conversation history properly persisted and managed