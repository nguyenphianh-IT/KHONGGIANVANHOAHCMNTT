import React from 'react';
import { ArrowRight, BookOpen, Compass, ShieldCheck, Sparkles } from 'lucide-react';

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
          - Mobile & Tablet dọc: Dùng hero-mobile.png (tỷ lệ 3:4), tối ưu chiều cao hiển thị.
          - Desktop & Tablet ngang: Dùng hero-desktop.png (tỷ lệ 3:1 panorama).
          - Tối ưu chiều cao hiển thị theo từng breakpoint để không chiếm hết màn hình.
      ========================================================================= */}
      <div className="w-full bg-heritage-red-950 flex justify-center items-center px-2 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-3">
        <div className="w-full portrait:max-w-[240px] min-[360px]:portrait:max-w-[280px] min-[375px]:portrait:max-w-[320px] min-[430px]:portrait:max-w-[360px] sm:portrait:max-w-md md:portrait:max-w-lg landscape:max-w-4xl xl:landscape:max-w-5xl 2xl:landscape:max-w-6xl mx-auto flex justify-center">
          <picture className="w-full block text-center">
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
              className="w-auto h-auto max-h-[120px] min-[360px]:max-h-[160px] min-[375px]:max-h-[220px] min-[430px]:max-h-[260px] sm:max-h-[320px] md:max-h-[370px] lg:max-h-[260px] xl:max-h-[300px] 2xl:max-h-[360px] block mx-auto object-contain select-none shadow-2xl shadow-black/50 portrait:rounded-xl sm:portrait:rounded-2xl landscape:rounded-xl md:landscape:rounded-2xl border border-heritage-gold-400/20"
            />
          </picture>
        </div>
      </div>

      {/* =========================================================================
          VÙNG 2: NỘI DUNG VĂN BẢN & ĐIỀU HƯỚNG (HERO CONTENT)
          - Tinh giản, trang trọng, phân cấp thị giác rõ ràng (Heritage Modern - Minimalist).
          - Bảo tồn 100% hình tượng Bác Hồ và tên Không gian văn hóa.
          - Tối ưu khoảng cách và touch-target chuẩn Accessibility (min-h-[48px]).
      ========================================================================= */}
      <div className="relative w-full bg-gradient-to-b from-heritage-red-950 via-heritage-red-950 to-heritage-red-950/95 pt-2 sm:pt-4 md:pt-6 pb-10 sm:pb-12 md:pb-14 px-3 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Huy hiệu nhận diện trường */}
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-0.5 sm:py-1.5 rounded-full bg-heritage-red-900/80 border border-heritage-gold-400/60 text-heritage-gold-300 text-[10.5px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-3 shadow-md backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-gold-400 flex-shrink-0" />
            <span>Trường THCS Nguyễn Trung Trực • Phường Thới An</span>
          </div>

          {/* Tiêu đề chính H1 */}
          <h1 className="font-serif text-lg min-[360px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight text-heritage-ivory-50 leading-tight drop-shadow-md">
            KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
          </h1>

          {/* Mô tả ngắn gọn (1 câu tinh giản) */}
          <p className="mt-1 sm:mt-2.5 md:mt-3 text-[11.5px] min-[360px]:text-xs sm:text-sm md:text-base text-heritage-ivory-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
            Lan tỏa tư tưởng, đạo đức, phong cách Hồ Chí Minh trong môi trường học đường.
          </p>

          {/* Cụm 2 nút hành động (CTA) - Vùng chạm lớn min-h-[44px] sm:min-h-[48px] chuẩn Accessibility */}
          <div className="mt-2.5 sm:mt-5 md:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3.5 max-w-[260px] sm:max-w-none mx-auto">
            <button
              onClick={onExplore}
              className="min-h-[44px] sm:min-h-[48px] px-5 sm:px-7 py-2 sm:py-3.5 rounded-lg bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 hover:from-heritage-gold-300 hover:to-heritage-gold-400 hover:brightness-105 font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-heritage-gold-400/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300"
            >
              <span>Khám phá không gian</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 ease-out" />
            </button>

            <button
              onClick={onViewResources}
              className="min-h-[44px] sm:min-h-[48px] px-5 sm:px-7 py-2 sm:py-3.5 rounded-lg bg-heritage-red-900/60 hover:bg-heritage-red-900 border border-heritage-gold-400/70 hover:border-heritage-gold-300 text-heritage-ivory-50 hover:text-white font-semibold text-xs sm:text-sm md:text-base backdrop-blur-md shadow-md hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300"
            >
              <BookOpen className="w-4 h-4 text-heritage-gold-300 group-hover:text-heritage-gold-200 group-hover:scale-105 transition-all duration-200 ease-out" />
              <span>Tìm hiểu tư liệu</span>
            </button>
          </div>

          {/* Khối 3 Thẻ giới thiệu tinh giản (Heritage Modern - Minimalist) */}
          <div className="mt-5 sm:mt-8 md:mt-10 max-w-md md:max-w-3xl lg:max-w-[53rem] xl:max-w-5xl mx-auto pr-14 md:pr-0 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 text-left select-none">
            {/* Thẻ 1 – DI SẢN */}
            <div className="group p-4 sm:p-5 rounded-xl bg-heritage-red-900/60 hover:bg-heritage-red-900/80 border border-heritage-gold-400/20 hover:border-heritage-gold-400/50 shadow-md hover:shadow-lg transition-all duration-200 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-heritage-gold-300 mb-2">
                  <Compass className="w-5 h-5 text-heritage-gold-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                  <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-heritage-gold-200">
                    DI SẢN
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-heritage-ivory-100/90 leading-relaxed">
                  Tư tưởng, đạo đức và phong cách Hồ Chí Minh.
                </p>
              </div>
            </div>

            {/* Thẻ 2 – TRI THỨC */}
            <div className="group p-4 sm:p-5 rounded-xl bg-heritage-red-900/60 hover:bg-heritage-red-900/80 border border-heritage-gold-400/20 hover:border-heritage-gold-400/50 shadow-md hover:shadow-lg transition-all duration-200 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-heritage-gold-300 mb-2">
                  <BookOpen className="w-5 h-5 text-heritage-gold-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                  <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-heritage-gold-200">
                    TRI THỨC
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-heritage-ivory-100/90 leading-relaxed">
                  Tư liệu, lịch sử và học tập.
                </p>
              </div>
            </div>

            {/* Thẻ 3 – TUỔI TRẺ */}
            <div className="group p-4 sm:p-5 rounded-xl bg-heritage-red-900/60 hover:bg-heritage-red-900/80 border border-heritage-gold-400/20 hover:border-heritage-gold-400/50 shadow-md hover:shadow-lg transition-all duration-200 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-heritage-gold-300 mb-2">
                  <Sparkles className="w-5 h-5 text-heritage-gold-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                  <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-heritage-gold-200">
                    TUỔI TRẺ
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-heritage-ivory-100/90 leading-relaxed">
                  Học tập và làm theo Bác bằng hành động thiết thực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
