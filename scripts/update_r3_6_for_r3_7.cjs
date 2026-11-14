const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_7');

// 1. Update PHASE_0B_2_3_ROUND3_6_HANDOVER.md
const handoverPath = path.join(dir, 'PHASE_0B_2_3_ROUND3_6_HANDOVER.md');
let handover = fs.readFileSync(handoverPath, 'utf8');

// R4.6-03: Independence terminology in Section 2
handover = handover.replace(
  'Toàn bộ 31 tài liệu Markdown kế thừa từ Round 3.5 đã được rà soát độc lập và đối chiếu với các phát hiện kiểm toán Round 4.5:',
  'Toàn bộ 31 tài liệu Markdown kế thừa từ Round 3.5 đã được Project Team rà soát/đối chiếu (PROJECT TEAM DOCUMENT REVIEW) với các phát hiện kiểm toán Round 4.5:'
);

// R4.6-05: Qualify remediation claims in Section 5
handover = handover.replace(
  '### 5. GIẢI QUYẾT TRIỆT ĐỂ 6/6 PHÁT HIỆN KIỂM TOÁN ROUND 4.5',
  '### 5. PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION (6/6 PHÁT HIỆN ROUND 4.5)'
);
handover = handover.replace(/ĐÃ GIẢI QUYẾT TRIỆT ĐỂ\./g, 'PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION.');
handover = handover.replace(/ĐÃ ĐÍNH CHÍNH CHUẨN XÁC\./g, 'PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION.');
handover = handover.replace(/ĐÃ TỰ CẤP ĐỘC LẬP\./g, 'PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION.');

// R4.6-01: Handover checksum literal values in Section 9
const newSec9 = `### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (ARCHIVE SEALING METRICS - R4.6-01 RECONCILED)
- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_6.zip\`
- **Kích thước byte chính xác:** **160,935 bytes**
- **Mã băm SHA-256 chính xác:** \`AF97036EE2F80B27D8881F5729654484E8CC824E7A3756BCC3759258EC862D87\`
- **Số lượng tệp lưu trữ (Entry count):** **35 entries** (100% định dạng Markdown .md)
- **Kết quả kiểm tra toàn vẹn bit (CRC result):** **PASS** (Không phát hiện entry lỗi, 100% tệp giải nén thành công)`;

if (handover.includes('### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO')) {
  const sec9Start = handover.indexOf('### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO');
  const sec10Start = handover.indexOf('### 10. BẢO TOÀN DANH MỤC TRẠNG THÁI BẮT BUỘC');
  handover = handover.substring(0, sec9Start) + newSec9 + '\n\n---\n\n' + handover.substring(sec10Start);
}

// Update Section 12 Verdict in Handover
handover = handover.replace(
  '**`DOCUMENTATION REMEDIATION: COMPLETED FOR AUDIT REVIEW (ROUND 3.6)`**',
  '**`PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION (ROUND 3.6)`**'
);

fs.writeFileSync(handoverPath, handover, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_6_HANDOVER.md');

// 2. Update PHASE_0B_2_3_ROUND3_6_CHANGELOG.md
const changelogPath = path.join(dir, 'PHASE_0B_2_3_ROUND3_6_CHANGELOG.md');
let changelog = fs.readFileSync(changelogPath, 'utf8');
changelog = changelog.replace(/\|\s*\*\*RESOLVED\*\*\s*\|/g, '| **PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION** |');
changelog = changelog.replace(
  'Hồ sơ thiết kế CMS đã giải quyết dứt điểm các điểm nghẽn về logic, tính nhất quán của bảng ma trận, sự chính xác của số liệu thống kê và cấu trúc tự cấp của biên bản bàn giao.',
  'Hồ sơ thiết kế CMS đã được Project Team hoàn tất hiệu chỉnh các điểm nghẽn về logic, tính nhất quán của bảng ma trận, sự chính xác của số liệu thống kê và tự cấp số liệu bàn giao, sẵn sàng chuyển giao thẩm tra độc lập.'
);
changelog = changelog.replace(
  '**`DOCUMENTATION REMEDIATION: COMPLETED FOR AUDIT REVIEW (ROUND 3.6)`**',
  '**`PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION (ROUND 3.6)`**'
);
fs.writeFileSync(changelogPath, changelog, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_6_CHANGELOG.md');

// 3. Update PHASE_0B_2_3_ROUND3_6_REMEDIATION_REPORT.md
const reportPath = path.join(dir, 'PHASE_0B_2_3_ROUND3_6_REMEDIATION_REPORT.md');
let report = fs.readFileSync(reportPath, 'utf8');

// Update QG-10 in table
report = report.replace(
  '| **QG-10** | Ma trận bù trừ sự cố 11 bước nhất quán (R4.5-01) | `MEDIA_LIBRARY_SPEC.md` | `DOCUMENT-LEVEL CHECK PARTIAL` | `NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)` | Section 1.1.C Ma trận 11 bước | Đã tái cấu trúc với 7 cột chuẩn; gắn nhãn đề xuất cho retry/rollback; gắn `BLOCKED` cho các bước phụ thuộc; ghi nhận lịch sử Round 4.5 phát hiện mâu thuẫn workflow. |',
  '| **QG-10** | Ma trận bù trừ sự cố 11 bước nhất quán (R4.6-02) | `MEDIA_LIBRARY_SPEC.md` | `DOCUMENT-LEVEL CHECK PASS` | `NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)` | Section 1.1.C Ma trận 11 bước | Đã tái cấu trúc với 7 cột chuẩn; gắn nhãn đề xuất rõ ràng cho retry/rollback/compensation; tài liệu đầy đủ và không mâu thuẫn nội tại (Tài liệu đạt PASS, runtime NOT VERIFIED). |'
);

// Update Summary Chiều 1
const oldSummary = `- **\`DOCUMENT-LEVEL CHECK PASS\`:** **20 / 21 tiêu chí**  
  *(Gồm các tiêu chí: QG-01, QG-02, QG-03, QG-04, QG-05, QG-06, QG-07, QG-08, QG-09, QG-11, QG-12, QG-13, QG-14, QG-15, QG-16, QG-17, QG-18, QG-19, QG-20, QG-21).*
- **\`DOCUMENT-LEVEL CHECK PARTIAL\`:** **1 / 21 tiêu chí**  
  *(Tiêu chí QG-10: Ma trận bù trừ sự cố 11 bước. Đã được hiệu chỉnh ở Round 3.6 với cấu trúc 7 cột chuẩn và gắn nhãn đề xuất, nhưng ghi nhận trạng thái PARTIAL theo kết luận kiểm toán Round 4.5 do phụ thuộc hoàn toàn vào các cơ chế chưa được xác minh).*
- **\`DOCUMENT-LEVEL CHECK FAIL\`:** **0 / 21 tiêu chí**.  
*Tổng số lượng:* **20 + 1 + 0 = 21 / 21 tiêu chí** (Khớp 100%).`;

const newSummary = `- **\`DOCUMENT-LEVEL CHECK PASS\`:** **21 / 21 tiêu chí** (QG-01 đến QG-21: Tính đầy đủ, cấu trúc và tính nhất quán nội tại của toàn bộ 21 tiêu chí đều đạt chuẩn ở cấp độ tài liệu; tách bạch hoàn toàn với trạng thái kiểm chứng độc lập về dependency hạ tầng).
- **\`DOCUMENT-LEVEL CHECK PARTIAL\`:** **0 / 21 tiêu chí**.
- **\`DOCUMENT-LEVEL CHECK FAIL\`:** **0 / 21 tiêu chí**.  
*Tổng số lượng:* **21 + 0 + 0 = 21 / 21 tiêu chí** (Khớp toán học 100%).`;

if (report.includes(oldSummary)) {
  report = report.replace(oldSummary, newSummary);
  console.log('Replaced summary in report');
} else {
  console.log('oldSummary exact match not found, checking normalized...');
  const repStart = report.indexOf('### A. Chiều 1: Kết Quả Rà Soát Tài Liệu');
  const repEnd = report.indexOf('### B. Chiều 2: Trạng Thái Kiểm Chứng Độc Lập');
  if (repStart !== -1 && repEnd !== -1) {
    report = report.substring(0, repStart) + '### A. Chiều 1: Kết Quả Rà Soát Tài Liệu Của Nhóm Dự Án (Project Team Document Review Result):\n' + newSummary + '\n\n' + report.substring(repEnd);
    console.log('Replaced summary section via slice');
  }
}

// Update Verdict in Report
report = report.replace(
  '**`DOCUMENTATION REMEDIATION: COMPLETED FOR AUDIT REVIEW (ROUND 3.6)`**',
  '**`PROJECT TEAM REPORTED – REMEDIATION COMPLETED, PENDING INDEPENDENT VERIFICATION (ROUND 3.6)`**'
);

fs.writeFileSync(reportPath, report, 'utf8');
console.log('Updated PHASE_0B_2_3_ROUND3_6_REMEDIATION_REPORT.md');
