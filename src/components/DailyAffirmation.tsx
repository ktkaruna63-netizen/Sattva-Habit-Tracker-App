import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Heart, Share2, RefreshCw } from 'lucide-react';

type CategoryKey = 'motivation' | 'peace' | 'gratitude' | 'confidence';

interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  accent: string;
  glow: string;
}

interface Affirmation {
  quote: string;
  author: string;
}

const CATEGORIES: Category[] = [
  { key: 'motivation', label: 'Motivation', emoji: '🌟', accent: 'text-amber-600', glow: 'shadow-amber-200/50' },
  { key: 'peace', label: 'Peace', emoji: '🕊️', accent: 'text-sky-600', glow: 'shadow-sky-200/50' },
  { key: 'gratitude', label: 'Gratitude', emoji: '🙏', accent: 'text-sage-600', glow: 'shadow-sage-200/50' },
  { key: 'confidence', label: 'Confidence', emoji: '💪', accent: 'text-blush-600', glow: 'shadow-blush-200/50' },
];

const AFFIRMATIONS: Record<CategoryKey, Affirmation[]> = {
  motivation: [
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "Your only limit is the one you set on yourself.", author: "Unknown" },
    { quote: "Every morning is a new page. Write something worth remembering.", author: "Unknown" },
    { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
    { quote: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  ],
  peace: [
    { quote: "Peace begins with a conscious breath.", author: "Thich Nhat Hanh" },
    { quote: "The quieter you become, the more you can hear.", author: "Ram Dass" },
    { quote: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { quote: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
    { quote: "Silence is the language of God, all else is poor translation.", author: "Rumi" },
    { quote: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
    { quote: "Be where you are, not where you think you should be.", author: "Unknown" },
    { quote: "Breathe in deeply to bring your mind home to your body.", author: "Thich Nhat Hanh" },
  ],
  gratitude: [
    { quote: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu" },
    { quote: "Be content with what you have; rejoice in the way things are.", author: "Lao Tzu" },
    { quote: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { quote: "Let your intentions be good, and your path will follow.", author: "Unknown" },
    { quote: "Mindfulness is the energy that helps us recognize the conditions of happiness.", author: "Thich Nhat Hanh" },
    { quote: "What you seek is seeking you.", author: "Rumi" },
    { quote: "Gratitude turns what we have into enough.", author: "Unknown" },
  ],
  confidence: [
    { quote: "At the center of your being you have the answer; you know who you are and you know what you want.", author: "Lao Tzu" },
    { quote: "You have within you right now, everything you need for a peaceful life.", author: "Unknown" },
    { quote: "The mind is everything. What you think you become.", author: "Buddha" },
    { quote: "You are exactly where you need to be.", author: "Unknown" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The universe is not outside of you. Look inside yourself.", author: "Rumi" },
    { quote: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Unknown" },
    { quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  ],
};

// Stable daily index derived from the date so the same category picks the
// same quote each day, while the refresh button shuffles within the category.
function getDailyIndex(length: number, offset = 0): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return (dayOfYear + offset) % length;
}

interface DailyAffirmationProps {
  onLike?: () => void;
}

export function DailyAffirmation({ onLike }: DailyAffirmationProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('motivation');
  const [quoteIndex, setQuoteIndex] = useState(() => getDailyIndex(AFFIRMATIONS.motivation.length));
  const [liked, setLiked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // When the category changes, pick a fresh date-based quote for it.
  const handleSelectCategory = (key: CategoryKey) => {
    if (key === activeCategory) return;
    setActiveCategory(key);
    setQuoteIndex(getDailyIndex(AFFIRMATIONS[key].length, key.length));
    setLiked(false);
  };

  const handleRefresh = () => {
    setQuoteIndex((prev) => (prev + 1) % AFFIRMATIONS[activeCategory].length);
    setRefreshKey((k) => k + 1);
    setLiked(false);
  };

  const affirmation = useMemo(
    () => AFFIRMATIONS[activeCategory][quoteIndex],
    [activeCategory, quoteIndex],
  );

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory)!;

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleShare = async () => {
    const text = `"${affirmation.quote}" - ${affirmation.author} ✨\n\n#DailyAffirmation #Mindfulness #Sattva`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Affirmation', text });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  // Clean up the keyframe on unmount.
  useEffect(() => {
    return () => undefined;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="relative p-5 bg-gradient-to-br from-blush-200/60 via-lavender-200/60 to-sage-200/60 backdrop-blur-xl">
        {/* Decorative elements */}
        <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-white/20 blur-xl" />
        <Sparkles className="absolute top-4 right-4 w-5 h-5 text-blush-400 opacity-60" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blush-500" />
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wide">
              Daily Affirmation
            </span>
          </div>

          {/* Category pill buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => {
              const isActive = cat.key === activeCategory;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleSelectCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/90 text-sage-800 shadow-sm scale-105'
                      : 'bg-white/40 text-sage-600 hover:bg-white/60 hover:scale-105'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-sm leading-none">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Affirmation card */}
          <blockquote
            key={`${activeCategory}-${quoteIndex}-${refreshKey}`}
            className="mb-4 animate-fade-in"
          >
            <p className="text-lg font-display font-medium text-sage-800 leading-relaxed">
              "{affirmation.quote}"
            </p>
            <footer className="mt-2 text-sm text-sage-600 italic">
              — {affirmation.author}
            </footer>
          </blockquote>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${
                liked
                  ? 'bg-red-100 text-red-600 border border-red-200'
                  : 'bg-white/50 text-sage-600 border border-white/30 hover:bg-white/70'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{liked ? 'Loved' : 'Love'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-white/50 text-sage-600 border border-white/30 hover:bg-white/70 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-white/50 text-sage-600 border border-white/30 hover:bg-white/70 transition-all"
              aria-label="Show another affirmation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
