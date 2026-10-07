/**
 * Farm Fitness Scoring Service
 * Source of Truth: PRD & 02_Architecture_Flow_AI_Logic_REFINED.md (Section 4)
 * 
 * Weights:
 * - Pesticide reduction: 30%
 * - Soil health: 25%
 * - Water efficiency: 20%
 * - Health-alert compliance: 15%
 * - Diagnosis follow-through: 10%
 * 
 * Total: 100%
 * Smoothed with rolling 4-week average to avoid single-week volatility.
 */

import { GamificationScore, TreatmentLog, HealthMetric, SoilDataSnapshot } from '../../shared/types.js';

export interface ScoreInputData {
  treatments: TreatmentLog[];
  healthLogs: HealthMetric[];
  soilHistory: SoilDataSnapshot[];
  irrigationTimelyScore?: number; // 0-100
  followthroughPercent?: number;  // 0-100
  pastScores?: number[];          // Past weekly scores for rolling average
}

export class FarmFitnessScoreService {
  /**
   * Calculate deterministic raw weekly score and sub-scores
   */
  static calculateWeeklyScore(data: ScoreInputData): {
    pesticide_reduction_score: number;
    soil_health_score: number;
    water_efficiency_score: number;
    health_compliance_score: number;
    followthrough_score: number;
    raw_total: number;
  } {
    // 1. Pesticide reduction (30% weight)
    // Ratio of organic/cultural to chemical treatments
    let pesticide_score = 75; // Baseline
    if (data.treatments.length > 0) {
      const organicCount = data.treatments.filter(t => t.treatment_type === 'organic' || t.treatment_type === 'cultural').length;
      const chemicalCount = data.treatments.filter(t => t.treatment_type === 'chemical').length;
      const ratio = organicCount / (organicCount + chemicalCount);
      pesticide_score = Math.round(ratio * 100);
    }

    // 2. Soil health (25% weight)
    // Stability of pH (ideal 6.5-7.5) and moisture (ideal 40-70%)
    let soil_score = 80;
    if (data.soilHistory.length > 0) {
      const latestSoil = data.soilHistory[data.soilHistory.length - 1];
      let phPenalty = 0;
      if (latestSoil.pH < 6.0) phPenalty = (6.0 - latestSoil.pH) * 15;
      else if (latestSoil.pH > 7.8) phPenalty = (latestSoil.pH - 7.8) * 15;

      let moistureScore = 85;
      if (latestSoil.moisture_percent >= 40 && latestSoil.moisture_percent <= 75) {
        moistureScore = 95;
      } else if (latestSoil.moisture_percent < 30 || latestSoil.moisture_percent > 85) {
        moistureScore = 65;
      }

      soil_score = Math.max(30, Math.min(100, Math.round((100 - phPenalty + moistureScore) / 2)));
    }

    // 3. Water efficiency (20% weight)
    const water_score = data.irrigationTimelyScore ?? 82;

    // 4. Health-alert compliance (15% weight)
    let health_score = 85;
    if (data.healthLogs.length > 0) {
      const acknowledged = data.healthLogs.filter(h => h.farmer_response === 'acknowledged').length;
      health_score = Math.round((acknowledged / data.healthLogs.length) * 100);
    }

    // 5. Diagnosis follow-through (10% weight)
    const followthrough_score = data.followthroughPercent ?? 88;

    // Weighted composite
    const raw_total = Number((
      (pesticide_score * 0.30) +
      (soil_score * 0.25) +
      (water_score * 0.20) +
      (health_score * 0.15) +
      (followthrough_score * 0.10)
    ).toFixed(1));

    return {
      pesticide_reduction_score: pesticide_score,
      soil_health_score: soil_score,
      water_efficiency_score: water_score,
      health_compliance_score: health_score,
      followthrough_score: followthrough_score,
      raw_total
    };
  }

  /**
   * Smoothed 4-week rolling average
   */
  static calculateRollingAverage(currentScore: number, pastScores: number[] = []): number {
    const window = [currentScore, ...pastScores.slice(0, 3)];
    const sum = window.reduce((acc, val) => acc + val, 0);
    return Number((sum / window.length).toFixed(1));
  }

  /**
   * Anti-gaming anomaly check
   * Flags suspicious spikes where score increases >25 points in 1 week without diagnosis activity
   */
  static checkAnomaly(weeklyScore: number, previousScore: number, diagnosisCountThisWeek: number): {
    isAnomalous: boolean;
    reason?: string;
  } {
    if (weeklyScore - previousScore > 25 && diagnosisCountThisWeek === 0) {
      return {
        isAnomalous: true,
        reason: 'Large score surge (+25 pts) without any verified diagnosis or photo verification.'
      };
    }
    return { isAnomalous: false };
  }
}
