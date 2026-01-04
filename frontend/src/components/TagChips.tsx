/** TagChips component for displaying task tags as clickable chips. */

import type { Todo } from '@/types';

interface TagChipsProps {
  todo: Todo;
  onTagClick?: (tag: string) => void;
}

export default function TagChips({ todo, onTagClick }: TagChipsProps) {
  if (!todo.tags || todo.tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {todo.tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors"
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
