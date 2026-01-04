/** FilterBar component for searching and filtering todos. */

'use client';

import { useState, useEffect } from 'react';
import type { TodoFilters, Todo } from '@/types';

interface FilterBarProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
  availableTags?: string[];
  todos?: Todo[];
}

export default function FilterBar({
  filters,
  onFiltersChange,
  availableTags = [],
  todos = [],
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const handleClearAll = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof TodoFilters] !== undefined
  ).length;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Status Filter */}
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="statusFilter"
            value={filters.status || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: (e.target.value as TodoFilters['status']) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label
            htmlFor="priorityFilter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priorityFilter"
            value={filters.priority || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priority: (e.target.value as TodoFilters['priority']) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Due Before Filter */}
        <div>
          <label
            htmlFor="dueBeforeFilter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Due Before
          </label>
          <input
            type="datetime-local"
            id="dueBeforeFilter"
            value={filters.due_before || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                due_before: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Due After Filter */}
        <div>
          <label
            htmlFor="dueAfterFilter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Due After
          </label>
          <input
            type="datetime-local"
            id="dueAfterFilter"
            value={filters.due_after || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                due_after: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label
              htmlFor="tagFilter"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Tag
            </label>
            <select
              id="tagFilter"
              value={filters.tag || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tag: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters and Clear Button */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </span>
            <div className="flex flex-wrap gap-1">
              {filters.status && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.status}
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Priority: {filters.priority}
                </span>
              )}
              {filters.tag && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tag: #{filters.tag}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && activeFilterCount > 0 && (
        <div className="mt-4 p-4 text-center text-sm text-gray-600 bg-gray-50 rounded-md">
          No todos match the current filters.{' '}
          <button
            onClick={handleClearAll}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
