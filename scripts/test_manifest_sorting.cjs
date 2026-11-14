const fs = require('fs');
const staging = 'docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_14';
const lines = fs.readFileSync(staging + '/PHASE_0B_2_3_ROUND3_13_MANIFEST.md', 'utf8').split('\n');
const rows = lines.filter(l => l.startsWith('|') && !l.includes('Tên Tệp') && !l.includes(':---:'));
const filenames = rows.map(r => r.split('|')[2].trim().replace(/`/g, ''));
console.log('Total files in table:', filenames.length);
const sorted = [...filenames].sort();
let match = true;
for (let i = 0; i < filenames.length; i++) {
  if (filenames[i] !== sorted[i]) {
    match = false;
    console.log('Mismatch at ' + i + ': ' + filenames[i] + ' vs ' + sorted[i]);
    break;
  }
}
console.log('Alphabetically sorted:', match);
