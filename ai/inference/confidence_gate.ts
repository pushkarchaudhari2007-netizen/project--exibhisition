/**
 * GreenCoach AI - Confidence Gate Engine (TypeScript Implementation)
 * Exact Thresholds:
 *   confidence > 0.85          : HIGH CONFIDENCE
 *   0.60 <= confidence <= 0.85  : LIKELY (Request confirmation)
 *   confidence < 0.60          : LOW CONFIDENCE (Retake image / Extension review)
 */

export type ConfidenceTier = 'high' | 'likely' | 'low';

export interface ConfidenceGateResult {
  confidence: number;
  tier: ConfidenceTier;
  action: 'PROCEED_ADVISORY' | 'REQUEST_CONFIRMATION' | 'RETAKE_OR_ESCALATE';
  requires_confirmation: boolean;
  escalate_to_extension_worker: boolean;
  user_message: string;
}

export class ConfidenceGate {
  public static readonly HIGH_THRESHOLD = 0.85;
  public static readonly LIKELY_THRESHOLD = 0.60;

  public static evaluate(confidence: number): ConfidenceGateResult {
    if (confidence > this.HIGH_THRESHOLD) {
      return {
        confidence,
        tier: 'high',
        action: 'PROCEED_ADVISORY',
        requires_confirmation: false,
        escalate_to_extension_worker: false,
        user_message: 'High confidence diagnosis. Probable disease verified with actionable eco-remedies.'
      };
    } else if (confidence >= this.LIKELY_THRESHOLD) {
      return {
        confidence,
        tier: 'likely',
        action: 'REQUEST_CONFIRMATION',
        requires_confirmation: true,
        escalate_to_extension_worker: false,
        user_message: 'Likely diagnosis. Please visually compare with reference symptom images or confirm leaf details.'
      };
    } else {
      return {
        confidence,
        tier: 'low',
        action: 'RETAKE_OR_ESCALATE',
        requires_confirmation: false,
        escalate_to_extension_worker: true,
        user_message: "I am not fully sure from this photo — can you take one more picture in better light? We have also queued this for an extension worker."
      };
    }
  }
}
