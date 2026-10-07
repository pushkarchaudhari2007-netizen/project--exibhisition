import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, Bug, Leaf, AlertOctagon, 
  Heart, Star, Info, ArrowRight, ShieldCheck, Bookmark, Check
} from 'lucide-react';
import { FieldGuideItem, LanguageCode, TreatmentProduct } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { audioEngine } from '../lib/audioService.ts';

interface FieldGuideViewProps {
  language: LanguageCode;
  onOpenSelfDiagnosis?: (item: FieldGuideItem) => void;
}

export const FieldGuideView: React.FC<FieldGuideViewProps> = ({
  language,
  onOpenSelfDiagnosis
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [items, setItems] = useState<FieldGuideItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'disease' | 'pest' | 'weed'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<FieldGuideItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TreatmentProduct | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(['prod-neem-nske']));
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [allProducts, setAllProducts] = useState<TreatmentProduct[]>([]);

  useEffect(() => {
    fetch('/api/field-guide')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(console.error);

    fetch('/api/treatment-products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          const favs = new Set(data.filter((p: TreatmentProduct) => p.is_favorite).map((p: TreatmentProduct) => p.id));
          setFavoriteIds(favs);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleFavorite = async (product: TreatmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id })
      });
      const data = await res.json();
      setFavoriteIds(prev => {
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

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedCrop !== 'all' && item.crop.toLowerCase() !== selectedCrop.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q) || item.scientific_name.toLowerCase().includes(q);
      const matchSymptom = item.symptoms.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchSymptom) return false;
    }
    return true;
  });

  const favoriteProducts = allProducts.filter(p => favoriteIds.has(p.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{t.fieldGuideTitle}</h1>
          <p className="text-xs text-stone-700 font-medium mt-0.5">
            Identify diseases, insect pests & weeds with expert visual cues
          </p>
        </div>

        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-2xs ${
            showFavoritesOnly
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-600 text-amber-600' : 'text-stone-500'}`} />
          <span>{t.savedFavorites} ({favoriteIds.size})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by pest, disease, weed or symptom..."
          className="w-full h-12 pl-10 pr-4 text-xs bg-white border border-stone-200 rounded-2xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-2xl">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All (7)
        </button>
        <button
          onClick={() => setSelectedCategory('disease')}
          className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'disease' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Diseases
        </button>
        <button
          onClick={() => setSelectedCategory('pest')}
          className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'pest' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Insect Pests
        </button>
        <button
          onClick={() => setSelectedCategory('weed')}
          className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'weed' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Weeds
        </button>
      </div>

      {/* Crop Pills Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'cotton', 'tomato', 'rice', 'wheat'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
              selectedCrop === crop
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {crop === 'all' ? 'All Crops' : crop}
          </button>
        ))}
      </div>

      {/* Favorites Drawer View */}
      {showFavoritesOnly ? (
        <div className="space-y-3 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              {t.savedFavorites} ({favoriteProducts.length})
            </h3>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="text-xs text-emerald-800 font-bold hover:underline"
            >
              Back to Catalog
            </button>
          </div>

          {favoriteProducts.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">
              No saved favorites yet. Tap the bookmark icon on any recommended product to save it here for quick reference!
            </p>
          ) : (
            <div className="space-y-3">
              {favoriteProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {prod.name_local?.[language] || prod.name}
                      </h4>
                      <p className="text-[11px] text-stone-700 font-medium">
                        Active: {prod.active_ingredient}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(prod, e)}
                      className="p-1 text-amber-500"
                    >
                      <Bookmark className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    Dosage: {prod.dosage}
                  </p>
                  <p className="text-[10px] text-stone-700">
                    Timing: {prod.application_timing}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Field Guide Cards Grid */
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-3xl p-4 border border-stone-200 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex gap-3.5 items-start"
            >
              {/* Visual SVG Thumbnail */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200 flex items-center justify-center">
                <img
                  src={item.visual_guide_image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    item.category === 'disease'
                      ? 'bg-red-100 text-red-800'
                      : item.category === 'pest'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-stone-700 font-semibold capitalize">
                    {item.crop}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-stone-900 truncate">
                  {item.name_local?.[language] || item.name}
                </h3>
                <p className="text-[11px] text-stone-700 italic">
                  {item.scientific_name}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {item.symptoms[0]}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0 self-center" />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal for Selected Guide Item */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-5 bg-stone-900 text-white flex items-start justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {selectedItem.category} · {selectedItem.crop}
                </span>
                <h2 className="text-lg font-bold mt-0.5">
                  {selectedItem.name_local?.[language] || selectedItem.name}
                </h2>
                <p className="text-xs text-stone-400 italic">
                  {selectedItem.scientific_name}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-white p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Reference Visual */}
              <div className="w-full aspect-16/9 rounded-2xl bg-stone-900 overflow-hidden border border-stone-200">
                <img
                  src={selectedItem.visual_guide_image}
                  alt={selectedItem.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Distinguishing Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Key Damage Symptoms
                </h4>
                <ul className="text-xs text-stone-700 space-y-1">
                  {selectedItem.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Self-Diagnosis Tip */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Self-Diagnosis Comparison Tip:
                </span>
                <p className="leading-relaxed text-amber-900">
                  {selectedItem.comparison_tip}
                </p>
              </div>

              {/* Recommended Treatments with Save to Favorites */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Recommended Treatments & Dosage
                </h4>
                {selectedItem.recommended_products.map((prod) => {
                  const isFav = favoriteIds.has(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          {prod.name_local?.[language] || prod.name}
                        </span>
                        <button
                          onClick={(e) => handleToggleFavorite(prod, e)}
                          className="p-1 text-stone-400 hover:text-amber-500"
                          title="Save to Favorites"
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-bold">
                        Dosage: {prod.dosage}
                      </p>
                      <p className="text-[10px] text-stone-700 line-clamp-1">
                        Timing: {prod.application_timing}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (onOpenSelfDiagnosis) onOpenSelfDiagnosis(selectedItem);
                  setSelectedItem(null);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>{t.selfDiagnosisTitle}</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="min-h-[44px] px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {selectedProduct.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  {selectedProduct.name_local?.[language] || selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={(e) => handleToggleFavorite(selectedProduct, e)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-50"
              >
                <Bookmark className={`w-5 h-5 ${favoriteIds.has(selectedProduct.id) ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block">Active Formulation</span>
                <span>{selectedProduct.active_ingredient}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block">Recommended Dosage</span>
                <span className="font-bold text-emerald-800">{selectedProduct.dosage}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block">Application Timing</span>
                <span>{selectedProduct.application_timing}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block">Safety & Pre-Harvest Interval (PHI)</span>
                <span>{selectedProduct.safety_precautions}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full min-h-[44px] rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
