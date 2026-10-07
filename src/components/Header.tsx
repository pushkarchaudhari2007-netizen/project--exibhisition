import React, { useState } from 'react';
import { 
  Wifi, WifiOff, Globe, Play, UserCheck, Smartphone, Monitor,
  User, LogIn, LogOut, Check, Sparkles, MapPin, ChevronDown
} from 'lucide-react';
import { LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { ScreenTab } from './BottomNav.tsx';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleSimulatedOffline: (offline: boolean) => void;
  pendingSyncCount: number;
  currentRole: 'farmer' | 'extension_worker';
  onSwitchRole: (role: 'farmer' | 'extension_worker') => void;
  onOpenTestRunner: () => void;
  isMobileDeviceView: boolean;
  onToggleMobileDeviceView: () => void;
  currentUser?: { displayName?: string; email?: string; photoURL?: string } | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  currentTab?: ScreenTab;
  onSelectTab?: (tab: ScreenTab) => void;
  userLocationText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  onToggleSimulatedOffline,
  pendingSyncCount,
  currentRole,
  onSwitchRole,
  onOpenTestRunner,
  isMobileDeviceView,
  onToggleMobileDeviceView,
  currentUser,
  onOpenAuthModal,
  onSignOut,
  currentTab = 'home',
  onSelectTab,
  userLocationText = 'Pune, Maharashtra'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  const navLinks: { id: ScreenTab; label: string }[] = [
    { id: 'home', label: t.navHome || 'Home' },
    { id: 'diagnose', label: t.navDiagnose || 'Diagnose' },
    { id: 'guide', label: t.navFieldGuide || 'Field Guide' },
    { id: 'forecasts', label: t.navForecasts || 'Forecasts' },
    { id: 'fitness', label: t.navFitness || 'Farm Fitness' },
    { id: 'health', label: t.navHealth || 'Health & Heat' },
    { id: 'farm', label: t.navFarm || 'My Farm' },
    { id: 'map', label: t.navFieldMap || 'Field Map' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Executive Row */}
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Luxury Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab && onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white flex items-center justify-center font-display text-lg font-bold shadow-xs border border-emerald-800/40 group-hover:scale-105 transition-transform">
                <span className="text-[#E6CA65]">G</span>
              </div>
              <div>
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-emerald-950 block leading-tight">
                  GreenCoach <span className="font-sans font-extrabold text-xs tracking-wider uppercase text-emerald-800 ml-0.5">AI</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide hidden sm:block">
                  Rural Agricultural Intelligence
                </span>
              </div>
            </button>

            {pendingSyncCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                {pendingSyncCount} offline changes
              </span>
            )}
          </div>

          {/* Zone 2: Desktop Navigation Bar (Visible on lg screens) */}
          {currentRole === 'farmer' && onSelectTab && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'text-emerald-950 bg-emerald-50/80 font-bold border-b-2 border-emerald-800'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: Executive Utilities & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="h-9 px-2.5 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 text-stone-800 text-xs font-bold flex items-center gap-1.5 border border-stone-200 transition-colors"
                title="Select app language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-600" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-fade-in text-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        language === l.code ? 'text-emerald-900 font-bold bg-emerald-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] text-stone-400">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Mode Toggle */}
            <button
              onClick={() => onToggleSimulatedOffline(isOnline)}
              className={`h-9 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70 border border-emerald-200'
                  : 'bg-amber-100 text-amber-950 border border-amber-300 ring-1 ring-amber-300'
              }`}
              title="Toggle simulated offline mode"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-700" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span className="hidden xl:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Role Switcher */}
            <button
              onClick={() => onSwitchRole(currentRole === 'farmer' ? 'extension_worker' : 'farmer')}
              className="h-9 px-2.5 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 text-stone-800 text-xs font-bold flex items-center gap-1.5 border border-stone-200 transition-colors cursor-pointer"
              title="Switch user role"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">
                {currentRole === 'farmer' ? 'Farmer' : 'Extension'}
              </span>
            </button>

            {/* Viewport Frame Mode Toggle (Responsive Wide vs Mobile Phone Frame) */}
            <button
              onClick={onToggleMobileDeviceView}
              className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                isMobileDeviceView
                  ? 'bg-emerald-800 text-white border-emerald-700'
                  : 'bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 border border-stone-200'
              }`}
              title={isMobileDeviceView ? 'Switch to luxury responsive wide layout' : 'Switch to mobile device preview shell'}
            >
              {isMobileDeviceView ? <Monitor className="w-3.5 h-3.5 text-white" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>

            {/* User Account Button with Luxury Ring */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="h-9 px-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 text-xs font-bold flex items-center gap-1.5 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
                  title="Account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-950 text-white flex items-center justify-center text-[10px] font-black ring-1 ring-[#D4AF37]">
                    {(currentUser.displayName || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate">
                    {currentUser.displayName || 'Farmer'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{currentUser.displayName || 'Farmer'}</p>
                      <p className="text-[10px] text-stone-500 truncate">{currentUser.email || 'Cloud Account'}</p>
                    </div>
                    <button
                      onClick={() => { setShowUserMenu(false); onOpenAuthModal(); }}
                      className="w-full px-3 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>Manage Profile</span>
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onSignOut(); }}
                      className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="h-9 px-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
                title="Sign in or register account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E6CA65]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Test Suite CTA */}
            <button
              onClick={onOpenTestRunner}
              className="h-9 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
              title="Open test verification suite"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span className="hidden xl:inline">Tests</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
