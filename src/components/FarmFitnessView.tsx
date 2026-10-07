import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, Shield, Droplets, Leaf, Award, Users, 
  TrendingUp, Sparkles, AlertCircle, Heart, ArrowUpRight,
  MapPin, Compass, Navigation, RefreshCw, CheckCircle2
} from 'lucide-react';
import { GamificationScore, LanguageCode, Village, VillageChallenge } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { locationManager, UserLocation, SUPPORTED_CITIES } from '../lib/locationService.ts';
import { audioEngine } from '../lib/audioService.ts';

interface FarmFitnessViewProps {
  language: LanguageCode;
  farmId: string;
  farmerName: string;
  onOpenVoiceHub: () => void;
}

export const FarmFitnessView: React.FC<FarmFitnessViewProps> = ({
  language,
  farmId,
  farmerName,
  onOpenVoiceHub
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [scoreData, setScoreData] = useState<GamificationScore | null>(null);
  const [villageLeaderboard, setVillageLeaderboard] = useState<Village[]>([]);
  const [farmerLeaderboardData, setFarmerLeaderboardData] = useState<any>({
    city: 'Pune',
    current_farmer_rank: 3,
    total_farmers_in_city: 142,
    city_average_score: 84.8,
    farmers: []
  });
  const [challenges, setChallenges] = useState<VillageChallenge[]>([]);
  const [activeTab, setActiveTab] = useState<'score' | 'village' | 'farmers'>('score');

  const initialFitnessLoc = locationManager.getLocation();
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(initialFitnessLoc);
  const [selectedState, setSelectedState] = useState<string>(
    initialFitnessLoc.state || locationManager.getStateForCity(initialFitnessLoc.city) || 'Maharashtra'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  const availableStates = locationManager.getStates();
  const availableCities = locationManager.getCitiesForState(selectedState);

  // Subscribe to location updates
  useEffect(() => {
    const unsub = locationManager.subscribe((loc) => {
      setCurrentLocation(loc);
      if (loc.state) {
        setSelectedState(loc.state);
      } else {
        setSelectedState(locationManager.getStateForCity(loc.city));
      }
    });
    return unsub;
  }, []);

  // Fetch farmers leaderboard for current city
  const fetchCityLeaderboard = (city: string) => {
    fetch(`/api/leaderboards/farmers?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.farmers) {
          setFarmerLeaderboardData(data);
        } else if (Array.isArray(data)) {
          setFarmerLeaderboardData((prev: any) => ({ ...prev, farmers: data }));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchCityLeaderboard(currentLocation.city);
  }, [currentLocation.city]);

  useEffect(() => {
    // Fetch score
    fetch(`/api/gamification/score?farm_id=${farmId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setScoreData(data);
      })
      .catch(console.error);

    // Fetch villages
    fetch('/api/leaderboards/village')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVillageLeaderboard(data);
      })
      .catch(console.error);

    // Fetch challenges
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChallenges(data);
      })
      .catch(console.error);
  }, [farmId]);

  // Request browser GPS location
  const handleRequestGps = async () => {
    setIsLocating(true);
    setLocationFeedback(null);
    const result = await locationManager.requestGpsLocation();
    setIsLocating(false);

    if (result.success && result.location) {
      audioEngine.playSuccessChime();
      const detectedState = result.location.state || locationManager.getStateForCity(result.location.city);
      setSelectedState(detectedState);
      setLocationFeedback(`GPS detected: ${result.location.city}, ${detectedState}`);
      fetchCityLeaderboard(result.location.city);
      setTimeout(() => setLocationFeedback(null), 4000);
    } else {
      setLocationFeedback(result.error || 'Could not retrieve GPS coordinates.');
      setTimeout(() => setLocationFeedback(null), 4000);
    }
  };

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);

    const citiesInState = locationManager.getCitiesForState(newState);
    const defaultCity = citiesInState[0]?.city || 'Pune';

    locationManager.setStateAndCity(newState, defaultCity);
    fetchCityLeaderboard(defaultCity);
    setLocationFeedback(`State changed to ${newState}. Showing ranks for ${defaultCity}.`);
    setTimeout(() => setLocationFeedback(null), 3000);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    locationManager.setStateAndCity(selectedState, selected);
    fetchCityLeaderboard(selected);
  };

  const fallbackScore: GamificationScore = {
    score_id: 'score-ramesh',
    farm_id: farmId,
    farmer_id: 'farmer-ramesh',
    week_start_date: '2026-10-01',
    pesticide_reduction_score: 95,
    soil_health_score: 82,
    water_efficiency_score: 80,
    health_compliance_score: 90,
    followthrough_score: 88,
    farm_fitness_score_total: 87.3,
    rolling_4wk_average: 85.1,
    streak_eco_days: 12,
    streak_hydration_days: 6,
    grace_days_remaining: 1,
    badges: [
      {
        id: 'badge-organic-season',
        title: '50% Organic Season',
        title_local: { hi: '50% जैविक फसल', mr: '५०% सेंद्रिय हंगाम' },
        description: 'Maintained over 50% non-chemical pest management throughout season.',
        icon: 'leaf'
      },
      {
        id: 'badge-heat-safe',
        title: 'Heat-Safe Harvest',
        title_local: { hi: 'सुरक्षित धूप रक्षक', mr: 'उष्णता-सुरक्षित शेतकरी' },
        description: 'Acknowledged heat alerts and hydrated across consecutive hot days.',
        icon: 'shield-sun'
      },
      {
        id: 'badge-water-saver',
        title: 'Water Saver',
        title_local: { hi: 'जल संरक्षक', mr: 'पाणी बचतकर्ता' },
        description: 'Optimized irrigation according to soil moisture forecasts.',
        icon: 'droplets'
      }
    ]
  };

  const score = scoreData || fallbackScore;

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.navFitness}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Sustainable farming & collective village health
          </p>
        </div>

        <button
          onClick={onOpenVoiceHub}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Hariya Update
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('score')}
          className={`flex-1 min-h-[44px] text-xs font-bold rounded-xl transition-all ${
            activeTab === 'score'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.farmFitnessScore}
        </button>
        <button
          onClick={() => setActiveTab('village')}
          className={`flex-1 min-h-[44px] text-xs font-bold rounded-xl transition-all ${
            activeTab === 'village'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Village Cup
        </button>
        <button
          onClick={() => setActiveTab('farmers')}
          className={`flex-1 min-h-[44px] text-xs font-bold rounded-xl transition-all ${
            activeTab === 'farmers'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Farmer Rank
        </button>
      </div>

      {/* TAB 1: SCORE BREAKDOWN */}
      {activeTab === 'score' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* Main Score Hero Card (5 cols on Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-[#D4AF37]/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#E6CA65]">
                  {t.farmFitnessScore}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black tracking-tight font-display">
                    {score.farm_fitness_score_total}
                  </span>
                  <span className="text-sm font-semibold opacity-70">/ 100</span>
                </div>
                <p className="text-xs text-emerald-200 mt-2 font-medium">
                  {t.rollingAverage}: <strong>{score.rolling_4wk_average}</strong>
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center text-center">
                <Trophy className="w-7 h-7 text-[#E6CA65] mb-0.5" />
                <span className="text-[10px] font-bold text-emerald-100">Top 10%</span>
              </div>
            </div>

            {/* Streaks Banner */}
            <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-sm font-black">{score.streak_eco_days} Weeks</span>
                  <p className="text-[10px] text-emerald-200">{t.ecoStreak}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <span className="text-sm font-black">{score.streak_hydration_days} Days</span>
                  <p className="text-[10px] text-emerald-200">{t.hydrationStreak}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300/90 flex items-center justify-between">
              <span>Monthly Grace Freeze Days: <strong>{score.grace_days_remaining}</strong></span>
              <span className="opacity-75">Smoothed 4-wk</span>
            </div>
          </div>

          {/* Right Column: 5 Component Weights Breakdown & Badges (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 5 Component Weights Breakdown (Deterministic Formula) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Scoring Weight Components
              </h3>

              <div className="space-y-3.5">
                {/* 1. Pesticide Reduction 30% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" /> {t.pesticideScore}
                    </span>
                    <span className="font-bold text-stone-900">{score.pesticide_reduction_score} / 100</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${score.pesticide_reduction_score}%` }} />
                  </div>
                </div>

                {/* 2. Soil Health 25% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700" /> {t.soilScore}
                    </span>
                    <span className="font-bold text-stone-900">{score.soil_health_score} / 100</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${score.soil_health_score}%` }} />
                  </div>
                </div>

                {/* 3. Water Efficiency 20% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-600" /> {t.waterScore}
                    </span>
                    <span className="font-bold text-stone-900">{score.water_efficiency_score} / 100</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${score.water_efficiency_score}%` }} />
                  </div>
                </div>

                {/* 4. Health Compliance 15% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-red-600" /> {t.healthScore}
                    </span>
                    <span className="font-bold text-stone-900">{score.health_compliance_score} / 100</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${score.health_compliance_score}%` }} />
                  </div>
                </div>

                {/* 5. Diagnosis Follow-Through 10% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> {t.followthroughScore}
                    </span>
                    <span className="font-bold text-stone-900">{score.followthrough_score} / 100</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${score.followthrough_score}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {t.badgesTitle}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {score.badges.map((b) => (
                  <div key={b.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center flex flex-col items-center hover:border-amber-300 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-1.5">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 leading-tight">
                      {b.title_local?.[language] || b.title}
                    </span>
                    <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: VILLAGE LEADERBOARD & CHALLENGE */}
      {activeTab === 'village' && (
        <div className="space-y-5 animate-fade-in">
          {/* Active Village Challenge Card */}
          {challenges[0] && (
            <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-amber-400">
                  {challenges[0].season}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-bold">{challenges[0].title}</h3>
              <p className="text-xs text-stone-300">
                Normalized by active participating farmers to keep small villages fair. Scored on score improvement!
              </p>
            </div>
          )}

          {/* Village Leaderboard Rows */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Collective Village Standing
            </h3>

            {villageLeaderboard.map((vil, idx) => {
              const isKhadakwasla = vil.name === 'Khadakwasla';
              return (
                <div
                  key={vil.village_id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                    isKhadakwasla
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-amber-400 text-stone-950' :
                      idx === 1 ? 'bg-stone-300 text-stone-950' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-stone-900">
                        {vil.name} {isKhadakwasla && '(Your Village)'}
                      </span>
                      <p className="text-[11px] text-stone-700">
                        {vil.district}, {vil.state} · {vil.total_farmers} Active Farmers
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-800">
                      {vil.average_farm_fitness}
                    </span>
                    <span className="text-[10px] text-stone-700 block">Avg Fitness</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CITY-BASED FARMER LEADERBOARD */}
      {activeTab === 'farmers' && (
        <div className="space-y-4 animate-fade-in">

          {/* Location Access & City Switcher Bar */}
          <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Farmer Rank by City / District
                </span>
              </div>

              {currentLocation.isGps ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GPS Active
                </span>
              ) : (
                <span className="text-[10px] text-stone-400 font-medium">
                  Manual City Selection
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Step 1: Select State */}
                <div className="bg-white/10 rounded-2xl p-2.5 border border-white/20 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1">
                    <span>1. Select State</span>
                    {currentLocation.isGps && <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full">GPS</span>}
                  </label>
                  <select
                    value={selectedState}
                    onChange={handleStateSelect}
                    className="bg-stone-900/90 text-white font-bold text-xs p-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer w-full border border-white/10"
                  >
                    {availableStates.map((st) => (
                      <option key={st} value={st} className="bg-stone-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Select City according to State */}
                <div className="bg-white/10 rounded-2xl p-2.5 border border-white/20 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 mb-1 flex items-center justify-between">
                    <span>2. Select City / District</span>
                    <span className="text-[10px] font-normal text-stone-300">({availableCities.length} hubs)</span>
                  </label>
                  <select
                    value={currentLocation.city}
                    onChange={handleCitySelect}
                    className="bg-stone-900/90 text-white font-bold text-xs p-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer w-full border border-white/10"
                  >
                    {availableCities.map((c) => (
                      <option key={c.city} value={c.city} className="bg-stone-900 text-white">
                        {c.city} ({selectedState})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick GPS Location Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-300 font-medium">
                  Active Ranking Hub: <strong className="text-white">{currentLocation.city}, {selectedState}</strong>
                </span>

                <button
                  onClick={handleRequestGps}
                  disabled={isLocating}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  title="Detect live device GPS location"
                >
                  {isLocating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>{isLocating ? 'Detecting...' : 'Auto-Detect via GPS'}</span>
                </button>
              </div>
            </div>

            {locationFeedback && (
              <p className="text-xs text-emerald-200 bg-white/10 p-2 rounded-xl font-medium animate-fade-in">
                {locationFeedback}
              </p>
            )}
          </div>

          {/* Current Farmer City Rank Banner */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {farmerLeaderboardData.city} District Standing
                </span>
                <span className="text-xs text-stone-700 font-bold">
                  {farmerLeaderboardData.top_percentile || 'Top 5%'}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">
                Rank #{farmerLeaderboardData.current_farmer_rank || 3} in {farmerLeaderboardData.city}
              </h3>
              <p className="text-xs text-stone-700 mt-0.5">
                Out of {farmerLeaderboardData.total_farmers_in_city || 142} active farmers in this district cluster
              </p>
            </div>

            <div className="text-right pl-3 border-l border-stone-100">
              <span className="text-2xl font-black text-emerald-800">
                {score.farm_fitness_score_total}
              </span>
              <span className="text-[10px] text-stone-700 block font-semibold">Your Score</span>
              <span className="text-[10px] text-stone-700 block mt-0.5">
                City Avg: {farmerLeaderboardData.city_average_score || 84.8}
              </span>
            </div>
          </div>

          {/* City Leaderboard Rows */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                {farmerLeaderboardData.city} District Leaderboard
              </h3>
              <span className="text-[10px] text-stone-700 font-medium">Ranked by Farm Fitness</span>
            </div>

            {(farmerLeaderboardData.farmers || []).map((farmer: any) => (
              <div
                key={farmer.rank}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  farmer.isCurrent
                    ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    farmer.rank === 1 ? 'bg-amber-400 text-stone-950' :
                    farmer.rank === 2 ? 'bg-stone-300 text-stone-950' :
                    farmer.rank === 3 ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    #{farmer.rank}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-stone-900">
                      {farmer.name}
                    </span>
                    <p className="text-[11px] text-stone-700">
                      {farmer.locality || farmer.village || `${farmerLeaderboardData.city} Belt`} · {farmer.streak} wk eco streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-800">{farmer.score}</span>
                  <span className="text-[10px] text-stone-700 block">Fitness</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
