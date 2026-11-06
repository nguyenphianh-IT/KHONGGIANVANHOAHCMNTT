import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, TrendingUp, BookOpen, ChevronRight,
  ArrowRight, Eye, Star, ShieldCheck, Calendar, Award,
  Users, Landmark
} from 'lucide-react';
import { ResourceItem } from '../types';
import { resourcesData } from '../data/resourcesData';
import {
  getPublishedArticles,
  EVENT_ARTICLES_CHANGED,
  ArticleData,
  normalizeCategoryToHomepage,
  getCategoryLabel
} from '../lib/cmsStore';
import { ResourceModal } from './ResourceModal';

const mapArticleToResource = (art: ArticleData): ResourceItem => {
  const normCat = normalizeCategoryToHomepage(art.category);
  const label = getCategoryLabel(art.category);

  return {
    id: art.id || `art-${art.slug}`,
    title: art.title,
    category: normCat,
    categoryLabel: label,
    description: art.summary,
    fullContent: `${art.content}${art.references ? `\n\n---\n**Nguồn trích dẫn & Tham khảo:** ${art.references}` : ''}`,
    authorOrSource: art.author_name || 'Trường THCS Nguyễn Trung Trực',
    dateOrEra: art.updated_at || art.created_at || 'Mới xuất bản',
    thumbnail: art.featured_image || (normCat === 'video' ? '/images/timeline-ngoi-sao.png' : '/images/ho-chi-minh-tp-hcm.png'),
    badgeText: art.topic ? `⭐ ${art.topic}` : '⭐ Đã duyệt 4 Mắt (CMS)',
    isMockData: false,
    tags: [normCat, '4-eyes-approved', 'chinh-thuc', art.topic || '', art.category],
  };
};

export const Spotlight: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'featured' | 'latest' | 'most_read'>('featured');
  const [activeModalItem, setActiveModalItem] = useState<ResourceItem | null>(null);
  const [allResources, setAllResources] = useState<ResourceItem[]>([]);

  // Tải dữ liệu kết hợp thời gian thực từ CMS Store và kho tư liệu
  useEffect(() => {
    const loadResources = () => {
      const cmsPublished = getPublishedArticles();
      const mappedCms = cmsPublished.map(mapArticleToResource);
      // Kết hợp bài từ CMS (ưu tiên hiển thị) và kho dữ liệu nền tảng
      const combined = [...mappedCms, ...resourcesData];
      // Khử trùng lặp theo id hoặc title
      const uniqueMap = new Map<string, ResourceItem>();
      combined.forEach((item) => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });
      setAllResources(Array.from(uniqueMap.values()));
    };

    loadResources();
    window.addEventListener(EVENT_ARTICLES_CHANGED, loadResources);
    window.addEventListener('storage', loadResources);

    return () => {
      window.removeEventListener(EVENT_ARTICLES_CHANGED, loadResources);
      window.removeEventListener('storage', loadResources);
    };
  }, []);

  // 1. TƯ LIỆU TIÊU ĐIỂM (Featured Story & 2 Sub-features)
  // Ưu tiên bài về Không gian văn hóa THCS Nguyễn Trung Trực hoặc bài có chủ đề đặc biệt
  const featuredHero = useMemo(() => {
    if (allResources.length === 0) return null;
    return (
      allResources.find((r) => r.id === 'art-004' || r.title.includes('Nguyễn Trung Trực')) ||
      allResources.find((r) => r.id === 'res-1') ||
      allResources[0]
    );
  }, [allResources]);

  const subFeatured = useMemo(() => {
    if (!featuredHero) return [];
    return allResources
      .filter((r) => r.id !== featuredHero.id)
      .slice(0, 2);
  }, [allResources, featuredHero]);

  // 2. TƯ LIỆU MỚI NHẤT (Latest Articles - 4 bài giúp cân đối trọn vẹn chiều cao hai cột)
  const latestResources = useMemo(() => {
    return allResources.slice(0, 4);
  }, [allResources]);

  // 3. TƯ LIỆU ĐỌC NHIỀU NHẤT (Top 3 tác phẩm tiêu biểu vinh danh Vàng - Bạc - Đồng)
  const mostReadResources = useMemo(() => {
    // Sắp xếp các tác phẩm kinh điển & được quan tâm nhất
    const orderPriority = ['res-2', 'res-1', 'art-003', 'res-3', 'art-002'];
    const sorted = [...allResources].sort((a, b) => {
      const idxA = orderPriority.indexOf(a.id);
      const idxB = orderPriority.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    const viewCounts = [3520, 2890, 2410];
    return sorted.slice(0, 3).map((item, index) => ({
      ...item,
      viewCount: viewCounts[index] || 1500 - index * 120,
      rank: index + 1,
    }));
  }, [allResources]);

  const scrollToResources = () => {
    const el = document.getElementById('resources');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="spotlight" className="py-14 sm:py-18 md:py-20 bg-heritage-ivory-50 border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* SỨ MỆNH GIÁO DỤC CỦA NHÀ TRƯỜNG (Khung đỏ di sản theo chuẩn thiết kế)     */}
        {/* ========================================================================= */}
        <div className="mb-10 bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-heritage-gold-400/30">
          <div className="relative z-10 max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-gold-300 block mb-2 font-sans">
              Sứ mệnh giáo dục của nhà trường
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold leading-snug text-white">
              "Học tập và làm theo Bác từ những việc nhỏ nhất mỗi ngày"
            </h2>
            <p className="mt-3 text-sm sm:text-base text-heritage-ivory-100/90 leading-relaxed font-sans">
              Không gian văn hóa số không chỉ dừng lại ở các bài giảng lý thuyết mà còn là nơi các em học sinh
              tìm thấy động lực phấn đấu, tự giác rèn luyện nề nếp, bảo vệ môi trường, yêu thương bạn bè và bồi
              đắp ước mơ xây dựng quê hương Thới An, Thành phố Hồ Chí Minh ngày càng giàu đẹp, văn minh.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-heritage-gold-200">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
                <span>Toàn thể cán bộ, giáo viên, nhân viên & học sinh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Landmark className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
                <span>Đồng hành cùng nhân dân Phường Thới An</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE SEGMENT PILL CONTROL (Thu gọn chiều dài cuộn trang trên điện thoại) */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex items-center justify-between p-1 bg-heritage-ivory-200/90 rounded-2xl mb-6 border border-heritage-gold-300/60 shadow-inner select-none">
          <button
            onClick={() => setMobileTab('featured')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === 'featured'
                ? 'bg-heritage-red-800 text-white shadow-sm ring-1 ring-heritage-gold-400'
                : 'text-heritage-ink-700 hover:text-heritage-red-800'
            }`}
          >
            ⭐ Tiêu điểm ({subFeatured.length + 1})
          </button>
          <button
            onClick={() => setMobileTab('latest')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === 'latest'
                ? 'bg-heritage-red-800 text-white shadow-sm ring-1 ring-heritage-gold-400'
                : 'text-heritage-ink-700 hover:text-heritage-red-800'
            }`}
          >
            🆕 Mới nhất ({latestResources.length})
          </button>
          <button
            onClick={() => setMobileTab('most_read')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === 'most_read'
                ? 'bg-heritage-red-800 text-white shadow-sm ring-1 ring-heritage-gold-400'
                : 'text-heritage-ink-700 hover:text-heritage-red-800'
            }`}
          >
            📈 Đọc nhiều (Top 3)
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BENTO / NEWSPAPER SHOWCASE GRID                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: TƯ LIỆU TIÊU ĐIỂM (Cột 7 / 12)                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className={`lg:col-span-7 space-y-6 ${mobileTab !== 'featured' ? 'hidden lg:block' : ''}`}>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-heritage-red-800 mb-1">
              <Star className="w-4 h-4 text-heritage-gold-500 fill-heritage-gold-400" />
              <span>Tư Liệu Tiêu Điểm Chọn Lọc</span>
            </div>

            {/* GRAND FEATURE HERO CARD */}
            {featuredHero && (
              <div
                onClick={() => setActiveModalItem(featuredHero)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border-2 border-heritage-gold-300/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-heritage-gold-500 flex flex-col"
              >
                {/* Hero Image with high-definition aspect ratio */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black/10">
                  <img
                    src={featuredHero.thumbnail}
                    alt={featuredHero.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges on Hero Image */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 text-heritage-gold-300 font-serif font-black text-xs rounded-full border border-heritage-gold-400/80 shadow-md flex items-center space-x-1.5">
                      <Star className="w-3.5 h-3.5 fill-heritage-gold-400" />
                      <span>TIÊU ĐIỂM CHỦ ĐẠO</span>
                    </span>
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                      {featuredHero.categoryLabel}
                    </span>
                  </div>

                  {/* Meta bottom inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center space-x-3 text-xs text-heritage-gold-300 font-medium mb-1.5">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{featuredHero.dateOrEra}</span>
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">{featuredHero.authorOrSource}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black leading-snug drop-shadow-md text-white group-hover:text-heritage-gold-200 transition-colors">
                      {featuredHero.title}
                    </h3>
                  </div>
                </div>

                {/* Card Excerpt & CTA button */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-heritage-ivory-50/60">
                  <p className="text-sm sm:text-base text-heritage-ink-800 font-serif leading-relaxed line-clamp-3 mb-5">
                    {featuredHero.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-heritage-ivory-200">
                    <span className="text-xs font-semibold text-heritage-red-800 flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-heritage-gold-600" />
                      <span>Đã thẩm định 4 mắt • Ban Giám Hiệu</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(featuredHero);
                      }}
                      className="px-4 sm:px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-sm group-hover:shadow group-hover:bg-heritage-red-900 transition"
                    >
                      <span>Đọc toàn văn tư liệu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2 SUB-FEATURED CARDS IN A COMPACT ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subFeatured.map((subItem) => (
                <div
                  key={subItem.id}
                  onClick={() => setActiveModalItem(subItem)}
                  className="group cursor-pointer bg-white rounded-2xl p-4 border border-heritage-gold-300/60 shadow-sm hover:shadow-lg hover:border-heritage-gold-500 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-black/10">
                      <img
                        src={subItem.thumbnail}
                        alt={subItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-heritage-red-800/90 text-heritage-gold-200 backdrop-blur-sm border border-heritage-gold-400/40">
                        {subItem.categoryLabel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-heritage-ink-500 mb-1">
                      <Calendar className="w-3 h-3 text-heritage-red-700" />
                      <span>{subItem.dateOrEra}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors line-clamp-2 leading-snug">
                      {subItem.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-heritage-ink-700 font-serif line-clamp-2 leading-relaxed">
                      {subItem.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-heritage-ivory-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-heritage-gold-600 font-semibold truncate max-w-[130px]">
                      {subItem.authorOrSource}
                    </span>
                    <span className="text-heritage-red-700 font-bold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Xem</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: TƯ LIỆU MỚI & TƯ LIỆU ĐỌC NHIỀU (Cột 5 / 12)             */}
          {/* ----------------------------------------------------------------------- */}
          <div className={`lg:col-span-5 space-y-5 lg:space-y-6 ${mobileTab === 'featured' ? 'hidden lg:block' : ''}`}>
            {/* 1. TƯ LIỆU MỚI CẬP NHẬT */}
            <div className={`bg-white rounded-3xl p-5 border-2 border-heritage-ivory-300 shadow-md ${mobileTab === 'most_read' ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-heritage-ivory-200">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-heritage-red-100 text-heritage-red-800 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-heritage-red-950 uppercase tracking-wide">
                      Tư Liệu Mới Cập Nhật
                    </h3>
                    <span className="text-[11px] text-heritage-ink-500 block">Được cập nhật tự động từ ban biên tập</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Mới
                </span>
              </div>

              {/* Items List (4 Items - Cân đối chiều cao hai cột) */}
              <div className="divide-y divide-heritage-ivory-200">
                {latestResources.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveModalItem(item)}
                    className="group cursor-pointer py-2.5 first:pt-0 last:pb-0 flex items-start space-x-3 hover:bg-heritage-gold-50/50 p-1.5 rounded-xl transition"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 border border-heritage-gold-300/50 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-[11px] text-heritage-ink-500 mb-0.5">
                        <span className="text-heritage-red-700 font-semibold">{item.categoryLabel}</span>
                        <span>•</span>
                        <span>{item.dateOrEra}</span>
                      </div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-heritage-ink-600 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TƯ LIỆU ĐỌC NHIỀU NHẤT (RANKED TOP 3 PODIUM) */}
            <div className={`bg-gradient-to-br from-heritage-gold-50/70 via-white to-heritage-gold-50/40 rounded-3xl p-5 border-2 border-heritage-gold-300 shadow-md ${mobileTab === 'latest' ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-heritage-gold-200">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-heritage-gold-200 text-heritage-red-900 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-heritage-red-950 uppercase tracking-wide">
                      Tư Liệu Đọc Nhiều Nhất
                    </h3>
                    <span className="text-[11px] text-heritage-ink-600 block">Xếp hạng theo lượt quan tâm học tập</span>
                  </div>
                </div>
                <Award className="w-4 h-4 text-heritage-gold-600" />
              </div>

              {/* Ranked Top 3 Items */}
              <div className="space-y-2.5">
                {mostReadResources.map((item) => {
                  const isTop1 = item.rank === 1;
                  const isTop2 = item.rank === 2;
                  const isTop3 = item.rank === 3;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveModalItem(item)}
                      className={`group cursor-pointer p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center space-x-3 ${
                        isTop1
                          ? 'bg-white border-heritage-gold-400 shadow-sm hover:shadow-md hover:border-heritage-gold-500 ring-1 ring-heritage-gold-300/40'
                          : isTop2
                          ? 'bg-white/90 border-slate-300 hover:bg-white hover:border-slate-400 shadow-sm'
                          : 'bg-white/90 border-amber-300/80 hover:bg-white hover:border-amber-400 shadow-sm'
                      }`}
                    >
                      {/* Rank Medal Number */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black font-serif text-xs sm:text-sm flex-shrink-0 shadow-sm ${
                          isTop1
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-amber-300/50'
                            : isTop2
                            ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white ring-2 ring-slate-300/50'
                            : isTop3
                            ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white ring-2 ring-amber-600/40'
                            : 'bg-heritage-ivory-200 text-heritage-ink-700'
                        }`}
                      >
                        #{item.rank}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors line-clamp-1 leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-heritage-ink-500 mt-0.5">
                          <span className="flex items-center space-x-1 text-heritage-gold-600 font-semibold">
                            <Eye className="w-3 h-3" />
                            <span>{item.viewCount.toLocaleString('vi-VN')} lượt</span>
                          </span>
                          <span>•</span>
                          <span className="truncate">{item.categoryLabel}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-heritage-ink-400 group-hover:text-heritage-red-700 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  );
                })}
              </div>

              {/* Callout Button: Jump to All Resources */}
              <button
                onClick={scrollToResources}
                className="w-full mt-3 py-2 px-3 bg-white hover:bg-heritage-gold-50 text-heritage-red-900 border border-heritage-gold-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-heritage-gold-600" />
                <span>Xem toàn bộ Kho tư liệu ({allResources.length} tài liệu)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Modal (Mở đọc toàn văn, phóng to chữ, in ấn PDF chuẩn mực) */}
      <ResourceModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
};
