const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_11');
const files = fs.readdirSync(stagingDir).filter(f => f.endsWith('.md'));

const targetPatterns = [
  /VERIFICATION COMPLETE/i,
  /khắc phục triệt để/i,
  /đã xử lý hoàn toàn/i,
  /loại bỏ hoàn toàn/i,
  /chính xác tuyệt đối/i,
  /bảo toàn 100%/i,
  /zero regression/i,
  /fully resolved/i,
  /independently verified/i,
  /100% compliant/i
];

console.log(`Scanning ${files.length} markdown files in staging...`);

files.forEach(f => {
  const content = fs.readFileSync(path.join(stagingDir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    targetPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        console.log(`[${f}:${idx + 1}] Matched ${pattern}: ${line.trim().slice(0, 120)}`);
      }
    });
  });
});
