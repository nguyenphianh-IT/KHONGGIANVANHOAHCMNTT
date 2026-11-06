import React from 'react';
import { TimelineEvent } from '../types';
import { Calendar, MapPin, Star, ChevronRight, BookOpen } from 'lucide-react';

interface TwoColumnTimelineMasonryProps {
  events: TimelineEvent[];
  onOpenDetailModal: (event: TimelineEvent) => void;
}

export const TwoColumnTimelineMasonry: React.FC<TwoColumnTimelineMasonryProps> = ({
  events,
  onOpenDetailModal
}) => {
  // Odd-indexed events for Left Column (1, 3, 5, 7, 9 -> index 0, 2, 4, 6, 8)
  const leftEvents = events.filter((_, idx) => idx % 2 === 0);
  // Even-indexed events for Right Column (2, 4, 6, 8, 10 -> index 1, 3, 5, 7, 9)
  const rightEvents = events.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP & TABLET: BỐ CỤC 2 CỘT ĐAN CÀI LIÊN TỤC (MASONRY)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative">
        {/* Central Red-Gold Spine running through the middle */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-heritage-gold-400 via-heritage-red-500 to-heritage-gold-500 rounded-full shadow-sm z-0"
        />

        {/* Decorative Golden Spine Glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -ml-2 top-0 bottom-0 w-4 bg-heritage-gold-400/10 blur-xs rounded-full pointer-events-none"
        />

        {/* 2 Parallel Columns Container */}
        <div className="grid grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {/* ◄ CỘT TRÁI: Các mốc 1, 3, 5, 7, 9 (1890, 1920, 1941, 1954, 1975) */}
          <div className="space-y-6 lg:space-y-8 flex flex-col items-end">
            {leftEvents.map((event, i) => {
              const chronologicalIndex = i * 2 + 1; // 1, 3, 5, 7, 9
              const isMemorial = event.isMemorial || !event.year;

              return (
                <div
                  key={event.year || `left-card-${i}`}
                  className="relative w-full group cursor-pointer"
                  onClick={() => onOpenDetailModal(event)}
                >
                  {/* Connector Arm connecting card to center spine */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-8 lg:-right-12 top-7 w-8 lg:w-12 h-0.5 bg-gradient-to-r from-heritage-gold-400 to-heritage-red-500 z-0 pointer-events-none"
                  />

                  {/* Central Node on the Axis */}
                  <div
                    aria-hidden="true"
                    className={`absolute -right-8 lg:-right-12 top-7 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center z-20 transition-transform duration-200 group-hover:scale-115 ${
                      isMemorial
                        ? 'bg-heritage-red-800 text-heritage-gold-300 border-heritage-gold-400 ring-2 ring-heritage-gold-400/40'
                        : 'bg-heritage-red-700 text-heritage-gold-300 border-heritage-gold-300'
                    }`}
                    title={event.exactDate || `Năm ${event.year}`}
                  >
                    {isMemorial ? (
                      <Star className="w-3.5 h-3.5 fill-heritage-gold-400 text-heritage-gold-300" />
                    ) : (
                      <span className="font-serif font-black text-[10px] tracking-tight">
                        {event.year}
                      </span>
                    )}
                  </div>

                  {/* Rich Heritage Card */}
                  <div className="bg-heritage-ivory-100 hover:bg-white rounded-2xl p-4 border border-heritage-ivory-300 hover:border-heritage-gold-400 shadow-sm hover:shadow-heritage-hover transition-all duration-300 text-left">
                    <div className="flex items-start space-x-3.5">
                      {/* Thumbnail Image */}
                      {event.imageUrl ? (
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden flex-shrink-0 relative border border-heritage-gold-300/70 bg-heritage-ivory-200 shadow-sm">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className={`w-full h-full object-cover ${
                              event.imagePosition || 'object-top'
                            } group-hover:scale-105 transition-transform duration-500`}
                            loading="lazy"
                          />
                          <div className="absolute top-1 left-1">
                            <span className="bg-heritage-red-900/85 text-heritage-gold-300 font-bold text-[9px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                              #{chronologicalIndex}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-heritage-red-900/10 border border-heritage-gold-300/40 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-heritage-red-700 opacity-60" />
                        </div>
                      )}

                      {/* Content Column */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div>
                          {/* Exact date & Year badge */}
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-heritage-red-700 mb-1">
                            {isMemorial ? (
                              <>
                                <Star className="w-3 h-3 text-heritage-gold-600 fill-heritage-gold-500 flex-shrink-0" />
                                <span>Thông điệp tưởng niệm</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                <span>{event.exactDate || `Năm ${event.year}`}</span>
                              </>
                            )}
                          </div>

                          {/* Event Title */}
                          <h4 className="font-serif text-sm lg:text-base font-bold text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors leading-snug line-clamp-2">
                            {event.title}
                          </h4>

                          {/* Short Description */}
                          <p className="mt-1 text-xs text-heritage-ink-600 leading-relaxed line-clamp-2">
                            {event.shortDescription}
                          </p>
                        </div>

                        {/* Footer info: Location & Detail link */}
                        <div className="mt-2 pt-2 border-t border-heritage-ivory-200 flex items-center justify-between text-[11px]">
                          {event.location ? (
                            <span className="flex items-center text-heritage-ink-500 truncate mr-2 max-w-[65%]">
                              <MapPin className="w-3 h-3 mr-0.5 text-heritage-red-600 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          ) : <span />}
                          <span className="text-heritage-red-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5 whitespace-nowrap ml-auto">
                            <span>Chi tiết</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ► CỘT PHẢI: Các mốc 2, 4, 6, 8, 10 (1911, 1930, 1945, 1969, Nay) */}
          {/* Subtle top offset (mt-12) creating natural interlace with Left Column */}
          <div className="space-y-6 lg:space-y-8 flex flex-col items-start mt-12 lg:mt-16">
            {rightEvents.map((event, i) => {
              const chronologicalIndex = (i + 1) * 2; // 2, 4, 6, 8, 10
              const isMemorial = event.isMemorial || !event.year;

              return (
                <div
                  key={event.year || `right-card-${i}`}
                  className="relative w-full group cursor-pointer"
                  onClick={() => onOpenDetailModal(event)}
                >
                  {/* Connector Arm connecting card to center spine */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-8 lg:-left-12 top-7 w-8 lg:w-12 h-0.5 bg-gradient-to-l from-heritage-gold-400 to-heritage-red-500 z-0 pointer-events-none"
                  />

                  {/* Central Node on the Axis */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-8 lg:-left-12 top-7 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center z-20 transition-transform duration-200 group-hover:scale-115 ${
                      isMemorial
                        ? 'bg-heritage-red-800 text-heritage-gold-300 border-heritage-gold-400 ring-2 ring-heritage-gold-400/40'
                        : 'bg-heritage-red-700 text-heritage-gold-300 border-heritage-gold-300'
                    }`}
                    title={event.exactDate || `Năm ${event.year}`}
                  >
                    {isMemorial ? (
                      <Star className="w-3.5 h-3.5 fill-heritage-gold-400 text-heritage-gold-300" />
                    ) : (
                      <span className="font-serif font-black text-[10px] tracking-tight">
                        {event.year}
                      </span>
                    )}
                  </div>

                  {/* Rich Heritage Card */}
                  <div className="bg-heritage-ivory-100 hover:bg-white rounded-2xl p-4 border border-heritage-ivory-300 hover:border-heritage-gold-400 shadow-sm hover:shadow-heritage-hover transition-all duration-300 text-left">
                    <div className="flex items-start space-x-3.5">
                      {/* Thumbnail Image */}
                      {event.imageUrl ? (
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden flex-shrink-0 relative border border-heritage-gold-300/70 bg-heritage-ivory-200 shadow-sm">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className={`w-full h-full object-cover ${
                              event.imagePosition || 'object-top'
                            } group-hover:scale-105 transition-transform duration-500`}
                            loading="lazy"
                          />
                          <div className="absolute top-1 left-1">
                            <span className="bg-heritage-red-900/85 text-heritage-gold-300 font-bold text-[9px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                              #{chronologicalIndex}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-heritage-red-900/10 border border-heritage-gold-300/40 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-heritage-red-700 opacity-60" />
                        </div>
                      )}

                      {/* Content Column */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div>
                          {/* Exact date & Year badge */}
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-heritage-red-700 mb-1">
                            {isMemorial ? (
                              <>
                                <Star className="w-3 h-3 text-heritage-gold-600 fill-heritage-gold-500 flex-shrink-0" />
                                <span>Thông điệp tưởng niệm</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                <span>{event.exactDate || `Năm ${event.year}`}</span>
                              </>
                            )}
                          </div>

                          {/* Event Title */}
                          <h4 className="font-serif text-sm lg:text-base font-bold text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors leading-snug line-clamp-2">
                            {event.title}
                          </h4>

                          {/* Short Description */}
                          <p className="mt-1 text-xs text-heritage-ink-600 leading-relaxed line-clamp-2">
                            {event.shortDescription}
                          </p>
                        </div>

                        {/* Footer info: Location & Detail link */}
                        <div className="mt-2 pt-2 border-t border-heritage-ivory-200 flex items-center justify-between text-[11px]">
                          {event.location ? (
                            <span className="flex items-center text-heritage-ink-500 truncate mr-2 max-w-[65%]">
                              <MapPin className="w-3 h-3 mr-0.5 text-heritage-red-600 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          ) : <span />}
                          <span className="text-heritage-red-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5 whitespace-nowrap ml-auto">
                            <span>Chi tiết</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE VIEW (< 768px): CHRONOLOGICAL STACK WITH LEFT TRACK
          ───────────────────────────────────────────────────────────── */}
      <div className="md:hidden relative pl-8 sm:pl-10 space-y-4">
        {/* Left vertical track on mobile */}
        <div
          aria-hidden="true"
          className="absolute left-3 sm:left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-heritage-gold-400 via-heritage-red-400 to-heritage-gold-500"
        />

        {events.map((event, idx) => {
          const isMemorial = event.isMemorial || !event.year;

          return (
            <div
              key={event.year || `mobile-masonry-${idx}`}
              className="relative group cursor-pointer"
              onClick={() => onOpenDetailModal(event)}
            >
              {/* Node on mobile left line */}
              <div
                className={`absolute -left-8 sm:-left-10 top-3.5 w-6 h-6 rounded-full border-2 shadow-xs flex items-center justify-center z-10 ${
                  isMemorial
                    ? 'bg-heritage-red-800 text-heritage-gold-300 border-heritage-gold-400'
                    : 'bg-heritage-red-700 text-heritage-gold-300 border-heritage-gold-300'
                }`}
              >
                {isMemorial ? (
                  <Star className="w-3 h-3 fill-heritage-gold-400 text-heritage-gold-300" />
                ) : (
                  <span className="text-[9px] font-bold">
                    {event.year ? event.year.slice(-2) : '•'}
                  </span>
                )}
              </div>

              {/* Card */}
              <div className="bg-heritage-ivory-100 hover:bg-white rounded-xl p-3 border border-heritage-ivory-300 shadow-xs">
                <div className="flex items-start space-x-3">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-18 h-18 rounded-lg object-cover flex-shrink-0 border border-heritage-gold-300/60"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-heritage-red-700 block mb-0.5">
                      {event.exactDate || `Năm ${event.year}`}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-heritage-ink-900 leading-snug line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-heritage-ink-600 line-clamp-2">
                      {event.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
