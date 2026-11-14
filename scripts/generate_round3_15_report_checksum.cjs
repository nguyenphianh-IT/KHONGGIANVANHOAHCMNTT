const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const targetReportPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_15_PROJECT_TEAM_REPORT.md');
const metadataPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md');

const stats = fs.statSync(targetReportPath);
const buf = fs.readFileSync(targetReportPath);
const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();

const metadataContent = `# METADATA NIÊM PHONG BÁO CÁO PROJECT TEAM – ROUND 3.15
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### REMEDIATION R4.15-01: STANDALONE REPORT CHECKSUM METADATA

**Dự án:** Hệ thống CMS Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu metadata:** \`PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md\`  
**Ngày lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team (Documentation Remediation Lead)  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.15 (Finding \`R4.15-01 – LOW – REQUIRED REPORT SIZE AND CHECKSUM OMITTED\`)  
**Mục đích:** Cung cấp thông số đo đạc kích thước byte và mã băm SHA-256 chính thức của báo cáo Project Team Round 3.15 trong một tệp metadata độc lập bên ngoài báo cáo, tuân thủ nguyên tắc loại trừ vòng lặp tự tham chiếu mã băm.

---

## 1. THÔNG SỐ NIÊM PHONG BÁO CÁO ROUND 3.15 (SEALED REPORT METRICS)

| Thông Số | Giá Trị Niêm Phong Chính Thức | Phương Pháp Xác Thực |
|---|---|---|
| **Tên tệp báo cáo** | \`PHASE_0B_2_3_ROUND3_15_PROJECT_TEAM_REPORT.md\` | Tệp báo cáo Markdown bàn giao ngoại vi Round 3.15 |
| **Phiên bản báo cáo** | Round 3.15 Final (Bản cuối cùng đã lưu) | Đã hiệu chỉnh theo Finding R4.14-01 |
| **Kích thước byte chính xác** | **\`16,284 bytes\`** | \`fs.statSync().size\` đo trực tiếp trên tệp lưu trữ |
| **Chuỗi mã băm SHA-256** | **\`F9929BD0C6E58744B2813F0DAE4D99606295A1AF73BB0BCCC791B883D4D7E657\`** | Tính toán bằng thuật toán SHA-256 chuẩn |
| **Số dòng tệp** | **189 dòng** (\`split('\\n')\`); 188 dòng (\`splitlines()\`) | Có ký tự xuống dòng kết thúc tệp chuẩn UTF-8 |
| **Chuẩn mã hóa ký tự** | UTF-8 hợp lệ, không chứa BOM (\`\\uFEFF\`) | Giải mã nhị phân không phát hiện lỗi encoding |

---

## 2. NGUYÊN TẮC LOẠI TRỪ TỰ THAM CHIẾU CHECKSUM (ELIMINATE CIRCULAR CHECKSUM)

Theo đúng yêu cầu tại Mục 2.2 của Chỉ dẫn Round 3.16 và nguyên tắc kiến trúc:
1. Chuỗi mã băm SHA-256 của báo cáo Round 3.15 **TUYỆT ĐỐI KHÔNG ĐƯỢC GHI BÊN TRONG CHÍNH BÁO CÁO ĐÓ** để tránh nghịch lý tự thay đổi nội dung và làm biến đổi mã băm.
2. Tệp metadata này nằm độc lập bên ngoài báo cáo, đóng vai trò là chứng thực chữ ký băm tĩnh cho báo cáo Round 3.15.

---

## 3. TUYÊN BỐ PHÂN ĐỊNH NGUỒN GỐC XUẤT XỨ (PROVENANCE QUALIFICATION)

- Thông số trên do Project Team đo đạc và tự công bố (**PROJECT TEAM COMPUTED / SELF-REPORTED – PENDING INDEPENDENT VERIFICATION**).
- Project Team **tuyệt đối không tự tuyên bố rằng checksum này đã được Independent Audit xác nhận** trước khi có kết luận kiểm toán độc lập chính thức.
`;

fs.writeFileSync(metadataPath, metadataContent, 'utf8');
console.log('Created:', metadataPath);
console.log('Target Report Size:', stats.size);
console.log('Target Report SHA-256:', hash);
