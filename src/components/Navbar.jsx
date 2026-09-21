import React from 'react';
import { useMandi } from '../context/MandiContext';
import { 
  Sprout, 
  Building2, 
  Tv, 
  User, 
  Volume2, 
  VolumeX, 
  Bell, 
  LogOut,
  LogIn,
  Home,
  ShieldCheck
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onOpenSms, onOpenAuth }) => {
  const { 
    lang, 
    setLang, 
    t, 
    audioEnabled, 
    setAudioEnabled, 
    smsMessages,
    currentUser,
    logout 
  } = useMandi();

  const unreadSmsCount = smsMessages.filter(s => !s.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Govt Emblem Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">National Agriculture Procurement Platform</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">Govt of India</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Online Portal Active</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-krishi-600 to-krishi-800 flex items-center justify-center text-white shadow-md shadow-krishi-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                  {t.appTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  e-Mandi
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* If logged in as Farmer */}
            {currentUser?.role === 'farmer' && (
              <button
                onClick={() => setCurrentView('farmer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  currentView === 'farmer'
                    ? 'bg-white text-krishi-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-krishi-600" />
                <span>My Dashboard</span>
              </button>
            )}

            {/* If logged in as Officer */}
            {currentUser?.role === 'officer' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-white text-amber-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Officer Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('yardDisplay')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                currentView === 'yardDisplay'
                  ? 'bg-slate-900 text-emerald-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden md:inline">Mandi Yard TV</span>
              <span className="md:hidden">TV</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  lang === 'hi' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('te')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  lang === 'te' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? t.audioEnabled : t.audioDisabled}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                audioEnabled 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* SMS Simulator Bell */}
            <button
              onClick={onOpenSms}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SMS</span>
              {unreadSmsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {unreadSmsCount}
                </span>
              )}
            </button>

            {/* Top Right: Real User Authentication Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.role === 'farmer' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {currentUser.role === 'farmer' ? 'Farmer' : 'Officer'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                  }}
                  title="Sign Out"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('farmer')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
