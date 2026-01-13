import React from 'react';

const TaskDisplay = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  // Function to get status emoji
  const getStatusEmoji = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'in_progress':
        return '🔄';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  // Function to get priority indicator
  const getPriorityIndicator = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return '➖';
      case 'medium':
        return '◆';
      case 'high':
        return '⭐';
      case 'urgent':
        return '🔥';
      default:
        return '🔹';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to render task table
  const renderTaskTable = () => {
    if (!tasks || tasks.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No tasks found. Add a task to get started!
        </div>
      );
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>#</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Priority</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Due Date</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id || index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <strong>{task.title}</strong>
                  {task.description && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {getStatusEmoji(task.status)} {task.status}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {getPriorityIndicator(task.priority)} {task.priority}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {formatDate(task.due_date)}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => onTaskUpdate && onTaskUpdate(task.id, { status: 'completed' })}
                      disabled={task.status === 'completed'}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: task.status === 'completed' ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: task.status === 'completed' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onTaskDelete && onTaskDelete(task.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>Your Tasks</h3>
      {renderTaskTable()}
    </div>
  );
};

export default TaskDisplay;