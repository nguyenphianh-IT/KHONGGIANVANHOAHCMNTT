/**
 * ADR-002 Phase 02: Deployable Standalone RAG Backend Server
 * Native Node.js HTTP server for self-hosting, staging, or containerized deployment.
 * Port configurable via process.env.PORT or process.env.RAG_PORT (default: 3001).
 */

import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

// Load environment variables if .env.local exists
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const PORT = parseInt(process.env.RAG_PORT || process.env.PORT || '3001', 10);
const HOST = process.env.RAG_HOST || '0.0.0.0';

console.log('==============================================================================');
console.log('ADR-002: DEPLOYABLE RAG BACKEND SERVER (PHASE 02)');
console.log('PROJECT: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - THCS NGUYỄN TRUNG TRỰC');
console.log(`STATUS: Starting server on http://${HOST}:${PORT}`);
console.log('==============================================================================');

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!pathname.startsWith('/api/rag/')) {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found. RAG API is mounted at /api/rag/*' }));
    return;
  }

  // Read request body if POST or PATCH
  let body = {};
  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawText = Buffer.concat(chunks).toString('utf-8');
      if (rawText.trim()) {
        body = JSON.parse(rawText);
      }
    } catch (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, statusCode: 400, error: 'Invalid JSON body' }));
      return;
    }
  }

  const authHeader = req.headers.authorization;
  const roleHeader = req.headers['x-user-role'];

  // Route Dispatching
  try {
    // Health Check
    if (pathname === '/api/rag/health' && req.method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        statusCode: 200,
        data: {
          status: 'healthy',
          backend: 'Standalone Node.js Server',
          timestamp: new Date().toISOString()
        }
      }));
      return;
    }

    // Default response for standalone server root
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      statusCode: 200,
      message: 'RAG Deployable Server is running',
      endpoints: [
        'POST /api/rag/query',
        'GET  /api/rag/search?q=...',
        'GET  /api/rag/health',
        'GET  /api/rag/documents',
        'POST /api/rag/documents'
      ]
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, statusCode: 500, error: err?.message || 'Internal Server Error' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[RAG Server] Listening on http://${HOST}:${PORT}`);
});
