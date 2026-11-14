/**
 * ADR-002 Phase 02: Persistent Storage Layer
 * Connects Supabase PostgreSQL tables when configured, with seamless offline local storage fallback.
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  RealKnowledgeDocument,
  DocumentChunk,
  DocumentApprovalStatus,
  RagUserFeedback,
  RagAnalyticsSummary
} from '../types/ragTypes';
import { documentRegistry } from '../knowledge/documentRegistry';
import { documentIngestion } from '../ingestion/documentIngestion';

export class PersistentRagStore {
  private isSupabaseLive: boolean = false;
  private localChunks: Map<string, DocumentChunk[]> = new Map(); // documentId -> DocumentChunk[]
  private localFeedbacks: RagUserFeedback[] = [];
  private localRetrievalLogs: Array<{
    query: string;
    evidenceFound: boolean;
    modelUsed: string;
    chunksRetrieved: number;
    chunksUsed: number;
    retrievalTimeMs: number;
    generationTimeMs: number;
    totalTimeMs: number;
    timestamp: string;
  }> = [];

  constructor() {
    this.isSupabaseLive = isSupabaseConfigured;
  }

  /**
   * Initialize store and sync with document registry
   */
  public async initialize(): Promise<void> {
    await documentRegistry.initialize();

    // In local mode, pre-generate chunks for all seed documents
    const allDocs = documentRegistry.getAllDocuments();
    for (const doc of allDocs) {
      if (!this.localChunks.has(doc.documentId)) {
        const chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(doc.documentId, chunks);
      }
    }

    // Attempt Supabase sync if configured
    if (this.isSupabaseLive) {
      try {
        const { error } = await supabase
          .from('rag_documents')
          .select('*')
          .limit(1);

        if (error) {
          console.warn('[PersistentRagStore] Supabase table rag_documents not ready yet. Using local persistent store:', error.message);
          this.isSupabaseLive = false;
        }
      } catch (e) {
        this.isSupabaseLive = false;
      }
    }
  }

  /**
   * Helper to strip internal administrative IDs from public outputs
   */
  private sanitizeForPublic(doc: RealKnowledgeDocument): RealKnowledgeDocument {
    const sanitized = { ...doc };
    delete sanitized.uploadedBy;
    delete sanitized.approverId;
    delete sanitized.rejectionReason;
    return sanitized;
  }

  /**
   * Retrieve all documents (with optional approval status filter and public privacy gate)
   */
  public async getDocuments(
    statusFilter?: DocumentApprovalStatus,
    publicOnly: boolean = false
  ): Promise<RealKnowledgeDocument[]> {
    let rawDocs: RealKnowledgeDocument[] = [];

    if (this.isSupabaseLive) {
      try {
        let query = supabase.from('rag_documents').select('*');
        if (publicOnly) {
          query = query.eq('approval_status', 'APPROVED').eq('is_allowed_for_rag', true);
        } else if (statusFilter) {
          query = query.eq('approval_status', statusFilter);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          rawDocs = data.map(this.mapDbToDocument);
        }
      } catch (err) {
        console.warn('[PersistentRagStore] Error fetching from Supabase, using local registry:', err);
      }
    }

    if (rawDocs.length === 0) {
      rawDocs = documentRegistry.getAllDocuments(publicOnly ? 'APPROVED' : statusFilter);
    }

    if (publicOnly) {
      return rawDocs
        .filter(d => d.approvalStatus === 'APPROVED' && d.isAllowedForRag === true)
        .map(d => this.sanitizeForPublic(d));
    }

    return rawDocs;
  }

  /**
   * Retrieve a single document by ID (with public privacy gate)
   */
  public async getDocumentById(
    docId: string,
    publicOnly: boolean = false
  ): Promise<RealKnowledgeDocument | undefined> {
    let doc: RealKnowledgeDocument | undefined;

    if (this.isSupabaseLive) {
      try {
        let query = supabase
          .from('rag_documents')
          .select('*')
          .eq('document_id', docId);

        if (publicOnly) {
          query = query.eq('approval_status', 'APPROVED').eq('is_allowed_for_rag', true);
        }

        const { data, error } = await query.single();
        if (!error && data) {
          doc = this.mapDbToDocument(data);
        }
      } catch (err) {
        // Fallback
      }
    }

    if (!doc) {
      doc = documentRegistry.getDocumentById(docId);
    }

    if (!doc) return undefined;

    if (publicOnly) {
      if (doc.approvalStatus !== 'APPROVED' || !doc.isAllowedForRag) {
        return undefined; // Hide unapproved document from public visitors
      }
      return this.sanitizeForPublic(doc);
    }

    return doc;
  }

  /**
   * Save a newly ingested document & its chunks
   */
  public async saveIngestedDocument(
    doc: RealKnowledgeDocument,
    chunks: DocumentChunk[]
  ): Promise<void> {
    this.localChunks.set(doc.documentId, chunks);

    if (this.isSupabaseLive) {
      try {
        // 1. Insert or update document
        await supabase.from('rag_documents').upsert({
          document_id: doc.documentId,
          title: doc.title,
          description: doc.description,
          document_type: doc.documentType,
          category: doc.category,
          author: doc.author,
          publisher: doc.publisher,
          source_url: doc.sourceUrl,
          original_file_name: doc.originalFileName,
          mime_type: doc.mimeType,
          checksum: doc.checksum,
          file_size: doc.fileSize,
          approval_status: doc.approvalStatus,
          is_allowed_for_rag: doc.isAllowedForRag,
          version: doc.version,
          uploaded_by: doc.uploadedBy,
          uploaded_by_name: doc.uploadedByName,
          topics: doc.topics,
          content: doc.content,
          chunks_count: chunks.length,
          updated_at: new Date().toISOString()
        });

        // 2. Insert chunks
        if (chunks.length > 0) {
          const dbChunks = chunks.map(c => ({
            chunk_id: c.id,
            document_id: c.documentId,
            document_title: c.documentTitle,
            content: c.content,
            section_or_page: c.sectionOrPage,
            topic: c.topic,
            source_status: c.sourceStatus,
            provenance_locator: c.provenanceLocator,
            token_estimate: c.tokenEstimate || 0,
            metadata: c.metadata || {}
          }));

          await supabase.from('rag_document_chunks').upsert(dbChunks);
        }
      } catch (err) {
        console.warn('[PersistentRagStore] Error writing to Supabase, saved locally:', err);
      }
    }
  }

  /**
   * Update document approval status (Four-Eyes governance)
   */
  public async updateDocumentStatus(
    docId: string,
    newStatus: DocumentApprovalStatus,
    operatorName: string,
    rejectionReason?: string,
    operatorId?: string
  ): Promise<RealKnowledgeDocument> {
    let updatedDoc: RealKnowledgeDocument;

    if (newStatus === 'APPROVED') {
      updatedDoc = documentRegistry.approveDocument(docId, operatorName, operatorId);
    } else if (newStatus === 'REJECTED') {
      updatedDoc = documentRegistry.rejectDocument(docId, operatorName, rejectionReason || 'Không đạt chuẩn', operatorId);
    } else if (newStatus === 'ARCHIVED') {
      updatedDoc = documentRegistry.archiveDocument(docId);
    } else {
      const doc = documentRegistry.getDocumentById(docId);
      if (!doc) throw new Error(`Document ${docId} not found`);
      doc.approvalStatus = newStatus;
      doc.isAllowedForRag = false;
      updatedDoc = doc;
    }

    // Update chunks status locally
    const chunks = this.localChunks.get(docId) || [];
    for (const c of chunks) {
      c.sourceStatus = newStatus;
    }

    // Update Supabase if available
    if (this.isSupabaseLive) {
      try {
        await supabase
          .from('rag_documents')
          .update({
            approval_status: updatedDoc.approvalStatus,
            is_allowed_for_rag: updatedDoc.isAllowedForRag,
            approved_by: updatedDoc.approvedBy,
            approved_at: updatedDoc.approvedAt,
            rejection_reason: updatedDoc.rejectionReason,
            updated_at: updatedDoc.updatedAt
          })
          .eq('document_id', docId);

        await supabase
          .from('rag_document_chunks')
          .update({
            source_status: updatedDoc.approvalStatus
          })
          .eq('document_id', docId);
      } catch (err) {
        console.warn('[PersistentRagStore] Supabase status update error:', err);
      }
    }

    return updatedDoc;
  }

  /**
   * Get all approved chunks for retrieval indexing
   */
  public async getAllApprovedChunks(): Promise<DocumentChunk[]> {
    const approvedDocs = documentRegistry.getApprovedRagDocuments();
    const result: DocumentChunk[] = [];

    for (const doc of approvedDocs) {
      let chunks = this.localChunks.get(doc.documentId);
      if (!chunks || chunks.length === 0) {
        chunks = documentIngestion.reprocessDocument(doc);
        this.localChunks.set(doc.documentId, chunks);
      }
      result.push(...chunks);
    }

    return result;
  }

  /**
   * Get chunks for a specific document
   */
  public getChunksByDocumentId(docId: string): DocumentChunk[] {
    return this.localChunks.get(docId) || [];
  }

  /**
   * Log retrieval query telemetry
   */
  public async logRetrieval(log: {
    query: string;
    evidenceFound: boolean;
    modelUsed: string;
    chunksRetrieved: number;
    chunksUsed: number;
    retrievalTimeMs: number;
    generationTimeMs: number;
    totalTimeMs: number;
  }): Promise<void> {
    const timestamp = new Date().toISOString();
    this.localRetrievalLogs.unshift({
      ...log,
      timestamp
    });
    if (this.localRetrievalLogs.length > 200) {
      this.localRetrievalLogs.pop();
    }

    if (this.isSupabaseLive) {
      try {
        await supabase.from('rag_retrieval_logs').insert([{ ...log, created_at: timestamp }]);
      } catch (e) {
        // Non-blocking telemetry
      }
    }
  }

  /**
   * Phase 04: Save user feedback on answer quality
   */
  public async saveFeedback(feedback: RagUserFeedback): Promise<void> {
    this.localFeedbacks.unshift(feedback);
    if (this.localFeedbacks.length > 200) {
      this.localFeedbacks.pop();
    }

    if (this.isSupabaseLive) {
      try {
        await supabase.from('rag_user_feedback').insert([{
          id: feedback.id,
          query: feedback.query,
          answer_snippet: feedback.answerSnippet,
          is_helpful: feedback.isHelpful,
          category: feedback.category,
          comment: feedback.comment,
          user_role: feedback.userRole,
          created_at: feedback.createdAt
        }]);
      } catch (e) {
        // Non-blocking feedback storage
      }
    }
  }

  /**
   * Phase 04: Operational Analytics Summary for Pilot Dashboard
   */
  public async getAnalytics(): Promise<RagAnalyticsSummary> {
    const allDocs = await this.getDocuments(undefined, false);
    const approvedDocs = allDocs.filter(d => d.approvalStatus === 'APPROVED');
    const pendingDocs = allDocs.filter(d => d.approvalStatus === 'PENDING_REVIEW');
    const rejectedDocs = allDocs.filter(d => d.approvalStatus === 'REJECTED');
    const archivedDocs = allDocs.filter(d => d.approvalStatus === 'ARCHIVED');

    let totalChunks = 0;
    for (const doc of approvedDocs) {
      const chunks = this.getChunksByDocumentId(doc.documentId);
      totalChunks += chunks.length || doc.chunksCount || 0;
    }

    const totalLogged = this.localRetrievalLogs.length;
    const evidenceFoundCount = this.localRetrievalLogs.filter(l => l.evidenceFound).length;
    const fallbackCount = totalLogged - evidenceFoundCount;
    const evidenceRatePercent = totalLogged > 0 ? Math.round((evidenceFoundCount / totalLogged) * 100) : 100;

    const ungroundedQueries = this.localRetrievalLogs
      .filter(l => !l.evidenceFound)
      .slice(0, 15)
      .map(l => ({ query: l.query, timestamp: l.timestamp }));

    const totalFeedback = this.localFeedbacks.length;
    const helpfulCount = this.localFeedbacks.filter(f => f.isHelpful).length;
    const unhelpfulCount = totalFeedback - helpfulCount;
    const satisfactionRatePercent = totalFeedback > 0 ? Math.round((helpfulCount / totalFeedback) * 100) : 100;

    const recentComments = this.localFeedbacks
      .filter(f => f.comment && f.comment.trim().length > 0)
      .slice(0, 10)
      .map(f => ({
        comment: f.comment!,
        isHelpful: f.isHelpful,
        category: f.category,
        createdAt: f.createdAt
      }));

    const health = await this.checkStagingHealth();

    return {
      documents: {
        total: allDocs.length,
        approved: approvedDocs.length,
        pending: pendingDocs.length,
        rejected: rejectedDocs.length,
        archived: archivedDocs.length
      },
      totalChunks,
      queries: {
        totalLogged,
        evidenceFoundCount,
        fallbackCount,
        evidenceRatePercent
      },
      ungroundedQueries,
      feedback: {
        total: totalFeedback,
        helpfulCount,
        unhelpfulCount,
        satisfactionRatePercent,
        recentComments
      },
      databaseHealth: {
        status: health.status,
        isSupabaseLive: health.isSupabaseLive
      }
    };
  }

  /**
   * Health and connectivity status for Staging operations
   */
  public async checkStagingHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'offline';
    isSupabaseLive: boolean;
    error?: string;
  }> {
    if (!this.isSupabaseLive) {
      return {
        status: 'degraded',
        isSupabaseLive: false,
        error: 'Cơ sở dữ liệu đám mây Supabase chưa được cấu hình hoặc bảng dữ liệu chưa sẵn sàng.'
      };
    }

    try {
      const { error } = await supabase.from('rag_documents').select('document_id').limit(1);
      if (error) {
        return {
          status: 'degraded',
          isSupabaseLive: false,
          error: `Lỗi truy vấn bảng rag_documents: ${error.message}`
        };
      }
      return {
        status: 'healthy',
        isSupabaseLive: true
      };
    } catch (e: any) {
      return {
        status: 'offline',
        isSupabaseLive: false,
        error: e?.message || 'Lỗi kết nối Supabase'
      };
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isSupabaseLive;
  }

  private mapDbToDocument(data: any): RealKnowledgeDocument {
    return {
      documentId: data.document_id,
      title: data.title,
      description: data.description,
      documentType: data.document_type,
      category: data.category,
      author: data.author,
      publisher: data.publisher,
      sourceUrl: data.source_url,
      originalFileName: data.original_file_name,
      mimeType: data.mime_type,
      checksum: data.checksum,
      fileSize: Number(data.file_size || 0),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      approvalStatus: data.approval_status,
      isAllowedForRag: data.is_allowed_for_rag,
      version: data.version,
      uploadedBy: data.uploaded_by,
      uploadedByName: data.uploaded_by_name,
      approvedBy: data.approved_by,
      approverId: data.approver_id,
      approvedAt: data.approved_at,
      rejectionReason: data.rejection_reason,
      topics: data.topics || [],
      content: data.content,
      chunksCount: data.chunks_count || 0,
      metadata: data.metadata || {}
    };
  }
}

// Global Singleton Persistent Store
export const persistentRagStore = new PersistentRagStore();
