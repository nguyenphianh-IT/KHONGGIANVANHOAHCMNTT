const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8', 'PHASE_0B_2_3_ROUND3_7_HANDOVER.md');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('9.'));
console.log(lines.slice(start !== -1 ? start : 0, start !== -1 ? start + 40 : 50).join('\n'));
