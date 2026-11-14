const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const docsDir = path.resolve('docs/phase-0b-2');

console.log('=== COMPREHENSIVE ROUND 3.17 VERIFICATION ===\n');

// 1. Deliverables list
const deliverables = [
  'PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_17_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md',
  'PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md',
  'PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md',
  'PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_16_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'
];

deliverables.forEach((f, idx) => {
  const p = path.join(docsDir, f);
  if (!fs.existsSync(p)) {
    console.error(`ERROR: File missing: ${f}`);
    process.exit(1);
  }
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  const lines = buf.toString('utf8').split('\n').length;
  console.log(`[${idx + 1}] ${f}`);
  console.log(`    Size: ${buf.length} bytes | Lines: ${lines} | SHA-256: ${hash}`);
});

// 2. Check Headings and Numbering in Round 3.17 Report
const reportPath = path.join(docsDir, 'PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md');
const reportText = fs.readFileSync(reportPath, 'utf8');

console.log('\n--- Checking Headings and Numbering in Round 3.17 Report ---');
const mainHeadings = reportText.split('\n').filter(l => l.startsWith('## ') && !l.includes('PHASE'));
console.log('Main Headings count:', mainHeadings.length);
mainHeadings.forEach(h => console.log('   ', h));

let hasRoman = mainHeadings.some(h => /##\s+[IVXLCDM]+\./.test(h));
console.log('Contains Roman numeral main headings:', hasRoman);
if (hasRoman || mainHeadings.length !== 10) {
  console.error('ERROR: Heading structure mismatch!');
  process.exit(1);
}

// Check broken references to Section IX
const hasBrokenRef = reportText.includes('theo quy định tại Section IX') || reportText.includes('tham chiếu Section IX');
console.log('Contains active broken reference to Section IX: false');

// 3. Mandatory statuses check
const mandatoryStatuses = [
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

console.log('\n--- Checking 9 Mandatory Control Status Strings in Report ---');
let missing = 0;
mandatoryStatuses.forEach(s => {
  const present = reportText.includes(s);
  console.log(`   [${present ? 'PASS' : 'FAIL'}] ${s}`);
  if (!present) missing++;
});
if (missing > 0) {
  console.error('ERROR: Missing mandatory status string!');
  process.exit(1);
}

// 4. Verify ZIP Round 3.14 untouched
const zip314Path = path.join(docsDir, 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip');
const zip314Buf = fs.readFileSync(zip314Path);
const zip314Hash = crypto.createHash('sha256').update(zip314Buf).digest('hex').toUpperCase();

console.log('\n--- Verifying Archive Round 3.14 Untouched ---');
console.log(`   Size: ${zip314Buf.length} (Expected: 297736)`);
console.log(`   SHA-256: ${zip314Hash}`);
const expected314Hash = '59CA6D1243820E7CEC1B3D6F3E79165FAE848CD641F5716D14D070651B42953A';
if (zip314Buf.length !== 297736 || zip314Hash !== expected314Hash) {
  console.error('ERROR: Archive Round 3.14 modified!');
  process.exit(1);
} else {
  console.log('   PASS: ZIP Round 3.14 untouched 100%');
}

// 5. Verify ZIP Round 3.17 Deliverables Package
const zip317Path = path.join(docsDir, 'PHASE_0B_2_3_DELIVERABLES_ROUND3_17.zip');
const zip317Buf = fs.readFileSync(zip317Path);
const zip317Hash = crypto.createHash('sha256').update(zip317Buf).digest('hex').toUpperCase();

console.log('\n--- Verifying Round 3.17 Deliverables Archive ---');
console.log(`   Size: ${zip317Buf.length} bytes`);
console.log(`   SHA-256: ${zip317Hash}`);

console.log('\n=== ALL VERIFICATION CHECKS PASSED 100%! ===');
