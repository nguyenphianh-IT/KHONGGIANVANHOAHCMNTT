/**
 * ADR-002: RAG Runtime - Core Types & Schemas (Phase 01 & Phase 02)
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Mode: BUILD - INTEGRATE - DEPLOY TO STAGING
 */

export type DocumentApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export type DocumentCategory =
  | 'article'
  | 'book'
  | 'speech'
  | 'letter'
  | 'quote'
  | 'timeline'
  | 'regulation'
  | 'instruction'
  | 'heritage'
  | 'education';

export type DocumentType =
  | 'speech'
  | 'letter'
  | 'book'
  | 'article'
  | 'quote'
  | 'instruction'
  | 'official_dispatch'
  | 'archive';

/**
 * Standard Topic Categories for THCS Nguyen Trung Truc Cultural Space
 */
export interface DocumentCategoryDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeClass?: string;
}

export const HCM_STANDARD_CATEGORIES: DocumentCategoryDefinition[] = [
  {
    id: 'bio-career',
    name: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    description: 'Các mốc lịch sử, sự kiện cứu quốc và hành trình lãnh đạo của Bác',
    icon: 'Compass',
    badgeClass: 'bg-red-100 text-red-900 border-red-200'
  },
  {
    id: 'ideology-ethics',
    name: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    description: 'Cần kiệm liêm chính, chí công vô tư, lối sống giản dị và nhân văn',
    icon: 'BookOpen',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'teachings-children',
    name: 'Những lời dạy của Bác đối với thiếu nhi',
    description: '5 Điều Bác Hồ dạy, thư gửi học sinh, lời căn dặn thiếu niên nhi đồng',
    icon: 'GraduationCap',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 'cultural-heritage',
    name: 'Di sản văn hóa Hồ Chí Minh',
    description: 'Tác phẩm văn thơ, Tuyên ngôn Độc lập, Di chúc, Nhật ký trong tù',
    icon: 'Sparkles',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    id: 'hcm-cultural-space',
    name: 'Không gian văn hóa Hồ Chí Minh TP.HCM',
    description: 'Xây dựng không gian văn hóa Hồ Chí Minh trên địa bàn Thành phố',
    icon: 'Landmark',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    id: 'hcmc-history',
    name: 'Lịch sử Thành phố Hồ Chí Minh',
    description: 'Thành phố mang tên Bác, truyền thống cách mạng Thới An - Quận 12',
    icon: 'History',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200'
  },
  {
    id: 'school-education',
    name: 'Hoạt động giáo dục và học tập tại nhà trường',
    description: 'Chuyên đề giáo dục, hội thi, phong trào học tập trường THCS Nguyễn Trung Trực',
    icon: 'Award',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200'
  },
  {
    id: 'official-dispatches',
    name: 'Tài liệu chính thức của cơ quan quản lý',
    description: 'Nghị quyết, hướng dẫn của Thành ủy, Sở GD&ĐT và Chi bộ nhà trường',
    icon: 'FileCheck',
    badgeClass: 'bg-slate-100 text-slate-900 border-slate-200'
  }
];

/**
 * Knowledge document representation (supports both sample and real documents)
 */
export interface KnowledgeDocument {
  id: string; // Document ID (e.g. DOC-HCM-001)
  title: string;
  category: DocumentCategory | string;
  categoryLabel?: string;
  authorOrSource: string;
  dateOrEra: string;
  content: string;
  sourceUrl?: string;
  status: DocumentApprovalStatus;
  isAllowedForRag: boolean;
  topics: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Phase 02: Real Knowledge Document specification (Persistent & Auditable)
 */
export interface RealKnowledgeDocument {
  documentId: string;
  title: string;
  description: string;
  documentType: DocumentType;
  category: string;
  author: string;
  publisher: string;
  sourceUrl: string;
  originalFileName: string;
  mimeType: string;
  checksum: string; // SHA-256 hash of content
  fileSize: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  approvalStatus: DocumentApprovalStatus;
  isAllowedForRag: boolean;
  version: number;
  uploadedBy?: string; // Operator/User ID who uploaded
  uploadedByName?: string; // Operator/User display name
  approvedBy?: string; // Operator display name
  approverId?: string; // Operator/User ID who approved/rejected
  approvedAt?: string;
  rejectionReason?: string;
  topics: string[];
  content: string;
  chunksCount: number;
  metadata?: Record<string, unknown>;
}

/**
 * Atomic chunk produced by Document Processor
 */
export interface DocumentChunk {
  id: string; // Unique chunk ID (e.g., DOC-HCM-001-CHK-01)
  documentId: string; // Ref to parent KnowledgeDocument / RealKnowledgeDocument
  documentTitle: string;
  content: string;
  sectionOrPage: string; // Source section, paragraph, or page
  topic: string;
  processedAt: string; // ISO 8601
  sourceStatus: DocumentApprovalStatus;
  provenanceLocator: string; // Traceable locator back to official corpus (corpus://docId#chunkId)
  tokenEstimate?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Ingestion Job Record
 */
export interface IngestionJob {
  jobId: string;
  documentId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunksCreated: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  executionTimeMs?: number;
}

/**
 * Document Version Record
 */
export interface DocumentVersionRecord {
  versionId: string;
  documentId: string;
  version: number;
  checksum: string;
  modifiedBy: string;
  modifiedAt: string;
  changeDescription: string;
}

/**
 * Retrieval Query specification
 */
export interface RetrievalQuery {
  query: string;
  topK?: number;
  categoryFilter?: DocumentCategory | string;
  topicFilter?: string;
  minScore?: number;
}

/**
 * Chunk scored by Retrieval Engine
 */
export interface ScoredChunk {
  chunk: DocumentChunk;
  score: number; // 0.0 - 1.0 or BM25 score
  matchReasons: string[];
  termMatches?: string[];
  normalizedScore?: number;
}

/**
 * Traceable Citation linked to generated answer
 */
export interface RagCitation {
  citationId: string; // e.g. [1], [2]
  chunkId: string;
  documentId: string;
  documentTitle: string;
  authorOrSource: string;
  dateOrEra: string;
  sectionOrPage: string;
  snippet: string;
  confidenceScore: number;
  verificationStatus: 'VERIFIED' | 'CAUTION';
  sourceUrl?: string;
}

/**
 * Execution metrics for telemetry and transparency
 */
export interface RagExecutionMetrics {
  retrievalTimeMs: number;
  generationTimeMs: number;
  totalTimeMs: number;
  chunksEvaluated: number;
  chunksRetrieved: number;
  chunksUsedInAnswer: number;
}

/**
 * Full RAG Answer Response
 */
export interface RagAnswerResponse {
  query: string;
  answer: string;
  citations: RagCitation[];
  evidenceFound: boolean;
  conflictDetected: boolean;
  conflictNotes?: string;
  modelUsed: string;
  metrics: RagExecutionMetrics;
  governanceNotice: string;
  timestamp: string;
}

/**
 * Abstract AI Provider Interface
 */
export interface IAIProvider {
  providerName: string;
  isAvailable(): Promise<boolean>;
  generateGroundedAnswer(
    query: string,
    contextChunks: ScoredChunk[]
  ): Promise<{
    answer: string;
    modelUsed: string;
    citations: RagCitation[];
  }>;
}

/**
 * Abstract Retrieval Engine Interface
 */
export interface IRetrievalEngine {
  indexDocuments(documents: KnowledgeDocument[]): void;
  indexChunks(chunks: DocumentChunk[]): void;
  retrieve(query: RetrievalQuery): Promise<ScoredChunk[]>;
  getAllChunks(): DocumentChunk[];
  getStats(): {
    totalDocuments: number;
    approvedDocuments: number;
    totalChunks: number;
    topics: string[];
  };
}
