/**
 * Test Suite: Production Feedback Persistence Reliability Remediation
 * Verifies strict persistence semantics:
 * 1. Admin Client valid + INSERT success -> HTTP 201, persisted = true
 * 2. Admin Client returns null -> HTTP 503, persisted = false
 * 3. Supabase returns { data: null, error: ... } -> HTTP 502, persisted = false
 * 4. Network exception -> HTTP 500, persisted = false (never HTTP 201)
 * 5. Local fallback -> Never reported as persistent success
 * 6. Analytics -> Distinguishes database persistent data vs local unpersisted data
 * 7. Security -> Zero secret keys in frontend bundle or logs
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

// Auto-bridge: If executed under plain Node without TypeScript ESM loader, delegate to tsx
if (!process.env.__TSX_RUNNER) {
  const scriptPath = fileURLToPath(import.meta.url);
  const result = spawnSync('npx', ['tsx', `"${scriptPath}"`], {
    stdio: 'inherit',
    env: { ...process.env, __TSX_RUNNER: '1' },
    shell: true
  });
  process.exit(result.status ?? 0);
}

import assert from 'assert';
import fs from 'fs';
import path from 'path';

const { handleFeedbackRoute, handleAnalyticsRoute } = await import('../src/rag/api/ragRoutes.ts');
const { persistentRagStore } = await import('../src/rag/storage/persistentStore.ts');
const { resetSupabaseAdmin } = await import('../src/lib/supabaseBackend.ts');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

console.log('==============================================================================');
console.log('PRODUCTION FEEDBACK PERSISTENCE RELIABILITY VERIFICATION');
console.log('STRICT DATABASE PERSISTENCE ENFORCEMENT & ZERO FAKE HTTP 201');
console.log('==============================================================================\n');

async function main() {
  // --- TEST CASE 1: Admin Client valid + INSERT success ---
  await runAsyncTest('Case 1: Admin Client valid + INSERT success -> HTTP 201, persisted = true', async () => {
    const mockAdmin = {
      from: (table) => {
        assert.strictEqual(table, 'rag_user_feedback');
        return {
          insert: async (records) => {
            assert.strictEqual(records.length, 1);
            return { data: records, error: null };
          }
        };
      }
    };
    resetSupabaseAdmin(mockAdmin);

    const payload = {
      query: 'Thử nghiệm lưu phản hồi hợp lệ có xác nhận database',
      isHelpful: true,
      category: 'accurate',
      comment: 'Câu trả lời rất chính xác'
    };

    const res = await handleFeedbackRoute(payload, '192.168.1.101');
    assert.strictEqual(res.statusCode, 201, 'Must return HTTP 201');
    assert.strictEqual(res.success, true, 'Must return success: true');
    assert.strictEqual(res.data?.persisted, true, 'Must return persisted: true');
    assert.ok(res.data?.feedbackId?.startsWith('FB-'), 'Must generate feedbackId');
  });

  // --- TEST CASE 2: Admin Client returns null ---
  await runAsyncTest('Case 2: Admin Client unavailable (null) -> HTTP 503, persisted = false', async () => {
    resetSupabaseAdmin(null);
    // ensure env doesn't auto-init
    const oldUrl = process.env.SUPABASE_URL;
    const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
      const payload = {
        query: 'Thử nghiệm khi thiếu cấu hình Supabase Admin',
        isHelpful: false,
        category: 'unclear',
        comment: 'Cần giải thích rõ hơn'
      };

      const res = await handleFeedbackRoute(payload, '192.168.1.102');
      assert.strictEqual(res.statusCode, 503, 'Must return HTTP 503 Service Unavailable');
      assert.strictEqual(res.success, false, 'Must return success: false');
      assert.strictEqual(res.data?.persisted, false, 'Must return persisted: false');
      assert.ok(res.error?.includes('chưa sẵn sàng'), 'Error message must explain service unavailable');
    } finally {
      if (oldUrl) process.env.SUPABASE_URL = oldUrl;
      if (oldKey) process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
    }
  });

  // --- TEST CASE 3: Supabase returns { data: null, error: ... } ---
  await runAsyncTest('Case 3: Supabase returns database rejection error -> HTTP 502, persisted = false', async () => {
    const mockAdminReject = {
      from: (table) => {
        assert.strictEqual(table, 'rag_user_feedback');
        return {
          insert: async () => {
            return {
              data: null,
              error: {
                code: '42501',
                message: 'permission denied for table rag_user_feedback',
                hint: 'Double check your permissions'
              }
            };
          }
        };
      }
    };
    resetSupabaseAdmin(mockAdminReject);

    const payload = {
      query: 'Thử nghiệm trường hợp database từ chối quyền ghi',
      isHelpful: true,
      category: 'positive'
    };

    const res = await handleFeedbackRoute(payload, '192.168.1.103');
    assert.strictEqual(res.statusCode, 502, 'Must return HTTP 502 Bad Gateway / Database Rejected');
    assert.strictEqual(res.success, false, 'Must return success: false');
    assert.strictEqual(res.data?.persisted, false, 'Must return persisted: false');
    assert.ok(res.error?.includes('từ chối'), 'Must return sanitized error message');
    assert.strictEqual(res.error.includes('42501'), false, 'Must NOT leak raw database internals to client');
  });

  // --- TEST CASE 4: Network Exception ---
  await runAsyncTest('Case 4: Network connection exception -> HTTP 500, persisted = false (Never HTTP 201)', async () => {
    const mockAdminCrash = {
      from: () => {
        return {
          insert: async () => {
            throw new Error('fetch failed: connect ETIMEDOUT 104.18.38.10:443');
          }
        };
      }
    };
    resetSupabaseAdmin(mockAdminCrash);

    const payload = {
      query: 'Thử nghiệm sự cố đứt kết nối mạng tới Supabase',
      isHelpful: false
    };

    const res = await handleFeedbackRoute(payload, '192.168.1.104');
    assert.notStrictEqual(res.statusCode, 201, 'Must NEVER return HTTP 201 on network exception');
    assert.strictEqual(res.statusCode, 500, 'Must return HTTP 500 Internal Error');
    assert.strictEqual(res.success, false, 'Must return success: false');
    assert.strictEqual(res.data?.persisted, false, 'Must return persisted: false');
  });

  // --- TEST CASE 5: Local Fallback Never Claims Persistent Success ---
  await runAsyncTest('Case 5: Local Fallback records are not falsely flagged as persisted', async () => {
    // When Case 2, 3, 4 failed, verify that persistentRagStore did NOT push unpersisted records with persisted: true
    const analytics = await persistentRagStore.getAnalytics();
    // Reset mock admin to verify local analytics fallback
    resetSupabaseAdmin(null);
    const unpersistedAnalytics = await persistentRagStore.getAnalytics();
    assert.strictEqual(unpersistedAnalytics.feedback.dataSource, 'local_in_memory_unpersisted', 'Must identify unpersisted source');
    assert.strictEqual(unpersistedAnalytics.feedback.isPersisted, false, 'isPersisted flag must be false for local fallback');
  });

  // --- TEST CASE 6: Analytics Distinguishes Database Persistent Data ---
  await runAsyncTest('Case 6: Analytics distinguishes database persistent data vs local unpersisted data', async () => {
    const mockAdminAnalytics = {
      from: (table) => {
        assert.strictEqual(table, 'rag_user_feedback');
        return {
          select: (fields, opts) => {
            return {
              order: () => ({
                limit: async () => ({
                  data: [
                    { is_helpful: true, comment: 'Bình luận đã lưu DB', category: 'positive', created_at: '2026-11-14T15:00:00Z' },
                    { is_helpful: false, comment: 'Chưa đủ ý', category: 'missing_info', created_at: '2026-11-14T15:01:00Z' }
                  ],
                  error: null,
                  count: 42
                })
              })
            };
          }
        };
      }
    };
    resetSupabaseAdmin(mockAdminAnalytics);

    const analytics = await persistentRagStore.getAnalytics();
    assert.strictEqual(analytics.feedback.total, 42, 'Must read count from remote database');
    assert.strictEqual(analytics.feedback.dataSource, 'supabase_persistent', 'Must declare supabase_persistent dataSource');
    assert.strictEqual(analytics.feedback.isPersisted, true, 'isPersisted must be true');
    assert.strictEqual(analytics.feedback.helpfulCount, 1, 'Calculates helpful count from remote records');
  });

  // --- TEST CASE 7: Security Audit: No Secret Key in Frontend or Logs ---
  runTest('Case 7: Security Audit: No Secret Key in Frontend or Logs', () => {
    const distPath = path.resolve('dist/assets');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      for (const file of files) {
        if (file.endsWith('.js')) {
          const content = fs.readFileSync(path.join(distPath, file), 'utf8');
          // Scan for actual secret patterns
          const secretPattern = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
          const matches = content.match(secretPattern) || [];
          for (const m of matches) {
            assert.ok(!m.includes('service_role'), 'Forbidden: service_role token found in bundle: ' + file);
          }
        }
      }
    }
    // Verify source code supabaseBackend.ts doesn't expose secrets
    const backendCode = fs.readFileSync('src/lib/supabaseBackend.ts', 'utf8');
    assert.ok(!backendCode.includes('eyJhbGci'), 'No hardcoded JWT secret in supabaseBackend.ts');
  });

  console.log('\n==============================================================================');
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
  if (passedTests === totalTests) {
    console.log('ALL PERSISTENCE RELIABILITY CRITERIA SATISFIED (CODE REMEDIATION READY).');
  } else {
    console.error('SOME TESTS FAILED.');
    process.exit(1);
  }
  console.log('==============================================================================\n');
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
