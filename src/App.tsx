import { useState, useEffect, useMemo } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation, type Screen } from './components/BottomNavigation';
import {
  useTodaysHabits,
  useTodos,
  useTodayMood,
  useUserPreferences,
} from './hooks/useSupabase';
import { useStreakPersistence } from './hooks/useStreakPersistence';

const USERNAME_STORAGE_KEY = 'sattva_username';

function getGreeting(username?: string): string {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour < 5) greeting = 'Good night';
  else if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else if (hour < 21) greeting = 'Good evening';
  else greeting = 'Good night';

  if (username && username !== 'User') {
    return `${greeting}, ${username}`;
  }
  return greeting;
}

function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
}

function App() {
  const { preferences, loading: prefsLoading, completeOnboarding } = useUserPreferences();
  const {
    habits,
    loading: habitsLoading,
    error: habitsError,
    completionPercentage,
    toggleCompletion,
    addHabit,
    deleteHabit,
  } = useTodaysHabits();
  const {
    priorityTodos,
    laterTodos,
    loading: todosLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();
  const { moodEntry, loading: moodLoading, setMood } = useTodayMood();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [username, setUsername] = useState<string>('User');

  // ADS STATES (Banner and Rewarded)
  const [showRewardedModal, setShowRewardedModal] = useState(false);
  const [adRewardClaimed, setAdRewardClaimed] = useState(false);

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed_today).length;
  const { currentStreak, longestStreak } = useStreakPersistence(totalHabits, completedHabits);

  // OPTION A: Rewarded/Bonus Streak calculation
  const finalCurrentStreak = adRewardClaimed ? currentStreak + 1 : currentStreak;

  useEffect(() => {
    const saved = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (saved?.trim()) {
      setUsername(saved.trim());
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USERNAME_STORAGE_KEY && e.newValue) {
        setUsername(e.newValue);
      }
    };

    const handleUsernameUpdate = () => {
      const saved = localStorage.getItem(USERNAME_STORAGE_KEY);
      if (saved?.trim()) {
        setUsername(saved.trim());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('username-updated', handleUsernameUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('username-updated', handleUsernameUpdate);
    };
  }, []);

  useEffect(() => {
    if (!prefsLoading && preferences !== null) {
      if (!preferences.onboarded) {
        setShowWelcome(true);
      }
    }
  }, [prefsLoading, preferences]);

  const handleCompleteOnboarding = async () => {
    await completeOnboarding();
    setShowWelcome(false);
  };

  const handleNavigate = (screen: Screen) => {
    const screens: Screen[] = ['home', 'analytics', 'profile'];
    const currentIndex = screens.indexOf(activeScreen);
    const newIndex = screens.indexOf(screen);

    if (newIndex > currentIndex) {
      setTransitionDirection('right');
    } else if (newIndex < currentIndex) {
      setTransitionDirection('left');
    }

    setActiveScreen(screen);
  };

  // Rewarded Video Ad simulation logic
  const handleWatchRewardedAd = () => {
    alert("Loading Rewarded Video Ad... Please wait 15 seconds.");
    setTimeout(() => {
      setAdRewardClaimed(true);
      setShowRewardedModal(false);
      alert("Success! You watched the ad. +1 Streak Bonus Applied!");
    }, 1500);
  };

  const greeting = useMemo(() => getGreeting(username), [username]);
  const date = useMemo(() => formatDate(), []);

  if (prefsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blush-300 via-lavender-300 to-sage-300 rounded-2xl flex items-center justify-center shimmer">
            <span className="text-3xl"></span>
          </div>
          <p className="text-sage-500 text-sm">Loading Sattva...</p>
        </div>
      </div>
    );
  }

  if (showWelcome && preferences?.onboarded === false) {
    return <WelcomeScreen onComplete={handleCompleteOnboarding} />;
  }

  if (habitsError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-3xl"></span>
          </div>
          <p className="text-sage-700 mb-4">Something went wrong</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      {/* REWARDED AD BUTTON (Option A - Streak Booster) */}
      {!adRewardClaimed && (
        <div className="fixed top-20 right-4 z-40">
          <button 
            onClick={() => setShowRewardedModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-1 animate-bounce"
          >
             Streak Saver Ad
          </button>
        </div>
      )}

      {/* REWARDED VIDEO AD POPUP BOX */}
      {showRewardedModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full text-center border border-amber-300">
            <span className="text-2xl"></span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-2">Save Your Streak!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
              Watch a short video ad to instantly save or boost your daily habit streak!
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWatchRewardedAd}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2.5 rounded-xl shadow text-sm"
              >
                 Watch Ad & Claim Reward
              </button>
              <button 
                onClick={() => setShowRewardedModal(false)}
                className="w-full text-xs text-gray-400 py-1 hover:underline"
              >
                Maybe Later
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-[10px] text-gray-400 font-mono">
              GOOGLE ADMOB REWARDED AD PLACEHOLDER
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-out ${
          transitionDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
        key={activeScreen}
      >
        {activeScreen === 'home' && (
          <Dashboard
            greeting={greeting}
            date={date}
            habits={habits}
            habitsLoading={habitsLoading}
            completionPercentage={completionPercentage}
            priorityTodos={priorityTodos}
            laterTodos={laterTodos}
            todosLoading={todosLoading}
            moodEntry={moodEntry}
            moodLoading={moodLoading}
            currentStreak={finalCurrentStreak} 
            longestStreak={longestStreak}
            onToggleHabit={toggleCompletion}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onSetMood={setMood}
          />
        )}
        {activeScreen === 'analytics' && <AnalyticsScreen />}
        {activeScreen === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />

      {/* GOOGLE ADMOB BANNER AD PLACEHOLDER (Sticky Bottom) */}
      <div className="fixed bottom-14 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-12 flex items-center justify-center z-40">
        <div className="text-center">
          <span className="text-[10px] text-gray-400 block -mt-1">ADVERTISEMENT</span>
          <div className="text-xs text-gray-500 font-semibold tracking-wider">
            --- GOOGLE ADMOB BANNER AD PLACEHOLDER ---
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
