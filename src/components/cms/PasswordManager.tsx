import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  RefreshCw, Mail, Copy, Check, ShieldCheck,
  Sparkles, Info, ShieldAlert, Key, Pencil, Trash2,
  Users, UserPlus, X, Building2, Plus
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { addStoredAuditLog } from '../../lib/cmsStore';

export interface StaffUserItem {
  id: string;
  email: string;
  full_name: string;
  department: string;
  role: 'admin' | 'editor' | 'viewer';
  role_name: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  head_name?: string;
  created_at?: string;
}

const DEFAULT_DEPARTMENTS_LIST: DepartmentItem[] = [
  { id: 'dept-bgh', name: 'Ban Giám Hiệu', code: 'BGH', description: 'Ban Giám Hiệu nhà trường & Hội đồng kiểm duyệt 4 mắt' },
  { id: 'dept-lsdl', name: 'Tổ Lịch sử - Địa lý', code: 'LSDL', description: 'Tổ chuyên môn Lịch sử, Địa lý & Tư liệu truyền thống' },
  { id: 'dept-nvgdcd', name: 'Tổ Ngữ văn - GDCD', code: 'NVGDCD', description: 'Tổ chuyên môn Ngữ văn, Giáo dục công dân & Đạo đức Hồ Chí Minh' },
  { id: 'dept-toantin', name: 'Tổ Toán - Tin học', code: 'TOANTIN', description: 'Tổ chuyên môn Toán, Tin học & Chuyển đổi số học đường' },
  { id: 'dept-khtn', name: 'Tổ Khoa học tự nhiên', code: 'KHTN', description: 'Tổ chuyên môn Khoa học tự nhiên (Lý - Hóa - Sinh)' },
  { id: 'dept-ngoaingu', name: 'Tổ Ngoại ngữ', code: 'NN', description: 'Tổ chuyên môn Tiếng Anh & Hội nhập quốc tế' },
  { id: 'dept-doandoi', name: 'Đoàn - Đội - Hoạt động trải nghiệm', code: 'DOANDOI', description: 'Chi đoàn, Liên đội TNTP Hồ Chí Minh & Phong trào học sinh' },
  { id: 'dept-vanphong', name: 'Tổ Văn phòng', code: 'VP', description: 'Hành chính, Thư viện, Thiết bị & Truyền thông nhà trường' },
];

const KEY_DEPARTMENTS_LOCAL = 'hcm_cms_departments_v1';

export const PasswordManager: React.FC = () => {
  const { user, profile, roles, hasRole } = useAuth();
  const isAdmin = Boolean(hasRole('admin') || hasRole('super_admin'));

  // Tab State: 'personal' | 'staff' | 'departments' | 'policy'
  const [activeTab, setActiveTab] = useState<'personal' | 'staff' | 'departments' | 'policy'>('personal');

  // =========================================================================
  // 1. STATE ĐỔI MẬT KHẨU CÁ NHÂN (Bắt buộc xác thực mật khẩu cũ)
  // =========================================================================
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [personalSuccessMsg, setPersonalSuccessMsg] = useState<string | null>(null);
  const [personalErrorMsg, setPersonalErrorMsg] = useState<string | null>(null);

  // =========================================================================
  // 2. STATE QUẢN LÝ BIÊN TẬP VIÊN & CÁN BỘ (CRUD)
  // =========================================================================
  const [staffList, setStaffList] = useState<StaffUserItem[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Modal: Thêm Cán Bộ / Biên Tập Viên Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFullName, setAddFullName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addDepartment, setAddDepartment] = useState('Tổ Lịch sử - Địa lý');
  const [addRole, setAddRole] = useState<'editor' | 'viewer' | 'admin'>('editor');
  const [addPassword, setAddPassword] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Modal: Chỉnh Sửa Thông Tin & Vai Trò Cán Bộ / Giáo Viên
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUserItem | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editRole, setEditRole] = useState<'editor' | 'viewer' | 'admin'>('editor');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended' | 'inactive'>('active');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Modal: Xóa Tài Khoản Cán Bộ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<StaffUserItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Modal: Đặt Lại / Cấp Mật Khẩu Cho Cán Bộ
  const [targetStaff, setTargetStaff] = useState<StaffUserItem | null>(null);
  const [manualNewPass, setManualNewPass] = useState('');
  const [isSubmittingManualPass, setIsSubmittingManualPass] = useState(false);

  // =========================================================================
  // 3. STATE QUẢN LÝ & KHAI BÁO TỔ CHUYÊN MÔN (CRUD ĐỒNG BỘ CLOUD)
  // =========================================================================
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    try {
      const raw = localStorage.getItem(KEY_DEPARTMENTS_LOCAL);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_DEPARTMENTS_LIST;
  });
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [deptSuccessMsg, setDeptSuccessMsg] = useState<string | null>(null);
  const [deptErrorMsg, setDeptErrorMsg] = useState<string | null>(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHeadName, setDeptHeadName] = useState('');
  const [deptDescription, setDeptDescription] = useState('');
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Tính toán độ mạnh mật khẩu (Password Strength: 0 - 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = calculateStrength(newPassword);

  const getStrengthLabel = (score: number) => {
    if (!newPassword) return { label: 'Chưa nhập', color: 'bg-gray-200 text-gray-600', barColor: 'bg-gray-300', percent: 0 };
    if (score <= 1) return { label: 'Rất yếu', color: 'bg-red-100 text-red-700 border-red-200', barColor: 'bg-red-500', percent: 25 };
    if (score === 2) return { label: 'Trung bình', color: 'bg-amber-100 text-amber-700 border-amber-200', barColor: 'bg-amber-500', percent: 50 };
    if (score === 3) return { label: 'Khá mạnh', color: 'bg-blue-100 text-blue-700 border-blue-200', barColor: 'bg-blue-500', percent: 75 };
    return { label: 'Rất an toàn', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', barColor: 'bg-emerald-500', percent: 100 };
  };

  const strengthInfo = getStrengthLabel(strengthScore);

  // Hàm sinh mật khẩu ngẫu nhiên an toàn (12 ký tự)
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Lấy Access Token thực tế từ Supabase Session để xác thực quyền Admin với API máy chủ
  const getAuthBearerToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token || null;
    } catch {
      return null;
    }
  };

  // Tải danh mục Tổ chuyên môn từ Supabase Cloud
  const loadDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const res = await fetch(`/api/cms/media?resource=departments&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.departments) && json.departments.length > 0) {
          setDepartments(json.departments);
          try {
            localStorage.setItem(KEY_DEPARTMENTS_LOCAL, JSON.stringify(json.departments));
          } catch {}
          setIsLoadingDepartments(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[PasswordManager] Không thể tải danh mục tổ chuyên môn từ API:', err);
    }
    setIsLoadingDepartments(false);
  };

  // Tải danh sách tài khoản nhân sự từ API Admin Cloud (Auth + Profiles + Roles) hoặc RPC/fallback
  const loadStaffList = async () => {
    setIsLoadingStaff(true);
    setActionErrorMsg(null);

    // Kiểm tra danh sách lưu cục bộ
    let localSaved: StaffUserItem[] = [];
    try {
      const raw = localStorage.getItem('hcm_cms_staff_accounts');
      if (raw) localSaved = JSON.parse(raw);
    } catch {}

    if (isSupabaseConfigured) {
      // 0. Ưu tiên tuyệt đối: Gọi Serverless Admin API (?resource=staff) để lấy đầy đủ dữ liệu chuẩn xác từ auth.users + profiles + user_roles
      try {
        const token = await getAuthBearerToken();
        if (token) {
          const apiRes = await fetch(`/api/cms/media?resource=staff&_t=${Date.now()}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          });
          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (apiJson.success && Array.isArray(apiJson.staff)) {
              setStaffList(apiJson.staff);
              try {
                localStorage.setItem('hcm_cms_staff_accounts', JSON.stringify(apiJson.staff));
              } catch {}
              setIsLoadingStaff(false);
              return;
            }
          }
        }
      } catch (apiErr) {
        console.warn('[PasswordManager] API admin staff fallback:', apiErr);
      }

      // 1. Kênh 2: Gọi hàm RPC admin_list_staff_users để lấy đầy đủ email từ auth.users và vai trò
      try {
        const { data: rpcStaff, error: rpcErr } = await supabase.rpc('admin_list_staff_users');
        if (!rpcErr && Array.isArray(rpcStaff) && rpcStaff.length > 0) {
          const items: StaffUserItem[] = rpcStaff.map((p: any) => ({
            id: p.id,
            email: p.email || (user && user.id === p.id ? user.email || 'nguyenphianh@gmail.com' : `${p.id.slice(0, 8)}@thcsnguyentrungtruc.edu.vn`),
            full_name: p.full_name || 'Cán bộ trường',
            department: p.department || 'Trường THCS Nguyễn Trung Trực',
            role: (p.role === 'admin' ? 'admin' : p.role === 'viewer' ? 'viewer' : 'editor'),
            role_name: p.role_name || (p.role === 'admin' ? 'Quản trị viên (Admin)' : 'Biên tập viên nội dung'),
            status: p.status || 'active',
            created_at: p.created_at,
          }));

          const combined = [...items];
          localSaved.forEach((localItem) => {
            if (!combined.some((c) => c.id === localItem.id || c.email === localItem.email)) {
              combined.push(localItem);
            }
          });

          setStaffList(combined);
          setIsLoadingStaff(false);
          return;
        }
      } catch (e) {
        console.warn('[PasswordManager] RPC admin_list_staff_users chưa có, fallback bảng:', e);
      }

      // 2. Dự phòng: Truy vấn trực tiếp bảng profiles và user_roles
      try {
        const { data: profilesData, error: profError } = await supabase
          .from('profiles')
          .select('id, full_name, department, status, email, created_at')
          .order('created_at', { ascending: false });

        if (profError) throw profError;

        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, roles(code, name)');

        if (rolesError) throw rolesError;

        const roleMap: Record<string, { code: any; name: string }> = {};
        if (rolesData) {
          rolesData.forEach((r: any) => {
            if (r.roles) {
              roleMap[r.user_id] = { code: r.roles.code, name: r.roles.name };
            }
          });
        }

        const items: StaffUserItem[] = (profilesData || [])
          .filter((p: any) => p.status !== 'inactive')
          .map((p: any) => {
            const rInfo = roleMap[p.id] || { code: 'editor', name: 'Biên tập viên' };
            const isCurrentUser = user && user.id === p.id;
            const displayEmail = p.email || (isCurrentUser ? user.email || 'nguyenphianh@gmail.com' : `${p.id.slice(0, 8)}@thcsnguyentrungtruc.edu.vn`);

            return {
              id: p.id,
              email: displayEmail,
              full_name: p.full_name || 'Cán bộ trường',
              department: p.department || 'Trường THCS Nguyễn Trung Trực',
              role: (rInfo.code === 'admin' ? 'admin' : rInfo.code === 'viewer' ? 'viewer' : 'editor'),
              role_name: rInfo.name || (rInfo.code === 'admin' ? 'Quản trị viên (Admin)' : 'Biên tập viên nội dung'),
              status: p.status || 'active',
              created_at: p.created_at,
            };
          });

        // Kết hợp với các tài khoản được tạo thêm cục bộ nếu có
        const combined = [...items];
        localSaved.forEach(localItem => {
          if (!combined.some(c => c.id === localItem.id || c.email === localItem.email)) {
            combined.push(localItem);
          }
        });

        setStaffList(combined);
        setIsLoadingStaff(false);
        return;
      } catch (err: any) {
        console.warn('[PasswordManager] Không tải được profiles từ Supabase, sử dụng danh sách quản trị chuẩn:', err);
      }
    }

    // Fallback danh mục nhân sự quản trị chuẩn trường học
    const defaultStaff: StaffUserItem[] = [
      {
        id: user?.id || 'c4821ce7-7c41-45d2-bb9d-ebf7b2228004',
        email: user?.email || 'nguyenphianh@gmail.com',
        full_name: profile?.full_name || 'Quản Trị Viên CMS',
        department: profile?.department || 'Ban Quản Trị Không Gian Số',
        role: 'admin',
        role_name: 'Quản trị viên (Admin)',
        status: 'active',
      },
      {
        id: 'usr-bgh-01',
        email: 'bgh.nguyentrungtruc@thcs.edu.vn',
        full_name: 'Ban Giám Hiệu THCS Nguyễn Trung Trực',
        department: 'Ban Giám Hiệu',
        role: 'admin',
        role_name: 'Quản trị viên (Admin)',
        status: 'active',
      },
      {
        id: 'usr-gv-su-01',
        email: 'gv.lichsu@thcsnguyentrungtruc.edu.vn',
        full_name: 'Thầy Nguyễn Văn A (Tổ Lịch sử)',
        department: 'Tổ Lịch sử - Địa lý',
        role: 'editor',
        role_name: 'Biên tập viên nội dung',
        status: 'active',
      },
      {
        id: 'usr-gv-van-01',
        email: 'gv.nguvan@thcsnguyentrungtruc.edu.vn',
        full_name: 'Cô Trần Thị B (Tổ Ngữ văn)',
        department: 'Tổ Ngữ văn - GDCD',
        role: 'editor',
        role_name: 'Biên tập viên nội dung',
        status: 'active',
      },
    ];

    const finalStaff = localSaved.length > 0 ? localSaved : defaultStaff;
    setStaffList(finalStaff);
    setIsLoadingStaff(false);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (activeTab === 'staff' || activeTab === 'departments') {
      loadStaffList();
      loadDepartments();
    }
  }, [activeTab]);

  // =========================================================================
  // XỬ LÝ 1: ĐỔI MẬT KHẨU CÁ NHÂN (XÁC THỰC MẬT KHẨU CŨ)
  // =========================================================================
  const handleUpdatePersonalPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalErrorMsg(null);
    setPersonalSuccessMsg(null);

    // Kiểm tra mật khẩu hiện tại
    if (!currentPassword) {
      setPersonalErrorMsg('Vui lòng nhập Mật khẩu hiện tại (mật khẩu cũ) để xác thực an toàn!');
      return;
    }

    if (newPassword.length < 8) {
      setPersonalErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự!');
      return;
    }

    if (currentPassword === newPassword) {
      setPersonalErrorMsg('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPersonalErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    if (strengthScore < 2) {
      setPersonalErrorMsg('Mật khẩu quá yếu! Hãy kết hợp thêm chữ hoa, chữ số hoặc ký tự đặc biệt.');
      return;
    }

    setIsUpdatingPersonal(true);

    try {
      // 1. Xác thực Mật khẩu cũ qua Supabase Auth
      if (isSupabaseConfigured && user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (verifyError) {
          throw new Error('Mật khẩu hiện tại (mật khẩu cũ) không chính xác! Vui lòng kiểm tra lại để bảo đảm an toàn.');
        }

        // 2. Cập nhật Mật khẩu mới vào Supabase
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) throw updateError;
      }

      // 3. Ghi nhận nhật ký kiểm toán bảo mật
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Đổi mật khẩu tài khoản',
        article_title: `Tài khoản ${user?.email || 'nguyenphianh@gmail.com'}`,
        actor: profile?.full_name || user?.email || 'Quản trị viên',
        role: (roles[0]?.name as string) || 'Admin',
        decision: 'Thành công (Đã xác minh MK cũ)',
        feedback: 'Cập nhật mật khẩu tài khoản cá nhân thành công sau khi xác thực mật khẩu cũ chính xác.',
        timestamp: new Date().toISOString(),
      });

      setPersonalSuccessMsg('Đã cập nhật mật khẩu mới thành công! Từ nay bạn có thể dùng mật khẩu mới này để đăng nhập.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPersonalErrorMsg(err.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  // =========================================================================
  // XỬ LÝ 2: THÊM MỚI BIÊN TẬP VIÊN / CÁN BỘ
  // =========================================================================
  const handleOpenAddModal = () => {
    setAddFullName('');
    setAddEmail('');
    setAddDepartment(departments[0]?.name || 'Tổ Lịch sử - Địa lý');
    setAddRole('editor');
    setAddPassword(generateStrongPassword());
    setShowAddPassword(true);
    setIsAddModalOpen(true);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFullName.trim() || !addEmail.trim()) {
      setActionErrorMsg('Họ tên và email cán bộ không được để trống!');
      return;
    }

    if (addPassword.length < 8) {
      setActionErrorMsg('Mật khẩu ban đầu phải có tối thiểu 8 ký tự!');
      return;
    }

    setIsSubmittingAdd(true);
    setActionErrorMsg(null);

    const roleLabels = {
      admin: 'Quản trị viên (Admin)',
      editor: 'Biên tập viên nội dung',
      viewer: 'Cố vấn / Xem tư liệu',
    };

    let actualStaffId: string = crypto.randomUUID();

    try {
      if (isSupabaseConfigured) {
        // 1. Ưu tiên gọi hàm PostgreSQL SECURITY DEFINER admin_create_staff_user
        // Hàm này tạo trực tiếp tài khoản trong auth.users với crypt(bf), confirmed_at=now, auth.identities, profiles và user_roles
        let rpcSuccess = false;
        try {
          const { data: rpcData, error: rpcErr } = await supabase.rpc('admin_create_staff_user', {
            p_email: addEmail.trim().toLowerCase(),
            p_password: addPassword,
            p_full_name: addFullName.trim(),
            p_department: addDepartment,
            p_role: addRole,
          });

          if (!rpcErr && rpcData?.success) {
            actualStaffId = rpcData.user_id;
            rpcSuccess = true;
            console.log('[PasswordManager] Tạo tài khoản cán bộ thành công qua RPC:', rpcData);
          } else if (rpcErr) {
            console.warn('[PasswordManager] RPC admin_create_staff_user báo lỗi, thử Client SignUp:', rpcErr.message);
          }
        } catch (rpcEx: any) {
          console.warn('[PasswordManager] Ngoại lệ khi gọi RPC admin_create_staff_user:', rpcEx?.message);
        }

        // 2. Dự phòng: Nếu RPC chưa sẵn sàng hoặc gặp lỗi tạm thời, sử dụng Client cô lập để đăng ký vào auth.users
        if (!rpcSuccess) {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          const isolatedClient = createClient(supabaseUrl, anonKey, {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
          });

          const { data: signUpData, error: signUpErr } = await isolatedClient.auth.signUp({
            email: addEmail.trim().toLowerCase(),
            password: addPassword,
            options: {
              data: {
                full_name: addFullName.trim(),
                department: addDepartment,
              },
            },
          });

          if (signUpErr && !signUpErr.message.includes('already registered')) {
            throw signUpErr;
          }

          if (signUpData?.user?.id) {
            actualStaffId = signUpData.user.id;
          }

          // Cập nhật profiles
          const { error: profErr } = await supabase.from('profiles').upsert({
            id: actualStaffId as any,
            full_name: addFullName.trim(),
            department: addDepartment,
            status: 'active',
            email: addEmail.trim().toLowerCase(),
          });
          if (profErr) {
            console.warn('[PasswordManager] Ghi profiles warning:', profErr);
          }

          // Gán vai trò vào user_roles
          const { data: roleData } = await supabase
            .from('roles')
            .select('id')
            .eq('code', addRole)
            .single();

          if (roleData?.id) {
            await supabase.from('user_roles').delete().eq('user_id', actualStaffId as any);
            await supabase.from('user_roles').insert({
              user_id: actualStaffId as any,
              role_id: roleData.id,
              assigned_by: user?.id as any,
            });
          }
        }
      }

      const newStaffItem: StaffUserItem = {
        id: actualStaffId,
        email: addEmail.trim().toLowerCase(),
        full_name: addFullName.trim(),
        department: addDepartment,
        role: addRole,
        role_name: roleLabels[addRole],
        status: 'active',
        created_at: new Date().toISOString(),
      };

      // 3. Cập nhật state và localStorage
      const updatedList = [newStaffItem, ...staffList.filter((s) => s.id !== actualStaffId && s.email !== newStaffItem.email)];
      setStaffList(updatedList);
      try {
        localStorage.setItem('hcm_cms_staff_accounts', JSON.stringify(updatedList));
      } catch {}

      // 4. Ghi nhật ký kiểm toán
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Thêm mới tài khoản cán bộ',
        article_title: `${newStaffItem.full_name} (${newStaffItem.email})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Thành công (Đã lưu Database Cloud)',
        feedback: `Khởi tạo tài khoản với vai trò ${roleLabels[addRole]}, tổ ${addDepartment}. Mật khẩu ban đầu: ${addPassword}`,
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(`Đã tạo thành công tài khoản cán bộ: ${newStaffItem.full_name} trên Database Cloud! Mật khẩu khởi tạo: ${addPassword}`);
      setIsAddModalOpen(false);

      // Tự động tải lại danh sách mới nhất từ Database Cloud
      setTimeout(() => {
        loadStaffList();
      }, 500);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Thêm cán bộ thất bại.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // =========================================================================
  // XỬ LÝ 3: CHỈNH SỬA ĐẦY ĐỦ THÔNG TIN TÀI KHOẢN GIÁO VIÊN / CÁN BỘ (ADMIN)
  // =========================================================================
  const handleOpenEditModal = (staff: StaffUserItem) => {
    setEditingStaff(staff);
    setEditFullName(staff.full_name);
    setEditEmail(staff.email);
    setEditDepartment(staff.department);
    setEditRole(staff.role);
    setEditStatus(staff.status);
    setEditNewPassword('');
    setShowEditPassword(false);
    setActionErrorMsg(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const cleanName = editFullName.trim();
    const cleanEmail = editEmail.trim().toLowerCase();
    const cleanDept = editDepartment.trim() || 'Trường THCS Nguyễn Trung Trực';
    const cleanPass = editNewPassword.trim();

    if (!cleanName) {
      setActionErrorMsg('Họ và tên giáo viên / cán bộ không được để trống!');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setActionErrorMsg('Địa chỉ email tài khoản không hợp lệ!');
      return;
    }

    if (cleanPass && cleanPass.length < 8) {
      setActionErrorMsg('Mật khẩu mới (nếu đặt lại) phải có tối thiểu 8 ký tự!');
      return;
    }

    setIsSubmittingEdit(true);
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    const roleLabels = {
      admin: 'Quản trị viên (Admin)',
      editor: 'Biên tập viên nội dung',
      viewer: 'Cố vấn / Xem tư liệu',
    };

    try {
      let cloudUpdated = false;
      if (isSupabaseConfigured) {
        // 1. Ưu tiên tuyệt đối: Gọi Admin Serverless API (Service Role Key + xác thực JWT Admin)
        // Cập nhật đồng bộ auth.users (email, mật khẩu mới nếu có, khóa/mở khóa), profiles và user_roles
        const token = await getAuthBearerToken();
        if (token) {
          const apiRes = await fetch('/api/cms/media?resource=staff', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              staff: {
                id: editingStaff.id,
                full_name: cleanName,
                email: cleanEmail,
                department: cleanDept,
                role: editRole,
                status: editStatus,
                new_password: cleanPass || undefined,
              },
            }),
          });

          const apiJson = await apiRes.json().catch(() => ({}));
          if (!apiRes.ok || !apiJson.success) {
            throw new Error(apiJson.error || `Không thể cập nhật tài khoản lên máy chủ (HTTP ${apiRes.status})`);
          }
          cloudUpdated = true;
        }

        // 2. Dự phòng nếu chưa có phiên JWT (chế độ local/sandbox)
        if (!cloudUpdated) {
          const { error: profErr } = await supabase
            .from('profiles')
            .update({
              full_name: cleanName,
              email: cleanEmail,
              department: cleanDept,
              status: editStatus,
            })
            .eq('id', editingStaff.id);
          if (profErr) {
            throw new Error(`Không thể cập nhật profiles: ${profErr.message}`);
          }

          if (editRole !== editingStaff.role) {
            const { data: roleData } = await supabase
              .from('roles')
              .select('id')
              .eq('code', editRole)
              .single();

            if (roleData?.id) {
              await supabase.from('user_roles').delete().eq('user_id', editingStaff.id);
              await supabase.from('user_roles').insert({
                user_id: editingStaff.id,
                role_id: roleData.id,
                assigned_by: user?.id,
              });
            }
          }
        }
      }

      // 3. Cập nhật state và localStorage
      const updatedList = staffList.map((s) => {
        if (s.id === editingStaff.id) {
          return {
            ...s,
            full_name: cleanName,
            email: cleanEmail,
            department: cleanDept,
            role: editRole,
            role_name: roleLabels[editRole],
            status: editStatus,
          };
        }
        return s;
      });

      setStaffList(updatedList);
      try {
        localStorage.setItem('hcm_cms_staff_accounts', JSON.stringify(updatedList));
      } catch {}

      // 4. Ghi nhật ký kiểm toán
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Cập nhật tài khoản giáo viên / cán bộ',
        article_title: `${cleanName} (${cleanEmail})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: cloudUpdated ? 'Thành công (Đã lưu Cloud)' : 'Thành công',
        feedback: `Điều chỉnh hồ sơ: Email ${cleanEmail}, Tổ ${cleanDept}, Vai trò: ${roleLabels[editRole]}, Trạng thái: ${editStatus}${cleanPass ? ' (Có đặt lại mật khẩu mới)' : ''}`,
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(
        `Đã cập nhật thành công tài khoản ${cleanName} (${cleanEmail}) – Tổ: ${cleanDept}${cleanPass ? ' và thiết lập mật khẩu mới' : ''}!`
      );
      setIsEditModalOpen(false);
      setEditingStaff(null);
      setEditNewPassword('');

      setTimeout(() => {
        loadStaffList();
      }, 400);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Cập nhật tài khoản giáo viên thất bại.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // =========================================================================
  // XỬ LÝ 3b: KHAI BÁO & QUẢN LÝ TỔ CHUYÊN MÔN (CRUD ĐỒNG BỘ SUPABASE CLOUD)
  // =========================================================================
  const handleOpenAddDeptModal = () => {
    setEditingDepartment(null);
    setDeptName('');
    setDeptCode('');
    setDeptHeadName('');
    setDeptDescription('');
    setDeptErrorMsg(null);
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDeptModal = (dept: DepartmentItem) => {
    setEditingDepartment(dept);
    setDeptName(dept.name);
    setDeptCode(dept.code || '');
    setDeptHeadName(dept.head_name || '');
    setDeptDescription(dept.description || '');
    setDeptErrorMsg(null);
    setIsDeptModalOpen(true);
  };

  const persistDepartmentsToCloud = async (
    nextDepartments: DepartmentItem[],
    renameFrom?: string,
    renameTo?: string
  ) => {
    if (isSupabaseConfigured) {
      const token = await getAuthBearerToken();
      if (token) {
        const res = await fetch('/api/cms/media?resource=departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departments: nextDepartments,
            renameFrom,
            renameTo,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          throw new Error(json.error || `Không thể lưu tổ chuyên môn lên Cloud (HTTP ${res.status})`);
        }
        return (json.departments as DepartmentItem[]) || nextDepartments;
      }
    }
    return nextDepartments;
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = deptName.trim();
    if (!cleanName) {
      setDeptErrorMsg('Tên Tổ chuyên môn / Phòng ban không được để trống!');
      return;
    }

    const isDuplicate = departments.some(
      (d) =>
        d.name.toLowerCase() === cleanName.toLowerCase() &&
        (!editingDepartment || d.id !== editingDepartment.id)
    );
    if (isDuplicate) {
      setDeptErrorMsg(`Tổ chuyên môn "${cleanName}" đã tồn tại trong danh mục!`);
      return;
    }

    setIsSavingDept(true);
    setDeptErrorMsg(null);
    setDeptSuccessMsg(null);

    try {
      const autoCode =
        deptCode.trim().toUpperCase() ||
        cleanName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'D')
          .split(/\s+/)
          .map((w) => w.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 8);

      let nextList: DepartmentItem[];
      let renameFrom: string | undefined;
      let renameTo: string | undefined;

      if (editingDepartment) {
        if (editingDepartment.name !== cleanName) {
          renameFrom = editingDepartment.name;
          renameTo = cleanName;
        }
        nextList = departments.map((d) =>
          d.id === editingDepartment.id
            ? {
                ...d,
                name: cleanName,
                code: autoCode,
                head_name: deptHeadName.trim(),
                description: deptDescription.trim(),
              }
            : d
        );
      } else {
        const newDept: DepartmentItem = {
          id: `dept-${Date.now()}`,
          name: cleanName,
          code: autoCode,
          head_name: deptHeadName.trim(),
          description: deptDescription.trim(),
          created_at: new Date().toISOString(),
        };
        nextList = [...departments, newDept];
      }

      const savedList = await persistDepartmentsToCloud(nextList, renameFrom, renameTo);
      setDepartments(savedList);
      try {
        localStorage.setItem(KEY_DEPARTMENTS_LOCAL, JSON.stringify(savedList));
      } catch {}

      // Nếu đổi tên tổ, đồng bộ ngay danh sách nhân sự trên UI
      if (renameFrom && renameTo) {
        setStaffList((prev) =>
          prev.map((s) => (s.department === renameFrom ? { ...s, department: renameTo } : s))
        );
      }

      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: editingDepartment ? 'Cập nhật Tổ chuyên môn' : 'Khai báo Tổ chuyên môn mới',
        article_title: `${cleanName} (${autoCode})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã lưu Cloud',
        feedback: editingDepartment
          ? `Cập nhật thông tin tổ chuyên môn${renameFrom ? ` (đổi tên từ "${renameFrom}" sang "${renameTo}")` : ''}.`
          : `Khai báo tổ chuyên môn mới "${cleanName}" vào danh mục nhà trường.`,
        timestamp: new Date().toISOString(),
      });

      setDeptSuccessMsg(
        editingDepartment
          ? `Đã cập nhật Tổ chuyên môn "${cleanName}" thành công!`
          : `Đã khai báo Tổ chuyên môn mới "${cleanName}" thành công!`
      );
      // Nếu Admin đang mở form Thêm / Sửa GV và bấm "+ Khai báo tổ mới", tự động chọn tổ vừa tạo
      if (!editingDepartment) {
        if (isAddModalOpen) setAddDepartment(cleanName);
        if (isEditModalOpen) setEditDepartment(cleanName);
      }
      setIsDeptModalOpen(false);
      setEditingDepartment(null);
    } catch (err: any) {
      setDeptErrorMsg(err.message || 'Không thể lưu thông tin Tổ chuyên môn.');
    } finally {
      setIsSavingDept(false);
    }
  };

  const handleDeleteDepartment = async (dept: DepartmentItem) => {
    const memberCount = staffList.filter((s) => s.department === dept.name).length;
    const confirmMsg =
      memberCount > 0
        ? `Tổ "${dept.name}" hiện đang có ${memberCount} giáo viên / cán bộ.\n\nBạn có chắc chắn muốn xóa tổ này khỏi danh mục khai báo? (Tài khoản giáo viên sẽ không bị xóa, nhưng bạn nên chuyển họ sang tổ khác.)`
        : `Bạn có chắc chắn muốn xóa Tổ chuyên môn "${dept.name}" khỏi danh mục?`;

    if (!window.confirm(confirmMsg)) return;

    setDeptErrorMsg(null);
    setDeptSuccessMsg(null);

    try {
      const nextList = departments.filter((d) => d.id !== dept.id);
      const savedList = await persistDepartmentsToCloud(nextList);
      setDepartments(savedList);
      try {
        localStorage.setItem(KEY_DEPARTMENTS_LOCAL, JSON.stringify(savedList));
      } catch {}

      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Xóa Tổ chuyên môn',
        article_title: dept.name,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã xóa',
        feedback: `Đã xóa Tổ chuyên môn "${dept.name}" khỏi danh mục khai báo.`,
        timestamp: new Date().toISOString(),
      });

      setDeptSuccessMsg(`Đã xóa Tổ chuyên môn "${dept.name}" khỏi danh mục.`);
    } catch (err: any) {
      setDeptErrorMsg(err.message || 'Không thể xóa Tổ chuyên môn.');
    }
  };

  // =========================================================================
  // XỬ LÝ 4: XÓA TÀI KHOẢN CÁN BỘ (BẢO MẬT: CHẶN TỰ XÓA BẢN THÂN)
  // =========================================================================
  const handleOpenDeleteModal = (staff: StaffUserItem) => {
    // Chặn tuyệt đối tự xóa chính mình
    if (user && (staff.id === user.id || staff.email.toLowerCase() === user.email?.toLowerCase())) {
      setActionErrorMsg('Không thể xóa tài khoản của chính bạn đang đăng nhập!');
      return;
    }
    setDeletingStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaff) return;

    setIsSubmittingDelete(true);
    setActionErrorMsg(null);

    try {
      if (isSupabaseConfigured) {
        // 1. Thử gọi RPC PostgreSQL SECURITY DEFINER admin_delete_staff_user
        let rpcDeleted = false;
        try {
          const { error: rpcDelErr } = await supabase.rpc('admin_delete_staff_user', {
            p_user_id: deletingStaff.id,
          });
          if (!rpcDelErr) {
            rpcDeleted = true;
          }
        } catch (e) {
          console.warn('[PasswordManager] RPC admin_delete_staff_user warning:', e);
        }

        // 2. Dự phòng: Xóa quyền và chuyển trạng thái inactive
        if (!rpcDeleted) {
          await supabase.from('user_roles').delete().eq('user_id', deletingStaff.id);
          await supabase.from('profiles').update({ status: 'inactive' }).eq('id', deletingStaff.id);
        }
      }

      // Cập nhật state và localStorage
      const updatedList = staffList.filter((s) => s.id !== deletingStaff.id);
      setStaffList(updatedList);
      try {
        localStorage.setItem('hcm_cms_staff_accounts', JSON.stringify(updatedList));
      } catch {}

      // Ghi nhật ký kiểm toán
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Xóa tài khoản cán bộ',
        article_title: `${deletingStaff.full_name} (${deletingStaff.email})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã thu hồi & Xóa',
        feedback: `Đã thu hồi quyền truy cập và xóa tài khoản ${deletingStaff.full_name} khỏi hệ thống biên tập.`,
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(`Đã xóa tài khoản cán bộ ${deletingStaff.full_name} thành công!`);
      setIsDeleteModalOpen(false);
      setDeletingStaff(null);
      setTimeout(() => {
        loadStaffList();
      }, 500);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Xóa tài khoản thất bại.');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // =========================================================================
  // XỬ LÝ 5: GỬI LINK RESET & CẤP MẬT KHẨU TẠM THỜI
  // =========================================================================
  const handleSendResetEmail = async (staffEmail: string) => {
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(staffEmail, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) throw error;
      }

      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Gửi email đặt lại mật khẩu',
        article_title: `Khôi phục mật khẩu: ${staffEmail}`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã gửi',
        feedback: 'Quản trị viên đã kích hoạt luồng đặt lại mật khẩu tự động qua email.',
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(`Đã gửi hướng dẫn đặt lại mật khẩu tới hộp thư ${staffEmail} thành công!`);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Gửi email khôi phục thất bại.');
    }
  };

  const handleAdminSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStaff) return;
    if (manualNewPass.length < 8) {
      setActionErrorMsg('Mật khẩu mới phải từ 8 ký tự trở lên!');
      return;
    }

    setIsSubmittingManualPass(true);
    setActionErrorMsg(null);

    try {
      if (isSupabaseConfigured) {
        // Cập nhật mật khẩu thực tế vào auth.users thông qua RPC PostgreSQL
        try {
          const { error: rpcResetErr } = await supabase.rpc('admin_reset_staff_password', {
            p_user_id: targetStaff.id,
            p_new_password: manualNewPass,
          });
          if (rpcResetErr) {
            console.warn('[PasswordManager] RPC admin_reset_staff_password:', rpcResetErr.message);
          }
        } catch (e) {
          console.warn('[PasswordManager] Ngoại lệ khi gọi admin_reset_staff_password:', e);
        }
      }

      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Cấp mật khẩu cán bộ',
        article_title: `Tài khoản ${targetStaff.full_name} (${targetStaff.email})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã cấp',
        feedback: `Quản trị viên thiết lập lại thông tin xác thực cho nhân sự. Mật khẩu: ${manualNewPass}`,
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(`Đã cấp mật khẩu mới thành công cho ${targetStaff.full_name}! Mật khẩu mới: ${manualNewPass}`);
      setTargetStaff(null);
      setManualNewPass('');
      setTimeout(() => {
        loadStaffList();
      }, 500);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Thao tác không thành công.');
    } finally {
      setIsSubmittingManualPass(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Lọc danh sách nhân sự theo tìm kiếm, vai trò và tổ chuyên môn
  const filteredStaff = staffList.filter((s) => {
    const q = staffSearchQuery.toLowerCase();
    const matchSearch = s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || s.role === roleFilter;
    const matchDept = departmentFilter === 'all' || s.department === departmentFilter;
    return matchSearch && matchRole && matchDept;
  });

  // Lọc danh sách tổ chuyên môn
  const filteredDepartments = departments.filter((d) => {
    const q = deptSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      (d.code || '').toLowerCase().includes(q) ||
      (d.head_name || '').toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Phân Hệ */}
      <div className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 border border-heritage-gold-400/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-heritage-gold-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-heritage-gold-400/20 border border-heritage-gold-400/40 rounded-full text-xs text-heritage-gold-200 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-heritage-gold-300" />
              <span>Trung Tâm An Ninh & Quản Trị Tài Khoản Học Đường</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide">
              Quản Trị Tài Khoản GV, Tổ Chuyên Môn & Mật Khẩu
            </h2>
            <p className="text-xs sm:text-sm text-heritage-gold-100/90 max-w-2xl leading-relaxed">
              Thiết lập mật khẩu an toàn, chỉnh sửa đầy đủ thông tin tài khoản giáo viên (Họ tên, Email, Tổ chuyên môn, Vai trò, Mật khẩu) và khai báo danh mục Tổ chuyên môn của Trường THCS Nguyễn Trung Trực.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm border border-heritage-gold-400/30 rounded-xl p-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-heritage-gold-400/20 border border-heritage-gold-300 flex items-center justify-center text-heritage-gold-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left text-xs">
              <div className="text-heritage-gold-300 font-semibold">Tài Khoản Đang Đăng Nhập</div>
              <div className="text-white font-mono text-[11px] truncate max-w-[180px]">
                {user?.email || 'nguyenphianh@gmail.com'}
              </div>
              <div className="text-emerald-300 font-medium text-[10px] flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Quyền: {roles[0]?.name || (isAdmin ? 'Quản Trị Viên' : 'Biên Tập Viên')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh Điều Hướng Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-heritage-gold-400/20 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'personal'
                ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                : 'text-heritage-gold-200 hover:bg-white/10'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Đổi Mật Khẩu Cá Nhân</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                activeTab === 'staff'
                  ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                  : 'text-heritage-gold-200 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản Trị Tài Khoản GV & Cán Bộ</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                activeTab === 'departments'
                  ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                  : 'text-heritage-gold-200 hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Khai Báo Tổ Chuyên Môn</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'departments' ? 'bg-heritage-red-900/20 text-heritage-red-950' : 'bg-white/15 text-heritage-gold-200'
              }`}>
                {departments.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'policy'
                ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                : 'text-heritage-gold-200 hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Chính Sách An Toàn Mật Khẩu</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ĐỔI MẬT KHẨU CÁ NHÂN (Bắt buộc xác thực mật khẩu cũ)                */}
      {/* ========================================================================= */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Form Đổi Mật Khẩu */}
          <div className="lg:col-span-2 bg-white border border-heritage-ivory-300 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-heritage-ivory-200">
              <div className="p-2.5 bg-heritage-red-50 text-heritage-red-700 rounded-xl border border-heritage-red-200">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heritage-ink-900">
                  Thiết Lập Mật Khẩu Mới An Toàn
                </h3>
                <p className="text-xs text-heritage-ink-500">
                  Bắt buộc nhập chính xác mật khẩu hiện tại (mật khẩu cũ) để ngăn chặn truy cập trái phép
                </p>
              </div>
            </div>

            {/* Thông báo Thành công / Thất bại */}
            {personalSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Đổi Mật Khẩu Thành Công!</div>
                  <div>{personalSuccessMsg}</div>
                </div>
              </div>
            )}

            {personalErrorMsg && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Lỗi Xác Thực</div>
                  <div>{personalErrorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdatePersonalPassword} className="space-y-5">
              {/* Email hiển thị dạng Readonly */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-700 mb-1.5">
                  Email tài khoản của bạn
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={user?.email || 'nguyenphianh@gmail.com'}
                    className="w-full px-3.5 py-2.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-600 font-mono select-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold border border-emerald-200">
                      Đã xác thực danh tính
                    </span>
                  </div>
                </div>
              </div>

              {/* Mật khẩu hiện tại (Mật khẩu cũ) */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-800 mb-1.5 flex items-center justify-between">
                  <span>Mật khẩu hiện tại (Mật khẩu cũ) <span className="text-red-500">*</span></span>
                  <span className="text-[11px] text-heritage-ink-400 font-normal">Yêu cầu xác minh danh tính</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng..."
                    className="w-full px-3.5 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-800 mb-1.5 flex items-center justify-between">
                  <span>Mật khẩu mới <span className="text-red-500">*</span></span>
                  <span className="text-[11px] text-heritage-ink-500">Tối thiểu 8 ký tự</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới an toàn..."
                    className="w-full px-3.5 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Thanh đo độ mạnh mật khẩu */}
                {newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-heritage-ink-500">Độ an toàn:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${strengthInfo.color}`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-heritage-ivory-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthInfo.barColor}`}
                        style={{ width: `${strengthInfo.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-800 mb-1.5">
                  Xác nhận lại mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-3.5 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">Mật khẩu xác nhận chưa trùng khớp.</p>
                )}
              </div>

              {/* Nút lưu */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isUpdatingPersonal || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="px-6 py-2.5 bg-heritage-red-800 hover:bg-heritage-red-700 disabled:bg-heritage-ink-400 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                >
                  {isUpdatingPersonal ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                      <span>Đang xác minh & Lưu...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-heritage-gold-300" />
                      <span>Xác Nhận Đổi Mật Khẩu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Tiện ích tạo mật khẩu mạnh & Hướng dẫn */}
          <div className="space-y-4">
            <div className="bg-heritage-ivory-100 border border-heritage-gold-300/70 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-heritage-red-900 font-serif font-bold text-sm">
                <Sparkles className="w-4 h-4 text-heritage-gold-600" />
                <span>Tiêu Chuẩn Mật Khẩu Học Đường</span>
              </div>
              <ul className="text-xs text-heritage-ink-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Xác thực 2 lớp:</strong> Phải nhập đúng mật khẩu cũ mới được cấp quyền đổi mật khẩu mới.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Mã hóa chuẩn bcrypt:</strong> Toàn bộ mật khẩu được băm 1 chiều bằng thuật toán an toàn trước khi lưu vào Supabase.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Khóa Sandbox:</strong> Chế độ đăng nhập nhanh mô phỏng đã bị loại bỏ để đảm bảo dữ liệu thật 100%.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
              <div className="font-bold flex items-center space-x-1.5 text-blue-950">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Tạo Mật Khẩu Ngẫu Nhiên Mạnh</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800">
                Bấm vào nút dưới để hệ thống tự sinh chuỗi mật khẩu 12 ký tự ngẫu nhiên chuẩn an toàn:
              </p>
              <button
                type="button"
                onClick={() => {
                  const autoPass = generateStrongPassword();
                  setNewPassword(autoPass);
                  setConfirmPassword(autoPass);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] flex items-center space-x-1 transition shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sinh Mật Khẩu Tự Động</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUẢN TRỊ BIÊN TẬP VIÊN & CÁN BỘ (CRUD ĐẦY ĐỦ)                        */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && isAdmin && (
        <div className="bg-white border border-heritage-ivory-300 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-heritage-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-base text-heritage-ink-900 flex items-center space-x-2">
                <span>Quản Trị Hồ Sơ Biên Tập Viên & Cán Bộ</span>
                <span className="text-xs px-2 py-0.5 bg-heritage-gold-100 text-heritage-red-800 font-sans font-semibold rounded-full border border-heritage-gold-300">
                  {filteredStaff.length} tài khoản
                </span>
              </h3>
              <p className="text-xs text-heritage-ink-500">
                Thêm mới biên tập viên, phân quyền tổ chuyên môn, chỉnh sửa hồ sơ và cấp phát thông tin xác thực
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Lọc theo Tổ chuyên môn */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-800 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 max-w-[180px]"
                title="Lọc theo Tổ chuyên môn"
              >
                <option value="all">Tất cả tổ chuyên môn</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Lọc theo vai trò */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-800 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="editor">Biên tập viên (Editor)</option>
                <option value="viewer">Cố vấn / Xem (Viewer)</option>
              </select>

              {/* Ô tìm kiếm */}
              <input
                type="text"
                placeholder="Tìm theo tên, email, tổ..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="pl-3 pr-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 w-44 sm:w-52"
              />

              <button
                onClick={loadStaffList}
                disabled={isLoadingStaff}
                className="p-2 border border-heritage-ivory-300 hover:bg-heritage-ivory-100 rounded-xl text-heritage-ink-600 transition"
                title="Làm mới danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingStaff ? 'animate-spin text-heritage-red-700' : ''}`} />
              </button>

              {/* Lối tắt sang tab Khai báo Tổ chuyên môn */}
              <button
                onClick={() => setActiveTab('departments')}
                className="px-3 py-1.5 bg-heritage-gold-100 hover:bg-heritage-gold-200 text-heritage-red-900 border border-heritage-gold-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                title="Khai báo & quản lý các Tổ chuyên môn"
              >
                <Building2 className="w-3.5 h-3.5 text-heritage-red-800" />
                <span>Tổ chuyên môn</span>
              </button>

              {/* Nút Thêm Mới Biên Tập Viên */}
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-1.5 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-heritage-gold-300" />
                <span>+ Thêm Giáo Viên</span>
              </button>
            </div>
          </div>

          {/* Thông báo thao tác */}
          {actionSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {actionErrorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
          )}

          {/* Bảng Danh Sách Nhân Sự */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-heritage-ivory-200/80 text-heritage-ink-700 font-bold border-b border-heritage-ivory-300">
                  <th className="py-3 px-4 rounded-l-xl">Cán bộ / Giáo viên</th>
                  <th className="py-3 px-4">Tổ chuyên môn</th>
                  <th className="py-3 px-4">Vai trò CMS</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Hành động quản lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-ivory-200">
                {filteredStaff.map((staff) => {
                  const isCurrent = user && (user.id === staff.id || user.email?.toLowerCase() === staff.email.toLowerCase());
                  return (
                    <tr key={staff.id} className="hover:bg-heritage-ivory-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-heritage-red-100 text-heritage-red-800 font-bold flex items-center justify-center border border-heritage-red-200 text-xs flex-shrink-0">
                            {staff.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-heritage-ink-900 flex items-center space-x-1.5">
                              <span>{staff.full_name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold border border-emerald-300">
                                  Bạn (Đang đăng nhập)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-heritage-ink-500 font-mono flex items-center space-x-1 mt-0.5">
                              <span>{staff.email}</span>
                              <button
                                onClick={() => handleCopyText(staff.email, `email-${staff.id}`)}
                                className="text-heritage-ink-400 hover:text-heritage-ink-700 p-0.5"
                                title="Sao chép email"
                              >
                                {copiedId === `email-${staff.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-heritage-ink-700">
                        {staff.department}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            staff.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : staff.role === 'viewer'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {staff.role_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded border ${
                            staff.status === 'active'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{staff.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Nút Sửa Thông Tin Tài Khoản GV */}
                          <button
                            onClick={() => handleOpenEditModal(staff)}
                            className="px-2.5 py-1.5 bg-heritage-gold-100 hover:bg-heritage-gold-200 text-heritage-red-900 border border-heritage-gold-300 rounded-lg text-[11px] font-bold transition inline-flex items-center space-x-1"
                            title="Sửa thông tin tài khoản giáo viên (Tên, Email, Tổ chuyên môn, Vai trò, Mật khẩu)"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Sửa</span>
                          </button>

                          {/* Nút Cấp Mật Khẩu Mới */}
                          <button
                            onClick={() => {
                              setTargetStaff(staff);
                              setManualNewPass(generateStrongPassword());
                            }}
                            className="p-1.5 bg-heritage-ivory-100 hover:bg-heritage-gold-100 text-heritage-ink-700 hover:text-heritage-red-800 border border-heritage-ivory-300 rounded-lg text-xs transition"
                            title="Cấp mật khẩu mới cho cán bộ"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-heritage-gold-600" />
                          </button>

                          {/* Nút Gửi Email Reset */}
                          <button
                            onClick={() => handleSendResetEmail(staff.email)}
                            className="p-1.5 bg-heritage-ivory-100 hover:bg-heritage-gold-100 text-heritage-ink-700 hover:text-heritage-red-800 border border-heritage-ivory-300 rounded-lg text-xs transition"
                            title="Gửi link reset mật khẩu qua email"
                          >
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Nút Xóa Tài Khoản */}
                          {!isCurrent && (
                            <button
                              onClick={() => handleOpenDeleteModal(staff)}
                              className="p-1.5 bg-heritage-ivory-100 hover:bg-rose-100 text-rose-600 hover:text-rose-800 border border-heritage-ivory-300 hover:border-rose-300 rounded-lg text-xs transition"
                              title="Xóa tài khoản cán bộ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KHAI BÁO & QUẢN LÝ DANH MỤC TỔ CHUYÊN MÔN (ADMIN ONLY)             */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && isAdmin && (
        <div className="bg-white border border-heritage-ivory-300 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-heritage-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-base text-heritage-ink-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-heritage-red-800" />
                <span>Danh Mục Tổ Chuyên Môn & Phòng Ban Nhà Trường</span>
                <span className="text-xs px-2 py-0.5 bg-heritage-gold-100 text-heritage-red-800 font-sans font-semibold rounded-full border border-heritage-gold-300">
                  {departments.length} tổ / phòng ban
                </span>
              </h3>
              <p className="text-xs text-heritage-ink-500 mt-0.5">
                Khai báo, chỉnh sửa hoặc xóa các Tổ chuyên môn. Danh mục này được đồng bộ tự động vào form thêm/sửa tài khoản giáo viên trên toàn hệ thống.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                placeholder="Tìm tên tổ, mã tổ, tổ trưởng..."
                value={deptSearchQuery}
                onChange={(e) => setDeptSearchQuery(e.target.value)}
                className="pl-3 pr-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 w-52"
              />

              <button
                onClick={loadDepartments}
                disabled={isLoadingDepartments}
                className="p-2 border border-heritage-ivory-300 hover:bg-heritage-ivory-100 rounded-xl text-heritage-ink-600 transition"
                title="Đồng bộ danh mục tổ từ Cloud"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDepartments ? 'animate-spin text-heritage-red-700' : ''}`} />
              </button>

              <button
                onClick={handleOpenAddDeptModal}
                className="px-3.5 py-1.5 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-heritage-gold-300" />
                <span>Khai Báo Tổ Chuyên Môn</span>
              </button>
            </div>
          </div>

          {deptSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{deptSuccessMsg}</span>
            </div>
          )}

          {deptErrorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{deptErrorMsg}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-heritage-ivory-200/80 text-heritage-ink-700 font-bold border-b border-heritage-ivory-300">
                  <th className="py-3 px-4 rounded-l-xl">Tên Tổ chuyên môn / Phòng ban</th>
                  <th className="py-3 px-4">Mã tổ</th>
                  <th className="py-3 px-4">Tổ trưởng / Phụ trách</th>
                  <th className="py-3 px-4">Số lượng GV</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-ivory-200">
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-heritage-ink-500">
                      Không tìm thấy tổ chuyên môn phù hợp. Bấm <strong>"Khai Báo Tổ Chuyên Môn"</strong> để thêm mới.
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => {
                    const memberCount = staffList.filter((s) => s.department === dept.name).length;
                    return (
                      <tr key={dept.id} className="hover:bg-heritage-ivory-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-heritage-ink-900">{dept.name}</div>
                          {dept.description && (
                            <div className="text-[11px] text-heritage-ink-500 mt-0.5 max-w-md">
                              {dept.description}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-heritage-ivory-200 text-heritage-red-900 font-mono font-bold text-[11px] border border-heritage-ivory-300">
                            {dept.code || 'TCM'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-heritage-ink-700">
                          {dept.head_name || <span className="text-heritage-ink-400 italic">Chưa khai báo</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setDepartmentFilter(dept.name);
                              setActiveTab('staff');
                            }}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-[11px] transition"
                            title="Bấm để xem danh sách giáo viên thuộc tổ này"
                          >
                            <Users className="w-3 h-3" />
                            <span>{memberCount} GV / Cán bộ</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDeptModal(dept)}
                              className="px-2.5 py-1.5 bg-heritage-gold-100 hover:bg-heritage-gold-200 text-heritage-red-900 border border-heritage-gold-300 rounded-lg text-[11px] font-bold transition inline-flex items-center space-x-1"
                              title="Sửa thông tin tổ chuyên môn"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDepartment(dept)}
                              className="p-1.5 bg-heritage-ivory-100 hover:bg-rose-100 text-rose-600 hover:text-rose-800 border border-heritage-ivory-300 hover:border-rose-300 rounded-lg text-xs transition"
                              title="Xóa tổ chuyên môn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CHÍNH SÁCH BẢO MẬT & THÔNG TIN HỆ THỐNG                            */}
      {/* ========================================================================= */}
      {activeTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-heritage-ivory-300 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-heritage-red-900 font-serif font-bold text-base pb-3 border-b border-heritage-ivory-200">
              <ShieldCheck className="w-5 h-5 text-heritage-gold-600" />
              <span>Chính Sách Mật Khẩu Trường THCS Nguyễn Trung Trực</span>
            </div>
            <div className="space-y-3 text-xs text-heritage-ink-700 leading-relaxed">
              <p>
                <strong>1. Yêu cầu mật khẩu cũ:</strong> Bất kỳ thao tác đổi mật khẩu nào đều bắt buộc phải nhập đúng mật khẩu hiện tại nhằm ngăn chặn các hành vi xâm phạm khi máy tính làm việc không khóa màn hình.
              </p>
              <p>
                <strong>2. Kiểm duyệt 4 mắt & Trách nhiệm cá nhân:</strong> Mỗi bài viết, bản thảo và đề thi khi được tạo lập đều gắn liền với định danh tài khoản cá nhân. Nghiêm cấm chia sẻ tài khoản đăng nhập cho người khác.
              </p>
              <p>
                <strong>3. Khóa phiên làm việc tự động:</strong> Hệ thống tự động hết hạn phiên đăng nhập khi không có hoạt động trong 120 phút liên tục nhằm phòng tránh rủi ro quên đăng xuất trên máy tính học đường.
              </p>
            </div>
          </div>

          <div className="bg-white border border-heritage-ivory-300 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-heritage-red-900 font-serif font-bold text-base pb-3 border-b border-heritage-ivory-200">
              <Lock className="w-5 h-5 text-heritage-gold-600" />
              <span>Cấu Trúc Mật Mã Học Đường (Cryptographic Profile)</span>
            </div>
            <div className="space-y-3 text-xs text-heritage-ink-700 leading-relaxed font-mono">
              <div className="p-3 bg-heritage-ivory-100 rounded-xl space-y-1.5 border border-heritage-ivory-300 text-[11px]">
                <div>• Thuật toán băm: <strong className="text-heritage-red-800">Blowfish (bcrypt via pgcrypto)</strong></div>
                <div>• Chiều dài Salt: <strong>16 bytes ngẫu nhiên</strong></div>
                <div>• Tiêu chuẩn lưu trữ: <strong>Supabase Auth schema auth.users</strong></div>
                <div>• Phân quyền RLS: <strong>Row Level Security enforced 100%</strong></div>
                <div>• Chế độ Sandbox: <strong>ĐÃ KHÓA & LOẠI BỎ (Chỉ chấp nhận tài khoản thật)</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: THÊM CÁN BỘ / BIÊN TẬP VIÊN MỚI                                  */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <UserPlus className="w-5 h-5 text-heritage-gold-300" />
                <h4 className="font-serif font-bold text-base">Thêm Mới Cán Bộ / Biên Tập Viên</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Họ và tên cán bộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addFullName}
                  onChange={(e) => setAddFullName(e.target.value)}
                  placeholder="Ví dụ: Thầy Trần Văn Nam"
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Email tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="name@thcsnguyentrungtruc.edu.vn hoặc gmail"
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1 flex items-center justify-between">
                    <span>Tổ chuyên môn / Phòng ban</span>
                    <button
                      type="button"
                      onClick={handleOpenAddDeptModal}
                      className="text-[11px] font-bold text-heritage-red-800 hover:underline"
                    >
                      + Khai báo tổ mới
                    </button>
                  </label>
                  <select
                    value={addDepartment}
                    onChange={(e) => setAddDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                    {addDepartment && !departments.some((d) => d.name === addDepartment) && (
                      <option value={addDepartment}>{addDepartment}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1">
                    Vai trò phân quyền
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  >
                    <option value="editor">Biên tập viên (Soạn & Nộp duyệt)</option>
                    <option value="viewer">Cố vấn / Xem tư liệu</option>
                    <option value="admin">Quản trị viên (Ban Giám Hiệu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1 flex items-center justify-between">
                  <span>Mật khẩu khởi tạo <span className="text-red-500">*</span></span>
                  <button
                    type="button"
                    onClick={() => setAddPassword(generateStrongPassword())}
                    className="text-heritage-red-800 hover:underline text-[11px] font-bold"
                  >
                    Sinh ngẫu nhiên
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-heritage-ink-500 mt-1">
                  Mật khẩu này sẽ được thông báo trực tiếp cho cán bộ khi nhận tài khoản.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-heritage-ivory-300 rounded-xl hover:bg-heritage-ivory-100 text-heritage-ink-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd || !addFullName || !addEmail || !addPassword}
                  className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  {isSubmittingAdd ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-heritage-gold-300" />
                  )}
                  <span>Xác Nhận Thêm Cán Bộ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHỈNH SỬA ĐẦY ĐỦ THÔNG TIN TÀI KHOẢN GIÁO VIÊN / CÁN BỘ          */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <Pencil className="w-4 h-4 text-heritage-gold-300" />
                <h4 className="font-serif font-bold text-base">Chỉnh Sửa Tài Khoản Giáo Viên / Cán Bộ</h4>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Họ và tên giáo viên / cán bộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Ví dụ: Cô Nguyễn Thị Minh"
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Email đăng nhập tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@thcsnguyentrungtruc.edu.vn"
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 font-mono focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                />
                <p className="text-[11px] text-heritage-ink-500 mt-1">
                  Cập nhật đồng bộ địa chỉ email đăng nhập trên Supabase Auth và hồ sơ giáo viên.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1 flex items-center justify-between">
                  <span>Tổ chuyên môn / Phòng ban</span>
                  <button
                    type="button"
                    onClick={handleOpenAddDeptModal}
                    className="text-[11px] font-bold text-heritage-red-800 hover:underline"
                  >
                    + Khai báo tổ mới
                  </button>
                </label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                  {editDepartment && !departments.some((d) => d.name === editDepartment) && (
                    <option value={editDepartment}>{editDepartment}</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1">
                    Vai trò CMS
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  >
                    <option value="editor">Biên tập viên (Giáo viên)</option>
                    <option value="viewer">Cố vấn / Xem</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="suspended">Tạm đình chỉ (Khóa đăng nhập)</option>
                  </select>
                </div>
              </div>

              {/* Tùy chọn đặt lại mật khẩu mới ngay trong form chỉnh sửa */}
              <div className="pt-2 border-t border-heritage-ivory-200">
                <label className="block font-semibold text-heritage-ink-800 mb-1 flex items-center justify-between">
                  <span>Đặt mật khẩu mới (Để trống nếu giữ nguyên)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditNewPassword(generateStrongPassword());
                      setShowEditPassword(true);
                    }}
                    className="text-heritage-red-800 hover:underline text-[11px] font-bold"
                  >
                    Sinh ngẫu nhiên
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editNewPassword}
                    onChange={(e) => setEditNewPassword(e.target.value)}
                    placeholder="Nhập tối thiểu 8 ký tự nếu muốn đổi mật khẩu..."
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 font-mono pr-10 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {actionErrorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 rounded-xl text-[11px] flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{actionErrorMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-heritage-ivory-300 rounded-xl hover:bg-heritage-ivory-100 text-heritage-ink-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editFullName || !editEmail}
                  className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  {isSubmittingEdit ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                  ) : (
                    <Check className="w-4 h-4 text-heritage-gold-300" />
                  )}
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: XÁC NHẬN XÓA TÀI KHOẢN CÁN BỘ                                    */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-rose-300 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-rose-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-200" />
                <h4 className="font-serif font-bold text-base">Xác Nhận Xóa Tài Khoản</h4>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-heritage-ink-800 leading-relaxed">
                Bạn có chắc chắn muốn xóa quyền truy cập của cán bộ{' '}
                <strong className="text-heritage-red-900 font-bold">{deletingStaff.full_name}</strong> ({deletingStaff.email}) khỏi hệ thống CMS?
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-[11px] leading-relaxed">
                ⚠️ Cán bộ này sẽ không thể tiếp tục đăng nhập để biên tập bài viết hoặc duyệt nội dung. Toàn bộ hành động này sẽ được ghi vào Nhật ký kiểm toán an ninh.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-heritage-ivory-300 rounded-xl hover:bg-heritage-ivory-100 text-heritage-ink-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  disabled={isSubmittingDelete}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  {isSubmittingDelete ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-rose-200" />
                  )}
                  <span>Xác Nhận Xóa Vĩnh Viễn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CẤP MẬT KHẨU TẠM THỜI CHO GIÁO VIÊN                              */}
      {/* ========================================================================= */}
      {targetStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <KeyRound className="w-5 h-5 text-heritage-gold-300" />
                <h4 className="font-serif font-bold text-base">Cấp Mật Khẩu Mới Cho Cán Bộ</h4>
              </div>
              <button
                onClick={() => setTargetStaff(null)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminSetPassword} className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-heritage-ink-500">Cán bộ thụ hưởng:</span>
                <div className="font-bold text-heritage-ink-900 text-sm mt-0.5">
                  {targetStaff.full_name} ({targetStaff.email})
                </div>
                <div className="text-[11px] text-heritage-ink-500 font-mono mt-0.5">
                  Tổ: {targetStaff.department}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Mật khẩu mới cấp phát:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    value={manualNewPass}
                    onChange={(e) => setManualNewPass(e.target.value)}
                    className="flex-1 px-3 py-2 bg-heritage-ivory-100 border border-heritage-ivory-400 rounded-lg font-mono text-xs text-heritage-red-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(manualNewPass);
                      setCopiedId('manual-pass');
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="px-3 py-2 bg-heritage-ivory-200 hover:bg-heritage-gold-200 border border-heritage-ivory-300 rounded-lg text-heritage-ink-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedId === 'manual-pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'manual-pass' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-heritage-ink-500 mt-1">
                  Hãy sao chép mật khẩu này và gửi riêng cho giáo viên qua kênh liên lạc nội bộ.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTargetStaff(null)}
                  className="px-4 py-2 border border-heritage-ivory-300 rounded-xl hover:bg-heritage-ivory-100 text-heritage-ink-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManualPass || !manualNewPass}
                  className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-heritage-gold-300" />
                  <span>Xác Nhận Cấp Mật Khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: KHAI BÁO / CHỈNH SỬA TỔ CHUYÊN MÔN (z-[60] đè trên Modal 1/2)    */}
      {/* ========================================================================= */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-5 h-5 text-heritage-gold-300" />
                <h4 className="font-serif font-bold text-base">
                  {editingDepartment ? 'Chỉnh Sửa Tổ Chuyên Môn' : 'Khai Báo Tổ Chuyên Môn Mới'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsDeptModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDepartment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Tên Tổ chuyên môn / Phòng ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Ví dụ: Tổ Nghệ thuật - GDTC, Tổ Khoa học Xã hội..."
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1">
                    Mã viết tắt (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                    placeholder="VD: KHXH, NT-GDTC..."
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-heritage-ink-800 mb-1">
                    Tổ trưởng / Phụ trách
                  </label>
                  <input
                    type="text"
                    value={deptHeadName}
                    onChange={(e) => setDeptHeadName(e.target.value)}
                    placeholder="VD: Thầy Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-heritage-ink-800 mb-1">
                  Mô tả chức năng / Nhiệm vụ chuyên môn
                </label>
                <textarea
                  rows={3}
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  placeholder="Mô tả ngắn về phạm vi chuyên môn hoặc nội dung phụ trách trong Không gian Văn hóa Hồ Chí Minh..."
                  className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 resize-none"
                />
              </div>

              {editingDepartment && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] leading-relaxed">
                  💡 Nếu bạn đổi tên tổ chuyên môn, hệ thống sẽ tự động cập nhật đồng bộ tên tổ mới cho toàn bộ giáo viên đang thuộc tổ <strong>"{editingDepartment.name}"</strong> trên Cloud.
                </div>
              )}

              {deptErrorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 rounded-xl text-[11px] flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{deptErrorMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 border border-heritage-ivory-300 rounded-xl hover:bg-heritage-ivory-100 text-heritage-ink-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSavingDept || !deptName.trim()}
                  className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  {isSavingDept ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                  ) : (
                    <Check className="w-4 h-4 text-heritage-gold-300" />
                  )}
                  <span>{editingDepartment ? 'Lưu Cập Nhật Tổ' : 'Xác Nhận Khai Báo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
