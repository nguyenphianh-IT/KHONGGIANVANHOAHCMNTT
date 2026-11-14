-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MIGRATION: 012_rag_knowledge_base_schema.sql
-- ADR-002: RAG SERVICE RUNTIME PLATFORM & SECRET GOVERNANCE ARCHITECTURE (PHASE 02)
-- ==============================================================================

-- 1. Bảng phân nhóm danh mục tri thức (rag_categories)
CREATE TABLE IF NOT EXISTS public.rag_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(64) DEFAULT 'BookOpen',
    badge_class VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng quản lý tài liệu tri thức thực tế (rag_documents)
CREATE TABLE IF NOT EXISTS public.rag_documents (
    document_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    document_type VARCHAR(64) NOT NULL DEFAULT 'article',
    category VARCHAR(64) REFERENCES public.rag_categories(id) ON DELETE SET NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    source_url TEXT,
    original_file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    checksum VARCHAR(128) NOT NULL UNIQUE, -- SHA-256 chống trùng lặp
    file_size BIGINT NOT NULL,
    approval_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (approval_status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')),
    is_allowed_for_rag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 1,
    approved_by VARCHAR(255),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    topics TEXT[] DEFAULT '{}',
    content TEXT NOT NULL,
    chunks_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng các đoạn nội dung đã phân tách (rag_document_chunks)
CREATE TABLE IF NOT EXISTS public.rag_document_chunks (
    chunk_id VARCHAR(128) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES public.rag_documents(document_id) ON DELETE CASCADE,
    document_title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    section_or_page VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    source_status VARCHAR(32) NOT NULL,
    provenance_locator VARCHAR(255) NOT NULL, -- corpus://documentId#chunkId
    token_estimate INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng lưu trữ tiến trình nhập dữ liệu (rag_ingestion_jobs)
CREATE TABLE IF NOT EXISTS public.rag_ingestion_jobs (
    job_id VARCHAR(128) PRIMARY KEY,
    document_id VARCHAR(64),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    chunks_created INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    execution_time_ms INT
);

-- 5. Bảng lịch sử phiên bản tài liệu (rag_document_versions)
CREATE TABLE IF NOT EXISTS public.rag_document_versions (
    version_id VARCHAR(128) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES public.rag_documents(document_id) ON DELETE CASCADE,
    version INT NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    change_description TEXT
);

-- 6. Bảng nhật ký kiểm định truy xuất (rag_retrieval_logs)
CREATE TABLE IF NOT EXISTS public.rag_retrieval_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    evidence_found BOOLEAN NOT NULL,
    model_used VARCHAR(128) NOT NULL,
    chunks_retrieved INT DEFAULT 0,
    chunks_used INT DEFAULT 0,
    retrieval_time_ms INT,
    generation_time_ms INT,
    total_time_ms INT,
    user_ip_hash VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- CHỈ MỤC TỐI ƯU HÓA TRUY VẤN
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_rag_docs_status ON public.rag_documents(approval_status, is_allowed_for_rag);
CREATE INDEX IF NOT EXISTS idx_rag_docs_checksum ON public.rag_documents(checksum);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_doc_id ON public.rag_document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_provenance ON public.rag_document_chunks(provenance_locator);
CREATE INDEX IF NOT EXISTS idx_rag_jobs_status ON public.rag_ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_rag_logs_created_at ON public.rag_retrieval_logs(created_at);

-- ------------------------------------------------------------------------------
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.rag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_retrieval_logs ENABLE ROW LEVEL SECURITY;

-- Công khai: Đọc danh mục và các tài liệu/chunk đã duyệt cho RAG
CREATE POLICY "Public read approved rag documents"
    ON public.rag_documents FOR SELECT
    USING (approval_status = 'APPROVED' AND is_allowed_for_rag = TRUE);

CREATE POLICY "Public read chunks of approved docs"
    ON public.rag_document_chunks FOR SELECT
    USING (source_status = 'APPROVED');

CREATE POLICY "Public read categories"
    ON public.rag_categories FOR SELECT
    USING (TRUE);

-- Quản trị: Cho phép authenticated users hoặc service role quản lý toàn quyền
CREATE POLICY "Authenticated users full access to rag_documents"
    ON public.rag_documents FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Authenticated users full access to rag_document_chunks"
    ON public.rag_document_chunks FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Authenticated users full access to rag_ingestion_jobs"
    ON public.rag_ingestion_jobs FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
