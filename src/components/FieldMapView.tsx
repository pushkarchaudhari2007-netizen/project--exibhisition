import React, { useState } from 'react';
import { 
  MapPin, Layers, Info, Navigation, Calendar, 
  ExternalLink, ArrowRight, ShieldCheck, AlertCircle, Compass
} from 'lucide-react';
import { Diagnosis, Farm, LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

interface FieldMapViewProps {
  language: LanguageCode;
  farm: Farm;
  diagnoses: Diagnosis[];
  onSelectDiagnosis?: (d: Diagnosis) => void;
}

export const FieldMapView: React.FC<FieldMapViewProps> = ({
  language,
  farm,
  diagnoses,
  onSelectDiagnosis
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [selectedPin, setSelectedPin] = useState<Diagnosis | null>(diagnoses[0] || null);
  const [mapLayer, setMapLayer] = useState<'schematic' | 'satellite'>('schematic');

  // Seed default points if diagnoses list has pins
  const plotCoordinates = [
    { zone: 'North Parcel (Cotton)', x: 30, y: 35, color: '#059669' },
    { zone: 'Central Bed (Tomato)', x: 65, y: 55, color: '#d97706' },
    { zone: 'South Boundary Ridge', x: 45, y: 78, color: '#dc2626' }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.navFieldMap}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Geotagged diagnostic scans across your {farm.acreage} acre parcel
          </p>
        </div>

        {/* Map Layer Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMapLayer('schematic')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapLayer === 'schematic' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Cadastral
          </button>
          <button
            onClick={() => setMapLayer('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapLayer === 'satellite' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Aerial
          </button>
        </div>
      </div>

      {/* Field Geotag Interactive Map Canvas */}
      <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-950">
        
        {/* Background Canvas: Satellite / Cadastral Farm Plot */}
        <div className={`absolute inset-0 transition-opacity ${
          mapLayer === 'satellite' ? 'bg-stone-900' : 'bg-emerald-950'
        }`}>
          {/* SVG Map Lines & Zones */}
          <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Field boundary polygon */}
            <polygon
              points="15,15 85,20 80,85 18,80"
              fill={mapLayer === 'satellite' ? '#1c1917' : '#064e3b'}
              stroke="#10b981"
              strokeWidth="0.8"
              strokeDasharray="2 1"
            />
            {/* Irrigation ridge channels */}
            <line x1="16" y1="48" x2="82" y2="52" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="1 1" />
            <line x1="50" y1="18" x2="48" y2="82" stroke="#10b981" strokeWidth="0.4" />
          </svg>
        </div>

        {/* Compass & Coordinates HUD */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-mono flex items-center gap-1.5 border border-white/10 z-10">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>18.432°N, 73.765°E · 1.5 ac</span>
        </div>

        {/* Diagnosis Scan Location Pins */}
        {diagnoses.map((diag, index) => {
          // Spread pins organically across parcel
          const posX = 25 + (index * 24) % 55;
          const posY = 30 + (index * 22) % 45;
          const isSelected = selectedPin?.diagnosis_id === diag.diagnosis_id;

          const pinColor = diag.confidence_tier === 'high' 
            ? 'bg-emerald-500 text-white' 
            : diag.confidence_tier === 'likely'
            ? 'bg-amber-500 text-stone-950'
            : 'bg-red-500 text-white';

          return (
            <div
              key={diag.diagnosis_id}
              onClick={() => setSelectedPin(diag)}
              style={{ left: `${posX}%`, top: `${posY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className={`relative flex items-center justify-center transition-transform ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}>
                {/* Ping ring animation */}
                {isSelected && (
                  <span className="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
                )}
                
                <div className={`w-7 h-7 rounded-full shadow-lg border-2 border-white flex items-center justify-center font-bold text-[10px] ${pinColor}`}>
                  {index + 1}
                </div>
              </div>

              {/* Tooltip label */}
              <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-950/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {diag.predicted_label}
              </span>
            </div>
          );
        })}

        {/* Legend Overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white p-2.5 rounded-2xl text-[10px] flex items-center justify-between border border-white/10 z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> High Conf
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Likely
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Low Conf
            </span>
          </div>
          <span className="opacity-75">{diagnoses.length} Geotagged Scans</span>
        </div>
      </div>

      {/* Selected Scan Info Card */}
      {selectedPin ? (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Plot Location: {selectedPin.geo_coordinates?.field_zone || 'North Parcel'}
              </span>
              <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                {selectedPin.predicted_label}
              </h3>
              <p className="text-xs text-stone-700 capitalize">
                Crop: {selectedPin.crop_type} · {Math.round(selectedPin.confidence_score * 100)}% Confidence
              </p>
            </div>

            <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              {new Date(selectedPin.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl text-xs text-stone-700 leading-relaxed">
            {selectedPin.hariya_explanation_local?.[language] || selectedPin.hariya_explanation}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-stone-700">
              GPS: {selectedPin.geo_coordinates?.lat.toFixed(5) || '18.43201'}°N, {selectedPin.geo_coordinates?.lng.toFixed(5) || '73.76512'}°E
            </div>

            <button
              onClick={() => onSelectDiagnosis && onSelectDiagnosis(selectedPin)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View Full Treatment Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-3xl text-center text-xs text-stone-400 border border-stone-200">
          Tap any pin on the map to inspect photo coordinates and diagnosis.
        </div>
      )}

    </div>
  );
};
