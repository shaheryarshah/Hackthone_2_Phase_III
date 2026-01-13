# Data Model: AI Chatbot with Reusable Intelligence

## Entity: Conversation
**Description**: Represents a chat session between user and AI assistant, including message history and metadata

**Fields**:
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to User, optional for anonymous sessions)
- title: String (Generated from first message or user-provided)
- created_at: DateTime (Timestamp of creation)
- updated_at: DateTime (Timestamp of last message)
- language_preference: String (User's preferred language: 'en', 'ur', etc.)
- metadata: JSON (Additional context information)

**Validation Rules**:
- id: Required, auto-generated UUID
- created_at: Required, auto-populated
- updated_at: Required, auto-updated on change
- language_preference: Must be in supported languages list

**Relationships**:
- One Conversation to Many Messages (conversation_id foreign key in Message)

## Entity: Message
**Description**: Represents a single message in a conversation (from user or AI)

**Fields**:
- id: UUID (Primary Key)
- conversation_id: UUID (Foreign Key to Conversation)
- sender_type: String (Enum: 'user', 'assistant')
- content: Text (The actual message content)
- language: String (Language code: 'en', 'ur', etc.)
- timestamp: DateTime (When the message was sent)
- message_type: String (Enum: 'text', 'voice_transcript', 'task_action', 'system')
- metadata: JSON (Additional context like confidence scores for voice)

**Validation Rules**:
- id: Required, auto-generated UUID
- conversation_id: Required, must reference existing Conversation
- sender_type: Required, must be 'user' or 'assistant'
- content: Required, max 10000 characters
- timestamp: Required, auto-populated
- language: Required, must be valid language code

**Relationships**:
- Many Messages to One Conversation (via conversation_id)
- Message may reference a Task if it's a task-related message

## Entity: Task
**Description**: Represents a user's to-do item with properties like title, description, status, due date, and priority

**Fields**:
- id: UUID (Primary Key)
- conversation_id: UUID (Foreign Key to Conversation, optional)
- title: String (Task title)
- description: Text (Detailed task description)
- status: String (Enum: 'pending', 'in_progress', 'completed', 'cancelled')
- priority: String (Enum: 'low', 'medium', 'high', 'urgent')
- due_date: DateTime (Optional deadline)
- created_at: DateTime (Timestamp of creation)
- updated_at: DateTime (Timestamp of last update)
- completed_at: DateTime (Timestamp when completed, optional)

**Validation Rules**:
- id: Required, auto-generated UUID
- title: Required, max 255 characters
- status: Required, must be valid status value
- priority: Required, must be valid priority value
- due_date: Optional, if provided must be future date

**Relationships**:
- Many Tasks to One Conversation (via conversation_id, optional)
- Task may be referenced by multiple Messages

## Entity: User
**Description**: Represents a chatbot user with preferences including language preference and accessibility settings

**Fields**:
- id: UUID (Primary Key)
- username: String (Unique username)
- email: String (User's email, optional)
- language_preference: String (Default language: 'en', 'ur', etc.)
- created_at: DateTime (Account creation timestamp)
- updated_at: DateTime (Last update timestamp)
- settings: JSON (Accessibility and UI preferences)

**Validation Rules**:
- id: Required, auto-generated UUID
- username: Required, unique, max 50 characters
- email: Optional, must be valid email format if provided
- language_preference: Required, must be in supported languages list

**Relationships**:
- One User to Many Conversations (via user_id)
- One User to Many Tasks (via user_id foreign key to be added)

## Entity: VoiceTranscript
**Description**: Represents processed voice input with cleaned text, extracted intent, and confidence scores

**Fields**:
- id: UUID (Primary Key)
- message_id: UUID (Foreign Key to Message)
- original_audio_path: String (Path to original audio file, optional)
- cleaned_text: Text (Cleaned and processed voice-to-text result)
- extracted_intent: String (Detected intent from voice command)
- confidence_score: Float (Confidence level of voice recognition, 0.0-1.0)
- processing_time: Float (Time taken to process in seconds)
- created_at: DateTime (Timestamp of processing)

**Validation Rules**:
- id: Required, auto-generated UUID
- message_id: Required, must reference existing Message
- confidence_score: Required, between 0.0 and 1.0
- cleaned_text: Required, max 10000 characters

**Relationships**:
- One VoiceTranscript to One Message (via message_id)
- VoiceTranscript is created as part of voice processing flow

## State Transitions

### Task State Transitions:
- pending → in_progress (when user starts working on task)
- in_progress → completed (when user marks task as done)
- in_progress → pending (when user pauses task)
- pending → cancelled (when user cancels task)
- completed → in_progress (when user reopens completed task)

### Conversation State Considerations:
- Active: When messages are being exchanged
- Inactive: After period of inactivity (for cleanup purposes)

## Indexes for Performance
- Conversation: created_at, updated_at, user_id
- Message: conversation_id, timestamp, sender_type
- Task: user_id, status, due_date, created_at
- User: username (unique), email (unique if provided)