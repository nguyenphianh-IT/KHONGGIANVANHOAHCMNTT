const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');

let handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), 'utf8');
handover = handover.replace('__ZIP_SIZE__', '209,374');
handover = handover.replace('__ZIP_SHA256__', '358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), handover, 'utf8');

let report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), 'utf8');
report = report.replace('__ZIP_SIZE__', '209,374');
report = report.replace('__ZIP_SHA256__', '358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), report, 'utf8');

console.log('Updated staging files with 209,374 and hash.');
