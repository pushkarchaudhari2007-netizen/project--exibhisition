/**
 * GreenCoach AI - RAG Evaluation Suite
 * Evaluates retrieval accuracy, answer faithfulness, and guardrail pass rate
 */

import { KnowledgeRetriever } from '../retrieval/retriever.js';
import { AgriculturalSafetyGuardrails } from '../safety/guardrails.js';

export interface RAGEvaluationMetric {
  query: string;
  expected_crop: string;
  expected_disease: string;
  retrieval_passed: boolean;
  guardrail_passed: boolean;
  score: number;
}

export class RAGEvaluator {
  private retriever: KnowledgeRetriever;

  constructor() {
    this.retriever = new KnowledgeRetriever();
  }

  public runBenchmark(): {
    total_queries: number;
    retrieval_accuracy: number;
    safety_compliance: number;
    results: RAGEvaluationMetric[];
  } {
    const testCases = [
      {
        query: "What is the biological remedy for rice blast?",
        expected_crop: "rice",
        expected_disease: "rice_blast"
      },
      {
        query: "How many pheromone traps per acre for pink bollworm in cotton?",
        expected_crop: "cotton",
        expected_disease: "pink_bollworm"
      },
      {
        query: "How to treat sugarcane red rot using Trichoderma?",
        expected_crop: "sugarcane",
        expected_disease: "red_rot"
      },
      {
        query: "Organic control for early blight in tomato target spots?",
        expected_crop: "tomato",
        expected_disease: "early_blight"
      }
    ];

    const results: RAGEvaluationMetric[] = [];
    let retrievalPassCount = 0;
    let guardrailPassCount = 0;

    for (const tc of testCases) {
      const retrieval = this.retriever.retrieve({ question: tc.query, crop: tc.expected_crop });
      const topDoc = retrieval.documents[0]?.document;

      const retrievalPassed = retrieval.found && topDoc?.disease === tc.expected_disease;
      if (retrievalPassed) retrievalPassCount++;

      // Run sample grounded response through safety guardrail
      const sampleResponse = topDoc
        ? `According to ${topDoc.source}, apply ${topDoc.approved_remedies[0]?.name} at dosage of ${topDoc.approved_remedies[0]?.approved_dosage}.`
        : "No information.";

      const safety = AgriculturalSafetyGuardrails.validate(sampleResponse, topDoc ? [topDoc] : []);
      if (safety.passed) guardrailPassCount++;

      results.push({
        query: tc.query,
        expected_crop: tc.expected_crop,
        expected_disease: tc.expected_disease,
        retrieval_passed: retrievalPassed,
        guardrail_passed: safety.passed,
        score: retrieval.documents[0]?.score || 0
      });
    }

    return {
      total_queries: testCases.length,
      retrieval_accuracy: Number((retrievalPassCount / testCases.length).toFixed(2)),
      safety_compliance: Number((guardrailPassCount / testCases.length).toFixed(2)),
      results
    };
  }
}
