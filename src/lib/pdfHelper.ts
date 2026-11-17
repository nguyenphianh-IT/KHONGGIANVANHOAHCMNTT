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

/**
 * Nạp tài liệu PDF từ URL (Supabase Storage hoặc Data URL)
 */
export async function loadPdfFromUrl(url: string): Promise<any> {
  const loadingTask = pdfjsLib.getDocument({
    url,
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Render một trang cụ thể của PDF lên thẻ <canvas> với độ phân giải sắc nét
 */
export async function renderPdfPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  targetWidth?: number
): Promise<{ width: number; height: number }> {
  if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
    throw new Error(`Trang ${pageNumber} vượt quá giới hạn (1 - ${pdfDoc.numPages})`);
  }

  const page = await pdfDoc.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1.0 });

  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  const scale = targetWidth ? (targetWidth / baseViewport.width) * dpr : dpr;
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // CSS style width/height (hiển thị thực tế)
  canvas.style.width = targetWidth ? `${targetWidth}px` : `${baseViewport.width}px`;
  canvas.style.height = targetWidth ? `${(targetWidth / baseViewport.width) * baseViewport.height}px` : `${baseViewport.height}px`;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context not available');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return {
    width: viewport.width / dpr,
    height: viewport.height / dpr,
  };
}
