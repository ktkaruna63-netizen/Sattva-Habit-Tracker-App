import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Minus, Plus, Book, Clock, Droplets, Sparkles, Sun, Moon, Heart, Check, Play, Pause, Square } from 'lucide-react';
import type { HabitWithCompletion } from '../lib/supabase';
import { useWaterIntake, useReadingLogs, useMeditationLogs, useSkincareRoutine, useGratitudeEntry } from '../hooks/useHabitDetails';
import { getHabitTypeFromName } from './habitDetailPages/utils';

interface HabitDetailModalProps {
  habit: HabitWithCompletion | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (habitId: string) => Promise<void>;
}

export function HabitDetailModal({ habit, isOpen, onClose, onToggleComplete }: HabitDetailModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 50);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!habit) return null;

  const habitType = getHabitTypeFromName(habit.name);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 ${
          showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2rem] shadow-2xl transition-all duration-300 ease-out ${
          showContent ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: 'fit-content', maxHeight: '85vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-sage-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-sage-100">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: habit.color + '20' }}
            >
              {habit.icon}
            </div>
            <div>
              <h2 className="text-lg font-medium text-sage-800">{habit.name}</h2>
              <p className="text-sm text-sage-500">Track your daily progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-sage-100 text-sage-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          <div className="p-5 safe-bottom">
            {habitType === 'water' && (
              <WaterDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
            {habitType === 'reading' && (
              <ReadingDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
            {habitType === 'meditation' && (
              <MeditationDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
            {habitType === 'skincare' && (
              <SkincareDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
            {habitType === 'gratitude' && (
              <GratitudeDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
            {habitType === 'generic' && (
              <GenericDetail habit={habit} onToggleComplete={onToggleComplete} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface DetailProps {
  habit: HabitWithCompletion;
  onToggleComplete: (habitId: string) => Promise<void>;
}

function WaterDetail({ habit, onToggleComplete }: DetailProps) {
  const { data, loading, incrementGlass, decrementGlass, updateGoal } = useWaterIntake();
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [newGoal, setNewGoal] = useState(8);

  const glasses = data?.glasses || 0;
  const goal = data?.goal || 8;
  const percentage = Math.min((glasses / goal) * 100, 100);

  const handleGoalSave = async () => {
    await updateGoal(newGoal);
    setShowGoalEdit(false);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-sage-100 rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress Circle */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#waterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * percentage) / 100}
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8C8DC" />
                <stop offset="100%" stopColor="#7EB5D0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-3xl font-semibold text-sage-800">{glasses}</span>
            <span className="text-sm text-sage-500">of {goal} glasses</span>
          </div>
        </div>
      </div>

      {/* Glass Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={decrementGlass}
          disabled={glasses === 0}
          className="w-14 h-14 rounded-2xl bg-sage-100 hover:bg-sage-200 flex items-center justify-center text-sage-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Minus className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5 flex-wrap justify-center max-w-[200px]">
          {Array.from({ length: goal }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-8 rounded-lg transition-all duration-300 ${
                i < glasses
                  ? 'bg-gradient-to-t from-sky-400 to-sky-200 shadow-sm'
                  : 'bg-sage-100 border border-sage-200'
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
        <button
          onClick={incrementGlass}
          disabled={glasses >= 20}
          className="w-14 h-14 rounded-2xl bg-sky-100 hover:bg-sky-200 flex items-center justify-center text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Goal Edit */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-sage-600">Daily Goal</span>
          {showGoalEdit ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-1 text-center rounded-lg bg-sage-50 border border-sage-200 text-sm"
                autoFocus
              />
              <button
                onClick={handleGoalSave}
                className="text-sm text-sky-600 font-medium"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setNewGoal(goal);
                setShowGoalEdit(true);
              }}
              className="text-sm text-sage-500 hover:text-sage-700"
            >
              {goal} glasses
            </button>
          )}
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : 'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:shadow-lg'
        }`}
      >
        {habit.completed_today ? 'Completed Today!' : `Mark as Complete${glasses >= goal ? '!' : ` (${glasses}/${goal} glasses)`}`}
      </button>
    </div>
  );
}

function ReadingDetail({ habit, onToggleComplete }: DetailProps) {
  const { todayLog, recentLogs, loading, addLog, totalPagesToday, totalPagesWeek } = useReadingLogs();
  const [pages, setPages] = useState('10');
  const [bookName, setBookName] = useState(todayLog?.book_name || '');
  const [showHistory, setShowHistory] = useState(false);

  const handleAddPages = async () => {
    const pagesRead = parseInt(pages) || 0;
    if (pagesRead <= 0) return;
    await addLog(bookName || undefined, pagesRead);
    setPages('10');
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-sage-100 rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <Book className="w-5 h-5 mx-auto text-lavender-400 mb-2" />
          <div className="text-2xl font-semibold text-sage-800">{totalPagesToday}</div>
          <div className="text-xs text-sage-500">Pages Today</div>
        </div>
        <div className="card p-4 text-center">
          <Book className="w-5 h-5 mx-auto text-sage-400 mb-2" />
          <div className="text-2xl font-semibold text-sage-800">{totalPagesWeek}</div>
          <div className="text-xs text-sage-500">Pages This Week</div>
        </div>
      </div>

      {/* Add Pages */}
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-sage-600 mb-1.5 block">Book Name (optional)</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            placeholder="e.g., Atomic Habits"
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-sage-600 mb-1.5 block">Pages Read</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              min="1"
              className="input-field text-sm flex-1"
            />
            <button
              onClick={handleAddPages}
              className="px-5 py-3 rounded-2xl bg-lavender-500 text-white font-medium hover:bg-lavender-600 transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-between text-sm text-sage-600 py-2"
      >
        <span>Reading History</span>
        {showHistory ? <ChevronLeft className="w-4 h-4 rotate-90" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {showHistory && recentLogs.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          {recentLogs.map((log) => (
            <div key={log.id} className="card p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-sage-700">
                  {log.pages_read} pages
                </div>
                {log.book_name && (
                  <div className="text-xs text-sage-500">{log.book_name}</div>
                )}
              </div>
              <div className="text-xs text-sage-400">
                {new Date(log.entry_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : 'bg-gradient-to-r from-lavender-400 to-lavender-500 text-white hover:shadow-lg'
        }`}
      >
        {habit.completed_today ? 'Completed Today!' : 'Mark as Complete'}
      </button>
    </div>
  );
}

function MeditationDetail({ habit, onToggleComplete }: DetailProps) {
  const { todayLog, recentLogs, loading, logSession, totalMinutesToday, totalMinutesWeek } = useMeditationLogs();
  const [minutes, setMinutes] = useState('10');
  const [type, setType] = useState<'breathing' | 'mindfulness' | 'body_scan' | 'guided' | 'custom'>('mindfulness');

  // Timer state
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savingSession, setSavingSession] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const types: { value: typeof type; label: string; emoji: string }[] = [
    { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
    { value: 'breathing', label: 'Breathing', emoji: '🌬️' },
    { value: 'body_scan', label: 'Body Scan', emoji: '✨' },
    { value: 'guided', label: 'Guided', emoji: '🎧' },
    { value: 'custom', label: 'Custom', emoji: '💫' },
  ];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleStart = () => {
    const targetMins = parseInt(minutes) || 0;
    if (targetMins <= 0) return;

    if (timerState === 'idle') {
      const totalSeconds = targetMins * 60;
      setRemainingSeconds(totalSeconds);
      setElapsedSeconds(0);
    }
    setTimerState('running');
  };

  // Tick effect — runs the countdown while in running state
  useEffect(() => {
    if (timerState !== 'running') {
      clearTimer();
      return;
    }
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Timer finished naturally
          clearTimer();
          setTimerState('finished');
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearTimer();
  }, [timerState, clearTimer]);

  // When timer naturally finishes, save the full session
  useEffect(() => {
    if (timerState !== 'finished') return;
    const saveCompleted = async () => {
      const targetMins = parseInt(minutes) || 0;
      if (targetMins > 0 && !savingSession) {
        setSavingSession(true);
        try {
          await logSession(targetMins, type);
        } finally {
          setSavingSession(false);
          setTimerState('idle');
          setRemainingSeconds(0);
          setElapsedSeconds(0);
        }
      }
    };
    saveCompleted();
  }, [timerState, minutes, type, logSession, savingSession]);

  const handlePause = () => {
    setTimerState('paused');
  };

  const handleStop = () => {
    clearTimer();
    // When stopped mid-session, offer to save elapsed minutes (rounded up to nearest minute)
    const elapsedMins = Math.max(1, Math.ceil(elapsedSeconds / 60));
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setTimerState('idle');
    if (elapsedSeconds > 0) {
      const confirmed = window.confirm(
        `You meditated for ${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s. Save this partial session?`
      );
      if (confirmed) {
        setSavingSession(true);
        logSession(elapsedMins, type).finally(() => setSavingSession(false));
      }
    }
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = timerState === 'running' || timerState === 'paused';
  const targetSeconds = (parseInt(minutes) || 0) * 60;
  const progressPct = isActive && targetSeconds > 0
    ? Math.round((elapsedSeconds / targetSeconds) * 100)
    : 0;

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-sage-100 rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-lavender-400 mb-2" />
          <div className="text-2xl font-semibold text-sage-800">{savingSession ? '…' : totalMinutesToday}</div>
          <div className="text-xs text-sage-500">Minutes Today</div>
        </div>
        <div className="card p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-sage-400 mb-2" />
          <div className="text-2xl font-semibold text-sage-800">{savingSession ? '…' : totalMinutesWeek}</div>
          <div className="text-xs text-sage-500">Minutes This Week</div>
        </div>
      </div>

      {/* Live Countdown Timer */}
      {isActive && (
        <div className="card p-6 text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E5E7EB" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="#B8A9E0"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={276.5}
                strokeDashoffset={276.5 - (276.5 * progressPct) / 100}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-semibold text-sage-800 tabular-nums tracking-tight">
                {formatTime(remainingSeconds)}
              </div>
              <div className="text-xs text-sage-500 mt-1">
                {timerState === 'running' ? 'Meditating…' : 'Paused'}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {timerState === 'running' ? (
              <button
                onClick={handlePause}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sage-100 text-sage-700 font-medium hover:bg-sage-200 transition-all active:scale-95"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-lavender-500 text-white font-medium hover:bg-lavender-600 transition-all active:scale-95"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
            )}
            <button
              onClick={handleStop}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blush-100 text-blush-700 font-medium hover:bg-blush-200 transition-all active:scale-95"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Session Setup (only when idle) */}
      {!isActive && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="text-sm text-sage-600 mb-2 block">Session Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all ${
                    type === t.value
                      ? 'bg-lavender-200 text-lavender-700 border-2 border-lavender-400'
                      : 'bg-sage-50 text-sage-600 border border-sage-200 hover:bg-sage-100'
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-sage-600 mb-1.5 block">Duration (minutes)</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="1"
                className="input-field text-sm flex-1"
              />
              <button
                onClick={handleStart}
                disabled={savingSession || (parseInt(minutes) || 0) <= 0}
                className="px-5 py-3 rounded-2xl bg-lavender-500 text-white font-medium hover:bg-lavender-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets (only when idle) */}
      {!isActive && (
        <div className="flex gap-2 justify-center">
          {[5, 10, 15, 20, 30].map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m.toString())}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                minutes === m.toString()
                  ? 'bg-lavender-200 text-lavender-700 border-2 border-lavender-400'
                  : 'bg-sage-50 text-sage-600 border border-sage-200 hover:bg-sage-100'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : 'bg-gradient-to-r from-lavender-400 to-blush-400 text-white hover:shadow-lg'
        }`}
      >
        {habit.completed_today ? 'Completed Today!' : 'Mark as Complete'}
      </button>
    </div>
  );
}

function SkincareDetail({ habit, onToggleComplete }: DetailProps) {
  const { data, loading, toggleStep, morningComplete, nightComplete, completedSteps, totalSteps, completionPercentage } = useSkincareRoutine();

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-sage-100 rounded-3xl" />
    </div>;
  }

  const morningSteps = [
    { key: 'cleanser' as const, label: 'Cleanser', emoji: '🧴' },
    { key: 'toner' as const, label: 'Toner', emoji: '💧' },
    { key: 'sunscreen' as const, label: 'Sunscreen', emoji: '☀️' },
  ];

  const nightSteps = [
    { key: 'serum' as const, label: 'Serum', emoji: '✨' },
    { key: 'moisturizer' as const, label: 'Moisturizer', emoji: '🫧' },
  ];

  return (
    <div className="space-y-5">
      {/* Progress Summary */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-sage-500">Today's Progress</div>
            <div className="text-2xl font-semibold text-sage-800">{completedSteps}/{totalSteps} steps</div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="#E8B4B8"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * completionPercentage) / 100}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-blush-600">
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Morning Routine */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-medium text-sage-700">Morning Routine</h3>
          {morningComplete && (
            <span className="ml-auto text-xs text-sage-500 bg-sage-100 px-2 py-0.5 rounded-full">Complete</span>
          )}
        </div>
        <div className="space-y-2">
          {morningSteps.map((step) => (
            <button
              key={step.key}
              onClick={() => toggleStep(step.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                data?.[step.key]
                  ? 'bg-blush-50 border-2 border-blush-300'
                  : 'bg-sage-50 border border-sage-200 hover:bg-sage-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                data?.[step.key]
                  ? 'bg-blush-400 border-blush-400'
                  : 'border-sage-300'
              }`}>
                {data?.[step.key] && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-lg">{step.emoji}</span>
              <span className={`flex-1 text-left text-sm ${data?.[step.key] ? 'text-blush-700 font-medium' : 'text-sage-600'}`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Night Routine */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-medium text-sage-700">Night Routine</h3>
          {nightComplete && (
            <span className="ml-auto text-xs text-sage-500 bg-sage-100 px-2 py-0.5 rounded-full">Complete</span>
          )}
        </div>
        <div className="space-y-2">
          {nightSteps.map((step) => (
            <button
              key={step.key}
              onClick={() => toggleStep(step.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                data?.[step.key]
                  ? 'bg-lavender-50 border-2 border-lavender-300'
                  : 'bg-sage-50 border border-sage-200 hover:bg-sage-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                data?.[step.key]
                  ? 'bg-lavender-400 border-lavender-400'
                  : 'border-sage-300'
              }`}>
                {data?.[step.key] && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-lg">{step.emoji}</span>
              <span className={`flex-1 text-left text-sm ${data?.[step.key] ? 'text-lavender-700 font-medium' : 'text-sage-600'}`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : 'bg-gradient-to-r from-blush-400 to-lavender-400 text-white hover:shadow-lg'
        }`}
      >
        {habit.completed_today ? 'Completed Today!' : 'Mark as Complete'}
      </button>
    </div>
  );
}

function GratitudeDetail({ habit, onToggleComplete }: DetailProps) {
  const { data, loading, saving, saveEntry, isComplete } = useGratitudeEntry();
  const [entry1, setEntry1] = useState(data?.gratitude_1 || '');
  const [entry2, setEntry2] = useState(data?.gratitude_2 || '');
  const [entry3, setEntry3] = useState(data?.gratitude_3 || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setEntry1(data.gratitude_1 || '');
      setEntry2(data.gratitude_2 || '');
      setEntry3(data.gratitude_3 || '');
    }
  }, [data]);

  const handleSave = async () => {
    await saveEntry(entry1, entry2, entry3);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-sage-100 rounded-3xl" />
    </div>;
  }

  const hasContent = entry1.trim() || entry2.trim() || entry3.trim();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-3">
          <Heart className="w-8 h-8 text-blush-400" />
        </div>
        <h3 className="text-lg font-medium text-sage-800">What are you grateful for?</h3>
        <p className="text-sm text-sage-500 mt-1">Take a moment to reflect on your blessings</p>
      </div>

      {/* Gratitude Entries */}
      <div className="space-y-3">
        <div className="card p-4">
          <label className="text-sm text-sage-600 mb-2 block">I am grateful for...</label>
          <textarea
            value={entry1}
            onChange={(e) => setEntry1(e.target.value)}
            placeholder="Something that brought you joy today..."
            className="w-full h-20 px-4 py-3 rounded-2xl bg-sage-50 border border-sage-200 resize-none focus:outline-none focus:ring-2 focus:ring-blush-200 text-sage-700"
          />
        </div>

        <div className="card p-4">
          <label className="text-sm text-sage-600 mb-2 block">I appreciate...</label>
          <textarea
            value={entry2}
            onChange={(e) => setEntry2(e.target.value)}
            placeholder="Someone or something you appreciate..."
            className="w-full h-20 px-4 py-3 rounded-2xl bg-sage-50 border border-sage-200 resize-none focus:outline-none focus:ring-2 focus:ring-blush-200 text-sage-700"
          />
        </div>

        <div className="card p-4">
          <label className="text-sm text-sage-600 mb-2 block">I am thankful for...</label>
          <textarea
            value={entry3}
            onChange={(e) => setEntry3(e.target.value)}
            placeholder="A moment of gratitude from today..."
            className="w-full h-20 px-4 py-3 rounded-2xl bg-sage-50 border border-sage-200 resize-none focus:outline-none focus:ring-2 focus:ring-blush-200 text-sage-700"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !hasContent}
        className={`w-full py-4 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          saved
            ? 'bg-sage-500 text-white'
            : 'bg-gradient-to-r from-blush-400 to-sage-400 text-white hover:shadow-lg'
        }`}
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Entry'}
      </button>

      {/* Motivational Note */}
      {isComplete && (
        <div className="card p-4 flex items-start gap-3 bg-gradient-to-r from-blush-50 to-cream-50 border-blush-200">
          <Sparkles className="w-5 h-5 text-blush-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-sage-600">
            Gratitude transforms what you have into enough. Keep cherishing the little moments!
          </p>
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : 'bg-white border-2 border-blush-300 text-blush-500 hover:bg-blush-50'
        }`}
      >
        {habit.completed_today ? 'Gratitude Completed!' : 'Mark Gratitude as Complete'}
      </button>
    </div>
  );
}

function GenericDetail({ habit, onToggleComplete }: DetailProps) {
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const handleSaveNote = () => {
    setSavedNote(note);
  };

  return (
    <div className="space-y-5">
      {/* Icon and Message */}
      <div className="text-center py-6">
        <div
          className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-4"
          style={{ backgroundColor: habit.color + '20' }}
        >
          {habit.icon}
        </div>
        <h3 className="text-lg font-medium text-sage-800 mb-1">{habit.name}</h3>
        <p className="text-sm text-sage-500">Keep building this healthy habit!</p>
      </div>

      {/* Note Section */}
      <div className="card p-4 space-y-3">
        <label className="text-sm text-sage-600 block">Add a note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did it go today?"
          className="w-full h-24 px-4 py-3 rounded-2xl bg-sage-50 border border-sage-200 resize-none focus:outline-none focus:ring-2 focus:ring-blush-200 text-sage-700"
        />
        {savedNote && (
          <p className="text-xs text-sage-400 italic">Note saved!</p>
        )}
      </div>

      {/* Motivational Tip */}
      <div className="card p-4 flex items-start gap-3 bg-gradient-to-r from-blush-50 to-lavender-50 border-blush-200">
        <Sparkles className="w-5 h-5 text-blush-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sage-600">
          Small consistent actions lead to big transformations. Every day you show up counts!
        </p>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => onToggleComplete(habit.id)}
        className={`w-full py-4 rounded-2xl font-medium transition-all ${
          habit.completed_today
            ? 'bg-sage-500 text-white'
            : `bg-white border-2 hover:shadow-lg`}
        }`}
        style={!habit.completed_today ? { borderColor: habit.color, color: habit.color } : {}}
      >
        {habit.completed_today ? 'Completed Today!' : 'Mark as Complete'}
      </button>
    </div>
  );
}
