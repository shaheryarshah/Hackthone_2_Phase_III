# Task Formatter Skill

## Purpose
This skill standardizes how tasks are displayed in the chat interface, particularly using Markdown tables as mentioned in the feature specification. It ensures consistent formatting of task lists, updates, and other task-related information presented to users.

## Functions

### Format Task List
- Converts task arrays into standardized Markdown tables
- Includes relevant columns (ID, Title, Status, Priority, Due Date)
- Applies appropriate styling for different statuses
- Handles empty task lists gracefully

### Format Single Task
- Displays individual task details in a consistent format
- Shows all relevant task properties
- Highlights important information (due dates, high priority items)
- Provides action suggestions for the task

### Format Task Actions
- Standardizes confirmation messages for task operations
- Provides clear feedback for create, update, delete operations
- Shows before/after states when relevant

## Formatting Specifications

### Markdown Table Format
```
| ID | Title | Status | Priority | Due Date |
|----|-------|--------|----------|----------|
| #1 | Buy groceries | pending | high | 2023-12-15 |
| #2 | Call mom | completed | medium | 2023-12-10 |
```

### Status Indicators
- pending: ⏳ or 📋
- in_progress: 🔄 or ⚙️
- completed: ✅ or ✔️
- cancelled: ❌ or 🚫

### Priority Indicators
- low: ▶️ or ➖
- medium: ◆ or ◊
- high: ⭐ or ⬆️
- urgent: 🔥 or ⚡

## Integration Points
- Used by chat service for displaying task lists
- Integrated with task management operations
- Connected to user preferences for display options

## Examples

### Input: Array of tasks
```json
[
  {
    "id": "1",
    "title": "Buy groceries",
    "status": "pending",
    "priority": "high",
    "due_date": "2023-12-15"
  },
  {
    "id": "2",
    "title": "Call mom",
    "status": "completed",
    "priority": "medium",
    "due_date": "2023-12-10"
  }
]
```

### Output: Formatted Markdown table
```
## Your Tasks
| # | Title | Status | Priority | Due Date |
|---|-------|--------|----------|----------|
| 1 | Buy groceries | ⏳ pending | ⭐ high | 2023-12-15 |
| 2 | Call mom | ✅ completed | ◆ medium | 2023-12-10 |
```

## Error Handling
- Graceful degradation when formatting fails
- Fallback to simple list format if table formatting unavailable
- Clear error messages for debugging
- Logging for format-related issues

## Customization Options
- Compact vs detailed view
- Sort order preferences
- Columns to display
- Status/priority indicator preferences