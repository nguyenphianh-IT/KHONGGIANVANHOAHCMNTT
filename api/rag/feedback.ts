import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleFeedbackRoute } from '../../src/rag/api/ragRoutes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const result = await handleFeedbackRoute(req.body);
    return res.status(result.statusCode).json(result);
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
