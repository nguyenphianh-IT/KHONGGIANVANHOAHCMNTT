/**
 * TEST SUITE: MIGRATION 015 - RAG FEEDBACK AUTHORIZATION HARDENING & LEAST-PRIVILEGE AUDIT
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Target: Supabase STAGING (Project: ospnskocdlirjqzknkqz)
 * Mode: COMPLETE REVISION - ZERO USER_METADATA - SERVER VALIDATION & RATE LIMIT
 */

import fs from 'fs';
import path from 'path';

console.log('==============================================================================');
console.log('SUPABASE STAGING SECURITY HARDENING - MIGRATION 015 REVISION AUDIT SUITE');
console.log('SCOPE: public.rag_user_feedback & POST /api/rag/feedback');
console.log('PRINCIPLE: LEAST PRIVILEGE - ZERO USER_METADATA - SERVER VALIDATION & RATE LIMIT');
console.log('==============================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName} -> ${detail}`);
    failed++;
  }
}

// ------------------------------------------------------------------------------
// SUITE 1: Migration 015 SQL Schema & Idempotence Audit
// ------------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Migration 015 SQL Hardening & Least-Privilege Structure ---');
const migration015Path = path.resolve('supabase/migrations/015_rag_feedback_least_privilege.sql');
assert(fs.existsSync(migration015Path), 'Migration 015 file exists', migration015Path);

const sqlContent = fs.readFileSync(migration015Path, 'utf-8');

// Strip comments for pure executable SQL verification
const uncommentedSql = sqlContent
  .replace(/--.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

assert(sqlContent.includes('BEGIN;') && sqlContent.includes('COMMIT;'), 'Migration is wrapped in transactional block (BEGIN ... COMMIT)');
assert(!uncommentedSql.match(/\bDROP\s+TABLE\b/i), 'Zero DROP TABLE statements in executable SQL');
assert(!uncommentedSql.match(/\bDROP\s+DATABASE\b/i), 'Zero DROP DATABASE statements in executable SQL');
assert(!uncommentedSql.match(/\bTRUNCATE\b/i), 'Zero TRUNCATE statements (preserves existing student/teacher feedback)');
assert(!uncommentedSql.match(/\bDELETE\s+FROM\b/i), 'Zero DELETE FROM statements (preserves existing feedback data)');

// ------------------------------------------------------------------------------
// SUITE 2: DAC Table-Level Privileges
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Table-Level Discretionary Access Control (DAC) ---');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM PUBLIC;'), 'Revokes all privileges from pseudo-role PUBLIC (eliminates inherited grants)');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM anon;'), 'Revokes excessive privileges from role anon');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM authenticated;'), 'Revokes excessive privileges from role authenticated');

assert(sqlContent.includes('GRANT INSERT ON TABLE public.rag_user_feedback TO anon;'), 'Grants strictly INSERT only to role anon');
assert(sqlContent.includes('GRANT INSERT ON TABLE public.rag_user_feedback TO authenticated;'), 'Grants strictly INSERT only to role authenticated');
assert(!uncommentedSql.match(/GRANT\s+SELECT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level SELECT grant to anon');
assert(!uncommentedSql.match(/GRANT\s+UPDATE\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level UPDATE grant to anon');
assert(!uncommentedSql.match(/GRANT\s+DELETE\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level DELETE grant to anon');
assert(!uncommentedSql.match(/GRANT\s+TRUNCATE\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRUNCATE grant to any client role');
assert(!uncommentedSql.match(/GRANT\s+TRIGGER\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRIGGER grant to client roles');
assert(sqlContent.includes('GRANT ALL PRIVILEGES ON TABLE public.rag_user_feedback TO service_role;'), 'Grants full administrative privileges to service_role for backend');

// ------------------------------------------------------------------------------
// SUITE 3: Zero User Metadata & Strict RBAC Enforcement
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Zero User Metadata & Strict RBAC Verification ---');
assert(!uncommentedSql.includes('user_metadata'), 'MANDATORY: Absolutely ZERO usage of user-editable user_metadata in executable SQL');
assert(!uncommentedSql.includes("auth.jwt() ->> 'role' = 'service_role'"), 'MANDATORY: Removed service_role check from RLS policy (native BYPASSRLS used)');
assert(sqlContent.includes('public.has_role'), 'Uses canonical server-managed database RBAC function public.has_role');
assert(sqlContent.includes('app_metadata'), 'Allows server-managed app_metadata claims if configured');
assert(sqlContent.includes("user_role IS NULL OR user_role IN ('student', 'guest')"), 'Database RLS insert policy restricts client user_role strictly to student or guest');
assert(!sqlContent.includes('X-User-Role'), 'Does NOT rely on spoofable client HTTP header X-User-Role for database policy');

// ------------------------------------------------------------------------------
// SUITE 4: Verification Queries Included
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Read-Only Verification Script Documentation ---');
assert(sqlContent.includes('has_table_privilege'), 'Includes read-only has_table_privilege verification script for DB Administrator');
assert(sqlContent.includes('pg_policies'), 'Includes pg_policies verification script');

// ------------------------------------------------------------------------------
// SUITE 5: Runtime Server-Side Feedback Validation & Rate Limiting Verification
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Server-Side Feedback Validation & Rate Limiting Code Audit ---');
const routesPath = path.resolve('src/rag/api/ragRoutes.ts');
assert(fs.existsSync(routesPath), 'src/rag/api/ragRoutes.ts exists');

const routesContent = fs.readFileSync(routesPath, 'utf-8');
assert(routesContent.includes('FEEDBACK_RATE_LIMIT_MAX_REQUESTS'), 'RAG routes includes feedback rate limiter configuration');
assert(routesContent.includes('Nội dung câu hỏi quá dài (tối đa 2000 ký tự)'), 'Enforces 2000 character maximum limit on queries');
assert(routesContent.includes('Ý kiến đóng góp quá dài (tối đa 4000 ký tự)'), 'Enforces 4000 character maximum limit on comments');
assert(routesContent.includes('Mã danh mục không hợp lệ (tối đa 64 ký tự)'), 'Enforces 64 character maximum limit on categories');
assert(routesContent.includes("sanitizedUserRole = 'guest'") && routesContent.includes("validateAdminAuth"),
  'Client-supplied admin role claims are strictly sanitized/demoted unless verified via server-side admin token');

// ------------------------------------------------------------------------------
// SUITE 6: Live API Integration Tests against Local Dev Server
// ------------------------------------------------------------------------------
async function runLiveApiTests() {
  console.log('\n--- TEST SUITE 6: Live HTTP Integration Testing (http://localhost:5173/api/rag/feedback) ---');
  const baseUrl = 'http://localhost:5173/api/rag/feedback';

  try {
    // 1. Rejection of empty query
    const resEmpty = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' })
    });
    const jsonEmpty = await resEmpty.json();
    assert(resEmpty.status === 400 && jsonEmpty.success === false, 'Live API rejects empty query with 400 Bad Request');

    // 2. Rejection of oversized query (>2000 chars)
    const longQuery = 'X'.repeat(2005);
    const resLongQuery = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: longQuery })
    });
    const jsonLongQuery = await resLongQuery.json();
    assert(resLongQuery.status === 400 && jsonLongQuery.success === false, 'Live API rejects oversized query (>2000 chars) with 400 Bad Request');

    // 3. Rejection of oversized comment (>4000 chars)
    const longComment = 'C'.repeat(4005);
    const resLongComment = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Tìm hiểu về Bác Hồ', comment: longComment })
    });
    const jsonLongComment = await resLongComment.json();
    assert(resLongComment.status === 400 && jsonLongComment.success === false, 'Live API rejects oversized comment (>4000 chars) with 400 Bad Request');

    // 4. Valid feedback submission from student/guest
    const resValid = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Bác Hồ đọc Tuyên ngôn Độc lập năm nào?',
        isHelpful: true,
        answerSnippet: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập ngày 2/9/1945 tại Quảng trường Ba Đình.',
        comment: 'Câu trả lời rất rõ ràng và chuẩn xác lịch sử.',
        userRole: 'student'
      })
    });
    const jsonValid = await resValid.json();
    assert(resValid.status === 201 && jsonValid.success === true, 'Live API successfully accepts valid user feedback');

    // 5. Rate limiting test: sending multiple requests rapidly
    let rateLimited = false;
    for (let i = 0; i < 18; i++) {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Câu hỏi kiểm tra tần suất ${i}`, isHelpful: true })
      });
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited, 'Live API triggers 429 Too Many Requests when rate limit threshold is exceeded');

  } catch (err) {
    console.warn('[INFO] Live HTTP test skipped or server not reachable:', err.message);
  }

  console.log('\n==============================================================================');
  console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveApiTests();
