import React, { useState, useEffect, useMemo } from 'react';
import { activitiesData } from '../data/activitiesData';
import { SchoolActivity } from '../types';
import { ActivityModal } from './ActivityModal';
import { Calendar, Users, ChevronRight, ChevronLeft, Award, AlertCircle, Sparkles } from 'lucide-react';
import { getPublishedArticles, EVENT_ARTICLES_CHANGED, ArticleData } from '../lib/cmsStore';

const mapArticleToActivity = (art: ArticleData): SchoolActivity => {
  return {
    id: art.id || `act-${art.slug}`,
    title: art.title,
    date: art.created_at ? art.created_at.split(' ')[0] : 'Vừa đăng',
    academicYear: 'Năm học 2024 - 2025',
    organizer: art.author_name || 'Trường THCS Nguyễn Trung Trực',
    summary: art.summary,
    fullDetail: art.content,
    imageUrl: art.featured_image || '/images/ho-chi-minh-tp-hcm.png',
    participants: 'Cán bộ, giáo viên và học sinh trường THCS Nguyễn Trung Trực',
    isSampleData: false,
    highlights: [
      'Tin bài hoạt động chính thức từ Không gian văn hóa Hồ Chí Minh',
      'Đã qua quy trình thẩm định 4 mắt của Ban Giám Hiệu nhà trường',
      art.references ? `Xuất xứ tư liệu: ${art.references}` : 'Hoạt động phong trào giáo dục truyền thống học đường'
    ]
  };
};

export const Activities: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<SchoolActivity | null>(null);
  const [activitiesList, setActivitiesList] = useState<SchoolActivity[]>(activitiesData);

  useEffect(() => {
    const loadActivities = () => {
      const cmsPublished = getPublishedArticles();
      // Tự động nhận diện các bài viết thuộc chuyên mục Hoạt động phong trào hoặc chủ đề trường học
      const activityArticles = cmsPublished.filter(
        (art) =>
          art.category === 'activity' ||
          art.topic === 'Hoạt động phong trào nhà trường' ||
          art.topic === 'Hoạt động & Phong trào học đường' ||
          art.topic === 'Trường THCS Nguyễn Trung Trực Làm theo Bác' ||
          art.topic?.toLowerCase().includes('hoạt động') ||
          art.topic?.toLowerCase().includes('phong trào') ||
          art.title?.toLowerCase().includes('hội thi') ||
          art.title?.toLowerCase().includes('hành trình') ||
          art.title?.toLowerCase().includes('kết nạp') ||
          art.title?.toLowerCase().includes('ra mắt') ||
          art.title?.toLowerCase().includes('phong trào')
      );

      const mappedFromCms = activityArticles.map(mapArticleToActivity);
      // Đưa các bài viết thực tế vừa đăng lên đầu danh sách
      setActivitiesList([...mappedFromCms, ...activitiesData]);
    };

    loadActivities();
    window.addEventListener(EVENT_ARTICLES_CHANGED, loadActivities);
    window.addEventListener('storage', loadActivities);

    return () => {
      window.removeEventListener(EVENT_ARTICLES_CHANGED, loadActivities);
      window.removeEventListener('storage', loadActivities);
    };
  }, []);

  const hasCmsArticles = activitiesList.some((a) => !a.isSampleData);

  // ---------------------------------------------------------------------------
  // PHÂN TRANG HOẠT ĐỘNG: 6 tin / trang (3 cột x 2 dòng cân đối, không dàn trải)
  // ---------------------------------------------------------------------------
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Tự động quay về trang 1 khi số lượng bài viết thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [activitiesList.length]);

  const totalPages = Math.ceil(activitiesList.length / ITEMS_PER_PAGE) || 1;

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return activitiesList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activitiesList, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogEl = document.getElementById('activities-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="activities" className="py-8 sm:py-10 md:py-12 bg-heritage-ivory-100 border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-3">
            <Award className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>Phong Trào Học Đường</span>
          </div>
          <h2 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-ink-900 tracking-tight leading-snug">
            Hoạt Động Văn Hóa & Giáo Dục Truyền Thống
          </h2>
          <div className="w-16 h-1 bg-heritage-gold-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-heritage-ink-700 leading-relaxed">
            Các phong trào thi đua, hội thi kể chuyện, sinh hoạt chuyên đề và hành trình về nguồn
            của thầy và trò Trường THCS Nguyễn Trung Trực (Phường Thới An).
          </p>

          <div className="mt-3 inline-flex items-center space-x-1.5 text-xs text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
            {hasCmsArticles ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-emerald-900 font-medium">Bao gồm các tin bài hoạt động thực tế cập nhật từ Ban Giám Hiệu và dữ liệu mô phỏng.</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Dữ liệu dưới đây là nội dung mẫu minh họa cho mô hình hoạt động thực tế tại nhà trường.</span>
              </>
            )}
          </div>
        </div>

        {/* Anchor point for smooth scrolling on pagination change */}
        <div id="activities-catalog" className="scroll-mt-28" />

        {/* Activities Grid (3 cột x 2 dòng = đúng 6 tin/trang vuông vắn, cân đối tuyệt đẹp) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {paginatedActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="group cursor-pointer bg-white rounded-xl border border-heritage-ivory-300 shadow-sm hover:shadow-heritage-hover hover:border-heritage-gold-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-heritage-ivory-200">
                  <img
                    src={activity.imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/ho-chi-minh-tp-hcm.png';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 bg-heritage-red-700 text-white font-semibold text-xs rounded shadow">
                      {activity.academicYear}
                    </span>
                  </div>
                  {!activity.isSampleData ? (
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="px-2.5 py-1 bg-emerald-800/95 text-white text-xs font-semibold rounded backdrop-blur-sm block truncate shadow">
                        ⭐ Hoạt động chính thức (CMS)
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="px-2.5 py-1 bg-black/80 text-amber-300 text-xs font-medium rounded backdrop-blur-sm block truncate shadow">
                        Nội dung minh họa mô phỏng
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-heritage-red-700 mb-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{activity.date}</span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-heritage-ink-900 group-hover:text-heritage-red-700 transition-colors line-clamp-2 mb-2 leading-snug">
                    {activity.title}
                  </h3>

                  <p className="text-sm text-heritage-ink-700 line-clamp-3 leading-relaxed">
                    {activity.summary}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 pt-3 border-t border-heritage-ivory-200 flex items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="text-heritage-ink-600 font-medium flex items-center min-w-0 flex-1 mr-2">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-heritage-red-600 flex-shrink-0" />
                  <span className="truncate" title={activity.participants}>{activity.participants}</span>
                </span>
                <span className="text-heritage-red-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform flex-shrink-0 whitespace-nowrap">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-4 h-4 ml-0.5 flex-shrink-0" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Thanh điều khiển phân trang (Pagination Controls) */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-heritage-ivory-300">
            <div className="text-xs sm:text-sm text-heritage-ink-600 font-medium order-2 sm:order-1 text-center sm:text-left">
              Hiển thị <span className="font-bold text-heritage-red-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-heritage-red-700">{Math.min(currentPage * ITEMS_PER_PAGE, activitiesList.length)}</span> trên tổng số <span className="font-bold text-heritage-red-700">{activitiesList.length}</span> hoạt động (Trang {currentPage}/{totalPages})
            </div>

            <nav aria-label="Phân trang hoạt động học đường" className="inline-flex items-center gap-1.5 order-1 sm:order-2">
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

      {/* Activity Detail Modal */}
      <ActivityModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </section>
  );
};
