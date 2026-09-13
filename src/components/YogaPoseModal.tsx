import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Check } from 'lucide-react';

export interface YogaPose {
  name: string;
  sanskrit: string;
  duration: string;
  durationSeconds: number;
  benefits: string;
  emoji: string;
  color: string;
  instructions: string[];
}

interface YogaPoseModalProps {
  pose: YogaPose | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

// CSS Animation for different poses
function PoseAnimation({ pose }: { pose: YogaPose }) {
  const getAnimationForPose = () => {
    switch (pose.name) {
      case 'Mountain Pose':
        return <MountainPoseAnimation />;
      case 'Tree Pose':
        return <TreePoseAnimation />;
      case 'Cat-Cow':
        return <CatCowAnimation />;
      case "Child's Pose":
        return <ChildsPoseAnimation />;
      case 'Corpse Pose':
        return <CorpsePoseAnimation />;
      default:
        return <DefaultPoseAnimation emoji={pose.emoji} />;
    }
  };

  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-100 to-lavender-100 opacity-50 animate-pulse-slow" />
      {getAnimationForPose()}
    </div>
  );
}

function MountainPoseAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Minimalist standing figure */}
      <div className="relative">
        {/* Head */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-sage-400 mx-auto animate-float" />
        {/* Body */}
        <div className="w-2 h-16 bg-gradient-to-b from-sage-400 to-sage-500 mx-auto rounded-full mt-1" />
        {/* Arms */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-8">
          <div className="w-2 h-12 bg-sage-400 rounded-full animate-pulse-slow" />
          <div className="w-2 h-12 bg-sage-400 rounded-full animate-pulse-slow" />
        </div>
        {/* Legs */}
        <div className="flex gap-3 justify-center mt-1">
          <div className="w-2 h-14 bg-gradient-to-b from-sage-500 to-sage-600 rounded-b-full" />
          <div className="w-2 h-14 bg-gradient-to-b from-sage-500 to-sage-600 rounded-b-full" />
        </div>
        {/* Grounding lines */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-sage-200 rounded-full opacity-50" />
      </div>
    </div>
  );
}

function TreePoseAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Head */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-green-400 mx-auto animate-float" />
        {/* Body - slightly tilted */}
        <div className="w-2 h-14 bg-gradient-to-b from-green-400 to-green-500 mx-auto rounded-full mt-1 transform rotate-3" />
        {/* Arms raised in V */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2">
          <div className="w-2 h-10 bg-green-400 rounded-full origin-bottom -rotate-45 absolute -left-6" />
          <div className="w-2 h-10 bg-green-400 rounded-full origin-bottom rotate-45 absolute -right-6" />
        </div>
        {/* Standing leg */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="w-2 h-12 bg-gradient-to-b from-green-500 to-green-600 rounded-b-full" />
        </div>
        {/* Bent leg */}
        <div className="absolute bottom-2 -left-4">
          <div className="w-2 h-6 bg-green-400 rounded-full rotate-45 origin-bottom" />
        </div>
      </div>
    </div>
  );
}

function CatCowAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Head */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 absolute left-2 animate-head-bob" />
        {/* Spine - animated curve */}
        <div className="flex gap-1 items-center animate-spine-wave">
          <div className="w-3 h-8 bg-amber-400 rounded-full transform -rotate-12" />
          <div className="w-3 h-10 bg-amber-400 rounded-full" />
          <div className="w-3 h-10 bg-amber-400 rounded-full" />
          <div className="w-3 h-8 bg-amber-400 rounded-full transform rotate-12" />
        </div>
        {/* Legs */}
        <div className="flex gap-3 justify-center mt-1">
          <div className="w-2 h-6 bg-amber-500 rounded-full" />
          <div className="w-2 h-6 bg-amber-500 rounded-full" />
          <div className="w-2 h-6 bg-amber-500 rounded-full" />
          <div className="w-2 h-6 bg-amber-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ChildsPoseAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Curled body */}
        <div className="flex flex-col items-center animate-breathe">
          {/* Head on ground */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-300 to-lavender-400" />
          {/* Curved back */}
          <div className="w-20 h-6 bg-gradient-to-r from-lavender-400 via-lavender-300 to-lavender-400 rounded-full mt-1" />
          {/* Arms stretched forward */}
          <div className="flex gap-12 -mt-4">
            <div className="w-2 h-10 bg-lavender-300 rounded-full rotate-12" />
            <div className="w-2 h-10 bg-lavender-300 rounded-full -rotate-12" />
          </div>
          {/* Legs tucked */}
          <div className="flex gap-2 mt-2">
            <div className="w-4 h-6 bg-lavender-400 rounded-full" />
            <div className="w-4 h-6 bg-lavender-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CorpsePoseAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative animate-deep-breathe">
        {/* Head */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blush-300 to-blush-400 mx-auto" />
        {/* Body laying down */}
        <div className="flex flex-col items-center mt-1">
          <div className="w-4 h-16 bg-gradient-to-b from-blush-400 to-blush-300 rounded-full" />
        </div>
        {/* Arms spread slightly */}
        <div className="absolute top-11 flex gap-16">
          <div className="w-12 h-2 bg-blush-300 rounded-full -rotate-12" />
          <div className="w-12 h-2 bg-blush-300 rounded-full rotate-12" />
        </div>
        {/* Legs */}
        <div className="flex gap-6 justify-center">
          <div className="w-2 h-10 bg-gradient-to-b from-blush-300 to-blush-200 rounded-full" />
          <div className="w-2 h-10 bg-gradient-to-b from-blush-300 to-blush-200 rounded-full" />
        </div>
        {/* Zen circles around */}
        <div className="absolute inset-0 -m-4 border-2 border-blush-200 rounded-full opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 -m-8 border border-blush-100 rounded-full opacity-20 animate-ping" style={{ animationDuration: '4s' }} />
      </div>
    </div>
  );
}

function DefaultPoseAnimation({ emoji }: { emoji: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-6xl animate-float">{emoji}</div>
    </div>
  );
}

// Timer Component
function Timer({ duration, onComplete }: { duration: number; onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete]);

  // Mark complete button
  const handleMarkComplete = () => {
    if (!hasCompleted) {
      setHasCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            className="text-sage-100"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5a6a8" />
              <stop offset="100%" stopColor="#a8d5e5" />
            </linearGradient>
          </defs>
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-medium text-sage-700">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isRunning
              ? 'bg-gradient-to-r from-blush-400 to-lavender-400 text-white'
              : 'bg-gradient-to-r from-sage-400 to-lavender-400 text-white hover:shadow-lg'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center hover:bg-sage-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      {hasCompleted ? (
        <div className="flex items-center gap-2 text-green-600 animate-slide-up">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">Pose complete!</span>
        </div>
      ) : (
        <button
          onClick={handleMarkComplete}
          className="px-4 py-2 rounded-xl bg-sage-100 text-sage-600 text-sm hover:bg-sage-200 transition-all"
        >
          Skip timer & mark complete
        </button>
      )}
    </div>
  );
}

// Main Modal Component
export function YogaPoseModal({ pose, isOpen, onClose, onComplete }: YogaPoseModalProps) {
  if (!pose || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-white to-sage-50 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="sticky top-0 bg-gradient-to-b from-white to-transparent pt-3 pb-6 px-6 z-10">
          <div className="w-10 h-1 rounded-full bg-sage-200 mx-auto" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center hover:bg-sage-200 transition-all z-20"
        >
          <X className="w-4 h-4 text-sage-600" />
        </button>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">{pose.emoji}</div>
            <h2 className="text-xl font-medium text-sage-800">{pose.name}</h2>
            <p className="text-sm text-sage-500 italic">{pose.sanskrit}</p>
          </div>

          {/* Pose Animation */}
          <PoseAnimation pose={pose} />

          {/* Timer */}
          <div className="mb-6">
            <Timer duration={pose.durationSeconds} onComplete={onComplete} />
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-sage-100 to-lavender-100 rounded-2xl p-4 mb-6">
            <p className="text-sm text-sage-600 text-center">
              <span className="font-medium">Benefits: </span>
              {pose.benefits}
            </p>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-medium text-sage-700 mb-3">Instructions</h3>
            <ol className="space-y-3">
              {pose.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blush-200 to-lavender-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-sage-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-sage-600 leading-relaxed">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
