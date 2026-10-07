/**
 * GreenCoach AI - Comprehensive AI Architecture Test Suite
 * Validates all AI/ML models, RAG subsystem, Confidence Gate boundaries,
 * Health Decision Engine, Context Fusion, and Environmental Providers.
 */

import { OnDeviceDiseaseModel } from '../models/on_device_disease_model.js';
import { CloudDiseaseModel } from '../models/cloud_disease_model.js';
import { MockDiseaseModel } from '../models/mock_disease_model.js';
import { globalModelSelector } from '../models/model_selector.js';
import { ConfidenceGate } from '../inference/confidence_gate.js';
import { KnowledgeRetriever } from '../rag/retrieval/retriever.js';
import { AgriculturalSafetyGuardrails } from '../rag/safety/guardrails.js';
import { RAGEvaluator } from '../rag/evaluation/rag_eval.js';
import { HealthDecisionEngine } from '../health/health_decision_engine.js';
import { ContextFusionEngine } from '../fusion/context_fusion_engine.js';
import { MockWeatherProvider, MockSoilProvider } from '../providers/environment_providers.js';

let passes = 0;
let fails = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    passes++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    fails++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('  GREENCOACH AI — COMPLETE AI/ML VERIFICATION SUITE');
  console.log('======================================================\n');

  // TEST 1: Model 1 — On-Device MobileNetV3 Quantized Model
  console.log('[1] Testing On-Device Disease Model (MobileNetV3 quantized adapter)...');
  const onDevice = new OnDeviceDiseaseModel();
  const predRice = await onDevice.predict('sample-rice-leaf', 'rice');
  assert(predRice.disease.includes('Rice Blast'), 'OnDevice model correctly identifies rice blast');
  assert(predRice.model_source === 'on_device_mobilenet', 'Source marked as on_device_mobilenet');
  assert(predRice.confidence > 0.85, 'Quantized model confidence is within calibrated range');

  const predHealthy = await onDevice.predict('sample-healthy-leaf', 'cotton');
  assert(predHealthy.problem_category === 'healthy', 'OnDevice model correctly handles healthy foliage');

  // TEST 2: Model 2 — Cloud Disease Model & Model Selection Fallback Strategy
  console.log('\n[2] Testing Cloud Disease Model & Fallback Strategy...');
  const cloudModel = new CloudDiseaseModel();
  assert(cloudModel.modelSource === 'cloud_efficientnet', 'Cloud model source is cloud_efficientnet');

  const offlineResolved = globalModelSelector.resolveModel({ isOnline: false, environment: 'production' });
  assert(offlineResolved.modelSource === 'on_device_mobilenet', 'Offline correctly selects OnDeviceDiseaseModel');

  const onlineResolved = globalModelSelector.resolveModel({ isOnline: true, environment: 'production' });
  assert(onlineResolved.modelSource === 'cloud_efficientnet', 'Online prefers CloudDiseaseModel');

  const testResolved = globalModelSelector.resolveModel({ isOnline: true, environment: 'test' });
  assert(testResolved.modelSource === 'mock_fixture', 'Test environment resolves to MockDiseaseModel');

  // TEST 3: Strict Confidence Gate Boundary Tests
  console.log('\n[3] Testing Confidence Gate Boundary Values (0.90, 0.85, 0.84, 0.60, 0.59, 0.20)...');
  const g90 = ConfidenceGate.evaluate(0.90);
  assert(g90.tier === 'high' && !g90.requires_confirmation, '0.90 -> HIGH CONFIDENCE');

  const g85 = ConfidenceGate.evaluate(0.85);
  assert(g85.tier === 'likely' && g85.requires_confirmation, '0.85 -> LIKELY (0.60 <= 0.85 <= 0.85)');

  const g84 = ConfidenceGate.evaluate(0.84);
  assert(g84.tier === 'likely' && g84.requires_confirmation, '0.84 -> LIKELY');

  const g60 = ConfidenceGate.evaluate(0.60);
  assert(g60.tier === 'likely' && g60.requires_confirmation, '0.60 -> LIKELY (0.60 <= 0.60 <= 0.85)');

  const g59 = ConfidenceGate.evaluate(0.59);
  assert(g59.tier === 'low' && g59.escalate_to_extension_worker, '0.59 -> LOW CONFIDENCE (escalate to extension worker)');

  const g20 = ConfidenceGate.evaluate(0.20);
  assert(g20.tier === 'low' && g20.escalate_to_extension_worker, '0.20 -> LOW CONFIDENCE');

  // TEST 4: Model 3 — RAG Knowledge Base & Zero-Hallucination Retriever
  console.log('\n[4] Testing Agricultural Advisory RAG Pipeline...');
  const retriever = new KnowledgeRetriever();
  const resCotton = retriever.retrieve({ question: 'How to manage pink bollworm?', crop: 'cotton' });
  assert(resCotton.found && resCotton.documents.length > 0, 'RAG successfully retrieves pink bollworm documents');
  assert(resCotton.documents[0].document.source.includes('CICR'), 'Document contains ICAR-CICR provenance');

  const resUnknown = retriever.retrieve({ question: 'How to cure alien plant space virus?', crop: 'mars_weed' });
  assert(!resUnknown.found, 'RAG returns zero-hallucination fallback for unsupported queries');

  // TEST 5: Agricultural Safety Guardrails
  console.log('\n[5] Testing Agricultural Safety Guardrails...');
  const safeText = "Apply Neem oil 1500 ppm at 5 ml/liter during morning hours.";
  const safeCheck = AgriculturalSafetyGuardrails.validate(safeText, [resCotton.documents[0].document]);
  assert(safeCheck.passed, 'Safe biological recommendation passes guardrails');

  const toxicText = "Spray Endosulfan and Monocrotophos 40% solution immediately.";
  const toxicCheck = AgriculturalSafetyGuardrails.validate(toxicText, []);
  assert(!toxicCheck.passed && toxicCheck.violations.length >= 2, 'Banned pesticides blocked by safety guardrail');

  // TEST 6: RAG Benchmark Evaluator
  console.log('\n[6] Running RAG Benchmark Evaluator...');
  const evaluator = new RAGEvaluator();
  const bench = evaluator.runBenchmark();
  assert(bench.retrieval_accuracy === 1.0, 'RAG retrieval accuracy benchmark is 100%');
  assert(bench.safety_compliance === 1.0, 'RAG safety compliance benchmark is 100%');

  // TEST 7: Farmer Health Decision Engine (Rule-Based)
  console.log('\n[7] Testing Health Decision Engine (Rule-Based Environmental Triage)...');
  const normalHealth = HealthDecisionEngine.evaluate({
    temperature_c: 28,
    humidity_percent: 50,
    hours_in_direct_sun: 2,
    symptoms: []
  });
  assert(normalHealth.risk_level === 'normal' && !normalHealth.requires_immediate_escalation, 'Normal weather triage is safe');

  const heatStroke = HealthDecisionEngine.evaluate({
    temperature_c: 42,
    humidity_percent: 65,
    hours_in_direct_sun: 6,
    symptoms: ['confusion', 'absence_of_sweating']
  });
  assert(heatStroke.emergency_ambulance_call && heatStroke.risk_level === 'extreme_danger', 'Red flag confusion triggers emergency 108 escalation');

  // TEST 8: Context Fusion Engine
  console.log('\n[8] Testing Context Fusion Layer...');
  const mockPred: any = {
    disease: 'Rice Blast',
    confidence: 0.84,
    crop: 'rice',
    problem_category: 'disease'
  };
  const fused = ContextFusionEngine.fuse({
    visual_prediction: mockPred,
    weather: { temperature_c: 30, humidity_percent: 88, rainfall_forecast_mm: 12 },
    soil: { ph: 7.2 }
  });
  assert(fused.delay_spray_for_rain, 'Context fusion detects upcoming rain and delays spray');
  assert(fused.fused_confidence > 0.84, 'High humidity boosts fungal disease prior');

  // TEST 9: Weather & Soil Provider Abstractions
  console.log('\n[9] Testing Weather & Soil Providers...');
  const weatherProv = new MockWeatherProvider();
  const weatherData = await weatherProv.getWeather(18.52, 73.85);
  assert(weatherData.temperature_c > 0 && weatherData.humidity_percent > 0, 'Weather provider returns valid telemetry');

  const soilProv = new MockSoilProvider();
  const soilData = await soilProv.getSoilData('farm-1');
  assert(soilData.ph >= 6.5 && soilData.ph <= 8.5, 'Soil provider returns calibrated soil pH');

  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passes} PASSED, ${fails} FAILED`);
  console.log('======================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
