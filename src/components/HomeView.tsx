import React, { useState, useEffect } from 'react';
import { 
  Mic, Camera, Heart, Trophy, MapPin, Sun, Droplets, 
  Sparkles, ShieldCheck, ArrowRight, Volume2, Clock, Leaf,
  BookOpen, Compass, AlertTriangle, ShieldAlert, Navigation,
  Activity, Award, ChevronRight, Flame
} from 'lucide-react';
import { Diagnosis, Farm, Farmer, GamificationScore, LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { audioEngine } from '../lib/audioService.ts';
import { locationManager, UserLocation } from '../lib/locationService.ts';

interface HomeViewProps {
  language: LanguageCode;
  farmer: Farmer;
  farm: Farm;
  recentDiagnosis: Diagnosis | null;
  onNavigateTo: (screen: 'diagnose' | 'health' | 'fitness' | 'farm' | 'village' | 'guide' | 'map' | 'forecasts') => void;
  onOpenVoiceHub: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  farmer,
  farm,
  recentDiagnosis,
  onNavigateTo,
  onOpenVoiceHub
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [scoreData, setScoreData] = useState<GamificationScore | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(locationManager.getLocation());

  useEffect(() => {
    const unsub = locationManager.subscribe((loc) => {
      setCurrentLocation(loc);
    });
    return unsub;
  }, []);

  useEffect(() => {
    fetch(`/api/gamification/score?farm_id=${farm.farm_id}`)
      .then(res => res.json())
      .then(d => { if (!d.error) setScoreData(d); })
      .catch(console.error);
  }, [farm.farm_id]);

  useEffect(() => {
    fetch(`/api/weather/current?city=${encodeURIComponent(currentLocation.city)}`)
      .then(res => res.json())
      .then(d => setWeatherData(d))
      .catch(console.error);
  }, [currentLocation.city]);

  const currentScore = scoreData?.farm_fitness_score_total || 87.3;
  const ecoStreak = scoreData?.streak_eco_days || 12;

  const handleMicClick = () => {
    audioEngine.playSuccessChime();
    onOpenVoiceHub();
  };

  const handleLocationClick = async () => {
    const res = await locationManager.requestGpsLocation();
    if (res.success && res.location) {
      audioEngine.playSuccessChime();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Warm Luxury Greeting & Farm Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-stone-200/70 shadow-2xs">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-800">
            {t.appName} · Agricultural Intelligence
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950 tracking-tight mt-0.5">
            Namaste, {farmer.name}
          </h1>
          <button
            onClick={handleLocationClick}
            className="text-xs text-stone-600 font-medium flex items-center gap-1.5 mt-1 hover:text-emerald-800 transition-colors cursor-pointer group"
            title="Click to refresh device GPS location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-stone-800">{currentLocation.city}, {currentLocation.state}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{farm.acreage} Acres</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500">{farm.soil_type || 'Medium Black Loam'}</span>
            {currentLocation.isGps && (
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">GPS</span>
            )}
          </button>
        </div>

        {/* Executive Fitness Score & Eco-Streak Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => onNavigateTo('fitness')}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 shadow-2xs hover:border-amber-300 text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 justify-end">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-lg font-black text-stone-900 group-hover:text-emerald-800 tabular-nums">
                {currentScore}
              </span>
              <span className="text-xs text-stone-400">/ 100</span>
            </div>
            <span className="text-[11px] text-stone-600 font-semibold block">Farm Fitness</span>
          </div>

          <div 
            onClick={() => onNavigateTo('fitness')}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs hover:border-emerald-400 text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 justify-end">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-black text-emerald-950 tabular-nums">
                {ecoStreak}
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold block">Eco-Streak</span>
          </div>
        </div>
      </div>

      {/* 2. Responsive Hero Stage: Hariya Voice Anchor (Left) + Situational Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* HARIYA VOICE CO-PILOT (Dominant Visual Anchor - 7 cols on Desktop) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#06281C] via-[#093927] to-[#041D14] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-between border border-[#D4AF37]/20">
          
          {/* Subtle luxurious gold ambient aura */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6CA65] block mb-1">
              {t.hariyaTitle} · Voice Agricultural Co-Pilot
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold max-w-md leading-snug">
              {language === 'mr' ? 'हरियाशी थेट आपल्या भाषेत बोला' : language === 'hi' ? 'हरिया से सीधे अपनी भाषा में बात करें' : 'Converse Directly with Hariya AI'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 max-w-md font-medium">
              {t.hariyaPromptTapMic}
            </p>
          </div>

          {/* Luxury Concentric Tactile Mic Button */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-[#D4AF37]/15 animate-ping pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-emerald-400/20 animate-pulse pointer-events-none" />
            
            <button
              onClick={handleMicClick}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-white to-[#F7F3E8] text-emerald-950 hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center transition-all ring-4 ring-[#D4AF37]/40 cursor-pointer group"
              title="Tap to speak with Hariya"
              aria-label="Activate voice assistant"
            >
              <Mic className="w-10 h-10 text-emerald-900 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10 relative z-10">
            <button
              onClick={() => { audioEngine.playSuccessChime(); onOpenVoiceHub(); }}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#E6CA65]" />
              <span>"How to prevent rice blast?"</span>
            </button>
            <button
              onClick={() => { audioEngine.playSuccessChime(); onOpenVoiceHub(); }}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#E6CA65]" />
              <span>"Is today safe for spraying?"</span>
            </button>
          </div>

        </div>

        {/* SITUATIONAL TELEMETRY WIDGETS (5 cols on Desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Weather & Heat Stress Card */}
          {weatherData && (
            <div 
              onClick={() => onNavigateTo('health')}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-600" /> Microclimate Advisory
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Heat: {weatherData.heat_index?.heat_index_c || 34}°C
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">
                    {weatherData.city || currentLocation.city}: {weatherData.temperature_c}°C
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mt-0.5 flex items-center gap-2">
                    <span>Humidity {weatherData.humidity_percent}%</span>
                    <span aria-hidden="true">·</span>
                    <span>Wind {weatherData.wind_kmh || 12} km/h</span>
                  </p>
                  <p className="text-xs text-emerald-900 font-semibold mt-2 line-clamp-2 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                    {weatherData.spray_recommendation}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </div>
          )}

          {/* Outbreak Alert Banner */}
          <div 
            onClick={() => onNavigateTo('forecasts')}
            className="p-5 rounded-3xl bg-gradient-to-r from-red-950 to-stone-900 text-white border border-red-900/60 shadow-xs cursor-pointer hover:border-red-600 transition-all group flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                    High Outbreak Threat
                  </span>
                  <span className="text-xs font-bold text-red-200">Rice Blast (84% Risk)</span>
                </div>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                  High humidity & leaf wetness window. Tap for spray timing & prevention.
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>

        </div>

      </div>

      {/* 3. Luxury Bento Action Grid (2 cols on Mobile, 4 cols on Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Diagnose Crop */}
        <button
          onClick={() => onNavigateTo('diagnose')}
          className="p-5 rounded-3xl bg-white hover:bg-[#FDFBF7] border border-stone-200 text-left transition-all shadow-2xs hover:shadow-md hover:border-emerald-600 group flex flex-col justify-between min-h-[140px] cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-900">
              {t.navDiagnose}
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5">Instant plant & leaf photo scan</p>
          </div>
        </button>

        {/* Card 2: Field Guide */}
        <button
          onClick={() => onNavigateTo('guide')}
          className="p-5 rounded-3xl bg-white hover:bg-[#FDFBF7] border border-stone-200 text-left transition-all shadow-2xs hover:shadow-md hover:border-amber-600 group flex flex-col justify-between min-h-[140px] cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-amber-900">
              {t.navFieldGuide}
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5">24+ diseases, pests & weeds catalog</p>
          </div>
        </button>

        {/* Card 3: Outbreak Forecasts */}
        <button
          onClick={() => onNavigateTo('forecasts')}
          className="p-5 rounded-3xl bg-white hover:bg-[#FDFBF7] border border-stone-200 text-left transition-all shadow-2xs hover:shadow-md hover:border-blue-600 group flex flex-col justify-between min-h-[140px] cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Droplets className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-blue-900">
              {t.navForecasts}
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5">State & district spore prediction</p>
          </div>
        </button>

        {/* Card 4: Field Map */}
        <button
          onClick={() => onNavigateTo('map')}
          className="p-5 rounded-3xl bg-white hover:bg-[#FDFBF7] border border-stone-200 text-left transition-all shadow-2xs hover:shadow-md hover:border-teal-600 group flex flex-col justify-between min-h-[140px] cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-teal-900">
              {t.navFieldMap}
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5">Farm plots, soil zones & beacons</p>
          </div>
        </button>

      </div>

      {/* 4. Recent Diagnosis Spotlight Card (If available) */}
      {recentDiagnosis && (
        <div 
          onClick={() => onNavigateTo('diagnose')}
          className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden flex items-center justify-center border border-stone-200 shrink-0">
              {recentDiagnosis.image_url ? (
                <img src={recentDiagnosis.image_url} alt="Recent scan" className="w-full h-full object-cover" />
              ) : (
                <Leaf className="w-6 h-6 text-emerald-700" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Recent Scan · {recentDiagnosis.crop_type}
                </span>
                <span className="text-xs text-stone-500">
                  {Math.round(recentDiagnosis.confidence_score * 100)}% Confidence
                </span>
              </div>
              <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                {recentDiagnosis.predicted_disease}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-1">
                {recentDiagnosis.eco_treatment?.instructions || 'Treatment advisory available.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform self-end sm:self-center">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

    </div>
  );
};
