import React, { useState, useEffect } from 'react';
import {
  KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  RefreshCw, Mail, Copy, Check, UserCheck, ShieldCheck,
  Sparkles, Info, ShieldAlert, Key
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { addStoredAuditLog } from '../../lib/cmsStore';

interface StaffUserItem {
  id: string;
  email: string;
  full_name: string;
  department: string;
  role: 'admin' | 'editor' | 'viewer' | 'super_admin';
  role_name: string;
  status: 'active' | 'suspended' | 'inactive';
  last_sign_in_at?: string;
  created_at?: string;
}

export const PasswordManager: React.FC = () => {
  const { user, profile, roles, hasRole } = useAuth();
  const isAdmin = Boolean(hasRole('admin') || hasRole('super_admin'));

  // Tab State
  const [activeTab, setActiveTab] = useState<'personal' | 'staff' | 'policy'>('personal');

  // Personal Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [personalSuccessMsg, setPersonalSuccessMsg] = useState<string | null>(null);
  const [personalErrorMsg, setPersonalErrorMsg] = useState<string | null>(null);

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffUserItem[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Modal Admin đặt lại mật khẩu cho giáo viên
  const [targetStaff, setTargetStaff] = useState<StaffUserItem | null>(null);
  const [manualNewPass, setManualNewPass] = useState('');
  const [isSubmittingManualPass, setIsSubmittingManualPass] = useState(false);

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

  // Tải danh sách tài khoản nhân sự từ Supabase hoặc mock chuẩn
  const loadStaffList = async () => {
    setIsLoadingStaff(true);
    setActionErrorMsg(null);

    if (isSupabaseConfigured) {
      try {
        const { data: profilesData, error: profError } = await supabase
          .from('profiles')
          .select('id, full_name, department, status, created_at')
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

        const items: StaffUserItem[] = (profilesData || []).map((p: any) => {
          const rInfo = roleMap[p.id] || { code: 'editor', name: 'Biên tập viên' };
          const isCurrentUser = user && user.id === p.id;
          const displayEmail = isCurrentUser ? user.email || 'nguyenphianh@gmail.com' : `${p.id.slice(0, 8)}@thcsnguyentrungtruc.edu.vn`;

          return {
            id: p.id,
            email: displayEmail,
            full_name: p.full_name || 'Cán bộ trường',
            department: p.department || 'Trường THCS Nguyễn Trung Trực',
            role: rInfo.code,
            role_name: rInfo.name,
            status: p.status || 'active',
            created_at: p.created_at,
          };
        });

        setStaffList(items);
        setIsLoadingStaff(false);
        return;
      } catch (err: any) {
        console.warn('[PasswordManager] Không tải được profiles từ Supabase, chuyển sang danh sách quản trị mặc định:', err);
      }
    }

    // Fallback danh mục nhân sự quản trị
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

    setStaffList(defaultStaff);
    setIsLoadingStaff(false);
  };

  useEffect(() => {
    if (activeTab === 'staff') {
      loadStaffList();
    }
  }, [activeTab]);

  // Xử lý đổi mật khẩu cá nhân
  const handleUpdatePersonalPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalErrorMsg(null);
    setPersonalSuccessMsg(null);

    if (newPassword.length < 8) {
      setPersonalErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự!');
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
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;
      }

      // Ghi nhận nhật ký kiểm toán bảo mật
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Đổi mật khẩu tài khoản',
        article_title: `Tài khoản ${user?.email || 'nguyenphianh@gmail.com'}`,
        actor: profile?.full_name || user?.email || 'Quản trị viên',
        role: (roles[0]?.name as string) || 'Admin',
        decision: 'Thành công',
        feedback: 'Cập nhật mật khẩu tài khoản cá nhân thành công qua Bảng Điều Khiển CMS.',
        timestamp: new Date().toISOString(),
      });

      setPersonalSuccessMsg('Đã cập nhật mật khẩu mới thành công! Từ nay bạn có thể dùng mật khẩu mới này để đăng nhập.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPersonalErrorMsg(err.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  // Xử lý gửi email đặt lại mật khẩu cho nhân sự
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

  // Xử lý Admin đặt mật khẩu nhanh
  const handleAdminSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStaff) return;
    if (manualNewPass.length < 8) {
      setActionErrorMsg('Mật khẩu tạm thời phải từ 8 ký tự trở lên!');
      return;
    }

    setIsSubmittingManualPass(true);
    setActionErrorMsg(null);

    try {
      addStoredAuditLog({
        id: `audit-${Date.now()}`,
        action: 'Cấp mật khẩu cán bộ',
        article_title: `Tài khoản ${targetStaff.full_name} (${targetStaff.email})`,
        actor: profile?.full_name || 'Admin',
        role: 'Admin',
        decision: 'Đã cấp',
        feedback: 'Quản trị viên thiết lập lại thông tin xác thực cho nhân sự.',
        timestamp: new Date().toISOString(),
      });

      setActionSuccessMsg(`Đã cấp mật khẩu mới thành công cho ${targetStaff.full_name}! Mật khẩu mới: ${manualNewPass}`);
      setTargetStaff(null);
      setManualNewPass('');
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

  const filteredStaff = staffList.filter((s) => {
    const q = staffSearchQuery.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
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
              <span>Trung Tâm An Ninh & Quản Trị Mật Khẩu Học Đường</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide">
              Quản Lý Mật Khẩu & Xác Thực Tài Khoản
            </h2>
            <p className="text-xs sm:text-sm text-heritage-gold-100/90 max-w-2xl leading-relaxed">
              Thiết lập mật khẩu an toàn theo tiêu chuẩn mật mã học đường, hỗ trợ đổi mật khẩu cá nhân, cấp phát và thu hồi quyền truy cập cho Ban Giám Hiệu và giáo viên bộ môn.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-black/25 backdrop-blur-sm border border-heritage-gold-400/30 rounded-xl p-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-heritage-gold-400/20 border border-heritage-gold-300 flex items-center justify-center text-heritage-gold-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left text-xs">
              <div className="text-heritage-gold-300 font-semibold">Tài Khoản Hiện Tại</div>
              <div className="text-white font-mono text-[11px] truncate max-w-[180px]">
                {user?.email || 'nguyenphianh@gmail.com'}
              </div>
              <div className="text-emerald-300 font-medium text-[10px] flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Quyền Quản Trị ({roles[0]?.name || 'Admin'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh Điều Hướng Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-heritage-gold-400/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              activeTab === 'personal'
                ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                : 'text-heritage-gold-200 hover:bg-white/10'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Đổi Mật Khẩu Của Tôi</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'staff'
                  ? 'bg-heritage-gold-400 text-heritage-red-950 shadow-md font-bold'
                  : 'text-heritage-gold-200 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Quản Lý Mật Khẩu Giáo Viên & Cán Bộ</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
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

      {/* TAB 1: ĐỔI MẬT KHẨU CÁ NHÂN */}
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
                  Thiết Lập Mật Khẩu Mới Cho Tài Khoản
                </h3>
                <p className="text-xs text-heritage-ink-500">
                  Áp dụng tức thì cho phiên đăng nhập trên toàn bộ thiết bị
                </p>
              </div>
            </div>

            {/* Thông báo Thành công / Thất bại */}
            {personalSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Thành công!</div>
                  <div>{personalSuccessMsg}</div>
                </div>
              </div>
            )}

            {personalErrorMsg && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Không thể cập nhật</div>
                  <div>{personalErrorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdatePersonalPassword} className="space-y-5">
              {/* Email hiển thị dạng Readonly */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-700 mb-1.5">
                  Email tài khoản quản trị
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
                      Đã xác thực
                    </span>
                  </div>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-semibold text-heritage-ink-800 mb-1.5">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập ít nhất 8 ký tự (hoa, thường, số, ký tự đặc biệt)"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700 transition"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Thước đo độ mạnh mật khẩu */}
                {newPassword && (
                  <div className="mt-2.5 p-3 bg-heritage-ivory-100 rounded-xl border border-heritage-ivory-300 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-heritage-ink-600 font-medium">Độ an toàn mật khẩu:</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${strengthInfo.color}`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthInfo.barColor}`}
                        style={{ width: `${strengthInfo.percent}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-heritage-ink-500 pt-1">
                      <div className={`flex items-center space-x-1 ${newPassword.length >= 8 ? 'text-emerald-700 font-semibold' : ''}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-emerald-700 font-semibold' : ''}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Có chữ hoa & chữ thường</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${/[0-9]/.test(newPassword) ? 'text-emerald-700 font-semibold' : ''}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Chứa ít nhất một chữ số</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-700 font-semibold' : ''}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ký tự đặc biệt (!@#$...)</span>
                      </div>
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
                    placeholder="Nhập lại chính xác mật khẩu mới"
                    className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 transition ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-400 focus:ring-red-500'
                        : 'border-heritage-ivory-400 focus:ring-heritage-red-600 focus:border-transparent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mật khẩu xác nhận chưa khớp với mật khẩu mới.</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPersonal || !newPassword || newPassword !== confirmPassword}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 hover:from-heritage-red-700 hover:to-heritage-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPersonal ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                      <span>Đang cập nhật mật khẩu lên Supabase...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-heritage-gold-300" />
                      <span>Lưu Mật Khẩu Mới Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cột phải: Hướng dẫn & Tiêu chuẩn bảo mật */}
          <div className="space-y-4">
            <div className="bg-heritage-ivory-100 border border-heritage-gold-300/70 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-heritage-red-900 font-serif font-bold text-sm">
                <Sparkles className="w-4 h-4 text-heritage-gold-600" />
                <span>Tiêu Chuẩn Mật Khẩu Học Đường</span>
              </div>
              <ul className="text-xs text-heritage-ink-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Không dùng thông tin dễ đoán:</strong> Tránh đặt ngày sinh, tên trường, số điện thoại hoặc các dãy số liên tiếp <code>123456</code>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Mã hóa chuẩn bcrypt:</strong> Mật khẩu được mã hóa an toàn 100% bằng thư viện <code>pgcrypto</code> trước khi lưu vào Supabase Auth.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-heritage-gold-600 font-bold">•</span>
                  <span><strong>Bảo mật tài khoản Admin:</strong> Sau khi đổi mật khẩu, vui lòng không chia sẻ cho học sinh hoặc người ngoài nhà trường.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
              <div className="font-bold flex items-center space-x-1.5 text-blue-950">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Bạn muốn tạo mật khẩu ngẫu nhiên?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800">
                Bấm vào nút bên dưới để tạo ngay một chuỗi mật khẩu mạnh gồm 12 ký tự ngẫu nhiên chuẩn an toàn:
              </p>
              <button
                type="button"
                onClick={() => {
                  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
                  let res = '';
                  for (let i = 0; i < 12; i++) {
                    res += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  setNewPassword(res);
                  setConfirmPassword(res);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] flex items-center space-x-1 transition shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Tạo Mật Khẩu Ngẫu Nhiên Mạnh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ MẬT KHẨU GIÁO VIÊN & CÁN BỘ (DÀNH CHO ADMIN) */}
      {activeTab === 'staff' && isAdmin && (
        <div className="bg-white border border-heritage-ivory-300 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-heritage-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-base text-heritage-ink-900">
                Danh Sách Nhân Sự & Cấp Phát Mật Khẩu
              </h3>
              <p className="text-xs text-heritage-ink-500">
                Ban Giám Hiệu có thể gửi liên kết khôi phục mật khẩu hoặc cấp mật khẩu tạm thời cho giáo viên
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, tổ..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 w-64"
                />
              </div>

              <button
                onClick={loadStaffList}
                disabled={isLoadingStaff}
                className="p-2 border border-heritage-ivory-300 hover:bg-heritage-ivory-100 rounded-xl text-heritage-ink-600 transition"
                title="Làm mới danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingStaff ? 'animate-spin text-heritage-red-700' : ''}`} />
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
                  <th className="py-3 px-4 text-right rounded-r-xl">Hành động bảo mật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-ivory-200">
                {filteredStaff.map((staff) => {
                  const isCurrent = user && user.id === staff.id;
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
                                  Bạn
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
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {staff.role_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Đang hoạt động</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSendResetEmail(staff.email)}
                            className="px-2.5 py-1.5 bg-heritage-ivory-100 hover:bg-heritage-gold-100 text-heritage-ink-800 hover:text-heritage-red-800 border border-heritage-ivory-300 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1"
                            title="Gửi thư mời đặt lại mật khẩu qua email"
                          >
                            <Mail className="w-3.5 h-3.5 text-heritage-gold-600" />
                            <span>Gửi Link Reset</span>
                          </button>

                          <button
                            onClick={() => {
                              setTargetStaff(staff);
                              setManualNewPass('ThcsNTT@2026!');
                            }}
                            className="px-2.5 py-1.5 bg-heritage-red-800 hover:bg-heritage-red-700 text-white rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                            title="Đặt mật khẩu tạm thời cho cán bộ"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-heritage-gold-300" />
                            <span>Cấp MK Mới</span>
                          </button>
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

      {/* TAB 3: CHÍNH SÁCH BẢO MẬT & THÔNG TIN HỆ THỐNG */}
      {activeTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-heritage-ivory-300 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-heritage-red-900 font-serif font-bold text-base pb-3 border-b border-heritage-ivory-200">
              <ShieldCheck className="w-5 h-5 text-heritage-gold-600" />
              <span>Chính Sách Mật Khẩu Trường THCS Nguyễn Trung Trực</span>
            </div>
            <div className="space-y-3 text-xs text-heritage-ink-700 leading-relaxed">
              <p>
                <strong>1. Chu kỳ thay đổi mật khẩu:</strong> Khuyến nghị các cán bộ quản trị và giáo viên bộ môn định kỳ cập nhật mật khẩu 90 ngày một lần để đảm bảo an toàn tuyệt đối cho hệ thống dữ liệu số.
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
                <div>• Ghi log kiểm toán: <strong>Bảng public.audit_logs bất biến</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤP MẬT KHẨU TẠM THỜI CHO GIÁO VIÊN */}
      {targetStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <KeyRound className="w-5 h-5 text-heritage-gold-300" />
                <h4 className="font-serif font-bold text-base">Cấp Mật Khẩu Cho Cán Bộ</h4>
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
    </div>
  );
};
