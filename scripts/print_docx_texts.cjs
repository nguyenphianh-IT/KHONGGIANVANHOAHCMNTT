const fs = require('fs');

const audit = fs.readFileSync('d:/Web/Không gian văn hoá HCM/scripts/audit_round4_8_raw.txt', 'utf8');
console.log('=== AUDIT REPORT ROUND 4.8 ===');
console.log(audit);

const verdict = fs.readFileSync('d:/Web/Không gian văn hoá HCM/scripts/verdict_round4_8_raw.txt', 'utf8');
console.log('=== VERDICT ROUND 4.8 ===');
console.log(verdict);
