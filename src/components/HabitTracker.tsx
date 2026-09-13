import { useState } from 'react';
import { Check, Plus, Sparkles, X, ChevronRight } from 'lucide-react';
import type { HabitWithCompletion } from '../lib/supabase';

interface HabitTrackerProps {
  habits: HabitWithCompletion[];
  loading: boolean;
  onToggle: (habitId: string) => Promise<void>;
  onAddHabit?: (name: string, icon: string, color: string) => Promise<void>;
  onDeleteHabit?: (habitId: string) => Promise<void>;
  onHabitClick?: (habit: HabitWithCompletion) => void;
}

const HABIT_ICONS = ['💧', '🧘', '✨', '📚', '🌸', '💪', '🏃', '🌙', '🌿', '☀️'];
const HABIT_COLORS = ['#E8B4B8', '#B8A9E0', '#9CAF88', '#A8C8DC', '#D4C99E'];

export function HabitTracker({ habits, loading, onToggle, onAddHabit, onDeleteHabit, onHabitClick }: HabitTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('✨');
  const [newColor, setNewColor] = useState('#E8B4B8');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sparkleId, setSparkleId] = useState<string | null>(null);

  const handleToggle = async (habitId: string) => {
    setTogglingId(habitId);
    try {
      await onToggle(habitId);
      setSparkleId(habitId);
      setTimeout(() => setSparkleId(null), 600);
    } finally {
      setTimeout(() => setTogglingId(null), 300);
    }
  };

  const handleAddHabit = async () => {
    if (!newName.trim() || !onAddHabit) return;
    await onAddHabit(newName.trim(), newIcon, newColor);
    setNewName('');
    setNewIcon('✨');
    setNewColor('#E8B4B8');
    setShowAddModal(false);
  };

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

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-sage-700">Today's Habits</h2>
        {onAddHabit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-8 h-8 rounded-xl bg-lavender-100 hover:bg-lavender-200 flex items-center justify-center text-lavender-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌸</div>
          <p className="text-sage-500 text-sm">No habits yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 text-blush-500 text-sm font-medium hover:text-blush-600"
          >
            Add your first habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                habit.completed_today
                  ? 'bg-gradient-to-r from-sage-50 to-lavender-50 border border-sage-200/50'
                  : 'bg-cream-50 hover:bg-cream-100 border border-cream-200/50'
              }`}
              onClick={() => onHabitClick?.(habit)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(habit.id);
                }}
                disabled={togglingId === habit.id}
                className={`habit-check relative ${habit.completed_today ? 'completed' : ''}`}
                style={!habit.completed_today ? { borderColor: habit.color } : {}}
              >
                {habit.completed_today && (
                  <Check className="w-4 h-4 text-white animate-scale-in" />
                )}
                {sparkleId === habit.id && habit.completed_today && (
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-lavender-400 animate-sparkle" />
                )}
              </button>
              <span className="text-xl">{habit.icon}</span>
              <span className={`flex-1 text-left font-medium ${
                habit.completed_today ? 'text-sage-600' : 'text-sage-700'
              }`}>
                {habit.name}
              </span>
              <ChevronRight className="w-4 h-4 text-sage-400 group-hover:text-sage-600 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[2rem] p-6 pb-safe-bottom animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-sage-800">New Habit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-cream-100 text-sage-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-sage-600 mb-2 block">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Morning Meditation"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-sage-600 mb-2 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {HABIT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewIcon(icon)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        newIcon === icon
                          ? 'bg-lavender-200 border-2 border-lavender-400'
                          : 'bg-cream-100 hover:bg-cream-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-sage-600 mb-2 block">Color</label>
                <div className="flex gap-2">
                  {HABIT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        newColor === color
                          ? 'ring-2 ring-offset-2 ring-lavender-400'
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddHabit}
                disabled={!newName.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
