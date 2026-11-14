const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');
const docsDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');

const finalSize = '209,460';
const finalHash = 'CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693';

// 1. Copy and update PHASE_0B_2_3_ROUND3_9_HANDOVER.md in docs/phase-0b-2/
let handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), 'utf8');
handover = handover.replace(/358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE/g, finalHash);
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), handover, 'utf8');
console.log('Published docs/phase-0b-2/PHASE_0B_2_3_ROUND3_9_HANDOVER.md');

// 2. Copy and update PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md in docs/phase-0b-2/
let report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), 'utf8');
report = report.replace(/358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE/g, finalHash);
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), report, 'utf8');
console.log('Published docs/phase-0b-2/PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md');

// 3. Copy PHASE_0B_2_3_ROUND3_9_MANIFEST.md in docs/phase-0b-2/
let manifest = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_MANIFEST.md'), 'utf8');
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_9_MANIFEST.md'), manifest, 'utf8');
console.log('Published docs/phase-0b-2/PHASE_0B_2_3_ROUND3_9_MANIFEST.md');
