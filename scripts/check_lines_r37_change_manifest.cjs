const fs = require('fs');
const path = require('path');
['PHASE_0B_2_3_ROUND3_7_CHANGELOG.md', 'PHASE_0B_2_3_ROUND3_7_FILE_MANIFEST.md'].forEach(f => {
  const file = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8', f);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`=== ${f} ===`);
  lines.forEach((l, idx) => {
    if (/tự cấp|dứt điểm|triệt để|nhất quán tuyệt đối|toàn diện|độc lập/i.test(l)) {
      console.log(`L${idx+1}: ${l}`);
    }
  });
});
