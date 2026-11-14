const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const docsDir = path.resolve('docs/phase-0b-2');

const round316Files = [
  'PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md',
  'PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_16_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'
];

console.log('=== VERIFYING ROUND 3.16 DELIVERABLES ===\n');

round316Files.forEach(f => {
  const p = path.join(docsDir, f);
  if (!fs.existsSync(p)) {
    console.error(`File missing: ${f}`);
    process.exit(1);
  }
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  const lines = buf.toString('utf8').split('\n').length;
  console.log(`${f}:`);
  console.log(`   - Size: ${buf.length} bytes`);
  console.log(`   - SHA-256: ${hash}`);
  console.log(`   - Lines (split \\n): ${lines}`);
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    console.error(`   ERROR: BOM detected in ${f}`);
    process.exit(1);
  }
});

// Check mandatory statuses in Round 3.16 Project Team Report
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

const reportContent = fs.readFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md'), 'utf8');
console.log('\n=== CHECKING MANDATORY STATUSES IN ROUND 3.16 REPORT ===');
let missing = 0;
mandatoryStatuses.forEach(s => {
  const has = reportContent.includes(s);
  console.log(`   - [${has ? 'PRESENT' : 'MISSING'}] ${s}`);
  if (!has) missing++;
});

if (missing > 0) {
  console.error('ERROR: Mandatory statuses missing in report!');
  process.exit(1);
}

// Verify ZIP Round 3.14 untouched
const zipPath = path.join(docsDir, 'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip');
const zipBuf = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuf).digest('hex').toUpperCase();
console.log('\n=== VERIFYING ZIP ROUND 3.14 UNTOUCHED ===');
console.log(`   - Actual Size: ${zipBuf.length} (Expected: 297736)`);
console.log(`   - Actual SHA-256: ${zipHash}`);
const expectedZipHash = '59CA6D1243820E7CEC1B3D6F3E79165FAE848CD641F5716D14D070651B42953A';
if (zipBuf.length !== 297736 || zipHash !== expectedZipHash) {
  console.error('ERROR: ZIP Round 3.14 was modified!');
  process.exit(1);
} else {
  console.log('   - PASS: ZIP Round 3.14 untouched 100%!');
}

console.log('\n=== ALL ROUND 3.16 CHECKS PASSED 100%! ===');
