// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// TIỆN ÍCH TỐI ƯU HÓA ẢNH TẢI LÊN CLIENT-SIDE (CHỐNG TREO BROWSER & CHỐNG TRÀN BỘ NHỚ)
// ==============================================================================

export interface OptimizedImageResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export function optimizeImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.72
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Tính toán tỷ lệ co giãn giữ nguyên aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback an toàn
          resolve({
            dataUrl: src,
            sizeBytes: file.size,
            width: img.width,
            height: img.height,
          });
          return;
        }

        // Vẽ ảnh lên canvas ở độ phân giải tối ưu
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ảnh nén JPEG nhẹ (khoảng 30KB - 60KB)
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxBytes = Math.round((optimizedDataUrl.length * 3) / 4);

        resolve({
          dataUrl: optimizedDataUrl,
          sizeBytes: approxBytes,
          width,
          height,
        });
      };

      img.onerror = () => {
        reject(new Error('Tệp hình ảnh không hợp lệ hoặc bị lỗi định dạng.'));
      };

      img.src = src;
    };

    reader.onerror = () => {
      reject(new Error('Không thể đọc tệp từ thiết bị.'));
    };

    reader.readAsDataURL(file);
  });
}
