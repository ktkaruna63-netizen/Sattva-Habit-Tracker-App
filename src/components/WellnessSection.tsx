import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Volume2, Leaf, Check, VolumeX, Square } from 'lucide-react';
import { YogaPoseModal, type YogaPose } from './YogaPoseModal';
import { playAmbient, stopAmbient, type AmbientSoundType } from '../lib/ambientSound';

const YOGA_POSES: YogaPose[] = [
  {
    name: "Mountain Pose",
    sanskrit: "Tadasana",
    duration: "1 min",
    durationSeconds: 60,
    benefits: "Improves posture, grounds the mind, strengthens thighs and knees",
    emoji: "🏔️",
    color: "from-sage-200 to-sage-300",
    instructions: [
      "Stand with feet together, weight distributed evenly across both feet",
      "Engage your thigh muscles and lift your kneecaps",
      "Tuck your tailbone slightly and engage your core",
      "Roll your shoulders back and let your arms hang naturally",
      "Lengthen your neck and gaze forward softly",
      "Breathe deeply and hold for 1 minute, feeling grounded and stable"
    ]
  },
  {
    name: "Tree Pose",
    sanskrit: "Vrksasana",
    duration: "1 min each side",
    durationSeconds: 60,
    benefits: "Balances body and mind, strengthens legs and core, improves focus",
    emoji: "🌳",
    color: "from-green-200 to-green-300",
    instructions: [
      "Stand tall with feet together, shift weight to your left foot",
      "Place your right foot on your inner left thigh (avoid the knee)",
      "Bring your hands to prayer position at your heart",
      "Optionally raise arms overhead with palms together",
      "Fix your gaze on a steady point ahead for balance",
      "Hold for 1 minute, then switch sides"
    ]
  },
  {
    name: "Cat-Cow",
    sanskrit: "Marjaryasana-Bitilasana",
    duration: "2 min",
    durationSeconds: 120,
    benefits: "Releases spine tension, calms mind, improves flexibility",
    emoji: "🐈",
    color: "from-amber-200 to-amber-300",
    instructions: [
      "Start on hands and knees in tabletop position",
      "Inhale: Drop belly, lift chest and tailbone (Cow pose)",
      "Exhale: Round spine, tuck chin and tailbone (Cat pose)",
      "Move with your breath, flowing smoothly between poses",
      "Focus on moving each vertebra independently",
      "Continue for 2 minutes at your own pace"
    ]
  },
  {
    name: "Child's Pose",
    sanskrit: "Balasana",
    duration: "2 min",
    durationSeconds: 120,
    benefits: "Deep relaxation, stress relief, gently stretches hips and back",
    emoji: "🧘‍♀️",
    color: "from-lavender-200 to-lavender-300",
    instructions: [
      "Kneel on the floor, big toes touching, knees wide apart",
      "Sit back on your heels and fold forward",
      "Rest your forehead on the mat, arms extended forward or alongside body",
      "Close your eyes and breathe deeply into your back",
      "Release all tension with each exhale",
      "Hold for 2 minutes or longer for deep relaxation"
    ]
  },
  {
    name: "Corpse Pose",
    sanskrit: "Savasana",
    duration: "3-5 min",
    durationSeconds: 180,
    benefits: "Complete relaxation, reduces blood pressure, calms nervous system",
    emoji: "😌",
    color: "from-blush-200 to-blush-300",
    instructions: [
      "Lie flat on your back with legs extended, feet naturally falling apart",
      "Rest arms alongside body with palms facing up",
      "Close your eyes and relax your entire face",
      "Scan your body from toes to head, releasing any tension",
      "Breathe naturally, allowing your body to feel heavy",
      "Stay for 3-5 minutes in complete stillness"
    ]
  },
];

interface AmbientSound {
  name: string;
  description: string;
  emoji: string;
  color: string;
  type: AmbientSoundType;
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    name: "Om Mantra",
    description: "Sacred vibration meditation",
    emoji: "🕉️",
    color: "from-orange-200 to-amber-300",
    type: 'om',
  },
  {
    name: "Tibetan Bowl",
    description: "Healing resonant tones",
    emoji: "🔔",
    color: "from-amber-200 to-yellow-300",
    type: 'bowl',
  },
  {
    name: "Forest Rain",
    description: "Nature's gentle rhythm",
    emoji: "🌧️",
    color: "from-sage-200 to-green-300",
    type: 'rain',
  },
  {
    name: "Ocean Waves",
    description: "Calming water sounds",
    emoji: "🌊",
    color: "from-sky-200 to-blue-300",
    type: 'ocean',
  },
];

const YOGA_COMPLETION_KEY = 'sattva_yoga_poses_completed';
const YOGA_HABIT_NAME = 'Morning Yoga';

interface YogaPoseCardProps {
  pose: YogaPose;
  isCompleted: boolean;
  onClick: () => void;
}

function YogaPoseCard({ pose, isCompleted, onClick }: YogaPoseCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${pose.color} opacity-30 rounded-bl-full`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl">{pose.emoji}</div>
          {isCompleted && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-sage-800 mb-0.5">{pose.name}</h3>
        <p className="text-xs text-sage-500 italic mb-2">{pose.sanskrit}</p>
        <div className="flex items-center gap-2 text-xs text-sage-600">
          <span className="px-2 py-0.5 rounded-full bg-sage-100">{pose.duration}</span>
        </div>
      </div>
    </button>
  );
}

interface AmbientPlayerProps {
  sound: AmbientSound;
  isPlaying: boolean;
  onPlayPause: () => void;
}

function AmbientPlayer({ sound, isPlaying, onPlayPause }: AmbientPlayerProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl backdrop-blur-xl border transition-all ${
      isPlaying ? 'bg-white/80 border-lavender-300 shadow-md shadow-lavender-200/40' : 'bg-white/50 border-white/30'
    }`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sound.color} flex items-center justify-center text-lg relative overflow-hidden`}>
        {sound.emoji}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blush-400 to-lavender-400 animate-ping opacity-30" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blush-400 to-lavender-400 animate-ping opacity-20" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-sage-800 truncate">{sound.name}</h4>
        <p className="text-xs text-sage-500 truncate">{sound.description}</p>
      </div>
      <button
        onClick={onPlayPause}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
          isPlaying
            ? 'bg-gradient-to-r from-blush-400 to-lavender-400 text-white'
            : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
        }`}
        aria-label={isPlaying ? `Stop ${sound.name}` : `Play ${sound.name}`}
      >
        {isPlaying ? (
          <Square className="w-4 h-4 fill-white" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

function getCompletedPoses(): string[] {
  try {
    const saved = localStorage.getItem(YOGA_COMPLETION_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Check if it's today's data
      if (data.date === new Date().toISOString().split('T')[0]) {
        return data.poses || [];
      }
    }
  } catch {
    // Invalid data
  }
  return [];
}

function saveCompletedPoses(poses: string[]) {
  localStorage.setItem(YOGA_COMPLETION_KEY, JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    poses,
  }));
}

export function WellnessSection() {
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSound, setActiveSound] = useState<AmbientSoundType | null>(null);
  const [volume, setVolume] = useState(1);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  // Load completed poses from localStorage
  useEffect(() => {
    setCompletedPoses(getCompletedPoses());
  }, []);

  const handlePoseClick = (pose: YogaPose) => {
    setSelectedPose(pose);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedPose(null), 300);
  };

  const handlePoseComplete = useCallback((poseName: string) => {
    setCompletedPoses(prev => {
      const updated = [...new Set([...prev, poseName])];
      saveCompletedPoses(updated);

      // Check if all poses are completed
      if (updated.length === YOGA_POSES.length) {
        // Dispatch event to mark yoga habit as complete
        window.dispatchEvent(new CustomEvent('yoga-all-completed'));
      }

      return updated;
    });
  }, []);

  const handlePlayPause = (soundType: AmbientSoundType) => {
    if (activeSound === soundType) {
      stopAmbient();
      setActiveSound(null);
    } else {
      playAmbient(soundType, volumeRef.current);
      setActiveSound(soundType);
    }
  };

  const handleStopAll = () => {
    stopAmbient();
    setActiveSound(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (activeSound) {
      // Restart at new volume for immediate feedback.
      playAmbient(activeSound, v);
    }
  };

  // Stop audio when the component unmounts.
  useEffect(() => {
    return () => stopAmbient();
  }, []);

  const allPosesCompleted = completedPoses.length === YOGA_POSES.length;
  const progressPercent = Math.round((completedPoses.length / YOGA_POSES.length) * 100);

  return (
    <div className="space-y-4">
      {/* Yoga Quick Poses */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-sage-500" />
            <h2 className="text-lg font-medium text-sage-800">5-Min Morning Yoga</h2>
          </div>
          {completedPoses.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-sage-500 bg-sage-100 px-2 py-1 rounded-full">
                {completedPoses.length}/{YOGA_POSES.length} poses
              </div>
              {allPosesCompleted && (
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Complete!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar for yoga */}
        {completedPoses.length > 0 && !allPosesCompleted && (
          <div className="mb-3">
            <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blush-400 to-lavender-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-sage-500 mt-1 text-center">
              {YOGA_POSES.length - completedPoses.length} more pose{YOGA_POSES.length - completedPoses.length !== 1 ? 's' : ''} to complete your morning practice
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {YOGA_POSES.map((pose) => (
            <YogaPoseCard
              key={pose.name}
              pose={pose}
              isCompleted={completedPoses.includes(pose.name)}
              onClick={() => handlePoseClick(pose)}
            />
          ))}
        </div>

        {allPosesCompleted && (
          <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-lavender-50 border border-green-200 flex items-center gap-3 animate-slide-up">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Morning yoga complete!</p>
              <p className="text-xs text-sage-500">Great job starting your day mindfully.</p>
            </div>
          </div>
        )}
      </section>

      {/* Ambient Sounds */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-lavender-500" />
          <h2 className="text-lg font-medium text-sage-800">Calming Mantras</h2>
        </div>
        <div className="space-y-2">
          {AMBIENT_SOUNDS.map((sound) => (
            <AmbientPlayer
              key={sound.type}
              sound={sound}
              isPlaying={activeSound === sound.type}
              onPlayPause={() => handlePlayPause(sound.type)}
            />
          ))}
        </div>

        {/* Volume control + stop all */}
        <div className="mt-3 p-3 rounded-xl bg-white/50 backdrop-blur-xl border border-white/30 flex items-center gap-3">
          {activeSound ? (
            <Volume2 className="w-4 h-4 text-lavender-500 flex-shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 text-sage-400 flex-shrink-0" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!activeSound}
            className="flex-1 accent-lavender-400 disabled:opacity-40"
            aria-label="Ambient sound volume"
          />
          {activeSound && (
            <button
              onClick={handleStopAll}
              className="text-xs font-medium text-lavender-600 hover:text-lavender-700 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop
            </button>
          )}
        </div>
      </section>

      {/* Yoga Pose Modal */}
      <YogaPoseModal
        pose={selectedPose}
        isOpen={showModal}
        onClose={handleCloseModal}
        onComplete={() => {
          if (selectedPose) {
            handlePoseComplete(selectedPose.name);
          }
        }}
      />
    </div>
  );
}

// Export for use in other components
export { YOGA_HABIT_NAME };
