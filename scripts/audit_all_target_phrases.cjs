const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();

const targets = [
  'tự cấp độc lập',
  'tự cấp trực tiếp',
  'tự cấp số liệu độc lập',
  'tự cấp số liệu',
  'tự cấp',
  'giải quyết dứt điểm',
  'khắc phục triệt để',
  'nhất quán tuyệt đối',
  'khắc phục toàn diện',
  'fully resolved',
  'completely remediated'
];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    targets.forEach(t => {
      if (line.toLowerCase().includes(t.toLowerCase())) {
        console.log(`${f} [L${idx + 1}] (${t}): ${line.trim()}`);
      }
    });
  });
});
