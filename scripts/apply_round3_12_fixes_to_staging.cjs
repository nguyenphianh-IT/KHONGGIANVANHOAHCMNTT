const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_12');

// 1. Fix ROUND3_11_REMEDIATION_REPORT.md
const r311ReportPath = path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md');
let r311Report = fs.readFileSync(r311ReportPath, 'utf8');

r311Report = r311Report.replace(
  'Tiếp tục duy trì triệt để kiến trúc bàn giao 2 lớp:',
  'Tiếp tục duy trì kiến trúc bàn giao 2 lớp:'
);

r311Report = r311Report.replace(
  'Xử lý dứt điểm các nhận định lịch sử còn tồn tại trong `PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md`.',
  'Hiệu chỉnh các nhận định lịch sử còn tồn tại trong `PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md` theo khuyến nghị của kiểm toán.'
);

r311Report = r311Report.replace(
  'Rà soát và chuẩn hóa toàn bộ các câu tự thuật trong tài liệu Round 3.11.',
  'Rà soát và chuẩn hóa các câu tự thuật trong tài liệu Round 3.11 theo phạm vi phát hiện.'
);

fs.writeFileSync(r311ReportPath, r311Report, 'utf8');
console.log('Fixed PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md');

// 2. Fix ROUND3_11_DOCUMENTATION_SELF_CHECK.md
const r311SelfCheckPath = path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md');
let r311SelfCheck = fs.readFileSync(r311SelfCheckPath, 'utf8');

r311SelfCheck = r311SelfCheck.replace(
  'Tự kiểm tra độc lập 15 tiêu chí chất lượng kỹ thuật',
  'Tự kiểm tra nội bộ 15 tiêu chí chất lượng kỹ thuật'
);

r311SelfCheck = r311SelfCheck.replace(
  '| Chặn hoàn toàn nguy cơ giả mạo phê duyệt độc lập. |',
  '| Hạn chế nguy cơ giả mạo phê duyệt độc lập trong phạm vi kiểm soát tài liệu. |'
);

r311SelfCheck = r311SelfCheck.replace(
  '| 11 | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PASS** | Thay thế các cụm từ khẳng định tuyệt đối (`khắc phục triệt để 4 phát hiện`, `loại bỏ hoàn toàn`, `chính xác tuyệt đối`) bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng. | Tuân thủ nghiêm ngặt phát hiện R4.10-05. |',
  '| 11 | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PARTIAL** | Project Team đã rà soát và thay thế các cụm từ khẳng định tuyệt đối được chỉ ra; tuy nhiên, theo kết luận kiểm toán Round 4.11 (R4.11-01), việc rà soát từ khóa tự động không cấu thành bằng chứng độc lập rằng mọi câu chữ trong toàn bộ hồ sơ kế thừa đều đã được chuẩn hóa. | Cần tiếp tục đối soát độc lập trong các đợt kiểm toán tiếp theo. |'
);

r311SelfCheck = r311SelfCheck.replace(
  '| Tránh triệt để nghịch lý đệ quy checksum (R4.9-01, R4.10-01). |',
  '| Tránh nghịch lý đệ quy checksum (R4.9-01, R4.10-01). |'
);

r311SelfCheck = r311SelfCheck.replace(
  '- **Tổng số hạng mục kiểm tra kỹ thuật:** 15 / 15 hạng mục đạt chuẩn cấp độ tài liệu Markdown (`PROJECT TEAM SELF-CHECK PASS`).',
  '- **Tổng số hạng mục kiểm tra kỹ thuật:** 14 PASS / 1 PARTIAL (Mục 11 - Absolute assertions theo R4.11-01).'
);

r311SelfCheck = r311SelfCheck.replace(
  '**`PROJECT TEAM DOCUMENTATION SELF-CHECK: COMPLETED – PENDING INDEPENDENT AUDIT`**',
  '**`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT`**'
);

fs.writeFileSync(r311SelfCheckPath, r311SelfCheck, 'utf8');
console.log('Fixed PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md');

// 3. Update external handover 3.11 in docs/phase-0b-2
const extHandover311Path = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md');
if (fs.existsSync(extHandover311Path)) {
  let ext311 = fs.readFileSync(extHandover311Path, 'utf8');
  ext311 = ext311.replace(
    'Nguyên tắc loại trừ hoàn toàn đệ quy mã băm (Eliminate Self-Referential Checksum Loop):',
    'Nguyên tắc loại trừ đệ quy mã băm (Eliminate Self-Referential Checksum Loop):'
  );
  fs.writeFileSync(extHandover311Path, ext311, 'utf8');
  console.log('Fixed PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md');
}
