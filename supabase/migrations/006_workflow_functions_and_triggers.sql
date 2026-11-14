-- ==============================================================================
-- 006_workflow_functions_and_triggers.sql
-- MỤC ĐÍCH: Các thủ tục kiểm duyệt nội dung, kiểm soát 4 mắt, xuất bản, soft delete & restore
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. THU HỒI QUYỀN UPDATE TOÀN BẢNG VÀ CHỈ CẤP QUYỀN TRÊN CÁC CỘT NỘI DUNG
REVOKE UPDATE ON public.content_revisions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.content_revisions TO authenticated, anon;
GRANT INSERT ON public.content_revisions TO authenticated;
GRANT UPDATE (title, summary, data) ON public.content_revisions TO authenticated;
REVOKE UPDATE (status, reviewed_by, reviewed_at, review_feedback, submitted_at, author_id, item_id, version_number) 
ON public.content_revisions FROM authenticated, anon, PUBLIC;

-- 2. HÀM GỬI BÀI DUYỆT (SUBMIT REVISION)
CREATE OR REPLACE FUNCTION public.submit_revision_for_review(p_revision_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_author_id UUID;
    v_status VARCHAR;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập. Tài khoản của bạn phải ở trạng thái hoạt động.';
    END IF;

    IF NOT (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Bạn không có vai trò biên tập viên.';
    END IF;

    SELECT author_id, status INTO v_author_id, v_status
    FROM public.content_revisions WHERE id = p_revision_id
    FOR UPDATE;

    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'Phiên bản nội dung không tồn tại.';
    END IF;

    IF v_author_id <> auth.uid() AND NOT public.has_role('super_admin') THEN
        RAISE EXCEPTION 'Vi phạm quyền sở hữu: Bạn chỉ được phép gửi duyệt các bài viết do chính mình tạo ra.';
    END IF;

    IF v_status NOT IN ('draft', 'rejected') THEN
        RAISE EXCEPTION 'Chỉ có thể gửi duyệt bản nháp ("draft") hoặc bản bị yêu cầu chỉnh sửa ("rejected"). Trạng thái hiện tại: %', v_status;
    END IF;

    UPDATE public.content_revisions
    SET status = 'pending',
        submitted_at = now()
    WHERE id = p_revision_id;

    INSERT INTO public.approval_events (revision_id, actor_id, action, comment)
    VALUES (p_revision_id, auth.uid(), 'submit', 'Tác giả gửi bản thảo đề nghị Ban biên tập thẩm định');

    RETURN jsonb_build_object('success', true, 'status', 'pending', 'revision_id', p_revision_id);
END;
$$;

-- 3. HÀM KIỂM DUYỆT (REVIEW REVISION) - KIỂM SOÁT 4 MẮT TUYỆT ĐỐI
CREATE OR REPLACE FUNCTION public.review_revision(
    p_revision_id UUID,
    p_decision VARCHAR,
    p_feedback TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_author_id UUID;
    v_status VARCHAR;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản đang hoạt động.';
    END IF;

    IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Ban Biên tập (Admin) hoặc Super Admin mới được duyệt bài.';
    END IF;

    SELECT author_id, status INTO v_author_id, v_status
    FROM public.content_revisions WHERE id = p_revision_id
    FOR UPDATE;

    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'Phiên bản không tồn tại.';
    END IF;

    -- KIỂM SOÁT 4 MẮT: CẤM TỰ DUYỆT BÀI CỦA MÌNH
    IF v_author_id = auth.uid() THEN
        RAISE EXCEPTION 'Vi phạm an toàn kiểm duyệt: Biên tập viên không được phép tự phê duyệt nội dung của chính mình.';
    END IF;

    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'Chỉ có thể phê duyệt phiên bản đang ở trạng thái chờ duyệt ("pending"). Trạng thái hiện tại: %', v_status;
    END IF;

    IF p_decision NOT IN ('approved', 'rejected') THEN
        RAISE EXCEPTION 'Quyết định không hợp lệ. Chỉ chấp nhận "approved" (Duyệt) hoặc "rejected" (Yêu cầu sửa/Từ chối).';
    END IF;

    UPDATE public.content_revisions
    SET status = p_decision,
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        review_feedback = p_feedback
    WHERE id = p_revision_id;

    INSERT INTO public.approval_events (revision_id, actor_id, action, comment)
    VALUES (p_revision_id, auth.uid(), p_decision, p_feedback);

    RETURN jsonb_build_object('success', true, 'status', p_decision, 'revision_id', p_revision_id);
END;
$$;

-- 4. HÀM XUẤT BẢN NGUYÊN TỬ (PUBLISH REVISION)
CREATE OR REPLACE FUNCTION public.publish_revision(p_revision_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_item_id UUID;
    v_status VARCHAR;
    v_prev_published_id UUID;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản đang hoạt động.';
    END IF;

    IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Ban Biên tập hoặc Super Admin mới có quyền xuất bản nội dung.';
    END IF;

    SELECT item_id, status INTO v_item_id, v_status
    FROM public.content_revisions WHERE id = p_revision_id
    FOR UPDATE;

    IF v_item_id IS NULL THEN
        RAISE EXCEPTION 'Phiên bản nội dung không tồn tại.';
    END IF;

    IF v_status <> 'approved' THEN
        RAISE EXCEPTION 'Chỉ có thể xuất bản phiên bản đã được thẩm định đạt ("approved"). Trạng thái hiện tại: %', v_status;
    END IF;

    SELECT published_revision_id INTO v_prev_published_id
    FROM public.content_items WHERE id = v_item_id
    FOR UPDATE;

    IF v_prev_published_id IS NOT NULL AND v_prev_published_id <> p_revision_id THEN
        UPDATE public.content_revisions
        SET status = 'archived'
        WHERE id = v_prev_published_id;
    END IF;

    UPDATE public.content_revisions
    SET status = 'published'
    WHERE id = p_revision_id;

    UPDATE public.content_items
    SET published_revision_id = p_revision_id,
        updated_at = now()
    WHERE id = v_item_id;

    INSERT INTO public.approval_events (revision_id, actor_id, action, comment)
    VALUES (p_revision_id, auth.uid(), 'publish', 'Xuất bản phiên bản chính thức ra website công cộng');

    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'PUBLISH_CONTENT', 'content_items', v_item_id, jsonb_build_object(
        'new_published_revision_id', p_revision_id,
        'archived_revision_id', v_prev_published_id
    ));

    RETURN jsonb_build_object('success', true, 'published_revision_id', p_revision_id, 'item_id', v_item_id);
END;
$$;

-- 5. HÀM GỠ BÀI XUẤT BẢN (UNPUBLISH REVISION)
CREATE OR REPLACE FUNCTION public.unpublish_revision(p_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_published_id UUID;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản đang hoạt động.';
    END IF;

    IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Ban Biên tập hoặc Super Admin mới được gỡ bài.';
    END IF;

    SELECT published_revision_id INTO v_published_id
    FROM public.content_items WHERE id = p_item_id
    FOR UPDATE;

    IF v_published_id IS NULL THEN
        RAISE EXCEPTION 'Mục nội dung hiện tại không có phiên bản xuất bản nào.';
    END IF;

    -- Đổi trạng thái bản đang publish về archived
    UPDATE public.content_revisions
    SET status = 'archived'
    WHERE id = v_published_id;

    -- Gỡ con trỏ xuất bản
    UPDATE public.content_items
    SET published_revision_id = NULL,
        updated_at = now()
    WHERE id = p_item_id;

    INSERT INTO public.approval_events (revision_id, actor_id, action, comment)
    VALUES (v_published_id, auth.uid(), 'unpublish', 'Gỡ nội dung khỏi trang web công cộng, chuyển về lưu trữ');

    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'UNPUBLISH_CONTENT', 'content_items', p_item_id, jsonb_build_object('unpublished_revision_id', v_published_id));

    RETURN jsonb_build_object('success', true, 'message', 'Đã gỡ bài xuất bản thành công', 'item_id', p_item_id);
END;
$$;

-- 6. HÀM LƯU TRỮ / XÓA MỀM (ARCHIVE / SOFT DELETE CONTENT ITEM)
CREATE OR REPLACE FUNCTION public.archive_content_item(p_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_published_id UUID;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản đang hoạt động.';
    END IF;

    IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Ban Biên tập hoặc Super Admin mới được lưu trữ nội dung.';
    END IF;

    SELECT published_revision_id INTO v_published_id
    FROM public.content_items WHERE id = p_item_id
    FOR UPDATE;

    -- Nếu đang có bản publish, chuyển nó về archived
    IF v_published_id IS NOT NULL THEN
        UPDATE public.content_revisions
        SET status = 'archived'
        WHERE id = v_published_id;
    END IF;

    -- Thực hiện soft delete
    UPDATE public.content_items
    SET is_deleted = true,
        deleted_at = now(),
        deleted_by = auth.uid(),
        published_revision_id = NULL,
        updated_at = now()
    WHERE id = p_item_id;

    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'ARCHIVE_CONTENT_ITEM', 'content_items', p_item_id, jsonb_build_object('archived_at', now()));

    RETURN jsonb_build_object('success', true, 'message', 'Đã chuyển mục nội dung sang lưu trữ (Soft Delete)', 'item_id', p_item_id);
END;
$$;

-- 7. HÀM KHÔI PHỤC NỘI DUNG ĐÃ XÓA MỀM (RESTORE CONTENT ITEM)
CREATE OR REPLACE FUNCTION public.restore_content_item(p_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản đang hoạt động.';
    END IF;

    IF NOT public.has_role('super_admin') THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Super Admin mới có quyền khôi phục nội dung đã lưu trữ.';
    END IF;

    UPDATE public.content_items
    SET is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = now()
    WHERE id = p_item_id;

    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'RESTORE_CONTENT_ITEM', 'content_items', p_item_id, jsonb_build_object('restored_at', now()));

    RETURN jsonb_build_object('success', true, 'message', 'Đã khôi phục mục nội dung thành công', 'item_id', p_item_id);
END;
$$;

-- CẤP QUYỀN EXECUTE CHẶT CHẼ
REVOKE ALL ON FUNCTION public.submit_revision_for_review(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_revision_for_review(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.review_revision(UUID, VARCHAR, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_revision(UUID, VARCHAR, TEXT) TO authenticated;

REVOKE ALL ON FUNCTION public.publish_revision(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publish_revision(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.unpublish_revision(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.unpublish_revision(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.archive_content_item(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.archive_content_item(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.restore_content_item(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_content_item(UUID) TO authenticated;
