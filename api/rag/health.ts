import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleHealthRoute } from '../../src/rag/api/ragRoutes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await handleHealthRoute();
  return res.status(result.statusCode).json(result);
}
