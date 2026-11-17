/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * COMPONENT: INTERACTIVE 3D FLIPBOOK READER MODAL (SÁCH & TÀI LIỆU LẬT TRANG)
 * ==============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut,
  RotateCcw, Download, Volume2, VolumeX, BookOpen, FileText, Loader2
} from 'lucide-react';
import { PdfAttachment, ResourceItem } from '../types';
import { loadPdfFromUrl, renderPdfPageToCanvas } from '../lib/pdfHelper';

interface BookFlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ResourceItem;
}

// Âm thanh sột soạt lật trang giấy mô phỏng chân thực bằng Web Audio API
function playPageFlipSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const duration = 0.09;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Bỏ qua nếu trình duyệt chặn autoplay audio
  }
}

export const BookFlipbookModal: React.FC<BookFlipbookModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const pdfAttachment: PdfAttachment | undefined = item.pdfAttachment;

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(pdfAttachment?.totalPages || 1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 100% - 175%
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isTwoPageMode, setIsTwoPageMode] = useState<boolean>(true);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const canvasSingleRef = useRef<HTMLCanvasElement>(null);

  // Nhận diện màn hình di động (< 900px) tự động đổi sang 1 trang
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsTwoPageMode(false);
      } else {
        setIsTwoPageMode(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Tải tài liệu PDF khi mở Modal
  useEffect(() => {
    if (!isOpen || !pdfAttachment?.url) return;

    let isMounted = true;
    setIsLoadingPdf(true);
    setRenderError(null);
    setCurrentPage(1);
    setJumpPageInput('1');

    loadPdfFromUrl(pdfAttachment.url)
      .then((doc) => {
        if (!isMounted) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsLoadingPdf(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[loadPdfFromUrl Error]', err);
        setRenderError('Không thể mở tệp PDF. Tệp có thể không tồn tại hoặc định dạng không tương thích.');
        setIsLoadingPdf(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfAttachment?.url]);

  // 2. Render các trang tương ứng khi currentPage, zoomLevel hoặc isTwoPageMode thay đổi
  const renderCurrentPages = useCallback(async () => {
    if (!pdfDoc) return;
    setIsRenderingPage(true);

    try {
      // Chiều rộng trang mục tiêu dựa trên container và zoom
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const targetSingleWidth = Math.min(780, Math.floor(containerWidth * 0.92)) * (zoomLevel / 100);
      const targetDoubleWidth = Math.min(520, Math.floor(containerWidth * 0.44)) * (zoomLevel / 100);

      if (!isTwoPageMode) {
        // Chế độ 1 trang (Mobile hoặc người dùng chọn)
        if (canvasSingleRef.current) {
          await renderPdfPageToCanvas(pdfDoc, currentPage, canvasSingleRef.current, targetSingleWidth);
        }
      } else {
        // Chế độ 2 trang (Desktop)
        // Nếu ở trang 1: Trang 1 là Bìa sách, hiển thị trang 1 ở bên phải (như bìa trước)
        if (currentPage === 1) {
          if (canvasRightRef.current) {
            await renderPdfPageToCanvas(pdfDoc, 1, canvasRightRef.current, targetDoubleWidth);
          }
        } else {
          // Các trang tiếp theo: Trang chẵn bên trái, trang lẻ bên phải
          const leftPageNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
          const rightPageNum = leftPageNum + 1;

          if (canvasLeftRef.current && leftPageNum <= totalPages) {
            await renderPdfPageToCanvas(pdfDoc, leftPageNum, canvasLeftRef.current, targetDoubleWidth);
          }
          if (canvasRightRef.current && rightPageNum <= totalPages) {
            await renderPdfPageToCanvas(pdfDoc, rightPageNum, canvasRightRef.current, targetDoubleWidth);
          }
        }
      }
    } catch (err: any) {
      console.warn('[renderCurrentPages Warning]', err);
    } finally {
      setIsRenderingPage(false);
    }
  }, [pdfDoc, currentPage, zoomLevel, isTwoPageMode, totalPages]);

  useEffect(() => {
    if (pdfDoc && !isLoadingPdf) {
      renderCurrentPages();
    }
  }, [pdfDoc, isLoadingPdf, renderCurrentPages]);

  // Cập nhật ô nhập số trang đồng bộ
  useEffect(() => {
    setJumpPageInput(String(currentPage));
  }, [currentPage]);

  // 3. Các hàm chuyển trang
  const handleNextPage = () => {
    if (!pdfDoc) return;
    const step = isTwoPageMode ? (currentPage === 1 ? 1 : 2) : 1;
    const next = Math.min(totalPages, currentPage + step);
    if (next !== currentPage) {
      if (isSoundEnabled) playPageFlipSound();
      setFlipDirection('next');
      setTimeout(() => setFlipDirection(null), 300);
      setCurrentPage(next);
    }
  };

  const handlePrevPage = () => {
    if (!pdfDoc) return;
    const step = isTwoPageMode ? (currentPage <= 2 ? 1 : 2) : 1;
    const prev = Math.max(1, currentPage - step);
    if (prev !== currentPage) {
      if (isSoundEnabled) playPageFlipSound();
      setFlipDirection('prev');
      setTimeout(() => setFlipDirection(null), 300);
      setCurrentPage(prev);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      if (isSoundEnabled) playPageFlipSound();
      setCurrentPage(target);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  // Điều khiển bàn phím (Phím mũi tên ← / → để lật trang, Esc để đóng)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, totalPages, isTwoPageMode, isSoundEnabled]);

  // Toàn màn hình
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Tải tệp PDF về máy
  const handleDownloadPdf = () => {
    if (!pdfAttachment?.url) return;
    const a = document.createElement('a');
    a.href = pdfAttachment.url;
    a.download = pdfAttachment.fileName || `${item.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  const leftPageNumber = isTwoPageMode && currentPage > 1 ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : null;
  const rightPageNumber = isTwoPageMode ? (currentPage === 1 ? 1 : (leftPageNumber ? leftPageNumber + 1 : currentPage)) : currentPage;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md text-stone-100 select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. TOP NAV BAR (HEADER TRANG TRỌNG) */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-heritage-red-950 via-heritage-red-900 to-heritage-red-950 border-b border-heritage-gold-500/30 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-1.5 bg-heritage-gold-500/20 border border-heritage-gold-400/40 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-heritage-gold-300" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-heritage-gold-400 text-heritage-red-950">
                Sách & Tài liệu số hóa
              </span>
              <span className="text-xs text-heritage-gold-200/80 hidden sm:inline">
                Trường THCS Nguyễn Trung Trực
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate drop-shadow-sm mt-0.5">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Nút hành động phía trên */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Nút âm thanh lật trang */}
          <button
            type="button"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              isSoundEnabled ? 'bg-heritage-gold-500/20 text-heritage-gold-300 border border-heritage-gold-400/30' : 'text-stone-400 hover:text-white'
            }`}
            title={isSoundEnabled ? 'Tắt âm thanh lật trang' : 'Bật âm thanh lật trang'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Đổi chế độ 1 trang / 2 trang trên máy tính */}
          <button
            type="button"
            onClick={() => setIsTwoPageMode(!isTwoPageMode)}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-heritage-gold-200 border border-white/10 transition-all"
            title="Đổi giữa chế độ 2 trang mở rộng và 1 trang"
          >
            <span>{isTwoPageMode ? '📖 2 trang' : '📄 1 trang'}</span>
          </button>

          {/* Phóng to / Thu nhỏ */}
          <div className="hidden sm:flex items-center space-x-1 bg-black/30 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(100, z - 15))}
              className="p-1.5 hover:text-heritage-gold-300 transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-heritage-gold-200 font-bold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(175, z + 15))}
              className="p-1.5 hover:text-heritage-gold-300 transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 hover:text-white transition-colors"
                title="Khôi phục kích thước chuẩn"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Toàn màn hình */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Nút đóng */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-red-600 rounded-lg text-white transition-all shadow-sm"
            aria-label="Đóng khung đọc sách"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN READING STAGE (KHÔNG GIAN LẬT SÁCH 3D) */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Chỉ báo đang chuyển trang mượt */}
        {isRenderingPage && (
          <div className="absolute top-3 right-4 z-30 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-heritage-gold-500/30 text-heritage-gold-300 text-[10px] font-semibold backdrop-blur-sm animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Đang lật trang...</span>
          </div>
        )}

        {/* Nút lật trang trước (Mép trái) */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isLoadingPdf}
          className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-heritage-red-900/80 hover:bg-heritage-red-800 text-heritage-gold-300 border border-heritage-gold-500/40 shadow-xl backdrop-blur-sm disabled:opacity-20 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95"
          title="Trang trước (Phím ←)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Nút lật trang sau (Mép phải) */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isLoadingPdf}
          className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-heritage-red-900/80 hover:bg-heritage-red-800 text-heritage-gold-300 border border-heritage-gold-500/40 shadow-xl backdrop-blur-sm disabled:opacity-20 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95"
          title="Trang sau (Phím →)"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Loading Spinner */}
        {isLoadingPdf && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 text-heritage-gold-400 animate-spin" />
            <p className="text-sm font-medium text-heritage-gold-200">Đang chuẩn bị cuốn sách...</p>
          </div>
        )}

        {/* Lỗi Render */}
        {renderError && !isLoadingPdf && (
          <div className="max-w-md p-6 bg-red-950/80 border border-red-500/50 rounded-2xl text-center space-y-3">
            <FileText className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-red-200">{renderError}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-600 rounded-lg text-xs font-bold text-white"
            >
              Đóng lại
            </button>
          </div>
        )}

        {/* KHUNG CUỐN SÁCH 3D (BOOK CONTAINER) */}
        {!isLoadingPdf && !renderError && (
          <div
            className={`relative flex items-center justify-center transition-all duration-300 ${
              flipDirection === 'next' ? 'scale-[0.99] rotate-[0.3deg]' : flipDirection === 'prev' ? 'scale-[0.99] -rotate-[0.3deg]' : 'scale-100 rotate-0'
            }`}
            style={{ perspective: '1600px' }}
          >
            {/* Chế độ 1 TRANG (Mobile hoặc Single Page Mode) */}
            {!isTwoPageMode ? (
              <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-stone-800 transition-all">
                <canvas ref={canvasSingleRef} className="block shadow-md" />
                <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                  Trang {currentPage} / {totalPages}
                </div>
              </div>
            ) : (
              /* Chế độ 2 TRANG MỞ RỘNG (TWO-PAGE SPREAD DESKTOP) */
              <div className="flex items-center justify-center bg-stone-900/60 p-2 sm:p-3 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-heritage-gold-500/20">
                {/* Trang 1 BÌA SÁCH (Đứng đơn ở bên phải) */}
                {currentPage === 1 ? (
                  <div className="relative bg-white rounded-r-lg shadow-2xl overflow-hidden border-r-4 border-y-2 border-heritage-gold-600/40">
                    <canvas ref={canvasRightRef} className="block shadow-inner" />
                    <div className="absolute top-2 right-2 px-2.5 py-1 bg-heritage-red-800/90 text-white rounded text-[10px] font-bold shadow-md">
                      Bìa trước • Trang 1
                    </div>
                  </div>
                ) : (
                  /* Hai trang mở xòe rộng (Trang chẵn bên Trái, Trang lẻ bên Phải) */
                  <div className="flex items-stretch relative bg-stone-950 rounded-lg shadow-2xl overflow-hidden border border-stone-800">
                    {/* TRANG TRÁI */}
                    <div className="relative bg-white rounded-l shadow-inner border-r border-stone-300">
                      <canvas ref={canvasLeftRef} className="block" />
                      {leftPageNumber && (
                        <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                          Trang {leftPageNumber}
                        </div>
                      )}
                    </div>

                    {/* ĐƯỜNG GÁY SÁCH 3D (BOOK SPINE SHADOW) */}
                    <div className="w-4 bg-gradient-to-r from-stone-400 via-stone-700 to-stone-400 shadow-inner opacity-80 z-10 flex-shrink-0" />

                    {/* TRANG PHẢI */}
                    <div className="relative bg-white rounded-r shadow-inner">
                      <canvas ref={canvasRightRef} className="block" />
                      {rightPageNumber && rightPageNumber <= totalPages && (
                        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                          Trang {rightPageNumber}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. BOTTOM CONTROL TOOLBAR (THANH ĐIỀU KHIỂN ĐỌC SÁCH) */}
      <footer className="px-4 py-2.5 bg-stone-900/95 border-t border-heritage-gold-500/20 flex items-center justify-between text-xs text-stone-300 flex-shrink-0">
        {/* Nguồn tài liệu & Tác giả */}
        <div className="hidden lg:flex items-center space-x-2 text-stone-400 truncate max-w-xs">
          <span className="font-semibold text-heritage-gold-300">Xuất xứ:</span>
          <span className="truncate">{item.authorOrSource}</span>
        </div>

        {/* Thanh trượt trang & Nhảy trang nhanh */}
        <div className="flex items-center space-x-2 sm:space-x-4 mx-auto">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            ◄ Trước
          </button>

          {/* Thanh trượt nhanh */}
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setCurrentPage(val);
            }}
            className="w-24 sm:w-44 accent-heritage-gold-400 cursor-pointer"
            title="Kéo để nhảy trang nhanh"
          />

          {/* Form nhập số trang */}
          <form onSubmit={handleJumpToPage} className="flex items-center space-x-1.5">
            <span className="text-stone-400 hidden sm:inline">Trang</span>
            <input
              type="text"
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-12 px-1.5 py-1 text-center bg-stone-800 border border-stone-700 rounded text-xs font-mono font-bold text-white focus:ring-1 focus:ring-heritage-gold-400 outline-none"
            />
            <span className="text-stone-400 font-mono">/ {totalPages}</span>
          </form>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            Sau ►
          </button>
        </div>

        {/* Nút Tải PDF về máy (Nếu được phép) */}
        <div className="flex items-center space-x-2">
          {pdfAttachment?.allowDownload !== false && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-heritage-gold-500 hover:bg-heritage-gold-400 text-heritage-red-950 font-bold transition-all shadow-sm active:scale-95"
              title="Tải tệp PDF cuốn sách về máy tính / điện thoại"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải PDF</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
