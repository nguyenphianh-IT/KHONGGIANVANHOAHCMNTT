const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');
const targetFiles = [
  'PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_10.zip',
  'PHASE_0B_2_3_ROUND3_10_EXTERNAL_HANDOVER.md',
  'PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md',
  'PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_10.md'
];

console.log('Checking input gate for Round 3.11 in docs/phase-0b-2:');
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

console.log('\nSearching for any 4_10 or round4_10 or verdict files across docs and brain...');
function search(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      if (f === 'node_modules' || f === '.git') continue;
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        search(full);
      } else {
        if (f.toLowerCase().includes('4_10') || f.toLowerCase().includes('round4_10') || f.toLowerCase().includes('4.10')) {
          console.log(`Found candidate: ${full} (${stat.size} bytes)`);
        }
      }
    }
  } catch(e) {}
}

search('d:/Web/Không gian văn hoá HCM/docs');
search('C:/Users/NPA/.gemini/antigravity/brain/4110eb2e-e5b9-4e7c-bf2e-cc3501d75a0a');
