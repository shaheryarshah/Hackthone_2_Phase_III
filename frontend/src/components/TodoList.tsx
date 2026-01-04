/** TodoList component for displaying a list of todos. */

import TodoItem from './TodoItem';
import type { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  onTodoUpdate: () => void;
  onTodoDelete: () => void;
  onTodoToggleComplete: () => void;
  onTagClick?: (tag: string) => void;
  apiUrl?: string;
}

export default function TodoList({
  todos,
  onTodoUpdate,
  onTodoDelete,
  onTodoToggleComplete,
  onTagClick,
  apiUrl,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No todos yet</p>
        <p className="text-sm mt-2">Add your first todo above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onTodoUpdate}
          onDelete={onTodoDelete}
          onToggleComplete={onTodoToggleComplete}
          onTagClick={onTagClick}
          apiUrl={apiUrl}
        />
      ))}
    </div>
  );
}
