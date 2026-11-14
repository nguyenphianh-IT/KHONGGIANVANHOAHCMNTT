const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const phrases = [
  'tự cấp độc lập',
  'tự cấp trực tiếp',
  'tự cấp số liệu độc lập',
  'giải quyết dứt điểm',
  'khắc phục triệt để',
  'nhất quán tuyệt đối',
  'khắc phục toàn diện',
  'fully resolved',
  'completely remediated'
];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  phrases.forEach(p => {
    if (content.toLowerCase().includes(p.toLowerCase())) {
      console.log(`Found '${p}' in ${f}`);
    }
  });
});
