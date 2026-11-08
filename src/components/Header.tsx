import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Compass, Award, Calendar, Phone, Home, Sparkles, Shield, LogIn, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenChatbotPreview: () => void;
  onOpenAuthModal: () => void;
  onOpenCmsDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChatbotPreview, onOpenAuthModal, onOpenCmsDashboard }) => {
  const { user, profile, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['hero', 'spotlight', 'timeline', 'resources', 'learning', 'activities', 'about', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Trang chủ', icon: Home },
    { id: 'spotlight', label: 'Tiêu điểm', icon: Flame },
    { id: 'timeline', label: 'Chủ tịch Hồ Chí Minh', shortLabel: 'Hồ Chí Minh', icon: Compass },
    { id: 'resources', label: 'Kho tư liệu', shortLabel: 'Tư liệu', icon: BookOpen },
    { id: 'learning', label: 'Góc học tập', shortLabel: 'Học tập', icon: Award },
    { id: 'activities', label: 'Hoạt động', icon: Calendar },
    { id: 'about', label: 'Giới thiệu', icon: Sparkles },
    { id: 'contact', label: 'Liên hệ', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header shadow-md border-b border-heritage-gold-300/40 py-2 sm:py-2.5'
          : 'bg-heritage-ivory-100/98 border-b border-heritage-ivory-300 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & School Name - Rút gọn thông minh trên màn hình nhỏ */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 cursor-pointer group select-none flex-shrink min-w-0"
          >
            {/* Logo Biểu Tượng */}
            <img
              src="/images/logo-bieu-tuong.png"
              alt="Biểu trưng Không gian văn hóa Hồ Chí Minh"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 xl:w-11 xl:h-11 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <span className="font-serif font-black text-[11px] sm:text-xs md:text-sm xl:text-[13px] 2xl:text-base tracking-tight text-heritage-red-700 leading-tight truncate">
                KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-heritage-gold-600 leading-tight mt-0.5 truncate">
                THCS Nguyễn Trung Trực • Thới An
              </span>
            </div>
          </div>

          {/* Desktop Navigation (>= 1280px, tối ưu khoảng cách cho laptop 1280-1440px và desktop lớn) */}
          <nav className="hidden xl:flex items-center space-x-1 2xl:space-x-1.5 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-1.5 2xl:px-2.5 py-1.5 rounded-lg text-xs 2xl:text-[13px] transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-red-600 focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-heritage-red-700 hover:bg-heritage-red-800 text-white shadow-sm shadow-heritage-red-900/30 font-semibold'
                      : 'text-heritage-ink-800 hover:text-heritage-red-700 hover:bg-heritage-red-100/70 active:bg-heritage-red-100 font-medium'
                  }`}
                >
                  <span className="hidden 2xl:inline">{item.label}</span>
                  <span className="inline 2xl:hidden">{item.shortLabel || item.label}</span>
                </button>
              );
            })}

            <button
              onClick={onOpenChatbotPreview}
              className="ml-1 2xl:ml-2 px-2 2xl:px-3 py-1.5 bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 hover:brightness-105 font-bold text-xs rounded-full shadow-sm flex items-center space-x-1 transition-all whitespace-nowrap flex-shrink-0"
              title="Tìm hiểu về Trợ lý ảo AI đang phát triển"
            >
              <Sparkles className="w-3.5 h-3.5 text-heritage-red-950 flex-shrink-0" />
              <span className="hidden 2xl:inline">Trợ lý AI (GĐ2)</span>
              <span className="inline 2xl:hidden">Trợ lý AI</span>
            </button>

            {/* Nút Đăng nhập / Vào CMS Quản trị */}
            {user ? (
              <div className="flex items-center space-x-1 ml-1 2xl:ml-2 flex-shrink-0">
                <button
                  onClick={onOpenCmsDashboard}
                  className="px-2.5 2xl:px-3 py-1.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs rounded-full shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap border border-heritage-gold-400/50"
                  title="Mở Bảng điều khiển Quản trị CMS"
                >
                  <Shield className="w-3.5 h-3.5 text-heritage-gold-300" />
                  <span>CMS: {profile?.full_name ? profile.full_name.split(' ').slice(-1)[0] : 'Quản trị'}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-heritage-ink-600 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 rounded-full transition-colors"
                  title="Đăng xuất khỏi phiên hiện tại"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="ml-1 2xl:ml-2 px-2.5 2xl:px-3 py-1.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-red-900 border border-heritage-gold-300/80 font-bold text-xs rounded-full shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap flex-shrink-0"
                title="Đăng nhập Cán bộ / Ban Quản trị"
              >
                <LogIn className="w-3.5 h-3.5 text-heritage-red-700" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </nav>

          {/* Mobile & Tablet (< 1280px) Navigation Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 xl:hidden flex-shrink-0">
            {/* Trên Tablet (>= 640px) có thể hiển thị nút tắt nhanh CMS nếu đã đăng nhập */}
            {user && (
              <button
                onClick={onOpenCmsDashboard}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg text-xs font-semibold shadow-sm border border-heritage-gold-400/40"
                aria-label="Vào CMS Quản trị"
                title="Bảng điều khiển CMS"
              >
                <Shield className="w-3.5 h-3.5 text-heritage-gold-300" />
                <span>CMS</span>
              </button>
            )}

            {/* Nút Hamburger Menu chính - Luôn hiện trên Mobile & Tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 p-1.5 sm:p-2 rounded-lg text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 flex items-center justify-center flex-shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-label="Mở thực đơn điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="xl:hidden fixed inset-0 top-[54px] sm:top-[60px] bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="xl:hidden fixed inset-x-0 top-[54px] sm:top-[60px] z-40 bg-heritage-ivory-100/98 backdrop-blur-md border-b-2 border-heritage-gold-400 shadow-2xl px-4 pt-3 pb-6 animate-fadeIn transition-all max-h-[82vh] overflow-y-auto">
            {/* Quick Actions in Drawer: Đăng nhập / CMS & Trợ lý AI */}
            <div className="pb-3 mb-3 border-b border-heritage-ivory-300 space-y-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenCmsDashboard(); }}
                    className="flex-1 py-2.5 px-3 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 border border-heritage-gold-400/50"
                  >
                    <Shield className="w-4 h-4 text-heritage-gold-300" />
                    <span>Bảng Quản trị CMS ({profile?.full_name ? profile.full_name.split(' ').slice(-1)[0] : 'Admin'})</span>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="p-2.5 text-heritage-ink-600 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 rounded-xl"
                    title="Đăng xuất"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                  className="w-full py-2.5 px-3 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-red-900 border border-heritage-gold-300/80 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4 text-heritage-red-700" />
                  <span>Đăng Nhập Cán bộ / Ban Quản trị</span>
                </button>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenChatbotPreview(); }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-heritage-red-950" />
                <span>Trợ lý ảo AI giáo dục (GĐ2)</span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm sm:text-base font-medium text-left transition-all ${
                      isActive
                        ? 'bg-heritage-red-700 text-white font-semibold shadow-sm'
                        : 'text-heritage-ink-800 hover:bg-heritage-red-50 hover:text-heritage-red-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-heritage-gold-300' : 'text-heritage-red-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-heritage-ivory-300 text-center">
              <p className="text-xs text-heritage-ink-500 font-medium">
                Không gian văn hóa Hồ Chí Minh • Trường THCS Nguyễn Trung Trực
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
