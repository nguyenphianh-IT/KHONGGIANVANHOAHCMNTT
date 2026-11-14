import React, { useState, useEffect, useRef } from 'react';
import { TimelineEvent } from '../types';
import {
  Calendar,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

interface HorizontalTimelineRailProps {
  events: TimelineEvent[];
  onOpenDetailModal: (event: TimelineEvent) => void;
}

const getMilestoneShortLabel = (event: TimelineEvent): string => {
  if (event.isMemorial || !event.year) return 'Sống mãi';
  switch (event.year) {
    case '1890':
      return 'Làng Sen';
    case '1911':
      return 'Bến Nhà Rồng';
    case '1919':
      return 'Yêu sách An Nam';
    case '1920':
      return 'Đại hội Tours';
    case '1925':
      return 'Cách mạng Thanh niên';
    case '1930':
      return 'Thành lập Đảng';
    case '1941':
      return 'Về Pác Bó';
    case '1945':
      return 'Tuyên ngôn';
    case '1954':
      return 'Điện Biên Phủ';
    case '1968':
      return 'Mậu Thân 1968';
    case '1969':
      return 'Di chúc';
    case '1975':
      return 'Toàn thắng';
    default:
      return event.title.split(' ').slice(0, 2).join(' ');
  }
};

export const HorizontalTimelineRail: React.FC<HorizontalTimelineRailProps> = ({
  events,
  onOpenDetailModal
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const railContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLButtonElement>(null);

  const currentEvent = events[activeIndex] || events[0];

  // Auto-play for Smart TV / Kiosk mode (cycles every 8s)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % events.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, events.length]);

  // Auto-scroll rail to center the active node when activeIndex changes
  useEffect(() => {
    if (activeNodeRef.current && railContainerRef.current) {
      const container = railContainerRef.current;
      const node = activeNodeRef.current;
      const scrollLeft =
        node.offsetLeft - container.clientWidth / 2 + node.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  // Keyboard navigation (Left/Right arrow keys & Space to play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal is open
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [events.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-5">
      {/* ─────────────────────────────────────────────────────────────
          1. THANH THƯỚC ĐO THỜI GIAN NẰM NGANG (INTERACTIVE RAIL)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-heritage-ivory-100 rounded-2xl border-2 border-heritage-gold-300/80 p-3 sm:px-5 sm:py-3.5 shadow-md relative overflow-hidden">
        {/* Subtle Decorative Background Motif */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-heritage-gold-400/5 rounded-full blur-2xl pointer-events-none" />

        {/* Rail Header with Kiosk / Presentation Mode info */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 sm:mb-3 sm:pb-2.5 border-b border-heritage-gold-200/80">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-heritage-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-heritage-red-700" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-heritage-ink-800 uppercase tracking-wider">
              Thước đo các mốc son lịch sử
            </span>
            <span className="text-[11px] bg-heritage-gold-100 text-heritage-ink-800 font-semibold px-2.5 py-0.5 rounded-full border border-heritage-gold-300">
              Tiến trình lịch sử
            </span>
          </div>

          {/* Quick controls: Auto-play toggle & Step indicators */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
                isPlaying
                  ? 'bg-heritage-red-700 text-white shadow-heritage-red-700/30 ring-2 ring-heritage-gold-400'
                  : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:border-heritage-gold-400 hover:text-heritage-red-700'
              }`}
              title="Tự động chuyển mốc thời gian"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tự động chuyển</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center space-x-1 text-xs font-bold text-heritage-ink-600 bg-white px-2.5 py-1 rounded-full border border-heritage-ivory-300">
              <span className="text-heritage-red-700">{activeIndex + 1}</span>
              <span>/</span>
              <span>{events.length} mốc</span>
            </div>
          </div>
        </div>

        {/* The Horizontal Rail Container (Auto-fitted on desktop, smoothly scrollable on mobile) */}
        <div
          ref={railContainerRef}
          className="relative overflow-x-auto no-scrollbar py-1 px-1 sm:px-2 select-none"
          tabIndex={0}
          aria-label="Thước đo thời gian các mốc son lịch sử"
        >
          {/* Main Horizontal Track Line - Fits 100% on desktop/tablet, compact min-w on mobile */}
          <div className="relative w-full min-w-[700px] md:min-w-0 flex items-start justify-between pt-1 pb-1">
            {/* The continuous golden-red track running behind the buttons - exactly centered */}
            <div
              className="absolute left-3 right-3 sm:left-5 sm:right-5 top-[22px] sm:top-[24px] -translate-y-1/2 h-1 bg-gradient-to-r from-heritage-red-800 via-heritage-gold-500 to-heritage-red-800 rounded-full shadow-xs z-0"
            />

            {/* Subtle Ruler Calibrations (Small tick marks along the rail) */}
            <div
              aria-hidden="true"
              className="absolute left-4 right-4 sm:left-6 sm:right-6 top-[22px] sm:top-[24px] -translate-y-1/2 flex justify-between pointer-events-none z-0 opacity-40"
            >
              {Array.from({ length: 49 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-0.5 bg-heritage-gold-600 ${
                    i % 4 === 0 ? 'h-2.5' : 'h-1'
                  }`}
                />
              ))}
            </div>

            {/* Individual Milestone Nodes along the Rail */}
            {events.map((event, idx) => {
              const isActive = idx === activeIndex;
              const isMemorial = event.isMemorial || !event.year;
              const nodeLabel = isMemorial ? 'Nay' : event.year;

              return (
                <div
                  key={event.year || `rail-node-${idx}`}
                  className="relative flex flex-col items-center z-10 flex-shrink-0"
                  style={{ width: `${100 / events.length}%` }}
                >
                  {/* Button anchor container ensuring perfect vertical centering with track line */}
                  <div className="relative flex items-center justify-center h-9 sm:h-10">
                    {/* Active Downward Arrow Pointer Indicator */}
                    {isActive && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-heritage-red-800 animate-bounce pointer-events-none z-30">
                        <div className="w-1.5 h-1.5 bg-heritage-red-800 rotate-45 border-t border-l border-heritage-gold-300 shadow-xs" />
                      </div>
                    )}

                    {/* Circular Milestone Button - Distinct gold borders, uniform elegant style */}
                    <button
                      ref={isActive ? activeNodeRef : null}
                      onClick={() => {
                        setActiveIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`group relative flex items-center justify-center rounded-full aspect-square flex-shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-red-700 ${
                        isActive
                          ? 'w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 bg-gradient-to-br from-heritage-red-800 to-heritage-red-950 text-heritage-gold-200 border-2 border-heritage-gold-300 shadow-md scale-110 ring-4 ring-heritage-gold-400/35 z-20'
                          : 'w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 bg-white text-heritage-ink-800 border-2 border-heritage-gold-500 hover:border-heritage-red-700 hover:text-heritage-red-700 hover:scale-105 shadow-xs z-10'
                      }`}
                      title={`${event.exactDate || event.year}: ${event.title}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isMemorial ? (
                        <Star
                          className={`${
                            isActive
                              ? 'w-3.5 h-3.5 text-heritage-gold-200 fill-heritage-gold-300 drop-shadow'
                              : 'w-3.5 h-3.5 text-heritage-gold-500 fill-heritage-gold-400'
                          }`}
                        />
                      ) : (
                        <span
                          className={`font-serif font-black ${
                            isActive
                              ? 'text-[10px] sm:text-[11px] tracking-tight'
                              : 'text-[9px] sm:text-[10px]'
                          }`}
                        >
                          {nodeLabel}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Milestone Micro-Label below the button - 2 lines, no truncation */}
                  <div
                    className={`mt-1 text-center transition-all duration-200 pointer-events-none px-0.5 max-w-[64px] sm:max-w-[76px] md:max-w-[84px] ${
                      isActive
                        ? 'opacity-100 font-bold text-heritage-red-800 scale-105'
                        : 'opacity-85 text-heritage-ink-800 font-medium'
                    }`}
                  >
                    <span className="block text-[7.5px] sm:text-[8.5px] md:text-[9.5px] leading-[1.15] text-center break-words hyphens-auto">
                      {getMilestoneShortLabel(event)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rail navigation hint for touch/keyboard */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-heritage-ink-500 pt-1.5 sm:pt-2 border-t border-heritage-gold-200/60">
          <span className="hidden sm:inline">
            💡 Dùng phím <kbd className="px-1.5 py-0.5 bg-white border border-heritage-ivory-300 rounded font-mono text-[9px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-heritage-ivory-300 rounded font-mono text-[9px]">→</kbd> trên bàn phím hoặc chạm vào điểm mốc trên thước để xem.
          </span>
          <span className="sm:hidden">
            💡 Vuốt ngang thước đo hoặc chạm mốc để chuyển.
          </span>
          <span className="text-heritage-gold-700 font-medium italic">
            Chạm ảnh hoặc nút Chi tiết để mở rộng
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. KHUNG HIỂN THỊ CHI TIẾT MỐC ĐƯỢC CHỌN (SHOWCASE PANEL)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-heritage-gold-300/80 shadow-xl overflow-hidden transition-all duration-300">
        {/* Panel Header Bar */}
        <div className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 px-4 sm:px-6 py-3 text-white flex items-center justify-between border-b border-heritage-gold-400/40">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-heritage-gold-400/20 border border-heritage-gold-300 flex items-center justify-center font-serif font-black text-xs text-heritage-gold-300 flex-shrink-0">
              {currentEvent.isMemorial || !currentEvent.year ? (
                <Star className="w-4 h-4 fill-heritage-gold-400" />
              ) : (
                currentEvent.year
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-heritage-gold-200 uppercase tracking-widest font-semibold block">
                Mốc Lịch Sử Số {activeIndex + 1} / {events.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate block">
                {currentEvent.exactDate || `Năm ${currentEvent.year}`}
              </span>
            </div>
          </div>

          {/* Previous / Next buttons & Fullscreen button */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handlePrev}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center space-x-1 transition-colors border border-white/15"
              title="Mốc trước (Phím ←)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Mốc trước</span>
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-heritage-gold-500 hover:bg-heritage-gold-600 text-heritage-ink-950 font-bold text-xs flex items-center space-x-1 transition-colors shadow-sm"
              title="Mốc sau (Phím →)"
            >
              <span className="hidden sm:inline">Mốc sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDetailModal(currentEvent)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-heritage-gold-200 hover:text-white transition-colors border border-white/15 ml-1"
              title="Mở toàn màn hình / Xem đầy đủ tư liệu"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Showcase Body (2-Column Desktop Grid) */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Authentic Historical Photo Canvas */}
          <div className="lg:col-span-5 flex flex-col space-y-2.5">
            <div
              onClick={() => onOpenDetailModal(currentEvent)}
              className="group relative w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px] rounded-2xl overflow-hidden border-2 border-heritage-gold-400/70 shadow-md bg-heritage-ink-900 cursor-pointer"
            >
              {currentEvent.imageUrl ? (
                <img
                  src={currentEvent.imageUrl}
                  alt={currentEvent.title}
                  className={`w-full h-full object-cover ${
                    currentEvent.imagePosition || 'object-top'
                  } group-hover:scale-105 transition-transform duration-500`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-heritage-red-900 text-heritage-gold-300">
                  <BookOpen className="w-16 h-16 opacity-40" />
                </div>
              )}

              {/* Gradient Overlay for badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Top-left Date Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center space-x-1.5 bg-heritage-red-800/90 text-heritage-gold-200 text-xs font-bold px-3 py-1 rounded-full border border-heritage-gold-400/50 backdrop-blur-sm shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentEvent.exactDate || `Năm ${currentEvent.year}`}</span>
                </span>
              </div>

              {/* Expand Hint on hover */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center space-x-1 bg-black/70 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <Maximize2 className="w-3 h-3 text-heritage-gold-300" />
                  <span>Phóng to</span>
                </span>
              </div>

              {/* Bottom-left Location Badge */}
              {currentEvent.location && (
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="inline-flex items-center space-x-1.5 bg-black/60 text-heritage-ivory-100 text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 max-w-full">
                    <MapPin className="w-3.5 h-3.5 text-heritage-gold-400 flex-shrink-0" />
                    <span className="truncate">{currentEvent.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Caption */}
            {currentEvent.imageCaption && (
              <p className="text-xs text-heritage-ink-500 italic px-1 leading-relaxed">
                📷 {currentEvent.imageCaption}
              </p>
            )}
          </div>

          {/* Right Column: Historical Narrative, Significance & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Status Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-heritage-red-700 bg-heritage-red-50 border border-heritage-red-200 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-heritage-red-700" />
                  <span>
                    {currentEvent.category === 'tuoi-tre'
                      ? 'Thời niên thiếu'
                      : currentEvent.category === 'cuu-nuoc'
                      ? 'Hành trình cứu nước'
                      : currentEvent.category === 'lanh-dao'
                      ? 'Lãnh đạo cách mạng'
                      : 'Di chúc & Tưởng niệm'}
                  </span>
                </span>

                {currentEvent.year && (
                  <span className="text-xs font-serif font-black text-heritage-gold-700 bg-heritage-gold-50 border border-heritage-gold-300 px-2.5 py-0.5 rounded-full">
                    Mốc năm {currentEvent.year}
                  </span>
                )}
              </div>

              {/* Big Bold Historic Title */}
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-heritage-ink-900 leading-snug tracking-tight mb-3">
                {currentEvent.title}
              </h3>

              {/* Significance Box */}
              {currentEvent.significance && (
                <div className="bg-heritage-gold-50/80 border-l-4 border-heritage-gold-500 p-3 sm:p-3.5 rounded-r-2xl mb-4 shadow-xs">
                  <div className="flex items-start space-x-2">
                    <Award className="w-4 h-4 text-heritage-red-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-heritage-red-800 uppercase tracking-wider block mb-0.5">
                        Ý nghĩa lịch sử trọng đại
                      </span>
                      <p className="text-xs sm:text-sm text-heritage-ink-800 font-medium leading-relaxed">
                        {currentEvent.significance}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Short summary & Narrative snippet */}
              <div className="space-y-2.5 text-xs sm:text-sm text-heritage-ink-700 leading-relaxed">
                <p className="font-semibold text-heritage-ink-900">
                  {currentEvent.shortDescription}
                </p>
                <p className="line-clamp-4 text-heritage-ink-600">
                  {currentEvent.fullDetail}
                </p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-heritage-ivory-200 flex flex-wrap items-center justify-between gap-3">
              {/* Progress Dots navigation */}
              <div className="flex items-center space-x-1.5">
                {events.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => {
                      setActiveIndex(dotIdx);
                      setIsPlaying(false);
                    }}
                    className={`transition-all rounded-full ${
                      dotIdx === activeIndex
                        ? 'w-6 h-2 bg-heritage-red-700'
                        : 'w-2 h-2 bg-heritage-ivory-300 hover:bg-heritage-gold-400'
                    }`}
                    title={`Chuyển đến mốc ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Open full modal CTA */}
              <button
                onClick={() => onOpenDetailModal(currentEvent)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-heritage-red-700 hover:bg-heritage-red-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all group"
              >
                <span>Xem tư liệu chi tiết & Toàn cảnh</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
