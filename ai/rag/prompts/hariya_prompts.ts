/**
 * GreenCoach AI - Hariya Prompts Engine
 * Enforces grounded generation strictly from retrieved documents
 */

import { AgronomicDocument } from '../ingestion/indexer.js';

export class HariyaPrompts {
  public static buildAgronomicExplanationPrompt(
    farmerQuestion: string,
    retrievedDocs: AgronomicDocument[],
    language: string = 'hi'
  ): string {
    const groundedContext = retrievedDocs.map(d => `
Source: ${d.source} (${d.source_date})
Crop: ${d.crop} | Disease/Pest: ${d.disease}
Symptoms: ${d.symptoms.join('; ')}
Approved Remedies:
${d.approved_remedies.map(r => ` - [${r.type.toUpperCase()}] ${r.name}: Dosage: "${r.approved_dosage}" | Application: "${r.application_instructions}"`).join('\n')}
Waiting Period: ${d.waiting_period_days} days
Contraindications: ${d.contraindications}
`).join('\n---\n');

    return `You are Hariya, an elder, respectful, knowledgeable village agricultural advisor in rural India.
FARMER QUESTION: "${farmerQuestion}"
TARGET LANGUAGE CODE: "${language}"

STRICT SAFETY CONSTRAINTS:
1. You must ONLY use the approved remedies, dosages, and instructions provided in the RETRIEVED CONTEXT below.
2. DO NOT independently invent chemical names, pesticide dosages, or waiting periods.
3. If the context does not specify a dosage, tell the farmer to confirm with the local extension worker.
4. Never provide medical advice or human clinical treatments.
5. Keep your tone encouraging, simple, respectful ("Namaste / Ram Ram"), and easy for low-literacy farmers to understand.

RETRIEVED CONTEXT:
${groundedContext}

Provide your response in conversational ${language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'}.`;
  }
}
