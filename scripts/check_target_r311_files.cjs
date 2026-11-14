const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_12');
const targetFiles = [
  'PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md',
  'PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md',
  'PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md',
  'PHASE_0B_2_3_ROUND3_11_MANIFEST.md'
];

targetFiles.forEach(f => {
  const p = path.join(stagingDir, f);
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  console.log(`=== ${f} ===`);
  content.split('\n').forEach((line, i) => {
    if (line.includes('dứt điểm') || line.includes('toàn diện') || line.includes('hoàn toàn') || line.includes('triệt để')) {
      console.log(`  Line ${i+1}: ${line.trim()}`);
    }
  });
});
