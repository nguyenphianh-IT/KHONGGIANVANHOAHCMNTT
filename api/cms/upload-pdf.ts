/**
 * ==============================================================================
 * DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
 * API: UPLOAD PDF FILE HANDLER & SIGNED URL SERVICE (SUPABASE STORAGE)
 * ==============================================================================
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
    // 1. Đảm bảo bucket 'documents' đã tồn tại và công khai
    const { data: buckets } = await admin.storage.listBuckets();
    const docBucket = buckets?.find((b) => b.name === 'documents');
    if (!docBucket) {
      await admin.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
    }

    // 2. Tạo Signed Upload URL cho tệp của người dùng
    const rawFileName = (req.query?.fileName as string) || (req.body?.fileName as string) || `tai-lieu-${Date.now()}.pdf`;
    
    // Chuẩn hóa tên file an toàn (giữ nguyên tên gốc của người dùng nhưng loại bỏ ký tự nguy hiểm)
    const sanitizedFileName = rawFileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const uniquePrefix = Date.now().toString(36);
    const filePath = `uploads/${uniquePrefix}_${sanitizedFileName}`;

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
      fileName: rawFileName
    });
  } catch (err: any) {
    console.error('[Upload PDF API Exception]', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi ngoại lệ khi xử lý tải tệp PDF'
    });
  }
}
