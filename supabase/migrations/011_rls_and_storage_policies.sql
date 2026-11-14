-- ==============================================================================
-- 011_rls_and_storage_policies.sql
-- MỤC ĐÍCH: Kích hoạt RLS 100% các bảng, Storage Policies (chặn SVG, bảo vệ file) & View security_barrier
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. BẬT RLS TRÊN TẤT CẢ CÁC BẢNG
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. VIEW CÔNG KHAI TÁC GIẢ VỚI SECURITY_BARRIER = TRUE
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_authors 
WITH (security_barrier = true) AS
SELECT DISTINCT p.id, p.full_name, p.avatar_url
FROM public.profiles p
JOIN public.content_revisions cr ON p.id = cr.author_id
WHERE cr.status = 'published' AND p.status = 'active';

GRANT SELECT ON public.public_authors TO authenticated, anon;

-- Bảng profiles chỉ cho nhân sự nội bộ xem danh sách đồng nghiệp
CREATE POLICY profiles_select_policy ON public.profiles FOR SELECT TO authenticated
USING (public.is_active_user() OR id = auth.uid() OR public.has_role('super_admin'));

CREATE POLICY profiles_update_policy ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.has_role('super_admin'))
WITH CHECK (id = auth.uid() OR public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 3. POLICIES CHO USER_ROLES & ROLES
-- ------------------------------------------------------------------------------
CREATE POLICY roles_select_policy ON public.roles FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY user_roles_select_policy ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role('super_admin') OR public.has_role('admin'));

CREATE POLICY user_roles_insert_policy ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role('super_admin') OR public.has_role('admin'));

CREATE POLICY user_roles_delete_policy ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role('super_admin') OR public.has_role('admin'));

-- ------------------------------------------------------------------------------
-- 4. POLICIES CHO CONTENT_ITEMS (TÁCH BIỆT 4 POLICIES, BẢO VỆ SOFT DELETE)
-- ------------------------------------------------------------------------------
CREATE POLICY content_items_select_public ON public.content_items FOR SELECT TO authenticated, anon
USING (published_revision_id IS NOT NULL AND is_deleted = false);

CREATE POLICY content_items_select_staff ON public.content_items FOR SELECT TO authenticated
USING (public.is_active_user() AND (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin')));

CREATE POLICY content_items_insert_staff ON public.content_items FOR INSERT TO authenticated
WITH CHECK (
    public.is_active_user() 
    AND (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin'))
    AND created_by = auth.uid()
);

CREATE POLICY content_items_update_staff ON public.content_items FOR UPDATE TO authenticated
USING (
    public.is_active_user() 
    AND (created_by = auth.uid() OR public.has_role('admin') OR public.has_role('super_admin'))
)
WITH CHECK (
    public.is_active_user() 
    AND (created_by = auth.uid() OR public.has_role('admin') OR public.has_role('super_admin'))
);

CREATE POLICY content_items_delete_super ON public.content_items FOR DELETE TO authenticated
USING (public.is_active_user() AND public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 5. POLICIES CHO CONTENT_REVISIONS
-- ------------------------------------------------------------------------------
CREATE POLICY revisions_select_public ON public.content_revisions FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY revisions_select_staff ON public.content_revisions FOR SELECT TO authenticated
USING (
    public.is_active_user() AND (
        author_id = auth.uid() 
        OR public.has_role('admin') 
        OR public.has_role('super_admin')
    )
);

CREATE POLICY revisions_insert_editor ON public.content_revisions FOR INSERT TO authenticated
WITH CHECK (
    public.is_active_user() 
    AND author_id = auth.uid()
    AND status = 'draft'
);

CREATE POLICY revisions_update_editor ON public.content_revisions FOR UPDATE TO authenticated
USING (
    public.is_active_user() 
    AND author_id = auth.uid() 
    AND status IN ('draft', 'rejected')
)
WITH CHECK (
    author_id = auth.uid() 
    AND status IN ('draft', 'pending', 'rejected')
);

CREATE POLICY revisions_delete_draft ON public.content_revisions FOR DELETE TO authenticated
USING (
    public.is_active_user() 
    AND author_id = auth.uid() 
    AND status = 'draft'
    AND id NOT IN (SELECT published_revision_id FROM public.content_items WHERE published_revision_id IS NOT NULL)
);

-- ------------------------------------------------------------------------------
-- 6. POLICIES CHO QUIZ & ĐÁP ÁN BẢO MẬT
-- ------------------------------------------------------------------------------
CREATE POLICY quiz_questions_select_public ON public.quiz_questions FOR SELECT TO authenticated, anon
USING (is_active = true);

CREATE POLICY quiz_questions_manage_staff ON public.quiz_questions FOR ALL TO authenticated
USING (public.is_active_user() AND (public.has_role('admin') OR public.has_role('super_admin')));

-- ĐÁP ÁN: CHỈ ADMIN VÀ SUPER ADMIN ĐƯỢC XEM (HỌC SINH KHÔNG THỂ SELECT)
CREATE POLICY quiz_answers_admin_only ON public.quiz_answers FOR SELECT TO authenticated
USING (public.is_active_user() AND (public.has_role('admin') OR public.has_role('super_admin')));

CREATE POLICY quiz_answers_manage_admin ON public.quiz_answers FOR ALL TO authenticated
USING (public.is_active_user() AND (public.has_role('admin') OR public.has_role('super_admin')));

-- PHIÊN THI VÀ KẾT QUẢ: CHỈ GIÁO VIÊN / ADMIN / SUPER ADMIN ĐƯỢC TRA CỨU
CREATE POLICY quiz_sessions_staff_only ON public.quiz_sessions FOR SELECT TO authenticated
USING (public.is_active_user() AND (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin')));

CREATE POLICY quiz_attempts_admin_only ON public.quiz_attempts FOR SELECT TO authenticated
USING (public.is_active_user() AND (public.has_role('admin') OR public.has_role('super_admin')));

-- ------------------------------------------------------------------------------
-- 7. POLICIES CHO AUDIT_LOGS VÀ APPROVAL_EVENTS (BẤT BIẾN)
-- ------------------------------------------------------------------------------
CREATE POLICY audit_logs_select_super ON public.audit_logs FOR SELECT TO authenticated
USING (public.is_active_user() AND public.has_role('super_admin'));

CREATE POLICY audit_logs_immutable ON public.audit_logs FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY audit_logs_no_delete ON public.audit_logs FOR DELETE TO authenticated, anon USING (false);

CREATE POLICY approval_events_select ON public.approval_events FOR SELECT TO authenticated
USING (public.is_active_user());

CREATE POLICY approval_events_immutable ON public.approval_events FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY approval_events_no_delete ON public.approval_events FOR DELETE TO authenticated, anon USING (false);

-- ------------------------------------------------------------------------------
-- 8. STORAGE SECURITY POLICIES (CẤM SVG & BẢO VỆ TỆP ĐANG SỬ DỤNG)
-- ------------------------------------------------------------------------------

-- Hàm kiểm tra xem tệp Storage có đang được bài viết hoặc media_assets sử dụng hay không
CREATE OR REPLACE FUNCTION public.is_storage_file_in_use(p_storage_path TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    -- 1. Kiểm tra trong bảng media_assets
    IF EXISTS (SELECT 1 FROM public.media_assets WHERE storage_path = p_storage_path) THEN
        RETURN true;
    END IF;

    -- 2. Kiểm tra trong dữ liệu jsonb của content_revisions (ảnh được gắn vào bài viết)
    IF EXISTS (
        SELECT 1 FROM public.content_revisions 
        WHERE data::text LIKE '%' || p_storage_path || '%'
    ) THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

CREATE POLICY storage_media_select_public ON storage.objects FOR SELECT TO authenticated, anon
USING (bucket_id = 'media-assets');

CREATE POLICY storage_media_insert_policy ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'media-assets'
    AND public.is_active_user()
    AND (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin'))
    -- CHỈ CHẤP NHẬN ẢNH RASTER AN TOÀN (<= 5MB) HOẶC PDF (<= 20MB)
    -- LOẠI BỎ HOÀN TOÀN SVG ĐỂ TRIỆT TIÊU STORED XSS
    AND (
        (lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp') AND (metadata->>'size')::bigint <= 5242880)
        OR
        (lower(storage.extension(name)) = 'pdf' AND (metadata->>'size')::bigint <= 20971520)
    )
);

CREATE POLICY storage_media_delete_policy ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'media-assets'
    AND public.is_active_user()
    AND (public.has_role('admin') OR public.has_role('super_admin'))
    -- CHẶN XÓA NẾU TỆP ĐANG ĐƯỢC NỘI DUNG SỬ DỤNG
    AND NOT public.is_storage_file_in_use(name)
);
