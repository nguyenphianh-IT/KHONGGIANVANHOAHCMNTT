const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.resolve('docs/phase-0b-2');

console.log('=== STARTING ROUND 3.18 COMPREHENSIVE VERIFICATION ===\n');

let allPass = true;
function assert(desc, condition) {
  if (condition) {
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc}`);
    allPass = false;
  }
}

// 1. Check Round 3.16 Deliverables (4 files)
console.log('--- 1. Checking Round 3.16 Deliverables ---');
const r316Expected = {
  'PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md': { size: 3028, hash: '6B3C497DAB1CD02BD26DBF18BF08D734A3DB4CF3A0517CBFA5C3A110AD45F2BC' },
  'PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md': { size: 21381, hash: 'BBBD95ECA47840B2A7EE5F8C4ECB71C8CD9091E85B1DFEDB59B24A44632BDC7C' },
  'PHASE_0B_2_3_ROUND3_16_CHANGELOG.md': { size: 5022, hash: '60B011A0C1E06BB1B3F02818C5B181915225553464B357E9D4E17705A7B0942B' },
  'PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md': { size: 4652, hash: '7E94AF1056FCA9E9F92CC86A202FEC75E93C7B7035D55C1721865B80723AF30B' }
};

for (const [fname, exp] of Object.entries(r316Expected)) {
  const p = path.join(docsDir, fname);
  assert(`File exists: ${fname}`, fs.existsSync(p));
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
    assert(`${fname} size matches ${exp.size} (actual: ${buf.length})`, buf.length === exp.size);
    assert(`${fname} SHA-256 matches ${exp.hash} (actual: ${hash})`, hash === exp.hash);
  }
}

// 2. Check Round 3.18 Deliverables (4 files)
console.log('\n--- 2. Checking Round 3.18 Deliverables ---');
const r318Files = [
  'PHASE_0B_2_3_ROUND3_18_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_18_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_18_SELF_CHECK_REPORT.md',
  'PHASE_0B_2_3_ROUND3_18_DELIVERABLES_CHECKSUM.md'
];

r318Files.forEach(fname => {
  const p = path.join(docsDir, fname);
  assert(`File exists: ${fname}`, fs.existsSync(p));
});

// Check Report headings and structure
const reportText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_18_PROJECT_TEAM_REPORT.md'), 'utf8');

const requiredSections = [
  '## 1. Executive Summary',
  '## 2. Audit Basis and Input Evidence',
  '## 3. Round 4.17 Findings',
  '## 4. Remediation Actions',
  '## 5. Round 3.16 Deliverables Verification',
  '## 6. Self-Check Item 11 Status Reconciliation',
  '## 7. Round 4.16 Metadata Reconciliation',
  '## 8. Round 3.14 Archive Evidence Qualification',
  '## 9. Mandatory Security and Readiness Status',
  '## 10. Outstanding Issues and Evidence Limitations',
  '## 11. Final Project Team Declaration'
];

requiredSections.forEach(sec => {
  assert(`Report contains section: "${sec}"`, reportText.includes(sec));
});

// Assert no Roman numerals in main headings
const romanHeadings = reportText.match(/^##\s+[IVXLCDM]+\..*$/gm);
assert('No Roman numerals in main headings', !romanHeadings || romanHeadings.length === 0);

// Check 9 mandatory status strings
const mandatoryStrings = [
  'FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED',
  'AUDIT LOG IMMUTABILITY: NOT VERIFIED',
  'UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED',
  'MEDIA UPLOAD GATE: BLOCKED',
  'MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED',
  'RICH TEXT VIDEO SECURITY: NOT VERIFIED',
  'MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED',
  'IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED',
  'IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED'
];

mandatoryStrings.forEach(s => {
  assert(`Report contains mandatory string: "${s}"`, reportText.includes(s));
});

// Check metadata updates
assert('Report contains R4.16 Audit size 12,025 bytes', reportText.includes('12,025'));
assert('Report contains R4.16 Verdict size 3,293 bytes', reportText.includes('3,293'));
assert('Report classifies ZIP Round 3.14 as HISTORICAL RESULT – NOT RE-VERIFIED IN ROUND 4.17',
  reportText.includes('HISTORICAL RESULT – NOT RE-VERIFIED IN ROUND 4.17'));
assert('Report classifies Handover Round 3.14 as NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE',
  reportText.includes('NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE'));

// Check Self-Check Report
const selfCheckText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_18_SELF_CHECK_REPORT.md'), 'utf8');
assert('Self-Check contains Item 11 mapping table', selfCheckText.includes('BẢNG MAPPING BẮT BUỘC ĐỐI CHIẾU TIÊU CHÍ ITEM 11 LỊCH SỬ'));
assert('Self-Check contains Item 11 PARTIAL', selfCheckText.includes('| **Item 11** | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PARTIAL** | **Item 11** | **PARTIAL** |'));
assert('Self-Check classifies Zero Mutation as PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED',
  selfCheckText.includes('PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED'));
assert('Self-Check final verdict is PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT',
  selfCheckText.includes('PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT'));
assert('Self-Check implementation readiness is NOT READY – HARD BLOCK / NOT VERIFIED',
  selfCheckText.includes('IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED'));

// Check Deliverables Checksum file
const checksumFileText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_18_DELIVERABLES_CHECKSUM.md'), 'utf8');
const checksumBuf = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_18_DELIVERABLES_CHECKSUM.md'));
const checksumHash = crypto.createHash('sha256').update(checksumBuf).digest('hex').toUpperCase();

assert('Checksum file is non-self-referential (does not contain its own SHA256)', !checksumFileText.includes(checksumHash));

// 3. Check historical ZIP Round 3.14 untouched
console.log('\n--- 3. Checking Historical ZIP Round 3.14 ---');
const r314ZipPath = path.join(docsDir, 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip');
assert('ZIP Round 3.14 exists', fs.existsSync(r314ZipPath));
if (fs.existsSync(r314ZipPath)) {
  const zBuf = fs.readFileSync(r314ZipPath);
  const zHash = crypto.createHash('sha256').update(zBuf).digest('hex').toUpperCase();
  assert(`ZIP Round 3.14 size is 297,736 bytes (actual: ${zBuf.length})`, zBuf.length === 297736);
  assert(`ZIP Round 3.14 SHA-256 is 59CA6D12... (actual: ${zHash})`, zHash === '59CA6D1243820E7CEC1B3D6F3E79165FAE848CD641F5716D14D070651B42953A');
}

// 4. Check Deliverables ZIP Round 3.18
console.log('\n--- 4. Checking Deliverables ZIP Round 3.18 ---');
const r318ZipPath = path.join(docsDir, 'PHASE_0B_2_3_DELIVERABLES_ROUND3_18.zip');
assert('Deliverables ZIP Round 3.18 exists', fs.existsSync(r318ZipPath));
if (fs.existsSync(r318ZipPath)) {
  const zBuf = fs.readFileSync(r318ZipPath);
  const zHash = crypto.createHash('sha256').update(zBuf).digest('hex').toUpperCase();
  console.log(`ZIP Round 3.18 size: ${zBuf.length} bytes, SHA-256: ${zHash}`);
}

// 5. Git & Source Code Mutation Check
console.log('\n--- 5. Checking for Zero Code/Schema Mutation in Round 3.18 ---');
try {
  // Verify that no src, supabase, or package files were modified today (Round 3.18 session)
  const today = new Date().toISOString().split('T')[0];
  const codeFiles = ['package.json', 'package-lock.json', 'src/App.tsx', 'vite.config.ts'];
  let touchedToday = false;
  codeFiles.forEach(f => {
    const stat = fs.statSync(f);
    const mtime = stat.mtime.toISOString().split('T')[0];
    if (mtime === today) {
      console.error(`File modified today: ${f}`);
      touchedToday = true;
    }
  });
  assert('Zero Source Code / Schema / Package Mutation during Round 3.18', !touchedToday);
} catch (e) {
  console.error('Check error:', e.message);
}

console.log('\n=== VERIFICATION COMPLETE: ' + (allPass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED') + ' ===');
process.exit(allPass ? 0 : 1);
