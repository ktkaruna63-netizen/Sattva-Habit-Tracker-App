import { useState } from 'react';
import { X } from 'lucide-react';
import type { MoodEntry } from '../lib/supabase';
import { MOOD_CONFIG } from '../lib/supabase';

interface MoodTrackerProps {
  moodEntry: MoodEntry | null;
  loading: boolean;
  onSetMood: (mood: 'calm' | 'happy' | 'productive' | 'tired', note?: string) => Promise<void>;
}

export function MoodTracker({ moodEntry, loading, onSetMood }: MoodTrackerProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'calm' | 'happy' | 'productive' | 'tired' | null>(null);
  const [note, setNote] = useState(moodEntry?.note || '');
  const [settingMood, setSettingMood] = useState(false);

  const handleMoodSelect = async (mood: 'calm' | 'happy' | 'productive' | 'tired') => {
    setSettingMood(true);
    try {
      await onSetMood(mood);
    } finally {
      setSettingMood(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedMood && !moodEntry) return;
    await onSetMood((selectedMood || moodEntry!.mood), note || undefined);
    setShowNoteModal(false);
    setSelectedMood(null);
  };

  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-6 bg-blush-100 rounded w-32 mb-4 animate-pulse" />
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-14 h-14 bg-cream-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const currentMood = moodEntry?.mood;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-sage-700">How are you feeling?</h2>
        {moodEntry?.note && (
          <button
            onClick={() => {
              setNote(moodEntry.note || '');
              setShowNoteModal(true);
            }}
            className="text-xs text-lavender-500 hover:text-lavender-600"
          >
            View note
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(MOOD_CONFIG) as [typeof currentMood, (typeof MOOD_CONFIG)[typeof currentMood]][]).map(([mood, config]) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            disabled={settingMood}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-300 ${
              currentMood === mood
                ? `${config.color} border-current scale-100 shadow-soft`
                : 'bg-white/50 border-cream-200 hover:border-cream-300 hover:bg-white/70'
            }`}
          >
            <span className="text-2xl">{config.emoji}</span>
            <span className={`text-xs font-medium ${
              currentMood === mood ? '' : 'text-sage-500'
            }`}>
              {config.label}
            </span>
          </button>
        ))}
      </div>

      {moodEntry && !showNoteModal && (
        <button
          onClick={() => {
            setSelectedMood(moodEntry.mood);
            setNote(moodEntry.note || '');
            setShowNoteModal(true);
          }}
          className="w-full mt-4 py-2.5 rounded-xl bg-cream-50 hover:bg-cream-100 text-sage-600 text-sm font-medium transition-all border border-cream-200"
        >
          {moodEntry.note ? 'Update journal note' : 'Add a note'}
        </button>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-sage-700">Journal Note</h3>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedMood(null);
                }}
                className="p-2 rounded-xl hover:bg-cream-100 text-sage-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling today? Write a quick note..."
              className="w-full h-32 px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 resize-none focus:outline-none focus:ring-2 focus:ring-blush-200 text-sage-700 placeholder:text-sage-400"
            />

            <button
              onClick={handleSaveNote}
              className="btn-primary w-full mt-4"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
