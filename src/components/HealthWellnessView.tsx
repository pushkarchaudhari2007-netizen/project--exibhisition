import React, { useState, useEffect } from 'react';
import { 
  Sun, Heart, Droplets, ShieldAlert, PhoneCall, AlertTriangle, 
  CheckCircle2, Volume2, ShieldCheck, Clock, UserCheck, Flame
} from 'lucide-react';
import { HealthWellnessService, HeatIndexResult } from '../../server/services/healthService.ts';
import { audioEngine } from '../lib/audioService.ts';
import { LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

interface HealthWellnessViewProps {
  language: LanguageCode;
  farmerName: string;
  farmerId: string;
  hasConsent: boolean;
  onUpdateConsent: (granted: boolean) => void;
  onOpenVoiceHub: () => void;
}

export const HealthWellnessView: React.FC<HealthWellnessViewProps> = ({
  language,
  farmerName,
  farmerId,
  hasConsent,
  onUpdateConsent,
  onOpenVoiceHub
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  // Outdoor environment conditions
  const [currentTemp, setCurrentTemp] = useState<number>(34);
  const [currentHumidity, setCurrentHumidity] = useState<number>(68);
  const [heatData, setHeatData] = useState<HeatIndexResult>(
    HealthWellnessService.calculateHeatIndex(34, 68)
  );

  // Hydration interval tracking
  const [minutesUntilDrink, setMinutesUntilDrink] = useState<number>(24);
  const [todayGlassesDrunk, setTodayGlassesDrunk] = useState<number>(5);
  const [symptomStatus, setSymptomStatus] = useState<'normal' | 'tired' | 'dizzy' | 'severe' | null>(null);
  const [symptomAdvice, setSymptomAdvice] = useState<string | null>(null);
  const [alertSpeaking, setAlertSpeaking] = useState(false);

  // Recalculate heat index when temp/humidity slider changes
  useEffect(() => {
    const updated = HealthWellnessService.calculateHeatIndex(currentTemp, currentHumidity);
    setHeatData(updated);
  }, [currentTemp, currentHumidity]);

  const handleSpeakHeatWarning = () => {
    const speechText = heatData.voice_alert[language as keyof typeof heatData.voice_alert] || heatData.voice_alert.hi;
    setAlertSpeaking(true);
    audioEngine.playGentleAlert();
    audioEngine.speakText(speechText, language, () => setAlertSpeaking(false));
  };

  const handleDrinkWater = async () => {
    setTodayGlassesDrunk(prev => prev + 1);
    setMinutesUntilDrink(heatData.recommended_rest_interval_mins);
    audioEngine.playSuccessChime();

    if (hasConsent) {
      try {
        await fetch('/api/health/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmer_id: farmerId,
            event_type: 'hydration_reminder',
            heat_index_value: heatData.heat_index_c,
            farmer_response: 'acknowledged',
            symptom_level: 'normal'
          })
        });
      } catch (err) {
        console.warn('Deferred hydration metric log:', err);
      }
    }
  };

  const handleSymptomSelect = async (level: 'normal' | 'tired' | 'dizzy' | 'severe') => {
    setSymptomStatus(level);
    const evalResult = HealthWellnessService.evaluateSymptomCheckin(level);
    
    const adviceText = language === 'mr' ? evalResult.instructions_mr :
                       language === 'hi' ? evalResult.instructions_hi : evalResult.instructions;
    
    setSymptomAdvice(adviceText);

    if (evalResult.escalation_required) {
      audioEngine.playGentleAlert();
    } else {
      audioEngine.playSuccessChime();
    }

    audioEngine.speakText(adviceText, language);

    if (hasConsent) {
      try {
        await fetch('/api/health/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmer_id: farmerId,
            event_type: 'symptom_checkin',
            heat_index_value: heatData.heat_index_c,
            farmer_response: evalResult.escalation_required ? 'escalated' : 'acknowledged',
            symptom_level: level
          })
        });
      } catch (err) {
        console.warn('Health checkin log error:', err);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.healthTitle}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Wet-bulb heat stress safety & hydration monitoring
          </p>
        </div>
        <button
          onClick={onOpenVoiceHub}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          Hariya Check-in
        </button>
      </div>

      {/* Explicit Health Data Consent Card (Mandatory PRD requirement) */}
      <div className={`p-4 rounded-3xl border transition-all ${
        hasConsent ? 'bg-white border-stone-200' : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
              hasConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{t.consentTitle}</h3>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                {t.consentMessage}
              </p>
            </div>
          </div>

          <button
            onClick={() => onUpdateConsent(!hasConsent)}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              hasConsent
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
            }`}
          >
            {hasConsent ? 'Revoke Consent' : t.grantConsent}
          </button>
        </div>
      </div>

      {/* Heat Index Real-Time Alert Banner */}
      <div className={`p-5 rounded-3xl border text-white shadow-md relative overflow-hidden ${
        heatData.level === 'danger' || heatData.level === 'extreme_danger'
          ? 'bg-red-800 border-red-900'
          : heatData.level === 'extreme_caution'
          ? 'bg-amber-800 border-amber-900'
          : 'bg-emerald-800 border-emerald-900'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold opacity-90 mb-1">
              <Sun className="w-4 h-4 animate-spin-slow" />
              <span>{t.heatStressAlert}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">
                {heatData.heat_index_c}°C
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 capitalize">
                {heatData.level.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-white/90 mt-2 max-w-sm font-medium leading-relaxed">
              {heatData.voice_alert[language as keyof typeof heatData.voice_alert] || heatData.voice_alert.hi}
            </p>
          </div>

          <button
            onClick={handleSpeakHeatWarning}
            className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 text-white transition-colors"
            title="Listen to heat alert"
          >
            <Volume2 className={`w-6 h-6 ${alertSpeaking ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        {/* Ambient environment slider simulation */}
        <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="opacity-80 block text-[11px]">Simulate Ambient Temp: {currentTemp}°C</span>
            <input
              type="range"
              min="24"
              max="46"
              value={currentTemp}
              onChange={(e) => setCurrentTemp(Number(e.target.value))}
              className="w-full accent-white h-1.5 mt-1"
            />
          </div>
          <div>
            <span className="opacity-80 block text-[11px]">Simulate Humidity: {currentHumidity}%</span>
            <input
              type="range"
              min="30"
              max="95"
              value={currentHumidity}
              onChange={(e) => setCurrentHumidity(Number(e.target.value))}
              className="w-full accent-white h-1.5 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Hydration Reminder Tracker */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{t.hydrationTracker}</h3>
              <p className="text-xs text-stone-700 font-medium">Recommended: {heatData.recommended_water_ml_per_hour}ml / hour</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {todayGlassesDrunk} Glasses Today
          </span>
        </div>

        <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-stone-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Next drink break in: <strong>{minutesUntilDrink} minutes</strong></span>
          </div>

          <button
            onClick={handleDrinkWater}
            className="min-h-[44px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            {t.drinkWaterNow}
          </button>
        </div>
      </div>

      {/* Symptom Check-in Flow (Pre-approved decision tree) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            {t.symptomCheckin}
          </h3>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Voice-checked medical decision tree (non-diagnostic preventive safety)
          </p>
        </div>

        {/* 4 Large Symptom Buttons with >=48dp Hitbox */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleSymptomSelect('normal')}
            className={`min-h-[52px] p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              symptomStatus === 'normal'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.feelingFine}</span>
          </button>

          <button
            onClick={() => handleSymptomSelect('tired')}
            className={`min-h-[52px] p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              symptomStatus === 'tired'
                ? 'bg-amber-50 border-amber-600 text-amber-950 ring-1 ring-amber-600'
                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.restingInShade}</span>
          </button>

          <button
            onClick={() => handleSymptomSelect('dizzy')}
            className={`min-h-[52px] p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              symptomStatus === 'dizzy'
                ? 'bg-red-50 border-red-600 text-red-950 ring-1 ring-red-600'
                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{t.feelingDizzy}</span>
          </button>

          <button
            onClick={() => handleSymptomSelect('severe')}
            className={`min-h-[52px] p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              symptomStatus === 'severe'
                ? 'bg-red-100 border-red-700 text-red-950 ring-2 ring-red-700'
                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-700 shrink-0" />
            <span>Severe / Heat Stroke</span>
          </button>
        </div>

        {/* Guidance Display */}
        {symptomAdvice && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-fade-in">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Pre-approved First-Aid Guidance:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {symptomAdvice}
            </p>
          </div>
        )}

        {/* Emergency Escalation Bar (PHC Ambulance 108 & Family Contact) */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="text-stone-600">
            <span className="font-semibold block">{t.emergencyPhcContact}</span>
            <span className="text-[11px] text-stone-700">Khadakwasla Rural Hospital</span>
          </div>

          <a
            href="tel:108"
            className="min-h-[44px] px-3.5 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call 108
          </a>
        </div>
      </div>
    </div>
  );
};
