import React, { useEffect } from 'react';
import { SchoolActivity } from '../types';
import { X, Calendar, Users, Award, AlertCircle } from 'lucide-react';

interface ActivityModalProps {
  activity: SchoolActivity | null;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-heritage-gold-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-heritage-ivory-300">
          <div>
            <div className="flex items-center space-x-2 mb-2.5">
              <span className="px-3 py-1 bg-heritage-red-700 text-white text-xs font-semibold rounded">
                {activity.academicYear}
              </span>
              {activity.isSampleData && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-medium rounded flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Nội dung minh họa mô phỏng</span>
                </span>
              )}
            </div>
            <h3 id="activity-title" className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900 leading-snug">
              {activity.title}
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

        {/* Image preview */}
        <div className="mt-4 rounded-xl overflow-hidden h-52 sm:h-64 bg-heritage-ivory-200">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-heritage-ivory-100 p-3.5 rounded-xl border border-heritage-ivory-200">
            <div className="flex items-center space-x-2 text-heritage-ink-800 font-medium">
              <Calendar className="w-4 h-4 text-heritage-red-700 flex-shrink-0" />
              <span>Thời gian: <strong>{activity.date}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-heritage-ink-800 font-medium">
              <Users className="w-4 h-4 text-heritage-red-700 flex-shrink-0" />
              <span>Tham gia: <strong>{activity.participants}</strong></span>
            </div>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-heritage-red-700 mb-2">
              Diễn biến hoạt động
            </h4>
            <p className="text-sm sm:text-base text-heritage-ink-800 leading-relaxed bg-heritage-ivory-50 p-4 sm:p-5 rounded-xl border border-heritage-ivory-200">
              {activity.fullDetail}
            </p>
          </div>

          {activity.highlights && (
            <div>
              <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-heritage-gold-600 mb-2 flex items-center space-x-1.5">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-500" />
                <span>Điểm nhấn nổi bật</span>
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-heritage-ink-800 bg-heritage-gold-50/50 p-4 sm:p-5 rounded-xl border border-heritage-gold-200">
                {activity.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-heritage-gold-600 font-bold">•</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3.5 bg-heritage-ivory-100 rounded-lg text-xs sm:text-sm text-heritage-ink-600">
            Đơn vị tổ chức: <strong>{activity.organizer}</strong> (Trường THCS Nguyễn Trung Trực - Thới An)
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-heritage-ivory-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
