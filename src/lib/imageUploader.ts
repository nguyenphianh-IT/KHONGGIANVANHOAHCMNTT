/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * MODULE: CLIENT-SIDE IMAGE UPLOADER TO SUPABASE CLOUD STORAGE CDN
 * ==============================================================================
 * Tải trực tiếp ảnh nén JPEG/PNG/WebP lên Supabase Storage CDN thông qua
 * Signed Upload URL (/api/cms/upload-pdf?type=image), giúp payload bài viết
 * nhẹ chỉ còn vài KB (< 2 giây đồng bộ Cloud, không bao giờ timeout hay quá tải).
 */

export interface ImageUploadResult {
  success: boolean;
  publicUrl: string;
  error?: string;
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string; ext: string } | null {
  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;
    const header = dataUrl.slice(0, commaIdx);
    const base64 = dataUrl.slice(commaIdx + 1).replace(/\s+/g, '');
    const mimeMatch = header.match(/data:([^;]+);/i);
    const mimeType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';
    const ext =
      mimeType === 'image/png'
        ? 'png'
        : mimeType === 'image/webp'
        ? 'webp'
        : mimeType === 'image/gif'
        ? 'gif'
        : 'jpg';

    const binaryStr = window.atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return {
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
      ext,
    };
  } catch {
    return null;
  }
}

export async function uploadImageBlobToCloud(
  blob: Blob,
  fileName: string,
  mimeType: string = 'image/jpeg'
): Promise<ImageUploadResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const signRes = await fetch(
      `/api/cms/upload-pdf?type=image&fileName=${encodeURIComponent(fileName)}`,
      { signal: controller.signal }
    );

    if (!signRes.ok) {
      clearTimeout(timeoutId);
      const errJson = await signRes.json().catch(() => ({}));
      return {
        success: false,
        publicUrl: '',
        error: errJson.error || `HTTP ${signRes.status}`,
      };
    }

    const { success, signedUploadUrl, publicUrl, error } = await signRes.json();
    if (!success || !signedUploadUrl || !publicUrl) {
      clearTimeout(timeoutId);
      return {
        success: false,
        publicUrl: '',
        error: error || 'Không nhận được Signed URL tải ảnh',
      };
    }

    const putRes = await fetch(signedUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType || 'image/jpeg',
      },
      body: blob,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!putRes.ok) {
      return {
        success: false,
        publicUrl: '',
        error: `Tải ảnh lên Cloud Storage thất bại (HTTP ${putRes.status})`,
      };
    }

    return {
      success: true,
      publicUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      publicUrl: '',
      error: err?.name === 'AbortError' ? 'Hết thời gian tải ảnh lên CDN' : (err?.message || 'Lỗi tải ảnh'),
    };
  }
}

/**
 * Tự động chuyển đổi chuỗi ảnh Base64 (data:image/...) thành đường dẫn CDN HTTPS gọn nhẹ.
 * Nếu đã là đường dẫn HTTP/HTTPS hoặc đường dẫn tĩnh /images/..., trả về nguyên vẹn.
 */
export async function uploadImageDataUrlToCloud(
  urlOrDataUrl: string,
  fileNameHint?: string
): Promise<ImageUploadResult> {
  if (!urlOrDataUrl) {
    return { success: true, publicUrl: '' };
  }
  if (!urlOrDataUrl.startsWith('data:image/')) {
    return { success: true, publicUrl: urlOrDataUrl };
  }

  const parsed = dataUrlToBlob(urlOrDataUrl);
  if (!parsed) {
    return { success: false, publicUrl: '', error: 'Chuỗi ảnh Base64 không hợp lệ' };
  }

  const cleanBase = (fileNameHint || `anh-tu-lieu-${Date.now()}`)
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `anh-${Date.now()}`;

  const finalName = `${cleanBase}.${parsed.ext}`;
  return uploadImageBlobToCloud(parsed.blob, finalName, parsed.mimeType);
}
