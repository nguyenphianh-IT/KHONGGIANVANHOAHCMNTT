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
      aria-label="Phần giới thiệu đầu trang"
      className="relative pt-20 pb-8 sm:pt-22 sm:pb-10 md:pt-24 md:pb-12 overflow-hidden text-white bg-heritage-red-950"
    >
      {/* Background Image Layer: Anchored to TOP so Uncle Ho's full head and face are completely preserved without being cut */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        <img
          src="/images/ho-chi-minh-tp-hcm.png"
          alt=""
          className="w-full h-full object-cover object-[15%_top] sm:object-[20%_top] md:object-[center_top] pointer-events-none"
          loading="eager"
        />
      </div>

      {/* Gentle Red Overlay: Left is sheer to showcase Uncle Ho's portrait; Center has soft tone for text readability; Right reveals HCMC skyline */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-gradient-to-r from-heritage-red-950/50 via-heritage-red-900/40 to-heritage-red-950/50 pointer-events-none"
      />

      {/* Subtle Top & Bottom Gradient for Header transition and bottom content separation */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-gradient-to-b from-heritage-red-950/60 via-transparent to-heritage-red-950/85 pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Institution Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-heritage-red-950/85 border border-heritage-gold-400/60 text-heritage-gold-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-5 backdrop-blur-md shadow-md">
            <ShieldCheck className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
            <span>Trường THCS Nguyễn Trung Trực • Phường Thới An, Thành phố Hồ Chí Minh</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-heritage-ivory-50 leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
          </h1>

          {/* Subtitle */}
          <p className="mt-2 sm:mt-2.5 text-base sm:text-xl md:text-2xl font-serif font-bold text-heritage-gold-300 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            TRƯỜNG THCS NGUYỄN TRUNG TRỰC
          </p>

          {/* Introduction paragraph */}
          <p className="mt-3.5 sm:mt-4.5 text-sm sm:text-base md:text-lg text-heritage-ivory-50 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Nơi học tập, bồi đắp lý tưởng cách mạng, lan tỏa sâu rộng giá trị tư tưởng, đạo đức,
            phong cách Chủ tịch Hồ Chí Minh trong thầy và trò trường THCS Nguyễn Trung Trực;
            gắn liền với công cuộc chuyển đổi số giáo dục tại địa phương.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 hover:from-heritage-gold-300 hover:to-heritage-gold-400 hover:brightness-105 font-bold text-sm sm:text-base shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-heritage-gold-400/30 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 transition-all duration-[250ms] ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-heritage-red-950 motion-reduce:transform-none"
            >
              <span>Khám phá không gian</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-[250ms] ease-out" />
            </button>

            <button
              onClick={onViewResources}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-heritage-red-950/60 hover:bg-gradient-to-r hover:from-heritage-red-900/80 hover:to-heritage-red-800/80 border border-heritage-gold-400/70 hover:border-heritage-gold-300 text-heritage-ivory-50 hover:text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 transition-all duration-[250ms] ease-out flex items-center justify-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-heritage-red-950 motion-reduce:transform-none"
            >
              <BookOpen className="w-4 h-4 text-heritage-gold-300 group-hover:text-heritage-gold-200 group-hover:scale-105 transition-all duration-[250ms] ease-out" />
              <span>Tìm hiểu tư liệu</span>
            </button>
          </div>

          {/* 3 Pillars Quick Strip (Vuốt ngang linh hoạt trên Mobile, hiển thị 3 cột trên Desktop) */}
          <div className="mt-8 sm:mt-11 flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory gap-3.5 -mx-4 md:mx-0 px-4 md:px-0 pb-2 md:pb-0 text-left select-none">
            <div className="w-[82vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center group relative p-4 sm:p-5 rounded-xl bg-heritage-red-950/85 hover:bg-gradient-to-br hover:from-heritage-red-900/90 hover:via-heritage-red-950/90 hover:to-heritage-red-900/75 backdrop-blur-md border border-heritage-red-700/70 hover:border-heritage-gold-300/80 shadow-lg hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1.5 transition-all duration-[250ms] ease-out motion-reduce:transform-none cursor-default">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <Compass className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Lý tưởng & Đạo đức
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/95 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Thấm nhuần 5 Điều Bác Hồ dạy, rèn luyện nhân cách, đức khiêm tốn và tinh thần trách nhiệm.
              </p>
            </div>

            <div className="w-[82vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center group relative p-4 sm:p-5 rounded-xl bg-heritage-red-950/85 hover:bg-gradient-to-br hover:from-heritage-red-900/90 hover:via-heritage-red-950/90 hover:to-heritage-red-900/75 backdrop-blur-md border border-heritage-red-700/70 hover:border-heritage-gold-300/80 shadow-lg hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1.5 transition-all duration-[250ms] ease-out motion-reduce:transform-none cursor-default">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <BookOpen className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Tri thức & Tự học
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/95 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Kho tư liệu số hóa phong phú, phục vụ học tập, nghiên cứu môn Lịch sử và Văn hóa học đường.
              </p>
            </div>

            <div className="w-[82vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center group relative p-4 sm:p-5 rounded-xl bg-heritage-red-950/85 hover:bg-gradient-to-br hover:from-heritage-red-900/90 hover:via-heritage-red-950/90 hover:to-heritage-red-900/75 backdrop-blur-md border border-heritage-red-700/70 hover:border-heritage-gold-300/80 shadow-lg hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1.5 transition-all duration-[250ms] ease-out motion-reduce:transform-none cursor-default">
              <div className="flex items-center space-x-2 text-heritage-gold-300 group-hover:text-heritage-gold-200 transition-colors duration-200 mb-1.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-heritage-gold-200 transition-colors duration-200">
                  Tự hào Thới An
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-heritage-ivory-100/95 group-hover:text-white transition-colors duration-200 leading-relaxed">
                Noi gương Anh hùng Nguyễn Trung Trực, gắn kết truyền thống địa phương với thế hệ trẻ hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
