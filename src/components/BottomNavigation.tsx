import { Home, BarChart3, User } from 'lucide-react';

export type Screen = 'home' | 'analytics' | 'profile';

interface BottomNavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sage-100 safe-bottom z-30">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blush-100 to-lavender-100'
                  : 'hover:bg-sage-50'
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive
                    ? 'text-blush-500'
                    : 'text-sage-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-blush-600'
                    : 'text-sage-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
