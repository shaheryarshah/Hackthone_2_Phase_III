/** TodoItem component for displaying a single todo. */

'use client';

import { useState } from 'react';
import type { Todo } from '@/types';
import PriorityBadge from './PriorityBadge';
import TagChips from './TagChips';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onTagClick?: (tag: string) => void;
  apiUrl?: string;
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete,
  onTagClick,
  apiUrl,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;

    setLoading(true);
    try {
      await fetch(`${baseUrl}/todos/${todo.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
        }),
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    setLoading(true);
    try {
      await fetch(`${baseUrl}/todos/${todo.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await fetch(`${baseUrl}/todos/${todo.id}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      onToggleComplete();
    } catch (error) {
      console.error('Failed to toggle complete:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          disabled={loading}
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading || !editTitle.trim()}
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = !todo.completed && date < now;

    return {
      text: date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      }) + (date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) ? ` at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}` : ''),
      isOverdue,
    };
  };

  const getRecurrenceIcon = (recurrence?: string) => {
    switch (recurrence) {
      case 'daily':
        return '📅 Daily';
      case 'weekly':
        return '📅 Weekly';
      case 'monthly':
        return '📅 Monthly';
      default:
        return null;
    }
  };

  const dueDateInfo = formatDueDate(todo.due_date);

  return (
    <div
      className={`p-4 rounded-lg border ${
        todo.completed
          ? 'bg-green-50 border-green-200'
          : todo.overdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={loading}
          className="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
        />
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-lg font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
            <PriorityBadge todo={todo} />
          </div>

          {/* Description */}
          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Due Date and Overdue Warning */}
          {dueDateInfo && (
            <p className={`mt-2 text-sm ${
              dueDateInfo.isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
            }`}>
              📅 Due: {dueDateInfo.text}
              {dueDateInfo.isOverdue && ' ⚠️ OVERDUE'}
            </p>
          )}

          {/* Recurrence Indicator */}
          {getRecurrenceIcon(todo.recurrence) && (
            <p className="mt-1 text-sm text-gray-600">
              {getRecurrenceIcon(todo.recurrence)}
            </p>
          )}

          {/* Tags */}
          <TagChips todo={todo} onTagClick={onTagClick} />

          {/* Created Date */}
          <p className="mt-2 text-xs text-gray-400">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
