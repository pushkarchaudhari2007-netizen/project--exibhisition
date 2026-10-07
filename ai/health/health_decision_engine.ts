/**
 * GreenCoach AI - Farmer Health & Heat Stress Decision Engine
 * Classification: RULE-BASED DECISION ENGINE (NOT A NEURAL NETWORK)
 * 
 * Safety Boundary:
 * Does NOT diagnose clinical medical conditions or prescribe human pharmaceuticals.
 * Uses deterministic environmental heat index thresholds and approved ICMR/NDMA first-aid protocols.
 */

export type HeatRiskLevel = 'normal' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';

export interface HealthCheckinInput {
  temperature_c: number;
  humidity_percent: number;
  hours_in_direct_sun: number;
  symptoms: ('dizziness' | 'headache' | 'excessive_sweating' | 'absence_of_sweating' | 'muscle_cramps' | 'nausea' | 'confusion')[];
}

export interface HealthGuidanceResult {
  heat_index_c: number;
  risk_level: HeatRiskLevel;
  requires_immediate_escalation: boolean;
  emergency_ambulance_call: boolean;
  guidance_instructions: string[];
  hydration_target_liters: number;
  rest_break_recommendation: string;
  disclaimer: string;
}

export class HealthDecisionEngine {
  /**
   * Deterministic Rothfusz / Steadman Heat Index Formula
   */
  public static calculateHeatIndex(tempC: number, humidity: number): number {
    const T = (tempC * 9/5) + 32;
    const R = humidity;

    let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));

    if (HI >= 80) {
      HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R
           - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R
           + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
    }

    const hiC = (HI - 32) * 5/9;
    return Number(hiC.toFixed(1));
  }

  /**
   * Rule-based triage tree
   */
  public static evaluate(input: HealthCheckinInput): HealthGuidanceResult {
    const heatIndex = this.calculateHeatIndex(input.temperature_c, input.humidity_percent);
    
    // Evaluate environmental risk level
    let riskLevel: HeatRiskLevel = 'normal';
    if (heatIndex >= 52) riskLevel = 'extreme_danger';
    else if (heatIndex >= 41) riskLevel = 'danger';
    else if (heatIndex >= 32) riskLevel = 'extreme_caution';
    else if (heatIndex >= 27) riskLevel = 'caution';

    // Emergency red flags: confusion or absence of sweating in high heat = Heat Stroke (Medical Emergency)
    const hasRedFlag = input.symptoms.includes('confusion') || 
      (input.symptoms.includes('absence_of_sweating') && heatIndex > 38);

    if (hasRedFlag) {
      return {
        heat_index_c: heatIndex,
        risk_level: 'extreme_danger',
        requires_immediate_escalation: true,
        emergency_ambulance_call: true,
        guidance_instructions: [
          'CRITICAL EMERGENCY: Signs of Heat Stroke detected.',
          'Move the farmer into cool shade immediately.',
          'Loosen clothing and sponge body with cool water or wet cloths.',
          'Call 108 Emergency Ambulance or transport immediately to Primary Health Centre (PHC).',
          'Do NOT force-feed fluids if conscious awareness is impaired.'
        ],
        hydration_target_liters: 0,
        rest_break_recommendation: 'Immediate complete cessation of field labor.',
        disclaimer: 'This is emergency first-aid triage guidance based on ICMR heat protocols, NOT a clinical diagnosis.'
      };
    }

    // Heat exhaustion tree: dizziness, headache, nausea, or muscle cramps
    const hasModerateSymptoms = input.symptoms.includes('dizziness') || 
      input.symptoms.includes('headache') || 
      input.symptoms.includes('muscle_cramps') ||
      input.symptoms.includes('nausea');

    if (hasModerateSymptoms || riskLevel === 'danger' || riskLevel === 'extreme_caution') {
      return {
        heat_index_c: heatIndex,
        risk_level: riskLevel,
        requires_immediate_escalation: hasModerateSymptoms,
        emergency_ambulance_call: false,
        guidance_instructions: [
          'Sit in tree shade or shelter immediately for at least 15-20 minutes.',
          'Drink ORS (Oral Rehydration Solution) or fresh lemon water with a pinch of salt.',
          'Pour cool water over feet and neck to lower core temperature.',
          'Avoid heavy spraying or physical weeding during mid-day peak sun (11:30 AM - 3:30 PM).'
        ],
        hydration_target_liters: 3.5,
        rest_break_recommendation: 'Take 15-minute hydration breaks every 45 minutes.',
        disclaimer: 'Rule-based occupational health guidance for field workers.'
      };
    }

    // Normal maintenance
    return {
      heat_index_c: heatIndex,
      risk_level: 'normal',
      requires_immediate_escalation: false,
      emergency_ambulance_call: false,
      guidance_instructions: [
        'Weather conditions are manageable.',
        'Carry clean drinking water to the field (minimum 2-3 liters).',
        'Wear a wide-brimmed cloth hat or gamcha to protect your head and neck.'
      ],
      hydration_target_liters: 2.5,
      rest_break_recommendation: 'Standard rest at mid-day.',
      disclaimer: 'Preventive farm wellness check-in.'
    };
  }
}
