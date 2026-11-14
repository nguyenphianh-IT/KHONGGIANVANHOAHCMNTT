/**
 * ADR-002: AI Provider Layer Abstraction
 * Supports Local Grounded Fallback, Google Gemini API, and extensible custom LLM endpoints.
 */

import { IAIProvider, ScoredChunk, RagCitation } from '../types/ragTypes';
import { LocalGroundedEngine } from '../engine/localGroundedEngine';
import { RAG_SYSTEM_PROMPT, buildUserPrompt } from '../engine/promptTemplates';

/**
 * Local Grounded Provider (Zero external dependencies, 100% offline DEV mode)
 */
export class LocalGroundedProvider implements IAIProvider {
  public providerName = 'Local Grounded Engine (Offline DEV)';
  private engine: LocalGroundedEngine;

  constructor() {
    this.engine = new LocalGroundedEngine();
  }

  public async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  public async generateGroundedAnswer(
    query: string,
    contextChunks: ScoredChunk[]
  ): Promise<{
    answer: string;
    modelUsed: string;
    citations: RagCitation[];
  }> {
    const res = this.engine.synthesize(query, contextChunks);
    return {
      answer: res.answer,
      modelUsed: res.modelUsed,
      citations: res.citations
    };
  }
}

/**
 * Google Gemini Provider Adapter (Optional Cloud LLM Integration)
 */
export class GeminiProvider implements IAIProvider {
  public providerName = 'Google Gemini (Gemini 1.5 Flash)';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'gemini-1.5-flash') {
    let envKey = '';
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
      envKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    } else if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.GEMINI_API_KEY) {
      envKey = (globalThis as any).process.env.GEMINI_API_KEY;
    }
    this.apiKey = apiKey || envKey;
    this.model = model;
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  public async generateGroundedAnswer(
    query: string,
    contextChunks: ScoredChunk[]
  ): Promise<{
    answer: string;
    modelUsed: string;
    citations: RagCitation[];
  }> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Build context snippet
    const contextSnippet = contextChunks
      .map((sc, idx) => `[${idx + 1}] Nguồn: ${sc.chunk.documentTitle} (${sc.chunk.sectionOrPage})\nNội dung: ${sc.chunk.content}`)
      .join('\n\n');

    const promptText = buildUserPrompt(query, contextSnippet);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${RAG_SYSTEM_PROMPT}\n\n${promptText}` }] }
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for high factual precision
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Generate citations matching context chunks
    const citations: RagCitation[] = contextChunks.map((sc, idx) => ({
      citationId: `[${idx + 1}]`,
      chunkId: sc.chunk.id,
      documentId: sc.chunk.documentId,
      documentTitle: sc.chunk.documentTitle,
      authorOrSource: (sc.chunk.metadata?.authorOrSource as string) || 'Tư liệu lịch sử',
      dateOrEra: (sc.chunk.metadata?.dateOrEra as string) || 'Tư liệu lịch sử',
      sectionOrPage: sc.chunk.sectionOrPage,
      snippet: sc.chunk.content.substring(0, 180) + '...',
      confidenceScore: sc.score,
      verificationStatus: sc.chunk.sourceStatus === 'APPROVED' ? 'VERIFIED' : 'CAUTION',
      sourceUrl: (sc.chunk.metadata?.sourceUrl as string) || undefined
    }));

    return {
      answer: candidateText,
      modelUsed: `Google Gemini (${this.model})`,
      citations
    };
  }
}
