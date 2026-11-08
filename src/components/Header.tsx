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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#4A080B] border-b border-[#D4AF37]/35 shadow-lg shadow-black/25 ${
        isScrolled ? 'backdrop-blur-md bg-[#4A080B]/95 shadow-xl' : ''
      }`}
    >
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 2xl:px-12 h-14 sm:h-16 xl:h-[78px] 2xl:h-[84px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & School Name - Hiển thị trang trọng, không bị cắt chữ */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center space-x-2.5 sm:space-x-3 xl:space-x-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {/* Logo Biểu Tượng tròn với viền chỉ vàng kim */}
          <div className="relative flex-shrink-0">
            <img
              src="/images/logo-bieu-tuong.png"
              alt="Biểu trưng Không gian văn hóa Hồ Chí Minh"
              className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 object-contain rounded-full ring-2 ring-[#D4AF37]/50 shadow-md group-hover:scale-105 transition-transform p-0.5 bg-[#380407]"
            />
          </div>

          <div className="flex flex-col justify-center">
            {/* Dòng 1: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH */}
            <span className="font-serif font-bold text-[12px] sm:text-xs md:text-sm xl:text-[13px] 2xl:text-[15px] tracking-normal text-[#F8E8D0] group-hover:text-[#D4AF37] transition-colors leading-tight whitespace-nowrap">
              KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
            </span>
            {/* Dòng 2: Tên trường THCS Nguyễn Trung Trực */}
            <span className="text-[10px] sm:text-[11px] md:text-xs xl:text-[11px] 2xl:text-[12px] font-medium text-[#DCC77B] leading-tight mt-0.5 tracking-wide whitespace-nowrap">
              THCS Nguyễn Trung Trực • Thới An, Q.12
            </span>
          </div>
        </div>

        {/* Desktop Navigation (>= 1280px, tối ưu khoảng cách cho laptop 1280-1440px và desktop lớn) */}
        <nav className="hidden xl:flex items-center space-x-1 min-[1440px]:space-x-1.5 2xl:space-x-2 flex-shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2 py-1.5 min-[1440px]:px-2.5 min-[1440px]:py-2 rounded-lg text-[13px] min-[1440px]:text-[13.5px] 2xl:text-[14px] font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-[#8B151B] text-white shadow-sm shadow-black/30 font-semibold border border-[#D4AF37]/40'
                    : 'text-[#F8E8D0] hover:text-[#D4AF37] hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <span className="hidden min-[1440px]:inline">{item.label}</span>
                <span className="inline min-[1440px]:hidden">{item.shortLabel || item.label}</span>
              </button>
            );
          })}

          {/* Nút Trợ lý AI */}
          <button
            onClick={onOpenChatbotPreview}
            className="ml-1.5 min-[1440px]:ml-2 px-2.5 min-[1440px]:px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E0BE4C] active:bg-[#B89025] text-[#4A080B] font-bold text-xs min-[1440px]:text-[13px] rounded-lg shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap flex-shrink-0 border border-[#F4EFD5]/40"
            title="Tìm hiểu về Trợ lý ảo AI đang phát triển"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4A080B] flex-shrink-0" />
            <span>Trợ lý AI</span>
          </button>

          {/* Cụm CMS Quản trị & Đăng xuất hợp nhất */}
          {user ? (
            <div className="flex items-center ml-1.5 min-[1440px]:ml-2 bg-[#8B151B] border border-[#D4AF37]/60 rounded-lg shadow-sm overflow-hidden flex-shrink-0">
              <button
                onClick={onOpenCmsDashboard}
                className="px-2.5 min-[1440px]:px-3 py-1.5 text-white hover:text-[#D4AF37] font-semibold text-xs min-[1440px]:text-[13px] flex items-center space-x-1.5 transition-colors whitespace-nowrap"
                title="Mở Bảng điều khiển Quản trị CMS"
              >
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>CMS: {profile?.full_name ? profile.full_name.split(' ').slice(-1)[0] : 'Quản trị'}</span>
              </button>

              {/* Vạch ngăn cách mảnh */}
              <div className="w-[1px] h-4 bg-[#D4AF37]/40" aria-hidden="true" />

              {/* Nút Đăng xuất gắn liền trong cụm CMS */}
              <button
                onClick={logout}
                className="px-2 py-1.5 text-[#F8E8D0] hover:text-white hover:bg-red-800/80 transition-colors flex items-center justify-center"
                title="Đăng xuất khỏi phiên Quản trị CMS"
                aria-label="Đăng xuất khỏi CMS"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="ml-1.5 min-[1440px]:ml-2 px-2.5 min-[1440px]:px-3 py-1.5 bg-[#8B151B] hover:bg-[#A82229] active:bg-[#730E14] text-[#F8E8D0] hover:text-white border border-[#D4AF37]/50 font-semibold text-xs min-[1440px]:text-[13px] rounded-lg shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap flex-shrink-0"
              title="Đăng nhập Cán bộ / Ban Quản trị"
            >
              <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </nav>

        {/* Mobile & Tablet (< 1280px) Navigation Toggle */}
        <div className="flex items-center space-x-2 xl:hidden flex-shrink-0">
          {/* Trên Tablet (>= 640px) có thể hiển thị nút tắt nhanh CMS nếu đã đăng nhập */}
          {user && (
            <button
              onClick={onOpenCmsDashboard}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-[#8B151B] hover:bg-[#A82229] text-white rounded-lg text-xs font-semibold shadow-sm border border-[#D4AF37]/50"
              aria-label="Vào CMS Quản trị"
              title="Bảng điều khiển CMS"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>CMS</span>
            </button>
          )}

          {/* Nút Hamburger Menu chính - Luôn hiện trên Mobile & Tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-lg text-[#F8E8D0] hover:text-[#D4AF37] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/30 bg-black/20"
            aria-expanded={mobileMenuOpen}
            aria-label="Mở thực đơn điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="xl:hidden fixed inset-0 top-[56px] sm:top-[64px] bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="xl:hidden fixed inset-x-0 top-[56px] sm:top-[64px] z-40 bg-[#4A080B] border-b-2 border-[#D4AF37] shadow-2xl px-4 pt-3 pb-6 animate-fadeIn transition-all max-h-[82vh] overflow-y-auto">
            {/* Quick Actions in Drawer: Đăng nhập / CMS & Trợ lý AI */}
            <div className="pb-3 mb-3 border-b border-[#D4AF37]/30 space-y-2">
              {user ? (
                <div className="flex items-center space-x-2 bg-[#8B151B] border border-[#D4AF37]/60 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenCmsDashboard(); }}
                    className="flex-1 py-2 px-3 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span>Bảng Quản trị CMS ({profile?.full_name ? profile.full_name.split(' ').slice(-1)[0] : 'Admin'})</span>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="p-2 text-[#F8E8D0] hover:text-white hover:bg-red-800/80 rounded-lg"
                    title="Đăng xuất"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                  className="w-full py-2.5 px-3 bg-[#8B151B] hover:bg-[#A82229] text-[#F8E8D0] hover:text-white border border-[#D4AF37]/70 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>Đăng Nhập Cán bộ / Ban Quản trị</span>
                </button>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenChatbotPreview(); }}
                className="w-full py-2.5 px-3 bg-[#D4AF37] hover:bg-[#E0BE4C] text-[#4A080B] font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors border border-[#F4EFD5]/40"
              >
                <Sparkles className="w-4 h-4 text-[#4A080B]" />
                <span>Trò chuyện với Trợ lý ảo AI (Đang phát triển)</span>
              </button>
            </div>

            {/* Navigation Links in Drawer */}
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
                        ? 'bg-[#8B151B] text-white font-semibold shadow-sm border border-[#D4AF37]/40'
                        : 'text-[#F8E8D0] hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-[#DCC77B]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 text-center">
              <p className="text-xs text-[#E9DEAA] font-medium">
                Không gian văn hóa Hồ Chí Minh • Trường THCS Nguyễn Trung Trực
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
