const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');
const files = fs.readdirSync(dir).sort();
files.forEach((f, idx) => {
  console.log((idx + 1) + '. ' + f);
});
