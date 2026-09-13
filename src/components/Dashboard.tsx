import { useState, useEffect } from 'react';
import { Flame, Sparkles, BookOpen, Smile, Save, CheckCircle } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { HabitTracker } from './HabitTracker';
import { HabitDetailModal } from './HabitDetailModal';
import { TodoList } from './TodoList';
import { MoodTracker } from './MoodTracker';
import { DailyAffirmation } from './DailyAffirmation';
import { WellnessSection } from './WellnessSection';
import type { HabitWithCompletion, Todo, MoodEntry } from '../lib/supabase';

interface DashboardProps {
  greeting: string;
  date: string;
  habits: HabitWithCompletion[];
  habitsLoading: boolean;
  completionPercentage: number;
  priorityTodos: Todo[];
  laterTodos: Todo[];
  todosLoading: boolean;
  moodEntry: MoodEntry | null;
  moodLoading: boolean;
  currentStreak: number;
  longestStreak: number;
  onToggleHabit: (habitId: string) => Promise<void>;
  onAddHabit: (name: string, icon: string, color: string) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onAddTodo: (title: string, category: 'priority' | 'later') => Promise<void>;
  onToggleTodo: (id: string) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onSetMood: (mood: 'calm' | 'happy' | 'productive' | 'tired', note?: string) => Promise<void>;
}

const GREETING_EMOJIS = ['🌸', '✨', '🌿', '☀️', '🌙'];

export function Dashboard({
  greeting,
  date,
  habits,
  habitsLoading,
  completionPercentage,
  priorityTodos,
  laterTodos,
  todosLoading,
  moodEntry,
  moodLoading,
  currentStreak,
  longestStreak,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onSetMood,
}: DashboardProps) {
  const [selectedHabit, setSelectedHabit] = useState<HabitWithCompletion | null>(null);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const emoji = GREETING_EMOJIS[new Date().getHours() % GREETING_EMOJIS.length];

  // Fix 1 & 2: Local states for Reading Tracker and Yoga Notes with Save Button
  const [readingMinutes, setReadingMinutes] = useState<number>(0);
  const [yogaNotes, setYogaNotes] = useState<string>('');
  const [isNotesSaved, setIsNotesSaved] = useState<boolean>(false);

  // Load custom values from localStorage so user sees their own dynamic data
  useEffect(() => {
    const savedMinutes = localStorage.getItem('sattva_reading_mins');
    const savedNotes = localStorage.getItem('sattva_yoga_notes');
    if (savedMinutes) setReadingMinutes(parseInt(savedMinutes) || 0);
    if (savedNotes) setYogaNotes(savedNotes);
  }, []);

  const handleSaveYogaNotes = () => {
    localStorage.setItem('sattva_yoga_notes', yogaNotes);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 3000); // Hide success alert after 3s
  };

  const handleUpdateReading = (val: number) => {
    const newMins = Math.max(0, readingMinutes + val);
    setReadingMinutes(newMins);
    localStorage.setItem('sattva_reading_mins', newMins.toString());
  };

  const handleHabitClick = (habit: HabitWithCompletion) => {
    setSelectedHabit(habit);
    setShowHabitModal(true);
  };

  const handleCloseModal = () => {
    setShowHabitModal(false);
    setTimeout(() => setSelectedHabit(null), 300);
  };

  return (
    <div className="min-h-screen pb-4 overflow-x-hidden">
      <div className="max-w-md mx-auto px-4 pt-safe-top pb-28">
        {/* Header with Streak */}
        <header className="pt-6 pb-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-500 mb-1">{date}</p>
              <h1 className="text-2xl font-medium text-sage-800">
                {greeting} <span className="ml-1">{emoji}</span>
              </h1>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
              currentStreak > 0 ? 'bg-gradient-to-r from-orange-100 to-red-100' : 'bg-sage-100'
            }`}>
              <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500 animate-bounce-soft' : 'text-sage-400'}`} />
              <div>
                <div className={`text-sm font-semibold ${currentStreak > 0 ? 'text-orange-600' : 'text-sage-400'}`}>
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </div>
                <div className="text-xs text-sage-400">streak</div>
              </div>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="mt-3 card p-3 flex items-center gap-3 bg-gradient-to-r from-orange-50/80 to-blush-50/80 border-orange-200/50 animate-slide-up">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-sage-600">
                {currentStreak >= 7
                  ? `Amazing! ${currentStreak} days in a row! You're on fire!`
                  : currentStreak >= 3
                    ? "Great momentum! Keep the streak alive!"
                    : "You're building momentum! Keep going!"}
              </p>
            </div>
          )}
        </header>

        {/* Daily Affirmation */}
        <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <DailyAffirmation />
        </section>

        {/* Progress Section */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="card p-6 flex flex-col items-center">
            <ProgressRing percentage={completionPercentage} />
            <p className="mt-4 text-sage-600 text-center">
              {completionPercentage === 100
                ? "Amazing! You've completed all habits today!"
                : completionPercentage === 0
                  ? "Start your day by checking off some habits"
                  : "You're doing great! Keep going!"}
            </p>
          </div>
        </section>

        {/* CUSTOM BUG-FIX SPECIAL SECTION: READING & YOGA FIX */}
        <section className="mb-4 p-4 card bg-gradient-to-br from-sage-50 to-lavender-50 border-sage-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Smile className="w-5 h-5 text-sage-600" />
            <h2 className="text-sm font-bold text-sage-800 tracking-wide uppercase">Today's Focus & Wellness</h2>
          </div>

          {/* 1. Dynamic Reading Counter Instead of Hardcoded 45 */}
          <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl mb-3 border border-sage-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200">Reading Tracker</h4>
                <p className="text-[11px] text-gray-400">Count your dynamic minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border">
              <button onClick={() => handleUpdateReading(-5)} className="text-xs font-extrabold text-gray-500 px-1.5 hover:text-red-500">-5</button>
              <span className="text-sm font-bold text-sage-800 min-w-[35px] text-center">{readingMinutes}m</span>
              <button onClick={() => handleUpdateReading(5)} className="text-xs font-extrabold text-gray-500 px-1.5 hover:text-green-500">+5</button>
            </div>
          </div>

          {/* 2. Morning Yoga Notes Textarea With Perfect Working Save Button */}
          <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl border border-sage-100">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200">🧘 Morning Yoga Journal</h4>
              {isNotesSaved && (
                <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>
            <textarea
              value={yogaNotes}
              onChange={(e) => setYogaNotes(e.target.value)}
              placeholder="Write your morning yoga insights or poses here..."
              className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-sage-400 resize-none h-16 text-gray-700"
            />
            <button
              onClick={handleSaveYogaNotes}
              className="mt-1.5 w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" /> Save Yoga Notes
            </button>
          </div>
        </section>

        {/* Wellness Section (Standard) */}
        <section className="mb-4">
          <WellnessSection />
        </section>

        {/* Habits Section */}
        <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <HabitTracker
            habits={habits}
            loading={habitsLoading}
            onToggle={onToggleHabit}
            onAddHabit={onAddHabit}
            onDeleteHabit={deleteHabit}
            onHabitClick={handleHabitClick}
          />
        </section>

        {/* Todos Section */}
        <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <TodoList
            priorityTodos={priorityTodos}
            laterTodos={laterTodos}
            loading={todosLoading}
            onAdd={onAddTodo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        </section>

        {/* Mood Section */}
        <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Mood tracking feature coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
