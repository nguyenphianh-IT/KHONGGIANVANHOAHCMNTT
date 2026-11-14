/**
 * ADR-002 Phase 02: Document Ingestion Pipeline
 * Pipeline: File Upload -> Format Check -> Text Extraction -> Checksum Duplicate Check ->
 * Chunking -> Metadata Tagging -> PENDING_REVIEW -> Persistent Ingestion Job Tracking.
 */

import {
  RealKnowledgeDocument,
  DocumentChunk,
  IngestionJob,
  DocumentType
} from '../types/ragTypes';
import { documentRegistry } from '../knowledge/documentRegistry';
import { DocumentProcessor } from '../processor/documentProcessor';

export interface IngestionInput {
  fileName: string;
  fileBuffer?: ArrayBuffer | Uint8Array | string;
  textRaw?: string;
  mimeType: string;
  title?: string;
  description?: string;
  documentType?: DocumentType;
  category?: string;
  author?: string;
  publisher?: string;
  sourceUrl?: string;
  topics?: string[];
  customId?: string;
  uploadedBy?: string;
  uploadedByName?: string;
}

export interface IngestionResult {
  success: boolean;
  job: IngestionJob;
  document?: RealKnowledgeDocument;
  chunks?: DocumentChunk[];
  error?: string;
  isDuplicate?: boolean;
}

export class DocumentIngestionService {
  private processor: DocumentProcessor;
  private jobs: Map<string, IngestionJob> = new Map();
  private maxFileSizeBytes = 10 * 1024 * 1024; // 10MB limit

  constructor() {
    this.processor = new DocumentProcessor({
      maxChunkSize: 450,
      overlapSize: 60,
      preserveParagraphs: true
    });
  }

  /**
   * Extract plain text from various file formats (TXT, MD, DOCX, PDF)
   */
  public extractText(input: IngestionInput): string {
    // 1. Direct raw text if provided
    if (input.textRaw && typeof input.textRaw === 'string') {
      return input.textRaw.trim();
    }

    if (!input.fileBuffer) {
      throw new Error('Không có nội dung file được cung cấp.');
    }

    // 2. String buffer
    if (typeof input.fileBuffer === 'string') {
      return input.fileBuffer.trim();
    }

    const uint8 = input.fileBuffer instanceof Uint8Array ? input.fileBuffer : new Uint8Array(input.fileBuffer);

    // 3. Plain text / Markdown
    const ext = input.fileName.split('.').pop()?.toLowerCase();
    if (ext === 'txt' || ext === 'md' || input.mimeType.includes('text/')) {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(uint8).trim();
    }

    // 4. DOCX file parser (Extracts <w:t> tags from document.xml inside ZIP)
    if (ext === 'docx' || input.mimeType.includes('wordprocessingml')) {
      return this.extractTextFromDocx(uint8);
    }

    // 5. PDF text stream extractor (basic text extraction)
    if (ext === 'pdf' || input.mimeType.includes('pdf')) {
      return this.extractTextFromPdf(uint8);
    }

    // Fallback attempt text decode
    try {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(uint8).trim();
    } catch (e) {
      throw new Error(`Định dạng file .${ext} (${input.mimeType}) chưa được hỗ trợ trích xuất văn bản.`);
    }
  }

  /**
   * Extract text from DOCX binary
   */
  private extractTextFromDocx(buffer: Uint8Array): string {
    // A docx is a zip file. We search for text content within <w:t> XML tags.
    const decoder = new TextDecoder('latin1');
    const rawStr = decoder.decode(buffer);

    // Find all <w:t> tags using regex matching XML tag content
    const textMatches: string[] = [];
    const wtRegex = /<w:t(?:[\s>][^>]*)?>([^<]+)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(rawStr)) !== null) {
      if (match[1] && match[1].trim()) {
        textMatches.push(match[1]);
      }
    }

    if (textMatches.length > 0) {
      // Decode UTF-8 bytes that were parsed as latin1
      const assembledText = textMatches.join(' ');
      try {
        const bytes = new Uint8Array(assembledText.length);
        for (let i = 0; i < assembledText.length; i++) {
          bytes[i] = assembledText.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes).replace(/\s+/g, ' ').trim();
      } catch (err) {
        return assembledText.replace(/\s+/g, ' ').trim();
      }
    }

    throw new Error('Không thể trích xuất văn bản từ tệp DOCX. Tệp có thể rỗng hoặc được mã hóa.');
  }

  /**
   * Extract text from PDF binary (Text stream parsing)
   */
  private extractTextFromPdf(buffer: Uint8Array): string {
    const decoder = new TextDecoder('latin1');
    const pdfStr = decoder.decode(buffer);

    // Extract text blocks inside BT (Begin Text) ... ET (End Text)
    const textBlocks: string[] = [];
    const textBlockRegex = /BT[\s\S]*?ET/g;
    const tjRegex = /\(([^)]+)\)\s*Tj/g;

    let block;
    while ((block = textBlockRegex.exec(pdfStr)) !== null) {
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block[0])) !== null) {
        if (tjMatch[1]) {
          textBlocks.push(tjMatch[1]);
        }
      }
    }

    if (textBlocks.length > 0) {
      return textBlocks.join(' ').replace(/\\([()\\])/g, '$1').replace(/\s+/g, ' ').trim();
    }

    throw new Error('Tệp PDF không chứa văn bản có thể trích xuất trực tiếp (có thể là tệp scan ảnh). Vui lòng chuyển đổi sang TXT hoặc PDF có lớp văn bản.');
  }

  /**
   * Execute full ingestion pipeline
   */
  public async ingestDocument(input: IngestionInput): Promise<IngestionResult> {
    const startTime = Date.now();
    const jobId = `JOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const initialJob: IngestionJob = {
      jobId,
      documentId: '',
      fileName: input.fileName,
      fileSize: input.fileBuffer ? (typeof input.fileBuffer === 'string' ? input.fileBuffer.length : input.fileBuffer.byteLength) : (input.textRaw?.length || 0),
      mimeType: input.mimeType,
      status: 'processing',
      chunksCreated: 0,
      startedAt: new Date().toISOString()
    };
    this.jobs.set(jobId, initialJob);

    try {
      // 1. Validation: File size
      if (initialJob.fileSize > this.maxFileSizeBytes) {
        throw new Error(`Dung lượng tệp (${(initialJob.fileSize / 1024 / 1024).toFixed(1)}MB) vượt quá giới hạn tối đa cho phép (10MB).`);
      }

      // 2. Text Extraction
      const rawText = this.extractText(input);
      if (!rawText || rawText.trim().length < 20) {
        throw new Error('Nội dung văn bản trích xuất quá ngắn hoặc rỗng (tối thiểu 20 ký tự).');
      }

      // 3. Document Registration with Checksum duplicate check
      const docTitle = input.title || input.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const regResult = await documentRegistry.registerDocument({
        customId: input.customId,
        title: docTitle,
        description: input.description || `Tài liệu số hóa từ ${input.fileName}`,
        documentType: input.documentType || 'article',
        category: input.category || 'Tài liệu số hóa',
        author: input.author || 'Tư liệu nhà trường',
        publisher: input.publisher || 'THCS Nguyễn Trung Trực',
        sourceUrl: input.sourceUrl || '',
        originalFileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: initialJob.fileSize,
        topics: input.topics || ['Không gian văn hóa Hồ Chí Minh'],
        content: rawText,
        chunksCount: 0,
        uploadedBy: input.uploadedBy,
        uploadedByName: input.uploadedByName
      });

      if (regResult.isDuplicate) {
        initialJob.status = 'failed';
        initialJob.documentId = regResult.existingDocId!;
        initialJob.errorMessage = `Tài liệu trùng lặp với tài liệu đã có trong kho (${regResult.existingDocId}) qua mã băm SHA-256.`;
        initialJob.completedAt = new Date().toISOString();
        initialJob.executionTimeMs = Date.now() - startTime;
        this.jobs.set(jobId, initialJob);

        return {
          success: false,
          job: initialJob,
          document: regResult.document,
          isDuplicate: true,
          error: initialJob.errorMessage
        };
      }

      const document = regResult.document;
      initialJob.documentId = document.documentId;

      // 4. Chunking using DocumentProcessor
      const legacyDoc = {
        id: document.documentId,
        title: document.title,
        category: document.category,
        categoryLabel: document.category,
        authorOrSource: document.author,
        dateOrEra: document.createdAt.split('T')[0],
        content: document.content,
        status: document.approvalStatus,
        isAllowedForRag: document.isAllowedForRag,
        topics: document.topics
      };

      const chunks = this.processor.processDocument(legacyDoc);

      // 5. Update Registry with chunk count
      documentRegistry.updateChunksCount(document.documentId, chunks.length);
      document.chunksCount = chunks.length;

      // 6. Complete Ingestion Job
      initialJob.status = 'completed';
      initialJob.chunksCreated = chunks.length;
      initialJob.completedAt = new Date().toISOString();
      initialJob.executionTimeMs = Date.now() - startTime;
      this.jobs.set(jobId, initialJob);

      return {
        success: true,
        job: initialJob,
        document,
        chunks
      };
    } catch (err: any) {
      initialJob.status = 'failed';
      initialJob.errorMessage = err?.message || 'Lỗi không xác định trong quá trình xử lý tài liệu';
      initialJob.completedAt = new Date().toISOString();
      initialJob.executionTimeMs = Date.now() - startTime;
      this.jobs.set(jobId, initialJob);

      return {
        success: false,
        job: initialJob,
        error: initialJob.errorMessage
      };
    }
  }

  /**
   * Reprocess existing document chunks cleanly without duplicates
   */
  public reprocessDocument(doc: RealKnowledgeDocument): DocumentChunk[] {
    const legacyDoc = {
      id: doc.documentId,
      title: doc.title,
      category: doc.category,
      categoryLabel: doc.category,
      authorOrSource: doc.author,
      dateOrEra: doc.createdAt.split('T')[0],
      content: doc.content,
      status: doc.approvalStatus,
      isAllowedForRag: doc.isAllowedForRag,
      topics: doc.topics
    };

    const newChunks = this.processor.processDocument(legacyDoc);
    documentRegistry.updateChunksCount(doc.documentId, newChunks.length);
    doc.chunksCount = newChunks.length;
    return newChunks;
  }

  /**
   * Get all tracked ingestion jobs
   */
  public getJobs(): IngestionJob[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }
}

// Global Singleton Ingestion Service
export const documentIngestion = new DocumentIngestionService();
