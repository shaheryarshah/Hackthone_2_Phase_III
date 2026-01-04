/** TodoForm component for creating new todos. */

'use client';

import { useState } from 'react';
import type { CreateTodoRequest, Todo } from '@/types';

interface TodoFormProps {
  onTodoCreated: (todo: Todo) => void;
  apiUrl?: string;
}

export default function TodoForm({ onTodoCreated, apiUrl }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Validation: recurrence requires due date
    if (recurrence !== 'none' && !dueDate) {
      setError('Due date is required for recurring tasks');
      return;
    }

    setLoading(true);

    try {
      const todoData: CreateTodoRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      // Add optional fields if provided
      if (priority) {
        todoData.priority = priority;
      }
      if (tags.trim()) {
        todoData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      if (dueDate) {
        todoData.due_date = new Date(dueDate).toISOString();
      }
      if (recurrence !== 'none') {
        todoData.recurrence = recurrence;
      }

      const response = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create todo');
      }

      const todo = await response.json();
      onTodoCreated(todo);
      setTitle('');
      setDescription('');
      setPriority('');
      setTags('');
      setDueDate('');
      setRecurrence('none');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={2}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Recurrence */}
        <div>
          <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">
            Recurrence
          </label>
          <select
            id="recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as typeof recurrence)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., work, personal, urgent"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        {recurrence !== 'none' && !dueDate && (
          <p className="mt-1 text-sm text-amber-600">
            ⚠️ Due date is required for recurring tasks
          </p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim() || (recurrence !== 'none' && !dueDate)}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}
