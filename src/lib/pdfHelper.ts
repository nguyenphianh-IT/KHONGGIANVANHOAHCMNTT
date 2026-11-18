/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * MODULE: PDF PARSING & RENDERING HELPER (MOZILLA PDF.JS)
 * ==============================================================================
 */

import * as pdfjsLib from 'pdfjs-dist';

// Cấu hình Worker cho Mozilla PDF.js
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  // Sử dụng CDN chính thức phiên bản 3.11.174 khớp với package.json
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export interface PdfMetadataResult {
  totalPages: number;
  fileName: string;
  fileSize: number;
  pdfDoc: any;
}

/**
 * Đọc file PDF tải lên từ máy tính của BTV, trả về thông tin metadata và đối tượng pdfDoc
 */
export async function parsePdfFile(file: File): Promise<PdfMetadataResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;

  return {
    totalPages: pdfDoc.numPages,
    fileName: file.name,
    fileSize: file.size,
    pdfDoc,
  };
}

/**
 * Trích xuất Trang 1 của tệp PDF thành ảnh đại diện (Featured Image) định dạng JPEG
 */
export async function extractPdfCoverImage(fileOrDoc: File | any, maxWidth = 900): Promise<string> {
  let pdfDoc = fileOrDoc;

  if (fileOrDoc instanceof File) {
    const arrayBuffer = await fileOrDoc.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
    });
    pdfDoc = await loadingTask.promise;
  }

  if (!pdfDoc || pdfDoc.numPages < 1) {
    throw new Error('Tệp PDF không hợp lệ hoặc không có trang nào');
  }

  const page = await pdfDoc.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const scale = Math.min(2.0, maxWidth / unscaledViewport.width);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Không thể khởi tạo Canvas 2D');
  }

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Theo dõi tác vụ render đang chạy trên mỗi canvas để hủy sạch khi lật trang nhanh
const activeRenderTasks = new WeakMap<HTMLCanvasElement, any>();

/**
 * Nạp tài liệu PDF từ URL (Supabase Storage, server path hoặc Data URL)
 * Hỗ trợ HTTP Range Requests để tải từng phần (stream on-demand) và tự động dự phòng nếu mạng di động chặn Range
 */
export async function loadPdfFromUrl(url: string): Promise<any> {
  const baseParams: any = {
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true,
  };

  if (url.startsWith('data:')) {
    // Chuyển đổi chuỗi Base64 Data URL thành Uint8Array an toàn tuyệt đối
    const base64Data = (url.split(',')[1] || url).replace(/\s/g, '');
    const binaryStr = typeof window !== 'undefined' ? window.atob(base64Data) : Buffer.from(base64Data, 'base64').toString('binary');
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const loadingTask = pdfjsLib.getDocument({ ...baseParams, data: bytes });
    return await loadingTask.promise;
  }

  // Kênh 1: HTTP 206 Byte-Range streaming (tải từng phần mượt mà)
  try {
    const loadingTask = pdfjsLib.getDocument({
      ...baseParams,
      url,
      rangeChunkSize: 65536,
      disableAutoFetch: true,
      disableStream: false,
    });
    return await loadingTask.promise;
  } catch (rangeErr) {
    console.warn('[loadPdfFromUrl] Range streaming lỗi, chuyển sang tải trọn gói dự phòng:', rangeErr);
    // Kênh 2: Dự phòng tải trực tiếp ArrayBuffer qua fetch (tương thích 100% iOS Safari / mạng di động)
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} khi tải tệp PDF`);
    const buf = await res.arrayBuffer();
    const fallbackTask = pdfjsLib.getDocument({
      ...baseParams,
      data: new Uint8Array(buf),
    });
    return await fallbackTask.promise;
  }
}

/**
 * Render một trang cụ thể của PDF lên thẻ <canvas> với độ phân giải sắc nét,
 * tự động vừa khít cả chiều rộng lẫn chiều cao khung nhìn và bảo vệ giới hạn bộ nhớ Canvas trên iOS/Mobile.
 */
export async function renderPdfPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ width: number; height: number }> {
  if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
    throw new Error(`Trang ${pageNumber} vượt quá giới hạn (1 - ${pdfDoc.numPages})`);
  }

  // Hủy tác vụ render cũ trên cùng canvas nếu người dùng lật trang liên tục
  const existingTask = activeRenderTasks.get(canvas);
  if (existingTask) {
    try {
      existingTask.cancel();
    } catch {}
    activeRenderTasks.delete(canvas);
  }

  const page = await pdfDoc.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1.0 });

  // Tính kích thước hiển thị CSS vừa khít cả maxWidth lẫn maxHeight (bảo toàn tỷ lệ trang gốc)
  let cssWidth = baseViewport.width;
  let cssHeight = baseViewport.height;

  if (maxWidth && maxHeight) {
    const scaleByW = maxWidth / baseViewport.width;
    const scaleByH = maxHeight / baseViewport.height;
    const fitScale = Math.min(scaleByW, scaleByH);
    cssWidth = Math.max(120, Math.floor(baseViewport.width * fitScale));
    cssHeight = Math.max(160, Math.floor(baseViewport.height * fitScale));
  } else if (maxWidth) {
    const scaleByW = maxWidth / baseViewport.width;
    cssWidth = Math.max(120, Math.floor(baseViewport.width * scaleByW));
    cssHeight = Math.max(160, Math.floor(baseViewport.height * scaleByW));
  }

  // Giới hạn DPR tối đa 2 và kích thước pixel tối đa 3200px để tránh tràn bộ nhớ Canvas trên iOS Safari / Android
  const rawDpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  let effectiveDpr = Math.min(rawDpr, 2);
  const maxPixelSide = 3200;
  if (cssWidth * effectiveDpr > maxPixelSide || cssHeight * effectiveDpr > maxPixelSide) {
    effectiveDpr = Math.min(effectiveDpr, maxPixelSide / Math.max(cssWidth, cssHeight));
  }

  const renderScale = (cssWidth / baseViewport.width) * effectiveDpr;
  const viewport = page.getViewport({ scale: renderScale });

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  // CSS style width/height (hiển thị thực tế sắc nét)
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context not available');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const renderTask = page.render({
    canvasContext: context,
    viewport,
  });
  activeRenderTasks.set(canvas, renderTask);

  try {
    await renderTask.promise;
  } catch (err: any) {
    // Bỏ qua lỗi RenderingCancelledException bình thường khi lật trang nhanh
    if (err?.name === 'RenderingCancelledException') {
      return { width: cssWidth, height: cssHeight };
    }
    throw err;
  } finally {
    if (activeRenderTasks.get(canvas) === renderTask) {
      activeRenderTasks.delete(canvas);
    }
  }

  return {
    width: cssWidth,
    height: cssHeight,
  };
}
