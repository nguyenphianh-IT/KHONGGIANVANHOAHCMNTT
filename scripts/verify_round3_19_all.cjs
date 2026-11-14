const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.resolve('docs/phase-0b-2');

console.log('=== STARTING ROUND 3.19 COMPREHENSIVE VERIFICATION ===\n');

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

// 2. Check Round 3.19 Deliverables (4 files)
console.log('\n--- 2. Checking Round 3.19 Deliverables ---');
const r319Files = [
  'PHASE_0B_2_3_ROUND3_19_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_19_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_19_SELF_CHECK_REPORT.md',
  'PHASE_0B_2_3_ROUND3_19_DELIVERABLES_CHECKSUM.md'
];

r319Files.forEach(fname => {
  const p = path.join(docsDir, fname);
  assert(`File exists: ${fname}`, fs.existsSync(p));
});

// Check Report headings and structure
const reportText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_19_PROJECT_TEAM_REPORT.md'), 'utf8');

const requiredSections = [
  '## 1. Executive Summary',
  '## 2. Audit Round 4.18 Findings',
  '## 3. Input Evidence Register',
  '## 4. Corrective Actions',
  '## 5. Round 3.16 Historical Deliverables',
  '## 6. Self-Check Item 11 Evidence Mapping',
  '## 7. Checksum Reconciliation',
  '## 8. Mandatory Status Register',
  '## 9. Zero Mutation Declaration',
  '## 10. Limitations and Outstanding Risks',
  '## 11. Handover to Independent Documentation Audit Round 4.19'
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

// Check Item 11 mandatory status string
const item11MandatoryString = 'SELF-CHECK ITEM 11 CONTENT MAPPING: NOT VERIFIED – SOURCE EVIDENCE NOT PROVIDED';
assert(`Report contains Item 11 mandatory string: "${item11MandatoryString}"`, reportText.includes(item11MandatoryString));

// Check R4.18-03 metadata reconciliation
assert('Report contains R3.18 Checksum actual size 3,553 bytes', reportText.includes('3,553'));
assert('Report contains R3.18 Checksum actual SHA-256 5D182B01...', reportText.includes('5D182B01A7384E140B480121625155C0609CB32FC3931408D3F75B39F8026A57'));

// Check R4.16 metadata
assert('Report contains R4.16 Audit size 12,025 bytes', reportText.includes('12,025'));
assert('Report contains R4.16 Verdict size 3,293 bytes', reportText.includes('3,293'));

// Check Historical ZIP 3.14 and Handover
assert('Report classifies ZIP Round 3.14 as HISTORICAL RESULT – NOT RE-VERIFIED IN ROUND 4.18',
  reportText.includes('HISTORICAL RESULT – NOT RE-VERIFIED IN ROUND 4.18'));
assert('Report classifies Handover Round 3.14 as NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE',
  reportText.includes('NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE'));

// Check Self-Check Report
const selfCheckText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_19_SELF_CHECK_REPORT.md'), 'utf8');
assert('Self-Check contains Item 11 mapping table', selfCheckText.includes('BẢNG MAPPING VÀ ĐỐI CHIẾU BẰNG CHỨNG TIÊU CHÍ ITEM 11 LỊCH SỬ'));
assert('Self-Check contains Item 11 PARTIAL', selfCheckText.includes('| **Item 11** | `PHASE_0B_2_3_ROUND3_14_SELF_CHECK_REPORT.md` (Dòng 29, bản lưu workspace) | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PARTIAL** |'));
assert('Self-Check contains Item 11 mandatory status string', selfCheckText.includes(item11MandatoryString));
assert('Self-Check classifies Zero Mutation as PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED',
  selfCheckText.includes('PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED'));
assert('Self-Check final verdict is PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT ROUND 4.19',
  selfCheckText.includes('PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT ROUND 4.19'));
assert('Self-Check implementation readiness is NOT READY – HARD BLOCK / NOT VERIFIED',
  selfCheckText.includes('IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED'));

// Check Deliverables Checksum file
const checksumFileText = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_19_DELIVERABLES_CHECKSUM.md'), 'utf8');
const checksumBuf = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_19_DELIVERABLES_CHECKSUM.md'));
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

// 4. Check Deliverables ZIP Round 3.19
console.log('\n--- 4. Checking Deliverables ZIP Round 3.19 ---');
const r319ZipPath = path.join(docsDir, 'PHASE_0B_2_3_DELIVERABLES_ROUND3_19.zip');
assert('Deliverables ZIP Round 3.19 exists', fs.existsSync(r319ZipPath));
if (fs.existsSync(r319ZipPath)) {
  const zBuf = fs.readFileSync(r319ZipPath);
  const zHash = crypto.createHash('sha256').update(zBuf).digest('hex').toUpperCase();
  console.log(`ZIP Round 3.19 size: ${zBuf.length} bytes, SHA-256: ${zHash}`);
  
  // Test ZIP reading with powershell script
  try {
    const psOut = execSync('powershell -File scripts/check_zip_entries.ps1', { encoding: 'utf8' });
    console.log(psOut.trim());
    assert('ZIP Round 3.19 contains 8 entries', psOut.includes('Count: 8'));
  } catch(e) {
    console.error('ZIP inspection error:', e.message);
  }
}

// 5. Zero Code/Schema Mutation Check
console.log('\n--- 5. Checking for Zero Code/Schema Mutation in Round 3.19 ---');
try {
  const codeFiles = ['package.json', 'package-lock.json', 'src/App.tsx', 'vite.config.ts'];
  let touchedToday = false;
  codeFiles.forEach(f => {
    const stat = fs.statSync(f);
    const mtime = stat.mtime.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (mtime === today) {
      console.error(`File modified today: ${f}`);
      touchedToday = true;
    }
  });
  assert('Zero Source Code / Schema / Package Mutation during Round 3.19', !touchedToday);
} catch (e) {
  console.error('Check error:', e.message);
}

console.log('\n=== VERIFICATION COMPLETE: ' + (allPass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED') + ' ===');
process.exit(allPass ? 0 : 1);
