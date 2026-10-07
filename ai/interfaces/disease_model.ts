/**
 * GreenCoach AI - Standardized Disease Model Interface
 * Requirement: The Android application must not contain one completely different
 * diagnosis algorithm and the backend another.
 */

export interface DiseaseModelContext {
  crop_hint?: string;
  soil_ph?: number;
  soil_moisture_percent?: number;
  temperature_c?: number;
  humidity_percent?: number;
  rainfall_forecast_mm?: number;
  days_after_sowing?: number;
  historical_outbreaks?: string[];
}

export interface DiseasePrediction {
  disease: string;
  confidence: number;
  crop: string;
  plant_scientific_name?: string;
  problem_category: 'disease' | 'pest' | 'weed' | 'deficiency' | 'healthy';
  symptoms_observed?: string;
  solution_summary?: string;
  model_source: 'on_device_mobilenet' | 'cloud_efficientnet' | 'mock_fixture';
  model_version: string;
  timestamp: string;
  recommendations_available: boolean;
}

export interface DiseaseModel {
  readonly modelId: string;
  readonly modelSource: 'on_device_mobilenet' | 'cloud_efficientnet' | 'mock_fixture';
  
  predict(
    image: string,
    crop?: string,
    context?: DiseaseModelContext
  ): Promise<DiseasePrediction>;
}
