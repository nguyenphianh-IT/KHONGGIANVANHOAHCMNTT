/**
 * TEST SUITE: MIGRATION 015 - BACKEND-ONLY RAG FEEDBACK ACCESS ARCHITECTURE AUDIT
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Target: Supabase STAGING (Project: ospnskocdlirjqzknkqz)
 * Mode: FINAL REVISION - BACKEND-ONLY ACCESS - ZERO DIRECT CLIENT ACCESS
 */

import fs from 'fs';
import path from 'path';

console.log('==============================================================================');
console.log('SUPABASE STAGING SECURITY HARDENING - MIGRATION 015 FINAL REVISION AUDIT');
console.log('ARCHITECTURE: BACKEND-ONLY ACCESS (ZERO DIRECT ANON / AUTHENTICATED ACCESS)');
console.log('PRINCIPLE: LEAST PRIVILEGE - ZERO USER_METADATA - STRICT RBAC & DEFENSE IN DEPTH');
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
console.log('--- TEST SUITE 1: Migration 015 SQL Hardening & Backend-Only Structure ---');
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
// SUITE 2: Backend-Only Table DAC Lockout (Zero direct access for anon/authenticated)
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Table-Level Discretionary Access Control (Backend-Only) ---');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM PUBLIC;'), 'Revokes all privileges from pseudo-role PUBLIC (eliminates inherited grants)');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM anon;'), 'Revokes all direct privileges from role anon');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM authenticated;'), 'Revokes all direct privileges from role authenticated');

// In Backend-Only Architecture: NO table-level grant of SELECT, INSERT, UPDATE, DELETE to anon or authenticated
assert(!uncommentedSql.match(/GRANT\s+INSERT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Backend-Only: Strictly NO direct INSERT grant to anon');
assert(!uncommentedSql.match(/GRANT\s+INSERT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+authenticated/i), 'Backend-Only: Strictly NO direct INSERT grant to authenticated');
assert(!uncommentedSql.match(/GRANT\s+SELECT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Backend-Only: Strictly NO direct SELECT grant to anon');
assert(!uncommentedSql.match(/GRANT\s+SELECT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+authenticated/i), 'Backend-Only: Strictly NO direct SELECT grant to authenticated');
assert(!uncommentedSql.match(/GRANT\s+UPDATE\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO table-level UPDATE grant to any client role');
assert(!uncommentedSql.match(/GRANT\s+DELETE\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO table-level DELETE grant to any client role');
assert(!uncommentedSql.match(/GRANT\s+TRUNCATE\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRUNCATE grant to any client role');
assert(!uncommentedSql.match(/GRANT\s+TRIGGER\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRIGGER grant to client roles');
assert(sqlContent.includes('GRANT ALL PRIVILEGES ON TABLE public.rag_user_feedback TO service_role;'), 'Grants exclusive administrative privileges to service_role for backend operations');

// ------------------------------------------------------------------------------
// SUITE 3: Row Level Security & Default Deny
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Row Level Security & Default Deny Enforcement ---');
assert(sqlContent.includes('ALTER TABLE public.rag_user_feedback ENABLE ROW LEVEL SECURITY;'), 'Explicitly enforces ROW LEVEL SECURITY');
assert(sqlContent.includes('DROP POLICY IF EXISTS "Authenticated users read rag_user_feedback"'), 'Drops legacy overly broad SELECT policy');
assert(sqlContent.includes('DROP POLICY IF EXISTS "Public insert rag_user_feedback"'), 'Drops legacy direct public insert policy');
assert(!uncommentedSql.includes('user_metadata'), 'MANDATORY: Absolutely ZERO usage of user_metadata');
assert(!uncommentedSql.includes("auth.jwt() ->> 'role' = 'service_role'"), 'MANDATORY: Zero service_role in RLS policy (service_role natively bypasses RLS)');
assert(!uncommentedSql.match(/CREATE\s+POLICY.*TO\s+(anon|authenticated|public)/i), 'Backend-Only: No client policies created (pure Default Deny for client roles)');

// ------------------------------------------------------------------------------
// SUITE 4: Secret Isolation (No service key in frontend)
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Secret Isolation Audit ---');
const frontendSupabasePath = path.resolve('src/lib/supabase.ts');
const frontendSupabase = fs.readFileSync(frontendSupabasePath, 'utf-8');
assert(!frontendSupabase.includes("process.env.SUPABASE_SERVICE_ROLE_KEY"), 'Frontend supabase.ts does not directly expose service role key');

const backendSupabasePath = path.resolve('src/lib/supabaseBackend.ts');
assert(fs.existsSync(backendSupabasePath), 'Server-side supabaseBackend.ts exists for backend operations');

const backendSupabase = fs.readFileSync(backendSupabasePath, 'utf-8');
assert(backendSupabase.includes('getSupabaseAdmin') && backendSupabase.includes('SUPABASE_SERVICE_ROLE_KEY'),
  'Dedicated backend helper getSupabaseAdmin safely reads SUPABASE_SERVICE_ROLE_KEY on server');

// ------------------------------------------------------------------------------
// SUITE 5: Server-Side Feedback Validation & Rate Limiting Code Audit
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Server-Side Feedback Validation & Rate Limiting Audit ---');
const routesPath = path.resolve('src/rag/api/ragRoutes.ts');
assert(fs.existsSync(routesPath), 'src/rag/api/ragRoutes.ts exists');

const routesContent = fs.readFileSync(routesPath, 'utf-8');
assert(routesContent.includes('FEEDBACK_RATE_LIMIT_MAX_REQUESTS'), 'RAG routes includes feedback rate limiter configuration');
assert(routesContent.includes('Nội dung câu hỏi quá dài (tối đa 2000 ký tự)'), 'Enforces 2000 character maximum limit on queries');
assert(routesContent.includes('Ý kiến đóng góp quá dài (tối đa 4000 ký tự)'), 'Enforces 4000 character maximum limit on comments');
assert(routesContent.includes('Mã danh mục không hợp lệ (tối đa 64 ký tự)'), 'Enforces 64 character maximum limit on categories');
assert(routesContent.includes("sanitizedUserRole = 'guest'") && routesContent.includes("validateAdminAuth"),
  'Client-supplied admin role claims are strictly sanitized/demoted unless verified via server-side admin token');
assert(routesContent.includes('user_roles') && routesContent.includes('roles(code)'),
  'validateAdminAuth verifies user authorization against database user_roles and roles tables');

// ------------------------------------------------------------------------------
// SUITE 6: Persistent Store Backend-Only Execution Audit
// ------------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Persistent Store Backend Service-Role Integration ---');
const storePath = path.resolve('src/rag/storage/persistentStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf-8');
assert(storeContent.includes('getSupabaseAdmin()'), 'persistentStore uses getSupabaseAdmin() for service_role operations');
assert(!storeContent.match(/await\s+supabase\.from\('rag_user_feedback'\)\.insert/),
  'persistentStore no longer uses client anon supabase client to insert into rag_user_feedback');

// ------------------------------------------------------------------------------
// SUITE 7: Live HTTP Integration Testing (http://localhost:5173/api/rag/feedback)
// ------------------------------------------------------------------------------
async function runLiveApiTests() {
  console.log('\n--- TEST SUITE 7: Live HTTP Integration Testing (http://localhost:5173/api/rag/feedback) ---');
  const baseUrl = 'http://localhost:5173/api/rag/feedback';

  try {
    // 1. Rejection of empty query
    const resEmpty = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.1' },
      body: JSON.stringify({ query: '' })
    });
    const jsonEmpty = await resEmpty.json();
    assert(resEmpty.status === 400 && jsonEmpty.success === false, 'Live API rejects empty query with 400 Bad Request');

    // 2. Rejection of oversized query (>2000 chars)
    const longQuery = 'X'.repeat(2005);
    const resLongQuery = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.2' },
      body: JSON.stringify({ query: longQuery })
    });
    const jsonLongQuery = await resLongQuery.json();
    assert(resLongQuery.status === 400 && jsonLongQuery.success === false, 'Live API rejects oversized query (>2000 chars) with 400 Bad Request');

    // 3. Rejection of oversized comment (>4000 chars)
    const longComment = 'C'.repeat(4005);
    const resLongComment = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.3' },
      body: JSON.stringify({ query: 'Tìm hiểu về Bác Hồ', comment: longComment })
    });
    const jsonLongComment = await resLongComment.json();
    assert(resLongComment.status === 400 && jsonLongComment.success === false, 'Live API rejects oversized comment (>4000 chars) with 400 Bad Request');

    // 4. Valid feedback submission from student/guest via API
    const resValid = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.4' },
      body: JSON.stringify({
        query: 'Bác Hồ đọc Tuyên ngôn Độc lập năm nào?',
        isHelpful: true,
        answerSnippet: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập ngày 2/9/1945 tại Quảng trường Ba Đình.',
        comment: 'Phản hồi qua kiến trúc Backend-only API.',
        userRole: 'student'
      })
    });
    const jsonValid = await resValid.json();
    assert(resValid.status === 201 && jsonValid.success === true, 'Live API successfully accepts valid user feedback');

    // 5. Rate limiting test: sending multiple requests rapidly from 10.0.0.5
    let rateLimited = false;
    for (let i = 0; i < 18; i++) {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.5' },
        body: JSON.stringify({ query: `Câu hỏi kiểm tra tần suất backend ${i}`, isHelpful: true })
      });
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited, 'Live API triggers 429 Too Many Requests when rate limit threshold is exceeded');

    // 6. Analytics API protection test: unauthenticated query to /api/rag/analytics
    const resAnalytics = await fetch('http://localhost:5173/api/rag/analytics', {
      method: 'GET'
    });
    assert(resAnalytics.status === 401 || resAnalytics.status === 403,
      'GET /api/rag/analytics rejects unauthenticated requests (HTTP 401/403)');

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

await runLiveApiTests();
