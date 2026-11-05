import React, { useState, useEffect } from 'react';
import { Home, Compass, BookOpen, Award, GraduationCap } from 'lucide-react';

interface BottomNavProps {
  onNavClick: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onNavClick }) => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'spotlight', 'timeline', 'resources', 'activities'];
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Trang chủ', icon: Home },
    { id: 'spotlight', label: 'Sứ mệnh', icon: GraduationCap },
    { id: 'timeline', label: 'Lịch sử', icon: Compass },
    { id: 'resources', label: 'Tư liệu', icon: BookOpen },
    { id: 'activities', label: 'Hoạt động', icon: Award },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng nhanh trên di động"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-heritage-gold-300/80 shadow-[0_-3px_12px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-transform duration-300"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[44px] rounded-xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-heritage-red-700 font-bold scale-105'
                  : 'text-heritage-ink-500 hover:text-heritage-red-600 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-heritage-red-50 text-heritage-red-700' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-heritage-gold-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'text-heritage-red-800 font-bold' : 'text-heritage-ink-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
