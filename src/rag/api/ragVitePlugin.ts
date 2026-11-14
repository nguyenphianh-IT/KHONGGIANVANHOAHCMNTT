/**
 * ADR-002: Vite Dev Server Middleware Plugin for RAG API (Phase 01 & Phase 02)
 * Enables full /api/rag/* endpoints directly within `npm run dev`.
 */

import type { Plugin, ViteDevServer } from 'vite';
import {
  handleQueryRoute,
  handleSearchRoute,
  handleHealthRoute,
  handleGetDocumentsRoute,
  handlePostDocumentRoute,
  handleGetDocumentByIdRoute,
  handlePatchDocumentRoute,
  handleApproveDocumentRoute,
  handleReprocessDocumentRoute,
  handleFeedbackRoute,
  handleAnalyticsRoute
} from './ragRoutes';

export function ragDevApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-rag-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const urlStr = req.url || '';
        if (!urlStr.startsWith('/api/rag/')) {
          return next();
        }

        const parsedUrl = new URL(urlStr, `http://${req.headers?.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const authHeader = req.headers?.authorization;
        const roleHeader = req.headers?.['x-user-role'];

        try {
          // 1. Health
          if (pathname === '/api/rag/health' && req.method === 'GET') {
            const result = await handleHealthRoute();
            res.statusCode = result.statusCode;
            res.end(JSON.stringify(result));
            return;
          }

          // 2. Search
          if (pathname === '/api/rag/search' && req.method === 'GET') {
            const result = await handleSearchRoute(parsedUrl.searchParams);
            res.statusCode = result.statusCode;
            res.end(JSON.stringify(result));
            return;
          }

          // 3. Documents collection (GET / POST)
          if (pathname === '/api/rag/documents') {
            if (req.method === 'GET') {
              const status = parsedUrl.searchParams.get('status') || undefined;
              const result = await handleGetDocumentsRoute(status, authHeader, roleHeader);
              res.statusCode = result.statusCode;
              res.end(JSON.stringify(result));
              return;
            }

            if (req.method === 'POST') {
              let bodyText = '';
              req.on('data', (chunk: any) => { bodyText += chunk; });
              req.on('end', async () => {
                try {
                  const body = bodyText ? JSON.parse(bodyText) : {};
                  const result = await handlePostDocumentRoute(body, authHeader, roleHeader);
                  res.statusCode = result.statusCode;
                  res.end(JSON.stringify(result));
                } catch (e: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, statusCode: 400, error: 'JSON không hợp lệ' }));
                }
              });
              return;
            }
          }

          // 4. Single Document Sub-routes: /api/rag/documents/:id, /approve, /reprocess
          const approveMatch = pathname.match(/^\/api\/rag\/documents\/([^/]+)\/approve$/);
          if (approveMatch && req.method === 'POST') {
            const docId = decodeURIComponent(approveMatch[1]);
            let bodyText = '';
            req.on('data', (chunk: any) => { bodyText += chunk; });
            req.on('end', async () => {
              try {
                const body = bodyText ? JSON.parse(bodyText) : {};
                const result = await handleApproveDocumentRoute(docId, body, authHeader, roleHeader);
                res.statusCode = result.statusCode;
                res.end(JSON.stringify(result));
              } catch (e: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, statusCode: 400, error: 'JSON không hợp lệ' }));
              }
            });
            return;
          }

          const reprocessMatch = pathname.match(/^\/api\/rag\/documents\/([^/]+)\/reprocess$/);
          if (reprocessMatch && req.method === 'POST') {
            const docId = decodeURIComponent(reprocessMatch[1]);
            const result = await handleReprocessDocumentRoute(docId, authHeader, roleHeader);
            res.statusCode = result.statusCode;
            res.end(JSON.stringify(result));
            return;
          }

          const singleDocMatch = pathname.match(/^\/api\/rag\/documents\/([^/]+)$/);
          if (singleDocMatch) {
            const docId = decodeURIComponent(singleDocMatch[1]);
            if (req.method === 'GET') {
              const result = await handleGetDocumentByIdRoute(docId, authHeader, roleHeader);
              res.statusCode = result.statusCode;
              res.end(JSON.stringify(result));
              return;
            }
            if (req.method === 'PATCH') {
              let bodyText = '';
              req.on('data', (chunk: any) => { bodyText += chunk; });
              req.on('end', async () => {
                try {
                  const body = bodyText ? JSON.parse(bodyText) : {};
                  const result = await handlePatchDocumentRoute(docId, body, authHeader, roleHeader);
                  res.statusCode = result.statusCode;
                  res.end(JSON.stringify(result));
                } catch (e: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, statusCode: 400, error: 'JSON không hợp lệ' }));
                }
              });
              return;
            }
          }

          // 5. User Feedback (POST /api/rag/feedback)
          if (pathname === '/api/rag/feedback' && req.method === 'POST') {
            let bodyText = '';
            req.on('data', (chunk: any) => { bodyText += chunk; });
            req.on('end', async () => {
              try {
                const body = bodyText ? JSON.parse(bodyText) : {};
                const result = await handleFeedbackRoute(body);
                res.statusCode = result.statusCode;
                res.end(JSON.stringify(result));
              } catch (e: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, statusCode: 400, error: 'JSON không hợp lệ' }));
              }
            });
            return;
          }

          // 6. Analytics Dashboard (GET /api/rag/analytics)
          if (pathname === '/api/rag/analytics' && req.method === 'GET') {
            const result = await handleAnalyticsRoute(authHeader, roleHeader);
            res.statusCode = result.statusCode;
            res.end(JSON.stringify(result));
            return;
          }

          // 5. Query
          if (pathname === '/api/rag/query' && req.method === 'POST') {
            let bodyText = '';
            req.on('data', (chunk: any) => {
              bodyText += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = bodyText ? JSON.parse(bodyText) : {};
                const result = await handleQueryRoute(parsedBody);
                res.statusCode = result.statusCode;
                res.end(JSON.stringify(result));
              } catch (parseErr: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  statusCode: 400,
                  error: 'Dữ liệu JSON gửi lên không hợp lệ.'
                }));
              }
            });
            return;
          }

          // Unmatched /api/rag route
          res.statusCode = 404;
          res.end(JSON.stringify({
            success: false,
            statusCode: 404,
            error: `Endpoint ${pathname} không tồn tại.`
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({
            success: false,
            statusCode: 500,
            error: err?.message || 'Lỗi máy chủ nội bộ'
          }));
        }
      });
    }
  };
}
