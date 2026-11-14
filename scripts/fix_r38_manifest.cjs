const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_9');

let manifest38 = fs.readFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_MANIFEST.md'), 'utf8');

// Update summary text
manifest38 = manifest38.replace(
  '2. **Nhóm đặc tả thiết kế và kiến trúc (Architecture & Design Specs):** 5 tệp (`ADMIN_DASHBOARD`, `AI_ASSISTANT_SPEC`, `ARCHITECTURE_COMPATIBILITY`, `FULL_SCREEN_EDITOR`, `PERMISSION_MATRIX`, `UX_UI_DESIGN_SPEC`, `IMPLEMENTATION_ROADMAP`, `PROJECT_CURRENT_STATE_ASSESSMENT`).',
  '2. **Nhóm đặc tả thiết kế và kiến trúc (Architecture & Design Specs):** 8 tệp (`ADMIN_DASHBOARD`, `AI_ASSISTANT_SPEC`, `ARCHITECTURE_COMPATIBILITY`, `FULL_SCREEN_EDITOR`, `PERMISSION_MATRIX`, `UX_UI_DESIGN_SPEC`, `IMPLEMENTATION_ROADMAP`, `PROJECT_CURRENT_STATE_ASSESSMENT`).'
);

manifest38 = manifest38.replace(
  '3. **Nhóm hồ sơ kiểm chứng và báo cáo lịch sử (Historical Audit & Verification Dossiers):** 30 tệp từ các vòng Round 3.0 đến Round 3.7',
  '3. **Nhóm hồ sơ kiểm chứng và báo cáo lịch sử (Historical Audit & Verification Dossiers):** 27 tệp từ các vòng Round 3.0 đến Round 3.7 (khớp chính xác 42 tệp: 4 cốt lõi + 8 kiến trúc + 27 lịch sử + 3 tài liệu mới R3.8 = 42 tệp)'
);

// Fix row 39 line count in table: from 2 to actual line count
const currentLines = manifest38.split('\n').length;
manifest38 = manifest38.replace(
  '| 39 | `PHASE_0B_2_3_ROUND3_8_MANIFEST.md` | 2 |',
  `| 39 | \`PHASE_0B_2_3_ROUND3_8_MANIFEST.md\` | ${currentLines} |`
);

fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_MANIFEST.md'), manifest38, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_8_MANIFEST.md summary and line count to:', currentLines);
