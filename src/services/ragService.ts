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
  DocumentCategoryDefinition,
  RagUserFeedback,
  RagAnalyticsSummary
} from '../rag/types/ragTypes';
import { ragRuntime } from '../rag';
import { documentRegistry } from '../rag/knowledge/documentRegistry';
import { documentIngestion, IngestionInput } from '../rag/ingestion/documentIngestion';
import { persistentRagStore } from '../rag/storage/persistentStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export class RagService {
  private static apiBase = '/api/rag';

  /**
   * Helper to get request headers with verified auth token and role.
   * Strictly prioritizes real Supabase Auth access token.
   */
  private static async getHeaders(userRole?: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (userRole) {
      headers['X-User-Role'] = userRole;
    }

    // 1. Primary: Retrieve real cryptographically signed JWT from Supabase Auth Session
    if (isSupabaseConfigured) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
          return headers;
        }
      } catch (err) {
        console.warn('[RagService] Error obtaining real Supabase Auth session:', err);
      }
    }

    // 2. Controlled Sandbox/Dev Fallback (Strictly prohibited on Production)
    const isProduction =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) ||
      (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'production' || process.env?.VERCEL_ENV === 'production'));

    if (!isProduction && typeof localStorage !== 'undefined') {
      const explicitToken = localStorage.getItem('rag_admin_token');
      if (explicitToken) {
        headers['Authorization'] = `Bearer ${explicitToken}`;
        return headers;
      }
      try {
        const sandboxUser = localStorage.getItem('hcm_sandbox_active_user');
        if (sandboxUser) {
          const parsed = JSON.parse(sandboxUser);
          if (parsed?.session?.access_token) {
            headers['Authorization'] = `Bearer ${parsed.session.access_token}`;
            return headers;
          }
        }
      } catch {}
    }

    return headers;
  }

  /**
   * Submit question to RAG Runtime
   */
  public static async askQuestion(query: string): Promise<RagAnswerResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.apiBase}/query`, {
        method: 'POST',
        headers,
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
  public static async getDocuments(statusFilter?: string, userRole?: string): Promise<{
    documents: RealKnowledgeDocument[];
    categories: DocumentCategoryDefinition[];
  }> {
    try {
      const url = statusFilter ? `${this.apiBase}/documents?status=${statusFilter}` : `${this.apiBase}/documents`;
      const headers = await this.getHeaders(userRole);
      const response = await fetch(url, { headers });
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
  public static async getDocumentById(docId: string, userRole?: string): Promise<{
    document: RealKnowledgeDocument;
    chunks: DocumentChunk[];
  } | null> {
    try {
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}`, { headers });
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
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents`, {
        method: 'POST',
        headers,
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
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, reason })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          // Sync client local storage state as well
          await persistentRagStore.ensureInitialized();
          await persistentRagStore.updateDocumentStatus(
            docId,
            action === 'approve' ? 'APPROVED' : 'REJECTED',
            userRole === 'super_admin' ? 'Quản Trị Viên Tối Cao' : 'Cán Bộ Quản Trị',
            reason
          );
          return {
            success: true,
            document: json.data.document
          };
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        // If 403 (explicit governance rejection like Four-Eyes principle), bubble up the error immediately
        if (response.status === 403) {
          return {
            success: false,
            error: errJson.error || 'Vi phạm nguyên tắc Phê duyệt 4 mắt: Không được phép duyệt tài liệu này.'
          };
        }
        console.warn(`[RagService] Approve API returned ${response.status}, falling back to local persistent store:`, errJson);
      }
    } catch (err: any) {
      console.warn('[RagService] Approve API network error, updating locally:', err);
    }

    // Seamless Local Fallback for offline or client-cached state
    try {
      await persistentRagStore.ensureInitialized();
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
      return { success: false, error: e?.message || 'Lỗi xử lý phê duyệt tài liệu' };
    }
  }

  /**
   * Revoke / Archive document (Immediately de-indexes from active RAG retrieval)
   */
  public static async archiveDocument(
    docId: string,
    userRole?: string,
    reason?: string
  ): Promise<{
    success: boolean;
    document?: RealKnowledgeDocument;
    error?: string;
  }> {
    try {
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'archive', reason })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          await persistentRagStore.ensureInitialized();
          await persistentRagStore.updateDocumentStatus(
            docId,
            'ARCHIVED',
            userRole === 'super_admin' ? 'Quản Trị Viên Tối Cao' : 'Cán Bộ Quản Trị',
            reason
          );
          const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
          ragRuntime.reindex(allApprovedChunks);
          return {
            success: true,
            document: json.data.document
          };
        }
      }
    } catch (err: any) {
      console.warn('[RagService] Archive API error, falling back to local persistent store:', err);
    }

    try {
      await persistentRagStore.ensureInitialized();
      const updated = await persistentRagStore.updateDocumentStatus(
        docId,
        'ARCHIVED',
        userRole === 'super_admin' ? 'Quản Trị Viên Tối Cao' : 'Cán Bộ Quản Trị',
        reason
      );
      const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
      ragRuntime.reindex(allApprovedChunks);
      return { success: true, document: updated };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Lỗi thu hồi tài liệu' };
    }
  }

  /**
   * Delete document permanently from RAG knowledge base
   */
  public static async deleteDocument(
    docId: string,
    userRole?: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          await persistentRagStore.ensureInitialized();
          await persistentRagStore.deleteDocument(docId);
          const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
          ragRuntime.reindex(allApprovedChunks);
          return { success: true };
        }
      }
    } catch (err: any) {
      console.warn('[RagService] Delete document API error, deleting locally:', err);
    }

    try {
      await persistentRagStore.ensureInitialized();
      await persistentRagStore.deleteDocument(docId);
      const allApprovedChunks = await persistentRagStore.getAllApprovedChunks();
      ragRuntime.reindex(allApprovedChunks);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Lỗi xóa tài liệu' };
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
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/documents/${encodeURIComponent(docId)}/reprocess`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'reprocess' })
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

  /**
   * Phase 04: Send user feedback on answer quality
   */
  public static async sendFeedback(feedback: Omit<RagUserFeedback, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string; persisted?: boolean }> {
    try {
      const headers = await this.getHeaders(feedback.userRole);
      const response = await fetch(`${this.apiBase}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify(feedback)
      });
      const json = await response.json();
      if (json.success && json.data?.persisted) {
        return {
          success: true,
          message: json.data?.message || 'Cảm ơn bạn đã gửi phản hồi đánh giá câu trả lời!',
          persisted: true
        };
      }
      return {
        success: false,
        message: json.error || 'Không thể lưu phản hồi vào cơ sở dữ liệu.',
        persisted: false
      };
    } catch (err: any) {
      console.warn('[RagService] Feedback API network error:', err);
      return {
        success: false,
        message: 'Lỗi kết nối khi gửi phản hồi đánh giá.',
        persisted: false
      };
    }
  }

  /**
   * Phase 04: Fetch Operations Analytics Summary
   * Strictly avoids falling back to local RAM data when server authorization fails (401/403).
   */
  public static async getAnalytics(userRole?: string): Promise<{
    success: boolean;
    data?: RagAnalyticsSummary;
    statusCode: number;
    error?: string;
  }> {
    try {
      const headers = await this.getHeaders(userRole);
      const response = await fetch(`${this.apiBase}/analytics`, {
        method: 'GET',
        headers
      });
      const json = await response.json();
      if (response.ok && json.success && json.data) {
        return {
          success: true,
          data: json.data,
          statusCode: 200
        };
      }
      return {
        success: false,
        statusCode: response.status,
        error: json.error || `Lỗi truy xuất dữ liệu vận hành (${response.status})`
      };
    } catch (err: any) {
      console.warn('[RagService] Analytics API network error:', err);
      return {
        success: false,
        statusCode: 500,
        error: 'Lỗi kết nối máy chủ phân tích dữ liệu.'
      };
    }
  }
}
