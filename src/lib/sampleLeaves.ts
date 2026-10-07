/**
 * Curated high-resolution SVG/data leaf representations for realistic in-app diagnosis testing
 * Covers comprehensive crop species:
 * Cotton, Tomato, Rice, Wheat, Sugarcane, Soybean, Onion, Potato, Maize, Chili, Banana, Grape, Groundnut, Citrus, Healthy
 * plus Quality Edge Cases (Blurry & Dark)
 */

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  plantName: string;
  expectedDisease: string;
  description: string;
  dataUri: string;
  isQualityFailure?: boolean;
  failureType?: 'blur' | 'dark' | 'noleaf';
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-cotton-spot',
    name: 'Cotton Leaf · Cercospora Leaf Spot',
    crop: 'cotton',
    plantName: 'Cotton (Gossypium hirsutum)',
    expectedDisease: 'Early Leaf Spot (Cercospora)',
    description: 'Cotton leaf exhibiting concentric reddish-brown fungal lesions.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%232d3748"/><path d="M150 40 C70 90 60 210 150 270 C240 210 230 90 150 40 Z" fill="%232e7d32"/><path d="M150 40 L150 270" stroke="%231b5e20" stroke-width="4"/><circle cx="110" cy="120" r="16" fill="%238d2d1e" stroke="%235c1d13" stroke-width="3"/><circle cx="180" cy="160" r="22" fill="%238d2d1e" stroke="%235c1d13" stroke-width="3"/><circle cx="130" cy="200" r="14" fill="%238d2d1e" stroke="%235c1d13" stroke-width="3"/></svg>'
  },
  {
    id: 'sample-tomato-blight',
    name: 'Tomato Leaf · Early Blight Bullseye',
    crop: 'tomato',
    plantName: 'Tomato (Solanum lycopersicum)',
    expectedDisease: 'Early Blight (Alternaria solani)',
    description: 'Tomato leaf showing characteristic chlorotic yellowing and concentric target-board lesions.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231a202c"/><path d="M150 30 C50 80 50 220 150 280 C250 220 250 80 150 30 Z" fill="%23388e3c"/><path d="M150 30 L150 280" stroke="%232e7d32" stroke-width="4"/><circle cx="130" cy="110" r="24" fill="%236d4c41" stroke="%23fbc02d" stroke-width="6"/><circle cx="170" cy="180" r="20" fill="%236d4c41" stroke="%23fbc02d" stroke-width="5"/></svg>'
  },
  {
    id: 'sample-rice-blast',
    name: 'Rice Leaf · Spindle Blast Lesion',
    crop: 'rice',
    plantName: 'Rice / Paddy (Oryza sativa)',
    expectedDisease: 'Rice Blast (Magnaporthe oryzae)',
    description: 'Rice blade displaying diamond-shaped lesions with ash-grey center.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><path d="M120 10 L160 10 L190 290 L150 290 Z" fill="%2365a30d"/><polygon points="155,90 170,120 155,150 140,120" fill="%23cbd5e1" stroke="%2378350f" stroke-width="4"/><polygon points="155,180 168,205 155,230 142,205" fill="%23cbd5e1" stroke="%2378350f" stroke-width="3"/></svg>'
  },
  {
    id: 'sample-sugarcane-redrot',
    name: 'Sugarcane Leaf · Red Rot Lesion',
    crop: 'sugarcane',
    plantName: 'Sugarcane (Saccharum officinarum)',
    expectedDisease: 'Red Rot (Colletotrichum falcatum)',
    description: 'Sugarcane midrib displaying diagnostic dark red lesions with white cross patches.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231e293b"/><path d="M130 10 L170 10 L180 290 L120 290 Z" fill="%234d7c0f"/><rect x="145" y="60" width="10" height="180" fill="%23b91c1c"/><rect x="143" y="100" width="14" height="25" fill="%23ffffff"/><rect x="143" y="160" width="14" height="25" fill="%23ffffff"/></svg>'
  },
  {
    id: 'sample-soybean-rust',
    name: 'Soybean Leaf · Asian Soybean Rust',
    crop: 'soybean',
    plantName: 'Soybean (Glycine max)',
    expectedDisease: 'Asian Soybean Rust (Phakopsora pachyrhizi)',
    description: 'Trifoliate soybean leaf with tiny polygonal tan lesions and fungal uredinia.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%2318181b"/><path d="M150 50 C100 80 100 180 150 230 C200 180 200 80 150 50 Z" fill="%233f6212"/><circle cx="130" cy="110" r="5" fill="%23ca8a04"/><circle cx="160" cy="130" r="6" fill="%23ca8a04"/><circle cx="140" cy="160" r="5" fill="%23ca8a04"/><circle cx="170" cy="180" r="5" fill="%23ca8a04"/><circle cx="135" cy="190" r="4" fill="%23ca8a04"/></svg>'
  },
  {
    id: 'sample-onion-purple-blotch',
    name: 'Onion Foliage · Purple Blotch',
    crop: 'onion',
    plantName: 'Onion (Allium cepa)',
    expectedDisease: 'Purple Blotch (Alternaria porri)',
    description: 'Tubular onion leaves showing water-soaked spots turning purple-brown.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><path d="M140 20 C150 100 160 200 160 280 L140 280 C135 200 130 100 140 20 Z" fill="%2315803d"/><ellipse cx="145" cy="140" rx="14" ry="24" fill="%236b21a8" stroke="%233b0764" stroke-width="2"/><ellipse cx="145" cy="140" rx="7" ry="12" fill="%23a855f7"/></svg>'
  },
  {
    id: 'sample-potato-late-blight',
    name: 'Potato Leaf · Late Blight Decay',
    crop: 'potato',
    plantName: 'Potato (Solanum tuberosum)',
    expectedDisease: 'Late Blight (Phytophthora infestans)',
    description: 'Potato foliage exhibiting fast-spreading water-soaked dark lesions and white sporulation.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231e1b4b"/><path d="M150 40 C70 90 70 210 150 270 C230 210 230 90 150 40 Z" fill="%23166534"/><path d="M110 90 C80 120 90 160 120 150 Z" fill="%231c1917" stroke="%23e2e8f0" stroke-width="3"/><path d="M170 170 C140 190 160 230 190 220 Z" fill="%231c1917" stroke="%23e2e8f0" stroke-width="3"/></svg>'
  },
  {
    id: 'sample-maize-armyworm',
    name: 'Maize Whorl · Fall Armyworm Damage',
    crop: 'maize',
    plantName: 'Maize / Corn (Zea mays)',
    expectedDisease: 'Fall Armyworm Infestation (Spodoptera frugiperda)',
    description: 'Maize funnel whorl leaves with windowing damage, shot holes, and sawdust-like frass.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23172554"/><path d="M110 30 L150 150 L190 30 L220 280 L80 280 Z" fill="%234d7c0f"/><circle cx="140" cy="110" r="12" fill="%23172554"/><circle cx="165" cy="130" r="9" fill="%23172554"/><circle cx="150" cy="180" r="16" fill="%23713f12"/></svg>'
  },
  {
    id: 'sample-chili-anthracnose',
    name: 'Chili Leaf & Fruit · Anthracnose Rot',
    crop: 'chili',
    plantName: 'Chili / Pepper (Capsicum annuum)',
    expectedDisease: 'Anthracnose / Fruit Rot (Colletotrichum capsici)',
    description: 'Chili leaf and pod showing sunken circular lesions with dark concentric rings.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23262626"/><path d="M150 40 C100 80 110 200 150 260 C190 200 200 80 150 40 Z" fill="%2315803d"/><circle cx="145" cy="130" r="20" fill="%23450a0a" stroke="%23ea580c" stroke-width="4"/><circle cx="145" cy="130" r="10" fill="%23000000"/></svg>'
  },
  {
    id: 'sample-banana-sigatoka',
    name: 'Banana Leaf · Black Sigatoka Spot',
    crop: 'banana',
    plantName: 'Banana (Musa acuminata)',
    expectedDisease: 'Black Sigatoka (Mycosphaerella fijiensis)',
    description: 'Broad banana leaf showing linear reddish-brown streaks parallel to leaf veins.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23052e16"/><rect x="60" y="30" width="180" height="240" rx="40" fill="%2322c55e"/><line x1="150" y1="30" x2="150" y2="270" stroke="%2315803d" stroke-width="6"/><rect x="80" y="90" width="50" height="8" rx="4" fill="%237f1d1d"/><rect x="170" y="140" width="60" height="10" rx="4" fill="%237f1d1d"/><rect x="90" y="190" width="45" height="9" rx="4" fill="%237f1d1d"/></svg>'
  },
  {
    id: 'sample-grape-downy',
    name: 'Grape Leaf · Downy Mildew Oily Spot',
    crop: 'grapes',
    plantName: 'Grape (Vitis vinifera)',
    expectedDisease: 'Downy Mildew (Plasmopara viticola)',
    description: 'Grapevine foliage with yellowish "oil-spot" lesions on upper surface and downy growth beneath.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231c1917"/><path d="M150 40 L190 100 L250 110 L210 170 L230 240 L150 200 L70 240 L90 170 L50 110 L110 100 Z" fill="%2315803d"/><circle cx="120" cy="130" r="22" fill="%23ca8a04" opacity="0.85"/><circle cx="180" cy="150" r="26" fill="%23ca8a04" opacity="0.85"/></svg>'
  },
  {
    id: 'sample-healthy-tomato',
    name: 'Healthy Tomato Leaf · Vigor Test',
    crop: 'tomato',
    plantName: 'Tomato (Solanum lycopersicum)',
    expectedDisease: 'Healthy Leaf (No Disease Detected)',
    description: 'Vigorous deep green leaf free from fungal spores, lesions, or insect bites.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%2314532d"/><path d="M150 30 C70 80 60 210 150 270 C240 210 230 80 150 30 Z" fill="%2316a34a"/><path d="M150 30 L150 270" stroke="%2315803d" stroke-width="4"/><path d="M150 100 L110 80 M150 150 L100 130 M150 200 L110 180 M150 100 L190 80 M150 150 L200 130 M150 200 L190 180" stroke="%2315803d" stroke-width="3"/></svg>'
  },
  {
    id: 'sample-quality-blur',
    name: 'Blurry Leaf (Quality Test)',
    crop: 'cotton',
    plantName: 'Unknown (Camera Shake)',
    expectedDisease: 'Reject (Blurry)',
    description: 'Simulates camera shake and out-of-focus leaf requiring farmer retake.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><filter id="blur"><feGaussianBlur stdDeviation="12"/></filter><rect width="300" height="300" fill="%2322c55e" filter="url(%23blur)"/><circle cx="150" cy="150" r="60" fill="%23991b1b" filter="url(%23blur)"/><!-- simulate_blur --></svg>',
    isQualityFailure: true,
    failureType: 'blur'
  },
  {
    id: 'sample-quality-dark',
    name: 'Dark Night Leaf (Quality Test)',
    crop: 'tomato',
    plantName: 'Unknown (Low Light)',
    expectedDisease: 'Reject (Too Dark)',
    description: 'Simulates insufficient lighting in evening without flash.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23020617"/><circle cx="150" cy="150" r="70" fill="%23052e16"/><!-- simulate_dark --></svg>',
    isQualityFailure: true,
    failureType: 'dark'
  }
];
