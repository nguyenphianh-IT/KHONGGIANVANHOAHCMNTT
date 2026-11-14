const fs = require('fs');
const path = require('path');

const file = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_11/PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '**Kết quả kiểm chứng:** `VERIFICATION COMPLETE – ALL 6 FINDINGS RECONCILED / ZERO REGRESSION`',
  '**Kết quả kiểm chứng (Historical Project Team Assertion):** `PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING`'
);

content = content.replace(
  'Phương pháp kiểm chứng dựa trên bằng chứng (Evidence-based Audit) được thực hiện độc lập trên 15 tệp Markdown trong gói tài liệu `PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_1`:',
  'Phương pháp kiểm chứng dựa trên bằng chứng (Evidence-based Verification) do Project Team tự thực hiện rà soát [QUOTED LEGACY PHRASE: "thực hiện độc lập" – Tự thuật lịch sử của Project Team, không có bằng chứng độc lập xác nhận trong Round 4.10] trên 15 tệp Markdown trong gói tài liệu `PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_1`:'
);

content = content.replace(
  'Gói tài liệu **PHASE 0B.2.3 – DOCUMENTATION DELTA REMEDIATION ROUND 3.1** đã hoàn thành việc xử lý toàn bộ 6 phát hiện kiểm toán `R4-01` đến `R4-06`. Mọi số liệu toán học, thuật ngữ nghiệp vụ, ranh giới an ninh và bảng truy xuất bằng chứng đã được chuẩn hóa đồng bộ, minh bạch và chính xác tuyệt đối.',
  'Gói tài liệu **PHASE 0B.2.3 – DOCUMENTATION DELTA REMEDIATION ROUND 3.1** do Project Team tự thực hiện cập nhật theo 6 phát hiện kiểm toán `R4-01` đến `R4-06` (`PROJECT TEAM REPORTS THE DOCUMENTATION REMEDIATION AS COMPLETED – PENDING INDEPENDENT VERIFICATION`). Mọi số liệu toán học, thuật ngữ nghiệp vụ, ranh giới an ninh và bảng truy xuất bằng chứng đã được chuẩn hóa đồng bộ theo báo cáo tự rà soát của Project Team.'
);

content = content.replace(
  'DOCUMENTATION DELTA REMEDIATION ROUND 3.1: COMPLETE',
  'DOCUMENTATION DELTA REMEDIATION ROUND 3.1: HISTORICAL PROJECT TEAM SELF-REPORT (PENDING INDEPENDENT VERIFICATION)'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated ROUND3_1.md successfully');
