import { Check } from 'lucide-react';

export const AVATAR_OPTIONS = [
  {
    id: 'lotus',
    emoji: '🪷',
    name: 'Lotus',
    description: 'Purity & Enlightenment',
    gradient: 'from-blush-200 to-blush-300',
    bgColor: 'bg-gradient-to-br from-blush-100 to-blush-200',
  },
  {
    id: 'meditation',
    emoji: '🧘',
    name: 'Meditation',
    description: 'Inner Peace',
    gradient: 'from-lavender-200 to-lavender-300',
    bgColor: 'bg-gradient-to-br from-lavender-100 to-lavender-200',
  },
  {
    id: 'sun',
    emoji: '☀️',
    name: 'Sun',
    description: 'Energy & Vitality',
    gradient: 'from-amber-200 to-orange-300',
    bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
  },
  {
    id: 'moon',
    emoji: '🌙',
    name: 'Moon',
    description: 'Intuition & Calm',
    gradient: 'from-indigo-200 to-purple-300',
    bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
  },
  {
    id: 'star',
    emoji: '✨',
    name: 'Star',
    description: 'Guidance & Hope',
    gradient: 'from-sky-200 to-blush-300',
    bgColor: 'bg-gradient-to-br from-sky-100 to-sky-200',
  },
  {
    id: 'om',
    emoji: '🕉️',
    name: 'Om',
    description: 'Sacred Vibration',
    gradient: 'from-orange-200 to-amber-300',
    bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
  },
  {
    id: 'peace',
    emoji: '☮️',
    name: 'Peace',
    description: 'Harmony & Balance',
    gradient: 'from-sage-200 to-green-300',
    bgColor: 'bg-gradient-to-br from-sage-100 to-sage-200',
  },
  {
    id: 'buddha',
    emoji: '🪥',
    name: 'Buddha',
    description: 'Awakening',
    gradient: 'from-yellow-200 to-amber-300',
    bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
  },
];

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onSelect: (avatarId: string) => void;
  expanded?: boolean;
}

export function AvatarSelector({ selectedAvatar, onSelect, expanded = false }: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-sage-700">Choose Your Avatar</h3>
      <div className={`grid gap-3 ${expanded ? 'grid-cols-4' : 'grid-cols-4'}`}>
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`relative aspect-square rounded-2xl transition-all ${
              selectedAvatar === avatar.id
                ? 'ring-2 ring-blush-400 ring-offset-2 ring-offset-white/50 scale-105 shadow-md'
                : 'hover:scale-105 hover:shadow-sm'
            }`}
          >
            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-2xl shadow-inner`}>
              {avatar.emoji}
            </div>
            {selectedAvatar === avatar.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blush-400 to-lavender-400 flex items-center justify-center shadow-md">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function getAvatarById(id: string | null) {
  if (!id) return AVATAR_OPTIONS[0];
  return AVATAR_OPTIONS.find(a => a.id === id) || AVATAR_OPTIONS[0];
}
