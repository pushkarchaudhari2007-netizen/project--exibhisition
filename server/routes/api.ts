/**
 * Express REST API Routes for GreenCoach AI
 * Source of Truth: PRD Section 28 & API Contracts
 */

import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { diseaseModel } from '../ai/diseaseModel.js';
import { hariyaVoiceEngine } from '../ai/ragAdvisories.js';
import { FarmFitnessScoreService } from '../services/scoringService.js';
import { HealthWellnessService } from '../services/healthService.js';
import { SyncPayloadItem, TreatmentLog, HealthMetric, Diagnosis } from '../../shared/types.js';
import { FIELD_GUIDE_CATALOG, TREATMENT_PRODUCTS_CATALOG, OUTBREAK_FORECASTS } from '../ai/fieldGuideData.js';

export const apiRouter = Router();

// In-memory set for saved favorite treatment products
const favoriteProductIds = new Set<string>(['prod-neem-nske']);

// ==========================================
// 1. AUTH & ROLES
// ==========================================
apiRouter.get('/auth/current', (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'farmer';
  if (role === 'extension_worker') {
    const worker = db.getExtensionWorker('ext-sunita');
    return res.json({
      role: 'extension_worker',
      user: worker
    });
  }
  const farmer = db.getFarmer('farmer-ramesh');
  const farm = db.getFarmsByFarmer('farmer-ramesh')[0];
  return res.json({
    role: 'farmer',
    farmer,
    farm
  });
});

// ==========================================
// 2. FARMERS & FARMS
// ==========================================
apiRouter.get('/farmers/:id', (req: Request, res: Response) => {
  const farmer = db.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
  const farms = db.getFarmsByFarmer(farmer.farmer_id);
  return res.json({ farmer, farms });
});

apiRouter.patch('/farmers/:id', (req: Request, res: Response) => {
  const updated = db.updateFarmer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Farmer not found' });
  return res.json(updated);
});

apiRouter.get('/farms/:id', (req: Request, res: Response) => {
  const farm = db.getFarm(req.params.id);
  if (!farm) return res.status(404).json({ error: 'Farm not found' });
  return res.json(farm);
});

apiRouter.patch('/farms/:id', (req: Request, res: Response) => {
  const updated = db.updateFarm(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Farm not found' });
  return res.json(updated);
});

// ==========================================
// 3. LOCATION & WEATHER (LOCATION-AWARE)
// ==========================================
const CITY_WEATHER_REGISTRY: Record<string, {
  city: string;
  state: string;
  lat: number;
  lng: number;
  baseTemp: number;
  baseHumidity: number;
  wind: number;
  sprayCondition: string;
}> = {
  pune: { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, baseTemp: 31, baseHumidity: 68, wind: 14, sprayCondition: 'Optimal morning window (6:30 - 9:00 AM)' },
  khadakwasla: { city: 'Khadakwasla, Pune', state: 'Maharashtra', lat: 18.432, lng: 73.765, baseTemp: 31, baseHumidity: 70, wind: 12, sprayCondition: 'Optimal morning window (6:30 - 8:30 AM) with low wind.' },
  nashik: { city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, baseTemp: 29, baseHumidity: 64, wind: 12, sprayCondition: 'Safe spray window. Light cool breeze.' },
  nagpur: { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, baseTemp: 34, baseHumidity: 54, wind: 11, sprayCondition: 'High afternoon heat; spray only before 8:30 AM.' },
  satara: { city: 'Satara', state: 'Maharashtra', lat: 17.6805, lng: 74.0183, baseTemp: 28, baseHumidity: 74, wind: 16, sprayCondition: 'High moisture window; observe fungal spore emergence.' },
  ahmednagar: { city: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480, baseTemp: 32, baseHumidity: 58, wind: 13, sprayCondition: 'Good spray conditions until 10:00 AM.' },
  kolhapur: { city: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, baseTemp: 29, baseHumidity: 78, wind: 15, sprayCondition: 'Check rain forecast before foliar application.' },
  aurangabad: { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, baseTemp: 33, baseHumidity: 56, wind: 12, sprayCondition: 'Dry morning spray recommended.' },
  solapur: { city: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, baseTemp: 35, baseHumidity: 50, wind: 14, sprayCondition: 'Extreme mid-day heat. Early morning spray mandatory.' },
  amravati: { city: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796, baseTemp: 33, baseHumidity: 58, wind: 10, sprayCondition: 'Optimal spray window: 6:00 - 8:30 AM.' },
  sangli: { city: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815, baseTemp: 30, baseHumidity: 66, wind: 14, sprayCondition: 'Ideal for bio-fungicide drench.' },
  jalgaon: { city: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626, baseTemp: 36, baseHumidity: 46, wind: 11, sprayCondition: 'High temperature; avoid mid-day copper sprays.' },
  latur: { city: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604, baseTemp: 32, baseHumidity: 60, wind: 12, sprayCondition: 'Calm morning spray window.' },
  mumbai: { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, baseTemp: 32, baseHumidity: 82, wind: 18, sprayCondition: 'High coastal humidity; check leaf wetness duration.' },
  indore: { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, baseTemp: 31, baseHumidity: 60, wind: 12, sprayCondition: 'Optimal early morning window.' },
  bhopal: { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, baseTemp: 32, baseHumidity: 58, wind: 11, sprayCondition: 'Early morning spray recommended.' },
  ujjain: { city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, baseTemp: 31, baseHumidity: 62, wind: 10, sprayCondition: 'Good spray window before 9:30 AM.' },
  ludhiana: { city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, baseTemp: 28, baseHumidity: 65, wind: 10, sprayCondition: 'Favorable spray window.' },
  amritsar: { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, baseTemp: 29, baseHumidity: 62, wind: 11, sprayCondition: 'Calm morning spray conditions.' },
  jalandhar: { city: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, baseTemp: 28, baseHumidity: 64, wind: 9, sprayCondition: 'Optimal humidity window.' },
  ahmedabad: { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, baseTemp: 34, baseHumidity: 52, wind: 13, sprayCondition: 'High daytime heat; spray strictly before 8:30 AM.' },
  rajkot: { city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, baseTemp: 33, baseHumidity: 55, wind: 14, sprayCondition: 'Check wind gust speeds before foliar application.' },
  surat: { city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, baseTemp: 32, baseHumidity: 75, wind: 15, sprayCondition: 'High coastal humidity; check spore germination index.' },
  varanasi: { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, baseTemp: 32, baseHumidity: 65, wind: 9, sprayCondition: 'Calm morning conditions for bio-pesticides.' },
  lucknow: { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, baseTemp: 31, baseHumidity: 63, wind: 10, sprayCondition: 'Ideal morning spray window (6:00 - 9:00 AM).' },
  kanpur: { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, baseTemp: 32, baseHumidity: 60, wind: 11, sprayCondition: 'Moderate humidity spray window.' },
  karnal: { city: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, baseTemp: 29, baseHumidity: 66, wind: 10, sprayCondition: 'Optimal for wheat and paddy foliar treatments.' },
  hisar: { city: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217, baseTemp: 33, baseHumidity: 48, wind: 12, sprayCondition: 'Dry morning spray recommended.' },
  bengaluru: { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, baseTemp: 27, baseHumidity: 70, wind: 12, sprayCondition: 'Pleasant temperature, ideal foliar absorption window.' },
  belagavi: { city: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977, baseTemp: 28, baseHumidity: 76, wind: 14, sprayCondition: 'High moisture window; observe fungal spore emergence.' },
  hyderabad: { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, baseTemp: 32, baseHumidity: 61, wind: 12, sprayCondition: 'Good spray conditions until 9:30 AM.' },
  warangal: { city: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, baseTemp: 33, baseHumidity: 59, wind: 11, sprayCondition: 'Morning spray before heat buildup.' },
  vijayawada: { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, baseTemp: 33, baseHumidity: 72, wind: 13, sprayCondition: 'Humid conditions; monitor fungal blast thresholds.' },
  guntur: { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, baseTemp: 33, baseHumidity: 70, wind: 12, sprayCondition: 'Optimal morning window for chili and cotton.' },
  jaipur: { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, baseTemp: 33, baseHumidity: 45, wind: 13, sprayCondition: 'Low humidity; add surfactant to prevent drift.' },
  jodhpur: { city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, baseTemp: 35, baseHumidity: 40, wind: 15, sprayCondition: 'Dry heat; early dawn spraying mandatory.' },
  coimbatore: { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, baseTemp: 29, baseHumidity: 68, wind: 11, sprayCondition: 'Good morning window with calm breeze.' },
  madurai: { city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, baseTemp: 33, baseHumidity: 65, wind: 12, sprayCondition: 'Spray before mid-day heat.' },
  burdwan: { city: 'Burdwan', state: 'West Bengal', lat: 23.2324, lng: 87.8615, baseTemp: 31, baseHumidity: 78, wind: 10, sprayCondition: 'High moisture window for paddy fields.' },
  kolkata: { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, baseTemp: 32, baseHumidity: 80, wind: 12, sprayCondition: 'Humid conditions; inspect blast and sheath blight.' },
  patna: { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, baseTemp: 32, baseHumidity: 67, wind: 10, sprayCondition: 'Favorable morning spraying window.' },
  muzaffarpur: { city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, baseTemp: 31, baseHumidity: 70, wind: 9, sprayCondition: 'Calm morning conditions for orchard and field sprays.' }
};

apiRouter.get('/location/city', (req: Request, res: Response) => {
  const reqLat = Number(req.query.lat);
  const reqLng = Number(req.query.lng);

  if (isNaN(reqLat) || isNaN(reqLng)) {
    return res.json({ city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 });
  }

  let closestKey = 'pune';
  let minDistance = Number.MAX_VALUE;
  for (const [key, meta] of Object.entries(CITY_WEATHER_REGISTRY)) {
    const dist = Math.hypot(meta.lat - reqLat, meta.lng - reqLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestKey = key;
    }
  }

  const matched = CITY_WEATHER_REGISTRY[closestKey];
  return res.json({
    city: matched.city,
    state: matched.state,
    lat: matched.lat,
    lng: matched.lng
  });
});

apiRouter.get('/weather/current', (req: Request, res: Response) => {
  const reqCity = (req.query.city as string)?.toLowerCase().trim();
  const reqLat = req.query.lat ? Number(req.query.lat) : null;
  const reqLng = req.query.lng ? Number(req.query.lng) : null;

  let matchedCityMeta = reqCity && CITY_WEATHER_REGISTRY[reqCity] 
    ? CITY_WEATHER_REGISTRY[reqCity] 
    : null;

  if (!matchedCityMeta && reqCity) {
    for (const [key, meta] of Object.entries(CITY_WEATHER_REGISTRY)) {
      if (key.includes(reqCity) || meta.city.toLowerCase().includes(reqCity)) {
        matchedCityMeta = meta;
        break;
      }
    }
  }

  if (!matchedCityMeta) {
    if (reqLat !== null && reqLng !== null) {
      let closestKey = 'pune';
      let minDistance = Number.MAX_VALUE;
      for (const [key, meta] of Object.entries(CITY_WEATHER_REGISTRY)) {
        const dist = Math.hypot(meta.lat - reqLat, meta.lng - reqLng);
        if (dist < minDistance) {
          minDistance = dist;
          closestKey = key;
        }
      }
      matchedCityMeta = CITY_WEATHER_REGISTRY[closestKey];
    } else {
      matchedCityMeta = CITY_WEATHER_REGISTRY.pune;
    }
  }

  const tempC = Number(req.query.temp || matchedCityMeta.baseTemp);
  const humidity = Number(req.query.humidity || matchedCityMeta.baseHumidity);
  const rainfallForecast = Number(req.query.rain || 0);

  const heatData = HealthWellnessService.calculateHeatIndex(tempC, humidity);

  return res.json({
    city: matchedCityMeta.city,
    state: matchedCityMeta.state,
    location: `${matchedCityMeta.city}, ${matchedCityMeta.state}`,
    lat: matchedCityMeta.lat,
    lng: matchedCityMeta.lng,
    temperature_c: tempC,
    humidity_percent: humidity,
    rainfall_forecast_mm: rainfallForecast,
    wind_kmh: matchedCityMeta.wind,
    heat_index: heatData,
    spray_recommendation: rainfallForecast > 2 
      ? 'Rain expected within 24 hours. Postpone foliar spraying.'
      : matchedCityMeta.sprayCondition
  });
});

// ==========================================
// 4. CROP DISEASE DIAGNOSIS (AI + CONTEXT FUSION)
// ==========================================
apiRouter.get('/diagnoses', (req: Request, res: Response) => {
  const farmId = (req.query.farm_id as string) || 'farm-ramesh';
  const list = db.getDiagnosesByFarm(farmId);
  return res.json(list);
});

apiRouter.post('/diagnoses/diagnose', async (req: Request, res: Response) => {
  try {
    const { crop_type, image_base64, soil_snapshot, weather_snapshot, farmer_id, farm_id, language } = req.body;
    
    if (!crop_type || !image_base64) {
      return res.status(400).json({ error: 'crop_type and image_base64 are required' });
    }

    const farmer = db.getFarmer(farmer_id || 'farmer-ramesh');
    const farmerName = farmer?.name || 'Ramesh ji';

    const result = await diseaseModel.diagnose(
      crop_type,
      image_base64,
      soil_snapshot,
      weather_snapshot,
      language || farmer?.language_pref || 'hi',
      farmerName
    );

    // If quality failed, return assessment without saving bad diagnosis
    if (!result.quality.passed) {
      return res.status(422).json({
        quality_failed: true,
        quality: result.quality,
        hariya_explanation: result.hariya_explanation,
        hariya_explanation_local: result.hariya_explanation_local
      });
    }

    // Create diagnosis record
    const newDiag: Diagnosis = {
      diagnosis_id: `diag-${Date.now()}`,
      farm_id: farm_id || 'farm-ramesh',
      farmer_id: farmer_id || 'farmer-ramesh',
      image_url: image_base64.length > 500 ? image_base64.slice(0, 100) + '...[image-data]' : image_base64,
      crop_type,
      detected_plant: result.detected_plant,
      plant_scientific_name: result.plant_scientific_name,
      plant_confidence: result.plant_confidence,
      problem_category: result.problem_category,
      solution_summary: result.solution_summary,
      predicted_label: result.predicted_label,
      confidence_score: result.confidence_score,
      confidence_tier: result.confidence_tier,
      ranked_matches: result.ranked_matches,
      geo_coordinates: req.body.geo_coordinates || {
        lat: 18.432 + (Math.random() - 0.5) * 0.004,
        lng: 73.765 + (Math.random() - 0.5) * 0.004,
        field_zone: 'North Acre Plot'
      },
      model_version: result.model_version,
      soil_data_snapshot: soil_snapshot || {
        pH: 6.8,
        moisture_percent: 60,
        data_source: 'manual_entry',
        recorded_at: new Date().toISOString()
      },
      weather_snapshot: weather_snapshot || {
        temperature_c: 32,
        humidity_percent: 70,
        rainfall_forecast_mm: 0,
        heat_index_c: 36,
        heat_index_level: 'extreme_caution',
        wind_kmh: 12,
        recorded_at: new Date().toISOString()
      },
      context_fusion_notes: result.context_notes,
      treatment_advisory: result.treatment_advisory,
      hariya_explanation: result.hariya_explanation,
      hariya_explanation_local: result.hariya_explanation_local,
      created_at: new Date().toISOString(),
      sync_status: 'synced',
      needs_extension_review: result.needs_extension_review,
      extension_reviewed: false
    };

    db.saveDiagnosis(newDiag);

    return res.json({
      success: true,
      diagnosis: newDiag,
      quality: result.quality
    });
  } catch (err: any) {
    console.error('Diagnosis error:', err);
    return res.status(500).json({ error: err.message || 'Diagnosis failed' });
  }
});

// ==========================================
// 5. TREATMENTS
// ==========================================
apiRouter.get('/treatments', (req: Request, res: Response) => {
  const farmId = (req.query.farm_id as string) || 'farm-ramesh';
  const list = db.getTreatmentsByFarm(farmId);
  return res.json(list);
});

apiRouter.post('/treatments', (req: Request, res: Response) => {
  const { farm_id, farmer_id, diagnosis_id, treatment_type, product_used, verification_flag } = req.body;
  if (!farm_id || !treatment_type || !product_used) {
    return res.status(400).json({ error: 'farm_id, treatment_type, and product_used are required' });
  }

  const newTreatment: TreatmentLog = {
    treatment_id: `treat-${Date.now()}`,
    farm_id,
    farmer_id: farmer_id || 'farmer-ramesh',
    diagnosis_id,
    treatment_type,
    product_used,
    applied_at: new Date().toISOString(),
    marked_complete: true,
    verification_flag: verification_flag || 'self_reported',
    sync_status: 'synced'
  };

  db.saveTreatment(newTreatment);

  // Trigger Farm Fitness recalculation
  const allTreatments = db.getTreatmentsByFarm(farm_id);
  const healthLogs = db.getHealthMetricsByFarmer(farmer_id || 'farmer-ramesh');
  const weekly = FarmFitnessScoreService.calculateWeeklyScore({
    treatments: allTreatments,
    healthLogs,
    soilHistory: []
  });

  const existingScore = db.getGamificationScore(farm_id);
  const updatedRolling = FarmFitnessScoreService.calculateRollingAverage(weekly.raw_total, existingScore ? [existingScore.farm_fitness_score_total] : []);

  if (existingScore) {
    existingScore.pesticide_reduction_score = weekly.pesticide_reduction_score;
    existingScore.farm_fitness_score_total = weekly.raw_total;
    existingScore.rolling_4wk_average = updatedRolling;
    if (treatment_type === 'organic' || treatment_type === 'cultural') {
      existingScore.streak_eco_days += 1;
    }
    db.saveGamificationScore(existingScore);
  }

  return res.json({
    success: true,
    treatment: newTreatment,
    updated_fitness_score: weekly.raw_total
  });
});

// ==========================================
// 6. HEALTH & WELLNESS (CONSENT ENFORCED)
// ==========================================
apiRouter.get('/health/history', (req: Request, res: Response) => {
  const farmerId = (req.query.farmer_id as string) || 'farmer-ramesh';
  const farmer = db.getFarmer(farmerId);

  // Explicit consent gate
  if (!farmer?.consent_health_data) {
    return res.status(403).json({
      error: 'Consent not granted',
      consent_required: true,
      message: 'Health tracking requires explicit farmer consent.'
    });
  }

  const metrics = db.getHealthMetricsByFarmer(farmerId);
  return res.json(metrics);
});

apiRouter.post('/health/checkin', (req: Request, res: Response) => {
  const { farmer_id, event_type, heat_index_value, farmer_response, symptom_level } = req.body;
  const farmer = db.getFarmer(farmer_id || 'farmer-ramesh');

  // Explicit consent verification
  if (!farmer?.consent_health_data) {
    return res.status(403).json({
      error: 'Consent not granted',
      consent_required: true,
      message: 'Cannot record health metrics without farmer consent.'
    });
  }

  const evaluation = HealthWellnessService.evaluateSymptomCheckin(symptom_level || 'normal');

  const newMetric: HealthMetric = {
    health_log_id: `hl-${Date.now()}`,
    farmer_id: farmer_id || 'farmer-ramesh',
    event_type: event_type || 'symptom_checkin',
    heat_index_value: heat_index_value || 35,
    farmer_response: farmer_response || 'acknowledged',
    symptom_level: symptom_level || 'normal',
    action_taken: evaluation.instructions,
    created_at: new Date().toISOString()
  };

  db.saveHealthMetric(newMetric);

  // Update hydration streak if acknowledged
  const farm = db.getFarmsByFarmer(farmer.farmer_id)[0];
  if (farm) {
    const score = db.getGamificationScore(farm.farm_id);
    if (score && farmer_response === 'acknowledged') {
      score.streak_hydration_days += 1;
      db.saveGamificationScore(score);
    }
  }

  return res.json({
    success: true,
    metric: newMetric,
    evaluation
  });
});

// ==========================================
// 7. GAMIFICATION & FARM FITNESS SCORE
// ==========================================
apiRouter.get('/gamification/score', (req: Request, res: Response) => {
  const farmId = (req.query.farm_id as string) || 'farm-ramesh';
  const score = db.getGamificationScore(farmId);
  if (!score) return res.status(404).json({ error: 'Score not found' });
  return res.json(score);
});

apiRouter.get('/leaderboards/village', (_req: Request, res: Response) => {
  const villages = db.getVillages().sort((a, b) => b.average_farm_fitness - a.average_farm_fitness);
  return res.json(villages);
});

apiRouter.get('/leaderboards/farmers', (req: Request, res: Response) => {
  const currentFarmerId = (req.query.current_farmer_id as string) || 'farmer-ramesh';
  const city = (req.query.city as string)?.toLowerCase().trim() || 'pune';
  const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);

  // Generate realistic city-tailored rankings
  const cityFarmersMap: Record<string, { rank: number; name: string; locality: string; score: number; streak: number; isCurrent: boolean }[]> = {
    pune: [
      { rank: 1, name: 'Tukaram Gaikwad', locality: 'Baramati, Pune', score: 94.2, streak: 22, isCurrent: false },
      { rank: 2, name: 'Ananda Jadhav', locality: 'Shirur, Pune', score: 91.5, streak: 17, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Khadakwasla, Pune', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Balasaheb Kadam', locality: 'Haveli, Pune', score: 85.8, streak: 11, isCurrent: false },
      { rank: 5, name: 'Sunita Phalke', locality: 'Junnar, Pune', score: 83.4, streak: 9, isCurrent: false },
      { rank: 6, name: 'Dattatray Shinde', locality: 'Khed, Pune', score: 81.9, streak: 7, isCurrent: false },
      { rank: 7, name: 'Kisanrao More', locality: 'Purandar, Pune', score: 80.2, streak: 6, isCurrent: false }
    ],
    nashik: [
      { rank: 1, name: 'Madhav Raut', locality: 'Dindori, Nashik', score: 95.1, streak: 26, isCurrent: false },
      { rank: 2, name: 'Sharda Tambe', locality: 'Niphad, Nashik', score: 92.0, streak: 19, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Nashik Agro Zone', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Vilas Deore', locality: 'Satana, Nashik', score: 84.7, streak: 8, isCurrent: false },
      { rank: 5, name: 'Eknath Borse', locality: 'Sinnar, Nashik', score: 82.3, streak: 6, isCurrent: false },
      { rank: 6, name: 'Gorakh Patil', locality: 'Yeola, Nashik', score: 80.5, streak: 5, isCurrent: false }
    ],
    satara: [
      { rank: 1, name: 'Pratap Shinde', locality: 'Karad, Satara', score: 93.8, streak: 21, isCurrent: false },
      { rank: 2, name: 'Jaywant Mane', locality: 'Wai, Satara', score: 89.9, streak: 16, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Patan Ridge, Satara', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Laxman Ghadge', locality: 'Koregaon, Satara', score: 86.1, streak: 10, isCurrent: false },
      { rank: 5, name: 'Sambhaji Raje', locality: 'Phaltan, Satara', score: 83.0, streak: 7, isCurrent: false },
      { rank: 6, name: 'Tanaji Bhosale', locality: 'Khandala, Satara', score: 81.4, streak: 6, isCurrent: false }
    ],
    nagpur: [
      { rank: 1, name: 'Harishchandra Ninawe', locality: 'Katol, Nagpur', score: 94.6, streak: 24, isCurrent: false },
      { rank: 2, name: 'Dnyaneshwar Barapatre', locality: 'Kalmeshwar, Nagpur', score: 90.2, streak: 18, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Nagpur Organic Cluster', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Rekha Meshram', locality: 'Saoner, Nagpur', score: 84.9, streak: 9, isCurrent: false },
      { rank: 5, name: 'Chandrakant Kohale', locality: 'Umred, Nagpur', score: 81.7, streak: 6, isCurrent: false }
    ],
    solapur: [
      { rank: 1, name: 'Siddheshwar Birajdar', locality: 'Pandharpur, Solapur', score: 94.8, streak: 25, isCurrent: false },
      { rank: 2, name: 'Mallikarjun Patil', locality: 'Barshi, Solapur', score: 91.2, streak: 17, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'North Solapur Belt', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Ambadas Koli', locality: 'Karmala, Solapur', score: 83.9, streak: 8, isCurrent: false },
      { rank: 5, name: 'Vitthalrao Deshmukh', locality: 'Mohol, Solapur', score: 82.1, streak: 7, isCurrent: false }
    ],
    kolhapur: [
      { rank: 1, name: 'Balasaheb Patil', locality: 'Shirol, Kolhapur', score: 95.4, streak: 27, isCurrent: false },
      { rank: 2, name: 'Rajaram Chougule', locality: 'Hatkanangale, Kolhapur', score: 92.3, streak: 20, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Karveer, Kolhapur', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Sujata Powar', locality: 'Radhanagari, Kolhapur', score: 85.5, streak: 11, isCurrent: false },
      { rank: 5, name: 'Anandrao Yadav', locality: 'Kagal, Kolhapur', score: 83.2, streak: 8, isCurrent: false }
    ],
    ahmednagar: [
      { rank: 1, name: 'Bhausaheb Vikhe', locality: 'Rahata, Ahmednagar', score: 94.0, streak: 23, isCurrent: false },
      { rank: 2, name: 'Dnyandev Gadakh', locality: 'Nevasa, Ahmednagar', score: 90.7, streak: 16, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Sangamner, Ahmednagar', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Shankar Kolhe', locality: 'Kopargaon, Ahmednagar', score: 84.2, streak: 10, isCurrent: false },
      { rank: 5, name: 'Ashok Tanpure', locality: 'Rahuri, Ahmednagar', score: 82.6, streak: 7, isCurrent: false }
    ],
    aurangabad: [
      { rank: 1, name: 'Sayaji Shinde', locality: 'Kannad, Sambhajinagar', score: 93.5, streak: 22, isCurrent: false },
      { rank: 2, name: 'Kalyanrao Kale', locality: 'Gangapur, Sambhajinagar', score: 90.1, streak: 15, isCurrent: false },
      { rank: 3, name: 'Ramesh Patil (You)', locality: 'Paithan Sector', score: 87.3, streak: 12, isCurrent: true },
      { rank: 4, name: 'Kavita Chavan', locality: 'Vaijapur, Sambhajinagar', score: 84.8, streak: 9, isCurrent: false },
      { rank: 5, name: 'Babanrao Autade', locality: 'Khuldabad, Sambhajinagar', score: 82.0, streak: 6, isCurrent: false }
    ]
  };

  const list = cityFarmersMap[city] || [
    { rank: 1, name: `Farmer ${cityCapitalized} Leader`, locality: `${cityCapitalized} North Valley`, score: 93.5, streak: 21, isCurrent: false },
    { rank: 2, name: `Farmer ${cityCapitalized} Senior`, locality: `${cityCapitalized} Central Belt`, score: 90.2, streak: 16, isCurrent: false },
    { rank: 3, name: 'Ramesh Patil (You)', locality: `${cityCapitalized} Farm Parcel`, score: 87.3, streak: 12, isCurrent: true },
    { rank: 4, name: `Farmer ${cityCapitalized} Progressive`, locality: `${cityCapitalized} South Basin`, score: 84.6, streak: 10, isCurrent: false },
    { rank: 5, name: `Farmer ${cityCapitalized} Organic`, locality: `${cityCapitalized} West Ridge`, score: 82.1, streak: 7, isCurrent: false }
  ];

  return res.json({
    city: cityCapitalized,
    district_zone: `${cityCapitalized} Agricultural Cluster`,
    total_farmers_in_city: cityFarmersMap[city] ? 142 : 98,
    current_farmer_rank: 3,
    top_percentile: 'Top 5%',
    city_average_score: 84.8,
    farmers: list
  });
});

apiRouter.get('/challenges', (_req: Request, res: Response) => {
  const challenges = db.getVillageChallenges();
  return res.json(challenges);
});

// ==========================================
// 8. EXTENSION WORKER PORTAL
// ==========================================
apiRouter.get('/extension-workers/reviews', (req: Request, res: Response) => {
  const workerId = (req.query.worker_id as string) || 'ext-sunita';
  const worker = db.getExtensionWorker(workerId);
  const pending = db.getPendingExtensionReviewDiagnoses(worker?.assigned_village_ids);
  return res.json({
    worker,
    pending_count: pending.length,
    reviews: pending
  });
});

apiRouter.post('/extension-workers/reviews/:id', (req: Request, res: Response) => {
  const { notes, corrected_label } = req.body;
  const reviewed = db.reviewDiagnosis(req.params.id, notes || 'Verified by extension officer', corrected_label);
  if (!reviewed) return res.status(404).json({ error: 'Diagnosis not found' });
  return res.json({ success: true, diagnosis: reviewed });
});

apiRouter.post('/extension-workers/broadcast', (req: Request, res: Response) => {
  const { village_ids, message, title } = req.body;
  return res.json({
    success: true,
    broadcast_id: `bcast-${Date.now()}`,
    target_villages: village_ids || ['all'],
    title: title || 'Seasonal Alert',
    message: message || 'Please inspect leaf undersides for early sucking pest attack.'
  });
});

// ==========================================
// 9. OFFLINE SYNC QUEUE
// ==========================================
apiRouter.post('/sync/batch', (req: Request, res: Response) => {
  const items: SyncPayloadItem[] = req.body.items || [];
  const results: { idempotency_key: string; success: boolean; entityId?: string }[] = [];

  for (const item of items) {
    const resItem = db.processSyncQueueItem(item);
    results.push({
      idempotency_key: item.idempotency_key,
      success: resItem.success,
      entityId: resItem.entityId
    });
  }

  return res.json({
    synced_count: results.filter(r => r.success).length,
    total: items.length,
    results
  });
});

// ==========================================
// 10. HARIYA VOICE CHAT
// ==========================================
apiRouter.post('/hariya/chat', async (req: Request, res: Response) => {
  try {
    const { query, language, farmer_id } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const farmer = db.getFarmer(farmer_id || 'farmer-ramesh');
    const farm = db.getFarmsByFarmer(farmer_id || 'farmer-ramesh')[0];

    const voiceResponse = await hariyaVoiceEngine.converse(query, {
      name: farmer?.name || 'Ramesh ji',
      language: language || farmer?.language_pref || 'hi',
      crops: farm?.crop_types || ['cotton', 'tomato'],
      villageName: 'Khadakwasla'
    });

    return res.json(voiceResponse);
  } catch (err: any) {
    console.error('Hariya chat error:', err);
    return res.status(500).json({ error: err.message || 'Hariya conversation failed' });
  }
});

// ==========================================
// 11. FIELD GUIDE & CROP PEST CATALOG
// ==========================================
apiRouter.get('/field-guide', (req: Request, res: Response) => {
  const { category, crop, query } = req.query;
  let items = [...FIELD_GUIDE_CATALOG];

  if (category && category !== 'all') {
    items = items.filter(i => i.category === category);
  }

  if (crop && crop !== 'all') {
    items = items.filter(i => i.crop.toLowerCase() === (crop as string).toLowerCase());
  }

  if (query) {
    const q = (query as string).toLowerCase().trim();
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.scientific_name.toLowerCase().includes(q) ||
      i.symptoms.some(s => s.toLowerCase().includes(q))
    );
  }

  return res.json(items);
});

// ==========================================
// 12. TREATMENT PRODUCTS & FAVORITES
// ==========================================
apiRouter.get('/treatment-products', (_req: Request, res: Response) => {
  const products = TREATMENT_PRODUCTS_CATALOG.map(p => ({
    ...p,
    is_favorite: favoriteProductIds.has(p.id)
  }));
  return res.json(products);
});

apiRouter.get('/favorites', (_req: Request, res: Response) => {
  const favorites = TREATMENT_PRODUCTS_CATALOG
    .filter(p => favoriteProductIds.has(p.id))
    .map(p => ({ ...p, is_favorite: true }));
  return res.json(favorites);
});

apiRouter.post('/favorites/toggle', (req: Request, res: Response) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id is required' });

  if (favoriteProductIds.has(product_id)) {
    favoriteProductIds.delete(product_id);
    return res.json({ product_id, is_favorite: false });
  } else {
    favoriteProductIds.add(product_id);
    return res.json({ product_id, is_favorite: true });
  }
});

// ==========================================
// 13. WEATHER & RICE BLAST OUTBREAK FORECASTS
// ==========================================
apiRouter.get('/forecasts/outbreak', (req: Request, res: Response) => {
  const { crop, city } = req.query;
  const reqCity = (city as string)?.toLowerCase().trim();

  let matchedCityMeta = reqCity && CITY_WEATHER_REGISTRY[reqCity]
    ? CITY_WEATHER_REGISTRY[reqCity]
    : null;

  if (!matchedCityMeta && reqCity) {
    for (const [key, meta] of Object.entries(CITY_WEATHER_REGISTRY)) {
      if (key.includes(reqCity) || meta.city.toLowerCase().includes(reqCity)) {
        matchedCityMeta = meta;
        break;
      }
    }
  }

  if (!matchedCityMeta) {
    matchedCityMeta = CITY_WEATHER_REGISTRY.pune;
  }

  const cityTemp = matchedCityMeta.baseTemp;
  const cityHumidity = matchedCityMeta.baseHumidity;

  // Dynamically compute outbreak risk percentages tuned to the city's microclimate
  let forecasts = OUTBREAK_FORECASTS.map(f => {
    const tuned = { ...f };
    if (f.id === 'forecast-rice-blast') {
      // Rice blast spores trigger heavily with high humidity >70% and leaf wetness
      if (cityHumidity >= 75) {
        tuned.risk_level = 'high';
        tuned.risk_percentage = 88;
        tuned.leaf_wetness_hours = 15;
        tuned.trigger_reason = `High relative humidity (${cityHumidity}%) in ${matchedCityMeta.city} creates critical spore germination risk (>14h dew duration).`;
      } else if (cityHumidity >= 60) {
        tuned.risk_level = 'moderate';
        tuned.risk_percentage = 68;
        tuned.leaf_wetness_hours = 9;
        tuned.trigger_reason = `Moderate atmospheric moisture in ${matchedCityMeta.city} (${cityHumidity}% RH). Early tillers require preventive leaf monitoring.`;
      } else {
        tuned.risk_level = 'low';
        tuned.risk_percentage = 38;
        tuned.leaf_wetness_hours = 5;
        tuned.trigger_reason = `Relatively dry microclimate (${cityHumidity}% RH) in ${matchedCityMeta.city} reduces immediate blast spore proliferation.`;
      }
    } else if (f.id === 'forecast-cotton-bollworm') {
      // Warm dry temperatures accelerate moth emergence
      if (cityTemp >= 33) {
        tuned.risk_level = 'high';
        tuned.risk_percentage = 82;
        tuned.trigger_reason = `Elevated heat units (${cityTemp}°C) in ${matchedCityMeta.city} accelerate nocturnal moth emergence and egg oviposition.`;
      } else {
        tuned.risk_percentage = 60;
      }
    } else if (f.id === 'forecast-tomato-blight') {
      if (cityHumidity >= 70) {
        tuned.risk_level = 'high';
        tuned.risk_percentage = 78;
        tuned.trigger_reason = `Damp canopy microclimate in ${matchedCityMeta.city} accelerates Alternaria leaf spot spread.`;
      }
    }
    return tuned;
  });

  if (crop && crop !== 'all') {
    forecasts = forecasts.filter(f => f.crop.toLowerCase() === (crop as string).toLowerCase());
  }

  return res.json({
    updated_at: new Date().toISOString(),
    city: matchedCityMeta.city,
    state: matchedCityMeta.state,
    temperature_c: cityTemp,
    humidity_percent: cityHumidity,
    forecast_days_horizon: 7,
    active_threats_count: forecasts.length,
    forecasts
  });
});

