-- ==============================================================================
-- 019_fix_staff_auth_and_profiles.sql (BẢN CHUẨN HÓA TOÀN DIỆN SCHEMA GOTRUE)
-- MỤC ĐÍCH: 
-- 1. Sửa triệt để lỗi "500: Database error querying schema" của Supabase GoTrue.
--    NGUYÊN NHÂN GỐC RỄ CHÍNH XÁC:
--    GoTrue (viết bằng Go) thực hiện `sql.Scan` các cột token dạng chuỗi trong auth.users
--    (recovery_token, email_change, email_change_token_current, reauthentication_token...).
--    Trong Go, driver CSDL KHÔNG CHO PHÉP chuyển đổi NULL sang string.
--    Khi các cột này bị NULL (do chèn SQL thủ công), GoTrue sập với lỗi:
--    "converting NULL to string is unsupported" -> trả về HTTP 500 "Database error querying schema".
-- 2. Khắc phục toàn bộ các cột NULL thành chuỗi rỗng '' cho TẤT CẢ người dùng.
-- 3. Đặt mật khẩu chính xác cho tài khoản cán bộ npanh7@gmail.com (Ntt@2026) và xác thực email.
-- 4. Đảm bảo bản ghi auth.identities có đầy đủ id (UUID) và provider_id (TEXT).
-- 5. Cập nhật trigger RBAC cho phép admin toàn quyền quản trị cán bộ.
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

BEGIN;

SET search_path = public, auth, extensions, pg_temp;

-- ------------------------------------------------------------------------------
-- PHẦN 1: DỌN DẸP TRIỆT ĐỂ GIÁ TRỊ NULL TRONG AUTH.USERS (SỬA LỖI 500 GOTRUE)
-- ------------------------------------------------------------------------------

UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  is_super_admin = COALESCE(is_super_admin, false),
  is_sso_user = COALESCE(is_sso_user, false),
  is_anonymous = COALESCE(is_anonymous, false),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now();

-- ------------------------------------------------------------------------------
-- PHẦN 2: THIẾT LẬP MẬT KHẨU CHÍNH THỨC CHO TÀI KHOẢN GIÁO VIÊN npanh7@gmail.com
-- ------------------------------------------------------------------------------

UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('Ntt@2026', extensions.gen_salt('bf')),
  email_confirmed_at = now(),
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change = '',
  phone_change = '',
  phone_change_token = '',
  email_change_token_current = '',
  reauthentication_token = '',
  is_super_admin = false,
  is_sso_user = false,
  is_anonymous = false,
  updated_at = now()
WHERE lower(email) = 'npanh7@gmail.com';

-- ------------------------------------------------------------------------------
-- PHẦN 3: ĐỒNG BỘ AUTH.IDENTITIES ĐẦY ĐỦ (ID UUID + PROVIDER_ID TEXT)
-- ------------------------------------------------------------------------------

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
    u.id,
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
)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- PHẦN 4: CẬP NHẬT TRIGGER PHÂN QUYỀN VÀ TRẠNG THÁI HỒ SƠ (RBAC FIX)
-- ------------------------------------------------------------------------------

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

-- Đồng bộ email vào public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

UPDATE public.profiles p
SET email = lower(u.email),
    status = 'active',
    updated_at = now()
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '' OR p.status != 'active');

-- ------------------------------------------------------------------------------
-- PHẦN 5: HÀM TẠO TÀI KHOẢN CÁN BỘ / GIÁO VIÊN KHÔNG BAO GIỜ BỊ LỖI NULL STRING
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

    SELECT id INTO v_role_id FROM public.roles WHERE code = v_role_code;
    IF v_role_id IS NULL THEN
        SELECT id INTO v_role_id FROM public.roles WHERE code = 'editor';
    END IF;

    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_clean_email;

    v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));

    IF v_user_id IS NOT NULL THEN
        v_is_existing := true;
        UPDATE auth.users
        SET encrypted_password = v_encrypted_pw,
            updated_at = now(),
            raw_user_meta_data = jsonb_build_object(
                'full_name', v_clean_name,
                'department', v_clean_dept
            ),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            confirmation_token = COALESCE(confirmation_token, ''),
            recovery_token = COALESCE(recovery_token, ''),
            email_change_token_new = COALESCE(email_change_token_new, ''),
            email_change = COALESCE(email_change, ''),
            phone_change = COALESCE(phone_change, ''),
            phone_change_token = COALESCE(phone_change_token, ''),
            email_change_token_current = COALESCE(email_change_token_current, ''),
            reauthentication_token = COALESCE(reauthentication_token, ''),
            is_super_admin = COALESCE(is_super_admin, false),
            is_sso_user = COALESCE(is_sso_user, false),
            is_anonymous = COALESCE(is_anonymous, false)
        WHERE id = v_user_id;
    ELSE
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
            email_change_token_current,
            phone_change,
            phone_change_token,
            reauthentication_token,
            is_super_admin,
            is_sso_user,
            is_anonymous
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
            '',
            '',
            '',
            '',
            false,
            false,
            false
        );
    END IF;

    -- auth.identities
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
            v_user_id,
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

    -- public.profiles
    INSERT INTO public.profiles (id, full_name, department, status, email, updated_at)
    VALUES (v_user_id, v_clean_name, v_clean_dept, 'active', v_clean_email, now())
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        department = EXCLUDED.department,
        status = 'active',
        email = EXCLUDED.email,
        updated_at = now();

    -- public.user_roles
    IF v_role_id IS NOT NULL THEN
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        INSERT INTO public.user_roles (user_id, role_id, assigned_by, assigned_at)
        VALUES (v_user_id, v_role_id, COALESCE(auth.uid(), v_user_id), now());
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'email', v_clean_email,
        'full_name', v_clean_name,
        'department', v_clean_dept,
        'role', v_role_code,
        'is_existing', v_is_existing,
        'message', 'Đã lưu tài khoản cán bộ thành công trên Database Cloud'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_create_staff_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role, anon;

-- ------------------------------------------------------------------------------
-- PHẦN 6: HÀM ĐẶT LẠI MẬT KHẨU CÁN BỘ (ADMIN_RESET_STAFF_PASSWORD)
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

    UPDATE auth.users
    SET encrypted_password = v_encrypted_pw,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        confirmation_token = COALESCE(confirmation_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        reauthentication_token = COALESCE(reauthentication_token, ''),
        updated_at = now()
    WHERE id = p_user_id;

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
            p_user_id,
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
        );
    EXCEPTION WHEN unique_violation THEN
        UPDATE auth.identities
        SET identity_data = jsonb_build_object(
                'sub', p_user_id::text,
                'email', lower(v_user.email),
                'email_verified', true,
                'phone_verified', false
            ),
            updated_at = now()
        WHERE user_id = p_user_id AND provider = 'email';
    WHEN OTHERS THEN
        NULL;
    END;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Đã cập nhật mật khẩu thành công trên Database Cloud'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_reset_staff_password(UUID, TEXT) TO authenticated, service_role, anon;

COMMIT;
