/**
 * GreenCoach AI - Agricultural Advisory RAG Retriever
 * Combines vetted knowledge base with context filters and threshold gate
 */

import { VectorStore, ScoredDocument } from '../embeddings/vector_store.js';
import { AgronomicDocument } from '../ingestion/indexer.js';
import icarDocs from '../documents/icar_vetted_advisories.json' with { type: 'json' };

export interface RetrievalQuery {
  question: string;
  crop?: string;
  region?: string;
  language?: string;
}

export class KnowledgeRetriever {
  private vectorStore: VectorStore;

  constructor() {
    this.vectorStore = new VectorStore();
    this.vectorStore.load(icarDocs as AgronomicDocument[]);
  }

  public retrieve(query: RetrievalQuery): {
    found: boolean;
    documents: ScoredDocument[];
    fallback_message?: string;
  } {
    const results = this.vectorStore.search(query.question, {
      crop: query.crop,
      region: query.region
    });

    if (results.length === 0 || results[0].score < 0.40) {
      return {
        found: false,
        documents: [],
        fallback_message: "Reliable vetted agronomic information is currently unavailable for this specific query. Please consult your local Krishi Vigyan Kendra (KVK) or agricultural extension officer."
      };
    }

    return {
      found: true,
      documents: results
    };
  }
}
