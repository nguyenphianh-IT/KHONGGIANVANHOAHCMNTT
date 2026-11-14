const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

// Update placeholders in staging
let handover = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), 'utf8');
handover = handover.replace('__ZIP_SIZE__', '194,307');
handover = handover.replace('__ZIP_SHA256__', 'E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), handover, 'utf8');

// Update report in staging as well
let report = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), 'utf8');
report = report.replace('Sẽ được Project Team tự tính trực tiếp từ file ZIP cuối cùng và công bố tại Biên bản bàn giao `PHASE_0B_2_3_ROUND3_8_HANDOVER.md` (`Project Team self-computed; pending independent verification`).', '**194,307 bytes** (Project Team self-computed; pending independent verification).');
report = report.replace('Sẽ được Project Team tự tính trực tiếp từ file ZIP cuối cùng và công bố tại Biên bản bàn giao `PHASE_0B_2_3_ROUND3_8_HANDOVER.md` (`Project Team self-computed; pending independent verification`).', '`E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A` (Project Team self-computed; pending independent verification).');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), report, 'utf8');

console.log('Staging files updated with literal values.');
