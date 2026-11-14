-- ==============================================================================
-- 002_rbac_tables.sql
-- MỤC ĐÍCH: Thiết lập các bảng phục vụ quản lý người dùng và phân quyền RBAC
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

SET search_path = public, auth, pg_temp;

-- 1. BẢNG PROFILES (Mở rộng từ auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    department VARCHAR(100) NOT NULL DEFAULT 'Trường THCS Nguyễn Trung Trực',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 2. BẢNG ROLES (4 vai trò hệ thống)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL CHECK (code IN ('super_admin', 'admin', 'editor', 'viewer')),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. BẢNG PERMISSIONS
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

-- 4. BẢNG ROLE_PERMISSIONS (Quan hệ N-N)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. BẢNG USER_ROLES (Gán vai trò cho người dùng)
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
