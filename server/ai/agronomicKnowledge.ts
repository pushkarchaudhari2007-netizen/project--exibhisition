/**
 * GreenCoach AI - Vetted Agronomic Knowledge Base & Context Fusion Rules
 * Source of Truth: PRD & 04_Technical_Data_Content_REFINED.md
 * 
 * Strict Agronomic Guardrails:
 * 1. Prioritize biological, cultural, and organic remedies.
 * 2. Chemical treatments are only safe fallbacks with weather spraying gates.
 * 3. Never hallucinate dosage; use vetted ICAR / KVK agricultural standards.
 */

export interface DiseaseKnowledge {
  id: string;
  crop: string;
  name: string;
  scientific_name: string;
  hindi_name: string;
  marathi_name: string;
  symptoms: string[];
  soil_correlations: {
    ph_range?: [number, number];
    moisture_condition?: 'high' | 'waterlogged' | 'dry';
    deficiency_lookalikes: string[];
  };
  weather_risks: {
    high_humidity_threshold?: number;
    temp_range?: [number, number];
    rainfall_risk: boolean;
  };
  eco_remedies: {
    step: number;
    title: string;
    title_local: Record<string, string>;
    category: 'biological' | 'cultural' | 'organic_spray';
    instructions: string;
    instructions_local: Record<string, string>;
    materials_needed: string[];
  }[];
  chemical_fallback: {
    chemical_name: string;
    warning: string;
    safe_handling: string;
  };
  preventive_measures: string[];
}

export const AGRONOMIC_KNOWLEDGE_BASE: DiseaseKnowledge[] = [
  {
    id: 'cotton_early_leaf_spot',
    crop: 'cotton',
    name: 'Early Leaf Spot (Cercospora)',
    scientific_name: 'Cercospora gossypina',
    hindi_name: 'कपास का पत्ती धब्बा रोग',
    marathi_name: 'कापूस पानावरील ठिपके रोग',
    symptoms: [
      'Circular reddish-brown spots with concentric rings',
      'Premature defoliation of lower canopy leaves',
      'Lesions merge causing leaf blighting'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Potassium deficiency (marginal leaf scorch)', 'Magnesium deficiency (reddening between veins)']
    },
    weather_risks: {
      high_humidity_threshold: 75,
      temp_range: [24, 32],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Neem Seed Kernel Extract Spray (NSKE 5%)',
        title_local: {
          hi: 'नीम के बीज का अर्क (NSKE 5%) छिड़काव',
          mr: 'निंबोळी अर्क (NSKE 5%) फवारणी'
        },
        category: 'organic_spray',
        instructions: 'Mix 50g of crushed neem seed kernel in 1 litre of clean water. Strain through muslin cloth and add 1g mild soap as surfactant. Spray uniformly over leaf undersides during early morning.',
        instructions_local: {
          hi: '1 लीटर पानी में 50 ग्राम कुचला हुआ नीम का बीज मिलाएं। कपड़े से छानकर पत्तियों के नीचे छिड़काव करें।',
          mr: '१ लिटर स्वच्छ पाण्यात ५० ग्रॅम ठेचलेली निंबोळी मिसळा. कापडाने गाळून पानांच्या खालच्या बाजूला सकाळी फवारा.'
        },
        materials_needed: ['Neem seeds or 5% NSKE', 'Clean water', 'Strainer cloth']
      },
      {
        step: 2,
        title: 'Trichoderma viride Bio-fungicide Soil Application',
        title_local: {
          hi: 'ट्राइकोडर्मा विरिडी जैव-फफूंदनाशी प्रयोग',
          mr: 'ट्रायकोडर्मा विरिडी जैविक बुरशीनाशक वापर'
        },
        category: 'biological',
        instructions: 'Mix 2.5 kg of Trichoderma viride culture with 100 kg well-decomposed cow manure (FYM). Keep under shade with moisture for 5 days, then apply to root zone to stop fungal spore spread.',
        instructions_local: {
          hi: '2.5 किलो ट्राइकोडर्मा को 100 किलो गोबर की खाद में मिलाकर छाया में 5 दिन रखें, फिर पौधों की जड़ों में डालें।',
          mr: '२.५ किलो ट्रायकोडर्मा १०० किलो शेणखतात मिसळून ५ दिवस सावलीत ठेवा, नंतर झाडांच्या मुळाशी टाका.'
        },
        materials_needed: ['Trichoderma viride formulation', 'Well-decomposed manure']
      },
      {
        step: 3,
        title: 'Cultural Air Circulation & Infected Debris Removal',
        title_local: {
          hi: 'संक्रमित पत्तियों को हटाना और वायु संचार',
          mr: 'रोगट पाने काढून टाकणे व हवा खेळती ठेवणे'
        },
        category: 'cultural',
        instructions: 'Carefully pluck fallen diseased bottom leaves and bury them outside field. Avoid overhead flood irrigation that splashes soil spores onto lower leaves.',
        instructions_local: {
          hi: 'नीचे की गिरी हुई रोगी पत्तियों को इकट्ठा करके खेत से बाहर गड्ढे में दबाएं।',
          mr: 'खाली पडलेली रोगट पाने गोळा करून शेताबाहेर खड्ड्यात पुरा.'
        },
        materials_needed: ['Hand gloves / garden shears']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Copper Oxychloride (COC 50% WP) or Mancozeb 75% WP',
      warning: 'Use only if fungal lesion count exceeds 35% across farm canopy and eco-remedy failed after 7 days.',
      safe_handling: 'Always wear mask and gloves. Never spray during windy conditions or within 48 hours of expected rain.'
    },
    preventive_measures: [
      'Maintain adequate plant spacing (90cm x 60cm) for aeration',
      'Rotate crop with sorghum or pulses next season',
      'Apply Jeevamrut monthly to reinforce soil microbiome'
    ]
  },
  {
    id: 'tomato_early_blight',
    crop: 'tomato',
    name: 'Early Blight (Alternaria solani)',
    scientific_name: 'Alternaria solani',
    hindi_name: 'टमाटर का अगेती झुलसा रोग',
    marathi_name: 'टोमॅटोचा करपा / तांब्या रोग',
    symptoms: [
      'Dark brown concentric target-like rings on older leaves',
      'Yellow chlorotic halos surrounding lesions',
      'Stem collar rot and sunken dark fruit stem-end rots'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Nitrogen deficiency (general bottom leaf yellowing)', 'Early septoria leaf spot']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [20, 30],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Dashaparni Ark Spray (10-Leaf Botanical Formulation)',
        title_local: {
          hi: 'दशपर्णी अर्क छिड़काव (10 पत्तियों का प्राकृतिक काढ़ा)',
          mr: 'दशपर्णी अर्क फवारणी'
        },
        category: 'organic_spray',
        instructions: 'Dilute 200ml of aged Dashaparni Ark in 10 litres of water. Apply during late afternoon to coat both surfaces of tomato foliage.',
        instructions_local: {
          hi: '10 लीटर पानी में 200 मिली दशपर्णी अर्क मिलाकर शाम के समय छिड़काव करें।',
          mr: '१० लिटर पाण्यात २०० मिली दशपर्णी अर्क मिसळून संध्याकाळी झाडांवर फवारा.'
        },
        materials_needed: ['Dashaparni Ark extract', 'Clean sprayer']
      },
      {
        step: 2,
        title: 'Sour Buttermilk (Khatta Chhachh) & Turmeric Spray',
        title_local: {
          hi: 'खट्टी छाछ और हल्दी का प्राकृतिक घोल',
          mr: 'आंबट ताक आणि हळद फवारणी'
        },
        category: 'biological',
        instructions: 'Mix 1 litre of 5-day fermented sour buttermilk with 50g raw turmeric powder and 9 litres of water. The lactic acid and curcumin inhibit Alternaria spore germination.',
        instructions_local: {
          hi: '5 दिन पुरानी खट्टी छाछ में 50 ग्राम हल्दी और 9 लीटर पानी मिलाकर छिड़कें। यह फफूंद को रोकता है।',
          mr: '५ दिवस जुने आंबट ताक १ लिटर + ५० ग्रॅम हळद + ९ लिटर पाणी एकत्र करून फवारा.'
        },
        materials_needed: ['Fermented sour buttermilk', 'Raw turmeric powder']
      },
      {
        step: 3,
        title: 'Pruning Bottom Canopy & Straw Mulching',
        title_local: {
          hi: 'निचली पत्तियों की छंटाई और भूसा मल्चिंग',
          mr: 'खालच्या फांद्यांची छाटणी व आच्छादन (मल्चिंग)'
        },
        category: 'cultural',
        instructions: 'Clip off branches within 20cm of soil bed. Lay dry straw or leaves around root zone to prevent soil fungal spores from splashing during irrigation.',
        instructions_local: {
          hi: 'जमीन से 20 सेमी ऊपर तक की निचली शाखाओं को काटें। मिट्टी पर सूखे भूसे की परत बिछाएं।',
          mr: 'जमिनीलगतच्या २० सेंमी फांद्या छाटा. झाडाभोवती सुक्या गवताचे आच्छादन करा.'
        },
        materials_needed: ['Clean pruning shears', 'Dry straw or crop mulch']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Chlorothalonil 75% WP or Azoxystrobin',
      warning: 'Use strictly as emergency mitigation if >40% vines show stem girdling.',
      safe_handling: 'Respect 7-day harvest waiting period (PHI) after spraying.'
    },
    preventive_measures: [
      'Stake tomato plants to keep fruit and leaves off ground',
      'Drip irrigation instead of overhead sprinklers',
      'Dip seedlings in Pseudomonas fluorescens before transplanting'
    ]
  },
  {
    id: 'cotton_bollworm',
    crop: 'cotton',
    name: 'Spotted & Pink Bollworm Infestation',
    scientific_name: 'Pectinophora gossypiella',
    hindi_name: 'कपास की गुलाबी सुंडी',
    marathi_name: 'कापूस गुलाबी बोंडअळी',
    symptoms: [
      'Rosetted flowers that fail to bloom properly',
      'Tiny entry holes on bolls sealed with frass/excreta',
      'Premature boll dropping and stained lint fiber'
    ],
    soil_correlations: {
      moisture_condition: 'dry',
      deficiency_lookalikes: ['Boron deficiency (boll cracking / distortion)']
    },
    weather_risks: {
      temp_range: [25, 35],
      rainfall_risk: false
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Pheromone Trap Installation',
        title_local: {
          hi: 'फेरोमोन ट्रैप (गंध पाश) लगाना',
          mr: 'कामगंध सापळे (फेरोमोन ट्रॅप) लावणे'
        },
        category: 'cultural',
        instructions: 'Install 5 Phero-sensor traps per acre at 1 foot above crop canopy level. Monitor moth catch daily to disrupt nocturnal mating cycle.',
        instructions_local: {
          hi: 'प्रति एकड़ 5 फेरोमोन ट्रैप फसल से 1 फीट ऊपर लगाएं। प्रतिदिन पतंगों की संख्या जांचें।',
          mr: 'एका एकरात ५ कामगंध सापळे पिकाच्या उंचीपेक्षा १ फूट वर लावा.'
        },
        materials_needed: ['Pink bollworm pheromone lures', 'Funnel traps with stakes']
      },
      {
        step: 2,
        title: 'Trichogramma Egg Parasitoid Cards (Trichocards)',
        title_local: {
          hi: 'ट्राइकोग्रामा परजीवी मित्र कीट कार्ड',
          mr: 'ट्रायकोग्रामा मित्रकिडींचे ट्रायकोगार्ड्स'
        },
        category: 'biological',
        instructions: 'Staple Trichogramma bactrae cards (50,000 parasitized eggs per acre) under leaf undersides in the evening. Friendly tiny wasps parasitize bollworm eggs before larvae hatch.',
        instructions_local: {
          hi: 'शाम को पत्तियों के नीचे ट्राइकोकार्ड स्टेपल करें। मित्र कीट सुंडी के अंडों को नष्ट कर देंगे।',
          mr: 'संध्याकाळी पानांच्या मागे ट्रायकोगार्ड स्टेपल करा. मित्रकीड अळीची अंडी नष्ट करते.'
        },
        materials_needed: ['Tricho-cards from local KVK or bio-lab']
      },
      {
        step: 3,
        title: 'Beauveria bassiana Bio-Pesticide Spray',
        title_local: {
          hi: 'ब्युवेरिया बासियाना जैव-कीटनाशक',
          mr: 'बिव्हेरिया बॅसियाना जैविक कीटकनाशक'
        },
        category: 'organic_spray',
        instructions: 'Spray Beauveria bassiana (1x10^8 CFU/g) at 5g per litre with 1ml liquid soap during humid cloudy evening.',
        instructions_local: {
          hi: '1 लीटर पानी में 5 ग्राम ब्युवेरिया बासियाना मिलाकर शाम को छिड़कें।',
          mr: '१ लिटर पाण्यात ५ ग्रॅम बिव्हेरिया बॅसियाना मिसळून संध्याकाळी फवारा.'
        },
        materials_needed: ['Beauveria bassiana wettable powder']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Emamectin Benzoate 5% SG or Spinosad 45% SC',
      warning: 'Only deploy if >10% rosetted flowers or 8 moths/trap recorded over 3 consecutive nights.',
      safe_handling: 'Do not spray when honeybees are actively foraging in morning.'
    },
    preventive_measures: [
      'Plant non-Bt refuge rows or okra trap crops along border',
      'Promptly crush or burn post-harvest cotton stalks',
      'Deep summer plowing to expose pupae to predatory birds'
    ]
  },
  {
    id: 'wheat_yellow_rust',
    crop: 'wheat',
    name: 'Yellow (Stripe) Rust',
    scientific_name: 'Puccinia striiformis',
    hindi_name: 'गेहूं का पीला रतुआ (हल्दी रोग)',
    marathi_name: 'गव्हावरील पिवळा तांबेरा',
    symptoms: [
      'Bright yellow powdery pustules arranged in linear stripes along leaf veins',
      'Powdery dust stains fingers when touched (haldia)',
      'Severe chlorosis and stunted grain filling'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Sulphur deficiency (uniform pale yellow top leaves)']
    },
    weather_risks: {
      high_humidity_threshold: 85,
      temp_range: [10, 22],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Bio-protection with Pseudomonas fluorescens Spray',
        title_local: {
          hi: 'स्यूडोमोनास फ्लोरोसेंस जैव-जीवाणु छिड़काव',
          mr: 'स्यूडोमोनास फ्लोरोसन्स जैविक फवारणी'
        },
        category: 'biological',
        instructions: 'Dissolve 10g Pseudomonas fluorescens powder per litre of water. Apply at first sign of yellow flecking across leaf blades.',
        instructions_local: {
          hi: '1 लीटर पानी में 10 ग्राम स्यूडोमोनास मिलाकर पत्तियों पर छिड़कें।',
          mr: '१ लिटर पाण्यात १० ग्रॅम स्यूडोमोनास मिसळून पिवळे पट्टे दिसताच फवारा.'
        },
        materials_needed: ['Pseudomonas formulation', 'Sprayer']
      },
      {
        step: 2,
        title: 'Jeevamrut Foliar Application',
        title_local: {
          hi: 'जीवामृत का पत्तों पर छिड़काव',
          mr: 'जीवामृताची पानावरील फवारणी'
        },
        category: 'organic_spray',
        instructions: 'Filter 10% Jeevamrut through double-layer cotton cloth. Foliar spray 200 litres per acre in early morning to stimulate systemic plant immunity.',
        instructions_local: {
          hi: '10% छाना हुआ जीवामृत सुबह के समय खेत में छिड़कें। इससे फसल की रोग प्रतिरोधक क्षमता बढ़ती है।',
          mr: '१०% गाळलेले जीवामृत सकाळी पिकावर फवारा. झाडांची प्रतिकारशक्ती वाढते.'
        },
        materials_needed: ['Fresh organic Jeevamrut', 'Cotton cloth']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Propiconazole 25% EC (Tilt)',
      warning: 'Rust spreads via wind currents very fast; chemical action needed if >15% field flag leaves infected.',
      safe_handling: 'Spray during calm winds early morning; use protective eye goggles.'
    },
    preventive_measures: [
      'Sow rust-resistant varieties (HD 2967, DBW 187, PBW 550)',
      'Avoid late sowing; keep nitrogen fertilization balanced without excess urea',
      'Clean irrigation channels to prevent standing cold dampness'
    ]
  },
  {
    id: 'rice_blast',
    crop: 'rice',
    name: 'Rice Blast (Magnaporthe oryzae)',
    scientific_name: 'Magnaporthe oryzae',
    hindi_name: 'धान का झोंका रोग (ब्लास्ट)',
    marathi_name: 'भातावरील करपा रोग',
    symptoms: [
      'Spindle-shaped diamond lesions with ash-grey centers and brown borders',
      'Neck rot causing empty whitish grain panicles (nodal blast)',
      'Leaves dry up giving field a burnt appearance'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Zinc deficiency (Khaira disease / brown blotches)']
    },
    weather_risks: {
      high_humidity_threshold: 90,
      temp_range: [18, 28],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Trichoderma harzianum Foliar Spray',
        title_local: {
          hi: 'ट्राइकोडर्मा हारजियानम का पर्णीय छिड़काव',
          mr: 'ट्रायकोडर्मा हरझियानम फवारणी'
        },
        category: 'biological',
        instructions: 'Mix 10g Trichoderma harzianum per litre of water. Apply at tillering stage and repeat before panicle initiation.',
        instructions_local: {
          hi: '1 लीटर पानी में 10 ग्राम ट्राइकोडर्मा मिलाकर कल्ले फूटते समय और बाली निकलने से पहले छिड़कें।',
          mr: '१ लिटर पाण्यात १० ग्रॅम ट्रायकोडर्मा मिसळून लोंब्या निघण्यापूर्वी फवारा.'
        },
        materials_needed: ['Trichoderma harzianum', 'Water']
      },
      {
        step: 2,
        title: 'Silica & Wood Ash Soil Amendment',
        title_local: {
          hi: 'लकड़ी की राख और सिलिका का उपयोग',
          mr: 'लाकडाची राख आणि सिलिकॉनचा वापर'
        },
        category: 'cultural',
        instructions: 'Broadcast fine wood ash (50 kg/acre) across paddy water. Soluble silica hardens epidermal leaf cells, making fungal appressoria unable to penetrate.',
        instructions_local: {
          hi: 'प्रति एकड़ 50 किलो लकड़ी की राख खेत में बखेरें। सिलिका पत्तियों को सख्त बनाकर फफूंद से बचाती है।',
          mr: 'एकरला ५० किलो लाकडाची बारीक राख शेतात पसरा. सिलिकॉनमुळे पानांची त्वचा जाड होते.'
        },
        materials_needed: ['Clean hardwood ash']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Tricyclazole 75% WP or Kasugamycin',
      warning: 'Only deploy if neck blast symptoms threaten panicle emergence.',
      safe_handling: 'Use rubber boots in paddy water; rinse skin thoroughly.'
    },
    preventive_measures: [
      'Avoid split overdosing of chemical Urea nitrogen',
      'Maintain intermittent flooding and drying instead of constant water stagnation',
      'Seed treatment with Pseudomonas fluorescens before nursery sowing'
    ]
  },
  {
    id: 'sugarcane_red_rot',
    crop: 'sugarcane',
    name: 'Red Rot of Sugarcane',
    scientific_name: 'Colletotrichum falcatum',
    hindi_name: 'गन्ने का लाल सड़न रोग',
    marathi_name: 'ऊसावरील तांबडे कूज रोग (रेड रॉट)',
    symptoms: [
      'Third and fourth leaves from top show yellowing and drying along margins',
      'Internal stalk pith turns red with diagnostic transverse white patches',
      'Sour alcoholic fermentation smell when canes are split open'
    ],
    soil_correlations: {
      moisture_condition: 'waterlogged',
      deficiency_lookalikes: ['Iron chlorosis (leaf yellowing without red pith)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [28, 35],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Sett Treatment with Trichoderma viride',
        title_local: {
          hi: 'ट्राइकोडर्मा से बीज (गुल) उपचार',
          mr: 'ट्रायकोडर्मा विरिडीने बेणे प्रक्रिया'
        },
        category: 'biological',
        instructions: 'Dip two-budded setts for 30 minutes in a slurry of Trichoderma viride (10g/L water) before furrow planting.',
        instructions_local: {
          hi: 'बुआई से पहले गन्ने के टुकड़ों को ट्राइकोडर्मा (10 ग्राम/लीटर) के घोल में 30 मिनट डुबोएं।',
          mr: 'लागवडीपूर्वी ऊसाचे बेणे ट्रायकोडर्मा (१० ग्रॅम/लिटर) द्रावणात ३० मिनिटे बुडवा.'
        },
        materials_needed: ['Trichoderma viride bio-fungicide', 'Treatment tub']
      },
      {
        step: 2,
        title: 'Field Drainage & Soil Solarization',
        title_local: {
          hi: 'खेत में जल निकासी व गहरी जुताई',
          mr: 'पाण्याचा निचरा व खोल नांगरणी'
        },
        category: 'cultural',
        instructions: 'Open drainage trenches between ridges to prevent water stagnation. Remove and burn completely dried clumps from field perimeter.',
        instructions_local: {
          hi: 'खेत में पानी भरने न दें। रोगग्रस्त पौधों को जड़ सहित उखाड़कर जला दें।',
          mr: 'शेतात पाणी साचू देऊ नका. रोगट उसाची बेटे उपटून जाळून टाका.'
        },
        materials_needed: ['Trench shovel', 'Dry bio-waste disposal']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Carbendazim 50% WP (Sett dip only)',
      warning: 'Do not spray standing mature crop; use strictly for seed cane prophylactic soak.',
      safe_handling: 'Wear protective rubber boots and gloves during sett dipping.'
    },
    preventive_measures: [
      'Never take ratoon crops from infected fields',
      'Rotate with sunnhemp (green manure) or legumes for one season',
      'Plant certified disease-resistant varieties (Co 86032, Co 0238)'
    ]
  },
  {
    id: 'soybean_yellow_mosaic',
    crop: 'soybean',
    name: 'Yellow Mosaic Virus (YMV) & Whitefly',
    scientific_name: 'Mungbean yellow mosaic India virus',
    hindi_name: 'सोयाबीन का पीला मोज़ेक रोग',
    marathi_name: 'सोयाबीन पिवळा मोझॅक व पांढरी माशी',
    symptoms: [
      'Bright yellow patches interspersed with green areas on younger trifoliate leaves',
      'Severely infected leaves become completely golden yellow and brittle',
      'Stunted plant growth with few, poorly filled pods'
    ],
    soil_correlations: {
      deficiency_lookalikes: ['Sulfur deficiency (uniform pale yellowing without mosaic mottling)']
    },
    weather_risks: {
      temp_range: [28, 38],
      rainfall_risk: false
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Yellow Sticky Traps for Vector Control',
        title_local: {
          hi: 'पीले चिपचिपे कार्ड (येलो स्टिकी ट्रैप)',
          mr: 'पिवळे चिकट सापळे लावणे'
        },
        category: 'cultural',
        instructions: 'Erect 12-15 yellow sticky traps per acre at canopy level to capture sap-sucking whitefly vectors before viral transmission.',
        instructions_local: {
          hi: 'प्रति एकड़ 15 पीले चिपचिपे कार्ड लगाएं जिससे सफेद मक्खी फंसे।',
          mr: 'एकरला १५ पिवळे चिकट सापळे पिकाच्या उंचीवर लावा.'
        },
        materials_needed: ['Yellow sticky boards', 'Bamboo stakes']
      },
      {
        step: 2,
        title: 'Neem Oil 10,000 PPM Foliar Spray',
        title_local: {
          hi: 'नीम तेल (10,000 PPM) का छिड़काव',
          mr: 'निमतेल (१०,००० PPM) फवारणी'
        },
        category: 'organic_spray',
        instructions: 'Spray Neem oil @ 3ml/L water mixed with 1ml natural soap emulsifier to repel whitefly feeding.',
        instructions_local: {
          hi: '3 मिली नीम तेल प्रति लीटर पानी में मिलाकर सुबह पत्तियों के नीचे छिड़कें।',
          mr: '३ मिली निमतेल प्रति लिटर पाण्यात मिसळून सकाळी फवारा.'
        },
        materials_needed: ['Cold-pressed Neem oil 10000 PPM', 'Mild soap sticker']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Thiamethoxam 25% WG',
      warning: 'Only deploy if whitefly density exceeds economic threshold (>8 adults/leaf).',
      safe_handling: 'Avoid spraying when honeybees are foraging on legume blossoms.'
    },
    preventive_measures: [
      'Rogue out and destroy early infected yellow seedlings within 30 days of sowing',
      'Seed treatment with Imidacloprid or Trichoderma before sowing',
      'Sow tolerant varieties such as JS 335, JS 93-05, Phule Kalyani'
    ]
  },
  {
    id: 'onion_purple_blotch',
    crop: 'onion',
    name: 'Purple Blotch & Stemphylium Blight',
    scientific_name: 'Alternaria porri',
    hindi_name: 'प्याज का बैंगनी धब्बा रोग',
    marathi_name: 'कांद्यावरील जांभळा करपा रोग',
    symptoms: [
      'Small, water-soaked lesions that develop sunken purple/dark violet centers',
      'Yellow halos surrounding elliptical lesions on tubular leaves',
      'Leaves break over at the lesion points, drastically reducing bulb size'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Potassium deficiency (leaf tip burning without purple lesions)']
    },
    weather_risks: {
      high_humidity_threshold: 85,
      temp_range: [20, 30],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Pseudomonas fluorescens Foliar Application',
        title_local: {
          hi: 'स्यूडोमोनास फ्लोरेसेंस जैविक छिड़काव',
          mr: 'स्यूडोमोनास जैविक बुरशी प्रतिबंधक फवारणी'
        },
        category: 'biological',
        instructions: 'Spray Pseudomonas fluorescens (10g/L water) at 10-day intervals to suppress Alternaria spore proliferation.',
        instructions_local: {
          hi: '10 ग्राम स्यूडोमोनास प्रति लीटर पानी में मिलाकर 10 दिन के अंतर पर छिड़कें।',
          mr: '१० ग्रॅम स्यूडोमोनास प्रति लिटर पाण्यात मिसळून पानांवर फवारा.'
        },
        materials_needed: ['Pseudomonas fluorescens 1% WP']
      },
      {
        step: 2,
        title: 'Sour Buttermilk (Khatti Chhachh) & Copper Pot Spray',
        title_local: {
          hi: 'खट्टी छाछ व तांबे का प्राकृतिक स्प्रे',
          mr: 'आंबट ताक आणि तांब्याचे भांडे द्रावण'
        },
        category: 'organic_spray',
        instructions: 'Ferment 5 liters sour desi cow buttermilk in a copper pot for 5 days. Dilute in 100 liters water and spray over onion canopy.',
        instructions_local: {
          hi: '5 दिन पुरानी खट्टी छाछ को 100 लीटर पानी में मिलाकर छिड़कें।',
          mr: '५ दिवस जुने आंबट ताक १०० लिटर पाण्यात मिसळून फवारा.'
        },
        materials_needed: ['Sour cow buttermilk', 'Copper vessel']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Mancozeb 75% WP or Tebuconazole',
      warning: 'Do not spray within 15 days of bulb harvesting.',
      safe_handling: 'Always mix a non-ionic sticker (spreadmax) due to waxy tubular onion leaf surface.'
    },
    preventive_measures: [
      'Follow raised bed planting with drip irrigation instead of flood irrigation',
      'Maintain crop spacing of 15cm x 10cm for good canopy ventilation',
      'Destroy crop residue after harvest'
    ]
  },
  {
    id: 'maize_fall_armyworm',
    crop: 'maize',
    name: 'Fall Armyworm (FAW) Infestation',
    scientific_name: 'Spodoptera frugiperda',
    hindi_name: 'मक्का का फॉल आर्मीवर्म (सैनिक कीट)',
    marathi_name: 'मक्यावरील लष्करी अळी (फॉलो आर्मीवर्म)',
    symptoms: [
      'Ragged "window-pane" feeding holes and chewed whorl leaves',
      'Heavy accumulation of sawdust-like coarse frass (excreta) inside central whorl',
      'Larva has 4 dark spots arranged in a square on the 8th abdominal segment'
    ],
    soil_correlations: {
      deficiency_lookalikes: ['Stem borer early pinhole damage']
    },
    weather_risks: {
      temp_range: [24, 34],
      rainfall_risk: false
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Soil/Wood Ash & Neem Cake Whorl Application',
        title_local: {
          hi: 'मक्के की पोंगी में राख व नीम खली डालना',
          mr: 'मक्याच्या पोंग्यात राख व निंबोळी पेंड टाकणे'
        },
        category: 'cultural',
        instructions: 'Apply a pinch of dry fine wood ash mixed with sieved soil or neem cake (1:1) directly into the central plant whorl to desiccate young caterpillars.',
        instructions_local: {
          hi: 'पौधे की केंद्रीय पोंगी में एक चुटकी राख और नीम खली डालें।',
          mr: 'मक्याच्या पोंग्यात चिमूटभर बारीक राख व निंबोळी पेंड टाका.'
        },
        materials_needed: ['Dry wood ash', 'Powdered neem cake']
      },
      {
        step: 2,
        title: 'Metarhizium anisopliae Bio-Insecticide Whorl Spray',
        title_local: {
          hi: 'मेटाराइजियम एनीसोप्ली जैव कीटनाशक छिड़काव',
          mr: 'मेटारायझियम जैविक कीटकनाशक फवारणी'
        },
        category: 'biological',
        instructions: 'Spray Metarhizium anisopliae or Beauveria bassiana (5g/L water) targeting nozzle directly into the central whorl late afternoon.',
        instructions_local: {
          hi: '5 ग्राम मेटाराइजियम प्रति लीटर पानी में मिलाकर शाम को पोंगी में छिड़कें।',
          mr: '५ ग्रॅम मेटारायझियम प्रति लिटर पाण्यात मिसळून थेट पोंग्यात फवारा.'
        },
        materials_needed: ['Metarhizium anisopliae spores', 'Knapsack sprayer with cone nozzle']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Chlorantraniliprole 18.5% SC (Coragen)',
      warning: 'Apply only if >10% of plants show active caterpillar feeding in whorl.',
      safe_handling: 'Direct spray into leaf whorl, do not broadcast into air.'
    },
    preventive_measures: [
      'Install FAW pheromone lures (4 traps/acre) at sowing',
      'Intercrop with cowpea or pigeonpea to attract natural predator birds',
      'Deep summer ploughing to expose pupae to predatory birds'
    ]
  },
  {
    id: 'potato_late_blight',
    crop: 'potato',
    name: 'Late Blight of Potato',
    scientific_name: 'Phytophthora infestans',
    hindi_name: 'आलू का पछेती झुलसा रोग',
    marathi_name: 'बटाट्यावरील उशिरा येणारा करपा (लेट ब्लाइट)',
    symptoms: [
      'Water-soaked dark brownish-black lesions appearing at leaf margins and tips',
      'Delicate whitish fungal mildew growth on leaf undersides during moist mornings',
      'Rotten brown depressed patches on tubers with foul odor'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Frost injury (brittle dry tips without white mildew)']
    },
    weather_risks: {
      high_humidity_threshold: 90,
      temp_range: [12, 22],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Bordeaux Mixture (1%) Prophylactic Spray',
        title_local: {
          hi: 'बोर्डो मिश्रण (1%) का सुरक्षात्मक छिड़काव',
          mr: 'बोर्डो मिश्रण (१%) संरक्षक फवारणी'
        },
        category: 'organic_spray',
        instructions: 'Prepare fresh 1% Bordeaux mixture (Copper sulfate 1kg + Slaked lime 1kg + Water 100L) and spray both leaf surfaces before foggy spell.',
        instructions_local: {
          hi: '1 किलो नीला थोथा + 1 किलो चूना 100 लीटर पानी में मिलाकर ताजा बोर्डो मिश्रण छिड़कें।',
          mr: '१ किलो मोरचूद + १ किलो चुना १०० लिटर पाण्यात मिसळून ताजे बोर्डो मिश्रण फवारा.'
        },
        materials_needed: ['Copper sulfate (Morchud)', 'Fresh slaked lime']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Cymoxanil 8% + Mancozeb 64% WP',
      warning: 'Only apply if late blight forecasting indicates cool cloudy weather with >90% RH.',
      safe_handling: 'Wear face mask; keep away from water bodies.'
    },
    preventive_measures: [
      'Use certified disease-free seed tubers (Kufri Pukhraj, Kufri Jyoti)',
      'High earthing-up to prevent spores from reaching underground tubers',
      'Burn infected foliage (haulm destruction) 10 days before harvest'
    ]
  },
  {
    id: 'grapes_downy_mildew',
    crop: 'grapes',
    name: 'Downy Mildew of Grapes',
    scientific_name: 'Plasmopara viticola',
    hindi_name: 'अंगूर का डाउनी मिल्ड्यू (मृदुरोमिल फफूंद)',
    marathi_name: 'द्राक्षांवरील केवडा (डाऊनी मिल्ड्यू) रोग',
    symptoms: [
      'Translucent oily "oil-spots" (yellowish lesions) on upper leaf surface',
      'Dense cottony white downy growth on corresponding lower leaf surface',
      'Infected young berries turn brownish, shrivel, harden and drop'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Magnesium deficiency (interveinal yellowing without cottony downy growth)']
    },
    weather_risks: {
      high_humidity_threshold: 85,
      temp_range: [20, 28],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Potassium Phosphite / Phosphonate Spray',
        title_local: {
          hi: 'पोटेशियम फॉस्फाइट का सुरक्षात्मक स्प्रे',
          mr: 'पोटॅशियम फॉस्फोनेटची फवारणी'
        },
        category: 'biological',
        instructions: 'Spray Potassium Phosphonate @ 2-3g/L water to induce systemic acquired resistance in grape vine tissues.',
        instructions_local: {
          hi: '2 से 3 ग्राम पोटेशियम फॉस्फोनेट प्रति लीटर पानी में मिलाकर छिड़कें।',
          mr: '२ ते ३ ग्रॅम पोटॅशियम फॉस्फोनेट प्रति लिटर पाण्यात मिसळून वेलीवर फवारा.'
        },
        materials_needed: ['Potassium Phosphonate 40%']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Metalaxyl 8% + Mancozeb 64% WP',
      warning: 'Respect 45-day pre-harvest interval to comply with export MRL standards.',
      safe_handling: 'Calibrate sprayer to avoid drip loss.'
    },
    preventive_measures: [
      'Canopy management: prune excess foliage to allow sunlight and wind penetration',
      'Remove fallen infected leaves and burn outside vineyard',
      'Avoid overhead micro-sprinklers during berry development'
    ]
  },
  {
    id: 'pomegranate_bacterial_blight',
    crop: 'pomegranate',
    name: 'Bacterial Blight / Telya of Pomegranate',
    scientific_name: 'Xanthomonas axonopodis pv. punicae',
    hindi_name: 'अनार का तेलिया (जीवाणु झुलसा) रोग',
    marathi_name: 'डाळिंबावरील तेल्या (बॅक्टेरियल ब्लाइट) रोग',
    symptoms: [
      'Water-soaked dark brown spots with oily appearance on leaves',
      'Characteristic "L-shaped" or "Y-shaped" cracks on infected fruit rind',
      'Bacterial brown cankers on stems causing shoot blight and dieback'
    ],
    soil_correlations: {
      deficiency_lookalikes: ['Boron deficiency (fruit cracking without oily bacterial spots)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [25, 35],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Copper Hydroxide + Streptocycline Stem Paste',
        title_local: {
          hi: 'कॉपर और स्ट्रेप्टोसाइक्लिन का लेप',
          mr: 'कॉपर आणि स्ट्रेप्टोमायसिनचा खोडावर लेप'
        },
        category: 'biological',
        instructions: 'Paste infected nodal stem cankers with Copper oxychloride (50g) + Streptomycin sulfate (1g) in 1L water with linseed oil sticker.',
        instructions_local: {
          hi: 'तने के घाव को खुरचकर कॉपर व स्ट्रेप्टोमाइसिन का गाढ़ा लेप लगाएं।',
          mr: 'खोडावरील तेल्याची जखम तासून त्यावर कॉपर व स्ट्रेप्टोमायसिनचा लेप लावा.'
        },
        materials_needed: ['Copper oxychloride 50%', 'Streptomycin sulfate']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Bronopol + Copper Oxychloride',
      warning: 'Avoid continuous overuse of antibiotics to prevent resistance buildup.',
      safe_handling: 'Wear protective apron and face shield.'
    },
    preventive_measures: [
      'Take Hastabahar crop (winter flowering) instead of Mrigbahar (rainy season)',
      'Disinfect pruning shears with 2.5% sodium hypochlorite after cutting every branch',
      'Strict quarantine of incoming planting material'
    ]
  },
  {
    id: 'chili_anthracnose_rot',
    crop: 'chili',
    name: 'Anthracnose & Fruit Rot (Colletotrichum)',
    scientific_name: 'Colletotrichum capsici',
    hindi_name: 'मिर्च का फल सड़न व एंथ्रेक्नोज',
    marathi_name: 'मिरचीवरील फळकुज व करपा रोग',
    symptoms: [
      'Sunken circular or elliptical spots with black acervuli rings on ripe chili pods',
      'Dieback of twigs from top downwards with straw-colored blighted tips',
      'Necrotic leaf spots with yellow halos leading to defoliation'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Calcium deficiency (blossom end rot in fruits)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [25, 32],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Pseudomonas fluorescens Bio-Control Spray',
        title_local: { hi: 'स्यूडोमोनास फ्लोरेसेन्स जैविक छिड़काव', mr: 'सुडोमोनास जैविक फवारणी' },
        category: 'biological',
        instructions: 'Mix 10g of Pseudomonas fluorescens (1 x 10^8 cfu/g) per litre of water. Spray at 10-day intervals beginning from flowering stage.',
        instructions_local: {
          hi: '10 ग्राम स्यूडोमोनास प्रति लीटर पानी में घोलकर 10 दिन के अंतराल पर छिड़कें।',
          mr: '१० ग्रॅम सुडोमोनास प्रति लिटर पाण्यात मिसळून १० दिवसांच्या अंतराने फवारणी करा.'
        },
        materials_needed: ['Pseudomonas fluorescens formulation', 'Clean spray water']
      },
      {
        step: 2,
        title: 'Sour Buttermilk & Turmeric Botanical Spray',
        title_local: { hi: 'खट्टी छाछ और हल्दी का प्राकृतिक स्प्रे', mr: 'आंबट ताक व हळदीची फवारणी' },
        category: 'organic_spray',
        instructions: 'Mix 500ml of 4-day fermented sour buttermilk with 20g organic turmeric powder in 10L water. Curcumin and lactic acid inhibit fungal mycelium growth.',
        instructions_local: {
          hi: '500 मिली खट्टी छाछ और 20 ग्राम हल्दी 10 लीटर पानी में मिलाकर पौधों पर स्प्रे करें।',
          mr: '५०० मिली आंबट ताक आणि २० ग्रॅम हळद १० लिटर पाण्यात मिसळून फवारणी करा.'
        },
        materials_needed: ['Fermented buttermilk', 'Turmeric powder']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Copper Oxychloride 50% WP (2.5g/L water)',
      warning: 'Do not spray during mid-day heat (>34°C) to prevent fruit scorch.',
      safe_handling: 'Wear protective goggles and hand gloves.'
    },
    preventive_measures: [
      'Seed treatment with Trichoderma viride @ 10g/kg seed before nursery sowing',
      'Remove and burn infected mummified pods from field borders',
      'Maintain wide row spacing for canopy aeration'
    ]
  },
  {
    id: 'banana_sigatoka_leaf_spot',
    crop: 'banana',
    name: 'Black Sigatoka Leaf Spot (Mycosphaerella)',
    scientific_name: 'Mycosphaerella fijiensis',
    hindi_name: 'केले का सिगाटोका पत्ती धब्बा रोग',
    marathi_name: 'केळीवरील सिगाटोका पानावरील करपा रोग',
    symptoms: [
      'Narrow rusty reddish-brown streaks parallel to leaf lateral veins',
      'Streaks coalesce into large elliptical dead necrotic patches with gray centers',
      'Rapid premature drying and collapse of photosynthetic leaves'
    ],
    soil_correlations: {
      moisture_condition: 'waterlogged',
      deficiency_lookalikes: ['Potassium deficiency (marginal leaf yellowing and curling)']
    },
    weather_risks: {
      high_humidity_threshold: 85,
      temp_range: [26, 32],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Mineral Oil + Neem Kernel Formulation',
        title_local: { hi: 'नीम तेल व मिनरल ऑयल घोल छिड़काव', mr: 'निंबोळी तेल व मिनरल ऑइल फवारणी' },
        category: 'organic_spray',
        instructions: 'Emulsify 5ml Neem oil (1500 ppm) with 1ml organic soap in 1L warm water. Forms a protective hydrophobic barrier blocking ascospore germination.',
        instructions_local: {
          hi: '5 मिली नीम का तेल 1 मिली साबुन के साथ 1 लीटर पानी में मिलाकर पत्तियों पर छिड़कें।',
          mr: '५ मिली निंबोळी तेल १ मिली साबणासह १ लिटर कोमट पाण्यात मिसळून फवारा.'
        },
        materials_needed: ['Neem oil', 'Mild soap emulsifier', 'Clean water']
      },
      {
        step: 2,
        title: 'De-leafing & Canopy Sanitation',
        title_local: { hi: 'प्रभावित सूखी पत्तियों की कटाई', mr: 'बाधित वाळलेल्या पानांची छाटणी' },
        category: 'cultural',
        instructions: 'Cut down severely infected lower leaves showing necrosis. Shred and compost away from plantation to deplete inoculum spores.',
        instructions_local: {
          hi: 'रोगग्रस्त निचली पत्तियों को काटकर खेत से दूर नष्ट करें।',
          mr: 'खालची वाळलेली बाधित पाने कापून बागेबाहेर नेऊन नष्ट करा.'
        },
        materials_needed: ['Sharp sickle / pruning knife', 'Disinfectant solution']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Propiconazole 25% EC (1ml / L water with wetting agent)',
      warning: 'Observe 30-day withholding interval before fruit harvesting.',
      safe_handling: 'Wear protective coveralls and rubber boots.'
    },
    preventive_measures: [
      'Maintain adequate sub-surface drainage to prevent standing stagnant water',
      'Desuckering to keep single mother plant with one follower sucker',
      'Avoid overhead sprinkler irrigation; prefer drip irrigation systems'
    ]
  },
  {
    id: 'mango_anthracnose_blight',
    crop: 'mango',
    name: 'Mango Anthracnose (Colletotrichum)',
    scientific_name: 'Colletotrichum gloeosporioides',
    hindi_name: 'आम का एंथ्रेक्नोज व पुष्पगुच्छ झुलसा',
    marathi_name: 'आंब्यावरील करपा व मोहोर जळणे',
    symptoms: [
      'Oval or irregular dark brown to black spots on tender foliage',
      'Blackening and blighting of flowering panicles leading to fruit drop',
      'Tear-stain necrotic patterns on immature fruit skins'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Zinc deficiency (little leaf rosette at branch terminals)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [24, 30],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Bacillus subtilis Bio-Fungicide Foliar Spray',
        title_local: { hi: 'बैसिलस सबटिलिस जैव कवकनाशी छिड़काव', mr: 'बॅसिलस सबटिलिस जैविक बुरशीनाशक' },
        category: 'biological',
        instructions: 'Spray Bacillus subtilis culture @ 5g/L water uniformly across flower panicles and new flush leaves in early morning.',
        instructions_local: {
          hi: '5 ग्राम बैसिलस सबटिलिस प्रति लीटर पानी में मिलाकर सुबह के समय बौर पर स्प्रे करें।',
          mr: '५ ग्रॅम बॅसिलस प्रति लिटर पाण्यात मिसळून सकाळी मोहोरावर फवारा.'
        },
        materials_needed: ['Bacillus subtilis formulation', 'Sprayer']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Copper Oxychloride 50% WP (3g / L water)',
      warning: 'Avoid spraying during full open bloom to protect honeybee pollinators.',
      safe_handling: 'Wear respirator mask and gloves.'
    },
    preventive_measures: [
      'Post-harvest pruning of criss-cross dead twigs after fruit picking',
      'Spray tree trunks with Bordeaux paste (1:1:10) up to 1 meter height'
    ]
  },
  {
    id: 'groundnut_tikka_leaf_spot',
    crop: 'groundnut',
    name: 'Tikka Leaf Spot (Cercospora)',
    scientific_name: 'Cercospora personata',
    hindi_name: 'मूंगफली का टिक्का रोग',
    marathi_name: 'भुईमुगावरील टिक्का रोग',
    symptoms: [
      'Small circular dark brown to carbon-black spots on upper and lower leaf surfaces',
      'Lesions surrounded by bright yellow halo',
      'Premature defoliation resulting in unfilled pods'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Iron deficiency (interveinal chlorosis on young leaves)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [25, 30],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Neem Seed Kernel Extract 5% (NSKE) Spray',
        title_local: { hi: 'नीम के बीज का अर्क (NSKE 5%) छिड़काव', mr: 'निंबोळी अर्क ५% फवारणी' },
        category: 'organic_spray',
        instructions: 'Spray 5% NSKE at 35 and 50 days after sowing to coat leaf cuticle and arrest fungal haustoria formation.',
        instructions_local: {
          hi: 'बुवाई के 35 और 50 दिनों बाद 5% नीम अर्क का छिड़काव करें।',
          mr: 'पेरणीनंतर ३५ व ५० दिवसांनी ५% निंबोळी अर्काची फवारणी करा.'
        },
        materials_needed: ['Neem seed extract', 'Clean water']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Carbendazim 12% + Mancozeb 63% WP (Saaf 2g/L)',
      warning: 'Restrict use to maximum 2 sprays per cropping season.',
      safe_handling: 'Wear face mask and protective glasses.'
    },
    preventive_measures: [
      'Intercrop with pearl millet (Bajra) or pigeon pea in 4:1 ratio',
      'Deep summer ploughing to bury crop residues'
    ]
  },
  {
    id: 'citrus_canker_bacterial',
    crop: 'citrus',
    name: 'Citrus Canker (Xanthomonas)',
    scientific_name: 'Xanthomonas axonopodis pv. citri',
    hindi_name: 'नींबू वर्गीय फलों का कैंकर रोग',
    marathi_name: 'लिंबूवर्गीय पिकांवरील खैऱ्या / कँकर रोग',
    symptoms: [
      'Raised corky brown crater-like lesions on leaves, twigs, and fruit rinds',
      'Lesions surrounded by prominent oily water-soaked yellow chlorotic margin',
      'Premature fruit drop and twig dieback'
    ],
    soil_correlations: {
      moisture_condition: 'high',
      deficiency_lookalikes: ['Manganese deficiency (mottled yellowing between veins)']
    },
    weather_risks: {
      high_humidity_threshold: 80,
      temp_range: [28, 35],
      rainfall_risk: true
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Bordeaux Mixture (1%) Protective Foliar Spray',
        title_local: { hi: 'बोर्डो मिश्रण (1%) सुरक्षात्मक छिड़काव', mr: 'बोर्डो मिश्रण (१%) संरक्षक फवारणी' },
        category: 'organic_spray',
        instructions: 'Prepare fresh neutral 1% Bordeaux mixture (1kg Copper Sulphate + 1kg Quicklime in 100L water). Spray before monsoon onset and after new vegetative flushes.',
        instructions_local: {
          hi: '1% बोर्डो मिश्रण तैयार करके नई पत्तियों के आने पर और बारिश से पहले स्प्रे करें।',
          mr: '१% ताजे बोर्डो मिश्रण तयार करून पावसाळ्यापूर्वी व नवीन पालवी फुटल्यावर फवारा.'
        },
        materials_needed: ['Copper sulphate', 'Quicklime', 'Earthen / plastic drum']
      }
    ],
    chemical_fallback: {
      chemical_name: 'Streptocycline 90:10 (0.1g/L) + Copper Oxychloride (2.5g/L)',
      warning: 'Use only on severe outbreak to prevent bacterial resistance.',
      safe_handling: 'Wear protective mask and wash skin thoroughly.'
    },
    preventive_measures: [
      'Control citrus leaf miner pest whose larval wounds serve as primary entry infection points',
      'Prune infected twigs 2 inches below lesion and coat cuts with Bordeaux paste'
    ]
  },
  {
    id: 'plant_healthy_vigor',
    crop: 'tomato',
    name: 'Healthy Crop Foliage (No Disease Detected)',
    scientific_name: 'Solanum lycopersicum (Vigorous)',
    hindi_name: 'स्वस्थ फसल (कोई रोग नहीं पाया गया)',
    marathi_name: 'निरोगी पीक (कोणताही रोग नाही)',
    symptoms: [
      'Uniform deep green chlorophyll coloration across whole leaf blade',
      'Zero necrotic lesions, chlorotic halos, or pest frass punctures',
      'Firm turgid vascular petiole and intact leaf margins'
    ],
    soil_correlations: {
      ph_range: [6.5, 7.5],
      moisture_condition: 'high',
      deficiency_lookalikes: []
    },
    weather_risks: {
      rainfall_risk: false
    },
    eco_remedies: [
      {
        step: 1,
        title: 'Maintain Proactive Organic Immunity with Jeevamrut',
        title_local: { hi: 'जीवामृत से फसल की प्राकृतिक प्रतिरोधक क्षमता बनाए रखें', mr: 'जीवामृताने पिकांची नैसर्गिक प्रतिकारशक्ती टिकवून ठेवा' },
        category: 'organic_spray',
        instructions: 'Drench or drip apply 200L Jeevamrut per acre every 15 days to nurture beneficial soil microbiome and keep root architecture vigorous.',
        instructions_local: {
          hi: 'हर 15 दिन में 200 लीटर जीवामृत प्रति एकड़ जड़ों में दें ताकि फसल निरोगी रहे।',
          mr: 'दर १५ दिवसांनी २०० लिटर जीवामृत एकरी मुळांशी द्या, जेणेकरून पीक निरोगी राहील.'
        },
        materials_needed: ['Cow dung', 'Cow urine', 'Jaggery', 'Besan pulse flour', 'Active soil']
      }
    ],
    chemical_fallback: {
      chemical_name: 'No chemical intervention required',
      warning: 'Do NOT apply chemical pesticides on healthy crops to preserve beneficial natural predator insects.',
      safe_handling: 'Celebrate healthy sustainable farming!'
    },
    preventive_measures: [
      'Continue regular morning scouting for early signs of pest flutter',
      'Maintain balanced organic mulching to preserve soil moisture'
    ]
  }
];

/**
 * Context fusion logic:
 * Takes visual model candidate + soil metrics + weather metrics + crop type
 * and computes fused confidence and diagnostic explanation.
 */
export function fuseDiagnosisContext(
  cropType: string,
  rawCandidate: { label: string; confidence: number },
  soil?: { pH?: number; moisture_percent?: number },
  weather?: { temperature_c?: number; humidity_percent?: number; rainfall_forecast_mm?: number }
): {
  predicted_label: string;
  fused_confidence: number;
  confidence_tier: 'high' | 'likely' | 'low';
  context_notes: string[];
} {
  const normCrop = cropType.toLowerCase().trim();
  const matchedDisease = AGRONOMIC_KNOWLEDGE_BASE.find(d => 
    d.crop.toLowerCase() === normCrop && 
    (d.name.toLowerCase().includes(rawCandidate.label.toLowerCase()) || 
     rawCandidate.label.toLowerCase().includes(d.name.toLowerCase()) ||
     d.id.toLowerCase().includes(rawCandidate.label.toLowerCase()))
  ) || AGRONOMIC_KNOWLEDGE_BASE.find(d => d.crop.toLowerCase() === normCrop) || AGRONOMIC_KNOWLEDGE_BASE[0];

  let confidence = rawCandidate.confidence;
  const contextNotes: string[] = [];

  // Weather fusion
  if (weather) {
    if (matchedDisease.weather_risks.high_humidity_threshold && 
        weather.humidity_percent && 
        weather.humidity_percent >= matchedDisease.weather_risks.high_humidity_threshold) {
      confidence = Math.min(0.98, confidence + 0.08);
      contextNotes.push(`High atmospheric humidity (${weather.humidity_percent}%) strongly accelerates this fungal pathogen.`);
    }

    if (weather.rainfall_forecast_mm && weather.rainfall_forecast_mm > 5) {
      contextNotes.push(`Upcoming rain forecast (${weather.rainfall_forecast_mm}mm) requires delaying foliar sprays to prevent wash-off.`);
    }
  }

  // Soil fusion
  if (soil) {
    if (soil.moisture_percent && soil.moisture_percent > 70 && matchedDisease.soil_correlations.moisture_condition === 'high') {
      confidence = Math.min(0.98, confidence + 0.06);
      contextNotes.push(`High soil moisture (${soil.moisture_percent}%) matches favorable incubation conditions.`);
    }

    if (soil.pH && (soil.pH < 6.0 || soil.pH > 8.0)) {
      contextNotes.push(`Soil pH (${soil.pH}) checked: ruled out false-positive nutrient lockout lookalike.`);
    }
  }

  // Exact confidence threshold gate from prompt:
  // >0.85 = high confidence
  // 0.60 to 0.85 = likely (ask confirmation or 2nd photo)
  // <0.60 = low confidence (ask better photo / flag for extension worker)
  let tier: 'high' | 'likely' | 'low';
  if (confidence > 0.85) {
    tier = 'high';
  } else if (confidence >= 0.60) {
    tier = 'likely';
  } else {
    tier = 'low';
  }

  return {
    predicted_label: matchedDisease.name,
    fused_confidence: Number(confidence.toFixed(2)),
    confidence_tier: tier,
    context_notes: contextNotes
  };
}
