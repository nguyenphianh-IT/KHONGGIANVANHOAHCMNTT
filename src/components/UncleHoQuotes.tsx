import React, { useState, useEffect, useRef } from 'react';
import { 
  Quote, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Sparkles, 
  Pause, 
  Play, 
  BookOpen, 
  Compass,
  Award
} from 'lucide-react';
import { UNCLE_HO_QUOTES, UncleHoQuote } from '../data/quotesData';

interface UncleHoQuotesProps {
  className?: string;
  autoPlayInterval?: number; // ms, default 9000
}

export const UncleHoQuotes: React.FC<UncleHoQuotesProps> = ({
  className = '',
  autoPlayInterval = 9000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  const currentQuote: UncleHoQuote = UNCLE_HO_QUOTES[currentIndex];
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Switch to next quote
  const nextQuote = () => {
    setFadeAnim(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % UNCLE_HO_QUOTES.length);
      setProgress(0);
      setFadeAnim(true);
    }, 250);
  };

  // Switch to previous quote
  const prevQuote = () => {
    setFadeAnim(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + UNCLE_HO_QUOTES.length) % UNCLE_HO_QUOTES.length);
      setProgress(0);
      setFadeAnim(true);
    }, 250);
  };

  // Switch to random quote
  const randomQuote = () => {
    setFadeAnim(false);
    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * UNCLE_HO_QUOTES.length);
      if (nextIdx === currentIndex && UNCLE_HO_QUOTES.length > 1) {
        nextIdx = (nextIdx + 1) % UNCLE_HO_QUOTES.length;
      }
      setCurrentIndex(nextIdx);
      setProgress(0);
      setFadeAnim(true);
    }, 250);
  };

  // Copy quote text to clipboard
  const handleCopy = async () => {
    try {
      const text = `"${currentQuote.quote}"\n— Lời dạy của Chủ tịch Hồ Chí Minh (${currentQuote.context}${currentQuote.year ? `, ${currentQuote.year}` : ''})\nNguồn: Không gian văn hóa Hồ Chí Minh - THCS Nguyễn Trung Trực`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Auto-play progress countdown
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 100;
    const increment = (stepMs / autoPlayInterval) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextQuote();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, autoPlayInterval]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-heritage-red-800 via-heritage-red-900 to-heritage-ink-900 text-white shadow-2xl border border-heritage-gold-400/40 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Gold Watermark */}
      <Quote 
        className="absolute -right-6 -bottom-6 w-44 h-44 text-white/[0.04] pointer-events-none rotate-12 transition-transform duration-700" 
      />
      
      {/* Subtle Glowing Radial Accent */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-heritage-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 p-6 sm:p-9 md:p-11 flex flex-col justify-between min-h-[340px]">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-heritage-gold-400/20 border border-heritage-gold-400/50 text-heritage-gold-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-heritage-gold-300 block">
                Lời Dạy & Tư Tưởng Chủ Tịch Hồ Chí Minh
              </span>
              <span className="text-[11px] text-heritage-ivory-200/80 font-medium hidden sm:inline">
                Cẩm nang tư tưởng cho cán bộ, giáo viên và học sinh trường THCS Nguyễn Trung Trực
              </span>
            </div>
          </div>

          {/* Category Tag & Auto-play status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-heritage-gold-200 border border-heritage-gold-400/30">
              <Compass className="w-3 h-3 mr-1.5 text-heritage-gold-300" />
              {currentQuote.category}
            </span>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Tiếp tục tự động chuyển câu' : 'Tạm dừng để đọc kỹ'}
              aria-label={isPaused ? 'Tiếp tục tự động chuyển câu' : 'Tạm dừng để đọc kỹ'}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-heritage-ivory-100 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-heritage-gold-300" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Center: The Quote Body with Fade Animation */}
        <div 
          className={`py-6 sm:py-8 transition-all duration-300 ease-out ${
            fadeAnim ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          }`}
        >
          <div className="flex items-start gap-3">
            <Quote className="w-7 h-7 sm:w-9 sm:h-9 text-heritage-gold-400/80 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl font-bold leading-relaxed text-white tracking-wide">
                “{currentQuote.quote}”
              </blockquote>

              {/* Context Origin */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-heritage-gold-300/95 font-medium">
                <BookOpen className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
                <span>Xuất xứ: {currentQuote.context}</span>
                {currentQuote.year && (
                  <span className="px-2 py-0.5 rounded bg-heritage-gold-400/20 text-heritage-gold-200 text-xs font-mono font-semibold">
                    {currentQuote.year}
                  </span>
                )}
              </div>

              {/* Educational Reflection / Lesson */}
              <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-heritage-gold-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-heritage-ivory-100/90 leading-relaxed">
                    <strong className="text-heritage-gold-300 font-semibold">Bài học noi gương: </strong>
                    {currentQuote.lesson}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Toolbar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Left: Random Shuffle & Copy Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={randomQuote}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-heritage-gold-500/20 hover:bg-heritage-gold-500/30 text-heritage-gold-200 border border-heritage-gold-400/40 hover:text-white font-medium transition-all active:scale-95"
              title="Đổi câu nói khác ngẫu nhiên"
            >
              <Shuffle className="w-3.5 h-3.5 text-heritage-gold-300" />
              <span>Đổi câu ngẫu nhiên</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-heritage-ivory-100 font-medium transition-all active:scale-95"
              title="Sao chép lời dạy của Bác"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-300 font-semibold">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-heritage-ivory-200" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Counter and Prev / Next Navigation */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-heritage-ivory-200/80 font-mono font-medium">
              Câu <strong className="text-heritage-gold-300 text-sm">{currentIndex + 1}</strong> / {UNCLE_HO_QUOTES.length}
            </span>

            {/* Quick Indicator Pills for Touch/Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {UNCLE_HO_QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFadeAnim(false);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setProgress(0);
                      setFadeAnim(true);
                    }, 200);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-5 bg-heritage-gold-400' 
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Xem câu thứ ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevQuote}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white active:scale-90 transition-all"
                title="Câu trước đó"
                aria-label="Câu trước đó"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextQuote}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white active:scale-90 transition-all"
                title="Câu tiếp theo"
                aria-label="Câu tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Progress Countdown Bar at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-200 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
