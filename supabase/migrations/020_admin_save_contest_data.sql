-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- BẢN MÃ NGUỒN CẬP NHẬT 020: HÀM RPC ĐỒNG BỘ CẤU HÌNH HỘI THI & BẢNG ĐIỂM CLOUD
-- KHẮC PHỤC TRIỆT ĐỂ LỖI 4 MẮT P0001 KHI CÁN BỘ/GIÁO VIÊN CẬP NHẬT HỘI THI
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.admin_save_contest_data(
    p_contests JSONB,
    p_submissions JSONB DEFAULT NULL,
    p_questions JSONB DEFAULT NULL,
    p_classes JSONB DEFAULT NULL,
    p_roster JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_rev_record RECORD;
    v_current_data JSONB;
    v_new_data JSONB;
    v_new_id UUID;
    v_actor_id UUID;
BEGIN
    -- 1. Kiểm tra xác thực cán bộ quản trị
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập tài khoản Cán bộ / Ban Giám khảo để đồng bộ Cloud.';
    END IF;

    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Tài khoản hiện đang bị tạm khóa hoặc chưa được kích hoạt.';
    END IF;

    IF NOT (public.has_role('admin') OR public.has_role('super_admin') OR public.has_role('editor')) THEN
        RAISE EXCEPTION 'Quyền hạn không đủ: Chỉ Cán bộ Quản trị hoặc Ban Giám khảo mới có quyền lưu cấu hình hội thi.';
    END IF;

    -- 2. Tìm bản ghi xuất bản hiện tại của hội thi (item_id = a0000000-0000-0000-0000-000000000001)
    SELECT * INTO v_rev_record
    FROM public.content_revisions
    WHERE item_id = 'a0000000-0000-0000-0000-000000000001'
      AND status = 'published'
    ORDER BY version_number DESC
    LIMIT 1;

    IF FOUND THEN
        v_current_data := COALESCE(v_rev_record.data, '{}'::jsonb);
        v_new_data := v_current_data;

        IF p_contests IS NOT NULL THEN
            v_new_data := jsonb_set(v_new_data, '{contests}', p_contests);
            v_new_data := jsonb_set(v_new_data, '{activeContestId}', COALESCE(p_contests->0->'id', '"hoi-thi-2024-tuoi-tre-bac-ho"'::jsonb));
        END IF;

        IF p_submissions IS NOT NULL THEN
            v_new_data := jsonb_set(v_new_data, '{submissions}', p_submissions);
        END IF;

        IF p_questions IS NOT NULL THEN
            v_new_data := jsonb_set(v_new_data, '{questions}', p_questions);
        END IF;

        IF p_classes IS NOT NULL THEN
            v_new_data := jsonb_set(v_new_data, '{classes}', p_classes);
        END IF;

        IF p_roster IS NOT NULL THEN
            v_new_data := jsonb_set(v_new_data, '{roster}', p_roster);
        END IF;

        v_new_data := jsonb_set(v_new_data, '{syncedAt}', to_jsonb(to_char(clock_timestamp(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')));

        UPDATE public.content_revisions
        SET data = v_new_data,
            updated_at = clock_timestamp()
        WHERE id = v_rev_record.id;

        -- Dọn dẹp các bản ghi nháp/pending cũ bị treo (nếu có)
        DELETE FROM public.content_revisions
        WHERE item_id = 'a0000000-0000-0000-0000-000000000001'
          AND status IN ('draft', 'pending');

        RETURN jsonb_build_object(
            'success', true,
            'message', 'Đã lưu và đồng bộ cấu hình hội thi lên Database Cloud thành công!',
            'version', v_rev_record.version_number
        );
    ELSE
        -- Khởi tạo bản ghi xuất bản đầu tiên nếu chưa có
        v_new_id := gen_random_uuid();
        v_new_data := jsonb_build_object(
            'contests', COALESCE(p_contests, '[]'::jsonb),
            'submissions', COALESCE(p_submissions, '[]'::jsonb),
            'questions', COALESCE(p_questions, '[]'::jsonb),
            'classes', COALESCE(p_classes, '[]'::jsonb),
            'roster', COALESCE(p_roster, '{}'::jsonb),
            'activeContestId', COALESCE(p_contests->0->>'id', 'hoi-thi-2024-tuoi-tre-bac-ho'),
            'syncedAt', to_char(clock_timestamp(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
        );

        INSERT INTO public.content_revisions (
            id,
            item_id,
            version_number,
            title,
            summary,
            data,
            status,
            author_id,
            reviewed_by,
            reviewed_at,
            published_by,
            published_at,
            created_at,
            updated_at
        ) VALUES (
            v_new_id,
            'a0000000-0000-0000-0000-000000000001',
            1,
            'Hồ Sơ Hội Thi & Kết Quả Học Đường THCS Nguyễn Trung Trực (Bản v1)',
            'Khởi tạo cấu hình hội thi và bảng điểm trường học',
            v_new_data,
            'published',
            v_actor_id,
            v_actor_id,
            clock_timestamp(),
            v_actor_id,
            clock_timestamp(),
            clock_timestamp(),
            clock_timestamp()
        );

        RETURN jsonb_build_object(
            'success', true,
            'message', 'Đã khởi tạo và xuất bản cấu hình hội thi lên Database Cloud thành công!',
            'version', 1
        );
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_contest_data(JSONB, JSONB, JSONB, JSONB, JSONB) TO authenticated, service_role;
