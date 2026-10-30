import React, { useEffect } from 'react';
import { ResourceItem } from '../types';
import { X, Calendar, User, Tag, AlertCircle, BookOpen } from 'lucide-react';

interface ResourceModalProps {
  item: ResourceItem | null;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-heritage-gold-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-heritage-ivory-300">
          <div className="pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-1 bg-heritage-red-700 text-white rounded text-xs font-semibold">
                {item.categoryLabel}
              </span>
              <span className="px-3 py-1 bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300 rounded text-xs font-semibold">
                {item.badgeText}
              </span>
              {item.isMockData && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-medium rounded flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Nội dung minh họa số hóa</span>
                </span>
              )}
            </div>
            <h3 id="modal-title" className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900 leading-snug">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-heritage-ink-500 hover:text-heritage-ink-900 hover:bg-heritage-ivory-200 transition-colors flex-shrink-0"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-heritage-ink-700 bg-heritage-ivory-100 p-3.5 rounded-xl border border-heritage-ivory-200">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-heritage-red-600 flex-shrink-0" />
              <span>Nguồn / Đơn vị: <strong>{item.authorOrSource}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-heritage-red-600 flex-shrink-0" />
              <span>Thời gian: <strong>{item.dateOrEra}</strong></span>
            </div>
          </div>

          {/* Full content description */}
          <div>
            <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-heritage-red-700 mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Nội dung tư liệu</span>
            </h4>
            <div className="text-heritage-ink-800 text-sm sm:text-base leading-relaxed space-y-3 bg-heritage-ivory-50 p-4 sm:p-5 rounded-xl border border-heritage-ivory-300">
              <p>{item.fullContent || item.description}</p>
            </div>
          </div>

          {/* Notice about school digitization */}
          <div className="p-4 rounded-xl bg-heritage-red-50/80 border border-heritage-red-200 text-xs sm:text-sm text-heritage-red-950 leading-relaxed">
            <strong>Ghi chú giáo dục:</strong> Tư liệu này được lưu trữ phục vụ mục đích học tập, nghiên cứu và bồi dưỡng văn hóa của giáo viên, học sinh Trường THCS Nguyễn Trung Trực (phường Thới An). Nghiêm cấm mọi hành vi sao chép, xuyên tạc hoặc sử dụng sai lệch mục đích.
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-4 h-4 text-heritage-ink-500 mr-1" />
              {item.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-heritage-ivory-200 text-heritage-ink-800 text-xs font-medium rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-heritage-ivory-300 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-heritage-ink-500 font-medium">
            Không gian văn hóa Hồ Chí Minh • Trường THCS Nguyễn Trung Trực
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
