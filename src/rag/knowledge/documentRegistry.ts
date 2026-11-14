/**
 * ADR-002 Phase 02: Real Knowledge Base - Document Registry
 * Implements auditable document tracking, checksum duplicate detection, and Four-Eyes approval lifecycle.
 */

import {
  RealKnowledgeDocument,
  DocumentApprovalStatus,
  DocumentType,
  DocumentCategoryDefinition,
  HCM_STANDARD_CATEGORIES,
  KnowledgeDocument
} from '../types/ragTypes';
import { SAMPLE_HCM_DOCUMENTS } from './sampleCorpus';

/**
 * Universal SHA-256 hash helper (works in Node.js, Vercel Serverless, and Browser)
 */
export async function computeSha256(text: string): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  // Deterministic 64-character hash fallback
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `${p1}${p2}${p1}${p2}${p1}${p2}${p1}${p2}`.toUpperCase().substring(0, 64);
}

/**
 * Seed initial historical corpus into RealKnowledgeDocument format
 */
export async function seedInitialDocuments(): Promise<RealKnowledgeDocument[]> {
  const initialDocs: RealKnowledgeDocument[] = [];

  for (const doc of SAMPLE_HCM_DOCUMENTS) {
    const checksum = await computeSha256(doc.content);
    initialDocs.push({
      documentId: doc.id,
      title: doc.title,
      description: (doc.metadata?.historicalSignificance as string) || doc.title,
      documentType: (doc.category as DocumentType) || 'article',
      category: doc.category,
      author: doc.authorOrSource,
      publisher: (doc.metadata?.volume as string) || 'Hội đồng Khoa học Bảo tàng Hồ Chí Minh',
      sourceUrl: doc.sourceUrl || '',
      originalFileName: `${doc.id.toLowerCase()}.md`,
      mimeType: 'text/markdown',
      checksum,
      fileSize: doc.content.length,
      createdAt: '2026-11-14T00:00:00.000Z',
      updatedAt: '2026-11-14T00:00:00.000Z',
      approvalStatus: doc.status,
      isAllowedForRag: doc.isAllowedForRag,
      version: 1,
      approvedBy: doc.status === 'APPROVED' ? 'Hội đồng Thẩm định THCS Nguyễn Trung Trực' : undefined,
      approvedAt: doc.status === 'APPROVED' ? '2026-11-14T00:00:00.000Z' : undefined,
      topics: doc.topics,
      content: doc.content,
      chunksCount: 0,
      metadata: doc.metadata
    });
  }

  return initialDocs;
}

export class DocumentRegistry {
  private documents: Map<string, RealKnowledgeDocument> = new Map();
  private checksumIndex: Map<string, string> = new Map(); // checksum -> documentId
  private categories: DocumentCategoryDefinition[] = [...HCM_STANDARD_CATEGORIES];
  private isInitialized = false;

  /**
   * Initialize registry with seeds
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    const seeds = await seedInitialDocuments();
    for (const doc of seeds) {
      this.documents.set(doc.documentId, doc);
      this.checksumIndex.set(doc.checksum, doc.documentId);
    }
    this.isInitialized = true;
  }

  /**
   * Get all registered documents
   */
  public getAllDocuments(statusFilter?: DocumentApprovalStatus): RealKnowledgeDocument[] {
    const all = Array.from(this.documents.values());
    if (statusFilter) {
      return all.filter(d => d.approvalStatus === statusFilter);
    }
    return all;
  }

  /**
   * Get approved documents allowed for RAG retrieval
   */
  public getApprovedRagDocuments(): RealKnowledgeDocument[] {
    return Array.from(this.documents.values()).filter(
      d => d.approvalStatus === 'APPROVED' && d.isAllowedForRag === true
    );
  }

  /**
   * Convert to legacy KnowledgeDocument format for retrieval engine compatibility
   */
  public getApprovedAsKnowledgeDocuments(): KnowledgeDocument[] {
    return this.getApprovedRagDocuments().map(d => ({
      id: d.documentId,
      title: d.title,
      category: d.category,
      categoryLabel: d.category,
      authorOrSource: d.author,
      dateOrEra: (d.metadata?.dateOrEra as string) || d.createdAt.split('T')[0],
      content: d.content,
      sourceUrl: d.sourceUrl,
      status: d.approvalStatus,
      isAllowedForRag: d.isAllowedForRag,
      topics: d.topics,
      metadata: d.metadata
    }));
  }

  /**
   * Find document by ID
   */
  public getDocumentById(docId: string): RealKnowledgeDocument | undefined {
    return this.documents.get(docId);
  }

  /**
   * Register a new ingested document (starts as PENDING_REVIEW)
   */
  public async registerDocument(
    doc: Omit<RealKnowledgeDocument, 'documentId' | 'checksum' | 'createdAt' | 'updatedAt' | 'approvalStatus' | 'isAllowedForRag' | 'version'> & {
      customId?: string;
    }
  ): Promise<{ document: RealKnowledgeDocument; isDuplicate: boolean; existingDocId?: string }> {
    await this.initialize();

    const checksum = await computeSha256(doc.content);

    // Checksum duplicate detection
    if (this.checksumIndex.has(checksum)) {
      const existingDocId = this.checksumIndex.get(checksum)!;
      return {
        document: this.documents.get(existingDocId)!,
        isDuplicate: true,
        existingDocId
      };
    }

    const documentId = doc.customId || `DOC-REAL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newDoc: RealKnowledgeDocument = {
      ...doc,
      documentId,
      checksum,
      createdAt: now,
      updatedAt: now,
      approvalStatus: 'PENDING_REVIEW', // Strict governance: NEVER auto-approved
      isAllowedForRag: false, // Strict governance: CANNOT be used in RAG until approved
      version: 1,
      uploadedBy: doc.uploadedBy,
      uploadedByName: doc.uploadedByName
    };

    this.documents.set(documentId, newDoc);
    this.checksumIndex.set(checksum, documentId);

    return {
      document: newDoc,
      isDuplicate: false
    };
  }

  /**
   * Four-Eyes Governance: Approve document for RAG usage
   */
  public approveDocument(docId: string, approverName: string, approverId?: string): RealKnowledgeDocument {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    // Strict Four-Eyes Governance: Uploader cannot self-approve their own submission
    if (doc.uploadedBy && approverId && doc.uploadedBy === approverId) {
      throw new Error(`Vi phạm nguyên tắc Phê duyệt 4 mắt: Người tải tài liệu (${doc.uploadedByName || doc.uploadedBy}) không được tự phê duyệt tài liệu do chính mình tải lên!`);
    }

    doc.approvalStatus = 'APPROVED';
    doc.isAllowedForRag = true;
    doc.approvedBy = approverName;
    doc.approverId = approverId;
    doc.approvedAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();

    this.documents.set(docId, doc);
    return doc;
  }

  /**
   * Four-Eyes Governance: Reject document
   */
  public rejectDocument(docId: string, rejecterName: string, reason: string, rejecterId?: string): RealKnowledgeDocument {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    doc.approvalStatus = 'REJECTED';
    doc.isAllowedForRag = false;
    doc.approvedBy = rejecterName;
    doc.approverId = rejecterId;
    doc.rejectionReason = `Bị từ chối bởi ${rejecterName}: ${reason}`;
    doc.updatedAt = new Date().toISOString();

    this.documents.set(docId, doc);
    return doc;
  }

  /**
   * Revoke or Archive document (Immediately removes from RAG index)
   */
  public archiveDocument(docId: string): RealKnowledgeDocument {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    doc.approvalStatus = 'ARCHIVED';
    doc.isAllowedForRag = false;
    doc.updatedAt = new Date().toISOString();

    this.documents.set(docId, doc);
    return doc;
  }

  /**
   * Update document chunks count
   */
  public updateChunksCount(docId: string, count: number): void {
    const doc = this.documents.get(docId);
    if (doc) {
      doc.chunksCount = count;
      doc.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Categories management
   */
  public getCategories(): DocumentCategoryDefinition[] {
    return this.categories;
  }

  public addCategory(cat: DocumentCategoryDefinition): void {
    if (!this.categories.some(c => c.id === cat.id)) {
      this.categories.push(cat);
    }
  }
}

// Global Singleton Document Registry
export const documentRegistry = new DocumentRegistry();
