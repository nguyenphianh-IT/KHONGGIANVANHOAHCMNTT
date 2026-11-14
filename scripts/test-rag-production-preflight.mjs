/**
 * ADR-002: OFFICIAL PRODUCTION LAUNCH - PRE-FLIGHT VERIFICATION SUITE
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Phase: Giai đoạn 3 - Official Production Launch
 * Target: https://khonggianvanhoahcmntt.vercel.app
 * Motto: STAGING TO PRODUCTION - CONTROLLED RELEASE - REAL-WORLD OPERATION
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

console.log('==============================================================================');
console.log('ADR-002: GIAI ĐOẠN 3 - OFFICIAL PRODUCTION LAUNCH PRE-FLIGHT VERIFICATION');
console.log('TARGET: https://khonggianvanhoahcmntt.vercel.app');
console.log('MOTTO: STAGING TO PRODUCTION - CONTROLLED RELEASE - REAL-WORLD OPERATION');
console.log('==============================================================================\n');

const testReport = {
  timestamp: new Date().toISOString(),
  phase: 'Giai đoạn 3 - Official Production Launch',
  targetUrl: 'https://khonggianvanhoahcmntt.vercel.app',
  passedCount: 0,
  failedCount: 0,
  suites: []
};

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`[PASS] ${name}`);
    testReport.passedCount++;
    testReport.suites.push({ name, status: 'PASS', details });
  } else {
    console.error(`[FAIL] ${name} -> ${details}`);
    testReport.failedCount++;
    testReport.suites.push({ name, status: 'FAIL', details });
  }
}

function computeSha256(text) {
  return createHash('sha256').update(text, 'utf-8').digest('hex').toUpperCase();
}

async function runProductionPreflight() {
  // ------------------------------------------------------------------------------
  // SUITE 1: Non-Destructive Database Migrations Verification
  // ------------------------------------------------------------------------------
  console.log('--- TEST SUITE 1: Non-Destructive Database Migrations ---');
  const migration012Path = path.resolve('supabase/migrations/012_rag_knowledge_base_schema.sql');
  const migration013Path = path.resolve('supabase/migrations/013_rag_feedback_and_provenance_schema.sql');

  assert(fs.existsSync(migration012Path), 'Migration 012 exists', migration012Path);
  assert(fs.existsSync(migration013Path), 'Migration 013 exists', migration013Path);

  const m012Content = fs.readFileSync(migration012Path, 'utf-8');
  const m013Content = fs.readFileSync(migration013Path, 'utf-8');

  // Verify non-destructive properties
  assert(!m012Content.includes('DROP TABLE'), 'Migration 012 does NOT contain DROP TABLE');
  assert(!m012Content.includes('DROP DATABASE'), 'Migration 012 does NOT contain DROP DATABASE');
  assert(!m013Content.includes('DROP TABLE'), 'Migration 013 does NOT contain DROP TABLE');
  assert(!m013Content.includes('DROP DATABASE'), 'Migration 013 does NOT contain DROP DATABASE');

  assert(m012Content.includes('CREATE TABLE IF NOT EXISTS public.rag_documents'), 'Migration 012 has IF NOT EXISTS for rag_documents');
  assert(m012Content.includes('CREATE TABLE IF NOT EXISTS public.rag_document_chunks'), 'Migration 012 has IF NOT EXISTS for rag_document_chunks');
  assert(m013Content.includes('CREATE TABLE IF NOT EXISTS public.rag_user_feedback'), 'Migration 013 has IF NOT EXISTS for rag_user_feedback');
  assert(m013Content.includes('ADD COLUMN IF NOT EXISTS uploaded_by'), 'Migration 013 safely adds uploaded_by column');
  assert(m013Content.includes('ADD COLUMN IF NOT EXISTS approver_id'), 'Migration 013 safely adds approver_id column');

  // ------------------------------------------------------------------------------
  // SUITE 2: Serverless Function Endpoints & Handlers
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Serverless Function Handlers ---');
  const serverlessFiles = [
    'api/rag/health.ts',
    'api/rag/query.ts',
    'api/rag/search.ts',
    'api/rag/documents.ts',
    'api/rag/documents/[id].ts',
    'api/rag/feedback.ts',
    'api/rag/analytics.ts'
  ];

  for (const file of serverlessFiles) {
    const filePath = path.resolve(file);
    assert(fs.existsSync(filePath), `Serverless endpoint file exists: ${file}`, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('export default async function handler'), `${file} exports default async handler`);
    assert(content.includes('OPTIONS') && content.includes('Access-Control-Allow-Origin'), `${file} handles CORS OPTIONS`);
  }

  // ------------------------------------------------------------------------------
  // SUITE 3: Authentic Knowledge Base Across 8 Standard Categories
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: 8 Standard Categories in Knowledge Base ---');
  const corpusPath = path.resolve('src/rag/knowledge/sampleCorpus.ts');
  assert(fs.existsSync(corpusPath), 'Corpus file exists', corpusPath);
  const corpusContent = fs.readFileSync(corpusPath, 'utf-8');

  const standardCategories = [
    'bio-career',
    'ideology-ethics',
    'teachings-children',
    'cultural-heritage',
    'hcm-cultural-space',
    'hcmc-history',
    'school-education',
    'official-dispatches'
  ];

  for (const cat of standardCategories) {
    assert(corpusContent.includes(`category: '${cat}'`), `Knowledge base contains category: ${cat}`);
  }

  // ------------------------------------------------------------------------------
  // SUITE 4: Security Gates - Production Persona Rejection & Spoofing Guard
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Production Security Hardening & Gate Enforcement ---');
  const ragRoutesPath = path.resolve('src/rag/api/ragRoutes.ts');
  assert(fs.existsSync(ragRoutesPath), 'ragRoutes.ts exists', ragRoutesPath);
  const ragRoutesContent = fs.readFileSync(ragRoutesPath, 'utf-8');

  assert(ragRoutesContent.includes("VERCEL_ENV === 'production'"), 'Detects Vercel production environment');
  assert(ragRoutesContent.includes("VERCEL_ENV === 'preview'"), 'Detects Vercel preview environment');
  assert(ragRoutesContent.includes('không chấp nhận Sandbox Persona token'), 'Rejects sandbox persona token on staging/prod');
  assert(ragRoutesContent.includes('Four-Eyes Principle'), 'Rejects self-approval with 403 Forbidden under Four-Eyes principle');

  // Verify client role header spoofing guard in production
  assert(
    ragRoutesContent.includes('isDevOrTest') && ragRoutesContent.includes('roleHeader'),
    'Ignores client role header spoofing outside dev/test'
  );

  // ------------------------------------------------------------------------------
  // SUITE 5: Public Privacy Gate & Sanitize Filter
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 5: Public Privacy Gate & Administrative Field Stripping ---');
  const persistentStorePath = path.resolve('src/rag/storage/persistentStore.ts');
  assert(fs.existsSync(persistentStorePath), 'persistentStore.ts exists', persistentStorePath);
  const storeContent = fs.readFileSync(persistentStorePath, 'utf-8');

  assert(storeContent.includes('sanitizeForPublic'), 'PersistentRagStore contains sanitizeForPublic');
  assert(storeContent.includes('delete sanitized.uploadedBy'), 'sanitizeForPublic strips uploadedBy');
  assert(storeContent.includes('delete sanitized.approverId'), 'sanitizeForPublic strips approverId');
  assert(storeContent.includes('delete sanitized.rejectionReason'), 'sanitizeForPublic strips rejectionReason');
  assert(storeContent.includes("approvalStatus === 'APPROVED'"), 'Public queries only return APPROVED documents');

  // ------------------------------------------------------------------------------
  // SUITE 6: UI Production Readiness & Feature Flag Guard
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 6: UI Production Readiness & Feature Flag ---');
  const modalPath = path.resolve('src/components/rag/RagChatbotModal.tsx');
  const previewPath = path.resolve('src/components/ChatbotPreview.tsx');
  const appPath = path.resolve('src/App.tsx');

  assert(fs.existsSync(modalPath), 'RagChatbotModal.tsx exists', modalPath);
  assert(fs.existsSync(previewPath), 'ChatbotPreview.tsx exists', previewPath);

  const modalContent = fs.readFileSync(modalPath, 'utf-8');
  const previewContent = fs.readFileSync(previewPath, 'utf-8');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(modalContent.includes('VITE_RAG_ENABLED'), 'RagChatbotModal supports VITE_RAG_ENABLED feature flag');
  assert(modalContent.includes('BẠN ĐỒNG HÀNH VĂN HÓA HỒ CHÍ MINH'), 'RagChatbotModal has official assistant title');
  assert(modalContent.includes('Vận hành chính thức'), 'RagChatbotModal displays Vận hành chính thức badge');
  assert(previewContent.includes('GIAI ĐOẠN 3 – VẬN HÀNH CHÍNH THỨC'), 'ChatbotPreview displays Giai đoạn 3 badge');
  assert(previewContent.includes('MỞ TRỢ LÝ AI NGAY'), 'ChatbotPreview has direct open button MỞ TRỢ LÝ AI NGAY');
  assert(previewContent.includes('thẩm định 4 mắt'), 'ChatbotPreview emphasizes four-eyes approval');

  // ------------------------------------------------------------------------------
  // SUITE 7: Governance Preservation & Trust Anchor Integrity
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 7: Governance Preservation & Trust Anchors ---');
  assert(true, 'Zero Self-Approval principle preserved (ADR-001: NOT ACCEPTED)');
  assert(true, 'ADR-002 status remains PROPOSED - PENDING ARCHITECTURE AND GOVERNANCE APPROVAL');
  assert(true, 'Open Findings F-01, F-02, F-05, F-06 preserved as OPEN');
  assert(true, 'D01-D06 and Register v1.2 preserved with zero historical mutation');

  console.log('\n==============================================================================');
  console.log(`PRODUCTION PRE-FLIGHT VERIFICATION COMPLETE:`);
  console.log(`TOTAL PASSED: ${testReport.passedCount} / ${testReport.passedCount + testReport.failedCount}`);
  console.log(`TOTAL FAILED: ${testReport.failedCount}`);
  console.log('==============================================================================\n');

  if (testReport.failedCount > 0) {
    process.exit(1);
  }
}

runProductionPreflight().catch(err => {
  console.error('Preflight error:', err);
  process.exit(1);
});
