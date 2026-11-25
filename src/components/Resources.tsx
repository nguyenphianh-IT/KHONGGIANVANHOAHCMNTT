import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { resourcesData, MOCK_EXCLUDED_RESOURCE_IDS } from '../data/resourcesData';
import { ResourceCategory, ResourceItem } from '../types';
import { ResourceModal } from './ResourceModal';
import { BookFlipbookModal } from './BookFlipbookModal';
import { 
  Search, Filter, BookOpen, FileText, Sparkles, Video, Book, 
  X, AlertCircle, Volume2, Headphones, ChevronLeft, ChevronRight, Eye, Calendar 
} from 'lucide-react';
import {
  getPublishedArticles,
  EVENT_ARTICLES_CHANGED,
  ArticleData,
  normalizeCategoryToHomepage,
  getCategoryLabel,
  resolveMediaUrl,
  fetchArticlesFromSupabase,
  isActivityArticle
} from '../lib/cmsStore';
import {
  getAllViewCounts,
  EVENT_VIEWS_CHANGED,
  fetchCloudViewCounts
} from '../lib/viewsStore';
import { resolveArticleQuote } from '../data/quotesData';
import { formatActivityDate } from './Activities';

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
    dateOrEra: formatActivityDate(art.updated_at || art.created_at),
    thumbnail: resolveMediaUrl(art.featured_image, art.media_assets) || (normCat === 'video' ? '/images/timeline-ngoi-sao.png' : '/images/ho-chi-minh-tp-hcm.png'),
    audioUrl: art.audio_url || undefined,
    audioDuration: art.audio_duration || undefined,
    pdfAttachment: art.pdf_attachment || undefined,
    badgeText: art.topic ? `⭐ ${art.topic}` : '⭐ Đã duyệt 4 Mắt (CMS)',
    isMockData: false,
    tags: [normCat, '4-eyes-approved', 'chinh-thuc', art.topic || '', art.category],
    mediaAssets: art.media_assets,
    quoteId: art.quote_id,
    quote: resolveArticleQuote(art.quote_id, art.custom_quote, 1),
  };
};

export const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<ResourceItem | null>(null);
  const [activeFlipbookItem, setActiveFlipbookItem] = useState<ResourceItem | null>(null);
  const [liveResources, setLiveResources] = useState<ResourceItem[]>([]);
  const [viewsMap, setViewsMap] = useState<Record<string, number>>(() => getAllViewCounts());

  useEffect(() => {
    // 1. Tải các bài viết đã duyệt 4 mắt & xuất bản từ CMS Store (Đồng bộ thời gian thực)
    const loadPublishedResources = () => {
      const cmsPublished = getPublishedArticles();
      // Phân loại: CHỈ hiển thị bài viết thuộc Kho Tư Liệu Số Hóa, LOẠI BỎ bài thuộc chuyên mục Hoạt động & Phong trào
      const resourceArticles = cmsPublished.filter((art) => !isActivityArticle(art));
      const mapped = resourceArticles.map(mapArticleToResource);
      setLiveResources(mapped);
    };

    const handleViewsUpdate = () => {
      setViewsMap(getAllViewCounts());
    };

    loadPublishedResources();
    handleViewsUpdate();

    // Đồng bộ số lượt đọc từ Supabase Cloud
    fetchCloudViewCounts().then((cloudCounts) => {
      if (cloudCounts && Object.keys(cloudCounts).length > 0) {
        setViewsMap(cloudCounts);
      }
    });

    // Lắng nghe sự kiện cập nhật tức thời khi Ban Giám Hiệu phê duyệt bài viết trong CMS
    window.addEventListener(EVENT_ARTICLES_CHANGED, loadPublishedResources);
    window.addEventListener(EVENT_VIEWS_CHANGED, handleViewsUpdate);
    window.addEventListener('storage', loadPublishedResources);
    window.addEventListener('storage', handleViewsUpdate);

    // 2. Tự động đồng bộ các bài viết đã duyệt 4 mắt & xuất bản từ Cloud Database về kho tư liệu
    fetchArticlesFromSupabase()
      .then(() => {
        loadPublishedResources();
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(EVENT_ARTICLES_CHANGED, loadPublishedResources);
      window.removeEventListener(EVENT_VIEWS_CHANGED, handleViewsUpdate);
      window.removeEventListener('storage', loadPublishedResources);
      window.removeEventListener('storage', handleViewsUpdate);
    };
  }, []);

  const categories = [
    { id: 'all' as ResourceCategory, label: 'Tất cả tư liệu', icon: Filter },
    { id: 'article' as ResourceCategory, label: 'Bài viết', icon: FileText },
    { id: 'book' as ResourceCategory, label: 'Sách & Tài liệu', icon: Book },
    { id: 'image' as ResourceCategory, label: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh', icon: Sparkles },
    { id: 'video' as ResourceCategory, label: 'Phim tư liệu', icon: Video },
    { id: 'audio' as ResourceCategory, label: 'Băng ghi âm lời Bác', icon: Volume2 },
  ];

  const allCombinedResources = useMemo(() => {
    // Loại bỏ hoàn toàn toàn bộ các mục mẫu res-1..res-8 và audio-* sinh ra trong lúc làm giao diện
    const filteredStatic = resourcesData.filter(
      (r) => !MOCK_EXCLUDED_RESOURCE_IDS.has(r.id) && !r.id.startsWith('audio-')
    );
    const filteredLive = liveResources.filter(
      (r) => !MOCK_EXCLUDED_RESOURCE_IDS.has(r.id) && !r.id.startsWith('audio-')
    );

    return [...filteredLive, ...filteredStatic];
  }, [liveResources]);

  const filteredResources = useMemo(() => {
    return allCombinedResources.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q)) ||
        item.authorOrSource.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [allCombinedResources, selectedCategory, searchQuery]);

  // ---------------------------------------------------------------------------
  // PHÂN TRANG KHO TƯ LIỆU: 9 tư liệu / trang (3 cột x 3 dòng cân đối hoàn hảo)
  // ---------------------------------------------------------------------------
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Tự động quay về trang 1 khi thay đổi bộ lọc danh mục hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE) || 1;

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogEl = document.getElementById('resources-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <section id="resources" className="py-8 sm:py-10 md:py-12 bg-heritage-ivory-100 border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center max-w-5xl lg:max-w-6xl mx-auto mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>Kho Tri Thức Học Đường</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-ink-900 tracking-tight whitespace-normal sm:whitespace-nowrap">
            Kho Tư Liệu Số Hóa
          </h2>
          <div className="w-16 h-1 bg-heritage-gold-400 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Search & Filter Controls */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto mb-6 sm:mb-8 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-ink-500 pointer-events-none" aria-hidden="true" />
            <input
              id="resources-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tư liệu: Tuyên ngôn độc lập, Di chúc, Bến Nhà Rồng, học tập..."
              aria-label="Tìm kiếm tư liệu học tập và lịch sử"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-heritage-ivory-300 focus:border-heritage-red-600 focus:ring-2 focus:ring-heritage-red-100 text-sm placeholder:text-heritage-ink-500 text-heritage-ink-900 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-heritage-ink-500 hover:text-heritage-ink-900"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs (Trượt mượt mà bằng Motion layoutId, thích ứng đa màn hình) */}
          <div className="flex flex-wrap items-center justify-center py-1.5 gap-1.5 sm:gap-2 select-none w-full">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative flex items-center space-x-1.5 px-2.5 sm:px-3 lg:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap shadow-xs ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:bg-heritage-red-50 hover:text-heritage-red-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeResourceCategoryTab"
                      className="absolute inset-0 bg-heritage-red-700 rounded-xl shadow-sm ring-1 ring-heritage-gold-400 z-0"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`relative z-10 w-3.5 h-3.5 flex-shrink-0 transition-colors ${isActive ? 'text-heritage-gold-300' : 'text-heritage-red-700'}`} />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Results Summary */}
          <div className="flex items-center justify-between text-xs text-heritage-ink-600 px-1">
            <span>
              Tìm thấy <strong className="text-heritage-red-700 font-bold">{filteredResources.length}</strong> mục tư liệu
              {searchQuery && ` cho từ khóa "${searchQuery}"`}
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-heritage-red-700 font-medium hover:underline flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Anchor point for smooth scrolling on pagination change */}
        <div id="resources-catalog" className="scroll-mt-28" />

        {/* Resources Grid (3 cột x 3 dòng = 9 tư liệu / trang cân đối tuyệt đẹp) */}
        {filteredResources.length > 0 ? (
          <div>
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
            >
              {paginatedResources.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    },
                  }}
                  onClick={() => setActiveModalItem(item)}
                  className="group cursor-pointer bg-white rounded-xl border border-heritage-ivory-300 shadow-sm hover:shadow-heritage-hover hover:border-heritage-gold-400 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Card Thumbnail */}
                    <div className="relative h-52 sm:h-56 overflow-hidden bg-heritage-ivory-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {item.category === 'audio' && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-heritage-gold-400 text-heritage-red-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Headphones className="w-6 h-6" />
                          </div>
                        </div>
                      )}

                      {item.isMockData && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="px-2.5 py-1 bg-black/80 text-amber-300 text-xs font-medium rounded backdrop-blur-sm block truncate shadow">
                            Minh họa giáo dục số
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5">
                      {/* Phân loại tài liệu, số trang & ngày tháng đặt dưới hình để không che bìa sách */}
                      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-heritage-red-800 text-white font-semibold text-xs rounded shadow-xs flex items-center space-x-1">
                            {item.category === 'audio' && <Volume2 className="w-3 h-3 text-heritage-gold-300 mr-1" />}
                            <span>{item.categoryLabel}</span>
                          </span>

                          {item.pdfAttachment && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-[11px] font-mono font-bold rounded flex items-center space-x-1">
                              <BookOpen className="w-3 h-3 text-emerald-600" />
                              <span>{item.pdfAttachment.totalPages} trang</span>
                            </span>
                          )}

                          {item.audioDuration && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono font-bold rounded">
                              ⏱️ {item.audioDuration}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 text-xs text-heritage-ink-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-heritage-red-700" />
                          <span>{item.dateOrEra}</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-sm text-heritage-ink-700 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3 border-t border-heritage-ivory-200 flex items-center justify-between gap-2 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 truncate min-w-0 flex-1">
                      <span className="text-heritage-ink-500 truncate font-medium" title={item.authorOrSource}>
                        {item.authorOrSource}
                      </span>
                      <span className="inline-flex items-center space-x-0.5 text-heritage-gold-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-heritage-gold-300/40 flex-shrink-0" title="Số lượt đọc thực tế">
                        <Eye className="w-3 h-3 text-heritage-gold-600" />
                        <span>{(viewsMap[item.id] || 0).toLocaleString('vi-VN')}</span>
                      </span>
                    </div>
                    {item.pdfAttachment ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFlipbookItem(item);
                        }}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm flex-shrink-0"
                      >
                        <span>📖 Đọc lật trang</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <span className="text-heritage-red-700 font-bold group-hover:underline flex-shrink-0 whitespace-nowrap flex items-center space-x-1">
                        <span>{item.category === 'audio' ? '🎧 Nghe ghi âm' : 'Xem chi tiết'}</span>
                        <span>→</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Thanh điều khiển phân trang (Pagination Controls) */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-heritage-ivory-300">
                <div className="text-xs sm:text-sm text-heritage-ink-600 font-medium order-2 sm:order-1 text-center sm:text-left">
                  Hiển thị <span className="font-bold text-heritage-red-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-heritage-red-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredResources.length)}</span> trên tổng số <span className="font-bold text-heritage-red-700">{filteredResources.length}</span> mục tư liệu (Trang {currentPage}/{totalPages})
                </div>

                <nav aria-label="Phân trang tư liệu" className="inline-flex items-center gap-1.5 order-1 sm:order-2">
                  {/* Nút Trước */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      currentPage === 1
                        ? 'bg-heritage-ivory-200 text-heritage-ink-400 cursor-not-allowed border border-heritage-ivory-300'
                        : 'bg-white text-heritage-ink-800 hover:bg-heritage-red-50 hover:text-heritage-red-700 border border-heritage-ivory-300 shadow-sm active:scale-95'
                    }`}
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trang trước</span>
                  </button>

                  {/* Danh sách các số trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-heritage-red-700 text-white ring-2 ring-heritage-gold-400 shadow-md scale-105'
                            : 'bg-white text-heritage-ink-700 hover:bg-heritage-red-50 hover:text-heritage-red-700 border border-heritage-ivory-300 shadow-sm hover:scale-105'
                        }`}
                        aria-label={`Chuyển đến trang ${page}`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Nút Sau */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      currentPage === totalPages
                        ? 'bg-heritage-ivory-200 text-heritage-ink-400 cursor-not-allowed border border-heritage-ivory-300'
                        : 'bg-white text-heritage-ink-800 hover:bg-heritage-red-50 hover:text-heritage-red-700 border border-heritage-ivory-300 shadow-sm active:scale-95'
                    }`}
                    aria-label="Trang sau"
                  >
                    <span className="hidden sm:inline">Trang sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-heritage-ivory-300 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-heritage-red-50 text-heritage-red-700 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-heritage-ink-900 mb-2">
              {searchQuery ? 'Không tìm thấy tư liệu phù hợp' : 'Chưa có tư liệu trong chuyên mục này'}
            </h3>
            <p className="text-sm text-heritage-ink-600 mb-6 leading-relaxed">
              {searchQuery
                ? `Không có tư liệu nào khớp với từ khóa "${searchQuery}". Bạn hãy thử đổi từ khóa khác hoặc xóa bộ lọc.`
                : 'Chuyên mục đang được cập nhật các tư liệu chính thức. Mời bạn đón xem các bài đăng mới nhất.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-heritage-red-700 text-white rounded-lg text-sm font-semibold hover:bg-heritage-red-800 transition-colors"
            >
              Xem tất cả tư liệu
            </button>
          </div>
        )}
      </div>

      {/* Resource Detail Modal */}
      <ResourceModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />

      {/* Direct Interactive 3D Flipbook Reader */}
      {activeFlipbookItem && (
        <BookFlipbookModal
          isOpen={!!activeFlipbookItem}
          onClose={() => setActiveFlipbookItem(null)}
          item={activeFlipbookItem}
        />
      )}
    </section>
  );
};
