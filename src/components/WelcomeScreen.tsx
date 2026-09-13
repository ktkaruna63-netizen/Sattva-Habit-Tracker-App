import { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const QUOTES = [
  "Design your day, beautifully.",
  "Small steps, big transformations.",
  "Every day is a fresh canvas.",
  "Your journey to self begins here.",
];

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blush-300 via-lavender-300 to-sage-300 rounded-[2rem] flex items-center justify-center shadow-glow">
            <span className="text-5xl transform -rotate-12">🌸</span>
          </div>
          <Sparkles className="absolute -right-2 top-0 w-6 h-6 text-lavender-400 animate-bounce-soft" />
          <Sparkles className="absolute -left-2 bottom-4 w-5 h-5 text-blush-400 animate-bounce-soft" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-display font-semibold text-gradient mb-3">
          Sattva
        </h1>

        {/* Tagline */}
        <p className="text-lg text-blush-600/80 font-light mb-12 max-w-xs mx-auto">
          {QUOTES[quoteIndex]}
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-sm mx-auto">
          {[
            { icon: '✨', label: 'Habits' },
            { icon: '📝', label: 'Tasks' },
            { icon: '🧘', label: 'Mood' },
          ].map((feature, i) => (
            <div
              key={i}
              className="card px-4 py-3 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-2xl mb-1">{feature.icon}</div>
              <div className="text-xs text-sage-600 font-medium">{feature.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onComplete}
          className="btn-primary inline-flex items-center gap-2 text-lg animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <span>Get Started</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-blush-400 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Your personal journey awaits
        </p>
      </div>
    </div>
  );
}
