/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * API: UPLOAD AUDIO FILE HANDLER & SIGNED URL SERVICE (SUPABASE STORAGE)
 * ==============================================================================
 * Cung cấp signed upload URL cho tệp âm thanh (mp3, wav, m4a, ogg, aac)
 * Cho phép trình duyệt đẩy trực tiếp lên Supabase Storage CDN, loại bỏ hoàn toàn
 * Base64 payload nặng nề gây tràn bộ nhớ và sập Vercel 4.5MB.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../../src/lib/supabaseBackend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return res.status(500).json({
      success: false,
      error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên máy chủ'
    });
  }

  try {
    // 1. Kiểm tra bucket lưu trữ âm thanh: ưu tiên bucket 'audio', fallback sang 'documents'
    const { data: buckets } = await admin.storage.listBuckets();
    let targetBucket = 'audio';

    const hasAudioBucket = buckets?.some((b) => b.name === 'audio');
    if (!hasAudioBucket) {
      const { error: createErr } = await admin.storage.createBucket('audio', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      if (createErr) {
        console.warn('[Upload Audio] Không thể tạo bucket audio riêng biệt, dùng bucket documents:', createErr.message);
        targetBucket = 'documents';
      }
    }

    // 2. Tạo Signed Upload URL cho tệp âm thanh của người dùng
    const rawFileName = (req.query?.fileName as string) || (req.body?.fileName as string) || `bang-ghi-am-${Date.now()}.mp3`;

    // Chuẩn hóa tên file an toàn (loại bỏ dấu tiếng Việt và ký tự đặc biệt)
    const sanitizedFileName = rawFileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const uniquePrefix = Date.now().toString(36);
    const filePath = targetBucket === 'audio' 
      ? `recordings/${uniquePrefix}_${sanitizedFileName}`
      : `audio/${uniquePrefix}_${sanitizedFileName}`;

    const { data: signedData, error: signErr } = await admin.storage
      .from(targetBucket)
      .createSignedUploadUrl(filePath);

    if (signErr || !signedData?.signedUrl) {
      return res.status(500).json({
        success: false,
        error: `Không thể tạo đường dẫn tải âm thanh: ${signErr?.message || 'Lỗi Supabase Storage'}`
      });
    }

    const { data: publicData } = admin.storage
      .from(targetBucket)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      bucket: targetBucket,
      filePath,
      signedUploadUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
      fileName: rawFileName
    });
  } catch (err: any) {
    console.error('[Upload Audio API Exception]', err);
    return res.status(500).json({
      success: false,
      error: `Lỗi máy chủ lưu trữ âm thanh: ${err.message || String(err)}`
    });
  }
}
