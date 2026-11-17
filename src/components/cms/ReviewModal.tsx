import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, User, BookOpen } from 'lucide-react';
import { ContentRenderer } from './ContentRenderer';
import { ArticleData, getCategoryLabel } from '../../lib/cmsStore';
import { BookFlipbookModal } from '../BookFlipbookModal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleData | null;
  currentUserId?: string;
  currentUserName: string;
  onApprove: (articleId: string, feedback: string) => Promise<void>;
  onReject: (articleId: string, feedback: string) => Promise<void>;
  onSwitchPersona?: (role: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  article,
  currentUserId,
  currentUserName,
  onApprove,
  onReject,
  onSwitchPersona,
}) => {
  const [feedback, setFeedback] = useState('Nội dung chuẩn mực, tư tưởng chính xác, đạt chuẩn xuất bản.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipbookReviewOpen, setIsFlipbookReviewOpen] = useState(false);

  if (!isOpen || !article) return null;

  // Check Four-Eyes violation: Author cannot approve own article!
  const isSelfApproval = 
    (article.author_id && currentUserId && article.author_id === currentUserId) ||
    (article.author_name && currentUserName && article.author_name.toLowerCase().trim() === currentUserName.toLowerCase().trim());

  const handleApprove = async () => {
    if (isSelfApproval) {
      alert('VI PHẠM QUY TẮC 4 MẮT: Bạn không thể tự phê duyệt bài viết của chính mình!');
      return;
    }
    const targetKey = article.id || article.slug;
    if (!targetKey) return;
    try {
      setIsSubmitting(true);
      await onApprove(targetKey, feedback);
      onClose();
    } catch (err: any) {
      console.error('[handleApprove Error]', err);
      alert('Đã xảy ra lỗi khi phê duyệt bài viết: ' + (err?.message || 'Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    const targetKey = article.id || article.slug;
    if (!targetKey) return;
    if (!feedback.trim()) {
      alert('Vui lòng nhập lý do hoặc hướng dẫn chỉnh sửa trước khi từ chối bài viết!');
      return;
    }
    try {
      setIsSubmitting(true);
      await onReject(targetKey, feedback);
      onClose();
    } catch (err: any) {
      console.error('[handleReject Error]', err);
      alert('Đã xảy ra lỗi khi yêu cầu sửa: ' + (err?.message || 'Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-ink-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-heritage-ivory-100 border border-heritage-gold-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-heritage-gold-400/20 rounded-lg border border-heritage-gold-300/40">
              <ShieldCheck className="w-5 h-5 text-heritage-gold-300" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg">
                Hội Đồng Kiểm Duyệt 4 Mắt (Four-Eyes Approval)
              </h2>
              <p className="text-[11px] text-heritage-gold-300">
                Thẩm định tư tưởng, tính chuẩn mực lịch sử và phê duyệt bài viết
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Four-Eyes Safety Banner */}
        <div className="p-4 border-b border-heritage-gold-300/40 flex-shrink-0 bg-white">
          {isSelfApproval ? (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl flex items-start space-x-3 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">CẢNH BÁO VI PHẠM QUY TẮC AN TOÀN 4 MẮT (FOUR-EYES ENFORCEMENT):</p>
                <p className="mt-0.5 text-red-700">
                  Bạn đang đăng nhập với tư cách tác giả của bài viết này (<strong>{currentUserName}</strong>). Theo quy chế quản trị, <strong>tác giả tuyệt đối không được phép tự phê duyệt bài viết do chính mình biên soạn</strong>. Vui lòng chuyển sang vai trò Cán bộ Quản trị Trưởng (Ban Giám Hiệu) để duyệt bài!
                </p>
                {onSwitchPersona && (
                  <button
                    type="button"
                    onClick={() => onSwitchPersona('admin')}
                    className="mt-2.5 px-3 py-1.5 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 hover:from-heritage-red-800 hover:to-heritage-red-900 text-white rounded-lg font-bold text-xs shadow-sm transition inline-flex items-center space-x-1.5 border border-heritage-gold-400/40"
                  >
                    <ShieldCheck className="w-4 h-4 text-heritage-gold-300" />
                    <span>Chuyển sang vai trò Ban Giám Hiệu (Để thẩm định & duyệt ngay)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold">ĐỦ ĐIỀU KIỆN KIỂM DUYỆT 4 MẮT HỢP LỆ:</p>
                <p className="text-emerald-700">
                  Người duyệt: <strong>{currentUserName}</strong> • Tác giả biên soạn: <strong>{article.author_name || 'Biên tập viên'}</strong> (Hai vai trò độc lập).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          <div className="bg-white p-5 rounded-xl border border-heritage-gold-300/40 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-heritage-ink-500">
              <span className="px-2.5 py-0.5 rounded bg-heritage-red-700 text-white font-bold uppercase text-[10px] shadow-sm">
                {getCategoryLabel(article.category)}
              </span>
              {article.topic && (
                <span className="px-2.5 py-0.5 rounded bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300 font-semibold text-[10px]">
                  ⭐ {article.topic}
                </span>
              )}
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Tác giả: <strong>{article.author_name || 'Biên tập viên'}</strong></span>
              </span>
            </div>

            <h3 className="font-serif font-black text-xl text-heritage-red-900 leading-snug">
              {article.title}
            </h3>

            <p className="text-xs font-serif italic text-heritage-ink-600 p-2.5 bg-heritage-ivory-100/60 border-l-4 border-heritage-gold-400 rounded-r">
              {article.summary}
            </p>

            <div className="max-w-none text-xs text-heritage-ink-800 leading-relaxed font-serif max-h-56 overflow-y-auto p-3.5 bg-heritage-ivory-50 rounded-lg border border-heritage-ivory-300">
              <ContentRenderer content={article.content} mediaAssets={article.media_assets} />
            </div>

            {article.references && (
              <p className="text-[11px] text-heritage-ink-500 pt-2 border-t border-heritage-ivory-200">
                <strong>Nguồn trích dẫn:</strong> {article.references}
              </p>
            )}

            {/* Tệp PDF đính kèm & Xem thử lật trang trước khi duyệt */}
            {article.pdf_attachment && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-emerald-950 truncate">
                      {article.pdf_attachment.fileName}
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      {article.pdf_attachment.totalPages} trang • {(article.pdf_attachment.fileSize / (1024 * 1024)).toFixed(1)} MB • Đã sẵn sàng chế độ lật trang 3D
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlipbookReviewOpen(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition flex-shrink-0"
                >
                  📖 Xem thử lật trang
                </button>
              </div>
            )}
          </div>

          {/* Feedback & Decision Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider">
              Ý kiến thẩm định & Nhận xét kiểm duyệt *
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập nội dung nhận xét hoặc lý do yêu cầu chỉnh sửa..."
              className="w-full px-3 py-2 bg-white border border-heritage-gold-300 rounded-xl text-xs text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-heritage-ivory-200 px-6 py-4 border-t border-heritage-gold-300/40 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Yêu cầu chỉnh sửa</span>
            </button>

            <button
              onClick={handleApprove}
              disabled={isSelfApproval || isSubmitting}
              className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-sm ${
                isSelfApproval
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{isSubmitting ? 'Đang duyệt...' : 'Phê duyệt 4 mắt & Xuất bản'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Xem thử Sách lật trang 3D trong phiên thẩm định 4 Mắt */}
      {article.pdf_attachment && isFlipbookReviewOpen && (
        <BookFlipbookModal
          isOpen={isFlipbookReviewOpen}
          onClose={() => setIsFlipbookReviewOpen(false)}
          item={{
            id: article.id || article.slug,
            title: article.title,
            category: 'book',
            categoryLabel: 'Sách & Tài liệu',
            description: article.summary,
            authorOrSource: article.author_name || 'Biên tập viên',
            dateOrEra: 'Thẩm định 4 Mắt',
            thumbnail: article.featured_image || '',
            badgeText: 'Thẩm định 4 Mắt',
            isMockData: false,
            tags: [],
            pdfAttachment: article.pdf_attachment,
          }}
        />
      )}
    </div>
  );
};
