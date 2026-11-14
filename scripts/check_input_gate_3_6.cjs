const fs = require('fs');
const crypto = require('crypto');

const files = [
  'docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_5.zip',
  'docs/phase-0b-2/PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_5.md',
  'docs/phase-0b-2/PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_5.md'
];

files.forEach((f, idx) => {
  if (fs.existsSync(f)) {
    const data = fs.readFileSync(f);
    const hash = crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
    console.log(`FILE ${idx+1}: ${f} | Bytes: ${data.length} | SHA256: ${hash}`);
  } else {
    console.log(`FILE ${idx+1}: ${f} | NOT FOUND`);
  }
});
