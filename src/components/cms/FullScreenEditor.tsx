import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Save, Send, Eye, Sliders, Maximize2, Minimize2,
  Bold, Italic, Underline, Heading1, Heading2, Heading3, Quote,
  List, ListOrdered, Image as ImageIcon, Video,
  CheckCircle2, Trash2, Sparkles
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ContentRenderer } from './ContentRenderer';
import {
  getStoredMedia,
  saveStoredMedia,
  MediaAsset,
  cleanBase64FromContent,
  CMS_CATEGORIES,
  THEMATIC_TOPICS,
  getCategoryLabel,
  normalizeCategoryToHomepage
} from '../../lib/cmsStore';
import { optimizeImageFile } from '../../lib/imageOptimizer';

export interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  topic?: string;
  featured_image?: string;
  references?: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected' | 'archived';
  author_id?: string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface FullScreenEditorProps {
  initialArticle?: ArticleData | null;
  onBack: () => void;
  onSaveDraft: (article: ArticleData) => Promise<void>;
  onSubmitReview: (article: ArticleData) => Promise<void>;
  currentUserName: string;
}

export const FullScreenEditor: React.FC<FullScreenEditorProps> = ({
  initialArticle,
  onBack,
  onSaveDraft,
  onSubmitReview,
  currentUserName,
}) => {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [summary, setSummary] = useState(initialArticle?.summary || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [category, setCategory] = useState<string>(
    initialArticle?.category ? normalizeCategoryToHomepage(initialArticle.category) : 'article'
  );
  const [topic, setTopic] = useState<string>(
    initialArticle?.topic || THEMATIC_TOPICS[0].name
  );
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featured_image || '');
  const [references, setReferences] = useState(initialArticle?.references || 'NXB Chính trị Quốc gia Sự thật; Bảo tàng Hồ Chí Minh');
  
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Vừa mới khởi tạo');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTarget, setImageTarget] = useState<'featured' | 'content'>('featured');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialArticle?.id && (!slug || slug === '')) {
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  // Word count & Reading time calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const [cleanAlert, setCleanAlert] = useState<string | null>(null);

  // Tự động thu gọn chuỗi Base64 thô (AAAA...) thành thẻ media://
  const cleanContentBase64 = (rawText: string): string => {
    const { cleanedText, hasChanges } = cleanBase64FromContent(rawText, currentUserName);
    if (hasChanges) {
      setCleanAlert('Hệ thống đã tự động chuyển đổi mã ảnh Base64 thành thẻ tư liệu rút gọn!');
      setTimeout(() => setCleanAlert(null), 4000);
    }
    return cleanedText;
  };

  // Tự động làm sạch bài viết ngay khi nạp nếu phát hiện chuỗi ký tự Base64 thô
  useEffect(() => {
    if (
      content.includes('data:image/') ||
      content.includes('AAAA') ||
      content.includes('/9j/') ||
      content.includes('iVBORw')
    ) {
      setContent((prev) => cleanContentBase64(prev));
    }
  }, []);

  // Xử lý dán (Paste): Tự động nén ảnh từ Clipboard hoặc dọn sạch chuỗi Base64 dán vào
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // 1. Kiểm tra nếu người dùng dán ảnh chụp màn hình hoặc file ảnh từ máy
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            try {
              const optimized = await optimizeImageFile(file);
              const hexChars = '0123456789ABCDEF';
              let randomSha = '';
              for (let j = 0; j < 64; j++) {
                randomSha += hexChars[Math.floor(Math.random() * hexChars.length)];
              }
              const newAsset: MediaAsset = {
                id: `med-${Date.now()}`,
                name: `anh-tu-lieu-${new Date().toISOString().slice(0, 10)}.jpg`,
                url: optimized.dataUrl,
                size_bytes: optimized.sizeBytes,
                mime_type: 'image/jpeg',
                sha256_hash: randomSha,
                author: currentUserName,
                copyright: 'Tài liệu giáo dục THCS Nguyễn Trung Trực',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              };
              const mediaList = getStoredMedia();
              saveStoredMedia([newAsset, ...mediaList]);

              const imgMarkdown = `\n\n![${newAsset.name}](media://${newAsset.id})\n\n`;
              insertAtCursor(imgMarkdown);
              setCleanAlert('Đã tự động nén và tạo thẻ ảnh tư liệu an toàn từ clipboard!');
              setTimeout(() => setCleanAlert(null), 4000);
            } catch (err) {
              console.error('Lỗi dán hình ảnh:', err);
            }
            return;
          }
        }
      }
    }

    // 2. Kiểm tra nếu người dùng dán văn bản có chứa chuỗi Base64 thô
    const pastedText = e.clipboardData?.getData('text') || '';
    if (
      pastedText.includes('data:image/') ||
      (pastedText.includes('AAAA') && pastedText.length > 80) ||
      pastedText.includes('/9j/')
    ) {
      e.preventDefault();
      const cleaned = cleanContentBase64(pastedText);
      insertAtCursor(cleaned);
    }
  };

  // Helper chèn nội dung vào vị trí con trỏ
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  // Tool insertion helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + (selectedText || 'nội dung') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    const article: ArticleData = {
      id: initialArticle?.id,
      title: title || 'Bản thảo chưa đặt tên',
      slug: slug || 'ban-thao-chua-dat-ten',
      summary,
      content,
      category,
      topic,
      featured_image: featuredImage,
      references,
      status: initialArticle?.status || 'draft',
      author_name: currentUserName,
    };
    await onSaveDraft(article);
    setIsSaving(false);
    const now = new Date();
    setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết trước khi nộp duyệt!');
      return;
    }
    if (!summary.trim()) {
      alert('Vui lòng nhập Tóm tắt ý nghĩa lịch sử trước khi nộp duyệt!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập Nội dung tư liệu trước khi nộp duyệt!');
      return;
    }

    setIsSaving(true);
    const article: ArticleData = {
      id: initialArticle?.id,
      title,
      slug,
      summary,
      content,
      category,
      topic,
      featured_image: featuredImage,
      references,
      status: 'pending',
      author_name: currentUserName,
    };
    await onSubmitReview(article);
    setIsSaving(false);
  };

  // Insert YouTube Video
  const handleInsertVideo = () => {
    if (!videoUrlInput.trim()) return;
    let embedId = '';
    if (videoUrlInput.includes('youtube.com/watch?v=')) {
      embedId = videoUrlInput.split('v=')[1]?.split('&')[0] || '';
    } else if (videoUrlInput.includes('youtu.be/')) {
      embedId = videoUrlInput.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (videoUrlInput.includes('youtube.com/embed/')) {
      embedId = videoUrlInput.split('embed/')[1]?.split('?')[0] || '';
    }

    if (embedId) {
      const videoTag = `\n\n[VIDEO: https://www.youtube.com/embed/${embedId}]\n\n`;
      setContent((prev) => prev + videoTag);
    } else {
      setContent((prev) => prev + `\n\n[VIDEO: ${videoUrlInput}]\n\n`);
    }
    setVideoUrlInput('');
    setVideoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-heritage-ivory-50 text-heritage-ink-900 select-text overflow-hidden animate-fadeIn">
      {/* 1. TOP ACTION & NAVIGATION BAR */}
      <header className="h-14 bg-heritage-ivory-100 border-b border-heritage-gold-300/60 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-heritage-red-50 text-xs sm:text-sm font-semibold transition border border-heritage-gold-300/40"
            title="Quay lại Bảng điều khiển CMS"
          >
            <ChevronLeft className="w-4 h-4 text-heritage-red-700" />
            <span>Thoát ra CMS</span>
          </button>

          <div className="h-5 w-px bg-heritage-gold-300/60 hidden sm:block" />

          <div className="flex items-center space-x-2 min-w-0 truncate">
            <span className="font-serif font-bold text-xs sm:text-sm text-heritage-red-900 truncate max-w-[200px] sm:max-w-md">
              {title || 'Tạo bài viết mới...'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
              {initialArticle?.status === 'approved' ? 'Đã duyệt' : initialArticle?.status === 'pending' ? 'Chờ duyệt' : 'Bản nháp (Draft)'}
            </span>
          </div>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-heritage-ink-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tự động lưu: {lastSavedTime}</span>
          </div>

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border ${
              isPreviewMode
                ? 'bg-heritage-red-700 text-white border-heritage-red-800'
                : 'bg-white text-heritage-ink-700 hover:bg-heritage-ivory-200 border-heritage-gold-300/80'
            }`}
            title="Chuyển đổi chế độ Xem trước"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPreviewMode ? 'Tiếp tục soạn' : 'Xem trước'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-800 border border-heritage-gold-400/80 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-heritage-gold-600" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu nháp'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-1.5 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 hover:from-heritage-red-800 hover:to-heritage-red-900 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition border border-heritage-gold-400/40 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-heritage-gold-300" />
            <span>Gửi duyệt 4 mắt</span>
          </button>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`p-1.5 rounded-lg text-xs transition border ${
              showInspector
                ? 'bg-heritage-gold-200 text-heritage-red-900 border-heritage-gold-400'
                : 'bg-white text-heritage-ink-600 border-heritage-gold-300/60'
            }`}
            title="Bật/Tắt Cột Thuộc Tính"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-1.5 rounded-lg text-xs bg-white text-heritage-ink-600 hover:text-heritage-red-700 border border-heritage-gold-300/60 transition hidden md:block"
            title={isFocusMode ? 'Thoát Chế độ tập trung' : 'Chế độ tập trung (Focus Mode)'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. RICH TEXT TOOLBAR (Fixed under Top Bar) */}
      {!isPreviewMode && !isFocusMode && (
        <div className="h-11 bg-heritage-ivory-200/90 border-b border-heritage-gold-300/50 px-4 sm:px-8 flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="In đậm (Bold - Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="In nghiêng (Italic - Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('<u>', '</u>')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Gạch chân (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-heritage-gold-300 mx-1" />

          <button
            onClick={() => insertFormatting('\n# ')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Tiêu đề H1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n## ')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n### ')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-heritage-gold-300 mx-1" />

          <button
            onClick={() => insertFormatting('\n> "')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Trích dẫn danh ngôn / Lời dạy của Bác"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n- ')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n1. ')}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition"
            title="Danh sách đánh số"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-heritage-gold-300 mx-1" />

          <button
            onClick={() => {
              setImageTarget('content');
              setImageModalOpen(true);
            }}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition flex items-center space-x-1"
            title="Chèn hình ảnh tư liệu"
          >
            <ImageIcon className="w-4 h-4 text-heritage-red-700" />
            <span className="text-xs font-semibold hidden md:inline">Chèn ảnh</span>
          </button>
          <button
            onClick={() => setVideoModalOpen(true)}
            className="p-1.5 hover:bg-white text-heritage-ink-700 rounded transition flex items-center space-x-1"
            title="Nhúng video YouTube tư liệu"
          >
            <Video className="w-4 h-4 text-heritage-red-700" />
            <span className="text-xs font-semibold hidden md:inline">Nhúng video</span>
          </button>

          <button
            onClick={() => {
              const cleaned = cleanContentBase64(content);
              setContent(cleaned);
            }}
            className="p-1.5 hover:bg-white text-heritage-gold-700 hover:text-heritage-gold-800 rounded transition flex items-center space-x-1 border border-transparent hover:border-heritage-gold-300"
            title="Dọn dẹp & chuyển đổi mã ảnh Base64 thô (AAAA...) thành thẻ tư liệu rút gọn"
          >
            <Sparkles className="w-4 h-4 text-heritage-gold-600" />
            <span className="text-xs font-semibold hidden lg:inline">Dọn mã ảnh Base64</span>
          </button>

          <div className="flex-grow" />

          <div className="text-[11px] text-heritage-ink-500 font-medium hidden sm:block">
            <span>{wordCount} từ</span> • <span>~{readingTimeMin} phút đọc</span>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE (Writing Canvas + Inspector Sidebar) */}
      <div className="flex-grow flex overflow-hidden">
        {/* WRITING CANVAS */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-8 flex justify-center bg-heritage-ivory-50">
          <div className={`w-full transition-all duration-300 ${isFocusMode ? 'max-w-4xl' : 'max-w-3xl'}`}>
            {isPreviewMode ? (
              /* PREVIEW MODE */
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-heritage-gold-300/60 space-y-6">
                <div className="border-b border-heritage-ivory-300 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-heritage-red-700 text-white shadow-sm">
                      {getCategoryLabel(category)}
                    </span>
                    {topic && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300">
                        ⭐ {topic}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-heritage-red-900 mt-3 leading-snug">
                    {title || 'Chưa có tiêu đề'}
                  </h1>
                  <p className="text-sm font-serif italic text-heritage-ink-600 mt-2 border-l-4 border-heritage-gold-400 pl-3">
                    {summary || 'Chưa có tóm tắt ý nghĩa giáo dục.'}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-heritage-ink-500 mt-4">
                    <span>Biên soạn: <strong>{currentUserName}</strong></span>
                    <span>•</span>
                    <span>{wordCount} từ</span>
                    <span>•</span>
                    <span>Đường dẫn: <code className="text-heritage-gold-700">/{slug}</code></span>
                  </div>
                </div>

                {featuredImage && (
                  <div className="rounded-xl overflow-hidden shadow-sm border border-heritage-gold-200">
                    <img src={featuredImage} alt={title} className="w-full max-h-96 object-cover" />
                  </div>
                )}

                <div className="prose max-w-none font-serif text-heritage-ink-800 text-base leading-relaxed">
                  {content ? (
                    <ContentRenderer content={content} />
                  ) : (
                    <p className="text-heritage-ink-400 italic">Chưa có nội dung văn bản.</p>
                  )}
                </div>

                {references && (
                  <div className="mt-8 pt-4 border-t border-heritage-ivory-300 text-xs text-heritage-ink-500">
                    <strong>Nguồn tham khảo & Xuất xứ:</strong> {references}
                  </div>
                )}
              </div>
            ) : (
              /* EDITING CANVAS */
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-heritage-gold-300/40 space-y-5 min-h-[85vh]">
                {/* Title Input */}
                <div>
                  <textarea
                    rows={2}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Tiêu đề tư liệu lịch sử (Font Merriweather lớn)..."
                    className="w-full font-serif font-bold text-2xl sm:text-3xl text-heritage-red-900 placeholder-heritage-ink-300 border-none outline-none resize-none leading-snug"
                  />
                </div>

                {/* Slug Input */}
                <div className="flex items-center space-x-2 text-xs text-heritage-ink-500 font-mono bg-heritage-ivory-100/70 px-3 py-1.5 rounded-lg border border-heritage-ivory-300">
                  <span className="text-heritage-gold-600 font-semibold select-none">Đường dẫn tư liệu số:</span>
                  <span>/tu-lieu/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="duong-dan-bai-viet"
                    className="bg-transparent border-none outline-none font-mono text-heritage-ink-800 flex-grow"
                  />
                </div>

                {/* Summary / Deck */}
                <div>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Tóm tắt ý nghĩa giáo dục & tư tưởng (Font Be Vietnam Pro nghiêng 15px)..."
                    className="w-full font-sans text-sm italic text-heritage-ink-700 placeholder-heritage-ink-300 p-3 bg-heritage-ivory-100/40 border-l-4 border-heritage-gold-400 rounded-r-lg outline-none resize-none"
                  />
                </div>

                <div className="h-px bg-heritage-ivory-300" />

                {cleanAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{cleanAlert}</span>
                  </div>
                )}

                {/* Main Body Content Textarea */}
                <div className="relative min-h-[500px]">
                  <textarea
                    ref={textareaRef}
                    rows={18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="Soạn thảo trích dẫn, bối cảnh lịch sử, tác phẩm hoặc lời dạy của Bác...&#10;&#10;Sử dụng thanh công cụ phía trên để in đậm, tạo tiêu đề, danh sách, chèn ảnh tư liệu hoặc nhúng video YouTube."
                    className="w-full h-full font-serif text-base text-heritage-ink-900 placeholder-heritage-ink-300 leading-relaxed outline-none resize-none border-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. RIGHT INSPECTOR SIDEBAR */}
        {showInspector && !isFocusMode && (
          <aside className="w-80 bg-heritage-ivory-100 border-l border-heritage-gold-300/50 p-5 overflow-y-auto space-y-6 flex-shrink-0 animate-fadeIn">
            {/* Chuyên mục đồng bộ Trang chủ */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider flex items-center justify-between">
                <span>Chuyên mục ngoài trang chủ *</span>
                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Kho tư liệu
                </span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-heritage-gold-300 rounded-lg text-xs font-bold text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600 shadow-sm"
              >
                {CMS_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-heritage-ink-500 italic leading-snug">
                {CMS_CATEGORIES.find((c) => c.id === category)?.desc}
              </p>
            </div>

            {/* Chủ đề giáo dục & Lịch sử (Chuyên đề phụ) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider">
                Chủ đề giáo dục & Tư tưởng
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-heritage-ivory-400 rounded-lg text-xs font-semibold text-heritage-ink-800 outline-none"
              >
                {THEMATIC_TOPICS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-heritage-ink-400 font-sans">
                Gắn nhãn chuyên đề giúp học sinh dễ dàng tra cứu theo chủ đề học tập.
              </p>
            </div>

            {/* Ảnh đại diện (Featured Image) */}
            <div>
              <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider mb-2">
                Ảnh đại diện bài viết
              </label>
              {featuredImage ? (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-heritage-gold-300 relative group">
                    <img src={featuredImage} alt="Featured" className="w-full h-36 object-cover" />
                    <button
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition"
                      title="Xóa ảnh đại diện"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={featuredImage.startsWith('data:') ? '[Tệp ảnh tải lên từ thiết bị]' : featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="URL hình ảnh..."
                    readOnly={featuredImage.startsWith('data:')}
                    className="w-full px-2.5 py-1.5 bg-white border border-heritage-ivory-400 rounded text-xs font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setImageTarget('featured');
                      setImageModalOpen(true);
                    }}
                    className="w-full py-4 border-2 border-dashed border-heritage-gold-300 hover:border-heritage-red-600 rounded-lg flex flex-col items-center justify-center space-y-1 text-heritage-ink-600 hover:text-heritage-red-700 bg-white/70 transition"
                  >
                    <ImageIcon className="w-6 h-6 text-heritage-gold-600" />
                    <span className="text-xs font-semibold">Chọn ảnh từ kho tư liệu</span>
                  </button>
                  <input
                    type="text"
                    value={featuredImage.startsWith('data:') ? '[Tệp ảnh tải lên từ thiết bị]' : featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="Hoặc dán URL ảnh trực tiếp..."
                    readOnly={featuredImage.startsWith('data:')}
                    className="w-full px-2.5 py-1.5 bg-white border border-heritage-ivory-400 rounded text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Nguồn tham khảo & Xuất xứ */}
            <div>
              <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider mb-2">
                Nguồn tham khảo & Xuất xứ
              </label>
              <textarea
                rows={3}
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Ví dụ: Hồ Chí Minh Toàn tập, Tập 15, NXB Chính trị Quốc gia; Bảo tàng Lịch sử..."
                className="w-full px-3 py-2 bg-white border border-heritage-ivory-400 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* Thống kê bài viết */}
            <div className="p-3.5 bg-white rounded-xl border border-heritage-gold-300/50 space-y-2">
              <span className="text-[11px] font-bold uppercase text-heritage-ink-500 tracking-wider block">
                Thông số bản thảo
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-heritage-ivory-100 rounded">
                  <div className="text-heritage-ink-500 text-[10px]">Số từ</div>
                  <div className="font-bold text-heritage-red-900 text-sm">{wordCount}</div>
                </div>
                <div className="p-2 bg-heritage-ivory-100 rounded">
                  <div className="text-heritage-ink-500 text-[10px]">Thời gian đọc</div>
                  <div className="font-bold text-heritage-gold-700 text-sm">~{readingTimeMin} phút</div>
                </div>
              </div>
              <div className="text-[11px] text-heritage-ink-500 pt-1">
                Tác giả: <strong>{currentUserName}</strong>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* MODAL: CHỌN ẢNH TỪ KHO MEDIA THỰC TẾ & UPLOAD GATE */}
      {imageModalOpen && (
        <MediaLibraryModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onSelectImage={(url, asset) => {
            if (imageTarget === 'featured') {
              setFeaturedImage(url);
            } else {
              const caption = asset?.name ? asset.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ') : 'Hình ảnh tư liệu lịch sử';
              const refTag = asset?.id ? `media://${asset.id}` : (url.startsWith('data:') ? 'media://med-01' : url);
              const imgMarkdown = `\n\n![${caption}](${refTag})\n\n`;
              insertAtCursor(imgMarkdown);
            }
            setImageModalOpen(false);
          }}
        />
      )}

      {/* MODAL: NHÚNG VIDEO YOUTUBE */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-ink-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-heritage-ivory-100 border border-heritage-gold-300 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-heritage-red-900 flex items-center space-x-2">
              <Video className="w-5 h-5 text-heritage-red-700" />
              <span>Nhúng Video Tư Liệu An Toàn</span>
            </h3>
            <p className="text-xs text-heritage-ink-600">
              Dán đường dẫn YouTube tư liệu lịch sử giáo dục (chỉ hỗ trợ domain thuộc allowlist chính thống):
            </p>
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-white border border-heritage-gold-300 rounded-lg text-xs font-mono"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold text-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleInsertVideo}
                className="px-4 py-1.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg text-xs font-bold"
              >
                Chèn vào bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
