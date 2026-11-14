import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSearchRoute } from '../../src/rag/api/ragRoutes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await handleSearchRoute(req.query as Record<string, string>);
  return res.status(result.statusCode).json(result);
}
