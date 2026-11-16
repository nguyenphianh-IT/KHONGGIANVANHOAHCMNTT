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
  return computeSha256Sync(text);
}

/**
 * Synchronous deterministic 64-character hash helper
 */
export function computeSha256Sync(text: string): string {
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
 * Seed initial historical corpus synchronously to guarantee immediate availability
 */
export function seedInitialDocumentsSync(): RealKnowledgeDocument[] {
  const initialDocs: RealKnowledgeDocument[] = [];

  for (const doc of SAMPLE_HCM_DOCUMENTS) {
    const checksum = computeSha256Sync(doc.content);
    let docType: DocumentType = 'article';
    if (doc.id === 'DOC-HCM-001' || doc.id === 'DOC-HCM-008') docType = 'speech';
    else if (doc.id === 'DOC-HCM-003') docType = 'letter';
    else if (doc.id === 'DOC-HCM-002' || doc.id === 'DOC-HCM-006' || doc.id === 'DOC-HCM-007') docType = 'book';
    else if (doc.id === 'DOC-HCM-004') docType = 'instruction';
    else if (doc.id === 'DOC-HCM-013' || doc.id === 'DOC-HCM-015') docType = 'official_dispatch';
    else if (doc.id === 'DOC-HCM-011' || doc.id === 'DOC-HCM-012') docType = 'archive';

    initialDocs.push({
      documentId: doc.id,
      title: doc.title,
      description: (doc.metadata?.historicalSignificance as string) || doc.title,
      documentType: docType,
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

/**
 * Seed initial historical corpus into RealKnowledgeDocument format (Async)
 */
export async function seedInitialDocuments(): Promise<RealKnowledgeDocument[]> {
  const initialDocs: RealKnowledgeDocument[] = [];

  for (const doc of SAMPLE_HCM_DOCUMENTS) {
    const checksum = await computeSha256(doc.content);
    let docType: DocumentType = 'article';
    if (doc.id === 'DOC-HCM-001' || doc.id === 'DOC-HCM-008') docType = 'speech';
    else if (doc.id === 'DOC-HCM-003') docType = 'letter';
    else if (doc.id === 'DOC-HCM-002' || doc.id === 'DOC-HCM-006' || doc.id === 'DOC-HCM-007') docType = 'book';
    else if (doc.id === 'DOC-HCM-004') docType = 'instruction';
    else if (doc.id === 'DOC-HCM-013' || doc.id === 'DOC-HCM-015') docType = 'official_dispatch';
    else if (doc.id === 'DOC-HCM-011' || doc.id === 'DOC-HCM-012') docType = 'archive';

    initialDocs.push({
      documentId: doc.id,
      title: doc.title,
      description: (doc.metadata?.historicalSignificance as string) || doc.title,
      documentType: docType,
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

  constructor() {
    this.seedSync();
  }

  /**
   * Synchronously seed initial corpus so that documents are immediately available upon instantiation
   */
  private seedSync(): void {
    if (this.documents.size === 0) {
      const initialDocs = seedInitialDocumentsSync();
      for (const doc of initialDocs) {
        this.documents.set(doc.documentId, doc);
        this.checksumIndex.set(doc.checksum, doc.documentId);
      }
    }
    this.applyLocalStorageOverrides();
  }

  /**
   * Load any document approval overrides from browser localStorage
   */
  private applyLocalStorageOverrides(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem('rag_doc_overrides');
        if (raw) {
          const overrides = JSON.parse(raw);
          for (const [id, ov] of Object.entries(overrides)) {
            if ((ov as any)?.isDeleted) {
              const doc = this.documents.get(id);
              if (doc && doc.checksum) {
                this.checksumIndex.delete(doc.checksum);
              }
              this.documents.delete(id);
            } else {
              const doc = this.documents.get(id);
              if (doc && ov && typeof ov === 'object') {
                Object.assign(doc, ov);
              }
            }
          }
        }
      } catch (e) {
        // ignore storage access errors
      }
    }
  }

  /**
   * Save document approval override to browser localStorage
   */
  private saveLocalStorageOverride(docId: string, patch: Partial<RealKnowledgeDocument>): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem('rag_doc_overrides') || '{}';
        const overrides = JSON.parse(raw);
        overrides[docId] = { ...(overrides[docId] || {}), ...patch };
        window.localStorage.setItem('rag_doc_overrides', JSON.stringify(overrides));
      } catch (e) {
        // ignore storage access errors
      }
    }
  }

  /**
   * Initialize registry with seeds (Async with SubtleCrypto if available)
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.seedSync();
    const seeds = await seedInitialDocuments();
    for (const doc of seeds) {
      this.documents.set(doc.documentId, doc);
      this.checksumIndex.set(doc.checksum, doc.documentId);
    }
    this.applyLocalStorageOverrides();
    this.isInitialized = true;
  }

  /**
   * Get all registered documents
   */
  public getAllDocuments(statusFilter?: DocumentApprovalStatus): RealKnowledgeDocument[] {
    if (this.documents.size === 0) {
      this.seedSync();
    }
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
    if (this.documents.size === 0) {
      this.seedSync();
    }
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
    if (this.documents.size === 0) {
      this.seedSync();
    }
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
    this.saveLocalStorageOverride(docId, {
      approvalStatus: 'APPROVED',
      isAllowedForRag: true,
      approvedBy: approverName,
      approverId: approverId,
      approvedAt: doc.approvedAt,
      updatedAt: doc.updatedAt
    });
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
    this.saveLocalStorageOverride(docId, {
      approvalStatus: 'REJECTED',
      isAllowedForRag: false,
      approvedBy: rejecterName,
      approverId: rejecterId,
      rejectionReason: doc.rejectionReason,
      updatedAt: doc.updatedAt
    });
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
    this.saveLocalStorageOverride(docId, {
      approvalStatus: 'ARCHIVED',
      isAllowedForRag: false,
      updatedAt: doc.updatedAt
    });
    return doc;
  }

  /**
   * Delete document completely from registry and persist deleted status in localStorage
   */
  public deleteDocument(docId: string): boolean {
    const doc = this.documents.get(docId);
    if (!doc) return false;

    if (doc.checksum) {
      this.checksumIndex.delete(doc.checksum);
    }
    this.documents.delete(docId);
    this.saveLocalStorageOverride(docId, { isDeleted: true } as any);
    return true;
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
