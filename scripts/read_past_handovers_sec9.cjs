const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

['PHASE_0B_2_3_ROUND3_5_HANDOVER.md', 'PHASE_0B_2_3_ROUND3_6_HANDOVER.md'].forEach(f => {
  const content = fs.readFileSync(path.join(stagingDir, f), 'utf8');
  const lines = content.split('\n');
  const s9 = lines.findIndex(l => l.includes('9.'));
  console.log(`=== ${f} ===`);
  if (s9 !== -1) {
    console.log(lines.slice(s9, s9 + 15).join('\n'));
  }
});
