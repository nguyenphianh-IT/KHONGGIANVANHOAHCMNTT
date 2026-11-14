const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');

const handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), 'utf8');
const hLines = handover.split('\n');
const hs9 = hLines.findIndex(l => l.includes('9. THÔNG SỐ NIÊM PHONG'));
console.log('--- ROUND3_8_HANDOVER.md Section 9 ---');
console.log(hLines.slice(hs9, hs9 + 15).join('\n'));

const report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), 'utf8');
const rLines = report.split('\n');
const rs7 = rLines.findIndex(l => l.includes('7. THÔNG SỐ NIÊM PHONG'));
console.log('--- ROUND3_8_REMEDIATION_REPORT.md Section 7 ---');
console.log(rLines.slice(rs7, rs7 + 15).join('\n'));
