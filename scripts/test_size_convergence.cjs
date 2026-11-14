const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

let handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), 'utf8');
handover = handover.replace('194,307', '194,395');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), handover, 'utf8');

let report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), 'utf8');
report = report.replace('194,307', '194,395');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), report, 'utf8');

console.log('Updated 194,307 to 194,395 in staging.');
