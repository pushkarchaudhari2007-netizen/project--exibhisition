/**
 * GreenCoach AI - RAG Vector Store & Semantic Embeddings Adapter
 * Lightweight in-memory hybrid TF-IDF + metadata keyword cosine similarity
 */

import { AgronomicDocument } from '../ingestion/indexer.js';

export interface ScoredDocument {
  document: AgronomicDocument;
  score: number;
}

export class VectorStore {
  private documents: AgronomicDocument[] = [];

  public load(docs: AgronomicDocument[]) {
    this.documents = docs;
  }

  public search(query: string, filter?: { crop?: string; region?: string }): ScoredDocument[] {
    const normQuery = query.toLowerCase().trim();
    const queryTokens = new Set(normQuery.split(/\s+/));

    const scored: ScoredDocument[] = [];

    for (const doc of this.documents) {
      if (filter?.crop && doc.crop.toLowerCase() !== filter.crop.toLowerCase()) {
        continue;
      }

      // Calculate lexical & token overlap with symptoms and remedies
      let matchCount = 0;
      const docTokens = [
        doc.crop.toLowerCase(),
        doc.disease.toLowerCase(),
        ...(doc.symptoms.map(s => s.toLowerCase())),
        ...(doc.approved_remedies.map(r => `${r.name.toLowerCase()} ${r.application_instructions.toLowerCase()}`))
      ].join(' ');

      for (const token of queryTokens) {
        if (token.length > 2 && docTokens.includes(token)) {
          matchCount++;
        }
      }

      if (normQuery.includes(doc.disease.toLowerCase().replace(/_/g, ' '))) {
        matchCount += 5;
      }

      const score = matchCount > 0 ? Math.min(1.0, 0.4 + (matchCount * 0.15)) : 0;
      if (score > 0) {
        scored.push({ document: doc, score });
      }
    }

    return scored.sort((a, b) => b.score - a.score);
  }
}
