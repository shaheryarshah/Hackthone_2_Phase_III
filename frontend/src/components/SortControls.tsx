/** SortControls component for sorting todo list. */

'use client';

import type { TodoSort } from '@/types';

interface SortControlsProps {
  sort: TodoSort;
  onSortChange: (sort: TodoSort) => void;
}

export default function SortControls({ sort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sortBy"
        value={sort.sortBy || 'created_at'}
        onChange={(e) =>
          onSortChange({
            ...sort,
            sortBy: e.target.value as TodoSort['sortBy'],
          })
        }
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="created_at">Created</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Alphabetical</option>
      </select>

      <button
        onClick={() =>
          onSortChange({
            ...sort,
            sortOrder: sort.sortOrder === 'asc' ? 'desc' : 'asc',
          })
        }
        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 hover:bg-gray-50 transition-colors"
      >
        {sort.sortOrder === 'asc' ? (
          <>
            <span className="text-gray-500">↑</span> Ascending
          </>
        ) : (
          <>
            <span className="text-gray-500">↓</span> Descending
          </>
        )}
      </button>
    </div>
  );
}
