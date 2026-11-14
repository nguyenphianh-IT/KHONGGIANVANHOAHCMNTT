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

interface MilestoneLabel {
  line1: string;
  line2?: string;
}

const getMilestoneDisplayLabel = (event: TimelineEvent): MilestoneLabel => {
  if (event.isMemorial || !event.year) return { line1: 'Sống mãi' };
  switch (event.year) {
    case '1890':
      return { line1: 'Làng Sen' };
    case '1911':
      return { line1: 'Bến Nhà Rồng' };
    case '1919':
      return { line1: 'Yêu sách', line2: 'An Nam' };
    case '1920':
      return { line1: 'Đại hội Tours' };
    case '1925':
      return { line1: 'Cách mạng', line2: 'Thanh niên' };
    case '1930':
      return { line1: 'Thành lập Đảng' };
    case '1941':
      return { line1: 'Về Pác Bó' };
    case '1945':
      return { line1: 'Tuyên ngôn' };
    case '1954':
      return { line1: 'Điện Biên Phủ' };
    case '1968':
      return { line1: 'Mậu Thân', line2: '1968' };
    case '1969':
      return { line1: 'Di chúc' };
    case '1975':
      return { line1: 'Toàn thắng' };
    default:
      return { line1: event.title.split(' ').slice(0, 2).join(' ') };
  }
};

const getMilestoneShortLabel = (event: TimelineEvent): string => {
  const label = getMilestoneDisplayLabel(event);
  return label.line2 ? `${label.line1} ${label.line2}` : label.line1;
};

const getMilestoneEraDetail = (event: TimelineEvent): { eraName: string; eraBadge: string } => {
  if (event.isMemorial || !event.year) {
    return { eraName: 'Di sản Hồ Chí Minh trường tồn cùng non sông đất nước', eraBadge: 'Sống mãi cùng non sông' };
  }
  switch (event.year) {
    case '1890':
      return { eraName: 'Thời niên thiếu & Quê hương Làng Sen', eraBadge: 'Mùa sen nở 1890' };
    case '1911':
      return { eraName: 'Rời Bến Nhà Rồng tìm đường cứu nước', eraBadge: 'Hành trình cứu nước 1911' };
    case '1919':
      return { eraName: 'Bản Yêu sách nhân dân An Nam tại Versailles', eraBadge: 'Tiếng vang quốc tế 1919' };
    case '1920':
      return { eraName: 'Đại hội Tours – Chọn con đường Lê-nin', eraBadge: 'Ánh sáng thời đại 1920' };
    case '1925':
      return { eraName: 'Thành lập Hội Việt Nam Cách mạng Thanh niên', eraBadge: 'Hạt giống đỏ 1925' };
    case '1930':
      return { eraName: 'Mùa xuân thành lập Đảng Cộng sản Việt Nam', eraBadge: 'Mùa xuân cách mạng 1930' };
    case '1941':
      return { eraName: 'Trở về Pác Bó trực tiếp lãnh đạo phong trào', eraBadge: 'Ngọn nguồn Pác Bó 1941' };
    case '1945':
      return { eraName: 'Tuyên ngôn Độc lập – Khai sinh nước Việt Nam Dân chủ Cộng hòa', eraBadge: 'Độc lập tự do 1945' };
    case '1954':
      return { eraName: 'Chiến thắng lịch sử Điện Biên Phủ lừng lẫy năm châu', eraBadge: 'Lừng lẫy năm châu 1954' };
    case '1968':
      return { eraName: 'Tổng tiến công và nổi dậy Mậu Thân 1968', eraBadge: 'Bước ngoặt Mậu Thân 1968' };
    case '1969':
      return { eraName: 'Bản Di chúc lịch sử muôn vàn tình thân yêu', eraBadge: 'Lời dặn ngàn thu 1969' };
    case '1975':
      return { eraName: 'Đại thắng mùa Xuân 1975 – Non sông trọn niềm vui', eraBadge: 'Toàn thắng mùa Xuân 1975' };
    default:
      return { eraName: event.title, eraBadge: `Mốc son ${event.year}` };
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
  const currentEra = getMilestoneEraDetail(currentEvent);

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
      <div className="bg-gradient-to-b from-[#FDFBF7] via-[#FAF5EA] to-[#F3ECD8] rounded-3xl border-2 border-heritage-gold-400 p-3.5 sm:p-5 md:p-6 shadow-xl relative overflow-hidden ring-1 ring-heritage-gold-300/40">
        {/* Subtle Decorative Golden Aura in corners */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-heritage-gold-400/20 via-heritage-red-700/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-heritage-red-700/15 via-heritage-gold-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Rail Header with Grand Title & Dynamic Historic Era Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 sm:mb-4 sm:pb-3 border-b border-heritage-gold-300/80 relative z-10">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            {/* Iconic Medal Seal */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-heritage-red-700 via-heritage-red-800 to-heritage-red-950 border-2 border-heritage-gold-400 flex items-center justify-center shadow-md flex-shrink-0">
              <Sparkles className="w-5 h-5 text-heritage-gold-300 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-serif text-sm sm:text-base md:text-lg font-black text-heritage-ink-950 tracking-tight uppercase">
                  Thước đo các mốc son lịch sử
                </h2>
                <span className="text-[10px] sm:text-[11px] font-bold bg-gradient-to-r from-heritage-red-700 to-heritage-red-900 text-heritage-gold-200 px-2.5 py-0.5 rounded-full border border-heritage-gold-400/50 shadow-xs uppercase tracking-wider">
                  1890 – 1975 – Nay
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-heritage-ink-700 font-medium truncate mt-0.5">
                <span className="font-bold text-heritage-red-800">✨ {currentEra.eraBadge}:</span>{' '}
                <span className="text-heritage-ink-800">{currentEra.eraName}</span>
              </p>
            </div>
          </div>

          {/* Quick controls: Prev/Next quick buttons, Auto-play toggle & Step indicators */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Quick Prev Button */}
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-white hover:bg-heritage-gold-50 text-heritage-ink-700 hover:text-heritage-red-800 border border-heritage-gold-300 shadow-xs transition-colors"
              title="Mốc trước (Phím ←)"
              aria-label="Mốc trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Next Button */}
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-white hover:bg-heritage-gold-50 text-heritage-ink-700 hover:text-heritage-red-800 border border-heritage-gold-300 shadow-xs transition-colors"
              title="Mốc sau (Phím →)"
              aria-label="Mốc sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Auto-play toggle button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                isPlaying
                  ? 'bg-gradient-to-r from-heritage-red-700 to-heritage-red-900 text-white shadow-heritage-red-700/30 ring-2 ring-heritage-gold-400'
                  : 'bg-white text-heritage-ink-800 border-1.5 border-heritage-gold-400 hover:border-heritage-red-700 hover:text-heritage-red-800'
              }`}
              title="Tự động chuyển mốc thời gian"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current animate-pulse text-heritage-gold-300" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-heritage-red-700" />
                  <span className="hidden sm:inline">Tự động chuyển</span>
                  <span className="sm:hidden">Tự động</span>
                </>
              )}
            </button>

            {/* Milestone counter badge */}
            <div className="flex items-center space-x-1 text-xs font-black text-heritage-ink-800 bg-white/90 px-3 py-1.5 rounded-full border border-heritage-gold-300 shadow-xs">
              <span className="text-heritage-red-700">{activeIndex + 1}</span>
              <span className="text-heritage-gold-600">/</span>
              <span>{events.length} mốc</span>
            </div>
          </div>
        </div>

        {/* The Horizontal Rail Container (Auto-fitted on desktop, smoothly scrollable on mobile) */}
        <div
          ref={railContainerRef}
          className="relative overflow-x-auto no-scrollbar py-2 px-1 sm:px-2 select-none"
          tabIndex={0}
          aria-label="Thước đo thời gian các mốc son lịch sử"
        >
          {/* Main Horizontal Track Line - Fits 100% on desktop/tablet, compact min-w on mobile */}
          <div className="relative w-full min-w-[700px] md:min-w-0 flex items-start justify-between pt-1 pb-1">
            {/* The continuous antique bronze track groove running behind the buttons */}
            <div
              className="absolute left-3 right-3 sm:left-5 sm:right-5 top-[24px] sm:top-[28px] -translate-y-1/2 h-2 sm:h-2.5 bg-gradient-to-r from-heritage-ivory-300 via-heritage-gold-200 to-heritage-ivory-300 rounded-full border border-heritage-gold-400/60 shadow-inner z-0"
            />

            {/* Dynamic Illuminated Progress Ribbon from start to active milestone */}
            <div
              className="absolute left-3 sm:left-5 top-[24px] sm:top-[28px] -translate-y-1/2 h-2 sm:h-2.5 bg-gradient-to-r from-heritage-red-800 via-heritage-gold-500 to-heritage-red-700 rounded-full shadow-sm transition-all duration-500 z-0 pointer-events-none"
              style={{
                width: `${Math.max(0, (activeIndex / (events.length - 1)) * 100)}%`,
                maxWidth: 'calc(100% - 24px)'
              }}
            />

            {/* Precision Ruler Calibrations (Major & Minor tick marks) */}
            <div
              aria-hidden="true"
              className="absolute left-4 right-4 sm:left-6 sm:right-6 top-[24px] sm:top-[28px] -translate-y-1/2 flex justify-between pointer-events-none z-0 opacity-50"
            >
              {Array.from({ length: 49 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-0.5 bg-heritage-gold-700 ${
                    i % 4 === 0 ? 'h-3 sm:h-3.5 bg-heritage-gold-800' : 'h-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Individual Milestone Nodes along the Rail */}
            {events.map((event, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;
              const isMemorial = event.isMemorial || !event.year;
              const nodeLabel = isMemorial ? 'Nay' : event.year;
              const displayLabel = getMilestoneDisplayLabel(event);

              return (
                <div
                  key={event.year || `rail-node-${idx}`}
                  className="relative flex flex-col items-center z-10 flex-shrink-0"
                  style={{ width: `${100 / events.length}%` }}
                >
                  {/* Button anchor container ensuring perfect vertical centering with track line */}
                  <div className="relative flex items-center justify-center h-12 sm:h-14">
                    {/* Active Golden Diamond Pointer Indicator */}
                    {isActive && (
                      <div className="absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none z-30">
                        <div className="w-2.5 h-2.5 bg-heritage-gold-400 rotate-45 border-t border-l border-white shadow-md" />
                      </div>
                    )}

                    {/* Circular Milestone Button */}
                    <button
                      ref={isActive ? activeNodeRef : null}
                      onClick={() => {
                        setActiveIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`group relative flex items-center justify-center rounded-full aspect-square flex-shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-red-700 ${
                        isActive
                          ? 'w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-heritage-red-700 via-heritage-red-800 to-heritage-red-950 text-heritage-gold-100 border-2 border-heritage-gold-300 shadow-xl scale-110 sm:scale-115 ring-4 ring-heritage-gold-400/50 z-30'
                          : isPast
                          ? 'w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-white via-heritage-red-50 to-heritage-red-100 text-heritage-red-900 border-2 border-heritage-red-500 hover:border-heritage-red-800 hover:scale-110 shadow-xs z-10'
                          : 'w-8 h-8 sm:w-9 sm:h-9 bg-white text-heritage-ink-800 border-2 border-heritage-gold-500 hover:border-heritage-red-700 hover:text-heritage-red-700 hover:scale-110 shadow-xs z-10'
                      }`}
                      title={`${event.exactDate || event.year} (${getMilestoneShortLabel(event)}): ${event.title}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isMemorial ? (
                        <Star
                          className={`${
                            isActive
                              ? 'w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-200 fill-heritage-gold-300 drop-shadow'
                              : 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-gold-500 fill-heritage-gold-400'
                          }`}
                        />
                      ) : (
                        <span
                          className={`font-serif font-black ${
                            isActive
                              ? 'text-xs sm:text-sm tracking-tight text-heritage-gold-100'
                              : 'text-[9.5px] sm:text-[10.5px]'
                          }`}
                        >
                          {nodeLabel}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Milestone Micro-Label below the button - 2 lines, no truncation */}
                  <div
                    className={`mt-1.5 sm:mt-2 text-center transition-all duration-200 pointer-events-none px-0.5 max-w-[66px] sm:max-w-[78px] md:max-w-[88px] ${
                      isActive
                        ? 'opacity-100 font-bold text-heritage-red-800 scale-105'
                        : isPast
                        ? 'opacity-90 text-heritage-red-950 font-semibold'
                        : 'opacity-85 text-heritage-ink-800 font-medium'
                    }`}
                  >
                    <span className="block text-[8px] sm:text-[9.5px] md:text-[10px] leading-[1.18] text-center">
                      {displayLabel.line1}
                    </span>
                    {displayLabel.line2 ? (
                      <span className="block text-[8px] sm:text-[9.5px] md:text-[10px] leading-[1.18] text-center">
                        {displayLabel.line2}
                      </span>
                    ) : (
                      <span className="hidden sm:block text-[8px] sm:text-[9.5px] md:text-[10px] leading-[1.18] opacity-0 select-none" aria-hidden="true">
                        &nbsp;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Highlight & Navigation Hint Footer */}
        <div className="mt-3 pt-2.5 border-t border-heritage-gold-300/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 text-heritage-gold-200 font-serif font-bold text-[10px] sm:text-[11px] shadow-xs flex-shrink-0">
              <Calendar className="w-3 h-3 text-heritage-gold-300" />
              <span>{currentEvent.exactDate || `Năm ${currentEvent.year}`}</span>
            </span>
            <span className="font-serif font-bold text-heritage-ink-900 truncate text-xs sm:text-sm">
              {currentEvent.title}
            </span>
            {currentEvent.location && (
              <span className="hidden md:inline-flex items-center space-x-1 text-heritage-ink-600 text-[11px]">
                <MapPin className="w-3 h-3 text-heritage-gold-600 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{currentEvent.location}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-heritage-ink-500">
            <span className="hidden sm:inline">
              💡 Phím <kbd className="px-1.5 py-0.5 bg-white border border-heritage-ivory-300 rounded font-mono text-[9px] shadow-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-heritage-ivory-300 rounded font-mono text-[9px] shadow-xs">→</kbd> hoặc chạm mốc trên thước để xem.
            </span>
            <span className="text-heritage-gold-700 font-semibold italic">
              Chạm ảnh hoặc nút Chi tiết để mở rộng
            </span>
          </div>
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
