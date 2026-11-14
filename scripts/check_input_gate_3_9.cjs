const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');
const targetFiles = [
  'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_8.zip',
  'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_8.md',
  'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_8.md'
];

console.log('Checking input gate for Round 3.9 in docs/phase-0b-2:');
let missing = [];
targetFiles.forEach(f => {
  const p = path.join(baseDir, f);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
    console.log(`FOUND: ${f} (${stat.size} bytes, SHA-256: ${hash})`);
  } else {
    console.log(`MISSING: ${f}`);
    missing.push(f);
  }
});

if (missing.length > 0) {
  console.log('Searching entire workspace for missing files...');
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === '.gemini') continue;
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else {
          missing.forEach(m => {
            if (file === m) {
              console.log(`FOUND IN WORKSPACE: ${fullPath} (${stat.size} bytes)`);
            }
          });
        }
      } catch (e) {}
    }
  }
  walk(path.join(__dirname, '..'));
}
