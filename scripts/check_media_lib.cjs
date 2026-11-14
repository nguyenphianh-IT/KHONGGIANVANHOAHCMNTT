const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8', 'PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
console.log('--- Lines 20-40 ---');
console.log(lines.slice(19, 40).join('\n'));
console.log('--- Step 6 lines ---');
lines.forEach((l, idx) => {
  if (l.includes('Bước 6') || l.includes('Step 6') || l.includes('409') || l.includes('PROPOSED')) {
    console.log(`L${idx+1}: ${l}`);
  }
});
