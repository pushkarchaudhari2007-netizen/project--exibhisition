/**
 * GreenCoach AI - Mock Disease Model
 * Purpose: Allows the entire application and tests to run deterministically
 * without network or GPU dependencies.
 */

import { DiseaseModel, DiseaseModelContext, DiseasePrediction } from '../interfaces/disease_model.js';

export class MockDiseaseModel implements DiseaseModel {
  public readonly modelId = 'mock_disease_model_fixture';
  public readonly modelSource = 'mock_fixture' as const;
  public readonly version = '0.0.1-mock';

  private configuredConfidence = 0.90;
  private configuredDisease = 'Rice Blast (Magnaporthe oryzae)';

  setMockConfidence(conf: number) {
    this.configuredConfidence = conf;
  }

  setMockDisease(disease: string) {
    this.configuredDisease = disease;
  }

  async predict(
    image: string,
    crop?: string,
    context?: DiseaseModelContext
  ): Promise<DiseasePrediction> {
    const timestamp = new Date().toISOString();
    return {
      disease: this.configuredDisease,
      confidence: this.configuredConfidence,
      crop: crop || context?.crop_hint || 'rice',
      plant_scientific_name: 'Oryza sativa',
      problem_category: 'disease',
      symptoms_observed: 'Spindle-shaped elliptical lesions with gray-ash centers.',
      solution_summary: 'Apply Pseudomonas fluorescens bio-spray (5g/L) during morning hours.',
      model_source: this.modelSource,
      model_version: this.version,
      timestamp,
      recommendations_available: true
    };
  }
}
