import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../../src/lib/supabaseBackend';
import { supabase } from '../../src/lib/supabase';

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
      error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server',
      hasAnonKey: Boolean(supabase)
    });
  }

  try {
    // 1. Check existing buckets
    const { data: buckets, error: listErr } = await admin.storage.listBuckets();
    
    // 2. Ensure 'documents' bucket exists
    let docBucket = buckets?.find(b => b.name === 'documents');
    let created = false;
    if (!docBucket) {
      const { data: createData, error: createErr } = await admin.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      if (createErr) {
        console.warn('[CreateBucket Warning]', createErr);
      } else {
        created = true;
      }
    }

    // 3. Test signed upload URL
    const testPath = `uploads/test-${Date.now()}.pdf`;
    const { data: signedData, error: signErr } = await admin.storage.from('documents').createSignedUploadUrl(testPath);
    const { data: publicUrlData } = admin.storage.from('documents').getPublicUrl(testPath);

    return res.status(200).json({
      success: true,
      hasAdmin: true,
      buckets: buckets?.map(b => b.name),
      bucketCreated: created,
      testPath,
      signedUploadUrl: signedData?.signedUrl,
      publicUrl: publicUrlData?.publicUrl,
      signErr: signErr?.message
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Exception during storage test'
    });
  }
}
