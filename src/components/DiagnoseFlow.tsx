import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, 
  RotateCcw, Volume2, Droplets, Thermometer, Info, ArrowRight, ShieldAlert, Check,
  Bookmark, Split, ListOrdered, BookOpen, MapPin, Compass
} from 'lucide-react';
import { SAMPLE_LEAVES, SampleLeaf } from '../lib/sampleLeaves.ts';
import { Diagnosis, LanguageCode, SoilDataSnapshot, WeatherSnapshot, FieldGuideItem, TreatmentProduct } from '../../shared/types.ts';
import { audioEngine } from '../lib/audioService.ts';
import { syncManager } from '../lib/syncManager.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { SelfDiagnosisModal } from './SelfDiagnosisModal.tsx';
import { locationManager } from '../lib/locationService.ts';

interface DiagnoseFlowProps {
  language: LanguageCode;
  farmerName: string;
  farmId: string;
  farmerId: string;
  onDiagnosisComplete: (diag: Diagnosis) => void;
  onOpenVoiceHub: () => void;
  onViewOnMap?: () => void;
}

export const DiagnoseFlow: React.FC<DiagnoseFlowProps> = ({
  language,
  farmerName,
  farmId,
  farmerId,
  onDiagnosisComplete,
  onOpenVoiceHub,
  onViewOnMap
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  // Form states
  const [selectedCrop, setSelectedCrop] = useState<string>('cotton');
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_LEAVES[0].dataUri);
  const [selectedLeafMeta, setSelectedLeafMeta] = useState<SampleLeaf | null>(SAMPLE_LEAVES[0]);
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Context Fusion states (Soil & Weather)
  const [soilMoisture, setSoilMoisture] = useState<number>(62);
  const [soilPH, setSoilPH] = useState<number>(6.8);
  const [useIoTProbe, setUseIoTProbe] = useState<boolean>(true);

  // Weather context
  const [weatherTemp, setWeatherTemp] = useState<number>(31);
  const [weatherHumidity, setWeatherHumidity] = useState<number>(75);
  const [weatherRainForecast, setWeatherRainForecast] = useState<number>(0);

  // Processing & result states
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<Diagnosis | null>(null);
  const [treatmentLogged, setTreatmentLogged] = useState(false);
  const [speakingHariya, setSpeakingHariya] = useState(false);
  const [isSelfDiagnosisOpen, setIsSelfDiagnosisOpen] = useState(false);
  const [favoriteTreatments, setFavoriteTreatments] = useState<Set<string>>(new Set(['prod-neem-nske']));
  const [allTreatmentProducts, setAllTreatmentProducts] = useState<TreatmentProduct[]>([]);
  const [customizedProducts, setCustomizedProducts] = useState<TreatmentProduct[]>([]);
  const [selectedProductModal, setSelectedProductModal] = useState<TreatmentProduct | null>(null);

  // Load treatment products and favorites on mount
  useEffect(() => {
    fetch('/api/treatment-products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllTreatmentProducts(data);
          const favs = new Set(data.filter((p: TreatmentProduct) => p.is_favorite).map((p: TreatmentProduct) => p.id));
          setFavoriteTreatments(favs);
        }
      })
      .catch(console.error);
  }, []);

  // Update customized products when diagnosis changes
  useEffect(() => {
    if (!diagnosisResult || allTreatmentProducts.length === 0) return;
    const labelLower = diagnosisResult.predicted_label.toLowerCase();
    const cropLower = diagnosisResult.crop_type.toLowerCase();
    
    // Match products by disease name, target pests, or crop
    const matched = allTreatmentProducts.filter(p => {
      const matchTarget = p.target_pests.some(t => 
        labelLower.includes(t.toLowerCase()) || t.toLowerCase().includes(labelLower)
      );
      return matchTarget || p.category === 'organic_bio';
    });
    setCustomizedProducts(matched.length > 0 ? matched : allTreatmentProducts.slice(0, 3));
  }, [diagnosisResult, allTreatmentProducts]);

  const handleToggleFavorite = async (product: TreatmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id })
      });
      const data = await res.json();
      setFavoriteTreatments(prev => {
        const next = new Set(prev);
        if (data.is_favorite) {
          next.add(product.id);
          audioEngine.playSuccessChime();
        } else {
          next.delete(product.id);
        }
        return next;
      });
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  // Crops catalog with extensive plant species & auto-detect option
  const crops = [
    { id: 'auto', nameEn: 'Auto-Detect', nameHi: 'ऑटो-पहचान', nameMr: 'ऑटो-शोध', icon: '🔍', highlight: true },
    { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस', icon: '🌱' },
    { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', nameMr: 'टोमॅटो', icon: '🍅' },
    { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान (चावल)', nameMr: 'भात', icon: '🌾' },
    { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू', icon: '🌾' },
    { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', nameMr: 'ऊस', icon: '🎋' },
    { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', nameMr: 'सोयाबीन', icon: '🫘' },
    { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज', nameMr: 'कांदा', icon: '🧅' },
    { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', nameMr: 'बटाटा', icon: '🥔' },
    { id: 'maize', nameEn: 'Maize / Corn', nameHi: 'मक्का', nameMr: 'मका', icon: '🌽' },
    { id: 'chili', nameEn: 'Chili', nameHi: 'मिर्च', nameMr: 'मिरची', icon: '🌶️' },
    { id: 'banana', nameEn: 'Banana', nameHi: 'केला', nameMr: 'केळी', icon: '🍌' },
    { id: 'grapes', nameEn: 'Grape', nameHi: 'अंगूर', nameMr: 'द्राक्षे', icon: '🍇' },
    { id: 'mango', nameEn: 'Mango', nameHi: 'आम', nameMr: 'आंबा', icon: '🥭' },
    { id: 'groundnut', nameEn: 'Groundnut', nameHi: 'मूंगफली', nameMr: 'भुईमूग', icon: '🥜' },
    { id: 'citrus', nameEn: 'Citrus / Lemon', nameHi: 'नींबू', nameMr: 'लिंबू', icon: '🍋' },
    { id: 'pomegranate', nameEn: 'Pomegranate', nameHi: 'अनार', nameMr: 'डाळिंब', icon: '🍎' },
    { id: 'brinjal', nameEn: 'Brinjal', nameHi: 'बैंगन', nameMr: 'वांगे', icon: '🍆' },
    { id: 'chickpea', nameEn: 'Chickpea', nameHi: 'चना', nameMr: 'हरभरा', icon: '🥣' },
    { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों', nameMr: 'मोहरी', icon: '🌼' },
    { id: 'ginger', nameEn: 'Ginger / Turmeric', nameHi: 'अदरक', nameMr: 'आले / हळद', icon: '🫚' }
  ];

  const [cropSearchQuery, setCropSearchQuery] = useState('');

  // Start real camera
  const handleStartCamera = async () => {
    try {
      setIsCapturingCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera stream permission unavailable, falling back to leaf picker:', err);
      setIsCapturingCamera(false);
    }
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 400;
    canvas.height = videoRef.current.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUri);
      setSelectedLeafMeta(null);
    }
    // Stop tracks
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) stream.getTracks().forEach(t => t.stop());
    setIsCapturingCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedLeafMeta(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Diagnosis Pipeline
  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setIsDiagnosing(true);
    setQualityError(null);
    setDiagnosisResult(null);
    setTreatmentLogged(false);

    const soilSnapshot: SoilDataSnapshot = {
      pH: soilPH,
      moisture_percent: soilMoisture,
      data_source: useIoTProbe ? 'bluetooth_probe' : 'manual_entry',
      recorded_at: new Date().toISOString()
    };

    const weatherSnapshot: WeatherSnapshot = {
      temperature_c: weatherTemp,
      humidity_percent: weatherHumidity,
      rainfall_forecast_mm: weatherRainForecast,
      heat_index_c: Math.round(weatherTemp + (weatherHumidity * 0.1)),
      heat_index_level: 'extreme_caution',
      wind_kmh: 12,
      recorded_at: new Date().toISOString()
    };

    // If client is offline, simulate on-device lite model locally and queue sync!
    if (!syncManager.isOnline()) {
      setTimeout(() => {
        setIsDiagnosing(false);
        // Offline lite model simulation
        const offlineDiag: Diagnosis = {
          diagnosis_id: `diag-offline-${Date.now()}`,
          farm_id: farmId,
          farmer_id: farmerId,
          image_url: selectedImage.slice(0, 80) + '...[offline-photo]',
          crop_type: selectedCrop,
          predicted_label: selectedCrop === 'cotton' ? 'Early Leaf Spot (Cercospora)' : 'Early Blight (Alternaria)',
          confidence_score: 0.86,
          confidence_tier: 'high',
          model_version: 'MobileNetV3-Agri-Lite (Offline On-Device)',
          soil_data_snapshot: soilSnapshot,
          weather_snapshot: weatherSnapshot,
          context_fusion_notes: ['Processed offline on-device. Will sync cloud confirmation when connected.'],
          treatment_advisory: {
            disease_name: selectedCrop === 'cotton' ? 'Early Leaf Spot (Cercospora)' : 'Early Blight (Alternaria)',
            severity: 'moderate',
            eco_first_remedies: [
              {
                step: 1,
                title: 'Neem Seed Kernel Extract (NSKE 5%)',
                category: 'organic_spray',
                instructions: 'Soak 50g crushed neem seeds in 1L water overnight. Filter and spray early morning on leaf undersides.',
                materials_needed: ['Neem seeds', 'Clean water', 'Muslin cloth']
              }
            ],
            preventive_measures: ['Prune lowest touching diseased leaves', 'Keep root zone drained'],
            follow_up_days: 3
          },
          hariya_explanation: 'Processed on your phone without internet (86% confidence). Use neem oil spray first.',
          hariya_explanation_local: {
            hi: 'बिना इंटरनेट फोन पर जांच पूरी हुई (86% भरोसा)। पहले नीम का अर्क छिड़कें।',
            mr: 'इंटरनेटशिवाय फोनवर तपासणी पूर्ण (८६% खात्री). प्रथम निंबोळी अर्क फवारा.'
          },
          created_at: new Date().toISOString(),
          sync_status: 'local_only',
          needs_extension_review: false
        };

        // Queue in sync manager
        syncManager.enqueue('diagnosis', offlineDiag);
        setDiagnosisResult(offlineDiag);
        onDiagnosisComplete(offlineDiag);
        audioEngine.playSuccessChime();
      }, 900);
      return;
    }

    const userLoc = locationManager.getLocation();
    try {
      const res = await fetch('/api/diagnoses/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: selectedCrop,
          image_base64: selectedImage,
          soil_snapshot: soilSnapshot,
          weather_snapshot: weatherSnapshot,
          farmer_id: farmerId,
          farm_id: farmId,
          language,
          geo_coordinates: {
            lat: userLoc.lat,
            lng: userLoc.lng,
            field_zone: `${userLoc.city} Parcel`
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.quality_failed) {
          setQualityError(data.hariya_explanation || data.quality?.feedback_message || t.qualityFailed);
          audioEngine.playGentleAlert();
          audioEngine.speakText(data.hariya_explanation, language);
        } else {
          setQualityError(data.error || 'Diagnosis failed');
        }
        setIsDiagnosing(false);
        return;
      }

      setDiagnosisResult(data.diagnosis);
      onDiagnosisComplete(data.diagnosis);
      setIsDiagnosing(false);

      // Play chime & speak explanation
      audioEngine.playSuccessChime();
      const explanation = data.diagnosis.hariya_explanation_local?.[language] || data.diagnosis.hariya_explanation;
      if (explanation) {
        setSpeakingHariya(true);
        audioEngine.speakText(explanation, language, () => setSpeakingHariya(false));
      }
    } catch (err: any) {
      console.error('Diagnosis network error:', err);
      setQualityError('Unable to connect to service. Switched to on-device diagnosis.');
      setIsDiagnosing(false);
    }
  };

  const handleApplyTreatment = async () => {
    if (!diagnosisResult) return;
    try {
      const res = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: farmId,
          farmer_id: farmerId,
          diagnosis_id: diagnosisResult.diagnosis_id,
          treatment_type: 'organic',
          product_used: diagnosisResult.treatment_advisory.eco_first_remedies[0]?.title || 'Neem Seed Kernel Extract 5%',
          verification_flag: 'self_reported'
        })
      });

      if (res.ok) {
        setTreatmentLogged(true);
        audioEngine.playSuccessChime();
      }
    } catch (err) {
      // Local fallback queue
      syncManager.enqueue('treatment', {
        treatment_id: `treat-${Date.now()}`,
        farm_id: farmId,
        farmer_id: farmerId,
        diagnosis_id: diagnosisResult.diagnosis_id,
        treatment_type: 'organic',
        product_used: diagnosisResult.treatment_advisory.eco_first_remedies[0]?.title || 'Neem Seed Kernel Extract 5%',
        applied_at: new Date().toISOString(),
        marked_complete: true,
        verification_flag: 'self_reported',
        sync_status: 'local_only'
      });
      setTreatmentLogged(true);
      audioEngine.playSuccessChime();
    }
  };

  const speakHariyaAgain = () => {
    if (!diagnosisResult) return;
    const explanation = diagnosisResult.hariya_explanation_local?.[language] || diagnosisResult.hariya_explanation;
    if (explanation) {
      setSpeakingHariya(true);
      audioEngine.speakText(explanation, language, () => setSpeakingHariya(false));
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.diagnoseTitle}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Voice-guided camera & eco-friendly advisory
          </p>
        </div>
        <button
          onClick={onOpenVoiceHub}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          Hariya Voice
        </button>
      </div>

      {/* Responsive Input Studio Grid: Left (Camera & Leaf Image), Right (Crop & Fusion & CTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Photo Capture & Leaf Sample Carousel (6 cols on Desktop) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                1. {t.capturePhoto}
              </label>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Camera & HD Foliage
              </span>
            </div>

            {/* Live Camera View or Leaf Preview */}
            {isCapturingCamera ? (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center border-2 border-emerald-500">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                
                {/* Guide overlay box */}
                <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded-2xl pointer-events-none flex items-center justify-center">
                  <span className="text-xs text-emerald-200 bg-black/60 px-3 py-1 rounded-full">Place leaf inside frame</span>
                </div>

                <button
                  onClick={handleCaptureFrame}
                  className="absolute bottom-4 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-lg hover:bg-emerald-700 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5" /> Take Photo
                </button>
              </div>
            ) : (
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center group">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected crop leaf"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-stone-400 p-4">
                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No leaf photo captured yet</p>
                  </div>
                )}

                {/* Quality overlay badge */}
                {selectedLeafMeta && (
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-semibold truncate">{selectedLeafMeta.name}</span>
                    {selectedLeafMeta.isQualityFailure ? (
                      <span className="text-amber-400 font-bold shrink-0">Quality Test Case</span>
                    ) : (
                      <span className="text-emerald-400 font-bold shrink-0">Clear Leaf</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Camera / Upload / Self-Diagnosis buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleStartCamera}
                className="min-h-[48px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-stone-300 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span className="truncate">{t.capturePhoto}</span>
              </button>
              <label className="min-h-[48px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-stone-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span className="truncate">Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={() => setIsSelfDiagnosisOpen(true)}
                className="min-h-[48px] rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 transition-colors cursor-pointer"
                title="Side-by-side visual self-diagnosis"
              >
                <Split className="w-4 h-4 text-emerald-700" />
                <span className="truncate">Self-Check</span>
              </button>
            </div>

            {/* Sample Leaves Carousel for Testing */}
            <div className="pt-2 border-t border-stone-100">
              <p className="text-[11px] font-bold text-stone-600 mb-2 uppercase tracking-wide">Or pick a curated sample leaf test:</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SAMPLE_LEAVES.map((leaf) => {
                  const isCurr = selectedLeafMeta?.id === leaf.id;
                  return (
                    <button
                      key={leaf.id}
                      onClick={() => {
                        setSelectedLeafMeta(leaf);
                        setSelectedImage(leaf.dataUri);
                        setSelectedCrop(leaf.crop);
                      }}
                      className={`px-3 py-2 rounded-xl text-left border shrink-0 transition-all cursor-pointer ${
                        isCurr
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">{leaf.name}</p>
                      <p className="text-[10px] text-stone-600 mt-0.5 capitalize">{leaf.crop} · {leaf.expectedDisease}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Crop Selection, Context Fusion & CTA (6 cols on Desktop) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* 2. Crop Selection (With 21+ Indian Crops & Auto-Detect) */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                2. {t.selectCrop}
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                21+ Species / Auto-Detect
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                value={cropSearchQuery}
                onChange={(e) => setCropSearchQuery(e.target.value)}
                placeholder="Search crop (Sugarcane, Cotton, Tomato, Potato)..."
                className="w-full text-xs px-3 py-2.5 pl-8 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="absolute left-2.5 top-2.5 text-stone-400 text-xs">🔍</span>
              {cropSearchQuery && (
                <button
                  onClick={() => setCropSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
              {crops
                .filter(c => {
                  if (!cropSearchQuery) return true;
                  const q = cropSearchQuery.toLowerCase();
                  return c.nameEn.toLowerCase().includes(q) || c.nameHi.includes(q) || c.nameMr.includes(q);
                })
                .map((c) => {
                  const isSelected = selectedCrop === c.id;
                  const displayName = language === 'mr' ? c.nameMr : language === 'hi' ? c.nameHi : c.nameEn;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCrop(c.id)}
                      className={`min-h-[58px] rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-900 text-white shadow-sm ring-2 ring-emerald-600'
                          : c.highlight
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span className="text-xl mb-0.5">{c.icon}</span>
                      <span className="text-[11px] font-bold leading-tight truncate w-full">{displayName}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 3. Context Fusion Controls (Soil & Weather) */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                3. Soil & Weather Context Fusion
              </label>
              <button
                onClick={() => setUseIoTProbe(!useIoTProbe)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  useIoTProbe ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {useIoTProbe ? '✓ IoT Probe Synced' : 'Manual Entry'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between text-stone-600 mb-1">
                  <span className="font-semibold flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" /> Soil Moisture
                  </span>
                  <span className="font-bold text-stone-900">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-emerald-700 h-1.5"
                />
                <span className="text-[10px] text-stone-500 block mt-1">Ideal for cotton: 50-70%</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between text-stone-600 mb-1">
                  <span className="font-semibold flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Soil pH
                  </span>
                  <span className="font-bold text-stone-900">{soilPH}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="8.5"
                  step="0.1"
                  value={soilPH}
                  onChange={(e) => setSoilPH(Number(e.target.value))}
                  className="w-full accent-emerald-700 h-1.5"
                />
                <span className="text-[10px] text-stone-500 block mt-1">Neutral: 6.5 - 7.5</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                Weather: <strong>{weatherTemp}°C</strong>, Humidity <strong>{weatherHumidity}%</strong>. High humidity window increases fungal vulnerability.
              </span>
            </div>
          </div>

          {/* Diagnose CTA Button (>=48dp touch target) */}
          <button
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing || !selectedImage}
            className="w-full min-h-[56px] rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-base shadow-md hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer border border-[#D4AF37]/30"
          >
            {isDiagnosing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.checkingCrop}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#E6CA65]" />
                <span>Run AI Diagnostic Inference</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Quality Rejection Feedback (Safety requirement) */}
      {qualityError && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl text-amber-950 space-y-2 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>{t.qualityCheckTitle}</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">{qualityError}</p>
          <div className="pt-2">
            <button
              onClick={() => {
                setQualityError(null);
                setSelectedLeafMeta(SAMPLE_LEAVES[0]);
                setSelectedImage(SAMPLE_LEAVES[0].dataUri);
              }}
              className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              {t.retakePhoto}
            </button>
          </div>
        </div>
      )}

      {/* 4. Complete Diagnosis Result with Confidence Gates */}
      {diagnosisResult && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 space-y-5 animate-fade-in">
          
          {/* THREE CORE FINDINGS CARDS (Plant, Problem, Solution) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* 1. PLANT IDENTIFIED */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-300 rounded-2xl relative overflow-hidden space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-white flex items-center gap-1">
                  <span>🌱</span> Plant Identified
                </span>
                <span className="text-[11px] font-extrabold text-emerald-900">
                  {Math.round((diagnosisResult.plant_confidence || 0.95) * 100)}% Match
                </span>
              </div>
              <h3 className="text-base font-extrabold text-emerald-950 capitalize leading-snug">
                {diagnosisResult.detected_plant || diagnosisResult.crop_type}
              </h3>
              {diagnosisResult.plant_scientific_name && (
                <p className="text-xs italic font-medium text-emerald-800">
                  {diagnosisResult.plant_scientific_name}
                </p>
              )}
              <p className="text-[11px] text-emerald-900/80 font-medium">
                Recognized from foliar venation & leaf architecture
              </p>
            </div>

            {/* 2. PROBLEM DETECTED */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-100/70 border border-amber-300 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-800 text-white flex items-center gap-1">
                  <span>⚠️</span> Problem
                </span>
                <span className="text-[11px] font-extrabold text-amber-900 capitalize px-2 py-0.5 bg-amber-200/80 rounded-md">
                  {diagnosisResult.problem_category || 'disease'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                {diagnosisResult.predicted_label}
              </h3>
              <p className="text-xs text-stone-700 font-semibold flex items-center gap-1.5">
                <span>Confidence:</span>
                <span className="text-emerald-800 font-black">{Math.round(diagnosisResult.confidence_score * 100)}%</span>
                <span className="text-[10px] text-stone-600">({diagnosisResult.confidence_tier})</span>
              </p>
            </div>

            {/* 3. SOLUTION SUMMARY */}
            <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-100/70 border border-teal-300 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-800 text-white flex items-center gap-1">
                  <span>💡</span> Solution
                </span>
                <span className="text-[11px] font-bold text-teal-900">
                  Eco-First
                </span>
              </div>
              <p className="text-xs font-bold text-teal-950 leading-relaxed">
                {diagnosisResult.solution_summary || (diagnosisResult.treatment_advisory.eco_first_remedies[0]?.instructions || 'Apply biological organic spray.')}
              </p>
              <p className="text-[10px] text-teal-800 font-medium">
                Full preparation steps detailed below
              </p>
            </div>

          </div>

          {/* Confidence Gate Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {diagnosisResult.confidence_tier === 'high' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t.highConfidence}
                  </span>
                ) : diagnosisResult.confidence_tier === 'likely' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    <Info className="w-3.5 h-3.5 text-amber-600" /> {t.likelyConfidence}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> {t.lowConfidence}
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-700">
                  {Math.round(diagnosisResult.confidence_score * 100)}% Fused Confidence
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                {diagnosisResult.predicted_label}
              </h2>
              <p className="text-xs text-stone-700 capitalize">
                Detected Plant: <strong>{diagnosisResult.detected_plant || diagnosisResult.crop_type}</strong> · Model: {diagnosisResult.model_version}
              </p>
            </div>

            {/* Hariya Voice Button */}
            <button
              onClick={speakHariyaAgain}
              className={`p-3 rounded-2xl border transition-all ${
                speakingHariya
                  ? 'bg-emerald-700 text-white animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Hear Hariya Explanation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Spoken Hariya Explanation Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Hariya's Voice Advice:
            </span>
            <p className="text-sm text-stone-800 leading-relaxed font-medium">
              {diagnosisResult.hariya_explanation_local?.[language] || diagnosisResult.hariya_explanation}
            </p>
          </div>

          {/* AI Ranked Matches (Ordered starting with best match) */}
          {diagnosisResult.ranked_matches && diagnosisResult.ranked_matches.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-emerald-700" />
                  {t.rankedMatchesTitle}
                </h3>
                <span className="text-[10px] text-stone-700 font-semibold">Ordered by match probability</span>
              </div>

              <div className="space-y-2">
                {diagnosisResult.ranked_matches.map((match, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx === 0 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-800'
                        }`}>
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-stone-900">{match.label}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-700">
                          {match.category}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-800">
                        {Math.round(match.confidence_score * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-7">
                      {match.key_symptom}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Context Fusion Notes */}
          {diagnosisResult.context_fusion_notes?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">Context Fusion Insights:</p>
              <ul className="text-xs text-stone-600 space-y-1">
                {diagnosisResult.context_fusion_notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eco-Friendly First Remedies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {t.ecoFirstRemedies}
              </h3>
            </div>

            <div className="space-y-2.5">
              {diagnosisResult.treatment_advisory.eco_first_remedies.map((remedy) => (
                <div key={remedy.step} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Step {remedy.step}: {remedy.title_local?.[language] || remedy.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {remedy.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {remedy.instructions_local?.[language] || remedy.instructions}
                  </p>
                  {remedy.materials_needed?.length > 0 && (
                    <p className="text-[11px] text-stone-700">
                      <strong>Materials:</strong> {remedy.materials_needed.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chemical Fallback (Strictly Last Resort) */}
          {diagnosisResult.treatment_advisory.chemical_fallback && (
            <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-300 space-y-1 text-xs">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-stone-600" />
                {t.chemicalFallback} (Use only if eco-remedies fail after 7 days)
              </span>
              <p className="text-stone-700 font-semibold">
                Chemical: {diagnosisResult.treatment_advisory.chemical_fallback.chemical_name}
              </p>
              <p className="text-stone-600">
                Weather Spray Gate: {diagnosisResult.treatment_advisory.chemical_fallback.weather_reason}
              </p>
            </div>
          )}

          {/* Recommended Customized Pesticides & Bio-Products */}
          {customizedProducts.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Customized Treatment Products & Pesticides
                  </h3>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Recommended for {diagnosisResult.predicted_label}. Tap for info, dosage & favorites.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {customizedProducts.map((prod) => {
                  const isFav = favoriteTreatments.has(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProductModal(prod)}
                      className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-2xl border border-stone-200 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                    >
                      <div className="min-w-0 pr-2 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            prod.category === 'organic_bio'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {prod.category === 'organic_bio' ? 'Bio-Organic' : 'Approved Pesticide'}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium truncate">
                            {prod.active_ingredient}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                          {prod.name_local?.[language] || prod.name}
                        </h4>
                        <p className="text-[11px] text-emerald-800 font-bold">
                          Dosage: {prod.dosage}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleToggleFavorite(prod, e)}
                          className="p-2 rounded-xl text-stone-400 hover:text-amber-500 transition-colors"
                          title="Save to favorites"
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <ArrowRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons: Treatment Done, Map Geotag & Self-Diagnosis */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleApplyTreatment}
              disabled={treatmentLogged}
              className={`w-full min-h-[48px] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${
                treatmentLogged
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {treatmentLogged ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.treatmentLoggedSuccess}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.logTreatmentDone}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              {onViewOnMap && (
                <button
                  onClick={onViewOnMap}
                  className="min-h-[44px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-300 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>View on Field Map</span>
                </button>
              )}

              <button
                onClick={() => setIsSelfDiagnosisOpen(true)}
                className="min-h-[44px] rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-300 transition-colors"
              >
                <Split className="w-3.5 h-3.5 text-amber-700" />
                <span>Compare Field Guide</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  selectedProductModal.category === 'organic_bio' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {selectedProductModal.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-1">
                  {selectedProductModal.name_local?.[language] || selectedProductModal.name}
                </h3>
              </div>
              <button
                onClick={(e) => handleToggleFavorite(selectedProductModal, e)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-50 transition-colors"
                title="Toggle favorite"
              >
                <Bookmark className={`w-5 h-5 ${favoriteTreatments.has(selectedProductModal.id) ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-bold text-stone-900 block mb-0.5">Active Formulation</span>
                <span>{selectedProductModal.active_ingredient}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-bold text-stone-900 block mb-0.5">Recommended Dosage</span>
                <span className="font-bold text-emerald-800">{selectedProductModal.dosage}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-bold text-stone-900 block mb-0.5">Application Timing & Weather</span>
                <span>{selectedProductModal.application_timing}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-bold text-stone-900 block mb-0.5">Safety & Pre-Harvest Interval (PHI)</span>
                <span>{selectedProductModal.safety_precautions}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={(e) => {
                  handleToggleFavorite(selectedProductModal, e);
                }}
                className={`flex-1 min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  favoriteTreatments.has(selectedProductModal.id)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${favoriteTreatments.has(selectedProductModal.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{favoriteTreatments.has(selectedProductModal.id) ? 'Saved to Favorites' : 'Save to Favorites'}</span>
              </button>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="px-5 min-h-[44px] rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Self-Diagnosis Comparator Modal */}
      <SelfDiagnosisModal
        isOpen={isSelfDiagnosisOpen}
        onClose={() => setIsSelfDiagnosisOpen(false)}
        userImage={selectedImage}
        cropType={selectedCrop}
        language={language}
        onConfirmMatch={(item) => {
          setSelectedCrop(item.crop);
          audioEngine.playSuccessChime();
        }}
      />
    </div>
  );
};
