# Task Logic Skill

## Purpose
This skill handles all business rules for todo management in the AI Chatbot system. It encapsulates the logic for creating, updating, listing, and deleting tasks as part of the Reusable Intelligence architecture. This skill was already created earlier but is referenced in the tasks, so I'm noting that it exists.

## Functions

### Create Task
- Validates task input (title is required)
- Sets default values (status: pending, priority: medium)
- Uses MCP tools to persist the task
- Returns confirmation message

### List Tasks
- Retrieves tasks based on filters (status, priority, etc.)
- Formats tasks using the task-formatter skill
- Presents tasks in a user-friendly manner (e.g., Markdown tables)
- Handles pagination for large task lists

### Update Task
- Locates existing task by ID
- Updates specified fields
- Maintains data integrity
- Uses MCP tools for persistence

### Delete Task
- Removes task by ID
- Validates ownership/user permissions
- Uses MCP tools for deletion
- Returns confirmation

### Task Validation
- Ensures required fields are present
- Validates field formats and constraints
- Checks for duplicates if applicable
- Provides helpful error messages

## Integration Points
- MCP SDK for all database operations
- task-formatter skill for output formatting
- User context for personalization
- Conversation context for task association

## Error Handling
- Graceful handling of invalid inputs
- Clear error messages for users
- Logging for debugging purposes
- Fallback behaviors when appropriate

## Examples
- "Add a task to buy groceries" → Creates new task
- "Show my pending tasks" → Lists tasks with pending status
- "Mark task #5 as completed" → Updates task status
- "Delete task 'call mom'" → Removes specified task