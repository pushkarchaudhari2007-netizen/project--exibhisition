import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, AlertTriangle, CheckCircle2, Send, 
  ShieldCheck, ShieldAlert, Radio, Search, Filter, MessageSquare
} from 'lucide-react';
import { Diagnosis, ExtensionWorker, Village } from '../../shared/types.ts';
import { audioEngine } from '../lib/audioService.ts';

interface ExtensionWorkerPortalProps {
  onBackToFarmer: () => void;
}

export const ExtensionWorkerPortal: React.FC<ExtensionWorkerPortalProps> = ({
  onBackToFarmer
}) => {
  const [worker, setWorker] = useState<ExtensionWorker | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Diagnosis[]>([]);
  const [selectedReview, setSelectedReview] = useState<Diagnosis | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [correctedDisease, setCorrectedDisease] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Broadcast advisory form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    // Fetch worker & pending reviews
    fetch('/api/extension-workers/reviews?worker_id=ext-sunita')
      .then(res => res.json())
      .then(data => {
        if (data.worker) setWorker(data.worker);
        if (Array.isArray(data.reviews)) {
          setPendingReviews(data.reviews);
          if (data.reviews.length > 0) setSelectedReview(data.reviews[0]);
        }
      })
      .catch(console.error);

    fetch('/api/leaderboards/village')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVillages(data);
      })
      .catch(console.error);
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedReview) return;
    try {
      const res = await fetch(`/api/extension-workers/reviews/${selectedReview.diagnosis_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: reviewNotes || 'Verified as Early Blight with mild chlorosis. Recommended Dashaparni Ark.',
          corrected_label: correctedDisease || undefined
        })
      });

      if (res.ok) {
        setReviewSuccess(true);
        audioEngine.playSuccessChime();
        setPendingReviews(prev => prev.filter(r => r.diagnosis_id !== selectedReview.diagnosis_id));
        setTimeout(() => {
          setReviewSuccess(false);
          setSelectedReview(pendingReviews[1] || null);
          setReviewNotes('');
        }, 1500);
      }
    } catch (err) {
      console.error('Review submit failed:', err);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastTitle || !broadcastMsg) return;
    try {
      const res = await fetch('/api/extension-workers/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village_ids: ['vil-ralegan', 'vil-hiware', 'vil-khadakwasla'],
          title: broadcastTitle,
          message: broadcastMsg
        })
      });

      if (res.ok) {
        setBroadcastSent(true);
        audioEngine.playSuccessChime();
        setTimeout(() => {
          setBroadcastSent(false);
          setBroadcastTitle('');
          setBroadcastMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error('Broadcast failed:', err);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-emerald-950 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
              Krishi Vigyan Kendra (KVK) Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              {worker?.name || 'Sunita Deshmukh'}
            </h1>
            <p className="text-xs text-emerald-200 mt-0.5">
              {worker?.org_affiliation || 'Field Agronomist & Extension Officer'}
            </p>
          </div>

          <button
            onClick={onBackToFarmer}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            ← Switch to Farmer App
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-xl font-black text-amber-300">{pendingReviews.length}</span>
            <span className="text-[10px] text-emerald-200 block">Pending Reviews</span>
          </div>
          <div>
            <span className="text-xl font-black text-emerald-300">4</span>
            <span className="text-[10px] text-emerald-200 block">Assigned Villages</span>
          </div>
          <div>
            <span className="text-xl font-black text-blue-300">140+</span>
            <span className="text-[10px] text-emerald-200 block">Farmers Covered</span>
          </div>
        </div>
      </div>

      {/* Outlier & Risk Alerts */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Regional Agro-Climate Outlier Alerts</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900">
          • <strong>Humidity Window Warning:</strong> Relative humidity has crossed 75% in Khadakwasla & Hiware Bazar. Elevated risk of Cercospora and Alternaria early leaf spots.
          <br />
          • <strong>Heat Stress Advisory:</strong> 6 farmers logged high heat exhaustion check-ins yesterday between 1 PM - 3 PM.
        </p>
      </div>

      {/* Review Queue for Low Confidence Diagnoses (<60%) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Low-Confidence Diagnosis Review Queue ({pendingReviews.length})
            </h2>
          </div>
          <span className="text-xs text-stone-700 font-medium">Confidence &lt; 60%</span>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-6 bg-stone-50 rounded-2xl text-center text-xs text-stone-500">
            No unverified diagnoses awaiting review. All clear!
          </div>
        ) : (
          <div className="space-y-4">
            {/* Review Cards list */}
            <div className="grid grid-cols-1 gap-2">
              {pendingReviews.map((item) => (
                <div
                  key={item.diagnosis_id}
                  onClick={() => setSelectedReview(item)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedReview?.diagnosis_id === item.diagnosis_id
                      ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">{item.predicted_label}</span>
                      <p className="text-[11px] text-stone-700">
                        Crop: <strong className="capitalize">{item.crop_type}</strong> · Farmer: Ramesh Patil (Khadakwasla)
                      </p>
                      <p className="text-[10px] text-stone-700 mt-1">
                        Flagged reason: Low visual confidence ({Math.round(item.confidence_score * 100)}%)
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      {Math.round(item.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Review Verification Form */}
            {selectedReview && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold text-stone-900 uppercase">
                  Verify & Provide Expert Correction
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Corrected Disease Label (Optional override)
                  </label>
                  <input
                    type="text"
                    value={correctedDisease}
                    onChange={(e) => setCorrectedDisease(e.target.value)}
                    placeholder="e.g. Early Blight (Alternaria solani)"
                    className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Extension Officer Notes for Farmer
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide actionable guidance: e.g., Confirmed early leaf spots. Apply NSKE 5% spray at sunrise."
                    className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSuccess}
                  className="w-full min-h-[44px] rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {reviewSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Verified & Dispatched to Farmer</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Official Agronomic Verification</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Broadcast Advisory Tool */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Village Broadcast Advisory
          </h2>
        </div>
        <p className="text-xs text-stone-600">
          Push real-time voice bulletins and push notices across assigned villages.
        </p>

        <div className="space-y-2.5">
          <input
            type="text"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            placeholder="Advisory Title (e.g. Rain-Break Spray Alert)"
            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
          />

          <textarea
            rows={2}
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            placeholder="Spoken advisory message for farmers..."
            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
          />

          <button
            onClick={handleSendBroadcast}
            disabled={broadcastSent || !broadcastTitle || !broadcastMsg}
            className="w-full min-h-[44px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            {broadcastSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast Delivered to Villages</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Broadcast to 4 Villages</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
