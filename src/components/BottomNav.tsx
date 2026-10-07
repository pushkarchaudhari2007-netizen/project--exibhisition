import React from 'react';
import { Home, Camera, Heart, Trophy, Leaf, Mic } from 'lucide-react';
import { LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

export type ScreenTab = 'home' | 'diagnose' | 'health' | 'fitness' | 'farm' | 'guide' | 'map' | 'forecasts';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  language: LanguageCode;
  onOpenVoiceHub: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
  onOpenVoiceHub
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const tabs: { id: ScreenTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'diagnose', label: t.navDiagnose, icon: <Camera className="w-5 h-5" /> },
    { id: 'health', label: t.navHealth, icon: <Heart className="w-5 h-5" /> },
    { id: 'fitness', label: t.navFitness, icon: <Trophy className="w-5 h-5" /> },
    { id: 'farm', label: t.navFarm, icon: <Leaf className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
                isActive ? 'text-emerald-800' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-emerald-100 text-emerald-800' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[64px] font-bold ${
                isActive ? 'text-emerald-950 font-black' : 'text-stone-700 font-semibold'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
