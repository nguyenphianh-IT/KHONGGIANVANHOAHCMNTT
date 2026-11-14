-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MIGRATION: 013_rag_feedback_and_provenance_schema.sql
-- GIAI ĐOẠN 3: OFFICIAL PRODUCTION LAUNCH - USER FEEDBACK & PROVENANCE COLUMNS
-- ==============================================================================

-- 1. Bổ sung các cột định danh phân quyền và kiểm toán 4 mắt cho rag_documents (Non-destructive)
ALTER TABLE public.rag_documents ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(64);
ALTER TABLE public.rag_documents ADD COLUMN IF NOT EXISTS uploaded_by_name VARCHAR(255);
ALTER TABLE public.rag_documents ADD COLUMN IF NOT EXISTS approver_id VARCHAR(64);

-- 2. Bảng tiếp nhận phản hồi đánh giá chất lượng câu trả lời từ người dùng (rag_user_feedback)
CREATE TABLE IF NOT EXISTS public.rag_user_feedback (
    id VARCHAR(128) PRIMARY KEY,
    query TEXT NOT NULL,
    answer_snippet TEXT,
    is_helpful BOOLEAN NOT NULL,
    category VARCHAR(64),
    comment TEXT,
    user_role VARCHAR(64) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chỉ mục tối ưu hóa cho feedback
CREATE INDEX IF NOT EXISTS idx_rag_feedback_helpful ON public.rag_user_feedback(is_helpful);
CREATE INDEX IF NOT EXISTS idx_rag_feedback_created_at ON public.rag_user_feedback(created_at);

-- 4. RLS Policy cho rag_user_feedback
ALTER TABLE public.rag_user_feedback ENABLE ROW LEVEL SECURITY;

-- Cho phép người dùng công khai gửi phản hồi (INSERT)
CREATE POLICY "Public insert rag_user_feedback"
    ON public.rag_user_feedback FOR INSERT
    WITH CHECK (TRUE);

-- Chỉ cho phép cán bộ quản trị đã xác thực đọc phản hồi (SELECT)
CREATE POLICY "Authenticated users read rag_user_feedback"
    ON public.rag_user_feedback FOR SELECT
    TO authenticated
    USING (TRUE);
