import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Compass, Award, Calendar, Phone, Home, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenChatbotPreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChatbotPreview }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['hero', 'about', 'timeline', 'resources', 'learning', 'activities', 'contact'];
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
    { id: 'about', label: 'Giới thiệu', icon: Sparkles },
    { id: 'timeline', label: 'Chủ tịch Hồ Chí Minh', icon: Compass },
    { id: 'resources', label: 'Kho tư liệu', icon: BookOpen },
    { id: 'learning', label: 'Góc học tập', icon: Award },
    { id: 'activities', label: 'Hoạt động', icon: Calendar },
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
          ? 'glass-header shadow-md border-b border-heritage-gold-300/40 py-2.5'
          : 'bg-heritage-ivory-100/95 border-b border-heritage-ivory-300 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & School Name */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none flex-shrink-0 min-w-0"
          >
            {/* Logo Biểu Tượng */}
            <img
              src="/images/logo-bieu-tuong.png"
              alt="Biểu trưng Không gian văn hóa Hồ Chí Minh"
              className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <span className="font-serif font-black text-xs sm:text-sm md:text-base xl:text-[15px] 2xl:text-lg tracking-tight sm:tracking-normal xl:tracking-wide text-heritage-red-700 leading-tight xl:whitespace-nowrap">
                <span className="inline-block xl:inline">KHÔNG GIAN VĂN HÓA</span>{' '}
                <span className="inline-block xl:inline whitespace-nowrap">HỒ CHÍ MINH</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-heritage-gold-600 leading-tight mt-0.5 truncate sm:overflow-visible sm:whitespace-nowrap">
                Trường THCS Nguyễn Trung Trực • Phường Thới An
              </span>
            </div>
          </div>

          {/* Desktop Navigation (>= 1280px for optimal spacing) */}
          <nav className="hidden xl:flex items-center space-x-0.5 2xl:space-x-1 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2 2xl:px-3 py-1.5 rounded-lg text-[13px] 2xl:text-sm transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-red-600 focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-heritage-red-700 hover:bg-heritage-red-800 text-white shadow-sm shadow-heritage-red-900/30 font-semibold'
                      : 'text-heritage-ink-800 hover:text-heritage-red-700 hover:bg-heritage-red-100/70 active:bg-heritage-red-100 font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={onOpenChatbotPreview}
              className="ml-1.5 2xl:ml-2.5 px-2.5 2xl:px-3.5 py-1.5 bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 hover:brightness-105 font-bold text-xs rounded-full shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap flex-shrink-0"
              title="Tìm hiểu về Trợ lý ảo AI đang phát triển"
            >
              <Sparkles className="w-3.5 h-3.5 text-heritage-red-950 flex-shrink-0" />
              <span>Trợ lý AI (GĐ2)</span>
            </button>
          </nav>

          {/* Mobile & Tablet (< 1280px) Toggle Button */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 xl:hidden flex-shrink-0">
            <button
              onClick={onOpenChatbotPreview}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-heritage-gold-100 text-heritage-red-900 rounded-md border border-heritage-gold-300 text-xs font-semibold flex items-center space-x-1 flex-shrink-0"
              aria-label="Thông tin Trợ lý AI"
            >
              <Sparkles className="w-4 h-4 text-heritage-gold-600 flex-shrink-0" />
              <span className="hidden sm:inline text-[11px] sm:text-xs">AI Sắp ra mắt</span>
              <span className="sm:hidden text-[10px] font-bold">AI</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-md text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 focus:outline-none focus:ring-2 focus:ring-heritage-red-600 flex-shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-label="Mở thực đơn điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] bg-heritage-ivory-100/98 backdrop-blur-md border-b border-heritage-gold-300/50 shadow-xl px-4 pt-3 pb-6 animate-fadeIn transition-all max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-lg text-sm sm:text-base font-medium text-left transition-all ${
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
      )}
    </header>
  );
};
