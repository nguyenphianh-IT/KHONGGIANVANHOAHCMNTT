import React, { useState, useEffect } from 'react';
import {
  X, Lock, Mail, Shield, User, Sparkles, AlertCircle, CheckCircle2,
  KeyRound, ArrowLeft, Eye, EyeOff, Send, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const QUICK_PERSONAS = [
  {
    roleName: 'Biên Tập Viên A (Giáo viên Lịch sử)',
    email: 'test-editor-alpha@sandbox.test',
    badge: 'Biên tập & nộp duyệt bài',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    roleName: 'Biên Tập Viên B (Giáo viên Văn thể mỹ)',
    email: 'test-editor-beta@sandbox.test',
    badge: 'Tác giả bài xuất bản',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    roleName: 'Cán Bộ Quản Trị Trưởng (Ban Giám Hiệu)',
    email: 'test-admin-chief@sandbox.test',
    badge: 'Duyệt bài 4 mắt & Xuất bản',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    roleName: 'Quản Trị Viên Tối Cao (Super Admin)',
    email: 'test-superadmin@sandbox.test',
    badge: 'Toàn quyền cấu hình & Kiểm toán',
    badgeColor: 'bg-heritage-red-100 text-heritage-red-800 border-heritage-red-200',
  },
  {
    roleName: 'Người Học Thử Nghiệm 01 (Học sinh)',
    email: 'test-student-01@sandbox.test',
    badge: 'Xem tư liệu & Thi trắc nghiệm',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password' | 'reset_password'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tự động nhận diện token khôi phục mật khẩu từ URL khi người dùng bấm link email
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setAuthMode('reset_password');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý đăng nhập
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const { error } = await login(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } else {
      setSuccessMsg('Đăng nhập thành công!');
      setTimeout(() => {
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    }
  };

  // Xử lý gửi email đặt lại mật khẩu (Quên mật khẩu)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Vui lòng nhập địa chỉ email của bạn!');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
      }

      setSuccessMsg(`Đã gửi liên kết khôi phục mật khẩu tới ${email}! Vui lòng kiểm tra hộp thư đến (hoặc hòm thư rác/Spam).`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý lưu mật khẩu mới sau khi bấm link recovery
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      }

      setSuccessMsg('Đặt lại mật khẩu mới thành công! Đang chuyển hướng vào hệ thống...');
      // Xóa hash URL recovery
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      setTimeout(() => {
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể cập nhật mật khẩu mới. Token có thể đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickPersona = async (personaEmail: string) => {
    setEmail(personaEmail);
    setPassword('SandboxTest@2026');
    setErrorMsg(null);
    setIsLoading(true);

    const { error } = await login(personaEmail, 'SandboxTest@2026');
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Đăng nhập thất bại.');
    } else {
      setSuccessMsg('Đăng nhập thành công với vai trò kiểm thử!');
      setTimeout(() => {
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-ink-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-heritage-ivory-100 border border-heritage-gold-300 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between border-b border-heritage-gold-400/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-heritage-gold-400/20 rounded-lg border border-heritage-gold-300/40">
              {authMode === 'login' ? (
                <Shield className="w-5 h-5 text-heritage-gold-300" />
              ) : (
                <KeyRound className="w-5 h-5 text-heritage-gold-300" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {authMode === 'login' && 'Cổng Quản Trị & Biên Tập Không Gian Số'}
                {authMode === 'forgot_password' && 'Khôi Phục Mật Khẩu Tài Khoản'}
                {authMode === 'reset_password' && 'Thiết Lập Mật Khẩu Mới'}
              </h3>
              <p className="text-xs text-heritage-gold-200">
                Trường THCS Nguyễn Trung Trực • Hệ thống xác thực bảo mật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Thông báo lỗi / thành công */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* CHẾ ĐỘ 1: ĐĂNG NHẬP (LOGIN MODE) */}
          {authMode === 'login' && (
            <>
              {/* Khu vực Chọn nhanh Vai trò Test Sandbox */}
              <div className="bg-heritage-ivory-200/70 border border-heritage-gold-300/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-heritage-red-800 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-heritage-gold-600" />
                    <span>Đăng nhập nhanh vai trò Sandbox (RFC 2606)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-heritage-gold-100 text-heritage-gold-800 border border-heritage-gold-300 rounded-full font-semibold">
                    Mật khẩu chung: SandboxTest@2026
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_PERSONAS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSelectQuickPersona(p.email)}
                      className="p-2.5 bg-white hover:bg-heritage-gold-50 border border-heritage-ivory-300 hover:border-heritage-gold-400 rounded-lg text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="font-semibold text-xs text-heritage-ink-900 group-hover:text-heritage-red-700 flex items-center justify-between">
                        <span>{p.roleName}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-heritage-ink-500 font-mono text-[10px] truncate max-w-[130px]">
                          {p.email}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-heritage-ivory-300 w-full" />
                <span className="bg-heritage-ivory-100 px-3 text-xs font-medium text-heritage-ink-500 uppercase">
                  Hoặc nhập tài khoản quản trị
                </span>
              </div>

              {/* Form đăng nhập thông thường */}
              <form onSubmit={handleSubmitLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-heritage-ink-800 mb-1">
                    Email tài khoản
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nguyenphianh@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-heritage-ink-800">
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot_password');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-heritage-red-700 hover:text-heritage-red-900 font-semibold transition"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Đang xử lý đăng nhập...</span>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Đăng Nhập Vào Bảng Quản Trị</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* CHẾ ĐỘ 2: QUÊN MẬT KHẨU (FORGOT PASSWORD MODE) */}
          {authMode === 'forgot_password' && (
            <div className="space-y-4">
              <div className="p-3 bg-heritage-ivory-200 border border-heritage-gold-300/50 rounded-xl text-xs text-heritage-ink-700 leading-relaxed">
                Nhập địa chỉ email tài khoản của bạn. Hệ thống sẽ gửi một liên kết bảo mật về hộp thư để bạn đặt lại mật khẩu mới.
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-heritage-ink-800 mb-1">
                    Email tài khoản của bạn
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nguyenphianh@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="w-1/3 py-2.5 px-3 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-800 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-2/3 py-2.5 px-4 bg-heritage-red-800 hover:bg-heritage-red-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-heritage-gold-300" />
                    ) : (
                      <Send className="w-4 h-4 text-heritage-gold-300" />
                    )}
                    <span>Gửi Liên Kết Khôi Phục</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CHẾ ĐỘ 3: ĐẶT MẬT KHẨU MỚI (RESET PASSWORD MODE - KHI BẤM LINK EMAIL) */}
          {authMode === 'reset_password' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Bạn đã xác thực phiên khôi phục thành công! Hãy nhập mật khẩu mới để hoàn tất việc thiết lập mật khẩu tài khoản.
                </span>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-heritage-ink-800 mb-1">
                    Mật khẩu mới (tối thiểu 8 ký tự)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-ink-400 hover:text-heritage-ink-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heritage-ink-800 mb-1">
                    Xác nhận lại mật khẩu mới
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-heritage-ivory-400 rounded-xl text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 hover:from-heritage-red-700 hover:to-heritage-red-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Đang cập nhật mật khẩu...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-heritage-gold-300" />
                      <span>Xác Nhận & Đăng Nhập CMS</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 bg-heritage-ivory-200 border-t border-heritage-ivory-300 text-center">
          <p className="text-[11px] text-heritage-ink-500">
            Hệ thống quản lý không gian văn hóa số • Trường THCS Nguyễn Trung Trực
          </p>
        </div>
      </div>
    </div>
  );
};
