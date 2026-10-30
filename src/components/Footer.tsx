import React from 'react';
import { ShieldCheck, MapPin, Phone, ChevronUp, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#hero', label: 'Trang chủ' },
    { href: '#about', label: 'Về không gian văn hóa' },
    { href: '#timeline', label: 'Chủ tịch Hồ Chí Minh' },
    { href: '#resources', label: 'Kho tư liệu số hóa' },
    { href: '#learning', label: 'Góc học tập THCS' },
    { href: '#activities', label: 'Hoạt động nhà trường' },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-b from-heritage-red-950 to-black text-heritage-ivory-100 border-t-2 border-heritage-gold-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-heritage-red-800/80">
          {/* Col 1: Brand & School info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-heritage-red-800 border border-heritage-gold-400 flex items-center justify-center flex-shrink-0 shadow-md">
                <Landmark className="w-5 h-5 text-heritage-gold-300" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base sm:text-lg text-heritage-ivory-50 tracking-wide">
                  KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
                </h3>
                <p className="text-xs sm:text-sm font-bold text-heritage-gold-300">
                  TRƯỜNG THCS NGUYỄN TRUNG TRỰC
                </p>
              </div>
            </div>

            <p className="text-sm text-heritage-ivory-100/90 leading-relaxed max-w-md">
              Đơn vị xây dựng: <strong>Trường THCS Nguyễn Trung Trực</strong>, Phường Thới An, Thành phố Hồ Chí Minh.
              Nền tảng số hóa giáo dục truyền thống, lan tỏa tư tưởng, đạo đức, phong cách Chủ tịch Hồ Chí Minh trong học đường.
            </p>

            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-heritage-red-900/60 border border-heritage-gold-400/30 text-xs sm:text-sm text-heritage-gold-200">
              <ShieldCheck className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
              <span>Dự án giáo dục học đường trực tuyến</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm sm:text-base font-bold uppercase tracking-wider text-heritage-gold-400">
              Điều Hướng Nhanh
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-heritage-ivory-100/80 hover:text-heritage-gold-300 hover:translate-x-1 inline-block transition-transform duration-200"
                  >
                    • {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Official Contact Box (Ready for later update) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm sm:text-base font-bold uppercase tracking-wider text-heritage-gold-400 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-heritage-gold-400" />
              <span>Thông Tin Liên Hệ</span>
            </h4>

            {/* Official notice box to be filled by School Admin */}
            <div className="p-4 sm:p-5 rounded-xl bg-heritage-red-900/40 border border-heritage-red-700/60 text-sm leading-relaxed space-y-2.5">
              <p className="text-heritage-ivory-100 font-semibold">
                Đơn vị chủ quản: Trường THCS Nguyễn Trung Trực
              </p>
              <div className="flex items-start space-x-2 text-heritage-ivory-100/90 text-sm">
                <MapPin className="w-4 h-4 text-heritage-gold-400 flex-shrink-0 mt-0.5" />
                <span>Phường Thới An, Thành phố Hồ Chí Minh</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-heritage-red-800 text-xs text-heritage-gold-200/90 italic leading-relaxed">
                * Lưu ý: Các thông tin chi tiết về địa chỉ trụ sở, số điện thoại văn phòng và hòm thư điện tử chính thức sẽ được Ban Giám hiệu nhà trường phê duyệt và cập nhật bổ sung trong giai đoạn vận hành chính thức.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-heritage-ivory-100/80 gap-4">
          <div className="text-center sm:text-left">
            <p className="font-medium text-heritage-ivory-100/95">
              © 2026 <strong>KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH – TRƯỜNG THCS NGUYỄN TRUNG TRỰC</strong>.
            </p>
            <p className="text-xs text-heritage-ivory-100/70 mt-1">
              Phường Thới An, Thành phố Hồ Chí Minh. Nền tảng phục vụ công tác giáo dục truyền thống học đường.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-heritage-red-900/80 hover:bg-heritage-red-800 text-heritage-gold-300 border border-heritage-gold-400/40 transition-all text-xs sm:text-sm font-semibold shadow-sm"
            aria-label="Cuộn về đầu trang"
          >
            <span>Lên đầu trang</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
