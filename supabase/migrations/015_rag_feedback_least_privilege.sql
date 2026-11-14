-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MIGRATION: 015_rag_feedback_least_privilege.sql
-- MÔI TRƯỜNG: SUPABASE STAGING (Project: ospnskocdlirjqzknkqz)
-- PHẠM VI: public.rag_user_feedback
-- MỤC TIÊU: KHẮC PHỤC QUYỀN TRUY CẬP QUÁ RỘNG CỦA ANON VÀ AUTHENTICATED
-- NGUYÊN TẮC: LEAST PRIVILEGE - ZERO DATA LOSS - IDEMPOTENT EXECUTION
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- PHẦN 1: BẢO VỆ DỮ LIỆU & KIỂM TRA BẢNG TỒN TẠI
-- ------------------------------------------------------------------------------
-- Lưu ý an toàn: Không DROP TABLE, không DELETE dữ liệu phản hồi của giáo viên/học sinh.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'rag_user_feedback'
    ) THEN
        RAISE EXCEPTION 'Bảng public.rag_user_feedback không tồn tại. Vui lòng chạy Migration 013 trước!';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- PHẦN 2: THU HỒI TOÀN BỘ QUYỀN DƯ THỪA (DAC HARDENING)
-- ------------------------------------------------------------------------------
-- 1. Thu hồi toàn bộ quyền gán mặc định từ pseudo-role PUBLIC (loại bỏ quyền kế thừa nguy hiểm)
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM PUBLIC;

-- 2. Thu hồi toàn bộ quyền dư thừa từ role 'anon' (khách vãng lai / chưa đăng nhập)
-- Sau lệnh này: anon không còn SELECT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM anon;

-- 3. Thu hồi toàn bộ quyền dư thừa từ role 'authenticated' (người dùng đã đăng nhập)
-- Sau lệnh này: authenticated không thể đọc hay thay đổi phản hồi của người khác
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM authenticated;

-- ------------------------------------------------------------------------------
-- PHẦN 3: CẤP LẠI ĐÚNG QUYỀN HẠN TỐI THIỂU (LEAST PRIVILEGE GRANT)
-- ------------------------------------------------------------------------------
-- 1. Role 'anon': CHỈ ĐƯỢC PHÉP INSERT để gửi phản hồi đánh giá câu trả lời chatbot
GRANT INSERT ON TABLE public.rag_user_feedback TO anon;

-- 2. Role 'authenticated': CHỈ ĐƯỢC PHÉP INSERT để gửi phản hồi
GRANT INSERT ON TABLE public.rag_user_feedback TO authenticated;

-- 3. Role 'service_role': Duy trì toàn quyền cho backend / serverless handlers (quản trị nội bộ)
GRANT ALL PRIVILEGES ON TABLE public.rag_user_feedback TO service_role;

-- ------------------------------------------------------------------------------
-- PHẦN 4: THIẾT KẾ LẠI ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Đảm bảo Row Level Security luôn được kích hoạt
ALTER TABLE public.rag_user_feedback ENABLE ROW LEVEL SECURITY;

-- Xóa bỏ các Policy cũ quá rộng hoặc có nguy cơ rò rỉ dữ liệu
DROP POLICY IF EXISTS "Authenticated users read rag_user_feedback" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "Public insert rag_user_feedback" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "rag_user_feedback_insert_policy" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "rag_user_feedback_admin_select_policy" ON public.rag_user_feedback;

-- 1. POLICY INSERT: Cho phép anon và authenticated gửi phản hồi, có kiểm soát dữ liệu chặt chẽ
-- Ngăn chặn giả mạo dữ liệu, spam nội dung quá dài hoặc gán sai vai trò
CREATE POLICY "rag_user_feedback_insert_policy"
    ON public.rag_user_feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        query IS NOT NULL
        AND length(trim(query)) > 0
        AND length(query) <= 2000
        AND (category IS NULL OR length(category) <= 64)
        AND (comment IS NULL OR length(comment) <= 4000)
        AND (user_role IS NULL OR user_role IN ('student', 'teacher', 'admin', 'editor', 'guest'))
    );

-- 2. POLICY SELECT: Tuyệt đối KHÔNG cấp cho anon hoặc học sinh / khách vãng lai.
-- Chỉ cho phép Quản trị viên (Admin/Super Admin) có claim hợp lệ trong JWT xác thực qua Supabase Auth đọc dữ liệu.
-- (Lưu ý: Backend service_role tự động bypass RLS, không bị ảnh hưởng)
CREATE POLICY "rag_user_feedback_admin_select_policy"
    ON public.rag_user_feedback
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'role') = 'service_role'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
        OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

-- 3. KHÔNG TẠO BẤT KỲ POLICY CHO UPDATE HOẶC DELETE:
-- Theo nguyên tắc Default Deny của PostgreSQL RLS:
-- Cả 'anon' và 'authenticated' đều KHÔNG THỂ UPDATE hoặc DELETE bất kỳ dòng phản hồi nào.

COMMIT;

-- ==============================================================================
-- TRUY VẤN KIỂM TRA CHỈ ĐỌC (READ-ONLY VERIFICATION QUERIES)
-- Quản trị viên có thể thực thi đoạn script dưới đây sau khi chạy migration
-- để xác nhận trạng thái quyền hạn đã được siết chặt chuẩn xác.
-- ==============================================================================
/*
-- 1. Kiểm tra quyền hiệu lực (has_table_privilege)
SELECT 
    r.rolname,
    p.privilege,
    has_table_privilege(r.rolname, 'public.rag_user_feedback', p.privilege) AS has_privilege
FROM 
    (VALUES ('anon'), ('authenticated'), ('service_role')) AS r(rolname)
CROSS JOIN 
    (VALUES ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('TRIGGER'), ('REFERENCES')) AS p(privilege)
ORDER BY 
    r.rolname, p.privilege;

-- KẾT QUẢ KỲ VỌNG:
-- anon:         INSERT = true, tất cả các quyền còn lại = false.
-- authenticated:INSERT = true, tất cả các quyền còn lại = false.
-- service_role: Tất cả 7 quyền = true.

-- 2. Kiểm tra các Policy RLS đang có hiệu lực trên bảng
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public' AND tablename = 'rag_user_feedback'
ORDER BY 
    policyname;

-- KẾT QUẢ KỲ VỌNG:
-- Policy 1: rag_user_feedback_insert_policy (cmd: INSERT, roles: {anon, authenticated})
-- Policy 2: rag_user_feedback_admin_select_policy (cmd: SELECT, roles: {authenticated})
-- Không còn policy "Authenticated users read rag_user_feedback" với USING (true).
*/
