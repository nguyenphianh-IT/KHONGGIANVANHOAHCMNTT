import React, { useState, useEffect } from 'react';
import { timelineData } from '../data/timelineData';
import { TimelineEvent } from '../types';
import { Calendar, MapPin, Sparkles, ChevronRight, CheckCircle2, X, Star } from 'lucide-react';

export const Timeline: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

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
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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

        {/* Timeline Stream */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Center Line */}
            <div className="hidden md:block absolute left-1/2 -ml-0.5 top-0 bottom-0 w-1 bg-heritage-red-200" />

            <div className="space-y-8 md:space-y-12">
            {filteredEvents.map((event, idx) => {
              const isEven = idx % 2 === 0;
              const isMemorialEvent = event.isMemorial || !event.year;
              return (
                <div
                  key={event.year || `event-${idx}`}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge in Center */}
                  <div
                    className={`hidden md:flex absolute left-1/2 -ml-6 w-12 h-12 rounded-full border-4 shadow-md items-center justify-center font-serif font-black text-xs z-10 ${
                      isMemorialEvent
                        ? 'bg-gradient-to-br from-heritage-red-700 to-heritage-red-900 text-heritage-gold-300 border-heritage-gold-400 shadow-gold-glow'
                        : 'bg-heritage-red-700 text-heritage-gold-300 border-white'
                    }`}
                  >
                    {isMemorialEvent ? (
                      <Star className="w-5 h-5 text-heritage-gold-300 fill-heritage-gold-400 drop-shadow" />
                    ) : (
                      event.year
                    )}
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                    <div
                      onClick={() => setSelectedEvent(event)}
                      className={`group cursor-pointer rounded-xl p-5 sm:p-6 border transition-all duration-200 ${
                        isMemorialEvent
                          ? 'bg-heritage-ivory-100 hover:bg-white border-heritage-gold-400/60 hover:border-heritage-gold-500 shadow-sm hover:shadow-heritage-hover ring-1 ring-heritage-gold-300/30'
                          : 'bg-heritage-ivory-100 hover:bg-white border-heritage-ivory-300 hover:border-heritage-gold-400 shadow-sm hover:shadow-heritage-hover'
                      }`}
                    >
                      {/* Mobile year / memorial badge */}
                      {isMemorialEvent ? (
                        <div className="md:hidden inline-flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-heritage-red-800 to-heritage-red-700 text-heritage-gold-300 font-serif font-bold text-xs rounded border border-heritage-gold-400/40 mb-3">
                          <Star className="w-3.5 h-3.5 fill-heritage-gold-400 text-heritage-gold-300 flex-shrink-0" />
                          <span>Thông điệp tưởng niệm</span>
                        </div>
                      ) : (
                        <div className="md:hidden inline-block px-2.5 py-1 bg-heritage-red-700 text-heritage-gold-300 font-serif font-bold text-xs rounded mb-3">
                          Năm {event.year} • {event.exactDate}
                        </div>
                      )}

                      <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-heritage-red-700 mb-1.5">
                        {isMemorialEvent ? (
                          <>
                            <Star className="w-3.5 h-3.5 text-heritage-gold-600 fill-heritage-gold-500 flex-shrink-0" />
                            <span>Thông điệp tưởng niệm & Tiếp bước</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{event.exactDate || `Năm ${event.year}`}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors">
                        {event.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-heritage-ink-700 leading-relaxed line-clamp-2">
                        {event.shortDescription}
                      </p>

                      <div className="mt-4 pt-3 border-t border-heritage-ivory-200 flex items-center justify-between gap-2 sm:gap-3 text-xs">
                        {event.location ? (
                          <span className="flex items-center text-heritage-ink-500 min-w-0 flex-1 mr-2">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-red-600 flex-shrink-0" />
                            <span className="truncate" title={event.location}>{event.location}</span>
                          </span>
                        ) : null}
                        <span className="text-heritage-red-700 font-semibold flex items-center group-hover:translate-x-0.5 transition-transform flex-shrink-0 whitespace-nowrap ml-auto">
                          <span>Xem chi tiết</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5 flex-shrink-0" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

        {/* Selected Event Detail Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-heritage-gold-400 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-event-title"
            >
              <div className="flex items-start justify-between pb-4 border-b border-heritage-ivory-300">
                <div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-heritage-red-100 text-heritage-red-800 rounded font-semibold text-xs mb-1">
                    {selectedEvent.isMemorial || !selectedEvent.year ? (
                      <>
                        <Star className="w-3.5 h-3.5 text-heritage-gold-600 fill-heritage-gold-500 flex-shrink-0" />
                        <span>Thông điệp tưởng niệm thiêng liêng</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-heritage-red-700" />
                        <span>Năm {selectedEvent.year} • {selectedEvent.exactDate}</span>
                      </>
                    )}
                  </div>
                  <h3 id="timeline-event-title" className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900 mt-1">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-full text-heritage-ink-500 hover:text-heritage-ink-900 hover:bg-heritage-ivory-200 transition-colors"
                  aria-label="Đóng cửa sổ chi tiết mốc lịch sử"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-heritage-ink-800 text-sm sm:text-base leading-relaxed">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-heritage-red-700 mb-1">
                    {selectedEvent.isMemorial ? 'Nội dung thông điệp giáo dục' : 'Diễn biến lịch sử'}
                  </h4>
                  <p className="bg-heritage-ivory-100 p-4 rounded-xl border border-heritage-ivory-200 text-heritage-ink-800">
                    {selectedEvent.fullDetail}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-heritage-gold-600 mb-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-heritage-gold-500" />
                    <span>{selectedEvent.isMemorial ? 'Ý nghĩa & Trách nhiệm thế hệ trẻ' : 'Ý nghĩa lịch sử'}</span>
                  </h4>
                  <p className="p-3 bg-heritage-gold-50/70 border border-heritage-gold-200 rounded-lg text-heritage-ink-900 font-medium text-xs sm:text-sm">
                    {selectedEvent.significance}
                  </p>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center text-xs text-heritage-ink-500 pt-2 border-t border-heritage-ivory-200">
                    <MapPin className="w-4 h-4 text-heritage-red-600 mr-1.5 flex-shrink-0" />
                    <span>Địa điểm lịch sử: <strong>{selectedEvent.location}</strong></span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-heritage-ivory-300 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
