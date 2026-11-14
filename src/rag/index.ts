/**
 * ADR-002: RAG Runtime MVP - Main Entry Point & Singleton Factory
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 */

import { HybridRetriever } from './retrieval/hybridRetriever';
import { AnswerEngine } from './engine/answerEngine';
import { SAMPLE_HCM_DOCUMENTS } from './knowledge/sampleCorpus';
import {
  KnowledgeDocument,
  DocumentChunk,
  RagAnswerResponse,
  RetrievalQuery,
  ScoredChunk
} from './types/ragTypes';

export * from './types/ragTypes';
export * from './knowledge/sampleCorpus';
export * from './knowledge/documentRegistry';
export * from './ingestion/documentIngestion';
export * from './storage/persistentStore';
export * from './processor/documentProcessor';
export * from './retrieval/textNormalizer';
export * from './retrieval/bm25Retriever';
export * from './retrieval/hybridRetriever';
export * from './engine/promptTemplates';
export * from './engine/localGroundedEngine';
export * from './engine/answerEngine';
export * from './providers/aiProvider';

/**
 * Singleton RAG Runtime instance for application use
 */
class RagRuntimeManager {
  private retriever: HybridRetriever;
  private answerEngine: AnswerEngine;
  private isInitialized = false;

  constructor() {
    this.retriever = new HybridRetriever();
    this.answerEngine = new AnswerEngine({
      retrievalEngine: this.retriever,
      geminiApiKey: typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : undefined
    });
  }

  /**
   * Initialize knowledge base with approved documents
   */
  public initialize(customDocs?: KnowledgeDocument[]): void {
    const docs = customDocs || SAMPLE_HCM_DOCUMENTS;
    this.retriever.indexDocuments(docs);
    this.isInitialized = true;
  }

  /**
   * Ask question to the RAG Answer Engine
   */
  public async query(question: string, options?: Partial<RetrievalQuery>): Promise<RagAnswerResponse> {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.answerEngine.answerQuestion(question, options);
  }

  /**
   * Search knowledge base directly
   */
  public async search(query: string, topK = 5): Promise<ScoredChunk[]> {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.retriever.retrieve({ query, topK });
  }

  /**
   * Get health and statistics
   */
  public getHealth(): {
    status: 'healthy' | 'degraded';
    isInitialized: boolean;
    stats: {
      totalDocuments: number;
      approvedDocuments: number;
      totalChunks: number;
      topics: string[];
    };
    timestamp: string;
  } {
    if (!this.isInitialized) {
      this.initialize();
    }
    const stats = this.retriever.getStats();
    return {
      status: stats.approvedDocuments > 0 ? 'healthy' : 'degraded',
      isInitialized: this.isInitialized,
      stats,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Re-index all active approved chunks dynamically
   */
  public reindex(chunks: DocumentChunk[]): void {
    this.retriever.indexChunks(chunks);
    this.isInitialized = true;
  }

  /**
   * Get all approved chunks
   */
  public getAllApprovedChunks(): DocumentChunk[] {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.retriever.getAllChunks();
  }
}

// Export singleton instance
export const ragRuntime = new RagRuntimeManager();
