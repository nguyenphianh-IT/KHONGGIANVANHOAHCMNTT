-- ==============================================================================
-- 004_bootstrap_super_admin.sql
-- MỤC ĐÍCH: Khởi tạo tài khoản Super Admin đầu tiên, chống race condition, chỉ chạy 1 lần
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

CREATE OR REPLACE FUNCTION public.bootstrap_super_admin(p_target_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
    v_count INT;
BEGIN
    -- 1. CHỐNG RACE CONDITION: Khóa giao dịch độc quyền với Advisory Lock
    PERFORM pg_advisory_xact_lock(hashtext('bootstrap_super_admin_singleton_lock'));

    -- 2. Kiểm tra xem hệ thống đã có Super Admin nào chưa
    SELECT COUNT(*) INTO v_count
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.code = 'super_admin';

    IF v_count > 0 THEN
        RAISE EXCEPTION 'Hệ thống đã có Super Admin (% tài khoản). Cơ chế khởi tạo bị khóa hoàn toàn vì lý do bảo mật.', v_count;
    END IF;

    -- 3. Kiểm tra định dạng email
    IF p_target_email IS NULL OR p_target_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Địa chỉ email không hợp lệ: %', p_target_email;
    END IF;

    -- 4. Tìm ID tài khoản từ auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE lower(email) = lower(trim(p_target_email));

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy người dùng có email: "%". Vui lòng tạo tài khoản trên hệ thống Auth trước.', p_target_email;
    END IF;

    -- 5. Đảm bảo profiles tồn tại và ở trạng thái active
    INSERT INTO public.profiles (id, full_name, department, status)
    VALUES (v_user_id, 'Quản Trị Viên Tối Cao', 'Ban Giám Hiệu', 'active')
    ON CONFLICT (id) DO UPDATE SET status = 'active';

    -- 6. Lấy ID của vai trò super_admin
    SELECT id INTO v_role_id FROM public.roles WHERE code = 'super_admin';

    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'Vai trò "super_admin" chưa được nạp trong bảng roles.';
    END IF;

    -- 7. Gán vai trò Super Admin
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (v_user_id, v_role_id, v_user_id);

    -- 8. Ghi nhật ký kiểm toán hệ thống
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (v_user_id, 'BOOTSTRAP_SUPER_ADMIN', 'user_roles', v_user_id, 
            jsonb_build_object('email', p_target_email, 'timestamp', now()));

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Khởi tạo Super Admin thành công. Hệ thống đã khóa vĩnh viễn cơ chế bootstrap.',
        'user_id', v_user_id
    );
END;
$$;

-- Thu hồi toàn bộ quyền khỏi PUBLIC, anon và authenticated
REVOKE ALL ON FUNCTION public.bootstrap_super_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_super_admin(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.bootstrap_super_admin(TEXT) FROM authenticated;

-- CHỈ CẤP QUYỀN DUY NHẤT CHO service_role (Thực thi qua Supabase SQL Editor / CLI nội bộ)
GRANT EXECUTE ON FUNCTION public.bootstrap_super_admin(TEXT) TO service_role;
