-- ==============================================================================
-- 008_quiz_security_tables_and_functions.sql
-- MỤC ĐÍCH: Tách biệt câu hỏi công khai, phiên thi do giáo viên mở và chấm điểm bảo mật
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. BẢNG CÂU HỎI TRẮC NGHIỆM CÔNG KHAI (Không chứa đáp án)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL CHECK (jsonb_array_length(options) = 4),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON public.quiz_questions(is_active, sort_order);

-- 2. BẢNG ĐÁP ÁN BÍ MẬT (Chỉ Admin và Super Admin được SELECT qua RLS)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
    question_id UUID PRIMARY KEY REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    correct_index INT NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
    explanation TEXT NOT NULL
);

-- 3. BẢNG QUẢN LÝ ĐỢT THI CHÍNH THỨC DO GIÁO VIÊN MỞ (ASSESSMENT SESSIONS)
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_code VARCHAR(20) UNIQUE NOT NULL,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_class VARCHAR(50) NOT NULL,
    student_name VARCHAR(150),
    duration_minutes INT NOT NULL DEFAULT 15 CHECK (duration_minutes >= 5 AND duration_minutes <= 120),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'expired')),
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_code ON public.quiz_sessions(access_code);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_token ON public.quiz_sessions(session_token);

-- 4. BẢNG LƯỢT LÀM BÀI ĐÁNH GIÁ (Lưu kết quả thi chính thức)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    mode VARCHAR(20) NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'assessment')),
    student_name VARCHAR(150) NOT NULL,
    student_class VARCHAR(50) NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL,
    score_percentage NUMERIC(5, 2) NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_session_attempt UNIQUE (session_id)
);

-- 5. HÀM DÀNH RIÊNG CHO GIÁO VIÊN: TẠO ĐỢT KIỂM TRA ĐÁNH GIÁ
CREATE OR REPLACE FUNCTION public.create_quiz_assessment_session(
    p_title VARCHAR,
    p_target_class VARCHAR,
    p_duration_minutes INT DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_access_code VARCHAR(20);
    v_session_token VARCHAR(100);
    v_session_id UUID;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập.';
    END IF;

    IF NOT (public.has_role('editor') OR public.has_role('admin') OR public.has_role('super_admin')) THEN
        RAISE EXCEPTION 'Chỉ Giáo viên / Ban biên tập mới có quyền tạo đợt kiểm tra đánh giá.';
    END IF;

    -- Sinh mã phòng ngẫu nhiên 6 chữ số
    v_access_code := upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 6));
    v_session_token := encode(gen_random_bytes(32), 'hex');

    INSERT INTO public.quiz_sessions (
        access_code, session_token, title, target_class, duration_minutes, status, created_by
    ) VALUES (
        v_access_code, v_session_token, p_title, p_target_class, p_duration_minutes, 'open', auth.uid()
    ) RETURNING id INTO v_session_id;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'access_code', v_access_code,
        'title', p_title,
        'target_class', p_target_class,
        'duration_minutes', p_duration_minutes
    );
END;
$$;

-- 6. HÀM HỌC SINH THAM GIA PHÒNG THI (JOIN QUIZ ASSESSMENT)
CREATE OR REPLACE FUNCTION public.join_quiz_assessment_session(
    p_access_code VARCHAR,
    p_student_name VARCHAR,
    p_student_class VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_session RECORD;
BEGIN
    IF trim(coalesce(p_student_name, '')) = '' OR trim(coalesce(p_student_class, '')) = '' THEN
        RAISE EXCEPTION 'Vui lòng điền đầy đủ họ và tên cùng lớp của học sinh.';
    END IF;

    SELECT * INTO v_session
    FROM public.quiz_sessions
    WHERE access_code = upper(trim(p_access_code))
    FOR UPDATE;

    IF v_session.id IS NULL THEN
        RAISE EXCEPTION 'Mã phòng thi không chính xác hoặc không tồn tại.';
    END IF;

    IF v_session.status = 'completed' THEN
        RAISE EXCEPTION 'Phòng thi này đã kết thúc.';
    END IF;

    -- Thiết lập thời gian làm bài chính thức
    UPDATE public.quiz_sessions
    SET student_name = trim(p_student_name),
        student_class = trim(p_student_class),
        status = 'in_progress',
        expires_at = now() + (v_session.duration_minutes || ' minutes')::interval
    WHERE id = v_session.id;

    RETURN jsonb_build_object(
        'success', true,
        'session_token', v_session.session_token,
        'student_name', p_student_name,
        'student_class', p_student_class,
        'duration_minutes', v_session.duration_minutes,
        'expires_at', now() + (v_session.duration_minutes || ' minutes')::interval
    );
END;
$$;

-- 7. HÀM CHẤM ĐIỂM BẢO MẬT (CHỐNG TRÙNG CÂU HỎI & CHỐNG NỘP LẠI)
CREATE OR REPLACE FUNCTION public.verify_quiz_submission(
    p_submissions JSONB,
    p_mode VARCHAR DEFAULT 'practice',
    p_session_token VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_item JSONB;
    v_q_id UUID;
    v_selected_idx INT;
    v_correct_idx INT;
    v_explanation TEXT;
    v_is_correct BOOLEAN;
    v_score INT := 0;
    v_total INT := 0;
    v_results JSONB := '[]'::jsonb;
    v_len INT;
    v_seen_ids UUID[] := '{}';
    v_session_record RECORD;
BEGIN
    IF p_mode NOT IN ('practice', 'assessment') THEN
        RAISE EXCEPTION 'Chế độ thi không hợp lệ: %. Chỉ chấp nhận "practice" hoặc "assessment".', p_mode;
    END IF;

    IF jsonb_typeof(p_submissions) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'Dữ liệu nộp bài không hợp lệ: Yêu cầu định dạng JSON Array.';
    END IF;

    v_len := jsonb_array_length(p_submissions);
    IF v_len < 1 OR v_len > 50 THEN
        RAISE EXCEPTION 'Số lượng câu hỏi nộp bài không hợp lệ (% câu). Giới hạn từ 1 đến 50 câu.', v_len;
    END IF;

    -- Kiểm tra phiên thi nếu ở chế độ đánh giá
    IF p_mode = 'assessment' THEN
        IF p_session_token IS NULL OR trim(p_session_token) = '' THEN
            RAISE EXCEPTION 'Chế độ đánh giá yêu cầu mã token phiên thi hợp lệ do giáo viên cấp.';
        END IF;

        SELECT * INTO v_session_record
        FROM public.quiz_sessions
        WHERE session_token = p_session_token
        FOR UPDATE;

        IF v_session_record.id IS NULL THEN
            RAISE EXCEPTION 'Phiên thi không tồn tại trên hệ thống.';
        END IF;

        IF v_session_record.status = 'completed' THEN
            RAISE EXCEPTION 'Bài kiểm tra này đã được nộp và ghi nhận kết quả trước đó. Không được nộp lại.';
        END IF;

        -- Xử lý an toàn khi hết hạn mà không gây rollback mất dấu vết
        IF now() > v_session_record.expires_at THEN
            UPDATE public.quiz_sessions SET status = 'expired' WHERE id = v_session_record.id;
            RAISE EXCEPTION 'Phiên thi đã hết thời gian làm bài quy định.';
        END IF;
    END IF;

    -- Duyệt từng câu hỏi: CHỐNG GỬI TRÙNG QUESTION_ID
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submissions)
    LOOP
        BEGIN
            v_q_id := (v_item->>'question_id')::uuid;
            v_selected_idx := (v_item->>'selected_index')::int;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'Cú pháp câu hỏi không hợp lệ: %', v_item;
        END;

        IF v_q_id = ANY(v_seen_ids) THEN
            RAISE EXCEPTION 'Phát hiện câu hỏi bị gửi lặp lại trong bài nộp: %', v_q_id;
        END IF;
        v_seen_ids := array_append(v_seen_ids, v_q_id);

        IF v_selected_idx < 0 OR v_selected_idx > 3 THEN
            RAISE EXCEPTION 'Lựa chọn đáp án ngoài phạm vi hợp lệ (0-3): %', v_selected_idx;
        END IF;

        SELECT qa.correct_index, qa.explanation 
        INTO v_correct_idx, v_explanation
        FROM public.quiz_answers qa
        JOIN public.quiz_questions qq ON qa.question_id = qq.id
        WHERE qq.id = v_q_id AND qq.is_active = true;

        IF v_correct_idx IS NOT NULL THEN
            v_total := v_total + 1;
            v_is_correct := (v_selected_idx = v_correct_idx);
            IF v_is_correct THEN
                v_score := v_score + 1;
            END IF;

            v_results := v_results || jsonb_build_object(
                'question_id', v_q_id,
                'is_correct', v_is_correct,
                'correct_index', v_correct_idx,
                'explanation', v_explanation
            );
        END IF;
    END LOOP;

    -- Cập nhật phiên thi hoàn thành
    IF p_mode = 'assessment' AND v_total > 0 THEN
        UPDATE public.quiz_sessions 
        SET status = 'completed'
        WHERE id = v_session_record.id;

        INSERT INTO public.quiz_attempts (
            session_id, mode, student_name, student_class,
            total_questions, correct_count, score_percentage
        ) VALUES (
            v_session_record.id, 'assessment', 
            v_session_record.student_name, v_session_record.student_class,
            v_total, v_score, round((v_score::numeric / v_total::numeric) * 100, 2)
        );
    END IF;

    RETURN jsonb_build_object(
        'score', v_score,
        'total', v_total,
        'percentage', CASE WHEN v_total > 0 THEN round((v_score::numeric / v_total::numeric) * 100, 2) ELSE 0 END,
        'results', v_results
    );
END;
$$;

-- PHÂN QUYỀN EXECUTE CHẶT CHẼ
REVOKE ALL ON FUNCTION public.create_quiz_assessment_session(VARCHAR, VARCHAR, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_quiz_assessment_session(VARCHAR, VARCHAR, INT) TO authenticated;

REVOKE ALL ON FUNCTION public.join_quiz_assessment_session(VARCHAR, VARCHAR, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_quiz_assessment_session(VARCHAR, VARCHAR, VARCHAR) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.verify_quiz_submission(JSONB, VARCHAR, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_quiz_submission(JSONB, VARCHAR, VARCHAR) TO anon, authenticated;
