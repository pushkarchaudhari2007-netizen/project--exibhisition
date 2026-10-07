/**
 * In-Memory & File-Backed Persistent Database for GreenCoach AI
 * Source of Truth: PRD Database Schema (Section 4.1)
 */

import {
  Farmer, Farm, Village, Diagnosis, TreatmentLog, HealthMetric,
  GamificationScore, VillageChallenge, ExtensionWorker, SyncPayloadItem
} from '../shared/types.js';

export interface DatabaseState {
  villages: Village[];
  extensionWorkers: ExtensionWorker[];
  farmers: Farmer[];
  farms: Farm[];
  diagnoses: Diagnosis[];
  treatments: TreatmentLog[];
  healthMetrics: HealthMetric[];
  gamificationScores: GamificationScore[];
  villageChallenges: VillageChallenge[];
  syncQueue: SyncPayloadItem[];
}

class Database {
  private state: DatabaseState;

  constructor() {
    this.state = this.getInitialSeedData();
  }

  private getInitialSeedData(): DatabaseState {
    const villages: Village[] = [
      {
        village_id: 'vil-ralegan',
        name: 'Ralegan Siddhi',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        extension_worker_id: 'ext-sunita',
        total_farmers: 42,
        average_farm_fitness: 84.6
      },
      {
        village_id: 'vil-hiware',
        name: 'Hiware Bazar',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        extension_worker_id: 'ext-sunita',
        total_farmers: 38,
        average_farm_fitness: 81.2
      },
      {
        village_id: 'vil-khadakwasla',
        name: 'Khadakwasla',
        district: 'Pune',
        state: 'Maharashtra',
        extension_worker_id: 'ext-rajesh',
        total_farmers: 31,
        average_farm_fitness: 78.5
      },
      {
        village_id: 'vil-patan',
        name: 'Patan',
        district: 'Satara',
        state: 'Maharashtra',
        extension_worker_id: 'ext-rajesh',
        total_farmers: 29,
        average_farm_fitness: 76.0
      }
    ];

    const extensionWorkers: ExtensionWorker[] = [
      {
        extension_worker_id: 'ext-sunita',
        name: 'Sunita Deshmukh',
        assigned_village_ids: ['vil-ralegan', 'vil-hiware'],
        org_affiliation: 'Krishi Vigyan Kendra (KVK), Ahmednagar',
        phone_number: '+91 98230 45678'
      },
      {
        extension_worker_id: 'ext-rajesh',
        name: 'Rajesh Patil',
        assigned_village_ids: ['vil-khadakwasla', 'vil-patan'],
        org_affiliation: 'State Agri Extension Office, Pune',
        phone_number: '+91 98221 12345'
      }
    ];

    const farmers: Farmer[] = [
      {
        farmer_id: 'farmer-ramesh',
        name: 'Ramesh Patil',
        village_id: 'vil-khadakwasla',
        language_pref: 'hi',
        phone_number: '******7890',
        onboarded_at: '2026-06-15T08:00:00Z',
        consent_health_data: true,
        consent_leaderboard_public: true,
        emergency_contact: {
          name: 'Priya Patil (Daughter)',
          phone: '+91 98200 99887'
        }
      },
      {
        farmer_id: 'farmer-2',
        name: 'Tukaram Shinde',
        village_id: 'vil-ralegan',
        language_pref: 'mr',
        phone_number: '******4321',
        onboarded_at: '2026-05-10T09:30:00Z',
        consent_health_data: true,
        consent_leaderboard_public: true
      },
      {
        farmer_id: 'farmer-3',
        name: 'Anandi Bai',
        village_id: 'vil-hiware',
        language_pref: 'mr',
        phone_number: '******6543',
        onboarded_at: '2026-05-12T11:00:00Z',
        consent_health_data: true,
        consent_leaderboard_public: false
      },
      {
        farmer_id: 'farmer-4',
        name: 'Balwant Rao',
        village_id: 'vil-patan',
        language_pref: 'mr',
        phone_number: '******9812',
        onboarded_at: '2026-06-01T14:20:00Z',
        consent_health_data: false,
        consent_leaderboard_public: true
      }
    ];

    const farms: Farm[] = [
      {
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        crop_types: ['cotton', 'tomato'],
        acreage: 1.5,
        geo_location: { lat: 18.432, lng: 73.765 },
        soil_type: 'Black Cotton Medium Loam'
      },
      {
        farm_id: 'farm-2',
        farmer_id: 'farmer-2',
        crop_types: ['cotton'],
        acreage: 2.5,
        geo_location: { lat: 19.012, lng: 74.456 },
        soil_type: 'Deep Black Soil'
      },
      {
        farm_id: 'farm-3',
        farmer_id: 'farmer-3',
        crop_types: ['wheat', 'rice'],
        acreage: 1.2,
        geo_location: { lat: 19.102, lng: 74.321 },
        soil_type: 'Alluvial Silt'
      },
      {
        farm_id: 'farm-4',
        farmer_id: 'farmer-4',
        crop_types: ['tomato', 'chili'],
        acreage: 2.0,
        geo_location: { lat: 17.371, lng: 73.901 },
        soil_type: 'Red Sandy Loam'
      }
    ];

    const diagnoses: Diagnosis[] = [
      {
        diagnosis_id: 'diag-seed-1',
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        image_url: '/samples/leaf_cotton_spot.jpg',
        crop_type: 'cotton',
        predicted_label: 'Early Leaf Spot (Cercospora)',
        confidence_score: 0.88,
        confidence_tier: 'high',
        model_version: 'GC-Hybrid-v2.1',
        soil_data_snapshot: {
          pH: 6.8,
          moisture_percent: 62,
          data_source: 'manual_entry',
          recorded_at: '2026-10-02T10:00:00Z'
        },
        weather_snapshot: {
          temperature_c: 31,
          humidity_percent: 78,
          rainfall_forecast_mm: 0,
          heat_index_c: 35,
          heat_index_level: 'extreme_caution',
          wind_kmh: 12,
          recorded_at: '2026-10-02T10:00:00Z'
        },
        context_fusion_notes: ['High ambient humidity (78%) accelerates spore propagation.'],
        treatment_advisory: {
          disease_name: 'Early Leaf Spot (Cercospora)',
          severity: 'moderate',
          eco_first_remedies: [
            {
              step: 1,
              title: 'Neem Seed Kernel Extract Spray (NSKE 5%)',
              instructions: 'Mix 50g neem seed kernel per litre of clean water. Strain through muslin cloth and spray during early morning.',
              category: 'organic_spray',
              materials_needed: ['Neem seeds or 5% NSKE', 'Clean water']
            }
          ],
          preventive_measures: ['Keep bottom canopy aerated', 'Avoid flood wetting lower stems'],
          follow_up_days: 3
        },
        hariya_explanation: 'This looks like early leaf spot, I am confident (88%). It often appears after high humidity. Let us fix it together with eco-friendly neem oil.',
        hariya_explanation_local: {
          hi: 'यह पत्ती धब्बा रोग (अगेती लीफ स्पॉट) लग रहा है। मैं 88% आश्वस्त हूँ। आइए इसे प्राकृतिक नीम अर्क से ठीक करें।',
          mr: 'हा पानांवरील ठिपके रोग वाटतो, मला ८८% खात्री आहे. आपण सेंद्रिय निंबोळी अर्काने हा बरा करू.'
        },
        created_at: '2026-10-02T10:15:00Z',
        sync_status: 'synced',
        needs_extension_review: false
      },
      {
        diagnosis_id: 'diag-seed-2',
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        image_url: '/samples/leaf_tomato_blight.jpg',
        crop_type: 'tomato',
        predicted_label: 'Early Blight (Alternaria)',
        confidence_score: 0.54,
        confidence_tier: 'low',
        model_version: 'GC-Hybrid-v2.1',
        soil_data_snapshot: {
          pH: 7.1,
          moisture_percent: 55,
          data_source: 'manual_entry',
          recorded_at: '2026-10-04T15:30:00Z'
        },
        weather_snapshot: {
          temperature_c: 32,
          humidity_percent: 65,
          rainfall_forecast_mm: 2,
          heat_index_c: 36,
          heat_index_level: 'extreme_caution',
          wind_kmh: 10,
          recorded_at: '2026-10-04T15:30:00Z'
        },
        context_fusion_notes: ['Low visual confidence (54%) - image has glare on lower leaf.'],
        treatment_advisory: {
          disease_name: 'Unconfirmed Early Blight / Nutrient Flecking',
          severity: 'mild',
          eco_first_remedies: [
            {
              step: 1,
              title: 'Sour Buttermilk (Khatta Chhachh) Spray',
              instructions: 'Mild preventive spray while awaiting agronomist review.',
              category: 'biological',
              materials_needed: ['Sour buttermilk', 'Turmeric']
            }
          ],
          preventive_measures: ['Prune lowest touching leaves'],
          follow_up_days: 2
        },
        hariya_explanation: 'I am not fully sure from this photo (54%) — could you take one more picture in better light? I have also flagged this for Sunita ji to check.',
        hariya_explanation_local: {
          hi: 'मैं इस फोटो से पूरी तरह सुनिश्चित नहीं हूँ (54%) - क्या आप अच्छी रोशनी में एक और फोटो ले सकते हैं? मैंने इसे सुनीता जी को भी भेज दिया है।',
          mr: 'या फोटोवरून मला पूर्ण खात्री नाही (५४%) — कृपया चांगल्या प्रकाशात दुसरा फोटो घ्या. मी हे सुनीता ताईंकडे तपासणीसाठी पाठवले आहे.'
        },
        created_at: '2026-10-04T15:40:00Z',
        sync_status: 'synced',
        needs_extension_review: true,
        extension_reviewed: false
      }
    ];

    const treatments: TreatmentLog[] = [
      {
        treatment_id: 'treat-1',
        diagnosis_id: 'diag-seed-1',
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        treatment_type: 'organic',
        product_used: 'Neem Seed Kernel Extract 5% (NSKE)',
        applied_at: '2026-10-03T07:30:00Z',
        marked_complete: true,
        verification_flag: 'self_reported',
        sync_status: 'synced'
      },
      {
        treatment_id: 'treat-2',
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        treatment_type: 'cultural',
        product_used: 'Lower Canopy Pruning & Straw Mulch',
        applied_at: '2026-10-04T08:00:00Z',
        marked_complete: true,
        verification_flag: 'self_reported',
        sync_status: 'synced'
      }
    ];

    const healthMetrics: HealthMetric[] = [
      {
        health_log_id: 'hl-1',
        farmer_id: 'farmer-ramesh',
        event_type: 'heat_alert',
        heat_index_value: 36,
        farmer_response: 'acknowledged',
        symptom_level: 'normal',
        action_taken: 'Rested 15 mins under banyan tree shade with cold water',
        created_at: '2026-10-04T13:30:00Z'
      },
      {
        health_log_id: 'hl-2',
        farmer_id: 'farmer-ramesh',
        event_type: 'hydration_reminder',
        heat_index_value: 35,
        farmer_response: 'acknowledged',
        symptom_level: 'normal',
        action_taken: 'Drank 500ml water',
        created_at: '2026-10-05T11:00:00Z'
      }
    ];

    const gamificationScores: GamificationScore[] = [
      {
        score_id: 'score-ramesh',
        farm_id: 'farm-ramesh',
        farmer_id: 'farmer-ramesh',
        week_start_date: '2026-10-01',
        pesticide_reduction_score: 95,
        soil_health_score: 82,
        water_efficiency_score: 80,
        health_compliance_score: 90,
        followthrough_score: 88,
        farm_fitness_score_total: 87.3,
        rolling_4wk_average: 85.1,
        streak_eco_days: 12,
        streak_hydration_days: 6,
        grace_days_remaining: 1,
        badges: [
          {
            id: 'badge-organic-season',
            title: '50% Organic Season',
            title_local: { hi: '50% जैविक फसल', mr: '५०% सेंद्रिय हंगाम' },
            description: 'Maintained over 50% non-chemical pest management throughout current season.',
            icon: 'leaf',
            unlocked_at: '2026-09-20'
          },
          {
            id: 'badge-heat-safe',
            title: 'Heat-Safe Harvest',
            title_local: { hi: 'सुरक्षित धूप रक्षक', mr: 'उष्णता-सुरक्षित शेतकरी' },
            description: 'Acknowledged heat alerts and stayed hydrated across 5 consecutive hot days.',
            icon: 'shield-sun',
            unlocked_at: '2026-10-04'
          },
          {
            id: 'badge-water-saver',
            title: 'Water Saver',
            title_local: { hi: 'जल संरक्षक', mr: 'पाणी बचतकर्ता' },
            description: 'Optimized irrigation timings according to soil moisture forecasts.',
            icon: 'droplets',
            unlocked_at: '2026-09-15'
          }
        ]
      }
    ];

    const villageChallenges: VillageChallenge[] = [
      {
        challenge_id: 'chal-kharif-2026',
        season: 'Kharif 2026',
        title: 'Kharif 2026 Clean Soil & Eco-Pesticide Cup',
        participating_village_ids: ['vil-ralegan', 'vil-hiware', 'vil-khadakwasla', 'vil-patan'],
        start_date: '2026-07-01',
        end_date: '2026-11-15',
        scoring_method: 'average_score_improvement_normalized',
        status: 'active'
      }
    ];

    return {
      villages,
      extensionWorkers,
      farmers,
      farms,
      diagnoses,
      treatments,
      healthMetrics,
      gamificationScores,
      villageChallenges,
      syncQueue: []
    };
  }

  // --- Farmer Operations ---
  getFarmer(farmerId: string): Farmer | undefined {
    return this.state.farmers.find(f => f.farmer_id === farmerId);
  }

  updateFarmer(farmerId: string, updates: Partial<Farmer>): Farmer | null {
    const idx = this.state.farmers.findIndex(f => f.farmer_id === farmerId);
    if (idx === -1) return null;
    this.state.farmers[idx] = { ...this.state.farmers[idx], ...updates };
    return this.state.farmers[idx];
  }

  // --- Farm Operations ---
  getFarm(farmId: string): Farm | undefined {
    return this.state.farms.find(f => f.farm_id === farmId);
  }

  getFarmsByFarmer(farmerId: string): Farm[] {
    return this.state.farms.filter(f => f.farmer_id === farmerId);
  }

  updateFarm(farmId: string, updates: Partial<Farm>): Farm | null {
    const idx = this.state.farms.findIndex(f => f.farm_id === farmId);
    if (idx === -1) return null;
    this.state.farms[idx] = { ...this.state.farms[idx], ...updates };
    return this.state.farms[idx];
  }

  // --- Diagnoses ---
  getDiagnosesByFarm(farmId: string): Diagnosis[] {
    return this.state.diagnoses
      .filter(d => d.farm_id === farmId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAllDiagnoses(): Diagnosis[] {
    return this.state.diagnoses;
  }

  getPendingExtensionReviewDiagnoses(villageIds?: string[]): Diagnosis[] {
    return this.state.diagnoses.filter(d => {
      if (!d.needs_extension_review || d.extension_reviewed) return false;
      if (!villageIds || villageIds.length === 0) return true;
      const farmer = this.getFarmer(d.farmer_id);
      return farmer && villageIds.includes(farmer.village_id);
    });
  }

  saveDiagnosis(diagnosis: Diagnosis): Diagnosis {
    const existingIdx = this.state.diagnoses.findIndex(d => d.diagnosis_id === diagnosis.diagnosis_id);
    if (existingIdx >= 0) {
      this.state.diagnoses[existingIdx] = diagnosis;
    } else {
      this.state.diagnoses.unshift(diagnosis);
    }
    return diagnosis;
  }

  reviewDiagnosis(diagnosisId: string, notes: string, correctedLabel?: string): Diagnosis | null {
    const diag = this.state.diagnoses.find(d => d.diagnosis_id === diagnosisId);
    if (!diag) return null;
    diag.extension_reviewed = true;
    diag.extension_notes = notes;
    if (correctedLabel) {
      diag.predicted_label = correctedLabel;
      diag.confidence_score = 0.95;
      diag.confidence_tier = 'high';
    }
    return diag;
  }

  // --- Treatments ---
  getTreatmentsByFarm(farmId: string): TreatmentLog[] {
    return this.state.treatments.filter(t => t.farm_id === farmId);
  }

  saveTreatment(treatment: TreatmentLog): TreatmentLog {
    const existingIdx = this.state.treatments.findIndex(t => t.treatment_id === treatment.treatment_id);
    if (existingIdx >= 0) {
      this.state.treatments[existingIdx] = treatment;
    } else {
      this.state.treatments.unshift(treatment);
    }
    return treatment;
  }

  // --- Health Metrics ---
  getHealthMetricsByFarmer(farmerId: string): HealthMetric[] {
    return this.state.healthMetrics.filter(h => h.farmer_id === farmerId);
  }

  saveHealthMetric(metric: HealthMetric): HealthMetric {
    this.state.healthMetrics.unshift(metric);
    return metric;
  }

  // --- Gamification & Scores ---
  getGamificationScore(farmId: string): GamificationScore | undefined {
    return this.state.gamificationScores.find(g => g.farm_id === farmId);
  }

  saveGamificationScore(score: GamificationScore): GamificationScore {
    const idx = this.state.gamificationScores.findIndex(g => g.farm_id === score.farm_id);
    if (idx >= 0) {
      this.state.gamificationScores[idx] = score;
    } else {
      this.state.gamificationScores.push(score);
    }
    return score;
  }

  // --- Villages & Leaderboards ---
  getVillages(): Village[] {
    return this.state.villages;
  }

  getVillage(villageId: string): Village | undefined {
    return this.state.villages.find(v => v.village_id === villageId);
  }

  getVillageChallenges(): VillageChallenge[] {
    return this.state.villageChallenges;
  }

  getExtensionWorker(workerId: string): ExtensionWorker | undefined {
    return this.state.extensionWorkers.find(e => e.extension_worker_id === workerId);
  }

  // --- Sync Queue & Idempotency ---
  processSyncQueueItem(item: SyncPayloadItem): { success: boolean; entityId?: string } {
    switch (item.entity_type) {
      case 'diagnosis': {
        const diag: Diagnosis = { ...item.data, sync_status: 'synced' };
        this.saveDiagnosis(diag);
        return { success: true, entityId: diag.diagnosis_id };
      }
      case 'treatment': {
        const treat: TreatmentLog = { ...item.data, sync_status: 'synced' };
        this.saveTreatment(treat);
        return { success: true, entityId: treat.treatment_id };
      }
      case 'health_metric': {
        const health: HealthMetric = item.data;
        this.saveHealthMetric(health);
        return { success: true, entityId: health.health_log_id };
      }
      case 'farm_update': {
        const farm: Farm = item.data;
        this.updateFarm(farm.farm_id, farm);
        return { success: true, entityId: farm.farm_id };
      }
      default:
        return { success: false };
    }
  }
}

export const db = new Database();
