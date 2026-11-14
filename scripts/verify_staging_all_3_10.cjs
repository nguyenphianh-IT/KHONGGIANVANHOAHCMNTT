const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_10');
const files = fs.readdirSync(stagingDir).filter(f => f.endsWith('.md')).sort();

console.log('File count in staging:', files.length);

let emptyCount = 0;
let utf8Pass = true;

files.forEach(f => {
  const p = path.join(stagingDir, f);
  const buf = fs.readFileSync(p);
  if (buf.length === 0) {
    console.error('Empty file found:', f);
    emptyCount++;
  }
  try {
    const text = buf.toString('utf8');
    if (text.includes('\uFFFD')) {
      console.error('UTF-8 decoding error in file:', f);
      utf8Pass = false;
    }
  } catch (e) {
    console.error('Error reading UTF-8 in file:', f, e.message);
    utf8Pass = false;
  }
});

console.log('Empty files:', emptyCount);
console.log('UTF-8 Validation:', utf8Pass ? 'PASS' : 'FAIL');
