import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndRoles(session.user.id);
      }
      setIsLoading(false);
    });

    // Lắng nghe thay đổi auth
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

  const login = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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
      return { error: err };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (roleCode: 'super_admin' | 'admin' | 'editor' | 'viewer') => {
    return roles.some((r) => r.code === roleCode);
  };

  const refreshProfile = async () => {
    if (user) {
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
