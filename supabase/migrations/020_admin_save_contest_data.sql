-- ==============================================================================
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- BẢN MÃ NGUỒN CẬP NHẬT 020 (SỬA LỖI TOÀN DIỆN SCHEMA POSTGRESQL):
-- 1. Bổ sung cột updated_at vào bảng content_revisions nếu chưa có
-- 2. Hàm RPC admin_save_contest_data đồng bộ cấu hình Hội thi & Bảng điểm
-- 3. Cập nhật hàm RPC submit_contest_exam để học sinh nộp bài mượt mà
-- ==============================================================================

-- BƯỚC 1: BỔ SUNG AN TOÀN CỘT updated_at VÀO public.content_revisions NẾU CHƯA CÓ
ALTER TABLE public.content_revisions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Cấp quyền cập nhật cho authenticated và service_role
GRANT SELECT, INSERT, UPDATE ON public.content_revisions TO authenticated, service_role;
GRANT SELECT ON public.content_revisions TO anon;

-- BƯỚC 2: TẠO HOẶC THAY THẾ HÀM RPC admin_save_contest_data
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

    -- 2. Đảm bảo bản ghi danh mục content_items luôn tồn tại cho Hội thi
    INSERT INTO public.content_items (
        id,
        content_type,
        slug,
        created_by,
        created_at,
        updated_at
    ) VALUES (
        'a0000000-0000-0000-0000-000000000001',
        'quiz',
        'hoi-thi-truc-tuyen-nguyen-trung-truc',
        v_actor_id,
        clock_timestamp(),
        clock_timestamp()
    )
    ON CONFLICT (id) DO UPDATE 
    SET updated_at = clock_timestamp();

    -- 3. Tìm bản ghi xuất bản hiện tại của hội thi (item_id = a0000000-0000-0000-0000-000000000001)
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

        UPDATE public.content_items
        SET published_revision_id = v_rev_record.id,
            updated_at = clock_timestamp()
        WHERE id = 'a0000000-0000-0000-0000-000000000001';

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
            clock_timestamp(),
            clock_timestamp()
        );

        UPDATE public.content_items
        SET published_revision_id = v_new_id,
            updated_at = clock_timestamp()
        WHERE id = 'a0000000-0000-0000-0000-000000000001';

        RETURN jsonb_build_object(
            'success', true,
            'message', 'Đã khởi tạo và xuất bản cấu hình hội thi lên Database Cloud thành công!',
            'version', 1
        );
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_contest_data(JSONB, JSONB, JSONB, JSONB, JSONB) TO authenticated, service_role;

-- BƯỚC 3: CẬP NHẬT HÀM RPC submit_contest_exam CHO HỌC SINH NỘP BÀI THI
CREATE OR REPLACE FUNCTION public.submit_contest_exam(p_submission JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_id TEXT;
    v_contest_id TEXT;
    v_student_name TEXT;
    v_student_class TEXT;
    v_score NUMERIC;
    v_total_questions INTEGER;
    v_time_spent_seconds INTEGER;
    v_submitted_at TIMESTAMPTZ;
    v_award TEXT;
    v_answers JSONB;
    v_rev_record RECORD;
    v_current_data JSONB;
    v_existing_subs JSONB;
    v_updated_subs JSONB;
    v_new_sub JSONB;
BEGIN
    IF p_submission IS NULL THEN
        RAISE EXCEPTION 'Dữ liệu bài thi không được để trống.';
    END IF;

    v_id := COALESCE(p_submission->>'id', 'sub-' || floor(extract(epoch from clock_timestamp()) * 1000)::text);
    v_contest_id := COALESCE(p_submission->>'contestId', 'hoi-thi-2024-tuoi-tre-bac-ho');
    v_student_name := TRIM(COALESCE(p_submission->>'studentName', 'Học sinh'));
    v_student_class := TRIM(COALESCE(p_submission->>'studentClass', ''));
    v_score := COALESCE((p_submission->>'score')::numeric, 0);
    v_total_questions := COALESCE((p_submission->>'totalQuestions')::integer, 10);
    v_time_spent_seconds := COALESCE((p_submission->>'timeSpentSeconds')::integer, 0);
    v_award := p_submission->>'award';
    v_answers := COALESCE(p_submission->'answers', '{}'::jsonb);

    IF p_submission->>'submittedAt' IS NOT NULL THEN
        BEGIN
            v_submitted_at := (p_submission->>'submittedAt')::timestamptz;
        EXCEPTION WHEN OTHERS THEN
            v_submitted_at := clock_timestamp();
        END;
    ELSE
        v_submitted_at := clock_timestamp();
    END IF;

    -- 1. Lưu hoặc cập nhật vào bảng public.contest_submissions
    INSERT INTO public.contest_submissions (
        id, contest_id, student_name, student_class, score,
        total_questions, time_spent_seconds, submitted_at, award, answers
    ) VALUES (
        v_id, v_contest_id, v_student_name, v_student_class, v_score,
        v_total_questions, v_time_spent_seconds, v_submitted_at, v_award, v_answers
    )
    ON CONFLICT (id) DO UPDATE SET
        score = EXCLUDED.score,
        time_spent_seconds = EXCLUDED.time_spent_seconds,
        submitted_at = EXCLUDED.submitted_at,
        award = EXCLUDED.award,
        answers = EXCLUDED.answers;

    -- 2. Đồng bộ tự động vào bản ghi published của content_revisions (nếu tồn tại)
    BEGIN
        SELECT * INTO v_rev_record
        FROM public.content_revisions
        WHERE item_id = 'a0000000-0000-0000-0000-000000000001'
          AND status = 'published'
        ORDER BY version_number DESC
        LIMIT 1;

        v_new_sub := jsonb_build_object(
            'id', v_id,
            'contestId', v_contest_id,
            'studentName', v_student_name,
            'studentClass', v_student_class,
            'score', v_score,
            'totalQuestions', v_total_questions,
            'timeSpentSeconds', v_time_spent_seconds,
            'submittedAt', v_submitted_at,
            'award', v_award,
            'answers', v_answers
        );

        IF v_rev_record.id IS NOT NULL THEN
            v_current_data := COALESCE(v_rev_record.data, '{}'::jsonb);
            v_existing_subs := COALESCE(v_current_data->'submissions', '[]'::jsonb);

            -- Thêm bài mới vào đầu danh sách, loại bỏ trùng ID
            SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb) INTO v_updated_subs
            FROM (
                SELECT v_new_sub AS elem
                UNION ALL
                SELECT s AS elem
                FROM jsonb_array_elements(v_existing_subs) s
                WHERE (s->>'id') IS DISTINCT FROM v_id
            ) q;

            UPDATE public.content_revisions
            SET data = jsonb_set(v_current_data, '{submissions}', v_updated_subs),
                updated_at = clock_timestamp()
            WHERE id = v_rev_record.id;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_id,
        'student_name', v_student_name,
        'score', v_score,
        'message', 'Đã lưu kết quả bài thi thành công lên Database Cloud'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contest_exam(JSONB) TO anon, authenticated, service_role;
