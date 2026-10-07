import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Info, ChevronLeft, ChevronRight, 
  Sparkles, ShieldCheck, ZoomIn, ArrowRight
} from 'lucide-react';
import { FieldGuideItem, LanguageCode } from '../../shared/types.ts';
import { FIELD_GUIDE_CATALOG } from '../../server/ai/fieldGuideData.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

interface SelfDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userImage: string | null;
  cropType: string;
  language: LanguageCode;
  initialGuideItem?: FieldGuideItem | null;
  onConfirmMatch: (item: FieldGuideItem) => void;
}

export const SelfDiagnosisModal: React.FC<SelfDiagnosisModalProps> = ({
  isOpen,
  onClose,
  userImage,
  cropType,
  language,
  initialGuideItem,
  onConfirmMatch
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const relevantCatalog = FIELD_GUIDE_CATALOG.filter(
    item => item.crop.toLowerCase() === cropType.toLowerCase() || item.crop === 'cotton'
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentItem = initialGuideItem || relevantCatalog[currentIndex] || FIELD_GUIDE_CATALOG[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % relevantCatalog.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + relevantCatalog.length) % relevantCatalog.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {t.selfDiagnosisTitle}
            </h2>
            <p className="text-xs text-stone-400">
              Compare your captured photo with reference damage patterns
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body: Side-by-Side Views */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            
            {/* Left Box: Your Photo */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-600 block text-center uppercase tracking-wider">
                Your Field Photo
              </span>
              <div className="aspect-square rounded-2xl bg-stone-900 overflow-hidden border border-stone-200 flex items-center justify-center">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Captured damage"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-stone-500">No photo captured</span>
                )}
              </div>
            </div>

            {/* Right Box: Field Guide Reference Image */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate">
                  Reference Guide
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 capitalize">
                  {currentItem.category}
                </span>
              </div>
              <div className="aspect-square rounded-2xl bg-stone-900 overflow-hidden border border-emerald-500/50 flex items-center justify-center relative">
                <img
                  src={currentItem.visual_guide_image}
                  alt={currentItem.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          </div>

          {/* Reference Selector Bar with Next/Prev Arrows */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              title="Previous Reference"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center px-2">
              <h4 className="text-xs font-extrabold text-stone-900">
                {currentItem.name_local?.[language] || currentItem.name}
              </h4>
              <p className="text-[10px] text-stone-700 italic">
                {currentItem.scientific_name} ({currentIndex + 1} of {relevantCatalog.length})
              </p>
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              title="Next Reference"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Expert Comparison Tip */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              Comparison Checklist:
            </span>
            <p className="leading-relaxed text-stone-700">
              {currentItem.comparison_tip}
            </p>
          </div>

          {/* Key Symptoms */}
          <div>
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Visual Symptoms to Look For:
            </span>
            <ul className="text-xs text-stone-600 space-y-1">
              {currentItem.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onConfirmMatch(currentItem);
              onClose();
            }}
            className="flex-1 min-h-[48px] rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Match: "{currentItem.name_local?.[language] || currentItem.name}"</span>
          </button>
          <button
            onClick={onClose}
            className="min-h-[48px] px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
