/**
 * Okapi BM25 Lexical Retrieval Engine
 * Supports dual-indexing (Accented + Non-accented Vietnamese) for robust search.
 */

import { DocumentChunk, ScoredChunk } from '../types/ragTypes';
import { tokenize, removeVietnameseAccents, normalizeText } from './textNormalizer';

interface IndexedDoc {
  chunk: DocumentChunk;
  accentedTokens: string[];
  nonAccentedTokens: string[];
  tokenCountsAccented: Map<string, number>;
  tokenCountsNonAccented: Map<string, number>;
  length: number;
}

export class BM25Retriever {
  private k1: number = 1.5;
  private b: number = 0.75;

  private docs: IndexedDoc[] = [];
  private avgDocLength: number = 0;
  private docFreqAccented: Map<string, number> = new Map();
  private docFreqNonAccented: Map<string, number> = new Map();

  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
  }

  /**
   * Build index from chunks
   */
  public buildIndex(chunks: DocumentChunk[]): void {
    this.docs = [];
    this.docFreqAccented.clear();
    this.docFreqNonAccented.clear();

    if (chunks.length === 0) {
      this.avgDocLength = 0;
      return;
    }

    let totalLength = 0;

    for (const chunk of chunks) {
      const fullSearchText = `${chunk.documentTitle} ${chunk.topic} ${chunk.content}`;
      const accentedTokens = tokenize(fullSearchText, true);
      const nonAccentedTokens = accentedTokens.map(t => removeVietnameseAccents(t));

      const tokenCountsAccented = new Map<string, number>();
      for (const t of accentedTokens) {
        tokenCountsAccented.set(t, (tokenCountsAccented.get(t) || 0) + 1);
      }

      const tokenCountsNonAccented = new Map<string, number>();
      for (const t of nonAccentedTokens) {
        tokenCountsNonAccented.set(t, (tokenCountsNonAccented.get(t) || 0) + 1);
      }

      // Update document frequency
      for (const t of tokenCountsAccented.keys()) {
        this.docFreqAccented.set(t, (this.docFreqAccented.get(t) || 0) + 1);
      }
      for (const t of tokenCountsNonAccented.keys()) {
        this.docFreqNonAccented.set(t, (this.docFreqNonAccented.get(t) || 0) + 1);
      }

      const docLen = accentedTokens.length;
      totalLength += docLen;

      this.docs.push({
        chunk,
        accentedTokens,
        nonAccentedTokens,
        tokenCountsAccented,
        tokenCountsNonAccented,
        length: docLen
      });
    }

    this.avgDocLength = totalLength / this.docs.length;
  }

  /**
   * Calculate IDF with smoothing
   */
  private computeIDF(df: number, totalDocs: number): number {
    return Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
  }

  /**
   * Search chunks by query
   */
  public search(query: string, topK: number = 5, minScore: number = 0.5): ScoredChunk[] {
    if (!query || !query.trim() || this.docs.length === 0) {
      return [];
    }

    const queryAccented = tokenize(query, true);
    const queryNonAccented = queryAccented.map(t => removeVietnameseAccents(t));
    const normalizedQuery = normalizeText(query);
    const nonAccentedQuery = removeVietnameseAccents(normalizedQuery);

    const scoredResults: ScoredChunk[] = [];
    const totalDocs = this.docs.length;

    for (const doc of this.docs) {
      let bm25Score = 0;
      const matchedTerms: string[] = [];
      const matchReasons: string[] = [];

      // Evaluate accented terms
      for (const term of queryAccented) {
        const tf = doc.tokenCountsAccented.get(term) || 0;
        if (tf > 0) {
          const df = this.docFreqAccented.get(term) || 1;
          const idf = this.computeIDF(df, totalDocs);
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.length / (this.avgDocLength || 1)));
          bm25Score += idf * (numerator / denominator);
          matchedTerms.push(term);
        }
      }

      // If accented score is weak, check non-accented fallback
      for (const term of queryNonAccented) {
        const tf = doc.tokenCountsNonAccented.get(term) || 0;
        if (tf > 0 && !matchedTerms.includes(term)) {
          const df = this.docFreqNonAccented.get(term) || 1;
          const idf = this.computeIDF(df, totalDocs);
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.length / (this.avgDocLength || 1)));
          // Slightly discount accent-less matches
          bm25Score += 0.85 * idf * (numerator / denominator);
          matchedTerms.push(term);
        }
      }

      // Title & Topic exact match boost
      const titleNorm = normalizeText(doc.chunk.documentTitle);
      const titleNonAcc = removeVietnameseAccents(titleNorm);
      if (titleNorm.includes(normalizedQuery) || titleNonAcc.includes(nonAccentedQuery)) {
        bm25Score *= 1.4;
        matchReasons.push('Khớp tiêu đề tài liệu');
      }

      // Exact phrase match in content boost
      const contentNorm = normalizeText(doc.chunk.content);
      const contentNonAcc = removeVietnameseAccents(contentNorm);
      if (contentNorm.includes(normalizedQuery) || (nonAccentedQuery.length > 6 && contentNonAcc.includes(nonAccentedQuery))) {
        bm25Score *= 1.35;
        matchReasons.push('Khớp cụm từ nguyên văn');
      }

      if (matchedTerms.length > 0) {
        matchReasons.push(`Khớp ${matchedTerms.length} từ khóa: [${matchedTerms.slice(0, 5).join(', ')}]`);
      }

      // Require at least 1 meaningful keyword match to consider
      if (matchedTerms.length === 0) {
        continue;
      }

      // For queries with multiple terms, enforce minimum query keyword coverage ratio (>= 30%)
      // to prevent false positives from generic words (e.g. "hôm nay")
      const queryKeyTerms = queryAccented.length;
      const coverageRatio = matchedTerms.length / queryKeyTerms;
      const isExactMatch = titleNorm.includes(normalizedQuery) || contentNorm.includes(normalizedQuery);

      if (queryKeyTerms >= 4 && coverageRatio < 0.30 && !isExactMatch) {
        continue;
      }

      if (bm25Score >= minScore) {
        scoredResults.push({
          chunk: doc.chunk,
          score: Math.round(bm25Score * 100) / 100,
          matchReasons,
          termMatches: matchedTerms
        });
      }
    }

    // Sort descending by score
    scoredResults.sort((a, b) => b.score - a.score);

    return scoredResults.slice(0, topK);
  }
}
