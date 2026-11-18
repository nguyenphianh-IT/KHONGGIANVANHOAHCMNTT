import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleGetCmsMedia,
  handleSaveCmsMedia,
  handleDeleteCmsMedia,
  handleGetDepartments,
  handleSaveDepartments,
  handleAdminListStaff,
  handleAdminUpdateStaff,
  verifyAdminFromAuthHeader,
} from '../../src/lib/cmsBackend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const resource = (req.query.resource as string) || '';

    // ------------------------------------------------------------------------
    // ROUTE A: QUẢN LÝ DANH MỤC TỔ CHUYÊN MÔN (?resource=departments)
    // ------------------------------------------------------------------------
    if (resource === 'departments') {
      if (req.method === 'GET') {
        const result = await handleGetDepartments();
        return res.status(result.success ? 200 : 500).json(result);
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        const authCheck = await verifyAdminFromAuthHeader(req.headers.authorization);
        if (!authCheck.authorized) {
          return res.status(403).json({ success: false, error: authCheck.error });
        }
        const body = req.body || {};
        const result = await handleSaveDepartments(
          body.departments,
          body.renameFrom,
          body.renameTo
        );
        return res.status(result.success ? 200 : 400).json(result);
      }

      return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // ------------------------------------------------------------------------
    // ROUTE B: QUẢN TRỊ & SỬA THÔNG TIN TÀI KHOẢN GIÁO VIÊN (?resource=staff)
    // ------------------------------------------------------------------------
    if (resource === 'staff') {
      const authCheck = await verifyAdminFromAuthHeader(req.headers.authorization);
      if (!authCheck.authorized || !authCheck.userId) {
        return res.status(403).json({ success: false, error: authCheck.error });
      }

      if (req.method === 'GET') {
        const result = await handleAdminListStaff();
        return res.status(result.success ? 200 : 500).json(result);
      }

      if (req.method === 'PUT' || req.method === 'POST') {
        const body = req.body || {};
        const payload = body.staff || body;
        const result = await handleAdminUpdateStaff(payload, authCheck.userId);
        return res.status(result.success ? 200 : 400).json(result);
      }

      return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // ------------------------------------------------------------------------
    // ROUTE MẶC ĐỊNH: KHO MEDIA TƯ LIỆU SỐ HÓA
    // ------------------------------------------------------------------------
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
