-- ==============================================================================
-- 003_rbac_security_functions_and_triggers.sql
-- MỤC ĐÍCH: Các hàm kiểm tra phân quyền bảo mật, chống đệ quy RLS và chống leo thang quyền
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. HÀM KIỂM TRA TÀI KHOẢN ĐANG HOẠT ĐỘNG (Xử lý an toàn khi auth.uid() là NULL)
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
    SELECT CASE 
        WHEN auth.uid() IS NULL THEN false
        ELSE EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND status = 'active'
        )
    END;
$$;

-- 2. HÀM KIỂM TRA VAI TRÒ NGƯỜI DÙNG (Bỏ qua RLS để chống vòng lặp đệ quy)
CREATE OR REPLACE FUNCTION public.has_role(p_role_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
    SELECT CASE 
        WHEN auth.uid() IS NULL THEN false
        ELSE EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            JOIN public.profiles p ON ur.user_id = p.id
            WHERE ur.user_id = auth.uid() 
              AND r.code = p_role_code
              AND p.status = 'active'
        )
    END;
$$;

REVOKE ALL ON FUNCTION public.is_active_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated, anon;

REVOKE ALL ON FUNCTION public.has_role(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated, anon;

-- 3. TRIGGER CHỐNG LEO THANG ĐẶC QUYỀN (Admin không được tự phong Super Admin)
CREATE OR REPLACE FUNCTION public.check_role_assignment_hierarchy()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_caller_is_super BOOLEAN;
    v_target_role_code VARCHAR;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.code = 'super_admin'
    ) INTO v_caller_is_super;

    SELECT code INTO v_target_role_code FROM public.roles WHERE id = NEW.role_id;

    -- Nếu không phải Super Admin mà cố gán super_admin hoặc admin -> CHẶN
    IF NOT v_caller_is_super AND v_target_role_code IN ('super_admin', 'admin') THEN
        RAISE EXCEPTION 'Vi phạm phân quyền: Admin không được phép nâng cấp tài khoản lên Admin hoặc Super Admin. Thao tác chỉ dành riêng cho Super Admin.';
    END IF;

    NEW.assigned_by := auth.uid();
    NEW.assigned_at := now();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_role_escalation ON public.user_roles;
CREATE TRIGGER trg_protect_role_escalation
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.check_role_assignment_hierarchy();

-- 4. TRIGGER BẢO VỆ CỘT BẤT BIẾN TRÊN BẢNG PROFILES (Chặn tự đổi status)
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

    -- Chỉ Super Admin mới có quyền đổi status
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        IF NOT public.has_role('super_admin') THEN
            RAISE EXCEPTION 'Chỉ có Super Admin mới có quyền thay đổi trạng thái tài khoản.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_immutability ON public.profiles;
CREATE TRIGGER trg_enforce_profile_immutability
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_immutability();
