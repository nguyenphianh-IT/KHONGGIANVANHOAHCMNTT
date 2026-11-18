import React, { useEffect, useState } from 'react';
import { SchoolActivity } from '../types';
import {
  X, Calendar, Users, BookOpen, Printer,
  Sparkles, CheckCircle2, ShieldCheck, Quote, Eye, User
} from 'lucide-react';
import { ContentRenderer } from './cms/ContentRenderer';
import {
  recordArticleView,
  getViewCount,
  EVENT_VIEWS_CHANGED,
  MIN_ENGAGEMENT_DWELL_MS
} from '../lib/viewsStore';
import { resolveArticleQuote } from '../data/quotesData';

interface ActivityModalProps {
  activity: SchoolActivity | null;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [currentViews, setCurrentViews] = useState<number>(() => activity ? getViewCount(activity.id) : 0);

  useEffect(() => {
    if (!activity?.id) return;
    setCurrentViews(getViewCount(activity.id));

    const handleViewsChanged = () => {
      setCurrentViews(getViewCount(activity.id));
    };
    window.addEventListener(EVENT_VIEWS_CHANGED, handleViewsChanged);

    // KIỂM SOÁT ĐỌC THỰC TẾ & CHỐNG VIEW ẢO:
    // Độc giả phải lưu lại đọc bài ít nhất 3 giây mới được ghi nhận 1 lượt đọc hợp lệ.
    const dwellTimer = setTimeout(async () => {
      const res = await recordArticleView(activity.id);
      if (res.success) {
        setCurrentViews(res.newCount);
      }
    }, MIN_ENGAGEMENT_DWELL_MS);

    return () => {
      clearTimeout(dwellTimer);
      window.removeEventListener(EVENT_VIEWS_CHANGED, handleViewsChanged);
    };
  }, [activity?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activity) return null;

  const handlePrint = () => {
    window.print();
  };

  // Estimate reading time
  const wordCount = (activity.fullDetail || activity.summary || '').trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));
  const activeQuote = activity.quote || resolveArticleQuote(activity.quoteId, undefined, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-heritage-ink-950/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        className="bg-heritage-ivory-50 rounded-3xl max-w-5xl xl:max-w-6xl w-full shadow-2xl border-2 border-heritage-gold-400/80 max-h-[95vh] flex flex-col overflow-hidden animate-slideUp text-heritage-ink-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
      >
        {/* ========================================================================= */}
        {/* 1. TOP STICKY UTILITY BAR                                                 */}
        {/* ========================================================================= */}
        <header className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 px-4 sm:px-6 py-3 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0 z-20 shadow-md">
          {/* School Brand & Breadcrumb */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src="/images/logo-bieu-tuong.png"
              alt="Logo"
              className="w-8 h-8 rounded-full border border-heritage-gold-300 shadow-sm flex-shrink-0 object-contain"
            />
            <div className="min-w-0">
              <span className="font-serif font-bold text-xs sm:text-sm text-heritage-gold-300 block truncate">
                KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
              </span>
              <span className="text-[10px] text-white/80 block truncate">
                Trường THCS Nguyễn Trung Trực • Phường Thới An
              </span>
            </div>
          </div>

          {/* Reading Controls (Font Size, Print, Close) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {/* Font size toggle */}
            <div className="flex items-center bg-black/25 rounded-lg p-0.5 border border-heritage-gold-400/30 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                  fontSize === 'normal'
                    ? 'bg-heritage-gold-400 text-heritage-red-950'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Cỡ chữ tiêu chuẩn"
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
                title="Cỡ chữ lớn dễ đọc"
              >
                A+
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="In bài viết hoặc Lưu PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-white/20" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition flex items-center space-x-1"
              aria-label="Đóng cửa sổ"
              title="Đóng (phím Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. SCROLLABLE EDITORIAL ARTICLE BODY                                      */}
        {/* ========================================================================= */}
        <div className="flex-grow overflow-y-auto">
          {/* HERO COVER IMAGE (Khung trưng bày toàn vẹn tỷ lệ, tuyệt đối không cắt xén ảnh hoạt động/chân dung) */}
          {activity.imageUrl && (
            <div className="relative w-full bg-heritage-ink-950 overflow-hidden flex items-center justify-center px-4 sm:px-8 pt-5 pb-16 sm:pt-7 sm:pb-16 min-h-[260px] sm:min-h-[360px]">
              {/* Nền mờ nghệ thuật đồng tông màu ảnh */}
              <img
                src={activity.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45 brightness-75 pointer-events-none select-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ho-chi-minh-tp-hcm.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-heritage-ink-950/40 via-heritage-ink-950/20 to-heritage-ivory-50 pointer-events-none" />

              {/* Ảnh chính giữ trọn vẹn tỷ lệ gốc */}
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="relative z-10 w-auto max-w-full max-h-[340px] sm:max-h-[460px] md:max-h-[540px] object-contain rounded-xl shadow-2xl border border-heritage-gold-300/40 transition-transform duration-500 hover:scale-[1.01]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ho-chi-minh-tp-hcm.png';
                }}
              />

              {/* Floating Badges cleanly positioned below image frame */}
              <div className="absolute bottom-3 left-4 sm:left-10 right-4 z-20 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 bg-heritage-red-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md backdrop-blur-sm">
                  {activity.categoryLabel || 'Hoạt Động & Phong Trào'}
                </span>
                <span className="px-3.5 py-1.5 bg-black/70 text-white text-xs sm:text-sm rounded-full backdrop-blur-sm font-sans font-medium flex items-center space-x-1 border border-white/10" title="Thời gian đọc ước tính">
                  <Sparkles className="w-3.5 h-3.5 text-heritage-gold-300" />
                  <span>~{readingTime} phút đọc</span>
                </span>
                <span className="px-3.5 py-1.5 bg-black/70 text-white text-xs sm:text-sm rounded-full backdrop-blur-sm font-sans font-medium flex items-center space-x-1.5 border border-white/10" title="Số lượt đọc thực tế đã được kiểm duyệt chống view ảo">
                  <Eye className="w-3.5 h-3.5 text-heritage-gold-300" />
                  <span>{currentViews.toLocaleString('vi-VN')} lượt đọc</span>
                </span>
              </div>
            </div>
          )}

          {/* ARTICLE CONTENT CANVAS */}
          <article className="max-w-4xl mx-auto px-6 sm:px-12 md:px-14 py-7 sm:py-9 space-y-7">
            {/* If no cover image, display badges here */}
            {!activity.imageUrl && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-heritage-red-700 text-white font-bold text-xs rounded-full">
                  {activity.categoryLabel || 'Hoạt Động & Phong Trào'}
                </span>
                <span className="text-xs text-heritage-ink-500 font-sans flex items-center space-x-1.5">
                  <span>~{readingTime} phút đọc</span>
                  <span>•</span>
                  <span className="inline-flex items-center text-heritage-gold-700 font-bold" title="Số lượt đọc thực tế">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    {currentViews.toLocaleString('vi-VN')} lượt đọc
                  </span>
                </span>
              </div>
            )}

            {/* Main Headline */}
            <div>
              <h1
                id="activity-modal-title"
                className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-heritage-red-950 leading-tight tracking-tight"
              >
                {activity.title}
              </h1>

              {/* Author & Publication Metadata Bar */}
              <div className="mt-4 pt-4 border-t border-heritage-gold-300/40 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-heritage-ink-600">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-heritage-red-100 border border-heritage-red-200 text-heritage-red-800 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-heritage-ink-500 text-[11px] block font-sans">Đơn vị tổ chức & Biên soạn:</span>
                    <strong className="text-heritage-ink-900 font-serif">{activity.organizer}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-sans">
                  <div className="flex items-center space-x-1.5 text-heritage-ink-600">
                    <Calendar className="w-4 h-4 text-heritage-gold-600 flex-shrink-0" />
                    <span>{activity.date}</span>
                  </div>
                  {activity.participants && (
                    <div className="flex items-center space-x-1.5 text-heritage-ink-600 hidden sm:flex">
                      <Users className="w-4 h-4 text-heritage-red-700 flex-shrink-0" />
                      <span title={activity.participants}>
                        {activity.participants.length > 45 ? activity.participants.slice(0, 45) + '...' : activity.participants}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Thẩm định 4 Mắt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sapo / Summary Lead Highlight */}
            {activity.summary && (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-heritage-gold-100/70 via-heritage-ivory-100 to-heritage-gold-50/50 rounded-2xl border-l-4 border-heritage-gold-500 shadow-sm">
                <p className="font-serif italic text-base sm:text-lg text-heritage-red-950 leading-relaxed font-medium">
                  {activity.summary}
                </p>
              </div>
            )}

            {/* MAIN ARTICLE BODY (ContentRenderer) */}
            <div className="pt-2">
              <ContentRenderer
                content={activity.fullDetail || activity.summary}
                fontSize={fontSize}
                mediaAssets={activity.mediaAssets}
              />
            </div>

            {/* Quote of President Ho Chi Minh (Linh hoạt theo danh ngôn được chọn) */}
            <div className="my-8 p-6 sm:p-7 bg-gradient-to-br from-heritage-red-900 via-heritage-red-850 to-heritage-red-950 text-white rounded-3xl shadow-xl border border-heritage-gold-400/50 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-36 h-36 opacity-10 pointer-events-none">
                <Quote className="w-full h-full text-heritage-gold-300" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black/30 rounded-full border border-heritage-gold-400/30 text-[11px] font-sans text-heritage-gold-300 font-semibold">
                  <span>✨ {activeQuote.category || 'Tư tưởng & Đạo đức Bác Hồ'}</span>
                  {activeQuote.year && <span>• Năm {activeQuote.year}</span>}
                </div>

                <p className="font-serif italic text-base sm:text-lg md:text-xl text-heritage-gold-100 leading-relaxed">
                  "{activeQuote.quote}"
                </p>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                  <span className="text-white/75 italic text-[11px] sm:text-xs">
                    {activeQuote.context ? `Xuất xứ: ${activeQuote.context}` : ''}
                  </span>
                  <span className="text-right font-bold text-heritage-gold-400 uppercase tracking-wider text-xs ml-auto">
                    — Chủ tịch Hồ Chí Minh
                  </span>
                </div>

                {activeQuote.lesson && (
                  <div className="p-3 bg-black/25 rounded-xl border border-heritage-gold-400/20 text-xs text-heritage-gold-200/90 leading-relaxed">
                    💡 <strong className="text-heritage-gold-300">Ý nghĩa giáo dục học đường:</strong> {activeQuote.lesson}
                  </div>
                )}
              </div>
            </div>

            {/* Educational Pledge & School Seal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-heritage-gold-300/70 shadow-sm flex items-start space-x-3.5">
              <div className="p-2 bg-heritage-red-50 text-heritage-red-700 rounded-xl flex-shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs text-heritage-ink-700 leading-relaxed">
                <p className="font-bold text-heritage-red-900 font-serif text-sm">
                  Phong Trào Hoạt Động & Giáo Dục Truyền Thống Học Đường
                </p>
                <p>
                  Hoạt động phong trào chính thức của Liên đội và Chi đoàn Giáo viên <strong>Trường THCS Nguyễn Trung Trực (Phường Thới An, Thành phố Hồ Chí Minh)</strong> nhằm giáo dục truyền thống cách mạng, bồi dưỡng lý tưởng sống và rèn luyện đạo đức theo tấm gương Bác Hồ vĩ đại.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* ========================================================================= */}
        {/* 3. FOOTER ACTIONS                                                         */}
        {/* ========================================================================= */}
        <footer className="bg-heritage-ivory-100 px-6 py-4 border-t border-heritage-gold-300/50 flex items-center justify-between flex-shrink-0 text-xs z-10">
          <div className="flex items-center space-x-2 text-heritage-ink-500 font-medium hidden sm:flex">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã thẩm định chuẩn mực chính trị & di sản tư tưởng Bác Hồ</span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-800 border border-heritage-gold-300 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-heritage-red-700" />
              <span>In bài viết</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Đóng lại
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ActivityModal;
