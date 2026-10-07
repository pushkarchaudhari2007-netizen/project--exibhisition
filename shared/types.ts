/**
 * GreenCoach AI - Shared Type Definitions
 * Source of Truth: PRD, Architecture, and Database Schema Specifications
 */

export type LanguageCode = 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'pa' | 'en';

export interface Village {
  village_id: string;
  name: string;
  district: string;
  state: string;
  extension_worker_id?: string;
  total_farmers: number;
  average_farm_fitness: number;
}

export interface Farmer {
  farmer_id: string;
  name: string;
  village_id: string;
  language_pref: LanguageCode;
  phone_number: string; // hashed/masked in responses
  onboarded_at: string;
  consent_health_data: boolean;
  consent_leaderboard_public: boolean;
  emergency_contact?: {
    name: string;
    phone: string;
  };
}

export interface Farm {
  farm_id: string;
  farmer_id: string;
  crop_types: string[]; // e.g. ["cotton", "tomato", "wheat"]
  acreage: number;
  geo_location: {
    lat: number;
    lng: number;
    elevation_m?: number;
  };
  soil_type?: string;
}

export type SyncStatus = 'local_only' | 'synced' | 'conflict';

export interface SoilDataSnapshot {
  pH: number;
  moisture_percent: number;
  nitrogen_ppm?: number;
  phosphorus_ppm?: number;
  potassium_ppm?: number;
  data_source: 'manual_entry' | 'bluetooth_probe' | 'village_iot_station';
  recorded_at: string;
}

export interface WeatherSnapshot {
  temperature_c: number;
  humidity_percent: number;
  rainfall_forecast_mm: number;
  heat_index_c: number;
  heat_index_level: 'normal' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';
  wind_kmh: number;
  recorded_at: string;
}

export type ConfidenceTier = 'high' | 'likely' | 'low';

export interface RankedMatch {
  label: string;
  category: 'disease' | 'pest' | 'weed';
  confidence_score: number; // 0.0 to 1.0
  description: string;
  key_symptom: string;
}

export interface Diagnosis {
  diagnosis_id: string;
  farm_id: string;
  farmer_id: string;
  image_url: string;
  crop_type: string;
  detected_plant?: string; // AI recognized plant species
  plant_scientific_name?: string; // Botanical name of identified plant
  plant_confidence?: number; // 0.0 to 1.0 confidence of plant recognition
  problem_category?: 'disease' | 'pest' | 'weed' | 'deficiency' | 'healthy';
  solution_summary?: string; // Actionable solution summary
  predicted_label: string;
  confidence_score: number; // 0.0 to 1.0
  confidence_tier: ConfidenceTier; // >0.85 = high, 0.60-0.85 = likely, <0.60 = low
  ranked_matches?: RankedMatch[]; // AI determines which pests/diseases best match in order starting with best match
  geo_coordinates?: {
    lat: number;
    lng: number;
    field_zone?: string;
  };
  model_version: string;
  soil_data_snapshot: SoilDataSnapshot;
  weather_snapshot: WeatherSnapshot;
  context_fusion_notes: string[];
  treatment_advisory: TreatmentAdvisory;
  hariya_explanation: string;
  hariya_explanation_local?: Record<string, string>;
  created_at: string;
  sync_status: SyncStatus;
  needs_extension_review: boolean;
  extension_reviewed?: boolean;
  extension_notes?: string;
}

export interface TreatmentProduct {
  id: string;
  name: string;
  name_local?: Record<string, string>;
  category: 'organic_bio' | 'chemical_approved' | 'cultural';
  active_ingredient: string;
  dosage: string;
  application_timing: string;
  safety_precautions: string;
  target_pests: string[];
  eco_rating: 'high' | 'medium' | 'caution';
  is_favorite?: boolean;
  ic_icon?: string;
}

export interface FieldGuideItem {
  id: string;
  name: string;
  name_local?: Record<string, string>;
  scientific_name: string;
  category: 'disease' | 'pest' | 'weed';
  crop: string;
  symptoms: string[];
  visual_guide_image: string;
  comparison_tip: string;
  recommended_products: TreatmentProduct[];
}

export interface OutbreakForecast {
  id: string;
  crop: string;
  threat_name: string;
  threat_name_local?: Record<string, string>;
  threat_type: 'fungal_disease' | 'insect_pest';
  risk_level: 'low' | 'moderate' | 'high' | 'severe';
  risk_percentage: number; // 0 to 100
  leaf_wetness_hours: number;
  favorable_temp_c: [number, number];
  favorable_humidity_min: number;
  trigger_reason: string;
  forecast_days: number;
  preventive_action: string;
  preventive_action_local?: Record<string, string>;
}

export interface TreatmentAdvisory {
  disease_name: string;
  severity: 'mild' | 'moderate' | 'severe';
  eco_first_remedies: {
    step: number;
    title: string;
    title_local?: Record<string, string>;
    instructions: string;
    instructions_local?: Record<string, string>;
    category: 'biological' | 'cultural' | 'organic_spray';
    materials_needed: string[];
  }[];
  chemical_fallback?: {
    warning: string;
    chemical_name: string;
    safe_handling: string;
    weather_spray_gate_ok: boolean;
    weather_reason: string;
  };
  preventive_measures: string[];
  follow_up_days: number;
}

export type TreatmentType = 'organic' | 'chemical' | 'cultural';
export type VerificationFlag = 'self_reported' | 'geo_time_verified' | 'extension_verified';

export interface TreatmentLog {
  treatment_id: string;
  diagnosis_id?: string;
  farm_id: string;
  farmer_id: string;
  treatment_type: TreatmentType;
  product_used: string;
  applied_at: string;
  marked_complete: boolean;
  verification_flag: VerificationFlag;
  sync_status: SyncStatus;
}

export type HealthEventType = 'heat_alert' | 'hydration_reminder' | 'symptom_checkin';
export type FarmerHealthResponse = 'acknowledged' | 'dismissed' | 'escalated';
export type SymptomLevel = 'normal' | 'tired' | 'dizzy' | 'severe';

export interface HealthMetric {
  health_log_id: string;
  farmer_id: string;
  event_type: HealthEventType;
  heat_index_value: number;
  farmer_response: FarmerHealthResponse;
  symptom_level: SymptomLevel;
  action_taken?: string;
  created_at: string;
}

export interface GamificationScore {
  score_id: string;
  farm_id: string;
  farmer_id: string;
  week_start_date: string;
  pesticide_reduction_score: number; // 0-100 (weight 30%)
  soil_health_score: number;         // 0-100 (weight 25%)
  water_efficiency_score: number;    // 0-100 (weight 20%)
  health_compliance_score: number;   // 0-100 (weight 15%)
  followthrough_score: number;       // 0-100 (weight 10%)
  farm_fitness_score_total: number;  // 0-100 (weighted sum)
  rolling_4wk_average: number;
  streak_eco_days: number;
  streak_hydration_days: number;
  grace_days_remaining: number; // 1 per month
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  title_local: Record<string, string>;
  description: string;
  icon: string;
  unlocked_at?: string;
}

export interface VillageChallenge {
  challenge_id: string;
  season: string; // e.g., 'Kharif 2026'
  title: string;
  participating_village_ids: string[];
  start_date: string;
  end_date: string;
  scoring_method: 'average_score_improvement_normalized';
  winner_village_id?: string;
  status: 'active' | 'completed';
}

export interface ExtensionWorker {
  extension_worker_id: string;
  name: string;
  assigned_village_ids: string[];
  org_affiliation: string;
  phone_number: string;
}

export interface SyncPayloadItem {
  idempotency_key: string;
  entity_type: 'diagnosis' | 'treatment' | 'health_metric' | 'farm_update';
  data: any;
  created_at_local: string;
}
