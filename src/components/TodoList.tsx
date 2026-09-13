import { useState } from 'react';
import { Plus, Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import type { Todo } from '../lib/supabase';

interface TodoListProps {
  priorityTodos: Todo[];
  laterTodos: Todo[];
  loading: boolean;
  onAdd: (title: string, category: 'priority' | 'later') => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ priorityTodos, laterTodos, loading, onAdd, onToggle, onDelete }: TodoListProps) {
  const [showAddPriority, setShowAddPriority] = useState(false);
  const [showAddLater, setShowAddLater] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [addingTo, setAddingTo] = useState<'priority' | 'later' | null>(null);
  const [priorityExpanded, setPriorityExpanded] = useState(true);
  const [laterExpanded, setLaterExpanded] = useState(true);

  const handleAdd = async (category: 'priority' | 'later') => {
    if (!newTitle.trim()) return;
    setAddingTo(category);
    try {
      await onAdd(newTitle.trim(), category);
      setNewTitle('');
      setShowAddPriority(false);
      setShowAddLater(false);
    } finally {
      setAddingTo(null);
    }
  };

  const completedPriority = priorityTodos.filter(t => t.completed).length;
  const completedLater = laterTodos.filter(t => t.completed).length;

  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-6 bg-blush-100 rounded w-32 mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-cream-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const TodoItem = ({ todo }: { todo: Todo }) => (
    <div
      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        todo.completed
          ? 'bg-sage-50/50 opacity-70'
          : 'bg-white/50 hover:bg-white/70'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-sage-500 border-sage-500'
            : 'border-cream-300 hover:border-blush-300'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-sage-400' : 'text-sage-700'}`}>
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-500 transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="card p-5">
      <h2 className="text-lg font-medium text-sage-700 mb-4">To-Do List</h2>

      {/* Priority Section */}
      <div className="mb-4">
        <button
          onClick={() => setPriorityExpanded(!priorityExpanded)}
          className="flex items-center gap-2 w-full mb-2 text-left"
        >
          <div className="flex items-center gap-2 flex-1">
            {priorityExpanded ? (
              <ChevronDown className="w-4 h-4 text-blush-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blush-400" />
            )}
            <span className="text-sm font-medium text-blush-600">Top Priorities</span>
            {priorityTodos.length > 0 && (
              <span className="text-xs text-blush-400">
                {completedPriority}/{priorityTodos.length}
              </span>
            )}
          </div>
          {!showAddPriority && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddPriority(true);
                setShowAddLater(false);
              }}
              className="p-1.5 rounded-lg hover:bg-blush-100 text-blush-400 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </button>

        {priorityExpanded && (
          <div className="space-y-1 ml-6">
            {showAddPriority && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd('priority')}
                  placeholder="Add priority task..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/80 border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-200"
                  autoFocus
                />
                <button
                  onClick={() => handleAdd('priority')}
                  disabled={!newTitle.trim() || addingTo === 'priority'}
                  className="px-3 py-2 rounded-xl bg-blush-500 text-white text-sm font-medium hover:bg-blush-600 disabled:opacity-50 transition-all"
                >
                  Add
                </button>
              </div>
            )}
            {priorityTodos.length === 0 && !showAddPriority ? (
              <p className="text-xs text-sage-400 py-2">No priority tasks</p>
            ) : (
              priorityTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            )}
          </div>
        )}
      </div>

      {/* Later Section */}
      <div>
        <button
          onClick={() => setLaterExpanded(!laterExpanded)}
          className="flex items-center gap-2 w-full mb-2 text-left"
        >
          <div className="flex items-center gap-2 flex-1">
            {laterExpanded ? (
              <ChevronDown className="w-4 h-4 text-lavender-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-lavender-400" />
            )}
            <span className="text-sm font-medium text-lavender-600">Later Tasks</span>
            {laterTodos.length > 0 && (
              <span className="text-xs text-lavender-400">
                {completedLater}/{laterTodos.length}
              </span>
            )}
          </div>
          {!showAddLater && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddLater(true);
                setShowAddPriority(false);
              }}
              className="p-1.5 rounded-lg hover:bg-lavender-100 text-lavender-400 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </button>

        {laterExpanded && (
          <div className="space-y-1 ml-6">
            {showAddLater && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd('later')}
                  placeholder="Add later task..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/80 border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-200"
                  autoFocus
                />
                <button
                  onClick={() => handleAdd('later')}
                  disabled={!newTitle.trim() || addingTo === 'later'}
                  className="px-3 py-2 rounded-xl bg-lavender-500 text-white text-sm font-medium hover:bg-lavender-600 disabled:opacity-50 transition-all"
                >
                  Add
                </button>
              </div>
            )}
            {laterTodos.length === 0 && !showAddLater ? (
              <p className="text-xs text-sage-400 py-2">No later tasks</p>
            ) : (
              laterTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
