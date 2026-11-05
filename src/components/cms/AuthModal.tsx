import React, { useState } from 'react';
import { X, Lock, Mail, Shield, User, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
              <Shield className="w-5 h-5 text-heritage-gold-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Cổng Quản Trị & Biên Tập Không Gian Số
              </h3>
              <p className="text-xs text-heritage-gold-200">
                Môi trường Sandbox thử nghiệm an toàn • Trường THCS Nguyễn Trung Trực
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
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

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
              Hoặc nhập tài khoản thủ công
            </span>
          </div>

          {/* Form đăng nhập thông thường */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="test-editor-alpha@sandbox.test"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-heritage-ivory-400 rounded-lg text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-heritage-ink-800 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-heritage-ink-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-heritage-ivory-400 rounded-lg text-xs text-heritage-ink-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 bg-heritage-ivory-200 border-t border-heritage-ivory-300 text-center">
          <p className="text-[11px] text-heritage-ink-500">
            Hệ thống quản lý không gian văn hóa số • Tuân thủ Nghị định 13/2023/NĐ-CP
          </p>
        </div>
      </div>
    </div>
  );
};
