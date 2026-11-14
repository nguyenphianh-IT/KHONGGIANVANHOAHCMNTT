const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');

['PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md', 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md'].forEach(f => {
  const p = path.join(stagingDir, f);
  const text = fs.readFileSync(p, 'utf8');
  const lines = text.split('\n');
  console.log(`=== ${f} ===`);
  lines.forEach((l, idx) => {
    if (l.toLowerCase().includes('fully resolved')) {
      console.log(`L${idx+1}: ${l}`);
    }
  });
});
