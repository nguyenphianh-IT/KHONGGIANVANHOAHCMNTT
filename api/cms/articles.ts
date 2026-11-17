import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleGetCmsArticles,
  handleSaveCmsArticle,
  handleDeleteCmsArticle,
} from '../../src/lib/cmsBackend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await handleGetCmsArticles();
      return res.status(result.success ? 200 : 500).json(result);
    }

    if (req.method === 'POST') {
      const articlePayload = req.body?.article || req.body;
      const result = await handleSaveCmsArticle(articlePayload);
      return res.status(result.success ? 200 : 400).json(result);
    }

    if (req.method === 'DELETE') {
      const id = (req.query?.id as string) || req.body?.id;
      const result = await handleDeleteCmsArticle(id);
      return res.status(result.success ? 200 : 400).json(result);
    }

    return res.status(405).json({ success: false, error: 'Phương thức không được hỗ trợ (Method Not Allowed)' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Lỗi xử lý máy chủ' });
  }
}
