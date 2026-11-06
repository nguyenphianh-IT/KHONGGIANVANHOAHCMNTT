import React, { useState, useEffect } from 'react';
import { timelineData } from '../data/timelineData';
import { TimelineEvent } from '../types';
import {
  Sparkles,
  CheckCircle2,
  X,
  Star,
  BookOpen,
  Printer,
  Calendar,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { HorizontalTimelineRail } from './HorizontalTimelineRail';

export const Timeline: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    if (selectedEvent) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  const filterOptions = [
    { id: 'all', label: 'Tất cả các mốc' },
    { id: 'tuoi-tre', label: 'Thời niên thiếu (1890)' },
    { id: 'cuu-nuoc', label: 'Hành trình cứu nước (1911 - 1920)' },
    { id: 'lanh-dao', label: 'Lãnh đạo cách mạng (1930 - 1954)' },
    { id: 'di-chuc', label: 'Di chúc & Tưởng niệm (1969 - Nay)' },
  ];

  const filteredEvents = filter === 'all'
    ? timelineData
    : timelineData.filter(event => event.category === filter);

  return (
    <section id="timeline" className="py-16 md:py-24 bg-white border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>Chủ Tịch Hồ Chí Minh</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-heritage-ink-900 tracking-tight">
            Cuộc Đời Và Sự Nghiệp Cách Mạng Vĩ Đại
          </h2>
          <div className="w-16 h-1 bg-heritage-gold-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-heritage-ink-700 leading-relaxed">
            Dòng thời gian lịch sử ghi lại những dấu mốc thiêng liêng trong cuộc đời Chủ tịch Hồ Chí Minh –
            Anh hùng giải phóng dân tộc, Nhà văn hóa kiệt xuất của Việt Nam.
          </p>
          <p className="text-xs text-heritage-ink-500 italic mt-1">
            * Toàn bộ dữ liệu được tổng hợp từ nguồn lịch sử chính thống đã kiểm chứng của Viện Lịch sử Đảng và Bảo tàng Hồ Chí Minh.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                filter === opt.id
                  ? 'bg-heritage-red-700 text-white shadow-sm font-semibold'
                  : 'bg-heritage-ivory-200 text-heritage-ink-700 hover:bg-heritage-red-50 hover:text-heritage-red-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Trục thước đo thời gian nằm ngang chính thức (Phương án 4) */}
        <div className="animate-fadeIn">
          <HorizontalTimelineRail
            events={filteredEvents}
            onOpenDetailModal={(ev) => setSelectedEvent(ev)}
          />
        </div>

        {/* Timeline Terminal: Stylized Star Motif */}
        <div
          className="relative flex flex-col items-center justify-center pt-2 sm:pt-4 pb-2 animate-fadeInSoft"
          aria-label="Biểu trưng ngôi sao kết thúc dòng thời gian"
        >
          {/* Vertical Axis Extension Line connecting down from the timeline axis into the star */}
          <div
            aria-hidden="true"
            className="w-1 h-8 sm:h-10 bg-gradient-to-b from-heritage-red-200 via-heritage-red-300 to-heritage-gold-400 rounded-t-full"
          />

          {/* Stylized Star */}
          <div
            className="group relative -mt-0.5 cursor-default select-none transition-transform duration-300 ease-out hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            title="Biểu trưng ngôi sao – Không gian văn hóa Hồ Chí Minh"
          >
            <img
              src="/images/timeline-ngoi-sao.png"
              alt="Biểu trưng ngôi sao cách điệu"
              className="w-[65px] h-[65px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)] group-hover:drop-shadow-[0_2px_14px_rgba(212,175,55,0.55)] transition-all duration-300"
              loading="lazy"
            />
          </div>
        </div>
      </div>

        {/* Selected Event Detail Modal (Wide Museum-Grade Canvas matching ResourceModal) */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-heritage-ink-950/85 backdrop-blur-md animate-fadeIn select-text"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-heritage-ivory-50 rounded-3xl max-w-5xl xl:max-w-6xl w-full shadow-2xl border-2 border-heritage-gold-400/80 max-h-[95vh] flex flex-col overflow-hidden animate-slideUp text-heritage-ink-900"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-event-title"
            >
              {/* Top Sticky Heritage Header Bar */}
              <header className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 px-4 sm:px-6 py-3 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0 z-20 shadow-md">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src="/images/logo-bieu-tuong.png"
                    alt="Logo Trường THCS Nguyễn Trung Trực"
                    className="w-8 h-8 rounded-full border border-heritage-gold-300 shadow-sm flex-shrink-0 object-contain bg-white/10"
                  />
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs sm:text-sm text-heritage-gold-300 block truncate">
                      KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
                    </span>
                    <span className="text-[10px] text-white/80 block truncate">
                      Trường THCS Nguyễn Trung Trực • Dấu ấn lịch sử vẻ vang
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  {/* Font size toggle */}
                  <div className="flex items-center bg-black/25 rounded-lg p-0.5 border border-heritage-gold-400/30 text-xs">
                    <button
                      onClick={() => setFontSize('normal')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                        fontSize === 'normal'
                          ? 'bg-heritage-gold-400 text-heritage-red-950'
                          : 'text-white/80 hover:text-white'
                      }`}
                      title="Cỡ chữ chuẩn"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                        fontSize === 'large'
                          ? 'bg-heritage-gold-400 text-heritage-red-950'
                          : 'text-white/80 hover:text-white'
                      }`}
                      title="Cỡ chữ lớn"
                    >
                      A+
                    </button>
                  </div>

                  {/* Print Button */}
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="In tư liệu hoặc Lưu PDF"
                  >
                    <Printer className="w-5 h-5" />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                    aria-label="Đóng cửa sổ"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-12 py-7">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-heritage-red-800 text-white font-serif font-bold text-xs rounded-full shadow-sm">
                    {selectedEvent.isMemorial || !selectedEvent.year ? (
                      <>
                        <Star className="w-3.5 h-3.5 text-heritage-gold-300 fill-heritage-gold-400" />
                        <span>Mốc Tưởng Niệm Thiêng Liêng</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-heritage-gold-300" />
                        <span>Năm {selectedEvent.year} • {selectedEvent.exactDate}</span>
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-heritage-gold-600" />
                    <span>Tư liệu lịch sử Đảng & Bảo tàng HCM</span>
                  </span>

                  {selectedEvent.location && (
                    <span className="inline-flex items-center space-x-1 text-xs text-heritage-ink-600 px-2.5 py-1 rounded-full bg-heritage-ivory-200">
                      <MapPin className="w-3.5 h-3.5 text-heritage-red-700" />
                      <span>{selectedEvent.location}</span>
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <h2 id="timeline-event-title" className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heritage-red-950 leading-tight mb-5">
                  {selectedEvent.title}
                </h2>

                {/* Sapo / Lead Summary */}
                {selectedEvent.shortDescription && (
                  <div className="relative bg-gradient-to-r from-heritage-gold-100/70 via-heritage-gold-50/50 to-transparent p-4 sm:p-5 rounded-2xl border-l-4 border-heritage-gold-500 mb-6 shadow-sm">
                    <p className={`font-serif italic font-medium text-heritage-red-950 leading-relaxed ${
                      fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    }`}>
                      {selectedEvent.shortDescription}
                    </p>
                  </div>
                )}

                {/* Grand Photo Showcase (Clean museum frame, high-definition, caption placed beneath so faces are 100% visible) */}
                {selectedEvent.imageUrl && (
                  <figure className="my-6 rounded-2xl overflow-hidden border-2 border-heritage-gold-300 shadow-md bg-white p-2.5 sm:p-3 max-w-4xl mx-auto">
                    <div className="overflow-hidden rounded-xl bg-heritage-ivory-200 flex items-center justify-center">
                      <img
                        src={selectedEvent.imageUrl}
                        alt={selectedEvent.title}
                        className={`w-full max-h-[460px] object-cover sm:object-contain ${selectedEvent.imagePosition || 'object-top'} mx-auto hover:scale-[1.01] transition-transform duration-500`}
                      />
                    </div>
                    {selectedEvent.imageCaption && (
                      <figcaption className="text-center text-xs sm:text-sm font-sans italic text-heritage-ink-700 mt-2.5 px-3 py-1.5 bg-heritage-gold-50/70 rounded-lg border border-heritage-gold-200/50">
                        {selectedEvent.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Detailed Historical Narrative */}
                <div className="space-y-5 my-6">
                  {/* Diễn biến lịch sử */}
                  <div className="bg-white p-5 sm:p-7 rounded-2xl border border-heritage-ivory-300 shadow-sm">
                    <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-heritage-ivory-200">
                      <BookOpen className="w-5 h-5 text-heritage-red-700" />
                      <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900 uppercase tracking-wide">
                        {selectedEvent.isMemorial ? 'Nội dung thông điệp giáo dục' : 'Diễn biến lịch sử trọng đại'}
                      </h3>
                    </div>
                    <p className={`font-serif text-justify text-heritage-ink-900 leading-relaxed ${
                      fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    }`}>
                      {selectedEvent.fullDetail}
                    </p>
                  </div>

                  {/* Ý nghĩa lịch sử & Trách nhiệm thế hệ trẻ */}
                  <div className="bg-gradient-to-br from-heritage-gold-50 via-white to-heritage-gold-50/40 p-5 sm:p-7 rounded-2xl border-2 border-heritage-gold-300 shadow-sm">
                    <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-heritage-gold-200">
                      <CheckCircle2 className="w-5 h-5 text-heritage-gold-600" />
                      <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-950 uppercase tracking-wide">
                        {selectedEvent.isMemorial ? 'Ý nghĩa & Trách nhiệm thế hệ trẻ' : 'Ý nghĩa lịch sử đối với dân tộc'}
                      </h3>
                    </div>
                    <p className={`font-serif text-justify text-heritage-ink-950 font-medium leading-relaxed ${
                      fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    }`}>
                      {selectedEvent.significance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Footer */}
              <footer className="bg-heritage-ivory-100 px-6 py-3.5 border-t border-heritage-ivory-300 flex items-center justify-between flex-shrink-0">
                <div className="hidden sm:flex items-center space-x-2 text-xs text-heritage-ink-600">
                  <CheckCircle2 className="w-4 h-4 text-heritage-gold-600 flex-shrink-0" />
                  <span>Tư liệu chính thức phục vụ học tập & giáo dục truyền thống THCS Nguyễn Trung Trực</span>
                </div>
                <div className="flex items-center space-x-3 ml-auto">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-800 rounded-xl font-medium text-xs sm:text-sm border border-heritage-ivory-300 flex items-center space-x-1.5 transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In tư liệu</span>
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-900 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition"
                  >
                    Đóng lại
                  </button>
                </div>
              </footer>
            </div>
          </div>
        )}
    </section>
  );
};
