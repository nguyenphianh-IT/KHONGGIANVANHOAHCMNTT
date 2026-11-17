/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * MODULE: CLIENT-SIDE AUDIO UPLOADER TO CLOUD STORAGE (BĂNG GHI ÂM TƯ LIỆU)
 * ==============================================================================
 * Tải trực tiếp tệp âm thanh của người dùng lên Supabase Storage CDN bằng Signed URL.
 * Loại bỏ hoàn toàn chuỗi Base64 gây tràn localStorage (5MB) và lỗi Vercel HTTP 413.
 */

export interface AudioUploadResult {
  success: boolean;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  duration?: string;
  error?: string;
}

/**
 * Đo thời lượng tệp âm thanh (phút:giây)
 */
export function getAudioDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (audio.duration && !isNaN(audio.duration)) {
          const totalSecs = Math.floor(audio.duration);
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          resolve(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        } else {
          resolve('03:00');
        }
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('03:00');
      };
    } catch {
      resolve('03:00');
    }
  });
}

/**
 * Tải trực tiếp tệp âm thanh lên Supabase Cloud Storage
 */
export async function uploadAudioToCloud(file: File): Promise<AudioUploadResult> {
  try {
    const duration = await getAudioDuration(file);

    // 1. Lấy Signed Upload URL từ serverless endpoint
    const res = await fetch(`/api/cms/upload-pdf?fileName=${encodeURIComponent(file.name)}&type=audio`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Lỗi máy chủ khi cấp quyền tải âm thanh (HTTP ${res.status})`);
    }

    const { success, signedUploadUrl, publicUrl, error } = await res.json();
    if (!success || !signedUploadUrl) {
      throw new Error(error || 'Không nhận được đường dẫn tải âm thanh từ Cloud Storage');
    }

    // 2. Tải trực tiếp tệp âm thanh qua method PUT lên Supabase Storage CDN
    const contentType = file.type || 'audio/mpeg';
    const uploadRes = await fetch(signedUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Tải tệp âm thanh lên Cloud Storage thất bại (HTTP ${uploadRes.status})`);
    }

    return {
      success: true,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
      duration,
    };
  } catch (err: any) {
    console.warn('[uploadAudioToCloud Warning]', err);
    return {
      success: false,
      publicUrl: '',
      fileName: file.name,
      fileSize: file.size,
      error: err?.message || 'Lỗi kết nối khi tải tệp âm thanh lên Cloud Storage',
    };
  }
}
