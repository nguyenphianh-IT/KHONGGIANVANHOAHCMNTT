const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.resolve('docs/phase-0b-2');
const targetFiles = [
  'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip',
  'PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md',
  'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_11.md',
  'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_11.md'
];

console.log('Checking input gate for Round 3.12 in docs/phase-0b-2:');
let missing = [];
targetFiles.forEach(f => {
  const p = path.join(baseDir, f);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
    console.log(`FOUND: ${f} (${stat.size} bytes, SHA-256: ${hash})`);
  } else {
    console.log(`MISSING: ${f}`);
    missing.push(f);
  }
});

if (missing.length === 0) {
  console.log('\nINPUT GATE 3.12: 100% PASS');
} else {
  console.error('\nINPUT GATE 3.12: FAILED');
}
