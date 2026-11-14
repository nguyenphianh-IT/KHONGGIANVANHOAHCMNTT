const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8', 'PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (/dứt điểm|triệt để|tuyệt đối|tự cấp|operational|thực thi thành công/i.test(l)) {
    console.log(`L${idx+1}: ${l}`);
  }
});
