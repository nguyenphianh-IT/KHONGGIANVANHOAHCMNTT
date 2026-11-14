const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');
const docsDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');

const finalSize = '194,395';
const finalHash = '8608A90782386454C0C2B6743914EB325E8F0D19AB73C509D77AC45AF982A8D1';

// 1. Copy and update PHASE_0B_2_3_ROUND3_8_HANDOVER.md
let handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), 'utf8');
handover = handover.replace(/E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A/g, finalHash);
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), handover, 'utf8');
console.log('Written docs/phase-0b-2/PHASE_0B_2_3_ROUND3_8_HANDOVER.md');

// 2. Copy and update PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md
let report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), 'utf8');
report = report.replace(/E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A/g, finalHash);
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), report, 'utf8');
console.log('Written docs/phase-0b-2/PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md');

// 3. Copy PHASE_0B_2_3_ROUND3_8_MANIFEST.md
let manifest = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_MANIFEST.md'), 'utf8');
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_8_MANIFEST.md'), manifest, 'utf8');
console.log('Written docs/phase-0b-2/PHASE_0B_2_3_ROUND3_8_MANIFEST.md');
