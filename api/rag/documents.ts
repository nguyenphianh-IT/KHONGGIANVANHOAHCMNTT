import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGetDocumentsRoute, handlePostDocumentRoute } from '../../src/rag/api/ragRoutes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const status = req.query.status as string | undefined;
    const result = await handleGetDocumentsRoute(status);
    return res.status(result.statusCode).json(result);
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const roleHeader = req.headers['x-user-role'] as string | undefined;
    const result = await handlePostDocumentRoute(req.body, authHeader, roleHeader);
    return res.status(result.statusCode).json(result);
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
