/**
 * GreenCoach AI - Agricultural Safety Guardrails Engine
 * Inspects generated LLM text before it reaches the farmer.
 * Enforces compliance against hallucinated dosages, hazardous chemicals, and medical claims.
 */

import { AgronomicDocument } from '../ingestion/indexer.js';

export interface SafetyValidationResult {
  passed: boolean;
  violations: string[];
  sanitized_response: string;
}

export class AgriculturalSafetyGuardrails {
  // Prohibited unauthorized chemical substances banned or restricted by CIBRC / ICAR for smallholders
  private static readonly BANNED_CHEMICAL_KEYWORDS = [
    'monocrotophos',
    'endosulfan',
    'paraquat',
    'methyl parathion',
    'ddt',
    'chlorpyrifos 50%',
    'phorate',
    'aluminum phosphide'
  ];

  // Medical human disease terms that must never be diagnosed by agricultural co-pilot
  private static readonly MEDICAL_TERMS = [
    'cancer',
    'tuberculosis',
    'diabetes',
    'prescription drug',
    'antibiotic for human',
    'hypertension medication',
    'cardiac arrest'
  ];

  public static validate(
    generatedText: string,
    vettedContextDocs: AgronomicDocument[]
  ): SafetyValidationResult {
    const violations: string[] = [];
    const lower = generatedText.toLowerCase();

    // 1. Prohibit banned hazardous chemicals
    for (const banned of this.BANNED_CHEMICAL_KEYWORDS) {
      if (lower.includes(banned)) {
        violations.push(`Prohibited hazardous or banned agrochemical detected: '${banned}'.`);
      }
    }

    // 2. Prohibit human medical claims
    for (const med of this.MEDICAL_TERMS) {
      if (lower.includes(med)) {
        violations.push(`Unauthorized human clinical medical advice detected: '${med}'.`);
      }
    }

    // 3. Prohibit inventing unauthorized high chemical concentrations (e.g. >10% foliar spray)
    const dangerousConcentrations = lower.match(/([2-9][0-9]|\d{3})%\s*(solution|spray|concentration)/g);
    if (dangerousConcentrations && dangerousConcentrations.length > 0) {
      violations.push(`Unusually high or potentially phytotoxic chemical concentration detected: ${dangerousConcentrations.join(', ')}.`);
    }

    // 4. If no vetted documents were available, ensure LLM does not hallucinate treatments
    if (vettedContextDocs.length === 0) {
      if (lower.includes('spray') || lower.includes('dose') || lower.includes('apply')) {
        violations.push('Treatment instructions generated without grounded vetted source documents.');
      }
    }

    if (violations.length > 0) {
      return {
        passed: false,
        violations,
        sanitized_response: "Hariya advisory safety notice: A portion of this guidance could not be verified against official ICAR standards. Please consult your village Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer for exact application guidance."
      };
    }

    return {
      passed: true,
      violations: [],
      sanitized_response: generatedText
    };
  }
}
