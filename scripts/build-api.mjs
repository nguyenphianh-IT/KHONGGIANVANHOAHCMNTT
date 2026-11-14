/**
 * Build script to bundle Vercel Serverless Functions into self-contained JavaScript bundles
 * Eliminates ERR_MODULE_NOT_FOUND and missing relative imports in AWS Lambda runtime.
 */

import { build } from 'esbuild';
import path from 'path';

const endpoints = [
  'api/rag/health.ts',
  'api/rag/query.ts',
  'api/rag/search.ts',
  'api/rag/documents.ts',
  'api/rag/documents/[id].ts',
  'api/rag/documents/[id]/approve.ts',
  'api/rag/documents/[id]/reprocess.ts',
  'api/rag/feedback.ts',
  'api/rag/analytics.ts'
];

async function bundleApi() {
  console.log('[build-api] Bundling Serverless Functions with esbuild...');

  for (const entry of endpoints) {
    const outfile = entry.replace(/\.ts$/, '.js');
    console.log(`  Bundling ${entry} -> ${outfile}`);
    await build({
      entryPoints: [entry],
      outfile: outfile,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      packages: 'external',
      logLevel: 'error'
    });
  }

  console.log('[build-api] Successfully bundled all serverless endpoints.');
}

bundleApi().catch(err => {
  console.error('[build-api] Error bundling endpoints:', err);
  process.exit(1);
});
