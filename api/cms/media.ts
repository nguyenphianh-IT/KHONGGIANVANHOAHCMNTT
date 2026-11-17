import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGetCmsMedia, handleSaveCmsMedia, handleDeleteCmsMedia } from '../../src/lib/cmsBackend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const id = req.query.id as string | undefined;
      const result = await handleGetCmsMedia(id);
      return res.status(result.success ? 200 : 404).json(result);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const asset = body.asset || body.assets;
      if (!asset) {
        return res.status(400).json({ success: false, error: 'Thiếu dữ liệu asset' });
      }
      const result = await handleSaveCmsMedia(asset);
      return res.status(result.success ? 200 : 500).json(result);
    }

    if (req.method === 'DELETE') {
      const id = (req.query.id as string) || (req.body && req.body.id);
      if (!id) {
        return res.status(400).json({ success: false, error: 'Thiếu mã media' });
      }
      const result = await handleDeleteCmsMedia(id);
      return res.status(result.success ? 200 : 500).json(result);
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
  }
}
