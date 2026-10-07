import React, { useState, useEffect } from 'react';
import { 
  MapPin, Layers, RefreshCw, CheckCircle2, Clock, 
  Leaf, AlertCircle, Database, Smartphone, ArrowRight
} from 'lucide-react';
import { Diagnosis, Farm, Farmer, LanguageCode, SyncPayloadItem } from '../../shared/types.ts';
import { syncManager } from '../lib/syncManager.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

interface MyFarmViewProps {
  language: LanguageCode;
  farm: Farm;
  farmer: Farmer;
  diagnoses: Diagnosis[];
  onSelectDiagnosis?: (d: Diagnosis) => void;
  onViewOnMap?: () => void;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({
  language,
  farm,
  farmer,
  diagnoses,
  onSelectDiagnosis,
  onViewOnMap
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [queueItems, setQueueItems] = useState<SyncPayloadItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setQueueItems(syncManager.getQueue());
    const unsub = syncManager.subscribe((_online, _count) => {
      setQueueItems(syncManager.getQueue());
    });
    return unsub;
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    const res = await syncManager.flushQueue();
    setIsSyncing(false);
    setSyncStatusMsg(`Successfully flushed: ${res.synced} items synced, ${res.remaining} pending.`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.navFarm}</h1>
        <p className="text-xs text-stone-700 font-medium mt-0.5">
          Farm parcel management, soil profile & diagnosis log
        </p>
      </div>

      {/* Farm Parcel Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              {farmer.name}'s Parcel #1
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Khadakwasla (18.432°N, 73.765°E)</span>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
            {farm.acreage} Acres
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-stone-700 block text-[11px] font-bold">Crops in Rotation</span>
            <span className="font-bold text-stone-900 capitalize text-sm">
              {farm.crop_types.join(', ')}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-stone-700 block text-[11px] font-bold">Soil Profile</span>
            <span className="font-bold text-stone-900 text-sm">
              {farm.soil_type || 'Medium Black Loam'}
            </span>
          </div>
        </div>

        {onViewOnMap && (
          <button
            onClick={onViewOnMap}
            className="w-full min-h-[44px] rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>{t.navFieldMap} — View Geotagged Scans</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        )}
      </div>

      {/* Offline Sync Queue Inspector */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">Offline Sync Inspector</h3>
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            queueItems.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {queueItems.length} {t.pendingSync}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Guarantees zero data loss in 2G/offline zones. Records are committed locally with idempotency keys and safely uploaded upon reconnect.
        </p>

        {queueItems.length > 0 ? (
          <div className="space-y-2">
            {queueItems.map((item) => (
              <div key={item.idempotency_key} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 uppercase">{item.entity_type}</span>
                  <span className="text-[10px] text-amber-800/80 block font-mono">{item.idempotency_key}</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Awaiting Sync
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>All local diagnostic scans and treatment logs are synchronized.</span>
          </div>
        )}

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="min-h-[44px] w-full rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 border border-stone-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {t.syncNow}
        </button>

        {syncStatusMsg && (
          <p className="text-xs font-semibold text-emerald-800 text-center">{syncStatusMsg}</p>
        )}
      </div>

      {/* Past Diagnoses History */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Past Crop Diagnoses ({diagnoses.length})
          </h3>
          <span className="text-xs text-stone-700 font-medium">Recent First</span>
        </div>

        {diagnoses.length === 0 ? (
          <div className="text-center p-6 text-stone-400 text-xs">
            No diagnosis records yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {diagnoses.map((diag) => (
              <div
                key={diag.diagnosis_id}
                onClick={() => onSelectDiagnosis && onSelectDiagnosis(diag)}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      {diag.predicted_label}
                    </h4>
                    <p className="text-[11px] text-stone-700">
                      Crop: <strong className="capitalize">{diag.crop_type}</strong> · {Math.round(diag.confidence_score * 100)}% Conf.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    diag.sync_status === 'synced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {diag.sync_status === 'synced' ? 'Synced' : 'Local Only'}
                  </span>
                  <span className="text-[10px] text-stone-700 block mt-1">
                    {new Date(diag.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
