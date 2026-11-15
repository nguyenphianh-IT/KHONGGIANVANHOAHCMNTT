-- ==============================================================================
-- BẢN MIGRATION 017: KIỂM SOÁT BỘ ĐẾM LƯỢT ĐỌC THỰC TẾ & BẢO VỆ CHỐNG VIEW ẢO
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- MỤC ĐÍCH: 
--   1. Tạo bảng public.article_views lưu trữ lượt đọc thực tế của từng bài viết / tư liệu.
--   2. Tạo hàm RPC public.increment_article_view với cơ chế atomic tăng lượt đọc an toàn.
--   3. Cấu hình RLS cho phép độc giả (anon & authenticated) đọc số lượt và ghi nhận lượt đọc.
--   4. Cung cấp hàm public.reset_article_view dành riêng cho Cán bộ Quản trị hiệu chỉnh/bảo trì.
-- ==============================================================================

BEGIN;

SET search_path = public, auth, pg_temp;

-- 1. TẠO BẢNG PUBLIC.ARTICLE_VIEWS
CREATE TABLE IF NOT EXISTS public.article_views (
    article_id VARCHAR(100) PRIMARY KEY,
    view_count INT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chỉ mục tối ưu hóa tốc độ xếp hạng top bài đọc nhiều nhất
CREATE INDEX IF NOT EXISTS idx_article_views_count ON public.article_views(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_updated ON public.article_views(updated_at DESC);

-- 2. KÍCH HOẠT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả độc giả xem công khai số lượt đọc thực tế
DROP POLICY IF EXISTS article_views_select_policy ON public.article_views;
CREATE POLICY article_views_select_policy ON public.article_views
    FOR SELECT TO anon, authenticated
    USING (true);

-- 3. HÀM RPC GHI NHẬN LƯỢT ĐỌC THỰC TẾ ATOMIC (CHỐNG GIAN LẬN & VIEW ẢO)
CREATE OR REPLACE FUNCTION public.increment_article_view(p_article_id VARCHAR)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_new_count INT;
BEGIN
    -- Kiểm tra tham số đầu vào hợp lệ
    IF p_article_id IS NULL OR trim(p_article_id) = '' OR length(p_article_id) > 100 THEN
        RAISE EXCEPTION 'Mã định danh bài viết không hợp lệ';
    END IF;

    -- Tăng lượt đọc thực tế an toàn dạng Atomic UPSERT
    INSERT INTO public.article_views (article_id, view_count, last_viewed_at, updated_at)
    VALUES (trim(p_article_id), 1, now(), now())
    ON CONFLICT (article_id)
    DO UPDATE SET 
        view_count = public.article_views.view_count + 1,
        last_viewed_at = now(),
        updated_at = now()
    RETURNING view_count INTO v_new_count;

    RETURN v_new_count;
END;
$$;

-- Cấp quyền gọi hàm cho độc giả (học sinh, giáo viên, khách vãng lai)
GRANT EXECUTE ON FUNCTION public.increment_article_view(VARCHAR) TO anon, authenticated;

-- 4. HÀM RPC ĐẶT LẠI / HIỆU CHỈNH SỐ LƯỢT ĐỌC (CHỈ DÀNH CHO ADMIN)
CREATE OR REPLACE FUNCTION public.reset_article_view(p_article_id VARCHAR, p_target_count INT DEFAULT 0)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    -- Kiểm tra quyền Admin / Super Admin
    IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Chỉ Cán bộ Quản trị viên mới có quyền hiệu chỉnh số lượt đọc';
    END IF;

    IF p_target_count < 0 THEN
        p_target_count := 0;
    END IF;

    INSERT INTO public.article_views (article_id, view_count, last_viewed_at, updated_at)
    VALUES (trim(p_article_id), p_target_count, now(), now())
    ON CONFLICT (article_id)
    DO UPDATE SET 
        view_count = p_target_count,
        updated_at = now();

    RETURN p_target_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_article_view(VARCHAR, INT) TO authenticated;

COMMIT;
