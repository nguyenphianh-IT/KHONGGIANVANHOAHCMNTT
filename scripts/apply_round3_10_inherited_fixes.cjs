const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_10');

// 1. Update PHASE_0B_2_3_ROUND3_9_HANDOVER.md
let handover39 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), 'utf8');
handover39 = handover39.replace(
  /358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE/g,
  'CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693'
);
handover39 = handover39.replace(
  '#### B. Thông số gói lưu trữ bàn giao Round 3.9 (Current Round 3.9 Package – Project Team Self-Computed):',
  '#### B. Thông số gói lưu trữ bàn giao Round 3.9 (Historical Round 3.9 Archive – Independent Audit Round 4.9 Verified):'
);
handover39 = handover39.replace(
  '- **Mã băm SHA-256 chính xác:** `CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693` (`PROJECT TEAM SELF-COMPUTED – PENDING INDEPENDENT VERIFICATION`)',
  '- **Mã băm SHA-256 chính xác:** `CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693` (`Independent Audit Round 4.9 verified; Historical archive metrics of Round 3.9, not Round 3.10`)'
);
handover39 = handover39.replace(
  '- **Kích thước byte chính xác:** **209,460 bytes** (`PROJECT TEAM SELF-COMPUTED – PENDING INDEPENDENT VERIFICATION`)',
  '- **Kích thước byte chính xác:** **209,460 bytes** (`Independent Audit Round 4.9 verified; Historical archive metrics of Round 3.9, not Round 3.10`)'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_HANDOVER.md'), handover39, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_9_HANDOVER.md');

// 2. Update PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md
let report39 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), 'utf8');
report39 = report39.replace(
  /358240D8979DEAB84D9916512633FA17199E700029AF75831EAB05E5D1AEAFBE/g,
  'CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693'
);
report39 = report39.replace(
  '## 7. THÔNG SỐ NIÊM PHONG GÓI LƯU TRỮ ROUND 3.9',
  '## 7. THÔNG SỐ NIÊM PHONG GÓI LƯU TRỮ ROUND 3.9 (HISTORICAL ARCHIVE – INDEPENDENT AUDIT ROUND 4.9 VERIFIED)'
);
report39 = report39.replace(
  '(Project Team self-computed from final ZIP; pending independent verification).',
  '(Independent Audit Round 4.9 verified; Historical archive metrics of Round 3.9, not Round 3.10).'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md'), report39, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_9_REMEDIATION_REPORT.md');

// 3. Update PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md
let r32 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md'), 'utf8');
r32 = r32.replace(
  '**Kết quả kiểm chứng (Historical Project Team Assertion):** `VERIFICATION COMPLETE – ALL 6 FINDINGS REPORTED REMEDIATED BY PROJECT TEAM / ZERO REGRESSION (PENDING INDEPENDENT VERIFICATION)`',
  '**Kết quả kiểm chứng (Historical Project Team Assertion):** `PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING`'
);
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md'), r32, 'utf8');
console.log('Updated PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_2.md');
