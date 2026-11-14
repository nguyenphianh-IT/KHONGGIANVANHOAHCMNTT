const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('21/21')) {
      console.log(`${f} [L${idx + 1}]: ${line.trim()}`);
    }
  });
});
