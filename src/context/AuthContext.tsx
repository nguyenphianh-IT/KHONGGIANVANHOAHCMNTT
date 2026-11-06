import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  department?: string;
  status: 'active' | 'suspended';
}

export interface UserRoleInfo {
  code: 'super_admin' | 'admin' | 'editor' | 'viewer';
  name: string;
}

export interface SandboxPersona {
  id: string;
  email: string;
  full_name: string;
  department: string;
  avatar_url: string;
  roles: UserRoleInfo[];
}

// 5 Vai trò Sandbox theo RFC 2606 (.test)
export const SANDBOX_PERSONAS: Record<string, SandboxPersona> = {
  'test-editor-alpha@sandbox.test': {
    id: 'usr-editor-a',
    email: 'test-editor-alpha@sandbox.test',
    full_name: 'Biên Tập Viên A (Thầy Lịch sử)',
    department: 'Tổ Khoa học Xã hội & Lịch sử',
    avatar_url: '👨‍🏫',
    roles: [{ code: 'editor', name: 'Biên tập viên nội dung' }],
  },
  'test-editor-beta@sandbox.test': {
    id: 'usr-editor-b',
    email: 'test-editor-beta@sandbox.test',
    full_name: 'Biên Tập Viên B (Cô Ngữ văn)',
    department: 'Tổ Ngữ văn & Giáo dục công dân',
    avatar_url: '👩‍🏫',
    roles: [{ code: 'editor', name: 'Biên tập viên nội dung' }],
  },
  'test-admin-chief@sandbox.test': {
    id: 'usr-admin-chief',
    email: 'test-admin-chief@sandbox.test',
    full_name: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    department: 'Ban Giám Hiệu THCS Nguyễn Trung Trực',
    avatar_url: '🏛️',
    roles: [{ code: 'admin', name: 'Cán bộ quản trị (Duyệt bài 4 mắt)' }],
  },
  'test-superadmin@sandbox.test': {
    id: 'usr-superadmin',
    email: 'test-superadmin@sandbox.test',
    full_name: 'Quản Trị Viên Tối Cao (Super Admin)',
    department: 'Ban Quản Trị Hệ Thống Số HCM',
    avatar_url: '🛡️',
    roles: [
      { code: 'super_admin', name: 'Quản trị viên tối cao' },
      { code: 'admin', name: 'Quản trị viên hệ thống' },
      { code: 'editor', name: 'Biên tập viên cấp cao' },
    ],
  },
  'test-student-01@sandbox.test': {
    id: 'usr-student-01',
    email: 'test-student-01@sandbox.test',
    full_name: 'Người Học Thử Nghiệm 01 (Học sinh)',
    department: 'Khối 8 - Lớp 8A1',
    avatar_url: '🎒',
    roles: [{ code: 'viewer', name: 'Người học & Khách tham quan' }],
  },
};

const createMockUser = (id: string, email: string, fullName: string): User => ({
  id,
  app_metadata: { provider: 'sandbox', providers: ['sandbox'] },
  user_metadata: { full_name: fullName },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: '',
  email_change_sent_at: '',
  new_email: '',
  invited_at: '',
  action_link: '',
  email,
  phone: '',
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: '',
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  identities: [],
  factors: [],
});

const createMockSession = (user: User): Session => ({
  access_token: `sandbox-access-token-${user.id}`,
  token_type: 'bearer',
  expires_in: 86400 * 30,
  expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
  refresh_token: `sandbox-refresh-token-${user.id}`,
  user,
});

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRoleInfo[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  hasRole: (roleCode: 'super_admin' | 'admin' | 'editor' | 'viewer') => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRoleInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfileAndRoles = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      // 1. Lấy thông tin hồ sơ
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, department, status')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // 2. Lấy danh sách vai trò
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('roles(code, name)')
        .eq('user_id', userId);

      if (rolesData) {
        const parsedRoles: UserRoleInfo[] = [];
        for (const item of rolesData as any[]) {
          if (item.roles) {
            parsedRoles.push({
              code: item.roles.code,
              name: item.roles.name,
            });
          }
        }
        setRoles(parsedRoles);
      }
    } catch (err) {
      console.error('[Lỗi tải thông tin người dùng]', err);
    }
  };

  useEffect(() => {
    // 1. Khôi phục session Sandbox đã lưu nếu có
    try {
      const stored = localStorage.getItem('hcm_sandbox_active_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) {
          setUser(parsed.user);
          setProfile(parsed.profile || null);
          setRoles(parsed.roles || []);
          setSession(parsed.session || null);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('[Khôi phục Sandbox Session thất bại]', e);
    }

    // 2. Nếu Supabase không được cấu hình, kết thúc loading
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 3. Lấy session hiện tại từ Supabase
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfileAndRoles(session.user.id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('[Supabase getSession Error]', err);
        setIsLoading(false);
      });

    // 4. Lắng nghe thay đổi auth từ Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndRoles(session.user.id);
      } else {
        setProfile(null);
        setRoles([]);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ error: Error | null }> => {
    try {
      const normalized = (email || '').trim().toLowerCase();
      if (!normalized) {
        return { error: new Error('Vui lòng nhập email tài khoản!') };
      }

      // 1. Xử lý tài khoản Sandbox (RFC 2606) hoặc chế độ Offline khi Supabase chưa cấu hình
      const isSandboxAccount =
        Boolean(SANDBOX_PERSONAS[normalized]) ||
        normalized.endsWith('@sandbox.test') ||
        normalized.endsWith('.test') ||
        !isSupabaseConfigured;

      if (isSandboxAccount) {
        const persona: SandboxPersona = SANDBOX_PERSONAS[normalized] || {
          id: `usr-${normalized.replace(/[^a-z0-9]/g, '-')}`,
          email: normalized,
          full_name: `Cán Bộ Quản Trị (${normalized.split('@')[0]})`,
          department: 'Môi Trường Thử Nghiệm Sandbox',
          avatar_url: '🛡️',
          roles: [
            { code: 'admin', name: 'Quản trị viên thử nghiệm' },
            { code: 'editor', name: 'Biên tập viên' },
          ],
        };

        const mockUser = createMockUser(persona.id, persona.email, persona.full_name);
        const mockProfile: UserProfile = {
          id: persona.id,
          full_name: persona.full_name,
          avatar_url: persona.avatar_url,
          department: persona.department,
          status: 'active',
        };
        const mockSession = createMockSession(mockUser);

        setUser(mockUser);
        setProfile(mockProfile);
        setRoles(persona.roles);
        setSession(mockSession);

        try {
          localStorage.setItem(
            'hcm_sandbox_active_user',
            JSON.stringify({
              user: mockUser,
              profile: mockProfile,
              roles: persona.roles,
              session: mockSession,
            })
          );
        } catch (e) {
          console.warn('[LocalStorage Warning]', e);
        }

        return { error: null };
      }

      // 2. Nếu Supabase đã cấu hình và không phải tài khoản Sandbox, gọi Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password: pass,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        await fetchProfileAndRoles(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      console.error('[Lỗi Đăng Nhập]', err);
      return { error: new Error(err?.message || 'Lỗi kết nối máy chủ xác thực.') };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('hcm_sandbox_active_user');
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Supabase signOut error]', err);
      }
    }

    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (roleCode: 'super_admin' | 'admin' | 'editor' | 'viewer') => {
    if (roles.some((r) => r.code === 'super_admin')) return true;
    return roles.some((r) => r.code === roleCode);
  };

  const refreshProfile = async () => {
    if (user && isSupabaseConfigured) {
      await fetchProfileAndRoles(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        isLoading,
        login,
        logout,
        hasRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
