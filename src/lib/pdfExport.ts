/**
 * Tiện ích xuất nội dung HTML sang tệp PDF chuẩn A4 (hỗ trợ đa trang & tiếng Việt đầy đủ).
 * Nạp động (lazy-load) html2canvas và jspdf để không làm nặng thời gian tải trang ban đầu.
 */

export interface ExportPdfOptions {
  element: HTMLElement;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  marginMm?: number;
}

const sanitizePdfFilename = (rawName: string): string => {
  const normalized = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const base = normalized || 'tai-lieu-khong-gian-van-hoa-hcm';
  return base.endsWith('.pdf') ? base : `${base}.pdf`;
};

export async function exportElementToPdf({
  element,
  filename,
  orientation = 'portrait',
  marginMm = 10,
}: ExportPdfOptions): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#FDFBF7',
    logging: false,
    ignoreElements: (el) => el.hasAttribute('data-pdf-ignore'),
  });

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginMm * 2;
  const contentHeight = pageHeight - marginMm * 2;

  const totalImgHeightMm = (canvas.height * contentWidth) / canvas.width;

  // Nếu vừa trong 1 trang A4 (ví dụ: Giấy chứng nhận hoặc bài viết ngắn)
  if (totalImgHeightMm <= contentHeight) {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', marginMm, marginMm, contentWidth, totalImgHeightMm, undefined, 'FAST');
  } else {
    // Cắt canvas thành từng lát theo chiều cao vùng in A4 để không tràn lề trên/dưới
    const pxPerMm = canvas.width / contentWidth;
    const pageSliceHeightPx = Math.floor(contentHeight * pxPerMm);
    let offsetY = 0;
    let pageIdx = 0;

    while (offsetY < canvas.height) {
      const sliceHeight = Math.min(pageSliceHeightPx, canvas.height - offsetY);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FDFBF7';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          offsetY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );
      }

      if (pageIdx > 0) {
        pdf.addPage();
      }

      const sliceHeightMm = sliceHeight / pxPerMm;
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', marginMm, marginMm, contentWidth, sliceHeightMm, undefined, 'FAST');

      offsetY += sliceHeight;
      pageIdx += 1;
    }
  }

  pdf.save(sanitizePdfFilename(filename));
}
