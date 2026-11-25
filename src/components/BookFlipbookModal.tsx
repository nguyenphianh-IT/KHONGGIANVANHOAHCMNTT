/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * COMPONENT: INTERACTIVE 3D FLIPBOOK READER MODAL (SÁCH & TÀI LIỆU LẬT TRANG)
 * ==============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut,
  RotateCcw, Download, Volume2, VolumeX, BookOpen, FileText, Loader2, ExternalLink
} from 'lucide-react';
import { PdfAttachment, ResourceItem } from '../types';
import { loadPdfFromUrl, renderPdfPageToCanvas } from '../lib/pdfHelper';

interface BookFlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ResourceItem;
}

// Tái sử dụng 1 AudioContext duy nhất để tránh vượt giới hạn 6 AudioContext trên Safari/Chrome khi lật nhiều trang
let sharedAudioCtx: AudioContext | null = null;
function playPageFlipSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
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
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 100% - 200%
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isTwoPageMode, setIsTwoPageMode] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 960 : true
  );
  const [viewportTick, setViewportTick] = useState<number>(0);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const canvasSingleRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Nhận diện màn hình di động / tablet (< 960px) tự động đổi sang 1 trang và cập nhật kích thước khi xoay màn hình
  useEffect(() => {
    let resizeTimer: number | undefined;
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setIsTwoPageMode(false);
      } else {
        setIsTwoPageMode(true);
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setViewportTick((t) => t + 1);
      }, 150);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 1. Tải tài liệu PDF khi mở Modal
  useEffect(() => {
    if (!isOpen || !pdfAttachment?.url) return;

    let isMounted = true;
    setIsLoadingPdf(true);
    setRenderError(null);
    setCurrentPage(1);
    setZoomLevel(100);
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
        setRenderError('Không thể mở tệp PDF trực tiếp trên trình duyệt này. Bạn có thể bấm "Mở PDF gốc" hoặc "Tải PDF" bên dưới.');
        setIsLoadingPdf(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfAttachment?.url]);

  // 2. Render các trang tương ứng, tự động vừa khít cả CHIỀU RỘNG & CHIỀU CAO khung nhìn trên mọi thiết bị
  const renderCurrentPages = useCallback(async () => {
    if (!pdfDoc) return;
    setIsRenderingPage(true);

    try {
      const stageW = stageRef.current?.clientWidth || window.innerWidth;
      const stageH = stageRef.current?.clientHeight || Math.max(360, window.innerHeight - 130);
      const zoomFactor = zoomLevel / 100;

      // Dành khoảng đệm hợp lý (nhỏ hơn trên điện thoại để trang đọc rộng tối đa)
      const isCompact = stageW < 640;
      const availSingleW = Math.max(240, stageW - (isCompact ? 16 : 120)) * zoomFactor;
      const availSingleH = Math.max(280, stageH - (isCompact ? 20 : 36)) * zoomFactor;

      const availDoubleW = Math.max(240, Math.floor((stageW - 150) / 2)) * zoomFactor;
      const availDoubleH = Math.max(300, stageH - 44) * zoomFactor;

      if (!isTwoPageMode) {
        // Chế độ 1 trang (Điện thoại, Tablet, hoặc người dùng chọn)
        if (canvasSingleRef.current) {
          await renderPdfPageToCanvas(pdfDoc, currentPage, canvasSingleRef.current, availSingleW, availSingleH);
        }
      } else {
        // Chế độ 2 trang (Desktop màn hình rộng)
        if (currentPage === 1) {
          if (canvasRightRef.current) {
            await renderPdfPageToCanvas(pdfDoc, 1, canvasRightRef.current, availDoubleW, availDoubleH);
          }
        } else {
          const leftPageNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
          const rightPageNum = leftPageNum + 1;

          const tasks: Promise<any>[] = [];
          if (canvasLeftRef.current && leftPageNum <= totalPages) {
            tasks.push(renderPdfPageToCanvas(pdfDoc, leftPageNum, canvasLeftRef.current, availDoubleW, availDoubleH));
          }
          if (canvasRightRef.current && rightPageNum <= totalPages) {
            tasks.push(renderPdfPageToCanvas(pdfDoc, rightPageNum, canvasRightRef.current, availDoubleW, availDoubleH));
          }
          await Promise.all(tasks);
        }
      }
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.warn('[renderCurrentPages Warning]', err);
      }
    } finally {
      setIsRenderingPage(false);
    }
  }, [pdfDoc, currentPage, zoomLevel, isTwoPageMode, totalPages, viewportTick]);

  useEffect(() => {
    if (pdfDoc && !isLoadingPdf) {
      renderCurrentPages();
    }
  }, [pdfDoc, isLoadingPdf, renderCurrentPages]);

  // Cuộn về đầu trang khi chuyển trang
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [currentPage]);

  // Cập nhật ô nhập số trang đồng bộ
  useEffect(() => {
    setJumpPageInput(String(currentPage));
  }, [currentPage]);

  // 3. Các hàm chuyển trang
  const handleNextPage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!pdfDoc) return;
    const step = isTwoPageMode ? (currentPage === 1 ? 1 : 2) : 1;
    const next = Math.min(totalPages, currentPage + step);
    if (next !== currentPage) {
      if (isSoundEnabled) playPageFlipSound();
      setFlipDirection('next');
      setTimeout(() => setFlipDirection(null), 260);
      setCurrentPage(next);
    }
  }, [pdfDoc, isTwoPageMode, currentPage, totalPages, isSoundEnabled]);

  const handlePrevPage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!pdfDoc) return;
    const step = isTwoPageMode ? (currentPage <= 2 ? 1 : 2) : 1;
    const prev = Math.max(1, currentPage - step);
    if (prev !== currentPage) {
      if (isSoundEnabled) playPageFlipSound();
      setFlipDirection('prev');
      setTimeout(() => setFlipDirection(null), 260);
      setCurrentPage(prev);
    }
  }, [pdfDoc, isTwoPageMode, currentPage, isSoundEnabled]);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      if (isSoundEnabled) playPageFlipSound();
      setCurrentPage(target);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  // Vuốt trái/phải để lật trang trên điện thoại / máy tính bảng (chỉ kích hoạt ở mức zoom 100% để không cản thao tác cuộn khi phóng to)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 100 || e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || zoomLevel > 100 || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
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
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage, onClose]);

  // Toàn màn hình
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
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
  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pdfAttachment?.url) return;
    const a = document.createElement('a');
    a.href = pdfAttachment.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = pdfAttachment.fileName || `${item.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  const leftPageNumber = isTwoPageMode && currentPage > 1 ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : null;
  const rightPageNumber = isTwoPageMode ? (currentPage === 1 ? 1 : (leftPageNumber ? leftPageNumber + 1 : currentPage)) : currentPage;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[70] h-[100dvh] w-screen flex flex-col bg-stone-950/95 backdrop-blur-md text-stone-100 select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. TOP NAV BAR (HEADER TRANG TRỌNG) */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-heritage-red-950 via-heritage-red-900 to-heritage-red-950 border-b border-heritage-gold-500/30 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-1.5 bg-heritage-gold-500/20 border border-heritage-gold-400/40 rounded-lg flex-shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-300" />
          </div>
          <div className="min-w-0">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-heritage-gold-400 text-heritage-red-950">
                Sách & Tài liệu số hóa
              </span>
              <span className="text-xs text-heritage-gold-200/80 hidden md:inline">
                Trường THCS Nguyễn Trung Trực
              </span>
            </div>
            <h2 className="text-xs sm:text-base font-serif font-bold text-white truncate drop-shadow-sm sm:mt-0.5">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Nút hành động phía trên (Hiển thị đầy đủ Zoom trên cả Mobile lẫn Desktop) */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Phóng to / Thu nhỏ (Khả dụng trên mọi thiết bị kể cả điện thoại) */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 bg-black/35 rounded-lg p-0.5 border border-white/15">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.max(100, z - 20));
              }}
              className="p-1.5 hover:text-heritage-gold-300 transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] sm:text-[11px] font-mono px-1 text-heritage-gold-200 font-bold min-w-[34px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.min(200, z + 20));
              }}
              className="p-1.5 hover:text-heritage-gold-300 transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(100);
                }}
                className="p-1 hover:text-white transition-colors"
                title="Vừa màn hình (100%)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Đổi chế độ 1 trang / 2 trang trên màn hình rộng */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsTwoPageMode(!isTwoPageMode);
            }}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-heritage-gold-200 border border-white/10 transition-all"
            title="Đổi giữa chế độ 2 trang mở rộng và 1 trang"
          >
            <span>{isTwoPageMode ? '📖 2 trang' : '📄 1 trang'}</span>
          </button>

          {/* Nút âm thanh lật trang */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSoundEnabled(!isSoundEnabled);
            }}
            className={`hidden sm:block p-2 rounded-lg text-xs font-semibold transition-all ${
              isSoundEnabled ? 'bg-heritage-gold-500/20 text-heritage-gold-300 border border-heritage-gold-400/30' : 'text-stone-400 hover:text-white'
            }`}
            title={isSoundEnabled ? 'Tắt âm thanh lật trang' : 'Bật âm thanh lật trang'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Toàn màn hình */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Nút đóng */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 sm:p-2 bg-white/10 hover:bg-red-600 rounded-lg text-white transition-all shadow-sm"
            aria-label="Đóng khung đọc sách"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN READING STAGE (CUỘN MƯỢT KHI PHÓNG TO + VUỐT CHUYỂN TRANG TRÊN DI ĐỘNG) */}
      <div className="flex-1 relative min-h-0 flex">
        {/* Chỉ báo đang chuyển trang mượt */}
        {isRenderingPage && (
          <div className="absolute top-3 right-4 z-30 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-heritage-gold-500/30 text-heritage-gold-300 text-[10px] font-semibold backdrop-blur-sm animate-pulse pointer-events-none">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Đang tải trang...</span>
          </div>
        )}

        {/* Nút lật trang trước (Mép trái - hiển thị trên Tablet/Desktop để không che chữ trên điện thoại nhỏ) */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isLoadingPdf}
          className="hidden sm:flex items-center justify-center absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 rounded-full bg-heritage-red-900/85 hover:bg-heritage-red-800 text-heritage-gold-300 border border-heritage-gold-500/40 shadow-xl backdrop-blur-sm disabled:opacity-20 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95"
          title="Trang trước (Phím ←)"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        {/* Nút lật trang sau (Mép phải - hiển thị trên Tablet/Desktop) */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isLoadingPdf}
          className="hidden sm:flex items-center justify-center absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 rounded-full bg-heritage-red-900/85 hover:bg-heritage-red-800 text-heritage-gold-300 border border-heritage-gold-500/40 shadow-xl backdrop-blur-sm disabled:opacity-20 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95"
          title="Trang sau (Phím →)"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <main
          ref={stageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`flex-1 w-full h-full overflow-auto p-2 sm:p-4 md:p-5 flex ${
            zoomLevel > 100 ? 'items-start justify-start sm:justify-center' : 'items-center justify-center'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Loading Spinner */}
          {isLoadingPdf && (
            <div className="flex flex-col items-center justify-center space-y-3 m-auto">
              <Loader2 className="w-10 h-10 text-heritage-gold-400 animate-spin" />
              <p className="text-sm font-medium text-heritage-gold-200">Đang mở tài liệu PDF...</p>
            </div>
          )}

          {/* Lỗi Render */}
          {renderError && !isLoadingPdf && (
            <div className="max-w-md p-6 bg-red-950/80 border border-red-500/50 rounded-2xl text-center space-y-4 m-auto">
              <FileText className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-sm text-red-200 leading-relaxed">{renderError}</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {pdfAttachment?.url && (
                  <a
                    href={pdfAttachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-heritage-gold-500 hover:bg-heritage-gold-400 rounded-lg text-xs font-bold text-heritage-red-950 inline-flex items-center space-x-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở PDF gốc</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-600 rounded-lg text-xs font-bold text-white"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          )}

          {/* KHUNG CUỐN SÁCH 3D (BOOK CONTAINER) */}
          {!isLoadingPdf && !renderError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: flipDirection ? 0.985 : 1,
                rotateY: flipDirection === 'next' ? -4 : flipDirection === 'prev' ? 4 : 0,
                y: 0,
              }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="relative flex items-center justify-center m-auto"
              style={{ perspective: '1600px' }}
            >
              {/* Chế độ 1 TRANG (Mobile, Tablet hoặc Single Page Mode) */}
              {!isTwoPageMode ? (
                <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-700">
                  <canvas ref={canvasSingleRef} className="block" />
                  <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono pointer-events-none">
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
                      <div className="absolute top-2 right-2 px-2.5 py-1 bg-heritage-red-800/90 text-white rounded text-[10px] font-bold shadow-md pointer-events-none">
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
                          <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono pointer-events-none">
                            Trang {leftPageNumber}
                          </div>
                        )}
                      </div>

                      {/* ĐƯỜNG GÁY SÁCH 3D (chỉ hiển thị nếu có trang phải) */}
                      {rightPageNumber && rightPageNumber <= totalPages && (
                        <>
                          <div className="w-3.5 bg-gradient-to-r from-stone-400 via-stone-700 to-stone-400 shadow-inner opacity-80 z-10 flex-shrink-0" />
                          {/* TRANG PHẢI */}
                          <div className="relative bg-white rounded-r shadow-inner">
                            <canvas ref={canvasRightRef} className="block" />
                            <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono pointer-events-none">
                              Trang {rightPageNumber}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* 3. BOTTOM CONTROL TOOLBAR (THANH ĐIỀU KHIỂN ĐỌC SÁCH THÂN THIỆN MỌI THIẾT BỊ) */}
      <footer className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-stone-900/95 border-t border-heritage-gold-500/25 flex items-center justify-between gap-2 text-xs text-stone-300 flex-shrink-0">
        {/* Nguồn tài liệu & Tác giả */}
        <div className="hidden lg:flex items-center space-x-2 text-stone-400 truncate max-w-xs">
          <span className="font-semibold text-heritage-gold-300">Xuất xứ:</span>
          <span className="truncate">{item.authorOrSource}</span>
        </div>

        {/* Điều hướng chuyển trang lớn, dễ bấm trên cả điện thoại lẫn máy tính */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 mx-auto">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isLoadingPdf}
            className="min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-lg bg-heritage-red-900 hover:bg-heritage-red-800 border border-heritage-gold-500/30 text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4 text-heritage-gold-300" />
            <span>Trước</span>
          </button>

          {/* Thanh trượt nhanh (ẩn trên màn hình rất nhỏ < 420px để nhường chỗ nút Trước/Sau rõ ràng) */}
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setCurrentPage(val);
            }}
            className="hidden min-[440px]:block w-20 sm:w-40 accent-heritage-gold-400 cursor-pointer"
            title="Kéo để nhảy trang nhanh"
          />

          {/* Form nhập số trang */}
          <form onSubmit={handleJumpToPage} className="flex items-center space-x-1">
            <span className="text-stone-400 hidden sm:inline">Trang</span>
            <input
              type="text"
              inputMode="numeric"
              value={jumpPageInput}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-10 sm:w-12 px-1 py-1 text-center bg-stone-800 border border-stone-700 rounded text-xs font-mono font-bold text-white focus:ring-1 focus:ring-heritage-gold-400 outline-none"
            />
            <span className="text-stone-400 font-mono text-[11px] sm:text-xs">/ {totalPages}</span>
          </form>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoadingPdf}
            className="min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-lg bg-heritage-red-900 hover:bg-heritage-red-800 border border-heritage-gold-500/30 text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex items-center space-x-1"
          >
            <span>Sau</span>
            <ChevronRight className="w-4 h-4 text-heritage-gold-300" />
          </button>
        </div>

        {/* Nút Mở PDF gốc & Tải PDF về máy */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {pdfAttachment?.url && !pdfAttachment.url.startsWith('data:') && (
            <a
              href={pdfAttachment.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold transition-all"
              title="Mở tệp PDF bằng trình đọc gốc của thiết bị"
            >
              <ExternalLink className="w-3.5 h-3.5 text-heritage-gold-300" />
              <span className="hidden md:inline">Mở gốc</span>
            </a>
          )}
          {pdfAttachment?.allowDownload !== false && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="min-h-[36px] flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-heritage-gold-500 hover:bg-heritage-gold-400 text-heritage-red-950 font-bold transition-all shadow-sm active:scale-95"
              title="Tải tệp PDF cuốn sách về máy tính / điện thoại"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải PDF</span>
            </button>
          )}
        </div>
      </footer>
    </motion.div>
  );
};
