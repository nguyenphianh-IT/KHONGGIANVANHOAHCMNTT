-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MIGRATION: 015_rag_feedback_least_privilege.sql (FINAL REVISION)
-- GIAI ĐOẠN: RAG FEEDBACK - BACKEND-ONLY ACCESS ARCHITECTURE
-- MÔI TRƯỜNG: SUPABASE STAGING (Project: ospnskocdlirjqzknkqz)
-- PHẠM VI: public.rag_user_feedback
-- MỤC TIÊU: KHÓA CHẶT 100% TRUY CẬP TRỰC TIẾP TỪ ANON VÀ AUTHENTICATED
--           TOÀN BỘ ĐỌC/GHI PHẢN HỒI PHẢI THÔNG QUA BACKEND SERVICE ROLE
-- NGUYÊN TẮC: BACKEND-ONLY ACCESS - ZERO DATA LOSS - LEAST PRIVILEGE - IDEMPOTENT
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- PHẦN 1: BẢO VỆ DỮ LIỆU & KIỂM TRA BẢNG TỒN TẠI
-- ------------------------------------------------------------------------------
-- Lưu ý an toàn: Tuyệt đối không dùng DROP TABLE, TRUNCATE hoặc DELETE.
-- Toàn bộ dữ liệu phản hồi lịch sử của học sinh và thầy cô được bảo toàn nguyên vẹn.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'rag_user_feedback'
    ) THEN
        RAISE EXCEPTION 'Bảng public.rag_user_feedback không tồn tại. Vui lòng kiểm tra lại schema!';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- PHẦN 2: THU HỒI TOÀN BỘ QUYỀN TRỰC TIẾP (TABLE DAC LOCKDOWN)
-- ------------------------------------------------------------------------------
-- 1. Thu hồi toàn bộ quyền gán mặc định từ pseudo-role PUBLIC (loại bỏ mọi quyền kế thừa)
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM PUBLIC;

-- 2. Khóa toàn bộ quyền của role 'anon' (khách vãng lai / client chưa đăng nhập)
-- Sau lệnh này: anon KHÔNG CÒN SELECT, INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM anon;

-- 3. Khóa toàn bộ quyền trực tiếp của role 'authenticated' (người dùng đã đăng nhập)
-- Sau lệnh này: authenticated KHÔNG CÒN SELECT, INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES
REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM authenticated;

-- ------------------------------------------------------------------------------
-- PHẦN 3: CẤP QUYỀN ĐỘC QUYỀN CHO SERVICE_ROLE (BACKEND-ONLY ACCESS)
-- ------------------------------------------------------------------------------
-- Chỉ cấp quyền cho role 'service_role' (chạy tại máy chủ backend / serverless handlers)
-- Phục vụ: POST /api/rag/feedback (ghi) và GET /api/rag/analytics (đọc sau khi kiểm tra RBAC)
GRANT ALL PRIVILEGES ON TABLE public.rag_user_feedback TO service_role;

-- ------------------------------------------------------------------------------
-- PHẦN 4: THIẾT KẾ ROW LEVEL SECURITY (RLS) THEO NGUYÊN TẮC DEFAULT DENY
-- ------------------------------------------------------------------------------
-- Đảm bảo Row Level Security luôn luôn được kích hoạt
ALTER TABLE public.rag_user_feedback ENABLE ROW LEVEL SECURITY;

-- Xóa bỏ toàn bộ các policy cũ (cả SELECT và INSERT trực tiếp từ client)
DROP POLICY IF EXISTS "Authenticated users read rag_user_feedback" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "Public insert rag_user_feedback" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "rag_user_feedback_insert_policy" ON public.rag_user_feedback;
DROP POLICY IF EXISTS "rag_user_feedback_admin_select_policy" ON public.rag_user_feedback;

-- KIẾN TRÚC BACKEND-ONLY:
-- Tuyệt đối KHÔNG tạo bất kỳ policy nào cho anon hoặc authenticated.
-- Theo nguyên tắc Default Deny của PostgreSQL RLS:
-- Mọi truy vấn trực tiếp từ PostgREST API / client-side Supabase SDK đều bị từ chối 100%.
-- Riêng service_role tại backend sở hữu đặc quyền hệ thống BYPASSRLS trong Supabase,
-- cho phép các API POST /api/rag/feedback và GET /api/rag/analytics hoạt động thông suốt
-- sau khi đã hoàn thành xác thực, lọc dữ liệu và kiểm soát tần suất phía máy chủ.

COMMIT;

-- ==============================================================================
-- TRUY VẤN KIỂM TRA CHỈ ĐỌC (READ-ONLY VERIFICATION QUERIES)
-- Quản trị viên thực thi đoạn script dưới đây sau khi chạy migration
-- để xác nhận trạng thái Backend-Only Access đã được thiết lập chuẩn xác.
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

-- KẾT QUẢ KỲ VỌNG (BACKEND-ONLY ARCHITECTURE):
-- anon:         TẤT CẢ 7 QUYỀN = FALSE (Bị chặn 100% truy cập trực tiếp).
-- authenticated:TẤT CẢ 7 QUYỀN = FALSE (Bị chặn 100% truy cập trực tiếp).
-- service_role: TẤT CẢ 7 QUYỀN = TRUE  (Chỉ backend có quyền thao tác).

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
    schemaname = 'public' AND tablename = 'rag_user_feedback';

-- KẾT QUẢ KỲ VỌNG:
-- 0 rows returned (Không có policy nào cho anon/authenticated -> Default Deny toàn bộ).
-- service_role tự động BYPASSRLS.
*/
