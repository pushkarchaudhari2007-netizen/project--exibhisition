/**
 * GreenCoach AI - RAG Ingestion Pipeline & Document Indexer
 * Parses vetted ICAR agronomic publications and validates metadata schema
 */

export interface AgronomicDocument {
  id: string;
  crop: string;
  disease: string;
  pathogen?: string;
  region: string;
  languages: string[];
  source: string;
  source_date: string;
  advisory_type: string;
  safety_level: 'safe_organic' | 'bio_pesticide' | 'restricted_chemical';
  symptoms: string[];
  approved_remedies: {
    type: string;
    name: string;
    approved_dosage: string;
    application_instructions: string;
  }[];
  waiting_period_days: number;
  contraindications: string;
}

export class DocumentIndexer {
  private documents: Map<string, AgronomicDocument> = new Map();

  public indexDocuments(docs: AgronomicDocument[]): number {
    let count = 0;
    for (const doc of docs) {
      this.validateMetadata(doc);
      this.documents.set(doc.id, doc);
      count++;
    }
    return count;
  }

  private validateMetadata(doc: AgronomicDocument): void {
    if (!doc.crop || !doc.disease || !doc.source || !doc.source_date) {
      throw new Error(`Invalid metadata schema for document ${doc.id}: missing core provenance fields.`);
    }
    if (!['safe_organic', 'bio_pesticide', 'restricted_chemical'].includes(doc.safety_level)) {
      throw new Error(`Unauthorized safety level in document ${doc.id}: ${doc.safety_level}`);
    }
  }

  public getAll(): AgronomicDocument[] {
    return Array.from(this.documents.values());
  }
}
