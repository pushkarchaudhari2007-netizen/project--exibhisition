/**
 * GreenCoach AI - Context Fusion Engine
 * Classification: RULE-BASED ENGINE / AGRONOMIC ORCHESTRATOR
 * 
 * Fuses multi-modal environmental ground truth:
 * Image Model Prediction + Crop Phenology + Soil Chemistry + Microclimate Weather + Farm History
 */

import { DiseasePrediction } from '../interfaces/disease_model.js';
import { ConfidenceGate, ConfidenceGateResult } from '../inference/confidence_gate.js';

export interface FusionInputs {
  visual_prediction: DiseasePrediction;
  crop_stage?: 'seedling' | 'vegetative' | 'flowering' | 'boll_formation' | 'maturity';
  soil?: {
    ph?: number;
    moisture_percent?: number;
    nitrogen_level?: 'low' | 'medium' | 'high';
  };
  weather?: {
    temperature_c?: number;
    humidity_percent?: number;
    rainfall_forecast_mm?: number;
  };
  farm_history?: {
    previous_diseases?: string[];
    days_since_last_spray?: number;
  };
}

export interface FusedDecision {
  final_disease_label: string;
  original_confidence: number;
  fused_confidence: number;
  confidence_gate_result: ConfidenceGateResult;
  agronomic_factors: string[];
  spray_recommendation: string;
  delay_spray_for_rain: boolean;
}

export class ContextFusionEngine {
  public static fuse(inputs: FusionInputs): FusedDecision {
    const rawConf = inputs.visual_prediction.confidence;
    let adjustedConf = rawConf;
    const factors: string[] = [];
    let delaySpray = false;

    // 1. Weather Context: High humidity (>80%) accelerates fungal spores (Blast, Mildew, Rust)
    if (inputs.weather?.humidity_percent && inputs.weather.humidity_percent > 80) {
      if (inputs.visual_prediction.problem_category === 'disease') {
        adjustedConf += 0.04;
        factors.push(`High ambient humidity (${inputs.weather.humidity_percent}%) provides optimal fungal spore germination window.`);
      }
    }

    // 2. Weather Context: Rain within 24-48 hours washes away foliar sprays
    if (inputs.weather?.rainfall_forecast_mm && inputs.weather.rainfall_forecast_mm > 5) {
      delaySpray = true;
      factors.push(`Rain forecast (${inputs.weather.rainfall_forecast_mm}mm) detected: Foliar sprays should be postponed to avoid environmental wash-off.`);
    }

    // 3. Soil Context: Soil pH < 5.5 or > 8.0 causes nutrient lockup, mimicking blight/chlorosis
    if (inputs.soil?.ph) {
      if (inputs.soil.ph < 5.5 || inputs.soil.ph > 8.2) {
        factors.push(`Alkaline/Acidic soil pH (${inputs.soil.ph}) may contribute to root stress and foliar yellowing.`);
      }
    }

    // 4. Historical Context: Recurrent disease in same plot reinforces prior probability
    if (inputs.farm_history?.previous_diseases) {
      const matchedHistory = inputs.farm_history.previous_diseases.some(
        d => d.toLowerCase().includes(inputs.visual_prediction.crop.toLowerCase()) ||
             inputs.visual_prediction.disease.toLowerCase().includes(d.toLowerCase())
      );
      if (matchedHistory) {
        adjustedConf += 0.03;
        factors.push('Historical field recurrence in this plot confirms vulnerability.');
      }
    }

    // Clamp between 0.10 and 0.99
    adjustedConf = Number(Math.max(0.10, Math.min(0.99, adjustedConf)).toFixed(2));

    // Evaluate through exact Confidence Gate thresholds
    const gateResult = ConfidenceGate.evaluate(adjustedConf);

    const sprayAdvisory = delaySpray
      ? 'DO NOT SPRAY TODAY: Heavy rain forecast within 24 hours. Wait for dry leaf foliage.'
      : (inputs.weather?.temperature_c && inputs.weather.temperature_c > 33)
      ? 'RESTRICT SPRAY WINDOW: High afternoon heat. Spray strictly before 8:30 AM.'
      : 'Optimal spray window: Calm morning conditions (6:30 - 9:00 AM).';

    return {
      final_disease_label: inputs.visual_prediction.disease,
      original_confidence: rawConf,
      fused_confidence: adjustedConf,
      confidence_gate_result: gateResult,
      agronomic_factors: factors,
      spray_recommendation: sprayAdvisory,
      delay_spray_for_rain: delaySpray
    };
  }
}
