const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');

const auditMd = fs.readFileSync(path.join(__dirname, 'audit_round4_8_raw.txt'), 'utf8');
const verdictMd = fs.readFileSync(path.join(__dirname, 'verdict_round4_8_raw.txt'), 'utf8');

fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_8.md'), auditMd, 'utf8');
fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_8.md'), verdictMd, 'utf8');

console.log('Saved both MD files in docs/phase-0b-2!');
