const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');

// 1. Update PHASE_0B_2_3_ROUND3_8_HANDOVER.md
let handover38 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), 'utf8');
handover38 = handover38.replace(
  /E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A/g,
  '8608A90782386454C0C2B6743914EB325E8F0D19AB73C509D77AC45AF982A8D1'
);
handover38 = handover38.replace(
  '### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (ARCHIVE SEALING METRICS – PROJECT TEAM SELF-COMPUTED)',
  '### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO ROUND 3.8 (HISTORICAL ARCHIVE – INDEPENDENT AUDIT ROUND 4.8 VERIFIED)'
);
handover38 = handover38.replace(
  '(Project Team self-computed; pending independent verification)',
  '(Independent Audit Round 4.8 verified; Historical archive metrics of Round 3.8, not Round 3.9)'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_HANDOVER.md'), handover38, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_8_HANDOVER.md');

// 2. Update PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md
let report38 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), 'utf8');
report38 = report38.replace(
  /E20F2E63C7B94F2911F3B03A5EBE7AF68F6E7BBA59383D1B948653639EB4E48A/g,
  '8608A90782386454C0C2B6743914EB325E8F0D19AB73C509D77AC45AF982A8D1'
);
report38 = report38.replace(
  '## 7. THÔNG SỐ NIÊM PHONG GÓI LƯU TRỮ ROUND 3.8',
  '## 7. THÔNG SỐ NIÊM PHONG GÓI LƯU TRỮ ROUND 3.8 (HISTORICAL ARCHIVE – INDEPENDENT AUDIT ROUND 4.8 VERIFIED)'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), report38, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md');

// 3. Update PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md
let r31 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md'), 'utf8');
r31 = r31.replace(
  'ALL 6 AUDIT FINDINGS (R4-01 -> R4-06): FULLY RESOLVED',
  'ALL 6 AUDIT FINDINGS (R4-01 -> R4-06): HISTORICAL PROJECT TEAM ASSERTION – REMEDIATION REPORTED (PENDING INDEPENDENT VERIFICATION)'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md'), r31, 'utf8');
console.log('Updated PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md');

// 4. Update PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md
let r32 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md'), 'utf8');
r32 = r32.replace(
  '**Kết quả kiểm chứng:** `VERIFICATION COMPLETE – ALL 6 FINDINGS FULLY RESOLVED / ZERO REGRESSION`',
  '**Kết quả kiểm chứng (Historical Project Team Assertion):** `VERIFICATION COMPLETE – ALL 6 FINDINGS REPORTED REMEDIATED BY PROJECT TEAM / ZERO REGRESSION (PENDING INDEPENDENT VERIFICATION)`'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md'), r32, 'utf8');
console.log('Updated PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md');
