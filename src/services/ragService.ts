/**
 * ADR-002: RAG Client Service (Phase 01 & Phase 02)
 * Connects frontend components to RAG API with automatic in-memory fallback.
 * Supports Query, Search, Document Ingestion, and Four-Eyes Approval Workflow.
 */

import {
  RagAnswerResponse,
  ScoredChunk,
  RealKnowledgeDocument,
  DocumentChunk,
  DocumentCategoryDefinition
} from '../rag/types/ragTypes';
import { ragRuntime } from '../rag';
import { documentRegistry } from '../rag/knowledge/documentRegistry';
import { documentIngestion, IngestionInput } from '../rag/ingestion/documentIngestion';
import { persistentRagStore } from '../rag/storage/persistentStore';

export class RagService {
  private static apiBase = '/api/rag';

  /**
   * Helper to get request headers with verified auth token and role
   */
  private static getHeaders(userRole?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (userRole) {
      headers['X-User-Role'] = userRole;
    }
    if (typeof localStorage !== 'undefined') {
      const explicitToken = localStorage.getItem('rag_admin_token');
      if (explicitToken) {
        headers['Authorization'] = `Bearer ${explicitToken}`;
      } else {
        try {
          const sandboxUser = localStorage.getItem('hcm_sandbox_active_user');
          if (sandboxUser) {
            const parsed = JSON.parse(sandboxUser);
            if (parsed?.session?.access_token) {
              headers['Authorization'] = `Bearer ${parsed.session.access_token}`;
            }
          }
        } catch (e) {}
      }
    }
    return headers;
  }

  /**
   * Submit question to RAG Runtime
   */
  public static async askQuestion(query: string): Promise<RagAnswerResponse> {
    try {
      const response = await fetch(`${this.apiBase}/query`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, topK: 4 })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[RagService] API fetch failed, falling back to in-memory runtime:', err);
    }

    return ragRuntime.query(query);
  }

  /**
   * Search knowledge base directly
   */
  public static async searchCorpus(query: string, topK = 5): Promise<ScoredChunk[]> {
    try {
      const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}&topK=${topK}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[RagService] Search API failed, falling back to in-memory:', err);
    }

    return ragRuntime.search(query, topK);
  }

  /**
   * Check system health & stats
   */
  public static async checkHealth(): Promise<{
    status: string;
    totalDocuments: number;
    approvedDocuments: number;
    totalChunks: number;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/health`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return {
            status: json.data.status,
            totalDocuments: json.data.stats.totalDocuments,
            approvedDocuments: json.data.stats.approvedDocuments,
            totalChunks: json.data.stats.totalChunks
          };
        }
      }
    } catch (err) {
      // Fallback
    }

    const health = ragRuntime.getHealth();
    return {
      status: health.status,
      totalDocuments: health.stats.totalDocuments,
      approvedDocuments: health.stats.approvedDocuments,
      totalChunks: health.stats.totalChunks
    };
  }

  /**
   * Get all registered documents with optional status filter
   */
  public static async getDocuments(statusFilter?: string): Promise<{
    documents: RealKnowledgeDocument[];
    categories: DocumentCategoryDefinition[];
  }> {
    try {
      const url = statusFilter ? `${this.apiBase}/documents?status=${statusFilter}` : `${this.apiBase}/documents`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return {
            documents: json.data.documents,
            categories: json.data.categories || documentRegistry.getCategories()
          };
        }
      }
    } catch (err) {
      console.warn('[RagService] Get documents API failed, using persistentStore locally:', err);
    }

    await persistentRagStore.initialize();
    const docs = await persistentRagStore.getDocuments(statusFilter as any);
    return {
      documents: docs,
      categories: documentRegistry.getCategories()
    };
  }

  /**
   * Get single document and its chunks
   */
  public static async getDocumentById(docId: string): Promise<{
    document: RealKnowledgeDocument;
    chunks: DocumentChunk[];
  } | null> {
    try {
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return {
            document: json.data.document,
            chunks: json.data.chunks
          };
        }
      }
    } catch (err) {
      console.warn('[RagService] Get document by ID failed, using persistentStore:', err);
    }

    const doc = await persistentRagStore.getDocumentById(docId);
    if (!doc) return null;
    const chunks = persistentRagStore.getChunksByDocumentId(docId);
    return { document: doc, chunks };
  }

  /**
   * Ingest new document (starts as PENDING_REVIEW)
   */
  public static async uploadDocument(
    input: IngestionInput,
    userRole?: string
  ): Promise<{
    success: boolean;
    document?: RealKnowledgeDocument;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/documents`, {
        method: 'POST',
        headers: this.getHeaders(userRole),
        body: JSON.stringify(input)
      });

      const json = await response.json();
      if (json.success && json.data) {
        return {
          success: true,
          document: json.data.document
        };
      }
      return {
        success: false,
        error: json.error || 'Lỗi không xác định khi tải lên tài liệu'
      };
    } catch (err: any) {
      console.warn('[RagService] Upload API failed, using documentIngestion locally:', err);
    }

    const localRes = await documentIngestion.ingestDocument(input);
    if (localRes.success && localRes.document && localRes.chunks) {
      await persistentRagStore.saveIngestedDocument(localRes.document, localRes.chunks);
      return { success: true, document: localRes.document };
    }

    return {
      success: false,
      error: localRes.error || 'Lỗi xử lý tài liệu cục bộ'
    };
  }

  /**
   * Four-Eyes Governance: Approve or Reject Document
   */
  public static async approveDocument(
    docId: string,
    action: 'approve' | 'reject',
    reason?: string,
    userRole?: string
  ): Promise<{
    success: boolean;
    document?: RealKnowledgeDocument;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}/approve`, {
        method: 'POST',
        headers: this.getHeaders(userRole),
        body: JSON.stringify({ action, reason })
      });

      const json = await response.json();
      if (json.success && json.data) {
        return {
          success: true,
          document: json.data.document
        };
      }
      return {
        success: false,
        error: json.error || 'Lỗi phê duyệt tài liệu'
      };
    } catch (err: any) {
      console.warn('[RagService] Approve API failed, updating locally:', err);
    }

    try {
      const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      const updated = await persistentRagStore.updateDocumentStatus(
        docId,
        newStatus,
        userRole === 'super_admin' ? 'Quản Trị Viên Tối Cao' : 'Cán Bộ Quản Trị',
        reason
      );
      const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
      ragRuntime.reindex(allApprovedChunks);
      return { success: true, document: updated };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Lỗi cục bộ' };
    }
  }

  /**
   * Reprocess existing document chunks
   */
  public static async reprocessDocument(
    docId: string,
    userRole?: string
  ): Promise<{
    success: boolean;
    chunksCount?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}/reprocess`, {
        method: 'POST',
        headers: this.getHeaders(userRole)
      });
      const json = await response.json();
      if (json.success && json.data) {
        return {
          success: true,
          chunksCount: json.data.chunksCount
        };
      }
      return { success: false, error: json.error };
    } catch (err: any) {
      console.warn('[RagService] Reprocess API failed, running locally:', err);
    }

    const doc = await persistentRagStore.getDocumentById(docId);
    if (!doc) return { success: false, error: 'Tài liệu không tồn tại' };

    const newChunks = documentIngestion.reprocessDocument(doc);
    await persistentRagStore.saveIngestedDocument(doc, newChunks);
    if (doc.approvalStatus === 'APPROVED' && doc.isAllowedForRag) {
      const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
      ragRuntime.reindex(allApprovedChunks);
    }
    return { success: true, chunksCount: newChunks.length };
  }
}
