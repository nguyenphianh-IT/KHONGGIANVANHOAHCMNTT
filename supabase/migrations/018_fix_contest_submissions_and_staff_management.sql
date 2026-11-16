-- ==============================================================================
-- 018_fix_contest_submissions_and_staff_management.sql
-- MỤC ĐÍCH: 
-- 1. Tạo bảng và cơ chế lưu trữ kết quả thi trực tuyến của học sinh (public.contest_submissions)
--    Hỗ trợ nộp bài trực tiếp không cần đăng nhập (anon) và đồng bộ real-time.
-- 2. Tạo hàm RPC submit_contest_exam (SECURITY DEFINER) lưu bài thi và cập nhật content_revisions.
-- 3. Tạo cơ chế quản trị tài khoản cán bộ/giáo viên (admin_create_staff_user, admin_delete_staff_user, admin_reset_staff_password, admin_list_staff_users)
--    Khởi tạo tài khoản thực trong auth.users kèm email_confirmed_at, đồng bộ profiles và user_roles.
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

BEGIN;

SET search_path = public, auth, extensions, pg_temp;

-- ------------------------------------------------------------------------------
-- PHẦN 1: BẢNG LƯU KẾT QUẢ BÀI THI HỘI THI TRỰC TUYẾN (CONTEST SUBMISSIONS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contest_submissions (
    id TEXT PRIMARY KEY,
    contest_id TEXT NOT NULL DEFAULT 'hoi-thi-2024-tuoi-tre-bac-ho',
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    score NUMERIC NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 10,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    award TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Chỉ mục tối ưu hóa tốc độ tìm kiếm và bảng xếp hạng
CREATE INDEX IF NOT EXISTS idx_contest_subs_contest ON public.contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_subs_ranking ON public.contest_submissions(score DESC, time_spent_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_contest_subs_class ON public.contest_submissions(student_class);
CREATE INDEX IF NOT EXISTS idx_contest_subs_submitted_at ON public.contest_submissions(submitted_at DESC);

-- Bật Row Level Security (RLS)
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép mọi người (anon & authenticated) xem bảng xếp hạng và bài thi công khai
DROP POLICY IF EXISTS "Allow public read on contest_submissions" ON public.contest_submissions;
CREATE POLICY "Allow public read on contest_submissions"
ON public.contest_submissions
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Cho phép thí sinh (anon & authenticated) nộp bài thi mới
DROP POLICY IF EXISTS "Allow public insert on contest_submissions" ON public.contest_submissions;
CREATE POLICY "Allow public insert on contest_submissions"
ON public.contest_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Cho phép cập nhật/upsert bài thi nếu cùng ID (nộp lại/gửi lại)
DROP POLICY IF EXISTS "Allow public update on contest_submissions" ON public.contest_submissions;
CREATE POLICY "Allow public update on contest_submissions"
ON public.contest_submissions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Cho phép quản trị viên xóa bài thi test nếu cần
DROP POLICY IF EXISTS "Allow admin delete on contest_submissions" ON public.contest_submissions;
CREATE POLICY "Allow admin delete on contest_submissions"
ON public.contest_submissions
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'super_admin')
    )
);

-- ------------------------------------------------------------------------------
-- PHẦN 2: HÀM RPC NỘP BÀI THI TRỰC TUYẾN (submit_contest_exam)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_contest_exam(
    p_submission JSONB
)
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
        -- Không để lỗi đồng bộ content_revisions làm gián đoạn nộp bài
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

-- ------------------------------------------------------------------------------
-- PHẦN 3: NÂNG CẤP BẢNG PROFILES ĐỂ QUẢN LÝ EMAIL CÁN BỘ
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Cập nhật email từ auth.users vào profiles nếu chưa có
DO $$
BEGIN
    UPDATE public.profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ------------------------------------------------------------------------------
-- PHẦN 4: HÀM QUẢN LÝ TÀI KHOẢN CÁN BỘ / GIÁO VIÊN (ADMIN RPCs)
-- ------------------------------------------------------------------------------

-- 1. Hàm tạo tài khoản cán bộ mới (admin_create_staff_user)
CREATE OR REPLACE FUNCTION public.admin_create_staff_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT,
    p_department TEXT,
    p_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_clean_name TEXT;
    v_clean_dept TEXT;
    v_role_code TEXT;
    v_role_id UUID;
    v_user_id UUID;
    v_encrypted_pw TEXT;
    v_is_existing BOOLEAN := false;
BEGIN
    -- Kiểm tra định dạng đầu vào
    v_clean_email := lower(trim(coalesce(p_email, '')));
    v_clean_name := trim(coalesce(p_full_name, ''));
    v_clean_dept := trim(coalesce(p_department, 'Trường THCS Nguyễn Trung Trực'));
    v_role_code := lower(trim(coalesce(p_role, 'editor')));

    IF v_clean_email = '' OR v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Địa chỉ email không hợp lệ: %', p_email;
    END IF;

    IF length(p_password) < 8 THEN
        RAISE EXCEPTION 'Mật khẩu phải có tối thiểu 8 ký tự.';
    END IF;

    IF v_clean_name = '' THEN
        RAISE EXCEPTION 'Họ và tên cán bộ không được để trống.';
    END IF;

    IF v_role_code NOT IN ('admin', 'editor', 'viewer') THEN
        v_role_code := 'editor';
    END IF;

    -- Tra cứu vai trò hợp lệ
    SELECT id INTO v_role_id FROM public.roles WHERE code = v_role_code;
    IF v_role_id IS NULL THEN
        SELECT id INTO v_role_id FROM public.roles WHERE code = 'editor';
    END IF;

    -- Kiểm tra xem người dùng đã tồn tại trong auth.users chưa
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_clean_email;

    v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));

    IF v_user_id IS NOT NULL THEN
        v_is_existing := true;
        -- Cập nhật mật khẩu và metadata cho tài khoản đã có
        UPDATE auth.users
        SET encrypted_password = v_encrypted_pw,
            updated_at = now(),
            raw_user_meta_data = jsonb_build_object('full_name', v_clean_name, 'department', v_clean_dept),
            email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE id = v_user_id;
    ELSE
        -- Tạo mới tài khoản trong auth.users
        v_user_id := gen_random_uuid();
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            v_clean_email,
            v_encrypted_pw,
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('full_name', v_clean_name, 'department', v_clean_dept),
            now(),
            now(),
            ''
        );

        -- Thêm identity tương ứng trong auth.identities
        BEGIN
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                v_user_id,
                v_user_id,
                jsonb_build_object('sub', v_user_id::text, 'email', v_clean_email),
                'email',
                now(),
                now(),
                now()
            ) ON CONFLICT DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;

    -- Đồng bộ bảng public.profiles
    INSERT INTO public.profiles (id, full_name, department, status, email)
    VALUES (v_user_id, v_clean_name, v_clean_dept, 'active', v_clean_email)
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        department = EXCLUDED.department,
        status = 'active',
        email = EXCLUDED.email,
        updated_at = now();

    -- Gán vai trò trong public.user_roles
    IF v_role_id IS NOT NULL THEN
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (v_user_id, v_role_id, auth.uid());
    END IF;

    -- Ghi nhật ký kiểm toán
    BEGIN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (
            COALESCE(auth.uid(), v_user_id),
            CASE WHEN v_is_existing THEN 'UPDATE_STAFF_USER' ELSE 'CREATE_STAFF_USER' END,
            'profiles',
            v_user_id,
            jsonb_build_object(
                'email', v_clean_email,
                'full_name', v_clean_name,
                'department', v_clean_dept,
                'role', v_role_code,
                'created_at', now()
            )
        );
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'email', v_clean_email,
        'full_name', v_clean_name,
        'department', v_clean_dept,
        'role', v_role_code,
        'is_existing', v_is_existing,
        'message', CASE WHEN v_is_existing 
                   THEN 'Đã cập nhật mật khẩu và thông tin tài khoản cán bộ thành công!' 
                   ELSE 'Đã tạo tài khoản cán bộ thành công trên Database Cloud!' END
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_create_staff_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role;

-- 2. Hàm đặt lại mật khẩu cán bộ (admin_reset_staff_password)
CREATE OR REPLACE FUNCTION public.admin_reset_staff_password(
    p_user_id UUID,
    p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_user RECORD;
    v_encrypted_pw TEXT;
BEGIN
    IF length(p_new_password) < 8 THEN
        RAISE EXCEPTION 'Mật khẩu mới phải có tối thiểu 8 ký tự.';
    END IF;

    SELECT id, email INTO v_user FROM auth.users WHERE id = p_user_id;
    IF v_user.id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy người dùng với ID: %', p_user_id;
    END IF;

    v_encrypted_pw := extensions.crypt(p_new_password, extensions.gen_salt('bf'));

    UPDATE auth.users
    SET encrypted_password = v_encrypted_pw,
        updated_at = now()
    WHERE id = p_user_id;

    -- Ghi nhật ký kiểm toán
    BEGIN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (
            COALESCE(auth.uid(), p_user_id),
            'RESET_STAFF_PASSWORD',
            'auth.users',
            p_user_id,
            jsonb_build_object('email', v_user.email, 'timestamp', now())
        );
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Đã cấp và cập nhật mật khẩu mới thành công trên Database Cloud'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_reset_staff_password(UUID, TEXT) TO authenticated, service_role;

-- 3. Hàm xóa hoặc vô hiệu hóa tài khoản cán bộ (admin_delete_staff_user)
CREATE OR REPLACE FUNCTION public.admin_delete_staff_user(
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    v_current_user UUID;
    v_staff_email TEXT;
BEGIN
    v_current_user := auth.uid();
    IF v_current_user IS NOT NULL AND v_current_user = p_user_id THEN
        RAISE EXCEPTION 'Bảo mật: Không được phép tự xóa tài khoản của chính bạn đang đăng nhập.';
    END IF;

    SELECT email INTO v_staff_email FROM auth.users WHERE id = p_user_id;

    -- Xóa vai trò
    DELETE FROM public.user_roles WHERE user_id = p_user_id;

    -- Đánh dấu inactive trong profiles
    UPDATE public.profiles SET status = 'inactive', updated_at = now() WHERE id = p_user_id;

    -- Xóa trong auth.users
    DELETE FROM auth.users WHERE id = p_user_id;

    -- Ghi nhật ký kiểm toán
    BEGIN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (
            COALESCE(v_current_user, p_user_id),
            'DELETE_STAFF_USER',
            'auth.users',
            p_user_id,
            jsonb_build_object('email', v_staff_email, 'timestamp', now())
        );
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Đã xóa và thu hồi quyền tài khoản cán bộ thành công.'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_staff_user(UUID) TO authenticated, service_role;

-- 4. Hàm lấy danh sách cán bộ / giáo viên (admin_list_staff_users)
CREATE OR REPLACE FUNCTION public.admin_list_staff_users()
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    full_name VARCHAR,
    department VARCHAR,
    role VARCHAR,
    role_name VARCHAR,
    status VARCHAR,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        COALESCE(p.email, u.email::varchar, ''::varchar) AS email,
        p.full_name,
        p.department,
        COALESCE(r.code, 'editor')::varchar AS role,
        COALESCE(r.name, 'Biên tập viên')::varchar AS role_name,
        p.status,
        p.created_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    LEFT JOIN public.user_roles ur ON p.id = ur.user_id
    LEFT JOIN public.roles r ON ur.role_id = r.id
    WHERE p.status != 'inactive'
    ORDER BY p.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_staff_users() TO authenticated, service_role;

COMMIT;
