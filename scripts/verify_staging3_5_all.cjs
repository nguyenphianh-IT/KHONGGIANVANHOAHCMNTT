const fs = require('fs');
const path = require('path');

const dir = 'docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_5';
const files = fs.readdirSync(dir);

console.log('Total files in directory:', files.length);

let nonMd = 0;
let emptyFiles = 0;
files.forEach((f, idx) => {
  if (!f.endsWith('.md')) nonMd++;
  const stat = fs.statSync(path.join(dir, f));
  if (stat.size === 0) emptyFiles++;
  console.log(`${idx+1}. ${f} | ${stat.size} bytes`);
});

console.log(`Summary: Non-MD = ${nonMd}, Empty = ${emptyFiles}`);
