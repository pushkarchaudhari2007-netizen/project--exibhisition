/**
 * Field Guide Knowledge & Outbreak Forecasting Service
 * Comprehensive catalog of Crop Diseases, Insect Pests, and Weeds
 * Customized Treatment Products with Dosage & Application Guidelines
 * Real-Time Outbreak Forecasts (Rice Blast, Cotton Bollworm, etc.)
 */

import { FieldGuideItem, TreatmentProduct, OutbreakForecast } from '../../shared/types.js';

export const TREATMENT_PRODUCTS_CATALOG: TreatmentProduct[] = [
  {
    id: 'prod-neem-nske',
    name: 'Neem Seed Kernel Extract 5% (NSKE)',
    name_local: {
      hi: 'नीम के बीज का अर्क (NSKE 5%)',
      mr: 'निंबोळी अर्क (NSKE ५%)'
    },
    category: 'organic_bio',
    active_ingredient: 'Azadirachtin 1500 PPM',
    dosage: '50g crushed seed kernel / 1L water or 3-5ml concentrate / 1L water',
    application_timing: 'Early morning (6-8 AM) or late afternoon. Spray thoroughly on leaf undersides.',
    safety_precautions: 'Eco-friendly, zero withholding period (PHI 0 days). Safe for honeybees when sprayed early morning.',
    target_pests: ['Early Leaf Spot', 'Whitefly', 'Aphids', 'Spotted Bollworm', 'Thrips'],
    eco_rating: 'high',
    ic_icon: 'leaf'
  },
  {
    id: 'prod-tricho-viride',
    name: 'Trichoderma viride Bio-Fungicide (1% WP)',
    name_local: {
      hi: 'ट्राइकोडर्मा विरिडी जैव-फफूंदनाशी',
      mr: 'ट्रायकोडर्मा विरिडी जैविक बुरशीनाशक'
    },
    category: 'organic_bio',
    active_ingredient: 'Trichoderma viride (min 2 x 10^6 CFU/g)',
    dosage: '10g / 1L water for foliar spray or 2.5 kg / 100 kg compost for soil treatment',
    application_timing: 'Apply in moist soil or during cloudy weather. Keep root zone aerated.',
    safety_precautions: 'Do not mix with chemical fungicides within 7 days. Store culture below 30°C.',
    target_pests: ['Root Rot', 'Collar Rot', 'Early Blight', 'Fusarium Wilt', 'Rice Blast'],
    eco_rating: 'high',
    ic_icon: 'shield-check'
  },
  {
    id: 'prod-dashaparni',
    name: 'Dashaparni Ark (10-Leaf Fermented Botanical)',
    name_local: {
      hi: 'दशपर्णी अर्क (प्राकृतिक काढ़ा)',
      mr: 'दशपर्णी अर्क (१० वनस्पतींचे मिश्रण)'
    },
    category: 'organic_bio',
    active_ingredient: 'Alkaloids from Neem, Karanj, Calotropis, Castor, Custard Apple, Papaya leaves',
    dosage: '200ml / 10L water (2% concentration)',
    application_timing: 'Spray at 15-day intervals during vegetative and flowering phases.',
    safety_precautions: '100% natural, builds systemic plant immunity. Use within 6 months of fermentation.',
    target_pests: ['Bollworm', 'Stem Borer', 'Alternaria Blight', 'Caterpillars'],
    eco_rating: 'high',
    ic_icon: 'sparkles'
  },
  {
    id: 'prod-beauveria',
    name: 'Beauveria bassiana Bio-Insecticide',
    name_local: {
      hi: 'ब्युवेरिया बासियाना जैव कीटनाशक',
      mr: 'बिव्हेरिया बॅसियाना जैविक कीटकनाशक'
    },
    category: 'organic_bio',
    active_ingredient: 'Beauveria bassiana spores (1 x 10^8 CFU/g)',
    dosage: '5g / 1L water with 1ml mild soap as sticker',
    application_timing: 'High humidity (>70%) evening application for maximum fungal spore germination on pest cuticles.',
    safety_precautions: 'Completely non-toxic to mammals and birds. Avoid tank mixing with chemical fungicides.',
    target_pests: ['Pink Bollworm', 'Leaf Miner', 'Mealybug', 'Whitefly'],
    eco_rating: 'high',
    ic_icon: 'bug'
  },
  {
    id: 'prod-tricyclazole',
    name: 'Tricyclazole 75% WP (Beam)',
    name_local: {
      hi: 'ट्राइसाइक्लाजोल 75% WP (ब्लास्ट रोधी)',
      mr: 'ट्रायसायक्लाझोल ७५% WP'
    },
    category: 'chemical_approved',
    active_ingredient: 'Tricyclazole 75% WP',
    dosage: '0.6g / 1L water (120g / 200L water per acre)',
    application_timing: 'Apply proactively at tillering and again before panicle emergence if leaf blast spots exceed 10%.',
    safety_precautions: 'Protective goggles, mask, rubber gloves required. 30-day pre-harvest waiting interval (PHI). Avoid water runoff.',
    target_pests: ['Rice Blast (Leaf & Neck Blast)'],
    eco_rating: 'caution',
    ic_icon: 'flask-conical'
  },
  {
    id: 'prod-copper-oxy',
    name: 'Copper Oxychloride 50% WP (Blitox)',
    name_local: {
      hi: 'कॉपर ऑक्सीक्लोराइड 50% WP',
      mr: 'कॉपर ऑक्सिक्लोराईड ५०% WP'
    },
    category: 'chemical_approved',
    active_ingredient: 'Copper Oxychloride 50% WP',
    dosage: '2.5g - 3g / 1L water',
    application_timing: 'Morning spray. Postpone if rain is forecast within 48 hours to prevent chemical runoff.',
    safety_precautions: 'Do not spray during high mid-day heat (>35°C) to avoid phytotoxicity.',
    target_pests: ['Early Blight', 'Bacterial Leaf Blight', 'Anthracnose', 'Cercospora'],
    eco_rating: 'medium',
    ic_icon: 'shield-alert'
  },
  {
    id: 'prod-pendimethalin',
    name: 'Pendimethalin 30% EC (Pre-Emergence Herbicide)',
    name_local: {
      hi: 'पेंडीमेथालिन 30% EC (खरपतवार नाशक)',
      mr: 'पेंडीमेथालिन ३०% EC (तणनाशक)'
    },
    category: 'chemical_approved',
    active_ingredient: 'Pendimethalin 30% EC',
    dosage: '1.0 - 1.25 L / 200L water per acre',
    application_timing: 'Apply within 48 hours of sowing on moist soil before weed germination.',
    safety_precautions: 'Requires uniform spray with flat fan nozzle. Do not apply on dry or cracked soil.',
    target_pests: ['Echinochloa (Barnyard Grass)', 'Cyperus (Nut Grass)', 'Broadleaf weeds'],
    eco_rating: 'caution',
    ic_icon: 'scissors'
  }
];

export const FIELD_GUIDE_CATALOG: FieldGuideItem[] = [
  // 1. Diseases
  {
    id: 'guide-rice-blast',
    name: 'Rice Blast (Magnaporthe oryzae)',
    name_local: {
      hi: 'धान का झोंका रोग (ब्लास्ट)',
      mr: 'भातावरील करपा / ब्लास्ट रोग'
    },
    scientific_name: 'Magnaporthe oryzae',
    category: 'disease',
    crop: 'rice',
    symptoms: [
      'Spindle-shaped elliptical lesions with ash-gray centers and brownish-red borders',
      'Rotting of the panicle neck (Neck Blast) causing empty whitish upright grain heads',
      'Brown lesions at leaf collars causing collar rot and leaf death'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%2314532d"/><polygon points="80,80 120,40 160,80 120,120" fill="%23cbd5e1" stroke="%2378350f" stroke-width="4"/><line x1="20" y1="80" x2="220" y2="80" stroke="%23166534" stroke-width="3"/></svg>',
    comparison_tip: 'Unlike Brown Spot (which has small circular brown spots), Blast lesions have diamond or spindle shapes with distinctive grey centers.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[1], // Trichoderma
      TREATMENT_PRODUCTS_CATALOG[4]  // Tricyclazole
    ]
  },
  {
    id: 'guide-cotton-cercospora',
    name: 'Early Leaf Spot (Cercospora)',
    name_local: {
      hi: 'कपास का पत्ती धब्बा रोग',
      mr: 'कापूस पानावरील ठिपके रोग'
    },
    scientific_name: 'Cercospora gossypina',
    category: 'disease',
    crop: 'cotton',
    symptoms: [
      'Small reddish-purple dots that enlarge into circular spots with concentric rings',
      'Shot-hole appearance when brittle dead centers drop out',
      'Premature leaf shedding from lower to middle branches'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231e3a1e"/><circle cx="80" cy="70" r="22" fill="%238d2d1e" stroke="%235c1d13" stroke-width="3"/><circle cx="160" cy="90" r="28" fill="%238d2d1e" stroke="%235c1d13" stroke-width="3"/></svg>',
    comparison_tip: 'Distinct from Bacterial Blight which has angular water-soaked spots bounded strictly by leaf veinlets.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[1], // Trichoderma
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  },
  {
    id: 'guide-tomato-early-blight',
    name: 'Tomato Early Blight',
    name_local: {
      hi: 'टमाटर का अगेती झुलसा',
      mr: 'टोमॅटोचा करपा रोग'
    },
    scientific_name: 'Alternaria solani',
    category: 'disease',
    crop: 'tomato',
    symptoms: [
      'Target-like concentric brown rings on older lower leaves',
      'Yellow chlorotic halos surrounding lesions',
      'Collar rot and sunken black lesions on stem and fruit shoulders'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23164e63"/><circle cx="120" cy="80" r="32" fill="%23573a27" stroke="%23facc15" stroke-width="5"/><circle cx="120" cy="80" r="18" fill="%233a2517"/><circle cx="120" cy="80" r="8" fill="%231c120a"/></svg>',
    comparison_tip: 'Check for concentric "bullseye" rings; Late Blight instead produces rapid water-soaked translucent grey rotting without rings.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[2], // Dashaparni Ark
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  },

  // 2. Insect Pests
  {
    id: 'guide-cotton-pink-bollworm',
    name: 'Pink Bollworm (Pectinophora)',
    name_local: {
      hi: 'कपास की गुलाबी सुंडी',
      mr: 'कापूस गुलाबी बोंडअळी'
    },
    scientific_name: 'Pectinophora gossypiella',
    category: 'pest',
    crop: 'cotton',
    symptoms: [
      'Rosetted flowers (petals twisted into rosette and fail to open)',
      'Entry holes sealed with larval excreta inside green bolls',
      'Premature boll dropping and stained interior lint fiber'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23334155"/><circle cx="120" cy="80" r="45" fill="%234ade80"/><path d="M100 70 C110 55 130 75 140 90" stroke="%23ec4899" stroke-width="8" stroke-linecap="round"/></svg>',
    comparison_tip: 'American bollworm feeds openly with head inside boll, whereas Pink Bollworm enters young bolls and stays inside sealed frass.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[3], // Beauveria bassiana
      TREATMENT_PRODUCTS_CATALOG[2]  // Dashaparni Ark
    ]
  },
  {
    id: 'guide-whitefly',
    name: 'Cotton & Tomato Whitefly',
    name_local: {
      hi: 'सफेद मक्खी',
      mr: 'पांढरी माशी'
    },
    scientific_name: 'Bemisia tabaci',
    category: 'pest',
    crop: 'cotton',
    symptoms: [
      'Tiny moth-like white insects fluttering on lower leaf surfaces',
      'Black sooty mold covering honeydew-coated leaves',
      'Transmits Cotton Leaf Curl Virus (CLCuV) and Tomato Yellow Leaf Curl'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23064e3b"/><circle cx="120" cy="80" r="14" fill="%23fef08a"/><ellipse cx="110" cy="75" rx="14" ry="8" fill="%23ffffff"/><ellipse cx="130" cy="75" rx="14" ry="8" fill="%23ffffff"/></svg>',
    comparison_tip: 'Shaking the plant produces a cloud of tiny white flying gnats.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[3]  // Beauveria
    ]
  },

  // 3. Weeds
  {
    id: 'guide-parthenium-weed',
    name: 'Parthenium Weed (Gajar Ghas)',
    name_local: {
      hi: 'गाजर घास (कांग्रेस घास)',
      mr: 'गाजर गवत'
    },
    scientific_name: 'Parthenium hysterophorus',
    category: 'weed',
    crop: 'cotton',
    symptoms: [
      'Aggressive branched annual herb with pale green grooved stems and carrot-like leaves',
      'Small white floral heads producing thousands of allergenic seeds',
      'Suppresses crop seedling germination through allelopathic root exudates'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231c1917"/><path d="M120 140 L120 40 L90 70 M120 80 L150 50 M120 110 L80 90" stroke="%234ade80" stroke-width="4"/><circle cx="120" cy="35" r="8" fill="%23ffffff"/><circle cx="90" cy="65" r="7" fill="%23ffffff"/><circle cx="150" cy="45" r="7" fill="%23ffffff"/></svg>',
    comparison_tip: 'Leaves closely resemble young carrot foliage with tiny star-shaped white flowers.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[6] // Pendimethalin
    ]
  },
  {
    id: 'guide-cyperus-weed',
    name: 'Purple Nutsedge / Motha (Cyperus rotundus)',
    name_local: {
      hi: 'मोथा घास (डिला)',
      mr: 'लव्हाळा (मोथा)'
    },
    scientific_name: 'Cyperus rotundus',
    category: 'weed',
    crop: 'rice',
    symptoms: [
      'Triangular stems with dark glossy green narrow blades',
      'Extensive underground tuberous rhizome chain that robs moisture and nitrogen',
      'Stunts young paddy and wheat tillering'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%230f172a"/><path d="M120 140 L110 30 M120 140 L140 40 M120 140 L80 60 M120 140 L160 70" stroke="%2384cc16" stroke-width="4"/><circle cx="120" cy="145" r="10" fill="%2378350f"/></svg>',
    comparison_tip: 'Triangular stem profile when rolled between fingers, and dark nut-like subterranean tubers.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[6] // Pendimethalin
    ]
  },
  {
    id: 'guide-sugarcane-red-rot',
    name: 'Sugarcane Red Rot (Colletotrichum falcatum)',
    name_local: {
      hi: 'गन्ने का लाल सड़न रोग',
      mr: 'उसावरील तांब्या / लाल कुज रोग'
    },
    scientific_name: 'Colletotrichum falcatum',
    category: 'disease',
    crop: 'sugarcane',
    symptoms: [
      'Discoloration and drying of the third or fourth leaf from the top whorl',
      'Diagnostic internal reddening of pith with white horizontal transverse patches',
      'Alcoholic or acidic sour smell from split canes'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231e293b"/><rect x="105" y="10" width="30" height="140" fill="%23991b1b"/><rect x="105" y="50" width="30" height="15" fill="%23ffffff"/><rect x="105" y="95" width="30" height="15" fill="%23ffffff"/></svg>',
    comparison_tip: 'Split the cane lengthwise; distinctive white bands across red pith confirm Red Rot over Wilt.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[1] // Trichoderma viride
    ]
  },
  {
    id: 'guide-soybean-rust',
    name: 'Asian Soybean Rust (Phakopsora pachyrhizi)',
    name_local: {
      hi: 'सोयाबीन का एशियाई गेरुई (रस्ट) रोग',
      mr: 'सोयाबीनवरील तांबेरा रोग'
    },
    scientific_name: 'Phakopsora pachyrhizi',
    category: 'disease',
    crop: 'soybean',
    symptoms: [
      'Tiny tan-to-brown polygonal lesions starting on lower canopy leaves',
      'Volcano-shaped raised pustules (uredinia) on leaf undersides releasing spores',
      'Premature leaf yellowing, browning, and defoliation during pod filling'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231c1917"/><circle cx="80" cy="80" r="14" fill="%23a16207"/><circle cx="120" cy="60" r="16" fill="%23a16207"/><circle cx="160" cy="100" r="18" fill="%23a16207"/></svg>',
    comparison_tip: 'Use a 10x hand lens: raised spore cones on undersides distinguish Rust from Bacterial Pustule.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[1]  // Trichoderma
    ]
  },
  {
    id: 'guide-onion-purple-blotch',
    name: 'Onion Purple Blotch (Alternaria porri)',
    name_local: {
      hi: 'प्याज का बैंगनी धब्बा रोग',
      mr: 'कांद्यावरील जांभळा करपा रोग'
    },
    scientific_name: 'Alternaria porri',
    category: 'disease',
    crop: 'onion',
    symptoms: [
      'Water-soaked lesions on leaves turning deep purple or reddish-brown',
      'Concentric zones bounded by broad chlorotic yellow halos',
      'Leaves break over at lesion site and dry down from the tips'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%230f172a"/><ellipse cx="120" cy="80" rx="35" ry="18" fill="%23581c87" stroke="%23facc15" stroke-width="3"/></svg>',
    comparison_tip: 'Deep violet/purple center with yellow edge distinguishes Purple Blotch from Stemphylium blight.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[2], // Dashaparni Ark
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  },
  {
    id: 'guide-potato-late-blight',
    name: 'Potato Late Blight (Phytophthora infestans)',
    name_local: {
      hi: 'आलू का पछेती झुलसा',
      mr: 'बटाट्याचा उशिरा येणारा करपा'
    },
    scientific_name: 'Phytophthora infestans',
    category: 'disease',
    crop: 'potato',
    symptoms: [
      'Rapidly enlarging irregular water-soaked dark lesions on leaf tips and margins',
      'Delicate white fungal downy mildew growth on underside margins in humid mornings',
      'Tuber rot showing granular brown discoloration under skin'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231e1b4b"/><path d="M70 40 Q120 70 170 40 Q190 120 120 130 Q50 120 70 40 Z" fill="%231c1917" stroke="%23e2e8f0" stroke-width="4"/></svg>',
    comparison_tip: 'Rapid collapse and white downy ring beneath leaves in damp morning air differentiate Late Blight from Early Blight target rings.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[1], // Trichoderma
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  },
  {
    id: 'guide-maize-fall-armyworm',
    name: 'Fall Armyworm (Spodoptera frugiperda)',
    name_local: {
      hi: 'मक्के का फाल आर्मीवर्म कीट',
      mr: 'मक्यावरील लष्करी अळी'
    },
    scientific_name: 'Spodoptera frugiperda',
    category: 'pest',
    crop: 'maize',
    symptoms: [
      'Large ragged holes and windowpane leaf feeding in central whorl',
      'Heavy accumulation of moist sawdust-like larval fecal frass',
      'Caterpillar has distinctive inverted "Y" suture on head capsule and 4 square dots on tail'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23172554"/><path d="M60 80 Q120 40 180 80 Q140 120 60 80 Z" fill="%23713f12"/><circle cx="160" cy="70" r="10" fill="%23ca8a04"/></svg>',
    comparison_tip: 'Inverted yellow "Y" mark on face and four raised spots forming a square on 8th abdominal segment.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[3], // Beauveria bassiana
      TREATMENT_PRODUCTS_CATALOG[2]  // Dashaparni Ark
    ]
  },
  {
    id: 'guide-chili-anthracnose',
    name: 'Chili Anthracnose & Fruit Rot',
    name_local: {
      hi: 'मिर्च का फल सड़न व एंथ्रेक्नोज',
      mr: 'मिरचीवरील फळकुज व करपा'
    },
    scientific_name: 'Colletotrichum capsici',
    category: 'disease',
    crop: 'chili',
    symptoms: [
      'Sunken circular spots on ripening pods with black concentric rings',
      'Straw-colored tip dieback on branches',
      'Premature dropping of green flowers and fruit'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23262626"/><ellipse cx="120" cy="80" rx="40" ry="22" fill="%237f1d1d" stroke="%23ea580c" stroke-width="3"/></svg>',
    comparison_tip: 'Circular sunken lesions with black spore dots arranged in concentric rings on red pods.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  },
  {
    id: 'guide-banana-sigatoka',
    name: 'Banana Black Sigatoka',
    name_local: {
      hi: 'केले का सिगाटोका रोग',
      mr: 'केळीवरील सिगाटोका करपा'
    },
    scientific_name: 'Mycosphaerella fijiensis',
    category: 'disease',
    crop: 'banana',
    symptoms: [
      'Linear reddish-brown streaks parallel to lateral veins',
      'Streaks merge into large necrotic patches with gray centers',
      'Accelerates premature ripening of fruit bunches on the plant'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%23052e16"/><rect x="40" y="70" width="70" height="12" rx="4" fill="%237f1d1d"/><rect x="130" y="90" width="80" height="14" rx="4" fill="%237f1d1d"/></svg>',
    comparison_tip: 'Streaks run parallel to lateral veins and dry out photosynthetic canopy rapidly.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[0], // Neem NSKE
      TREATMENT_PRODUCTS_CATALOG[1]  // Trichoderma
    ]
  },
  {
    id: 'guide-grape-downy',
    name: 'Grape Downy Mildew (Plasmopara viticola)',
    name_local: {
      hi: 'अंगूर का डाउनी मिल्ड्यू (मृदुरोमिल फफूंद)',
      mr: 'द्राक्षावरील डाऊनी मिल्ड्यू (केवडा)'
    },
    scientific_name: 'Plasmopara viticola',
    category: 'disease',
    crop: 'grapes',
    symptoms: [
      'Yellow translucent "oil-spots" on upper leaf surfaces',
      'Dense white cottony downy fungal growth on underside corresponding to spots',
      'Young berries shrivel, turn brown, and drop prematurely'
    ],
    visual_guide_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="%231c1917"/><circle cx="100" cy="80" r="28" fill="%23eab308" opacity="0.8"/><circle cx="150" cy="90" r="22" fill="%23eab308" opacity="0.8"/></svg>',
    comparison_tip: 'Oil-spot on top and dense white downy carpet on underside distinguishes from Powdery Mildew which attacks the upper leaf surface directly.',
    recommended_products: [
      TREATMENT_PRODUCTS_CATALOG[2], // Dashaparni Ark
      TREATMENT_PRODUCTS_CATALOG[5]  // Copper Oxychloride
    ]
  }
];

export const OUTBREAK_FORECASTS: OutbreakForecast[] = [
  {
    id: 'forecast-rice-blast',
    crop: 'rice',
    threat_name: 'Rice Blast Outbreak Forecast (Pyricularia oryzae)',
    threat_name_local: {
      hi: 'धान झोंका (ब्लास्ट) रोग प्रकोप पूर्वानुमान',
      mr: 'भात करपा (ब्लास्ट) प्रादुर्भाव अंदाज'
    },
    threat_type: 'fungal_disease',
    risk_level: 'high',
    risk_percentage: 84,
    leaf_wetness_hours: 14,
    favorable_temp_c: [19, 28],
    favorable_humidity_min: 88,
    trigger_reason: 'Consecutive dew nights with leaf wetness >12 hours and night temps around 21°C create high-risk spore release window.',
    forecast_days: 5,
    preventive_action: 'Avoid excess top-dressing of urea nitrogen. Apply preventive Trichoderma harzianum or silica-rich wood ash to leaf surfaces. Inspect nursery tillers.',
    preventive_action_local: {
      hi: 'यूरिया का अधिक छिड़काव न करें। ट्राइकोडर्मा या लकड़ी की राख का छिड़काव करके रोग को पहले ही रोकें।',
      mr: 'युरिया खताचा अतिवापर टाळा. पानांवर ट्रायकोडर्मा किंवा लाकडाच्या राखेची फवारणी करा.'
    }
  },
  {
    id: 'forecast-cotton-bollworm',
    crop: 'cotton',
    threat_name: 'Pink Bollworm Moth Emergence Alert',
    threat_name_local: {
      hi: 'गुलाबी सुंडी प्रकोप चेतावनी',
      mr: 'गुलाबी बोंडअळी प्रादुर्भाव पूर्वसूचना'
    },
    threat_type: 'insect_pest',
    risk_level: 'moderate',
    risk_percentage: 62,
    leaf_wetness_hours: 6,
    favorable_temp_c: [25, 34],
    favorable_humidity_min: 65,
    trigger_reason: 'Degree-day accumulation indicates peak nocturnal moth emergence over the next 4 nights.',
    forecast_days: 7,
    preventive_action: 'Erect 5 pheromone traps per acre immediately to disrupt mating flights. Inspect rosetted blooms.',
    preventive_action_local: {
      hi: 'प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। मुड़े हुए फूलों की नियमित जांच करें।',
      mr: 'एकरला ५ कामगंध सापळे लावा. प्रादुर्भाव झालेली फुले गोळा करून नष्ट करा.'
    }
  },
  {
    id: 'forecast-tomato-blight',
    crop: 'tomato',
    threat_name: 'Early Blight Humidity Spore Window',
    threat_name_local: {
      hi: 'टमाटर झुलसा नमी स्पोर अलर्ट',
      mr: 'टोमॅटो करपा बुरशी अलर्ट'
    },
    threat_type: 'fungal_disease',
    risk_level: 'moderate',
    risk_percentage: 58,
    leaf_wetness_hours: 8,
    favorable_temp_c: [24, 30],
    favorable_humidity_min: 75,
    trigger_reason: 'Intermittent drizzling and warm daytime temps favor Alternaria spore germination on lower canopy.',
    forecast_days: 4,
    preventive_action: 'Prune lowest branches touching soil. Spray 5-day fermented sour buttermilk with turmeric.',
    preventive_action_local: {
      hi: 'निचली पत्तियों की छंटाई करें। खट्टी छाछ और हल्दी का घोल छिड़कें।',
      mr: 'जमिनीला टेकणाऱ्या फांद्या छाटा. आंबट ताक आणि हळदीचे द्रावण फवारा.'
    }
  }
];
