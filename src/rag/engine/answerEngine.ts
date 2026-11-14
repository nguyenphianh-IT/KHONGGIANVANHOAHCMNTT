/**
 * ADR-002: RAG Answer Engine Orchestrator
 * Connects Retrieval Engine, Evidence Verification, AI Provider, and Telemetry.
 */

import {
  IRetrievalEngine,
  IAIProvider,
  RagAnswerResponse,
  RetrievalQuery,
  RagCitation
} from '../types/ragTypes';
import { GeminiProvider } from '../providers/aiProvider';
import { LocalGroundedEngine } from './localGroundedEngine';

export interface AnswerEngineOptions {
  retrievalEngine: IRetrievalEngine;
  primaryProvider?: IAIProvider;
  geminiApiKey?: string;
  minEvidenceScore?: number;
}

export class AnswerEngine {
  private retrievalEngine: IRetrievalEngine;
  private primaryProvider?: IAIProvider;
  private localEngine: LocalGroundedEngine;
  private minEvidenceScore: number;

  constructor(options: AnswerEngineOptions) {
    this.retrievalEngine = options.retrievalEngine;
    this.localEngine = new LocalGroundedEngine();
    this.minEvidenceScore = options.minEvidenceScore ?? 0.25;

    if (options.primaryProvider) {
      this.primaryProvider = options.primaryProvider;
    } else if (options.geminiApiKey) {
      this.primaryProvider = new GeminiProvider(options.geminiApiKey);
    }
  }

  /**
   * Process user question through full RAG pipeline
   */
  public async answerQuestion(query: string, options?: Partial<RetrievalQuery>): Promise<RagAnswerResponse> {
    const startTime = Date.now();
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) {
      return {
        query: '',
        answer: 'Vui lòng nhập câu hỏi để tìm kiếm và giải đáp từ kho tư liệu Không gian Văn hóa Hồ Chí Minh.',
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: 'None',
        metrics: {
          retrievalTimeMs: 0,
          generationTimeMs: 0,
          totalTimeMs: 0,
          chunksEvaluated: 0,
          chunksRetrieved: 0,
          chunksUsedInAnswer: 0
        },
        governanceNotice: 'ADR-002 Phase 01: Chế độ RAG Thực nghiệm nội bộ',
        timestamp: new Date().toISOString()
      };
    }

    // Step 1: Retrieval
    const retrievalStart = Date.now();
    const retrievedChunks = await this.retrievalEngine.retrieve({
      query: cleanQuery,
      topK: options?.topK || 4,
      categoryFilter: options?.categoryFilter,
      topicFilter: options?.topicFilter,
      minScore: options?.minScore || 0.25
    });
    const retrievalTimeMs = Date.now() - retrievalStart;

    const allChunksCount = this.retrievalEngine.getAllChunks().length;

    // Step 2: Evidence Check
    const topScore = retrievedChunks.length > 0 ? retrievedChunks[0].score : 0;
    const evidenceFound = retrievedChunks.length > 0 && topScore >= this.minEvidenceScore;

    if (!evidenceFound) {
      const fallbackResult = this.localEngine.synthesize(cleanQuery, []);
      const totalTimeMs = Date.now() - startTime;

      return {
        query: cleanQuery,
        answer: fallbackResult.answer,
        citations: [],
        evidenceFound: false,
        conflictDetected: false,
        modelUsed: fallbackResult.modelUsed,
        metrics: {
          retrievalTimeMs,
          generationTimeMs: 0,
          totalTimeMs,
          chunksEvaluated: allChunksCount,
          chunksRetrieved: 0,
          chunksUsedInAnswer: 0
        },
        governanceNotice: 'ADR-002 Phase 01: Không tìm thấy bằng chứng phù hợp trong kho tư liệu đã duyệt',
        timestamp: new Date().toISOString()
      };
    }

    // Step 3: Generation
    const genStart = Date.now();
    let answerText = '';
    let modelName = '';
    let citations: RagCitation[] = [];

    // Check if primary cloud provider is available
    let usedProvider = false;
    if (this.primaryProvider) {
      try {
        const isAvail = await this.primaryProvider.isAvailable();
        if (isAvail) {
          const cloudRes = await this.primaryProvider.generateGroundedAnswer(cleanQuery, retrievedChunks);
          answerText = cloudRes.answer;
          modelName = cloudRes.modelUsed;
          citations = cloudRes.citations;
          usedProvider = true;
        }
      } catch (err) {
        console.warn('[RAG AnswerEngine] Primary provider error, falling back to local grounded engine:', err);
      }
    }

    // Fallback to deterministic local grounded engine
    if (!usedProvider) {
      const localRes = this.localEngine.synthesize(cleanQuery, retrievedChunks);
      answerText = localRes.answer;
      modelName = localRes.modelUsed;
      citations = localRes.citations;
    }

    const generationTimeMs = Date.now() - genStart;
    const totalTimeMs = Date.now() - startTime;

    return {
      query: cleanQuery,
      answer: answerText,
      citations,
      evidenceFound: true,
      conflictDetected: false,
      modelUsed: modelName,
      metrics: {
        retrievalTimeMs,
        generationTimeMs,
        totalTimeMs,
        chunksEvaluated: allChunksCount,
        chunksRetrieved: retrievedChunks.length,
        chunksUsedInAnswer: citations.length
      },
      governanceNotice: 'ADR-002 Phase 01: Dữ liệu trích xuất có căn cứ từ kho tư liệu kiểm duyệt của Không gian Văn hóa Hồ Chí Minh – THCS Nguyễn Trung Trực',
      timestamp: new Date().toISOString()
    };
  }
}
