/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * MODULE: CLIENT-SIDE PDF UPLOADER TO CLOUD STORAGE (TẢI TỆP GỐC CỦA NGƯỜI DÙNG)
 * ==============================================================================
 */

export interface PdfUploadResult {
  success: boolean;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  error?: string;
}

/**
 * Tải trực tiếp chính xác tệp PDF của người dùng lên Supabase Cloud Storage
 * Tuyệt đối không thay thế hoặc sử dụng tệp tĩnh khác.
 */
export async function uploadPdfToCloud(file: File): Promise<PdfUploadResult> {
  try {
    // 1. Xin cấp quyền và URL tải trực tiếp (Signed Upload URL) từ máy chủ
    const res = await fetch(`/api/cms/upload-pdf?fileName=${encodeURIComponent(file.name)}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Lỗi máy chủ khi khởi tạo tải tệp (HTTP ${res.status})`);
    }

    const { success, signedUploadUrl, publicUrl, error } = await res.json();
    if (!success || !signedUploadUrl) {
      throw new Error(error || 'Không nhận được đường dẫn tải tệp từ Cloud Storage');
    }

    // 2. Tải trực tiếp tệp gốc từ trình duyệt lên Supabase Cloud Storage (bỏ qua giới hạn dung lượng Vercel)
    const uploadRes = await fetch(signedUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Tải tệp lên Cloud Storage thất bại (HTTP ${uploadRes.status})`);
    }

    return {
      success: true,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (err: any) {
    console.warn('[uploadPdfToCloud Warning]', err);
    return {
      success: false,
      publicUrl: '',
      fileName: file.name,
      fileSize: file.size,
      error: err?.message || 'Lỗi kết nối khi tải tệp lên Cloud Storage',
    };
  }
}
