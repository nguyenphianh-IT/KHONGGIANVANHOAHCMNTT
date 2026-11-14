import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleReprocessDocumentRoute } from '../../../../src/rag/api/ragRoutes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const docId = Array.isArray(id) ? id[0] : id;

  if (!docId) {
    return res.status(400).json({ success: false, error: 'Document ID is required' });
  }

  const authHeader = req.headers.authorization;
  const roleHeader = req.headers['x-user-role'] as string | undefined;
  const result = await handleReprocessDocumentRoute(docId, authHeader, roleHeader);
  return res.status(result.statusCode).json(result);
}
