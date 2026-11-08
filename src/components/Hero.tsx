import React from 'react';
import { ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onViewResources: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onViewResources }) => {
  return (
    <section
      id="hero"
      aria-label="Không gian văn hóa Hồ Chí Minh"
      className="relative w-full overflow-x-hidden text-white bg-heritage-red-950 pt-16 sm:pt-20 md:pt-20 selection:bg-heritage-gold-400 selection:text-heritage-red-950"
    >
      {/* =========================================================================
          VÙNG 1: HÌNH ẢNH HERO BANNER ĐỘC LẬP (HERO VISUAL MEDIA)
          - Tách biệt hoàn toàn với vùng chữ để không che hình tượng Bác Hồ.
          - Mobile & Tablet dọc: Dùng hero-mobile.png (tỷ lệ 3:4), nằm trong luồng nội dung.
          - Desktop & Tablet ngang: Dùng hero-desktop.png (tỷ lệ 3:1 panorama).
          - Giữ tỷ lệ aspect-ratio chuẩn để hạn chế tối đa CLS (Cumulative Layout Shift).
      ========================================================================= */}
      <div className="w-full bg-heritage-red-950 flex justify-center items-center px-2 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-3">
        <div className="w-full portrait:max-w-md sm:portrait:max-w-lg md:portrait:max-w-xl landscape:max-w-7xl mx-auto flex justify-center">
          <picture className="w-full block">
            {/* 1. Tablet dọc (portrait) và cửa sổ tỷ lệ đứng (chiều cao > rộng, <= 1024px) */}
            <source
              media="(orientation: portrait) and (max-width: 1024px)"
              srcSet="/images/hero-mobile.png"
              width={1086}
              height={1448}
            />
            {/* 2. Màn hình di động hẹp (< 768px) bất kể hướng xoay */}
            <source
              media="(max-width: 767px)"
              srcSet="/images/hero-mobile.png"
              width={1086}
              height={1448}
            />
            {/* 3. Màn hình ngang (Tablet ngang, Laptop, Desktop lớn): Panorama 3:1 */}
            <img
              src="/images/hero-desktop.png"
              alt="Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực"
              width={2172}
              height={724}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-auto block object-contain select-none shadow-2xl shadow-black/50 portrait:rounded-xl sm:portrait:rounded-2xl landscape:rounded-xl md:landscape:rounded-2xl border border-heritage-gold-400/20"
            />
          </picture>
        </div>
      </div>

      {/* =========================================================================
          VÙNG 2: NỘI DUNG VĂN BẢN & ĐIỀU HƯỚNG (HERO CONTENT)
          - Nằm hoàn toàn bên dưới vùng hình ảnh, bảo toàn 100% hình tượng Bác Hồ.
          - Tối ưu kích thước chữ, khoảng cách và touch-target theo từng breakpoint.
      ========================================================================= */}
      <div className="relative w-full bg-gradient-to-b from-heritage-red-950 via-heritage-red-950 to-heritage-red-950/95 pt-5 pb-10 sm:pt-7 sm:pb-12 md:pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Huy hiệu nhận diện trường */}
          <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-heritage-red-900/80 border border-heritage-gold-400/60 text-heritage-gold-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-md backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
            <span>Trường THCS Nguyễn Trung Trực • Phường Thới An, TP.HCM</span>
          </div>

          {/* Tiêu đề chính H1 */}
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-heritage-ivory-50 leading-tight drop-shadow-md">
            KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
          </h1>

          {/* Tiêu đề phụ */}
          <p className="mt-1 sm:mt-1.5 md:mt-2 text-sm sm:text-base md:text-xl font-serif font-bold text-heritage-gold-300 tracking-wide drop-shadow-sm">
            TRƯỜNG THCS NGUYỄN TRUNG TRỰC
          </p>

          {/* Đoạn văn giới thiệu sứ mệnh */}
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-heritage-ivory-100/95 leading-relaxed max-w-3xl mx-auto font-normal">
            Nơi học tập, bồi đắp lý tưởng cách mạng, lan tỏa sâu rộng giá trị tư tưởng, đạo đức,
            phong cách Chủ tịch Hồ Chí Minh trong thầy và trò trường THCS Nguyễn Trung Trực;
            gắn liền với công cuộc chuyển đổi số giáo dục tại địa phương.
          </p>

          {/* Cụm 2 nút hành động (CTA) - Vùng chạm lớn min-h-[48px] chuẩn Accessibility */}
          <div className="mt-5 sm:mt-6 md:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onExplore}
              className="min-h-[48px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 hover:from-heritage-gold-300 hover:to-heritage-gold-400 hover:brightness-105 font-bold text-sm sm:text-base shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-heritage-gold-400/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300"
            >
              <span>Khám phá không gian</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 ease-out" />
            </button>

            <button
              onClick={onViewResources}
              className="min-h-[48px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-heritage-red-900/60 hover:bg-heritage-red-900 border border-heritage-gold-400/70 hover:border-heritage-gold-300 text-heritage-ivory-50 hover:text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300"
            >
              <BookOpen className="w-4 h-4 text-heritage-gold-300 group-hover:text-heritage-gold-200 group-hover:scale-105 transition-all duration-200 ease-out" />
              <span>Tìm hiểu tư liệu</span>
            </button>
          </div>

          {/* Khối 3 Trụ cột thông tin (Lưới 1 cột trên Mobile -> Lưới 3 cột trên Desktop, không bắt buộc vuốt ngang) */}
          <div className="mt-7 sm:mt-9 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 text-left select-none">
            {/* Trụ cột 1 */}
            <div className="group relative p-4 sm:p-5 rounded-xl bg-heritage-red-900/70 hover:bg-heritage-red-900/90 border border-heritage-red-700/60 hover:border-heritage-gold-300/80 shadow-md hover:shadow-lg transition-all duration-200 ease-out">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <Compass className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Lý tưởng & Đạo đức
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/90 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Thấm nhuần 5 Điều Bác Hồ dạy, rèn luyện nhân cách, đức khiêm tốn và tinh thần trách nhiệm.
              </p>
            </div>

            {/* Trụ cột 2 */}
            <div className="group relative p-4 sm:p-5 rounded-xl bg-heritage-red-900/70 hover:bg-heritage-red-900/90 border border-heritage-red-700/60 hover:border-heritage-gold-300/80 shadow-md hover:shadow-lg transition-all duration-200 ease-out">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <BookOpen className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Tri thức & Tự học
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/90 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Kho tư liệu số hóa phong phú, phục vụ học tập, nghiên cứu môn Lịch sử và Văn hóa học đường.
              </p>
            </div>

            {/* Trụ cột 3 */}
            <div className="group relative p-4 sm:p-5 rounded-xl bg-heritage-red-900/70 hover:bg-heritage-red-900/90 border border-heritage-red-700/60 hover:border-heritage-gold-300/80 shadow-md hover:shadow-lg transition-all duration-200 ease-out">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Tự hào Thới An
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/90 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Noi gương Anh hùng Nguyễn Trung Trực, gắn kết truyền thống địa phương với thế hệ trẻ hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
