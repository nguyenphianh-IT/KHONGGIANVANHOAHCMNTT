/**
 * ADR-002: Hybrid Retrieval Engine
 * Implements IRetrievalEngine with strict provenance security filtering and relevance scoring.
 */

import {
  IRetrievalEngine,
  KnowledgeDocument,
  DocumentChunk,
  RetrievalQuery,
  ScoredChunk
} from '../types/ragTypes';
import { BM25Retriever } from './bm25Retriever';
import { DocumentProcessor } from '../processor/documentProcessor';

export class HybridRetriever implements IRetrievalEngine {
  private documents: Map<string, KnowledgeDocument> = new Map();
  private chunks: DocumentChunk[] = [];
  private bm25: BM25Retriever;
  private processor: DocumentProcessor;

  constructor() {
    this.bm25 = new BM25Retriever(1.5, 0.75);
    this.processor = new DocumentProcessor();
  }

  /**
   * Index knowledge documents and auto-process chunks with security gates
   */
  public indexDocuments(documents: KnowledgeDocument[]): void {
    this.documents.clear();
    const approvedDocs: KnowledgeDocument[] = [];

    for (const doc of documents) {
      this.documents.set(doc.id, doc);
      // Security Gate: Only APPROVED and ALLOWED documents are passed to the retrieval index
      if (doc.status === 'APPROVED' && doc.isAllowedForRag) {
        approvedDocs.push(doc);
      }
    }

    const chunks = this.processor.processDocuments(approvedDocs);
    this.indexChunks(chunks);
  }

  /**
   * Directly index pre-processed chunks
   */
  public indexChunks(chunks: DocumentChunk[]): void {
    // Secondary Security Gate: Ensure no PENDING or unapproved chunks enter
    this.chunks = chunks.filter(c => c.sourceStatus === 'APPROVED');
    this.bm25.buildIndex(this.chunks);
  }

  /**
   * Retrieve relevant chunks for a user query
   */
  public async retrieve(queryReq: RetrievalQuery): Promise<ScoredChunk[]> {
    const { query, topK = 4, categoryFilter, topicFilter, minScore = 0.3 } = queryReq;

    if (!query || !query.trim()) {
      return [];
    }

    // Run BM25 lexical search
    let rawScored = this.bm25.search(query, topK * 2, minScore);

    // Apply metadata filters if specified
    if (categoryFilter) {
      rawScored = rawScored.filter(sc => {
        const doc = this.documents.get(sc.chunk.documentId);
        return doc && doc.category === categoryFilter;
      });
    }

    if (topicFilter) {
      rawScored = rawScored.filter(sc => {
        return sc.chunk.topic.toLowerCase().includes(topicFilter.toLowerCase());
      });
    }

    // Limit to topK
    const topResults = rawScored.slice(0, topK);

    // Normalize scores to a human-readable 0.0 - 1.0 scale
    const maxScore = topResults.length > 0 ? topResults[0].score : 1;
    return topResults.map(sc => ({
      ...sc,
      score: maxScore > 0 ? Math.min(1.0, Math.round((sc.score / (maxScore * 1.1)) * 100) / 100) : 0
    }));
  }

  /**
   * Return all currently indexed chunks
   */
  public getAllChunks(): DocumentChunk[] {
    return [...this.chunks];
  }

  /**
   * Provide corpus statistics for health check & transparency
   */
  public getStats(): {
    totalDocuments: number;
    approvedDocuments: number;
    totalChunks: number;
    topics: string[];
  } {
    const allDocs = Array.from(this.documents.values());
    const approvedDocs = allDocs.filter(d => d.status === 'APPROVED' && d.isAllowedForRag);
    const topicsSet = new Set<string>();

    for (const chunk of this.chunks) {
      if (chunk.topic) topicsSet.add(chunk.topic);
    }

    return {
      totalDocuments: allDocs.length,
      approvedDocuments: approvedDocs.length,
      totalChunks: this.chunks.length,
      topics: Array.from(topicsSet)
    };
  }
}
