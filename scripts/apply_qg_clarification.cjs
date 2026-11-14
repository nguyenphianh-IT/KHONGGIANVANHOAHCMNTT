const fs = require('fs');
const path = require('path');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

function updateFile(fileName, replacements) {
  const filePath = path.join(stagingDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      console.log(`Updated ${fileName} for target "${target.substring(0, 30)}..."`);
    } else {
      console.warn(`[WARN] Target not found in ${fileName}: "${target.substring(0, 30)}..."`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

updateFile('PHASE_0B_2_3_ROUND3_7_REMEDIATION_REPORT.md', [
  [
    '### A. Chiều 1: Kết Quả Rà Soát Tài Liệu Của Nhóm Dự Án (Project Team Document Review Result):',
    '### A. Chiều 1: Kết Quả Tự Rà Soát Tài Liệu Của Nhóm Dự Án (Project Team Document-Level Self-Check / Self-Assessment):\n> [!NOTE]\n> Kết quả 21/21 `DOCUMENT-LEVEL CHECK PASS` là kết quả tự đánh giá (Self-Assessment) của Project Team về mặt cấu trúc và tính nhất quán của tài liệu Markdown, hoàn toàn KHÔNG PHẢI là phán quyết kiểm toán độc lập (Independent Documentation Audit). Phân biệt rạch ròi giữa Document-Level Self-Check với Independent Documentation Audit, Source/Repository Verification và Runtime/Implementation Validation.'
  ]
]);

updateFile('PHASE_0B_2_3_ROUND3_7_HANDOVER.md', [
  [
    'QG-10 được phân loại đạt `DOCUMENT-LEVEL CHECK PASS` ở chiều tài liệu (21/21 PASS) vì ma trận 11 bước và Section 1.1 C có cấu trúc hoàn chỉnh, không còn mâu thuẫn nội tại; chiều kiểm chứng độc lập duy trì `NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)`',
    'QG-10 được phân loại đạt `DOCUMENT-LEVEL CHECK PASS` ở chiều tài liệu theo tự đánh giá nội bộ của Project Team (Project Team Document-Level Self-Check: 21/21 PASS) vì ma trận 11 bước và Section 1.1 C có cấu trúc hoàn chỉnh; chiều kiểm chứng độc lập duy trì `NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)`'
  ]
]);
