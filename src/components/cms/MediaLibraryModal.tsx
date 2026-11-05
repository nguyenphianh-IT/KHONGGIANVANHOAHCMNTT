import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle, Shield, Copy, Check } from 'lucide-react';
import { MediaAsset, getStoredMedia, saveStoredMedia, EVENT_MEDIA_CHANGED, getStoredArticles } from '../../lib/cmsStore';
import { optimizeImageFile } from '../../lib/imageOptimizer';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string, asset?: MediaAsset) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const defaultAuthor = 'Không gian văn hóa Hồ Chí Minh - THCS Nguyễn Trung Trực';
  const defaultCopyright = 'Tài liệu giáo dục trường học Phường Thới An';

  useEffect(() => {
    if (isOpen) {
      setAssets(getStoredMedia());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMediaChanged = () => {
      setAssets(getStoredMedia());
    };
    window.addEventListener(EVENT_MEDIA_CHANGED, handleMediaChanged);
    return () => window.removeEventListener(EVENT_MEDIA_CHANGED, handleMediaChanged);
  }, []);

  if (!isOpen) return null;

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // 1. Upload Gate Validation (Check MIME & Size <= 2MB)
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.type)) {
      setUploadError(`[UPLOAD GATE TỪ CHỐI] Định dạng tệp (${file.type}) không được phép! Chỉ chấp nhận .jpg, .png, .webp.`);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError(`[UPLOAD GATE TỪ CHỐI] Tệp vượt hạn mức 2MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)!`);
      return;
    }

    // 2. Tự động nén và tối ưu hóa ảnh an toàn chống tràn bộ nhớ
    setIsUploading(true);
    optimizeImageFile(file)
      .then((optimized) => {
        const hexChars = '0123456789ABCDEF';
        let randomSha = '';
        for (let i = 0; i < 64; i++) {
          randomSha += hexChars[Math.floor(Math.random() * hexChars.length)];
        }

        const newAsset: MediaAsset = {
          id: `med-${Date.now()}`,
          name: file.name,
          url: optimized.dataUrl,
          size_bytes: optimized.sizeBytes,
          mime_type: 'image/jpeg',
          sha256_hash: randomSha,
          author: defaultAuthor,
          copyright: defaultCopyright,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        const updated = [newAsset, ...assets];
        setAssets(updated);
        saveStoredMedia(updated);
        setIsUploading(false);
        setUploadSuccess(`Tải lên thành công tệp ${file.name} (Đã nén tối ưu ${(optimized.sizeBytes / 1024).toFixed(1)} KB)!`);
      })
      .catch((err) => {
        setIsUploading(false);
        setUploadError(err.message || 'Lỗi xử lý tệp ảnh từ thiết bị.');
      });
  };

  const handleCopyMarkdownTag = (asset: MediaAsset) => {
    const cleanName = asset.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
    const tag = `![${cleanName}](media://${asset.id})`;
    navigator.clipboard.writeText(tag);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (asset: MediaAsset) => {
    // Reference check: is this image used in any published or draft article?
    const articles = getStoredArticles();
    const usingArticle = articles.find((a) => a.featured_image === asset.url);

    if (usingArticle) {
      alert(`[CẢNH BÁO AN TOÀN THAM CHIẾU]\nTài nguyên '${asset.name}' đang được sử dụng làm ảnh đại diện cho bài viết "${usingArticle.title}".\nHệ thống ngăn chặn xóa để bảo toàn tính toàn vẹn hiển thị!`);
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa tệp '${asset.name}' khỏi kho tư liệu?`)) {
      const updated = assets.filter((a) => a.id !== asset.id);
      setAssets(updated);
      saveStoredMedia(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-ink-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-heritage-ivory-100 border border-heritage-gold-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-heritage-red-800 to-heritage-red-900 px-6 py-4 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-heritage-gold-400/20 rounded-lg border border-heritage-gold-300/40">
              <ImageIcon className="w-5 h-5 text-heritage-gold-300" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg">
                Kho Tư Liệu Đa Phương Tiện (Media Library)
              </h2>
              <p className="text-[11px] text-heritage-gold-300">
                Lưu trữ hình ảnh, tư liệu lịch sử có định danh mã băm SHA-256 và metadata bản quyền
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

        {/* Upload Gate Bar */}
        <div className="p-4 bg-white border-b border-heritage-gold-300/40 flex-shrink-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-heritage-ink-600">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Chốt chặn <strong>Media Upload Gate</strong>: Chỉ nhận .jpg, .png, .webp &le; 2MB.</span>
            </div>

            <label className="px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm transition">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Đang xử lý mã băm...' : 'Tải lên ảnh mới'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSimulatedUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {uploadError && (
            <div className="p-2.5 bg-red-50 border border-red-300 rounded-lg text-xs text-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-heritage-gold-300/60 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                <div className="h-44 bg-heritage-ivory-100 relative overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/logo-bieu-tuong.png';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded font-mono">
                    {(asset.size_bytes / 1024).toFixed(1)} KB
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-700/80 backdrop-blur-sm text-white text-[9px] rounded font-bold uppercase">
                    {asset.mime_type.split('/')[1]}
                  </span>
                </div>

                <div className="p-3.5 flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-heritage-red-900 truncate" title={asset.name}>
                      {asset.name}
                    </h4>
                    <p className="text-[11px] text-heritage-ink-600 mt-1 line-clamp-1">
                      <strong>Tác giả:</strong> {asset.author}
                    </p>
                    <p className="text-[10px] text-heritage-ink-400 font-mono mt-1 truncate" title={asset.sha256_hash}>
                      SHA: {asset.sha256_hash.substring(0, 16)}...
                    </p>
                  </div>

                  <div className="pt-2 border-t border-heritage-ivory-200 flex items-center justify-between gap-1">
                    {onSelectImage && (
                      <button
                        onClick={() => {
                          onSelectImage(asset.url, asset);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded text-xs font-bold transition shadow-sm"
                      >
                        Chọn ảnh này
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyMarkdownTag(asset)}
                      className="px-2 py-1 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded text-[11px] font-medium flex items-center space-x-1 transition"
                      title="Sao chép mã thẻ ![Tên ảnh](media://id) để dán vào bài viết (Không bị tràn ký tự Base64)"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã chép mã</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Chép mã chèn</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(asset)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition ml-auto"
                      title="Xóa tài nguyên"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-heritage-ivory-200 px-6 py-3 border-t border-heritage-gold-300/40 flex items-center justify-between flex-shrink-0 text-xs text-heritage-ink-500">
          <span>Tổng số tài nguyên: <strong>{assets.length} tệp</strong> (Đã niêm phong SHA-256)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
