const fs = require('fs');
const path = require('path');

const audit = fs.readFileSync(path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_9.md'), 'utf8');
console.log('=== AUDIT REPORT ROUND 4.9 ===');
console.log(audit);

const verdict = fs.readFileSync(path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_9.md'), 'utf8');
console.log('=== VERDICT ROUND 4.9 ===');
console.log(verdict);
