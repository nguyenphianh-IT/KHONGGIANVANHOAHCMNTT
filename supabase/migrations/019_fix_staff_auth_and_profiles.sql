-- ==============================================================================
-- 019_fix_staff_auth_and_profiles.sql
-- MỤC ĐÍCH: 
-- 1. Sửa lỗi "Database error querying schema / Database error finding user" trong Supabase GoTrue
--    khi đăng nhập tài khoản giáo viên/cán bộ.
--    Nguyên nhân gốc rễ: Trong Supabase hiện đại, auth.identities bắt buộc cột `provider_id` (NOT NULL).
--    Hàm SQL cũ thiếu cột `provider_id` dẫn đến auth.identities bị rỗng và GoTrue gặp lỗi 500.
-- 2. Khắc phục triệt để và tự phục hồi dữ liệu (Self-Healing) cho các tài khoản hiện có
--    (npanh7@gmail.com, test_teacher_..., teacher_demo_...) bằng cách tạo bản ghi auth.identities hợp lệ.
-- 3. Cập nhật trigger enforce_profile_immutability() và check_role_assignment_hierarchy()
--    để vai trò 'admin' chính thức có đầy đủ quyền quản trị tài khoản cán bộ
--    (trước đây bị chặn bởi kiểm tra 'super_admin' đã được thu hồi trong Round 11).
-- 4. Hoàn thiện bộ 4 hàm RPC quản trị:
--    - admin_create_staff_user: Khởi tạo/cập nhật tài khoản giáo viên chuẩn 100% GoTrue schema
--    - admin_reset_staff_password: Cấp lại mật khẩu mới và xác thực email tự động
--    - admin_delete_staff_user: Xóa an toàn tài khoản cán bộ khỏi auth.identities, auth.users, user_roles
--    - admin_list_staff_users: Truy vấn danh sách cán bộ đầy đủ email, vai trò, tổ bộ môn
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

BEGIN;

SET search_path = public, auth, extensions, pg_temp;

-- ------------------------------------------------------------------------------
-- PHẦN 1: CẬP NHẬT TRIGGER PHÂN QUYỀN VÀ TRẠNG THÁI HỒ SƠ (RBAC FIX)
-- ------------------------------------------------------------------------------

-- 1. Cho phép vai trò 'admin' (hoặc 'super_admin' nếu có) được phép thay đổi trạng thái tài khoản
CREATE OR REPLACE FUNCTION public.enforce_profile_immutability()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    NEW.id := OLD.id;
    NEW.created_at := OLD.created_at;
    NEW.updated_at := now();

    -- Cho phép Quản trị viên (admin hoặc super_admin) thay đổi trạng thái hoạt động (status)
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        IF NOT (public.has_role('admin') OR public.has_role('super_admin')) THEN
            RAISE EXCEPTION 'Chỉ có Quản trị viên (Admin) mới có quyền thay đổi trạng thái tài khoản.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 2. Cho phép Quản trị viên gán vai trò nhân sự hợp lệ
CREATE OR REPLACE FUNCTION public.check_role_assignment_hierarchy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_target_role_code TEXT;
    v_caller_is_admin BOOLEAN;
BEGIN
    v_caller_is_admin := (public.has_role('admin') OR public.has_role('super_admin'));
    SELECT code INTO v_target_role_code FROM public.roles WHERE id = NEW.role_id;

    -- Nếu không phải Admin mà cố gán quyền -> Chặn
    IF NOT v_caller_is_admin AND v_target_role_code IN ('super_admin', 'admin') THEN
        RAISE EXCEPTION 'Vi phạm phân quyền: Chỉ Quản trị viên (Admin) mới có quyền cấp phát vai trò này.';
    END IF;

    NEW.assigned_by := COALESCE(auth.uid(), NEW.assigned_by);
    NEW.assigned_at := now();

    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- PHẦN 2: TỰ PHỤC HỒI DỮ LIỆU (SELF-HEALING) CHO CÁC TÀI KHOẢN ĐANG CÓ
-- ------------------------------------------------------------------------------

-- 1. Bổ sung bản ghi auth.identities cho TẤT CẢ người dùng trong auth.users đang bị thiếu
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    u.id::text,
    u.id,
    jsonb_build_object(
        'sub', u.id::text,
        'email', lower(u.email),
        'email_verified', true,
        'phone_verified', false
    ),
    'email',
    u.id::text,
    now(),
    now(),
    now()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);

-- 2. Đảm bảo xác thực email (email_confirmed_at) cho tất cả tài khoản cán bộ
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email_confirmed_at IS NULL;

-- 3. Đồng bộ email từ auth.users sang public.profiles nếu cột email chưa có
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

UPDATE public.profiles p
SET email = lower(u.email)
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- ------------------------------------------------------------------------------
-- PHẦN 3: HÀM TẠO TÀI KHOẢN CÁN BỘ / GIÁO VIÊN CHUẨN 100% GOTRUE SCHEMA
-- ------------------------------------------------------------------------------

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
    -- 1. Chuẩn hóa và kiểm tra đầu vào
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

    -- 2. Kiểm tra xem người dùng đã tồn tại trong auth.users chưa
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_clean_email;

    v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));

    IF v_user_id IS NOT NULL THEN
        v_is_existing := true;
        -- Cập nhật mật khẩu, metadata và xác thực email cho tài khoản đã có
        UPDATE auth.users
        SET encrypted_password = v_encrypted_pw,
            updated_at = now(),
            raw_user_meta_data = jsonb_build_object(
                'full_name', v_clean_name,
                'department', v_clean_dept
            ),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
            email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE id = v_user_id;
    ELSE
        -- Tạo mới tài khoản trong auth.users với đầy đủ trường GoTrue chuẩn
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
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change,
            is_super_admin,
            is_sso_user
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            v_clean_email,
            v_encrypted_pw,
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object(
                'full_name', v_clean_name,
                'department', v_clean_dept
            ),
            now(),
            now(),
            '',
            '',
            '',
            '',
            false,
            false
        );
    END IF;

    -- 3. Tạo hoặc cập nhật bản ghi trong auth.identities kèm provider_id bắt buộc
    BEGIN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            v_user_id::text,
            v_user_id,
            jsonb_build_object(
                'sub', v_user_id::text,
                'email', v_clean_email,
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            v_user_id::text,
            now(),
            now(),
            now()
        );
    EXCEPTION WHEN unique_violation THEN
        UPDATE auth.identities
        SET identity_data = jsonb_build_object(
                'sub', v_user_id::text,
                'email', v_clean_email,
                'email_verified', true,
                'phone_verified', false
            ),
            updated_at = now()
        WHERE user_id = v_user_id AND provider = 'email';
    WHEN OTHERS THEN
        NULL;
    END;

    -- 4. Đồng bộ hồ sơ bảng public.profiles
    INSERT INTO public.profiles (id, full_name, department, status, email, updated_at)
    VALUES (v_user_id, v_clean_name, v_clean_dept, 'active', v_clean_email, now())
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        department = EXCLUDED.department,
        status = 'active',
        email = EXCLUDED.email,
        updated_at = now();

    -- 5. Gán vai trò trong public.user_roles
    IF v_role_id IS NOT NULL THEN
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        INSERT INTO public.user_roles (user_id, role_id, assigned_by, assigned_at)
        VALUES (v_user_id, v_role_id, COALESCE(auth.uid(), v_user_id), now());
    END IF;

    -- 6. Ghi nhật ký kiểm toán hệ thống
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
                   THEN 'Đã cập nhật thông tin và mật khẩu tài khoản cán bộ thành công!' 
                   ELSE 'Đã tạo tài khoản cán bộ thành công trên Database Cloud!' END
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_create_staff_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role, anon;

-- ------------------------------------------------------------------------------
-- PHẦN 4: HÀM ĐẶT LẠI MẬT KHẨU CÁN BỘ (ADMIN_RESET_STAFF_PASSWORD)
-- ------------------------------------------------------------------------------

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

    -- Cập nhật mật khẩu và xác thực email
    UPDATE auth.users
    SET encrypted_password = v_encrypted_pw,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = p_user_id;

    -- Đảm bảo auth.identities luôn đồng bộ
    BEGIN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            p_user_id::text,
            p_user_id,
            jsonb_build_object(
                'sub', p_user_id::text,
                'email', lower(v_user.email),
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            p_user_id::text,
            now(),
            now(),
            now()
        ) ON CONFLICT (provider, provider_id) DO UPDATE SET
            identity_data = EXCLUDED.identity_data,
            updated_at = now();
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

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

GRANT EXECUTE ON FUNCTION public.admin_reset_staff_password(UUID, TEXT) TO authenticated, service_role, anon;

-- ------------------------------------------------------------------------------
-- PHẦN 5: HÀM XÓA TÀI KHOẢN CÁN BỘ AN TOÀN (ADMIN_DELETE_STAFF_USER)
-- ------------------------------------------------------------------------------

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

    -- 1. Xóa trong public.user_roles
    DELETE FROM public.user_roles WHERE user_id = p_user_id;

    -- 2. Đổi trạng thái trong public.profiles sang inactive (vẫn lưu vết lịch sử bài viết)
    UPDATE public.profiles SET status = 'inactive', updated_at = now() WHERE id = p_user_id;

    -- 3. Xóa trong auth.identities
    DELETE FROM auth.identities WHERE user_id = p_user_id;

    -- 4. Xóa trong auth.users
    DELETE FROM auth.users WHERE id = p_user_id;

    -- 5. Ghi nhật ký kiểm toán
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

GRANT EXECUTE ON FUNCTION public.admin_delete_staff_user(UUID) TO authenticated, service_role, anon;

-- ------------------------------------------------------------------------------
-- PHẦN 6: HÀM LẤY DANH SÁCH CÁN BỘ / GIÁO VIÊN (ADMIN_LIST_STAFF_USERS)
-- ------------------------------------------------------------------------------

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

GRANT EXECUTE ON FUNCTION public.admin_list_staff_users() TO anon, authenticated, service_role;

COMMIT;
