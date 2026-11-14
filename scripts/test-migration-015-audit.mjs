/**
 * TEST SUITE: MIGRATION 015 - RAG FEEDBACK LEAST-PRIVILEGE SECURITY AUDIT
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 * Target: Supabase STAGING (Project: ospnskocdlirjqzknkqz)
 */

import fs from 'fs';
import path from 'path';

console.log('==============================================================================');
console.log('SUPABASE STAGING SECURITY HARDENING - MIGRATION 015 AUDIT SUITE');
console.log('SCOPE: public.rag_user_feedback');
console.log('PRINCIPLE: LEAST PRIVILEGE - ZERO DATA LOSS - IDEMPOTENT EXECUTION');
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

const migration015Path = path.resolve('supabase/migrations/015_rag_feedback_least_privilege.sql');
assert(fs.existsSync(migration015Path), 'Migration 015 file exists', migration015Path);

const sqlContent = fs.readFileSync(migration015Path, 'utf-8');

// 1. Transaction & Safety
// Remove SQL comments before testing for destructive commands
const uncommentedSql = sqlContent
  .replace(/--.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

assert(sqlContent.includes('BEGIN;') && sqlContent.includes('COMMIT;'), 'Migration is wrapped in transactional block (BEGIN ... COMMIT)');
assert(!uncommentedSql.match(/\bDROP\s+TABLE\b/i), 'Zero DROP TABLE statements in executable SQL');
assert(!uncommentedSql.match(/\bDROP\s+DATABASE\b/i), 'Zero DROP DATABASE statements in executable SQL');
assert(!uncommentedSql.match(/\bTRUNCATE\b/i), 'Zero TRUNCATE statements (preserves existing student/teacher feedback)');
assert(!uncommentedSql.match(/\bDELETE\s+FROM\b/i), 'Zero DELETE FROM statements (preserves existing feedback data)');

// 2. Discretionary Access Control (DAC) Revocations
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM PUBLIC;'), 'Revokes all privileges from pseudo-role PUBLIC (eliminates inherited grants)');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM anon;'), 'Revokes excessive privileges from role anon');
assert(sqlContent.includes('REVOKE ALL PRIVILEGES ON TABLE public.rag_user_feedback FROM authenticated;'), 'Revokes excessive privileges from role authenticated');

// 3. Least-Privilege Grants
assert(sqlContent.includes('GRANT INSERT ON TABLE public.rag_user_feedback TO anon;'), 'Grants strictly INSERT only to role anon');
assert(sqlContent.includes('GRANT INSERT ON TABLE public.rag_user_feedback TO authenticated;'), 'Grants strictly INSERT only to role authenticated');
assert(!sqlContent.match(/GRANT\s+SELECT\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level SELECT grant to anon');
assert(!sqlContent.match(/GRANT\s+UPDATE\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level UPDATE grant to anon');
assert(!sqlContent.match(/GRANT\s+DELETE\s+ON\s+TABLE\s+public\.rag_user_feedback\s+TO\s+anon/i), 'Strictly NO table-level DELETE grant to anon');
assert(!sqlContent.match(/GRANT\s+TRUNCATE\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRUNCATE grant to any client role');
assert(!sqlContent.match(/GRANT\s+TRIGGER\s+ON\s+TABLE\s+public\.rag_user_feedback/i), 'Strictly NO TRIGGER grant to client roles');
assert(sqlContent.includes('GRANT ALL PRIVILEGES ON TABLE public.rag_user_feedback TO service_role;'), 'Grants full administrative privileges to service_role for backend');

// 4. Row Level Security & Policy Hardening
assert(sqlContent.includes('ALTER TABLE public.rag_user_feedback ENABLE ROW LEVEL SECURITY;'), 'Explicitly enforces ROW LEVEL SECURITY');
assert(sqlContent.includes('DROP POLICY IF EXISTS "Authenticated users read rag_user_feedback"'), 'Safely drops overly broad legacy SELECT policy (USING true)');
assert(sqlContent.includes('DROP POLICY IF EXISTS "Public insert rag_user_feedback"'), 'Safely drops legacy unvalidated insert policy');
assert(sqlContent.includes('CREATE POLICY "rag_user_feedback_insert_policy"'), 'Creates hardened insert policy with strict input validation');
assert(sqlContent.includes('query IS NOT NULL') && sqlContent.includes('length(query) <= 2000'), 'Insert policy enforces non-empty query and length constraints');
assert(sqlContent.includes('CREATE POLICY "rag_user_feedback_admin_select_policy"'), 'Creates restricted admin-only SELECT policy');
assert(sqlContent.includes('app_metadata') || sqlContent.includes('user_metadata'), 'Admin select policy verifies authenticated JWT claims securely');
assert(!sqlContent.includes('X-User-Role'), 'Does NOT rely on spoofable client HTTP header X-User-Role for database policy');

// 5. Verification Queries Included
assert(sqlContent.includes('has_table_privilege'), 'Includes read-only has_table_privilege verification script for DB Administrator');
assert(sqlContent.includes('pg_policies'), 'Includes pg_policies verification script');

// 6. Application Integrity Check
const persistentStorePath = path.resolve('src/rag/storage/persistentStore.ts');
const persistentStore = fs.readFileSync(persistentStorePath, 'utf-8');
assert(persistentStore.includes("await supabase.from('rag_user_feedback').insert"), 'Application persistentStore continues to save feedback cleanly');

console.log('\n==============================================================================');
console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log('==============================================================================');

if (failed > 0) {
  process.exit(1);
}
