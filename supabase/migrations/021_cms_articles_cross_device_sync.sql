-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- BẢN MÃ NGUỒN CẬP NHẬT 021: ĐỒNG BỘ BÀI VIẾT CMS TOÀN DIỆN ĐA THIẾT BỊ
-- MỤC TIÊU:
-- 1. Đảm bảo bài viết viết trên bất kỳ thiết bị nào (máy tính, điện thoại, máy tính bảng)
--    được đồng bộ trực tiếp lên Database Cloud (content_items & content_revisions).
-- 2. Cho phép mọi thiết bị của cán bộ, giáo viên nạp đầy đủ danh sách bài viết
--    (bản nháp, chờ duyệt 4 mắt, đã xuất bản, từ chối).
-- 3. Tạo hàm RPC admin_save_cms_article (SECURITY DEFINER) lưu bài viết nguyên tử.
-- ==============================================================================

SET search_path = public, auth, extensions, pg_temp;

-- BƯỚC 1: ĐẢM BẢO CÁC CỘT VÀ CHỈ MỤC HOÀN THIỆN
ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.content_revisions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_content_items_is_deleted ON public.content_items(is_deleted);
CREATE INDEX IF NOT EXISTS idx_content_revisions_updated_at ON public.content_revisions(updated_at DESC);

-- BƯỚC 2: CẤP QUYỀN TRUY CẬP CHO AUTHENTICATED VÀ SERVICE_ROLE
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_revisions TO authenticated, service_role;
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT ON public.content_revisions TO anon;

-- BƯỚC 3: HÀM RPC LƯU BÀI VIẾT CMS NGUYÊN TỬ (ADMIN & STAFF)
CREATE OR REPLACE FUNCTION public.admin_save_cms_article(p_article JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_raw_id TEXT;
    v_item_id UUID;
    v_title TEXT;
    v_slug TEXT;
    v_status TEXT;
    v_summary TEXT;
    v_content TEXT;
    v_rev_id UUID;
    v_existing_rev RECORD;
    v_next_version INT := 1;
    v_author_id UUID;
BEGIN
    v_raw_id := p_article->>'id';
    v_title := p_article->>'title';
    v_slug := COALESCE(p_article->>'slug', 'bai-viet-' || extract(epoch from now())::bigint);
    v_status := COALESCE(p_article->>'status', 'draft');
    v_summary := COALESCE(p_article->>'summary', '');
    v_content := COALESCE(p_article->>'content', '');

    IF v_title IS NULL OR trim(v_title) = '' THEN
        RAISE EXCEPTION 'Tiêu đề bài viết không được để trống.';
    END IF;

    -- Xác định item_id dạng UUID hợp lệ
    BEGIN
        v_item_id := v_raw_id::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_item_id := gen_random_uuid();
    END;

    v_author_id := 'c4821ce7-7c41-45d2-bb9d-ebf7b2228004'::UUID;

    -- 1. Upsert content_items
    INSERT INTO public.content_items (
        id,
        content_type,
        slug,
        created_by,
        is_deleted,
        created_at,
        updated_at
    ) VALUES (
        v_item_id,
        'post',
        v_slug,
        v_author_id,
        false,
        clock_timestamp(),
        clock_timestamp()
    )
    ON CONFLICT (id) DO UPDATE 
    SET slug = EXCLUDED.slug,
        is_deleted = false,
        updated_at = clock_timestamp();

    -- 2. Kiểm tra revision hiện tại
    SELECT id, version_number INTO v_existing_rev
    FROM public.content_revisions
    WHERE item_id = v_item_id
    ORDER BY version_number DESC
    LIMIT 1;

    IF FOUND THEN
        v_rev_id := v_existing_rev.id;
        v_next_version := COALESCE(v_existing_rev.version_number, 1);
    ELSE
        v_rev_id := gen_random_uuid();
        v_next_version := 1;
    END IF;

    -- 3. Upsert content_revisions
    INSERT INTO public.content_revisions (
        id,
        item_id,
        version_number,
        title,
        summary,
        data,
        status,
        author_id,
        created_at,
        updated_at
    ) VALUES (
        v_rev_id,
        v_item_id,
        v_next_version,
        v_title,
        v_summary,
        p_article,
        v_status,
        v_author_id,
        clock_timestamp(),
        clock_timestamp()
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        data = EXCLUDED.data,
        status = EXCLUDED.status,
        updated_at = clock_timestamp();

    -- 4. Cập nhật con trỏ xuất bản
    IF v_status = 'published' THEN
        UPDATE public.content_items
        SET published_revision_id = v_rev_id,
            latest_draft_revision_id = NULL,
            updated_at = clock_timestamp()
        WHERE id = v_item_id;
    ELSE
        UPDATE public.content_items
        SET latest_draft_revision_id = v_rev_id,
            updated_at = clock_timestamp()
        WHERE id = v_item_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'item_id', v_item_id,
        'revision_id', v_rev_id,
        'status', v_status,
        'message', 'Đã lưu và đồng bộ bài viết CMS lên Database Cloud thành công!'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_cms_article(JSONB) TO authenticated, service_role, anon;
