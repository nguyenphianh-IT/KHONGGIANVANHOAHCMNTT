/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * API: UPLOAD FILE HANDLER & SIGNED URL SERVICE (SUPABASE STORAGE)
 * ==============================================================================
 * Cấp Signed Upload URL cho tệp PDF và Âm thanh (Audio), cho phép tải trực tiếp
 * từ trình duyệt lên Supabase Storage CDN, vượt qua giới hạn 4.5MB của Vercel.
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
    // 1. Đảm bảo bucket 'documents' đã tồn tại và công khai với dung lượng 50MB
    const { data: buckets } = await admin.storage.listBuckets();
    const docBucket = buckets?.find((b) => b.name === 'documents');
    if (!docBucket) {
      await admin.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
    }

    // 2. Xác định loại tệp: Hình ảnh (Image), Băng ghi âm (Audio) hoặc Sách PDF
    const rawFileName = (req.query?.fileName as string) || (req.body?.fileName as string) || `tai-lieu-${Date.now()}.pdf`;
    
    // Chuẩn hóa tên file an toàn (giữ nguyên tên gốc nhưng loại bỏ dấu tiếng Việt và ký tự đặc biệt)
    const sanitizedFileName = rawFileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const isImage = Boolean(
      sanitizedFileName.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
      req.query?.type === 'image' ||
      req.body?.type === 'image'
    );

    const isAudio = !isImage && Boolean(
      sanitizedFileName.match(/\.(mp3|wav|m4a|ogg|aac)$/i) || 
      req.query?.type === 'audio' || 
      req.body?.type === 'audio'
    );

    const uniquePrefix = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const filePath = isImage
      ? `images/${uniquePrefix}_${sanitizedFileName}`
      : isAudio
      ? `audio/${uniquePrefix}_${sanitizedFileName}`
      : `uploads/${uniquePrefix}_${sanitizedFileName}`;

    const { data: signedData, error: signErr } = await admin.storage
      .from('documents')
      .createSignedUploadUrl(filePath);

    if (signErr || !signedData?.signedUrl) {
      return res.status(500).json({
        success: false,
        error: `Không thể tạo đường dẫn tải tệp: ${signErr?.message || 'Lỗi Supabase Storage'}`
      });
    }

    const { data: publicData } = admin.storage
      .from('documents')
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      filePath,
      signedUploadUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
      fileName: rawFileName,
      isAudio,
      isImage
    });
  } catch (err: any) {
    console.error('[Upload API Exception]', err);
    return res.status(500).json({
      success: false,
      error: `Lỗi máy chủ lưu trữ: ${err.message || String(err)}`
    });
  }
}
