import React, { useState, useEffect } from 'react';
import { 
  CloudRain, AlertTriangle, ShieldCheck, Droplets, Thermometer, 
  Wind, Clock, Sparkles, Volume2, ArrowRight, ShieldAlert, CheckCircle2,
  MapPin, Navigation, RefreshCw, ChevronRight
} from 'lucide-react';
import { LanguageCode, OutbreakForecast } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { audioEngine } from '../lib/audioService.ts';
import { locationManager, UserLocation, STATE_CITIES_REGISTRY, SUPPORTED_CITIES } from '../lib/locationService.ts';

interface OutbreakForecastViewProps {
  language: LanguageCode;
  onOpenVoiceHub?: () => void;
}

export const OutbreakForecastView: React.FC<OutbreakForecastViewProps> = ({
  language,
  onOpenVoiceHub
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [forecasts, setForecasts] = useState<OutbreakForecast[]>([]);
  const [forecastMeta, setForecastMeta] = useState<{ city?: string; temperature_c?: number; humidity_percent?: number }>({});
  const [selectedCropFilter, setSelectedCropFilter] = useState<'all' | 'rice' | 'cotton' | 'tomato'>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const initialLoc = locationManager.getLocation();
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(initialLoc);
  const [selectedState, setSelectedState] = useState<string>(
    initialLoc.state || locationManager.getStateForCity(initialLoc.city) || 'Maharashtra'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // States available from registry
  const availableStates = locationManager.getStates();
  // Cities available for current selected state
  const availableCities = locationManager.getCitiesForState(selectedState);

  // Subscribe to location
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

  const loadForecastsForCity = (city: string) => {
    fetch(`/api/forecasts/outbreak?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.forecasts)) setForecasts(data.forecasts);
        setForecastMeta({
          city: data.city || city,
          temperature_c: data.temperature_c,
          humidity_percent: data.humidity_percent
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadForecastsForCity(currentLocation.city);
  }, [currentLocation.city]);

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);

    const citiesInState = locationManager.getCitiesForState(newState);
    const defaultCity = citiesInState[0]?.city || 'Pune';

    locationManager.setStateAndCity(newState, defaultCity);
    loadForecastsForCity(defaultCity);
    setLocationToast(`State changed to ${newState}. Showing forecast for ${defaultCity}.`);
    setTimeout(() => setLocationToast(null), 3000);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    locationManager.setStateAndCity(selectedState, selectedCity);
    loadForecastsForCity(selectedCity);
  };

  const handleRequestGps = async () => {
    setIsLocating(true);
    setLocationToast(null);
    const result = await locationManager.requestGpsLocation();
    setIsLocating(false);

    if (result.success && result.location) {
      audioEngine.playSuccessChime();
      const detectedState = result.location.state || locationManager.getStateForCity(result.location.city);
      setSelectedState(detectedState);
      setLocationToast(`GPS detected: ${result.location.city}, ${detectedState}`);
      loadForecastsForCity(result.location.city);
      setTimeout(() => setLocationToast(null), 4000);
    } else {
      setLocationToast(result.error || 'Could not retrieve GPS coordinates.');
      setTimeout(() => setLocationToast(null), 4000);
    }
  };

  const handleSpeakForecast = (f: OutbreakForecast) => {
    const text = f.preventive_action_local?.[language] || f.preventive_action;
    setSpeakingId(f.id);
    audioEngine.playGentleAlert();
    audioEngine.speakText(text, language, () => setSpeakingId(null));
  };

  const filteredForecasts = selectedCropFilter === 'all'
    ? forecasts
    : forecasts.filter(f => f.crop.toLowerCase() === selectedCropFilter.toLowerCase());

  // Focus Rice Blast forecast on top
  const riceBlastForecast = forecasts.find(f => f.id === 'forecast-rice-blast');

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.outbreakForecastTitle}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Microclimate fungal spore germination & pest emergence models
          </p>
        </div>

        {onOpenVoiceHub && (
          <button
            onClick={onOpenVoiceHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Voice Forecast
          </button>
        )}
      </div>

      {/* Location Access & Microclimate Bar with 2-Step State & City Selection */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-3xl p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Forecast Location & Microclimate
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {forecastMeta.temperature_c && (
              <span className="font-bold text-amber-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                <Thermometer className="w-3 h-3" /> {forecastMeta.temperature_c}°C
              </span>
            )}
            {forecastMeta.humidity_percent && (
              <span className="font-bold text-blue-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                <Droplets className="w-3 h-3" /> {forecastMeta.humidity_percent}%
              </span>
            )}
          </div>
        </div>

        {/* 2-Step Location Selector: 1. State -> 2. City */}
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
              Active: <strong className="text-white">{currentLocation.city}, {selectedState}</strong>
            </span>

            <button
              onClick={handleRequestGps}
              disabled={isLocating}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              title="Auto-detect current State & City using device GPS"
            >
              {isLocating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>{isLocating ? 'Detecting GPS...' : 'Auto-Detect via GPS'}</span>
            </button>
          </div>
        </div>

        {locationToast && (
          <p className="text-xs text-emerald-200 bg-white/10 p-2.5 rounded-xl font-medium animate-fade-in border border-emerald-400/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{locationToast}</span>
          </p>
        )}
      </div>

      {/* 1. SPOTLIGHT: RICE BLAST OUTBREAK FORECAST (Prominent Banner) */}
      {riceBlastForecast && (
        <div className="bg-gradient-to-br from-red-900 to-stone-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                  HIGH THREAT ALERT
                </span>
                <span className="text-xs text-red-200 font-semibold">5-Day Horizon</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {riceBlastForecast.threat_name_local?.[language] || riceBlastForecast.threat_name}
              </h2>
              <p className="text-xs text-stone-300 mt-1 max-w-md leading-relaxed">
                {riceBlastForecast.trigger_reason}
              </p>
            </div>

            {/* Risk Gauge Circle */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black text-red-400">
                {riceBlastForecast.risk_percentage}%
              </span>
              <span className="text-[9px] font-bold text-stone-300 uppercase">Risk Index</span>
            </div>
          </div>

          {/* Microclimate Environmental Drivers */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center text-xs">
            <div className="p-2 bg-white/5 rounded-xl">
              <span className="text-amber-400 font-bold block">{riceBlastForecast.leaf_wetness_hours} hrs</span>
              <span className="text-[10px] text-stone-300">Leaf Wetness</span>
            </div>
            <div className="p-2 bg-white/5 rounded-xl">
              <span className="text-blue-400 font-bold block">&gt;{riceBlastForecast.favorable_humidity_min}%</span>
              <span className="text-[10px] text-stone-300">Night Humidity</span>
            </div>
            <div className="p-2 bg-white/5 rounded-xl">
              <span className="text-emerald-400 font-bold block">19°C - 28°C</span>
              <span className="text-[10px] text-stone-300">Spore Temp</span>
            </div>
          </div>

          {/* Actionable Prevention Guidance */}
          <div className="p-3.5 bg-white/10 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {riceBlastForecast.preventive_action_local?.[language] || riceBlastForecast.preventive_action}
              </p>
            </div>

            <button
              onClick={() => handleSpeakForecast(riceBlastForecast)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white shrink-0"
              title="Hear spoken advice"
            >
              <Volume2 className={`w-4 h-4 ${speakingId === riceBlastForecast.id ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Crop Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'rice', 'cotton', 'tomato'] as const).map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCropFilter(crop)}
            className={`flex-1 min-h-[40px] rounded-xl text-xs font-bold capitalize transition-all ${
              selectedCropFilter === crop
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {crop === 'all' ? 'All Alerts' : crop}
          </button>
        ))}
      </div>

      {/* 3. Outbreak Forecast Cards Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredForecasts.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    f.risk_level === 'high'
                      ? 'bg-red-100 text-red-800'
                      : f.risk_level === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {f.risk_level} Risk ({f.risk_percentage}%)
                  </span>
                  <span className="text-xs text-stone-700 capitalize font-bold">{f.crop}</span>
                </div>

                <h3 className="text-base font-extrabold text-stone-900">
                  {f.threat_name_local?.[language] || f.threat_name}
                </h3>
              </div>

              <button
                onClick={() => handleSpeakForecast(f)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 transition-colors"
                title="Speak advisory"
              >
                <Volume2 className={`w-4 h-4 ${speakingId === f.id ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {f.trigger_reason}
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-800 space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Actionable Prevention:
              </span>
              <p className="leading-relaxed">
                {f.preventive_action_local?.[language] || f.preventive_action}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
