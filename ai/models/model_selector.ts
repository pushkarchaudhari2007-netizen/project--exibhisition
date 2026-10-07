/**
 * GreenCoach AI - Model Selection Strategy
 * Documented Strategy:
 * - Offline: Use OnDeviceDiseaseModel
 * - Online: Prefer CloudDiseaseModel
 * - Cloud unavailable: Fallback to OnDeviceDiseaseModel
 * - Development/Test: Allow MockDiseaseModel
 */

import { DiseaseModel, DiseaseModelContext, DiseasePrediction } from '../interfaces/disease_model.js';
import { OnDeviceDiseaseModel } from './on_device_disease_model.js';
import { CloudDiseaseModel } from './cloud_disease_model.js';
import { MockDiseaseModel } from './mock_disease_model.js';

export interface ModelSelectionOptions {
  isOnline: boolean;
  environment: 'development' | 'production' | 'test';
  forceModel?: 'on_device' | 'cloud' | 'mock';
}

export class ModelSelector {
  private onDeviceModel: OnDeviceDiseaseModel;
  private cloudModel: CloudDiseaseModel;
  private mockModel: MockDiseaseModel;

  constructor() {
    this.onDeviceModel = new OnDeviceDiseaseModel();
    this.cloudModel = new CloudDiseaseModel();
    this.mockModel = new MockDiseaseModel();
  }

  public getMockModel(): MockDiseaseModel {
    return this.mockModel;
  }

  public getOnDeviceModel(): OnDeviceDiseaseModel {
    return this.onDeviceModel;
  }

  public getCloudModel(): CloudDiseaseModel {
    return this.cloudModel;
  }

  public resolveModel(options: ModelSelectionOptions): DiseaseModel {
    if (options.forceModel === 'mock' || options.environment === 'test') {
      return this.mockModel;
    }
    if (options.forceModel === 'on_device' || !options.isOnline) {
      return this.onDeviceModel;
    }
    return this.cloudModel;
  }

  public async executeInferenceWithFallback(
    image: string,
    crop?: string,
    context?: DiseaseModelContext,
    options: ModelSelectionOptions = { isOnline: true, environment: 'production' }
  ): Promise<DiseasePrediction> {
    const primaryModel = this.resolveModel(options);

    try {
      return await primaryModel.predict(image, crop, context);
    } catch (primaryErr) {
      console.warn(`Primary model (${primaryModel.modelId}) failed. Executing fallback to on-device model:`, primaryErr);
      return await this.onDeviceModel.predict(image, crop, context);
    }
  }
}

export const globalModelSelector = new ModelSelector();
