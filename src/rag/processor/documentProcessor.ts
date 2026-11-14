/**
 * ADR-002: Document Processor
 * Pipeline: Raw Document -> Normalization -> Chunking -> Metadata Tagging -> Verified Chunks
 *
 * Rules:
 * - Deterministic, reproducible chunk ID generation.
 * - Exact metadata attachment (document ID, title, section, provenance locator, status).
 * - No hallucinated page numbers or missing locators.
 */

import { KnowledgeDocument, DocumentChunk } from '../types/ragTypes';

export interface ChunkingOptions {
  maxChunkSize?: number; // Target character length (default: 450)
  overlapSize?: number; // Overlap length (default: 60)
  preserveParagraphs?: boolean;
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  maxChunkSize: 450,
  overlapSize: 60,
  preserveParagraphs: true
};

export class DocumentProcessor {
  private options: Required<ChunkingOptions>;

  constructor(options?: ChunkingOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Process a single document into an array of verifiable chunks
   */
  public processDocument(doc: KnowledgeDocument): DocumentChunk[] {
    if (!doc.content || !doc.content.trim()) {
      return [];
    }

    const processedAt = new Date().toISOString();
    const rawParagraphs = doc.content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const chunks: DocumentChunk[] = [];
    let chunkCounter = 1;

    for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
      const paragraph = rawParagraphs[pIdx];

      // Extract section title header if present (e.g. "VỀ ĐOÀN KẾT:", "ĐIỀU MONG MUỐN CUỐI CÙNG:")
      let sectionLabel = `Mục ${pIdx + 1}`;
      const headerMatch = paragraph.match(/^([A-ZÀ-Ỹ\s]{3,30}:)/);
      if (headerMatch) {
        sectionLabel = `Phần ${headerMatch[1].replace(':', '').trim()}`;
      }

      if (paragraph.length <= this.options.maxChunkSize) {
        // Paragraph fits in a single chunk
        const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, '0')}`;
        chunks.push({
          id: chunkId,
          documentId: doc.id,
          documentTitle: doc.title,
          content: paragraph,
          sectionOrPage: sectionLabel,
          topic: doc.topics[0] || 'Chủ tịch Hồ Chí Minh',
          processedAt,
          sourceStatus: doc.status,
          provenanceLocator: `corpus://${doc.id}#${chunkId}`,
          tokenEstimate: Math.ceil(paragraph.length / 4),
          metadata: {
            category: doc.category,
            authorOrSource: doc.authorOrSource,
            dateOrEra: doc.dateOrEra,
            paragraphIndex: pIdx + 1
          }
        });
        chunkCounter++;
      } else {
        // Paragraph exceeds maxChunkSize -> Subdivide into sliding windows on sentence boundaries
        const sentences = paragraph
          .split(/(?<=[.?!])\s+/)
          .filter(s => s.trim().length > 0);

        let currentChunkText = '';
        let subIndex = 1;

        for (const sentence of sentences) {
          if ((currentChunkText + ' ' + sentence).length > this.options.maxChunkSize && currentChunkText.length > 0) {
            const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, '0')}`;
            chunks.push({
              id: chunkId,
              documentId: doc.id,
              documentTitle: doc.title,
              content: currentChunkText.trim(),
              sectionOrPage: `${sectionLabel} (Đoạn ${subIndex})`,
              topic: doc.topics[0] || 'Chủ tịch Hồ Chí Minh',
              processedAt,
              sourceStatus: doc.status,
              provenanceLocator: `corpus://${doc.id}#${chunkId}`,
              tokenEstimate: Math.ceil(currentChunkText.length / 4),
              metadata: {
                category: doc.category,
                authorOrSource: doc.authorOrSource,
                dateOrEra: doc.dateOrEra,
                paragraphIndex: pIdx + 1,
                subIndex
              }
            });
            chunkCounter++;
            subIndex++;

            // Create overlap by taking the last part of currentChunkText
            const words = currentChunkText.split(' ');
            const overlapWords = words.slice(Math.max(0, words.length - 8)).join(' ');
            currentChunkText = overlapWords + ' ' + sentence;
          } else {
            currentChunkText = currentChunkText ? `${currentChunkText} ${sentence}` : sentence;
          }
        }

        if (currentChunkText.trim().length > 0) {
          const chunkId = `${doc.id}-CHK-${String(chunkCounter).padStart(2, '0')}`;
          chunks.push({
            id: chunkId,
            documentId: doc.id,
            documentTitle: doc.title,
            content: currentChunkText.trim(),
            sectionOrPage: `${sectionLabel} (Đoạn ${subIndex})`,
            topic: doc.topics[0] || 'Chủ tịch Hồ Chí Minh',
            processedAt,
            sourceStatus: doc.status,
            provenanceLocator: `corpus://${doc.id}#${chunkId}`,
            tokenEstimate: Math.ceil(currentChunkText.length / 4),
            metadata: {
              category: doc.category,
              authorOrSource: doc.authorOrSource,
              dateOrEra: doc.dateOrEra,
              paragraphIndex: pIdx + 1,
              subIndex
            }
          });
          chunkCounter++;
        }
      }
    }

    return chunks;
  }

  /**
   * Batch process multiple documents
   */
  public processDocuments(docs: KnowledgeDocument[]): DocumentChunk[] {
    const allChunks: DocumentChunk[] = [];
    for (const doc of docs) {
      const chunks = this.processDocument(doc);
      allChunks.push(...chunks);
    }
    return allChunks;
  }
}
