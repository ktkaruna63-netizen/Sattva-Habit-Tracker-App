import { useState, useEffect } from 'react';
import { User, Shield, CreditCard, Bell, Moon, ChevronRight, LogOut, Award, CheckCircle, Sparkles } from 'lucide-react';

const USERNAME_STORAGE_KEY = 'sattva_username';

export function ProfileScreen() {
  const [username, setUsername] = useState('User');
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Load profile data safely
  useEffect(() => {
    const saved = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (saved?.trim()) {
      setUsername(saved.trim());
      setInputName(saved.trim());
    } else {
      setInputName('User');
    }
  }, []);

  const handleSaveProfile = () => {
    const finalName = inputName.trim() || 'User';
    localStorage.setItem(USERNAME_STORAGE_KEY, finalName);
    setUsername(finalName);
    setIsEditing(false);
    setSaveSuccess(true);

    // Trigger custom event so App.tsx instantly syncs username
    window.dispatchEvent(new Event('username-updated'));
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50/60 to-white pb-32 pt-safe-top overflow-y-auto">
      <div className="max-w-md mx-auto px-4 pt-4">
        
        {/* PROFILE BANNER AD UNIT */}
        <div className="w-full bg-blue-50/60 border border-dashed border-blue-200 rounded-2xl p-2.5 text-center mb-5 shadow-sm">
          <span className="text-[9px] uppercase bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold inline-block mb-1">
            Top Banner Ad
          </span>
          <div className="text-xs font-mono text-blue-600 tracking-tight">
            --- GOOGLE ADMOB BANNER INTERN ---
          </div>
        </div>

        {/* User Card Layout Fix (Scroll & Overflow safe) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-sage-100 flex flex-col items-center text-center relative overflow-hidden mb-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-sage-200 to-lavender-200 rounded-full flex items-center justify-center text-sage-600 shadow-inner mb-3">
            <User className="w-10 h-10" />
          </div>

          {isEditing ? (
            <div className="w-full max-w-xs flex flex-col gap-2 mt-1">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                maxLength={20}
                className="w-full text-center text-sm p-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sage-400 text-gray-800"
                placeholder="Enter nickname"
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="text-xs px-4 py-1.5 rounded-lg bg-sage-600 text-white font-semibold shadow-sm"
                >
                  Save Name
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
                {username}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-sage-500 font-normal hover:underline ml-1 bg-sage-50 px-2 py-0.5 rounded-md border"
                >
                  Edit
                </button>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Sattva Free Account Member</p>
            </div>
          )}

          {saveSuccess && (
            <div className="absolute bottom-2 bg-green-500 text-white text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow animate-fade-in">
              <CheckCircle className="w-3 h-3" /> Profile updated successfully!
            </div>
          )}
        </div>

        {/* Badges & Achievements List */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100 mb-5">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Unlocked Rewards</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
            <div className="flex-shrink-0 bg-orange-50 border border-orange-100 rounded-xl p-2.5 text-center w-24">
              <span className="text-lg">🔥</span>
              <p className="text-[10px] font-bold text-orange-700 mt-1 truncate">Early Bird</p>
            </div>
            <div className="flex-shrink-0 bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-center w-24">
              <span className="text-lg">📚</span>
              <p className="text-[10px] font-bold text-blue-700 mt-1 truncate">Book Worm</p>
            </div>
            <div className="flex-shrink-0 bg-green-50 border border-green-100 rounded-xl p-2.5 text-center w-24">
              <span className="text-lg">🧘</span>
              <p className="text-[10px] font-bold text-green-700 mt-1 truncate">Zen Master</p>
            </div>
          </div>
        </div>

        {/* Application Settings Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-sage-100 overflow-hidden mb-5">
          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Preferences</h3>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl"><Moon className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-gray-700">Dark Mode</span>
              </div>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)}
                className="w-9 h-5 bg-gray-200 checked:bg-purple-500 rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:h-4 after:w-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Bell className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-gray-700">Daily Reminders</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)}
                className="w-9 h-5 bg-gray-200 checked:bg-blue-500 rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:h-4 after:w-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
              />
            </div>

            {/* Security Row */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-500 rounded-xl"><Shield className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-gray-700">Privacy & Supabase Cloud</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            {/* Premium Features Info */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><CreditCard className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Premium Tier <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                </span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
        </div>

        {/* Account Action (Logout Simulation) */}
        <button 
          onClick={() => alert("To disconnect Supabase cloud backup, please log out from the main dashboard context.")}
          className="w-full card p-4 flex items-center justify-center gap-2 border-red-100 bg-red-50/30 text-red-600 text-sm font-semibold rounded-2xl active:scale-[0.99] transition-all"
        >
          <LogOut className="w-4 h-4" /> Disconnect Database Backup
        </button>

      </div>
    </div>
  );
}
