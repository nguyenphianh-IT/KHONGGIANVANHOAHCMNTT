import React, { useState, useEffect, useMemo } from 'react';
import { resourcesData } from '../data/resourcesData';
import { ResourceCategory, ResourceItem } from '../types';
import { ResourceModal } from './ResourceModal';
import { 
  Search, Filter, BookOpen, FileText, Image as ImageIcon, Video, Book, 
  X, AlertCircle, Volume2, Headphones, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  getPublishedArticles,
  EVENT_ARTICLES_CHANGED,
  ArticleData,
  normalizeCategoryToHomepage,
  getCategoryLabel
} from '../lib/cmsStore';

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

export const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<ResourceItem | null>(null);
  const [liveResources, setLiveResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    // 1. Tải các bài viết đã duyệt 4 mắt & xuất bản từ CMS Store (Đồng bộ thời gian thực)
    const loadPublishedResources = () => {
      const cmsPublished = getPublishedArticles();
      const mapped = cmsPublished.map(mapArticleToResource);
      setLiveResources(mapped);
    };

    loadPublishedResources();

    // Lắng nghe sự kiện cập nhật tức thời khi Ban Giám Hiệu phê duyệt bài viết trong CMS
    window.addEventListener(EVENT_ARTICLES_CHANGED, loadPublishedResources);
    window.addEventListener('storage', loadPublishedResources);

    // 2. Dự phòng kết nối thêm từ Supabase nếu có
    const fetchSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('content_revisions')
          .select('id, title, summary, data, created_at, author_id')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseItems: ResourceItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: 'article',
            categoryLabel: 'Văn kiện số hóa',
            description: d.summary || '',
            fullContent: d.data?.content || d.summary || '',
            authorOrSource: 'Trường THCS Nguyễn Trung Trực',
            dateOrEra: new Date(d.created_at).toLocaleDateString('vi-VN'),
            thumbnail: d.data?.featured_image || '/images/ho-chi-minh-tp-hcm.png',
            badgeText: 'Đã xuất bản (Cloud)',
            isMockData: false,
            tags: d.data?.tags || ['lich-su', 'tu-lieu-so'],
          }));

          setLiveResources((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const fresh = supabaseItems.filter((item) => !existingIds.has(item.id));
            return [...prev, ...fresh];
          });
        }
      } catch {
        // Fallback nhẹ nhàng về local store
      }
    };

    fetchSupabase();

    return () => {
      window.removeEventListener(EVENT_ARTICLES_CHANGED, loadPublishedResources);
      window.removeEventListener('storage', loadPublishedResources);
    };
  }, []);

  const categories = [
    { id: 'all' as ResourceCategory, label: 'Tất cả tư liệu', icon: Filter },
    { id: 'article' as ResourceCategory, label: 'Văn kiện & Bài viết', icon: FileText },
    { id: 'book' as ResourceCategory, label: 'Sách & Tài liệu', icon: Book },
    { id: 'image' as ResourceCategory, label: 'Hình ảnh lịch sử', icon: ImageIcon },
    { id: 'video' as ResourceCategory, label: 'Phim tư liệu', icon: Video },
    { id: 'audio' as ResourceCategory, label: 'Băng ghi âm lời Bác', icon: Volume2 },
  ];

  const allCombinedResources = useMemo(() => {
    // Đưa các bài viết thực tế vừa xuất bản lên vị trí đầu tiên
    return [...liveResources, ...resourcesData];
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
    <section id="resources" className="py-16 md:py-24 bg-heritage-ivory-100 border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>Kho Tri Thức Học Đường</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-heritage-ink-900 tracking-tight">
            Kho Tư Liệu Số Hóa
          </h2>
          <div className="w-16 h-1 bg-heritage-gold-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-heritage-ink-700 leading-relaxed">
            Hệ thống hóa các văn kiện, hình ảnh, bài viết và thước phim tư liệu quý giá về Chủ tịch Hồ Chí Minh,
            được thẩm định và phân loại khoa học phục vụ học sinh THCS.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
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

          {/* Category Filter Tabs (Thanh trượt ngang mượt mà trên di động) */}
          <div className="flex items-center overflow-x-auto scrollbar-none py-1.5 gap-2 sm:flex-wrap sm:justify-center -mx-4 sm:mx-0 px-4 sm:px-0 select-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 shadow-sm ${
                    isActive
                      ? 'bg-heritage-red-700 text-white font-semibold shadow-sm ring-1 ring-heritage-gold-400'
                      : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:bg-heritage-red-50 hover:text-heritage-red-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-heritage-gold-300' : 'text-heritage-red-700'}`} />
                  <span>{cat.label}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {paginatedResources.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className="group cursor-pointer bg-white rounded-xl border border-heritage-ivory-300 shadow-sm hover:shadow-heritage-hover hover:border-heritage-gold-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Card Thumbnail */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-heritage-ivory-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-heritage-red-700/95 text-white font-semibold text-xs rounded backdrop-blur-sm shadow flex items-center space-x-1">
                          {item.category === 'audio' && <Volume2 className="w-3 h-3 text-heritage-gold-300 mr-1" />}
                          <span>{item.categoryLabel}</span>
                        </span>
                      </div>

                      {item.audioDuration && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 bg-black/75 text-heritage-gold-300 text-[11px] font-mono font-bold rounded backdrop-blur-sm border border-white/20 shadow">
                            ⏱️ {item.audioDuration}
                          </span>
                        </div>
                      )}

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
                      <div className="text-xs font-semibold text-heritage-gold-600 mb-1.5 flex items-center justify-between">
                        <span>{item.dateOrEra}</span>
                        <span className="text-heritage-ink-500 font-normal">{item.badgeText}</span>
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
                    <span className="text-heritage-ink-500 truncate min-w-0 flex-1 font-medium" title={item.authorOrSource}>
                      {item.authorOrSource}
                    </span>
                    <span className="text-heritage-red-700 font-bold group-hover:underline flex-shrink-0 whitespace-nowrap flex items-center space-x-1">
                      <span>{item.category === 'audio' ? '🎧 Nghe ghi âm' : 'Xem chi tiết'}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
              Không tìm thấy tư liệu phù hợp
            </h3>
            <p className="text-sm text-heritage-ink-600 mb-6 leading-relaxed">
              Không có tư liệu nào khớp với từ khóa "{searchQuery}" trong danh mục đã chọn.
              Bạn hãy thử đổi từ khóa khác hoặc xóa bộ lọc.
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
    </section>
  );
};
