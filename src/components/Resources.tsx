import React, { useState, useMemo } from 'react';
import { resourcesData } from '../data/resourcesData';
import { ResourceCategory, ResourceItem } from '../types';
import { ResourceModal } from './ResourceModal';
import { Search, Filter, BookOpen, FileText, Image as ImageIcon, Video, Book, X, AlertCircle } from 'lucide-react';

export const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<ResourceItem | null>(null);

  const categories = [
    { id: 'all' as ResourceCategory, label: 'Tất cả tư liệu', icon: Filter },
    { id: 'article' as ResourceCategory, label: 'Văn kiện & Bài viết', icon: FileText },
    { id: 'book' as ResourceCategory, label: 'Sách & Tài liệu', icon: Book },
    { id: 'image' as ResourceCategory, label: 'Hình ảnh lịch sử', icon: ImageIcon },
    { id: 'video' as ResourceCategory, label: 'Phim tư liệu', icon: Video },
  ];

  const filteredResources = useMemo(() => {
    return resourcesData.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q)) ||
        item.authorOrSource.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
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

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-heritage-red-700 text-white font-semibold shadow-sm'
                      : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:bg-heritage-red-50 hover:text-heritage-red-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-heritage-gold-300' : 'text-heritage-red-700'}`} />
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

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((item) => (
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
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 bg-heritage-red-700/95 text-white font-semibold text-xs rounded backdrop-blur-sm shadow">
                        {item.categoryLabel}
                      </span>
                    </div>

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
                    <span>Xem chi tiết</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
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
