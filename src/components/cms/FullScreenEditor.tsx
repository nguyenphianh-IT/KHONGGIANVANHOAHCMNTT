import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Save, Send, Eye, Sliders, Maximize2, Minimize2,
  Bold, Italic, Underline, Heading1, Heading2, Heading3, Quote,
  List, ListOrdered, Image as ImageIcon, Video, Volume2, Upload, Music,
  CheckCircle2, Trash2, Sparkles, BookOpen, FileText
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ContentRenderer } from './ContentRenderer';
import {
  getStoredMedia,
  saveStoredMedia,
  saveMediaToCloud,
  MediaAsset,
  cleanBase64FromContent,
  CMS_CATEGORIES,
  THEMATIC_TOPICS,
  getCategoryLabel,
  normalizeCategoryToHomepage,
  ArticleData
} from '../../lib/cmsStore';
import { optimizeImageFile } from '../../lib/imageOptimizer';
import { UNCLE_HO_QUOTES } from '../../data/quotesData';
import { parsePdfFile, extractPdfCoverImage, loadPdfFromUrl } from '../../lib/pdfHelper';
import { BookFlipbookModal } from '../BookFlipbookModal';
import type { PdfAttachment } from '../../types';

export type { ArticleData };

interface FullScreenEditorProps {
  initialArticle?: ArticleData | null;
  onBack: () => void;
  onSaveDraft: (article: ArticleData) => Promise<void>;
  onSubmitReview: (article: ArticleData) => Promise<void>;
  onDirectApprove?: (article: ArticleData) => Promise<void>;
  isReviewerRole?: boolean;
  currentUserName: string;
}

export const FullScreenEditor: React.FC<FullScreenEditorProps> = ({
  initialArticle,
  onBack,
  onSaveDraft,
  onSubmitReview,
  onDirectApprove,
  isReviewerRole,
  currentUserName,
}) => {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [summary, setSummary] = useState(initialArticle?.summary || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [category, setCategory] = useState<string>(
    initialArticle?.category
      ? (initialArticle.category === 'activity' || initialArticle.category === 'CAT-04-NHATRUONG'
          ? 'activity'
          : normalizeCategoryToHomepage(initialArticle.category))
      : 'article'
  );
  const [topic, setTopic] = useState<string>(
    initialArticle?.topic || THEMATIC_TOPICS[0].name
  );
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featured_image || '');
  const [references, setReferences] = useState(initialArticle?.references || 'NXB Chính trị Quốc gia Sự thật; Bảo tàng Hồ Chí Minh');
  const [selectedQuoteId, setSelectedQuoteId] = useState<number>(initialArticle?.quote_id || 1);
  const [audioUrl, setAudioUrl] = useState<string>((initialArticle as any)?.audio_url || '');
  const [audioDuration, setAudioDuration] = useState<string>((initialArticle as any)?.audio_duration || '');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioUploadNotice, setAudioUploadNotice] = useState<string | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav') && !file.name.endsWith('.m4a')) {
      alert('Vui lòng chọn tệp âm thanh định dạng .mp3, .wav, hoặc .m4a!');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert(`Tệp âm thanh quá lớn (${(file.size / (1024 * 1024)).toFixed(1)} MB). Vui lòng chọn tệp nhỏ hơn 15MB để đảm bảo tốc độ tải.`);
      return;
    }

    setIsProcessingAudio(true);
    setAudioFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAudioUrl(dataUrl);

      // Tự động đo thời lượng âm thanh
      const tempAudio = new Audio();
      tempAudio.src = dataUrl;
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          const totalSecs = Math.floor(tempAudio.duration);
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          setAudioDuration(formatted);
          setAudioUploadNotice(`Đã nạp: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB - ${formatted})`);
        } else {
          setAudioUploadNotice(`Đã nạp: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
        }
        setIsProcessingAudio(false);
      };
      tempAudio.onerror = () => {
        setIsProcessingAudio(false);
        setAudioUploadNotice(`Đã nạp: ${file.name}`);
      };
    };
    reader.readAsDataURL(file);
  };

  // State & Handlers cho Tệp PDF Sách & Ấn phẩm số hóa
  const [pdfAttachment, setPdfAttachment] = useState<PdfAttachment | undefined>(
    (initialArticle as any)?.pdf_attachment || (
      initialArticle?.category === 'book' ? {
        url: '/documents/di-chuc-chu-tich-ho-chi-minh.pdf',
        fileName: 'Di Chuc 1969.pdf',
        fileSize: 170588,
        totalPages: 6,
        allowDownload: true,
        readingMode: 'flipbook',
        uploadedAt: new Date().toISOString(),
      } : undefined
    )
  );
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfUploadNotice, setPdfUploadNotice] = useState<string | null>(null);
  const [isExtractingCover, setIsExtractingCover] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Vui lòng chọn tệp tài liệu định dạng .pdf!');
      return;
    }

    if (file.size > 35 * 1024 * 1024) {
      alert(`Tệp PDF quá lớn (${(file.size / (1024 * 1024)).toFixed(1)} MB). Vui lòng chọn tệp nhỏ hơn 35MB để đảm bảo tốc độ tải.`);
      return;
    }

    try {
      setIsProcessingPdf(true);
      setPdfUploadNotice('Đang phân tích cấu trúc trang PDF...');

      const meta = await parsePdfFile(file);

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const dataUrl = evt.target?.result as string;

        const newPdfAttachment: PdfAttachment = {
          url: dataUrl,
          fileName: file.name,
          fileSize: file.size,
          totalPages: meta.totalPages,
          allowDownload: pdfAttachment?.allowDownload !== undefined ? pdfAttachment.allowDownload : true,
          readingMode: pdfAttachment?.readingMode || 'flipbook',
          uploadedAt: new Date().toISOString(),
        };

        setPdfAttachment(newPdfAttachment);
        setPdfUploadNotice(`Đã nạp: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB • ${meta.totalPages} trang)`);
        setIsProcessingPdf(false);

        // Tự động tạo ảnh bìa từ Trang 1 nếu bài viết chưa có ảnh bìa
        if (!featuredImage) {
          try {
            const coverData = await extractPdfCoverImage(meta.pdfDoc);
            setFeaturedImage(coverData);
          } catch (err) {
            console.warn('[Auto Cover Extractor error]', err);
          }
        }
      };

      reader.onerror = () => {
        setIsProcessingPdf(false);
        alert('Không thể đọc tệp PDF. Vui lòng thử lại!');
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('[handlePdfFileUpload Error]', err);
      setIsProcessingPdf(false);
      alert('Lỗi đọc tệp PDF: ' + (err?.message || 'Tệp có thể bị hỏng hoặc có mật khẩu bảo vệ'));
    }
  };

  const handleExtractCover = async () => {
    if (!pdfAttachment?.url) return;
    try {
      setIsExtractingCover(true);
      const doc = await loadPdfFromUrl(pdfAttachment.url);
      const cover = await extractPdfCoverImage(doc);
      setFeaturedImage(cover);
      alert('Đã trích xuất Trang 1 thành công và đặt làm Ảnh bìa bài viết!');
    } catch (err: any) {
      alert('Không thể trích xuất trang bìa: ' + (err?.message || 'Lỗi không xác định'));
    } finally {
      setIsExtractingCover(false);
    }
  };
  
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFlipbookPreviewOpen, setIsFlipbookPreviewOpen] = useState(false);
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
              saveMediaToCloud(newAsset).catch((e) => console.warn('Lỗi lưu ảnh clipboard lên Cloud:', e));

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
    try {
      setIsSaving(true);
      const nowIso = new Date().toISOString();
      const article: ArticleData = {
        ...(initialArticle || {}),
        title: title || 'Bản thảo chưa đặt tên',
        slug: slug || 'ban-thao-chua-dat-ten',
        summary,
        content,
        category,
        topic,
        featured_image: featuredImage,
        references,
        audio_url: audioUrl,
        audio_duration: audioDuration,
        quote_id: selectedQuoteId,
        pdf_attachment: pdfAttachment,
        status: initialArticle?.status || 'draft',
        author_name: initialArticle?.author_name || currentUserName,
        updated_at: nowIso,
      };
      await onSaveDraft(article);
      const now = new Date();
      setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    } catch (err: any) {
      console.error('[handleSave Error]', err);
      alert('Có lỗi khi lưu bản nháp: ' + (err?.message || 'Vui lòng thử lại!'));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Submit for Review
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

    try {
      setIsSaving(true);
      const nowIso = new Date().toISOString();
      const article: ArticleData = {
        ...(initialArticle || {}),
        title,
        slug,
        summary,
        content,
        category,
        topic,
        featured_image: featuredImage,
        references,
        audio_url: audioUrl,
        audio_duration: audioDuration,
        quote_id: selectedQuoteId,
        pdf_attachment: pdfAttachment,
        status: 'pending',
        author_name: initialArticle?.author_name || currentUserName,
        updated_at: nowIso,
      };
      await onSubmitReview(article);
      onBack();
    } catch (err: any) {
      console.error('[handleSubmit Error]', err);
      alert('Có lỗi khi gửi bài viết kiểm duyệt: ' + (err?.message || 'Vui lòng thử lại!'));
    } finally {
      setIsSaving(false);
    }
  };

  // Direct Approve & Publish by Reviewer / Admin
  const handleDirectApprove = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết trước khi phê duyệt!');
      return;
    }
    if (!summary.trim()) {
      alert('Vui lòng nhập Tóm tắt bài viết trước khi phê duyệt!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập Nội dung tư liệu trước khi phê duyệt!');
      return;
    }

    setIsSaving(true);
    const nowIso = new Date().toISOString();
    const article: ArticleData = {
      ...(initialArticle || {}),
      title,
      slug,
      summary,
      content,
      category,
      topic,
      featured_image: featuredImage,
      references,
      audio_url: audioUrl,
      audio_duration: audioDuration,
      quote_id: selectedQuoteId,
      pdf_attachment: pdfAttachment,
      status: 'published',
      author_name: initialArticle?.author_name || currentUserName,
      updated_at: nowIso,
    };
    if (onDirectApprove) {
      await onDirectApprove(article);
    }
    setIsSaving(false);
    onBack();
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
            title="Nộp duyệt bài viết sang Hàng đợi Kiểm duyệt 4 mắt"
          >
            <Send className="w-3.5 h-3.5 text-heritage-gold-300" />
            <span>Gửi duyệt 4 mắt</span>
          </button>

          {isReviewerRole && onDirectApprove && (
            <button
              onClick={handleDirectApprove}
              disabled={isSaving}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition border border-emerald-500/40 disabled:opacity-50"
              title="Phê duyệt quy trình 4 mắt và xuất bản trực tiếp lên trang chủ"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>{isSaving ? 'Đang duyệt...' : 'Phê duyệt & Xuất bản'}</span>
            </button>
          )}

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

                {/* BANNER MỞ ĐỌC SÁCH LẬT TRANG 3D TRONG CHẾ ĐỘ XEM TRƯỚC */}
                {pdfAttachment && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-2xl text-white shadow-xl border-2 border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-heritage-gold-400 text-heritage-red-950 flex items-center justify-center flex-shrink-0 shadow-md">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-heritage-gold-400 text-heritage-red-950 px-2 py-0.5 rounded-full">
                            Tài liệu PDF lật trang 3D
                          </span>
                          <span className="text-xs text-emerald-200">
                            {pdfAttachment.totalPages} trang • {(pdfAttachment.fileSize / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
                          {pdfAttachment.fileName || 'Ấn phẩm số hóa'}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFlipbookPreviewOpen(true)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 hover:from-heritage-gold-300 hover:to-heritage-gold-400 text-heritage-red-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 flex-shrink-0 active:scale-95 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>📖 Mở Đọc Sách Lật Trang 3D</span>
                      <span>→</span>
                    </button>
                  </div>
                )}

                <div className="prose max-w-none font-serif text-heritage-ink-800 text-base leading-relaxed">
                  {content ? (
                    <ContentRenderer content={content} mediaAssets={getStoredMedia()} />
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

            {/* Cấu hình file Băng ghi âm lời Bác nếu được chọn */}
            {category === 'audio' && (
              <div className="p-3.5 bg-amber-50/95 border border-amber-300 rounded-xl space-y-3 animate-fadeIn shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                    <Volume2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Cấu hình Băng ghi âm lời Bác</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    Định dạng MP3 / Audio
                  </span>
                </div>

                {/* 1. NÚT CHỌN TỆP TỪ MÁY TÍNH */}
                <div>
                  <input
                    ref={audioFileInputRef}
                    type="file"
                    accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/*"
                    onChange={handleAudioFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    disabled={isProcessingAudio}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm border border-amber-800"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isProcessingAudio ? 'Đang nạp âm thanh...' : '📁 Tải tệp âm thanh (.mp3) từ máy tính'}</span>
                  </button>
                  <p className="text-[10px] text-amber-800 mt-1 text-center">
                    Tự động nhận diện file & tính toán thời lượng phát chính xác
                  </p>
                </div>

                {audioUploadNotice && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start space-x-2 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{audioUploadNotice}</span>
                  </div>
                )}

                {/* 2. NGHE THỬ ÂM THANH NGAY NẾU ĐÃ CÓ FILE */}
                {audioUrl && (
                  <div className="p-2.5 bg-white border border-amber-300 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-heritage-ink-800">
                      <span className="flex items-center space-x-1">
                        <Music className="w-3.5 h-3.5 text-amber-700" />
                        <span>Nghe thử bản ghi âm:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAudioUrl('');
                          setAudioDuration('');
                          setAudioFileName('');
                          setAudioUploadNotice(null);
                        }}
                        className="text-red-600 hover:text-red-800 text-[10px] font-bold"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                    <audio controls className="w-full h-8" src={audioUrl}>
                      Trình duyệt của bạn không hỗ trợ thẻ audio.
                    </audio>
                  </div>
                )}

                {/* 3. HOẶC DÁN ĐƯỜNG DẪN / URL */}
                <div className="pt-1 border-t border-amber-200">
                  <label className="block text-[11px] font-bold text-heritage-ink-800 mb-1">
                    Hoặc nhập đường dẫn / URL tệp âm thanh:
                  </label>
                  <input
                    type="text"
                    value={audioUrl.startsWith('data:') ? `[Đã nạp tệp cục bộ: ${audioFileName || 'Tệp âm thanh'}]` : audioUrl}
                    onChange={(e) => {
                      if (!audioUrl.startsWith('data:')) {
                        setAudioUrl(e.target.value);
                      }
                    }}
                    placeholder="/audio/tuyen-ngon-doc-lap-1945.mp3 hoặc https://..."
                    className="w-full px-2.5 py-1.5 bg-white border border-heritage-gold-300 rounded text-xs text-heritage-ink-900 outline-none focus:ring-1 focus:ring-heritage-red-600 font-mono"
                  />
                  <p className="text-[10px] text-heritage-ink-500 mt-1 leading-snug">
                    Dành cho file đã lưu sẵn trong thư mục <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">public/audio/</code> hoặc liên kết trực tuyến (.mp3).
                  </p>
                </div>

                {/* 4. THỜI LƯỢNG PHÁT */}
                <div>
                  <label className="block text-[11px] font-bold text-heritage-ink-800 mb-1 flex items-center justify-between">
                    <span>Thời lượng phát (phút : giây)</span>
                    <span className="text-[10px] font-normal text-heritage-ink-500">Tự động điền hoặc nhập tay</span>
                  </label>
                  <input
                    type="text"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full px-2.5 py-1.5 bg-white border border-heritage-gold-300 rounded text-xs text-heritage-ink-900 outline-none focus:ring-1 focus:ring-heritage-red-600"
                  />
                </div>
              </div>
            )}

            {/* Cấu hình Tệp PDF Sách & Ấn phẩm số hóa (Hiển thị khi danh mục là book hoặc đã có file PDF đính kèm) */}
            {(category === 'book' || pdfAttachment) && (
              <div className="p-3.5 bg-emerald-50/95 border border-emerald-300 rounded-xl space-y-3 animate-fadeIn shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
                    <BookOpen className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Cấu hình Sách & Tài liệu PDF lật trang</span>
                  </div>
                  {pdfAttachment && (
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                      {pdfAttachment.totalPages} trang
                    </span>
                  )}
                </div>

                {/* 1. NÚT CHỌN FILE PDF TỪ MÁY TÍNH */}
                <div>
                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handlePdfFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfFileInputRef.current?.click()}
                    disabled={isProcessingPdf}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm border border-emerald-900 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isProcessingPdf ? 'Đang đọc & đếm trang PDF...' : (pdfAttachment ? '🔄 Thay đổi tệp PDF khác' : '📁 Tải tệp sách PDF (.pdf) từ máy')}</span>
                  </button>
                  <p className="text-[10px] text-emerald-800 mt-1 text-center">
                    Tối đa 35MB • Tự động đếm trang và sẵn sàng cho chế độ đọc lật 3D
                  </p>

                  {!pdfAttachment && (
                    <button
                      type="button"
                      onClick={() => {
                        setPdfAttachment({
                          url: '/documents/di-chuc-chu-tich-ho-chi-minh.pdf',
                          fileName: 'Di Chuc 1969.pdf',
                          fileSize: 170588,
                          totalPages: 6,
                          allowDownload: true,
                          readingMode: 'flipbook',
                          uploadedAt: new Date().toISOString(),
                        });
                        setPdfUploadNotice('Đã gắn tệp mẫu: Di chúc Chủ tịch Hồ Chí Minh (6 trang)');
                      }}
                      className="w-full mt-2 flex items-center justify-center space-x-1.5 px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg text-[11px] font-bold border border-emerald-300 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                      <span>✨ Gắn tệp mẫu Di chúc Bác Hồ (6 trang)</span>
                    </button>
                  )}
                </div>

                {pdfUploadNotice && (
                  <div className="p-2 bg-white/90 border border-emerald-300 rounded-lg flex items-start space-x-2 text-emerald-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{pdfUploadNotice}</span>
                  </div>
                )}

                {/* 2. THÔNG TIN FILE HIỆN TẠI & TIỆN ÍCH TRÍCH XUẤT ẢNH BÌA */}
                {pdfAttachment && (
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <FileText className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-emerald-950 truncate">{pdfAttachment.fileName}</p>
                          <p className="text-[10px] text-emerald-700">
                            {(pdfAttachment.fileSize / (1024 * 1024)).toFixed(2)} MB • {pdfAttachment.totalPages} trang
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfAttachment(undefined);
                          setPdfUploadNotice(null);
                        }}
                        className="text-red-600 hover:text-red-800 text-[10px] font-bold ml-2 flex-shrink-0"
                      >
                        Gỡ bỏ
                      </button>
                    </div>

                    {/* Nút Đọc thử lật trang 3D trực tiếp trong Sidebar */}
                    <button
                      type="button"
                      onClick={() => setIsFlipbookPreviewOpen(true)}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-lg text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>📖 Đọc thử lật trang 3D ({pdfAttachment.totalPages} trang)</span>
                    </button>

                    {/* Tiện ích trích xuất Trang 1 làm Ảnh bìa */}
                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-900 font-medium">Trang bìa từ PDF:</span>
                      <button
                        type="button"
                        onClick={handleExtractCover}
                        disabled={isExtractingCover}
                        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-[10px] font-bold border border-emerald-300 transition-colors disabled:opacity-50"
                      >
                        {isExtractingCover ? 'Đang trích xuất...' : '📸 Đặt Trang 1 làm Ảnh bìa'}
                      </button>
                    </div>

                    {/* Tuỳ chọn tải về máy & chế độ lật trang */}
                    <div className="pt-2 border-t border-emerald-100 space-y-1.5">
                      <label className="flex items-center space-x-2 cursor-pointer text-[11px] text-emerald-950">
                        <input
                          type="checkbox"
                          checked={pdfAttachment.allowDownload !== false}
                          onChange={(e) => setPdfAttachment({ ...pdfAttachment, allowDownload: e.target.checked })}
                          className="rounded text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>Cho phép học sinh tải tệp PDF về máy</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer text-[11px] text-emerald-950">
                        <input
                          type="checkbox"
                          checked={pdfAttachment.readingMode !== 'scroll'}
                          onChange={(e) => setPdfAttachment({ ...pdfAttachment, readingMode: e.target.checked ? 'flipbook' : 'scroll' })}
                          className="rounded text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>Bật hiệu ứng đọc lật trang 3D (Interactive Flipbook)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

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

            {/* Lựa chọn Danh ngôn Bác Hồ đính kèm cuối bài viết */}
            <div className="space-y-2 p-3.5 bg-gradient-to-br from-heritage-red-900/5 via-heritage-gold-50/60 to-white rounded-xl border border-heritage-gold-300 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-heritage-red-800 tracking-wider flex items-center space-x-1.5">
                  <Quote className="w-3.5 h-3.5 text-heritage-gold-600" />
                  <span>Danh ngôn Bác Hồ đính kèm</span>
                </label>
                <span className="text-[10px] text-heritage-gold-800 font-semibold bg-heritage-gold-100 px-1.5 py-0.5 rounded border border-heritage-gold-300">
                  Cuối bài
                </span>
              </div>

              <select
                value={selectedQuoteId}
                onChange={(e) => setSelectedQuoteId(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-white border border-heritage-gold-300 rounded-lg text-xs font-semibold text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600 shadow-sm"
              >
                {UNCLE_HO_QUOTES.map((q) => (
                  <option key={q.id} value={q.id}>
                    #{q.id} - {q.category}
                  </option>
                ))}
              </select>

              {/* Live Preview of Selected Quote */}
              {(() => {
                const currentQ = UNCLE_HO_QUOTES.find((q) => q.id === selectedQuoteId) || UNCLE_HO_QUOTES[0];
                return (
                  <div className="p-3 bg-gradient-to-br from-heritage-red-950 via-heritage-red-900 to-heritage-red-950 text-white rounded-lg text-xs space-y-2 shadow-inner border border-heritage-gold-400/40">
                    <p className="font-serif italic text-heritage-gold-100 line-clamp-3 leading-relaxed text-[11px]">
                      "{currentQ.quote}"
                    </p>
                    <div className="text-[10px] text-heritage-gold-400 font-sans flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="truncate max-w-[140px]">{currentQ.context ? currentQ.context : `Năm ${currentQ.year}`}</span>
                      <span className="font-bold flex-shrink-0">— Hồ Chí Minh</span>
                    </div>
                  </div>
                );
              })()}

              <p className="text-[10px] text-heritage-ink-500 italic leading-snug">
                Tác giả có thể chọn câu danh ngôn phù hợp nhất với chủ đề hoạt động hoặc tư liệu giảng dạy.
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

      {/* 3D FLIPBOOK MODAL PREVIEW CHO TRÌNH SOẠN THẢO CMS */}
      {pdfAttachment && isFlipbookPreviewOpen && (
        <BookFlipbookModal
          isOpen={isFlipbookPreviewOpen}
          onClose={() => setIsFlipbookPreviewOpen(false)}
          item={{
            id: initialArticle?.id || slug || 'preview-book',
            title: title || 'Tài liệu Sách & Ấn phẩm',
            category: 'book',
            categoryLabel: 'Sách & Tài liệu',
            description: summary || '',
            fullContent: content || '',
            authorOrSource: currentUserName || 'Ban Biên Tập THCS Nguyễn Trung Trực',
            dateOrEra: 'Bản xem trước CMS',
            thumbnail: featuredImage || '',
            badgeText: 'Bản xem trước',
            isMockData: false,
            tags: [],
            pdfAttachment: pdfAttachment,
          }}
        />
      )}
    </div>
  );
};
