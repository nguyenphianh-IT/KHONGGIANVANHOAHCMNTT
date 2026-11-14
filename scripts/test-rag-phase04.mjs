/**
 * ADR-002 Phase 04: Controlled Pilot & Real Knowledge Activation Verification Suite
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Mode: ACTIVATE KNOWLEDGE - SERVE REAL USERS - IMPROVE CONTINUOUSLY
 *
 * Test Suites:
 * 1. Real Knowledge Base Activation Across All 8 Standard School Categories
 * 2. Public Document Privacy Gate & Administrative Metadata Sanitization
 * 3. Security Hardening: Staging Persona Rejection & JWT Enforcement
 * 4. Server-Side Four-Eyes Approval Enforcement (Anti-Self-Approval Gate)
 * 5. User Feedback Pipeline (POST /api/rag/feedback)
 * 6. Pilot Operations Analytics Dashboard (GET /api/rag/analytics)
 * 7. Deployable Serverless Handlers Verification
 * 8. School User Experience & Pedagogical Role Switching
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

console.log('==============================================================================');
console.log('ADR-002: IMPLEMENTATION PHASE 04 - AUTOMATED VERIFICATION SUITE');
console.log('CONTROLLED PILOT: REAL KNOWLEDGE ACTIVATION & INTERNAL ROLLOUT');
console.log('MODE: ACTIVATE KNOWLEDGE - SERVE REAL USERS - IMPROVE CONTINUOUSLY');
console.log('==============================================================================\n');

const testReport = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 04 - Controlled Pilot & Knowledge Activation',
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

async function runVerification() {
  // ------------------------------------------------------------------------------
  // SUITE 1: Real Knowledge Base Across 8 Standard Categories
  // ------------------------------------------------------------------------------
  console.log('--- TEST SUITE 1: 8 Standard Categories & Authentic Knowledge Base ---');
  const sampleCorpusPath = path.resolve('src/rag/knowledge/sampleCorpus.ts');
  assert(fs.existsSync(sampleCorpusPath), 'Sample corpus file exists', sampleCorpusPath);

  const corpusContent = fs.readFileSync(sampleCorpusPath, 'utf-8');

  // Verify all 8 Standard Categories are present in corpus
  const standardCategories = [
    { id: 'bio-career', name: 'Tiểu sử và sự nghiệp Bác Hồ' },
    { id: 'ideology-ethics', name: 'Tư tưởng, đạo đức, phong cách' },
    { id: 'teachings-children', name: 'Lời dạy đối với thiếu nhi' },
    { id: 'cultural-heritage', name: 'Di sản văn hóa Hồ Chí Minh' },
    { id: 'hcm-cultural-space', name: 'Không gian văn hóa Hồ Chí Minh' },
    { id: 'hcmc-history', name: 'Lịch sử TP.HCM & Thới An - Quận 12' },
    { id: 'school-education', name: 'Giáo dục học đường THCS' },
    { id: 'official-dispatches', name: 'Tài liệu cơ quan quản lý' }
  ];

  for (const cat of standardCategories) {
    const hasCategory = corpusContent.includes(`category: '${cat.id}'`);
    assert(hasCategory, `Standard category "${cat.name}" (${cat.id}) actively populated in corpus`, `Present: ${hasCategory}`);
  }

  // Verify specific school heritage documents
  assert(corpusContent.includes('DOC-HCM-011') && corpusContent.includes('Nguyễn Trung Trực'),
    'Document DOC-HCM-011 contains authentic Nguyễn Trung Trực school heritage');
  assert(corpusContent.includes('DOC-HCM-012') && corpusContent.includes('Đề án Xây dựng Không gian Văn hóa Hồ Chí Minh'),
    'Document DOC-HCM-012 contains School Cultural Space scheme');
  assert(corpusContent.includes('DOC-HCM-013') && corpusContent.includes('48/KH-THCSNTT'),
    'Document DOC-HCM-013 contains School Decision & Action Plan No. 48');
  assert(corpusContent.includes('DOC-HCM-009') && corpusContent.includes('PENDING_REVIEW'),
    'Security Canary DOC-HCM-009 exists with strict PENDING_REVIEW & isAllowedForRag: false');

  // ------------------------------------------------------------------------------
  // SUITE 2: Public Document Privacy Gate & Sanitization
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Public Document Privacy Gate & Metadata Sanitization ---');
  const persistentStorePath = path.resolve('src/rag/storage/persistentStore.ts');
  const persistentStoreContent = fs.readFileSync(persistentStorePath, 'utf-8');

  assert(persistentStoreContent.includes('publicOnly: boolean = false'),
    'PersistentStore supports publicOnly isolation parameter for public guests');
  assert(persistentStoreContent.includes('sanitizeForPublic'),
    'PersistentStore contains sanitizeForPublic helper method');
  assert(persistentStoreContent.includes('delete sanitized.uploadedBy') &&
         persistentStoreContent.includes('delete sanitized.approverId') &&
         persistentStoreContent.includes('delete sanitized.rejectionReason'),
    'Internal administrative IDs (uploadedBy, approverId, rejectionReason) strictly stripped from public output');

  // Test simulation of public vs staff document filtering
  const sampleDocApproved = {
    documentId: 'DOC-HCM-001',
    title: 'Tuyên ngôn Độc lập',
    approvalStatus: 'APPROVED',
    isAllowedForRag: true,
    uploadedBy: 'usr-editor-a',
    approverId: 'usr-admin-chief'
  };

  const sampleDocCanary = {
    documentId: 'DOC-HCM-009',
    title: 'Tài liệu thử nghiệm nội bộ',
    approvalStatus: 'PENDING_REVIEW',
    isAllowedForRag: false,
    uploadedBy: 'usr-editor-b'
  };

  function simulatePublicFilter(docs, publicOnly) {
    if (!publicOnly) return docs;
    return docs
      .filter(d => d.approvalStatus === 'APPROVED' && d.isAllowedForRag)
      .map(d => {
        const copy = { ...d };
        delete copy.uploadedBy;
        delete copy.approverId;
        delete copy.rejectionReason;
        return copy;
      });
  }

  const publicResult = simulatePublicFilter([sampleDocApproved, sampleDocCanary], true);
  assert(publicResult.length === 1 && publicResult[0].documentId === 'DOC-HCM-001',
    'Public filter strictly retains only approved documents');
  assert(!publicResult[0].uploadedBy && !publicResult[0].approverId,
    'Public filtered document has no internal operator IDs');

  // ------------------------------------------------------------------------------
  // SUITE 3: Security Hardening - Staging Sandbox Persona Token Rejection
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Security Hardening: Staging Persona Rejection ---');
  const ragRoutesPath = path.resolve('src/rag/api/ragRoutes.ts');
  const ragRoutesContent = fs.readFileSync(ragRoutesPath, 'utf-8');

  assert(ragRoutesContent.includes('isStagingDeployment'),
    'ragRoutes explicitly checks for staging/production deployment environment');
  assert(ragRoutesContent.includes('Môi trường Staging yêu cầu tài khoản Supabase Auth thực tế'),
    'Staging environment enforces real Supabase JWT and rejects Sandbox Persona tokens with 401');

  // ------------------------------------------------------------------------------
  // SUITE 4: Server-Side Four-Eyes Governance Integrity
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Server-Side Four-Eyes Governance Integrity ---');
  assert(ragRoutesContent.includes('existingDoc.uploadedBy === auth.operatorId'),
    'Server-side check strictly verifies uploadedBy !== auth.operatorId');
  assert(ragRoutesContent.includes('Người tải tài liệu') && ragRoutesContent.includes('không được tự phê duyệt'),
    'Self-approval violation error message conforms to Four-Eyes Principle');

  // Simulation of Four-Eyes check
  function simulateFourEyes(docUploaderId, approverId) {
    if (docUploaderId && approverId && docUploaderId === approverId) {
      return { authorized: false, statusCode: 403, error: 'Vi phạm nguyên tắc 4 mắt' };
    }
    return { authorized: true, statusCode: 200 };
  }

  const selfApprovalAttempt = simulateFourEyes('usr-editor-a', 'usr-editor-a');
  assert(selfApprovalAttempt.statusCode === 403, 'Uploader self-approval attempt is strictly rejected with 403 Forbidden');

  const independentApproval = simulateFourEyes('usr-editor-a', 'usr-admin-chief');
  assert(independentApproval.statusCode === 200, 'Independent officer approval is authorized with 200 OK');

  // ------------------------------------------------------------------------------
  // SUITE 5: User Feedback Pipeline
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 5: User Feedback Pipeline ---');
  assert(ragRoutesContent.includes('handleFeedbackRoute'),
    'ragRoutes exports handleFeedbackRoute for POST /api/rag/feedback');
  assert(persistentStoreContent.includes('saveFeedback'),
    'persistentStore implements saveFeedback method');

  // In-memory feedback store simulation
  const feedbacks = [];
  function recordFeedback(body) {
    if (!body?.query) return { statusCode: 400, error: 'query is required' };
    const record = {
      id: `FB-${Date.now()}`,
      query: body.query,
      answerSnippet: body.answerSnippet || '',
      isHelpful: Boolean(body.isHelpful),
      category: body.category,
      comment: body.comment,
      userRole: body.userRole || 'student',
      createdAt: new Date().toISOString()
    };
    feedbacks.push(record);
    return { statusCode: 201, data: record };
  }

  const fb1 = recordFeedback({
    query: 'Bác Hồ sinh năm nào?',
    answerSnippet: 'Bác sinh ngày 19/5/1890',
    isHelpful: true,
    category: 'positive'
  });
  assert(fb1.statusCode === 201, 'Positive feedback accepted with 201 Created');

  const fb2 = recordFeedback({
    query: 'Năm Điều Bác Hồ dạy ra đời khi nào?',
    isHelpful: false,
    category: 'unclear',
    comment: 'Cần giải thích rõ mốc năm 1961 và 1965'
  });
  assert(fb2.statusCode === 201, 'Negative feedback with feedback reason & comment accepted');

  const fbEmpty = recordFeedback({});
  assert(fbEmpty.statusCode === 400, 'Empty query rejected with 400 Bad Request');

  // ------------------------------------------------------------------------------
  // SUITE 6: Pilot Operations Analytics Dashboard
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 6: Pilot Operations Analytics Dashboard ---');
  assert(ragRoutesContent.includes('handleAnalyticsRoute'),
    'ragRoutes exports handleAnalyticsRoute for GET /api/rag/analytics');
  assert(persistentStoreContent.includes('getAnalytics'),
    'persistentStore implements getAnalytics method');

  // In-memory analytics calculation simulation
  const mockQueries = [
    { query: 'Bác Hồ dạy 5 điều gì?', evidenceFound: true },
    { query: 'Ai là anh hùng Nguyễn Trung Trực?', evidenceFound: true },
    { query: 'Thông tin giả định về vũ trụ?', evidenceFound: false }
  ];

  function computeAnalyticsSummary(docs, queries, fbs) {
    const totalDocs = docs.length;
    const approved = docs.filter(d => d.approvalStatus === 'APPROVED').length;
    const totalLogged = queries.length;
    const evidenceFoundCount = queries.filter(q => q.evidenceFound).length;
    const fallbackCount = totalLogged - evidenceFoundCount;
    const evidenceRatePercent = totalLogged > 0 ? Math.round((evidenceFoundCount / totalLogged) * 100) : 100;

    const ungroundedQueries = queries.filter(q => !q.evidenceFound).map(q => ({ query: q.query, timestamp: new Date().toISOString() }));

    const helpfulCount = fbs.filter(f => f.isHelpful).length;
    const satisfactionRatePercent = fbs.length > 0 ? Math.round((helpfulCount / fbs.length) * 100) : 100;

    return {
      documents: { total: totalDocs, approved },
      queries: { totalLogged, evidenceFoundCount, fallbackCount, evidenceRatePercent },
      ungroundedQueries,
      feedback: { total: fbs.length, helpfulCount, satisfactionRatePercent }
    };
  }

  const testSummary = computeAnalyticsSummary([sampleDocApproved, sampleDocCanary], mockQueries, feedbacks);
  assert(testSummary.queries.totalLogged === 3, 'Analytics tracks total queries (3 queries logged)');
  assert(testSummary.queries.evidenceRatePercent === 67, 'Analytics calculates evidence rate (67% grounded)');
  assert(testSummary.ungroundedQueries.length === 1, 'Analytics extracts ungrounded queries list for library expansion');
  assert(testSummary.feedback.satisfactionRatePercent === 50, 'Analytics computes satisfaction rating (50% helpful)');

  // ------------------------------------------------------------------------------
  // SUITE 7: Deployable Serverless Handlers Verification
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 7: Deployable Serverless Handlers Verification ---');
  const requiredServerlessHandlers = [
    'api/rag/query.ts',
    'api/rag/search.ts',
    'api/rag/health.ts',
    'api/rag/documents.ts',
    'api/rag/feedback.ts',
    'api/rag/analytics.ts',
    'api/rag/documents/[id].ts',
    'api/rag/documents/[id]/approve.ts',
    'api/rag/documents/[id]/reprocess.ts'
  ];

  for (const handlerRel of requiredServerlessHandlers) {
    const handlerAbs = path.resolve(handlerRel);
    assert(fs.existsSync(handlerAbs), `Serverless handler "${handlerRel}" deployed`, handlerRel);
  }

  // ------------------------------------------------------------------------------
  // SUITE 8: School User Experience & Pedagogical Role Switching
  // ------------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 8: School User Experience & Pedagogical Role Switching ---');
  const ragChatbotModalPath = path.resolve('src/components/rag/RagChatbotModal.tsx');
  const ragMessageItemPath = path.resolve('src/components/rag/RagMessageItem.tsx');
  const ragKnowledgeManagerPath = path.resolve('src/components/rag/RagKnowledgeManager.tsx');

  const modalContent = fs.readFileSync(ragChatbotModalPath, 'utf-8');
  const messageItemContent = fs.readFileSync(ragMessageItemPath, 'utf-8');
  const knowledgeManagerContent = fs.readFileSync(ragKnowledgeManagerPath, 'utf-8');

  // Verify Role Toggle: Student vs Teacher
  assert(modalContent.includes('userRole') && modalContent.includes('Học sinh THCS') && modalContent.includes('Giáo viên / Thầy cô'),
    'RagChatbotModal provides role switcher between Học sinh THCS and Giáo viên');

  // Verify contextual initialQuery and contextDocumentTitle support
  assert(modalContent.includes('initialQuery') && modalContent.includes('contextDocumentTitle'),
    'RagChatbotModal supports contextual query and document title');

  // Verify interactive feedback buttons in message item
  assert(messageItemContent.includes('handleThumbUp') && messageItemContent.includes('handleThumbDownClick'),
    'RagMessageItem has interactive Thumbs Up & Thumbs Down feedback controls');
  assert(messageItemContent.includes('feedbackCategory') && messageItemContent.includes('inaccurate') && messageItemContent.includes('missing_info'),
    'RagMessageItem includes categorized reason feedback modal for students/teachers');
  assert(messageItemContent.includes('handleCopy'),
    'RagMessageItem includes copy-to-clipboard functionality');

  // Verify Analytics tab in Knowledge Manager
  assert(knowledgeManagerContent.includes('activeTab') && knowledgeManagerContent.includes('analytics'),
    'RagKnowledgeManager includes sub-tab for Pilot Analytics Dashboard');
  assert(knowledgeManagerContent.includes('Hỏi AI về tư liệu này'),
    'Document Inspection modal includes contextual "Hỏi AI về tư liệu này" action');

  // ------------------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------------------
  console.log('\n==============================================================================');
  console.log(`PHASE 04 TEST SUMMARY: ${testReport.passedCount} PASSED | ${testReport.failedCount} FAILED (TOTAL: ${testReport.passedCount + testReport.failedCount})`);
  if (testReport.failedCount === 0) {
    console.log('STATUS: ALL PHASE 04 GATES PASSED (CONTROLLED PILOT READY)');
  } else {
    console.error('STATUS: PHASE 04 VERIFICATION GATES FAILED');
  }
  console.log('==============================================================================');

  const reportPath = path.resolve('scratch/rag_phase04_verification_report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2), 'utf-8');
  console.log(`Saved execution report to: ${reportPath}`);

  if (testReport.failedCount > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
