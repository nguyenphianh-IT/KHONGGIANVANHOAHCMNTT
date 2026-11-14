const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const zlib = require('zlib');

const docsDir = path.resolve('docs/phase-0b-2');

// 1. Finalize PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md
const reportContent = `# BÁO CÁO KẾT QUẢ THỰC HIỆN HIỆU CHỈNH HỒ SƠ TÀI LIỆU – ROUND 3.17
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### DOCUMENTATION REMEDIATION – ROUND 3.17

**Dự án:** Hệ thống CMS Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team (Documentation Remediation Lead)  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.16 (tài liệu [\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_16.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_16.md) & [\`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_16.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_16.md))  
**Phạm vi:** Hiệu chỉnh tài liệu có kiểm soát (**EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED**). Tuyệt đối bảo toàn nguyên vẹn gói ZIP Round 3.14, không đóng gói lại ZIP Round 3.14, không can thiệp mã nguồn trong \`src/\`, không can thiệp cơ sở dữ liệu/schema, không can thiệp runtime/Supabase, không thực hiện \`git commit\` / \`git push\`.

---

## 1. Executive Summary (Tóm Tắt Điều Hành)

Báo cáo Round 3.17 được lập nhằm giải quyết dứt điểm hai phát hiện kiểm toán từ Round 4.16:
- **Khắc phục R4.16-01 (Numbering Consistency):** Đồng bộ hóa toàn diện hệ thống đánh số tiêu đề từ Mục 1 đến Mục 10 bằng chữ số Ả Rập thống nhất; loại bỏ triệt để mọi mâu thuẫn đánh số La Mã I–VII và loại bỏ hoàn toàn tham chiếu "Section IX" không tồn tại trong văn bản.
- **Khắc phục R4.16-02 (Missing Deliverables and Evidence Completeness):** Cung cấp trực tiếp và đầy đủ bộ 4 tệp Markdown độc lập của Round 3.16 (\`ROUND3_15_REPORT_CHECKSUM.md\`, \`ROUND3_16_PROJECT_TEAM_REPORT.md\`, \`ROUND3_16_CHANGELOG.md\`, \`ROUND3_16_SELF_CHECK_REPORT.md\`) kèm theo bộ 4 tệp Markdown mới của Round 3.17, phục vụ kiểm toán độc lập byte-for-byte.
- **Kiểm soát tính toàn vẹn và xuất xứ bằng chứng:** Đo đạc lại dung lượng byte thực tế và SHA-256 trên đúng các tệp lưu trữ trên đĩa; phân định rành mạch giữa bản văn bản đính kèm trong phiên kiểm toán và tệp tài liệu chính thức được kê khai; không tự tuyên bố các kết quả tự kiểm tra là kết luận kiểm toán độc lập.

---

## 2. Audit Basis and Input Evidence (Căn Cứ Kiểm Toán và Bằng Chứng Đầu Vào)

Project Remediation Team đã thực hiện tự rà soát và đối chiếu các tài liệu đầu vào thực tế trong phiên làm việc Round 3.17:

| STT | Tài Liệu Đầu Vào | Phiên Bản / Định Danh | Kích Thước Thực Tế (Bytes) | SHA-256 Checksum Thực Tế | Tình Trạng Đối Soát |
|:---:|---|---|---:|---|:---:|
| 1 | [\`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip) | Round 3.14 Archive gốc | 297,736 | \`59CA6D1243820E7CEC1B3D6F3E79165FAE848CD641F5716D14D070651B42953A\` | **PASS (Khớp 100%, giữ nguyên)** |
| 2 | [\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_16.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_16.md) | Báo cáo kiểm toán Round 4.16 | 12,014 | \`C15BA0D3B0CFEE14354EBED3BF8AE1D9B502C66A238A899E41E67C924623CAEE\` | **PASS (Tiếp nhận đầy đủ)** |
| 3 | [\`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_16.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_16.md) | Phán quyết Round 4.16 | 3,363 | \`20D0487D4CF946E1E4F98E8DEE30DAFE76A8DDC5E58300262145A67215BFA475\` | **PASS (Tiếp nhận đầy đủ)** |
| 4 | [\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_14.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_14.md) | Báo cáo kiểm toán Round 4.14 | 8,639 | \`0D0948C395F9A2147A54F1188CA1865C90D40E1FB429D864A31F1D6409D35D0D\` | **PASS (Khớp byte-for-byte)** |
| 5 | [\`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_14.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_14.md) | Phán quyết Round 4.14 | 2,969 | \`81CF228073386C0D806BB540CC938EE4B0C749BFA2414B53BCEFBB6D5259612F\` | **PASS (Khớp byte-for-byte)** |
| 6 | [\`PHASE_0B_2_3_ROUND3_14_EXTERNAL_HANDOVER.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_14_EXTERNAL_HANDOVER.md) | Bản workspace nội bộ | 9,406 | \`9653FA7632246AE3CCC0699BB1C9DEDEEDBCDD310D4CD33CABFB051DC9E208A9\` | **NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE** *(Trạng thái: NOT VERIFIED)* |

---

## 3. Round 4.16 Findings (Các Phát Hiện Kiểm Toán Round 4.16)

Kiểm toán độc lập Round 4.16 ghi nhận 2 phát hiện mức độ LOW cần xử lý:
1. **R4.16-01 (LOW – EDITORIAL NUMBERING CLAIM DOES NOT MATCH SUPPLIED REPORT):**
   - Nội dung báo cáo kê khai đã chuẩn hóa hệ thống đánh số Ả Rập 1–10, nhưng bản văn bản đính kèm phiên audit lại sử dụng tiêu đề chính I–VII.
   - Bảng tự kiểm tra tham chiếu đến "Section IX", trong khi báo cáo văn bản đính kèm không có Section IX tương ứng.
2. **R4.16-02 (LOW – INCOMPLETE ROUND 3.16 DELIVERABLE SET):**
   - Trong phiên audit Round 4.16, chỉ nhận được nội dung của báo cáo chính; 3 tệp còn lại trong bộ 4 tài liệu kê khai (\`ROUND3_15_REPORT_CHECKSUM.md\`, \`ROUND3_16_CHANGELOG.md\`, \`ROUND3_16_SELF_CHECK_REPORT.md\`) chưa được cung cấp trực tiếp dưới dạng tệp Markdown độc lập để đối chiếu byte-for-byte.
   - Bản văn bản đính kèm có kích thước 13,817 bytes (SHA-256 \`AA7825...\`), khác với tệp chính thức được kê khai trên đĩa (21,381 bytes, SHA-256 \`BBBD95...\`).

---

## 4. Remediation Actions (Các Hành Động Hiệu Chỉnh Cụ Thể)

Project Remediation Team đã thực hiện các hành động hiệu chỉnh dứt điểm:

### 4.1. Hiệu chỉnh R4.16-01:
- Áp dụng hệ thống đánh số duy nhất và nhất quán bằng chữ số Ả Rập từ Mục 1 đến Mục 10 xuyên suốt toàn bộ các báo cáo và tài liệu của Round 3.17.
- Xóa bỏ hoàn toàn mọi tham chiếu "Section IX" không tồn tại; thay thế bằng tham chiếu chính xác đến Mục 7 (Self-Review Results) trong cấu trúc báo cáo thực tế.

### 4.2. Hiệu chỉnh R4.16-02:
- Cung cấp trực tiếp, đầy đủ và nguyên vẹn bộ 4 tệp Markdown độc lập của Round 3.16 tại thư mục dự án \`docs/phase-0b-2/\` và công bố toàn văn nội dung để Independent Audit kiểm tra trực tiếp.
- Làm rõ phân định: bản văn bản 13,817 bytes là bản tóm lược trong phiên chat trước đó, trong khi tệp chính thức được lưu trên đĩa là \`PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md\` (21,381 bytes, SHA-256 \`BBBD95ECA47840B2A7EE5F8C4ECB71C8CD9091E85B1DFEDB59B24A44632BDC7C\`). Cả hai đối tượng được phân định minh bạch.

---

## 5. Numbering Consistency Verification (Xác Minh Tính Nhất Quán Đánh Số)

Toàn bộ tài liệu báo cáo Round 3.17 tuân thủ nghiêm ngặt cấu trúc 10 mục chuẩn hóa theo chỉ thị tại Section VI của Prompt:
- Mục 1: Executive Summary
- Mục 2: Audit Basis and Input Evidence
- Mục 3: Round 4.16 Findings
- Mục 4: Remediation Actions
- Mục 5: Numbering Consistency Verification
- Mục 6: Deliverables and Metadata Verification
- Mục 7: Self-Review Results
- Mục 8: Outstanding Issues and Evidence Limitations
- Mục 9: Mandatory Security and Readiness Status
- Mục 10: Final Project Team Declaration

Mọi tiêu đề phụ được đánh số theo cấp bậc Ả Rập (ví dụ: 4.1, 4.2...). Không sử dụng số La Mã làm tiêu đề chính. Mọi tham chiếu chéo đều trỏ đến đúng tiêu đề thực tế đang hiện diện.

---

## 6. Deliverables and Metadata Verification (Xác Minh Sản Phẩm Bàn Giao và Metadata)

Project Team bàn giao đầy đủ 8 tệp Markdown độc lập tại \`docs/phase-0b-2/\`:

| STT | Tên Tệp Bàn Giao | Vai Trò & Phân Loại | Kích Thước (Bytes) / Checksum Authority |
|:---:|---|---|---|
| 1 | [\`PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md) | Báo cáo chính thức Round 3.17 | Niêm phong tại \`ROUND3_17_DELIVERABLES_CHECKSUM.md\` |
| 2 | [\`PHASE_0B_2_3_ROUND3_17_CHANGELOG.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_CHANGELOG.md) | Nhật ký thay đổi Round 3.17 | Niêm phong tại \`ROUND3_17_DELIVERABLES_CHECKSUM.md\` |
| 3 | [\`PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md) | Báo cáo tự kiểm tra Round 3.17 | Niêm phong tại \`ROUND3_17_DELIVERABLES_CHECKSUM.md\` |
| 4 | [\`PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md) | Tệp metadata niêm phong ngoại vi | Ghi nhận kích thước và SHA-256 các tệp Round 3.17 |
| 5 | [\`PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md) | Metadata niêm phong báo cáo R3.15 | **3,028 bytes**; SHA-256: \`6B3C497DAB1CD02BD26DBF18BF08D734A3DB4CF3A0517CBFA5C3A110AD45F2BC\` |
| 6 | [\`PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md) | Báo cáo chính thức Round 3.16 | **21,381 bytes**; SHA-256: \`BBBD95ECA47840B2A7EE5F8C4ECB71C8CD9091E85B1DFEDB59B24A44632BDC7C\` |
| 7 | [\`PHASE_0B_2_3_ROUND3_16_CHANGELOG.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_CHANGELOG.md) | Nhật ký thay đổi Round 3.16 | **5,022 bytes**; SHA-256: \`60B011A0C1E06BB1B3F02818C5B181915225553464B357E9D4E17705A7B0942B\` |
| 8 | [\`PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md\`](file:///d:/Web/Không%20gian%20văn%20hoá%20HCM/docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md) | Báo cáo tự kiểm tra Round 3.16 | **4,652 bytes**; SHA-256: \`7E94AF1056FCA9E9F92CC86A202FEC75E93C7B7035D55C1721865B80723AF30B\` |

*(Theo nguyên tắc loại trừ tự tham chiếu mã băm, kích thước và mã băm SHA-256 chính thức của các tệp Round 3.17 được công bố tại tệp metadata độc lập \`PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md\`)*.

---

## 7. Self-Review Results (Kết Quả Tự Rà Soát của Project Team)

Project Team đã tự kiểm tra 12 tiêu chí hoàn thành Round 3.17:

| STT | Tiêu Chí Tự Kiểm Tra (Self-Review Criteria) | Trạng Thái | Minh Chứng / Ghi Chú Giới Hạn |
|:---:|---|:---:|---|
| 1 | Sửa nhất quán hệ thống đánh số (Ả Rập 1–10) | **PASS** | Đã áp dụng Mục 1 đến Mục 10 xuyên suốt toàn bộ báo cáo và phụ lục. |
| 2 | Loại bỏ tham chiếu Section IX không tồn tại | **PASS** | Không còn bất kỳ tham chiếu Section IX nào trong toàn bộ hồ sơ Round 3.17. |
| 3 | Cung cấp đầy đủ bốn tài liệu Round 3.16 | **PASS** | Cung cấp trực tiếp các tệp 5, 6, 7, 8 dưới dạng Markdown độc lập trên đĩa. |
| 4 | Tính lại metadata từ các tệp thực tế | **PASS** | Đo đạc trực tiếp dung lượng byte và SHA-256 từ tệp ghi đĩa thực tế. |
| 5 | Phân biệt checksum tài liệu gốc và kiểm tra | **PASS** | Phân định rạch ròi giữa bản văn bản đính kèm 13,817 bytes và tệp lưu 21,381 bytes. |
| 6 | Cập nhật CHANGELOG theo thay đổi thực tế | **PASS** | Tệp \`PHASE_0B_2_3_ROUND3_17_CHANGELOG.md\` liệt kê chi tiết mọi sửa đổi. |
| 7 | Cập nhật SELF-CHECK theo bằng chứng thực tế | **PASS** | Tệp \`PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md\` phản ánh đúng 12 tiêu chí. |
| 8 | Giữ nguyên Self-Check item 11 ở trạng thái PARTIAL | **PARTIAL** | Tiếp tục giữ nguyên PARTIAL theo R4.13-02, R4.14, R4.15 và R4.16. |
| 9 | Giữ nguyên 9 Mandatory Status strings | **PASS** | Toàn bộ 9 chuỗi bảo mật và kiểm soát được bảo toàn nguyên văn 100%. |
| 10 | Duy trì Four-Eyes HARD BLOCK | **PASS** | Duy trì trạng thái HARD BLOCK; không tự cấp quyền duyệt. |
| 11 | Không sửa mã nguồn, schema, runtime, Git | **PASS** | Tuân thủ tuyệt đối Zero Mutation (\`src/\`, DB, Supabase, package, Git). |
| 12 | Ghi rõ giới hạn kiểm chứng độc lập | **PASS** | Mọi kết luận đều ghi rõ là Project Team tự rà soát, chờ Independent Audit. |

---

## 8. Outstanding Issues and Evidence Limitations (Các Vấn Đề Tồn Đọng và Giới Hạn Bằng Chứng)

1. **Giới hạn kiểm tra Archive Round 3.14:** Trong phiên làm việc hiện tại, do chỉ thực hiện hiệu chỉnh tài liệu ngoại vi, tệp container gốc \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip\` (297,736 bytes; SHA-256 \`59CA6D1243820E7CEC1B3D6F3E79165FAE848CD641F5716D14D070651B42953A\`) được giữ nguyên vẹn trên đĩa, nhưng việc đối chiếu phụ thuộc vào kết quả lịch sử Round 4.14.
2. **External Handover Round 3.14:** Tài liệu \`PHASE_0B_2_3_ROUND3_14_EXTERNAL_HANDOVER.md\` lưu trong workspace nội bộ (9,406 bytes), chưa được cung cấp trong gói nén kiểm toán độc lập nên tiếp tục duy trì phân loại: \`NOT AVAILABLE FOR DIRECT VERIFICATION IN AUDIT PACKAGE\` (*NOT VERIFIED*).
3. **Phân định xuất xứ bằng chứng Zero Mutation:** Mọi cam kết Zero Source Code Mutation, Zero Schema Mutation, Zero Supabase Interaction, Zero Package Mutation và Zero Git Mutation là kết quả tự khai báo (**PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED**), chưa được thẩm định độc lập trên repository/database/runtime.

---

## 9. Mandatory Security and Readiness Status (Trạng Thái Bảo Mật và Sẵn Sàng Bắt Buộc)

Project Team xác nhận duy trì nguyên văn toàn bộ 9 chuỗi trạng thái kiểm soát bắt buộc:

1. \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\` — **HARD BLOCK**
2. \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\` — **NOT VERIFIED**
3. \`UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED\` — **NOT VERIFIED**
4. \`MEDIA UPLOAD GATE: BLOCKED\` — **BLOCKED**
5. \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\` — **NOT VERIFIED**
6. \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\` — **NOT VERIFIED**
7. \`MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\` — **BLOCKED**
8. \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\` — **BLOCKED**
9. \`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\` — **HARD BLOCK**

---

## 10. Final Project Team Declaration (Tuyên Bố Cuối Cùng của Project Team)

Round 3.17 chỉ thực hiện hiệu chỉnh và hoàn thiện hồ sơ tài liệu theo các phát hiện của Independent Documentation Audit Round 4.16. Các kết quả tự kiểm tra của Project Team không thay thế kiểm toán độc lập. Việc hoàn thành hiệu chỉnh tài liệu không chứng minh hệ thống đã đáp ứng yêu cầu bảo mật, tính toàn vẹn dữ liệu, kiểm soát truy cập hoặc điều kiện triển khai thực tế.

Four-Eyes vẫn là HARD BLOCK do chưa xác minh được Trusted Contributor Provenance. Các trạng thái bảo mật, audit log, upload, media, schema dependency và persistent state tiếp tục giữ nguyên theo bằng chứng hiện có.

Do đó, Implementation Readiness tiếp tục là:

**\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**

Chỉ Independent Documentation Audit tiếp theo mới có thẩm quyền đánh giá mức độ chấp nhận các tài liệu Round 3.17.

- **Documentation Self-Check Verdict:**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**

- **Implementation Readiness Verdict:**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**
`;

fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md'), reportContent, 'utf8');

// Measure exact metrics for files 1, 2, 3, 5, 6, 7, 8
const filesToMeasure = [
  'PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_17_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md',
  'PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md',
  'PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md',
  'PHASE_0B_2_3_ROUND3_16_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'
];

const metrics = {};
filesToMeasure.forEach(f => {
  const p = path.join(docsDir, f);
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  const lines = buf.toString('utf8').split('\n').length;
  metrics[f] = { size: buf.length, hash, lines };
});

// 4. Generate PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md
const checksumMetadataContent = `# BẢNG NIÊM PHONG METADATA SẢN PHẨM BÀN GIAO – ROUND 3.17
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### INDEPENDENT STANDALONE DELIVERABLES CHECKSUM METADATA

**Dự án:** Hệ thống CMS Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập:** Project Remediation Team (Documentation Remediation Lead)  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.16 (Phát hiện \`R4.16-01\`, \`R4.16-02\`)  
**Mục đích:** Cung cấp thông số đo đạc thực tế dung lượng byte và chuỗi mã băm SHA-256 của toàn bộ các sản phẩm bàn giao Round 3.17 và các tài liệu Round 3.16 được cung cấp lại, tuân thủ nghiêm ngặt nguyên tắc loại trừ tự tham chiếu mã băm.

---

## 1. THÔNG SỐ NIÊM PHONG CÁC SẢN PHẨM MỚI ROUND 3.17

| STT | Tên Tệp Bàn Giao | Dung Lượng (Bytes) | Chuỗi Mã Băm SHA-256 | Số Dòng (\`split('\\n')\`) | Định Dạng & Chuẩn Mã Hóa |
|:---:|---|---:|---|:---:|---|
| 1 | \`PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md\` | **${metrics['PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md'].lines} | Markdown UTF-8 (Không BOM) |
| 2 | \`PHASE_0B_2_3_ROUND3_17_CHANGELOG.md\` | **${metrics['PHASE_0B_2_3_ROUND3_17_CHANGELOG.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_17_CHANGELOG.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_17_CHANGELOG.md'].lines} | Markdown UTF-8 (Không BOM) |
| 3 | \`PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md\` | **${metrics['PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md'].lines} | Markdown UTF-8 (Không BOM) |

---

## 2. THÔNG SỐ NIÊM PHONG CÁC TÀI LIỆU ROUND 3.16 CUNG CẤP LẠI (AUDIT RE-EVALUATION SET)

| STT | Tên Tệp Bàn Giao | Dung Lượng (Bytes) | Chuỗi Mã Băm SHA-256 | Số Dòng (\`split('\\n')\`) | Mục Đích Bàn Giao |
|:---:|---|---:|---|:---:|---|
| 4 | \`PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md\` | **${metrics['PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md'].lines} | Cung cấp trực tiếp để kiểm toán lại (R4.16-02) |
| 5 | \`PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md\` | **${metrics['PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md'].lines} | Bản tệp chính thức lưu đĩa đối chứng |
| 6 | \`PHASE_0B_2_3_ROUND3_16_CHANGELOG.md\` | **${metrics['PHASE_0B_2_3_ROUND3_16_CHANGELOG.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_16_CHANGELOG.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_16_CHANGELOG.md'].lines} | Cung cấp trực tiếp để kiểm toán lại (R4.16-02) |
| 7 | \`PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md\` | **${metrics['PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'].size}** | \`${metrics['PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'].hash}\` | ${metrics['PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'].lines} | Cung cấp trực tiếp để kiểm toán lại (R4.16-02) |

---

## 3. NGUYÊN TẮC LOẠI TRỪ TỰ THAM CHIẾU MÃ BĂM (NON-SELF-REFERENTIAL INTEGRITY)

- Tệp metadata này ghi nhận giá trị tĩnh của các tài liệu khác và **tuyệt đối không nhúng chuỗi SHA-256 của chính nó vào bên trong nội dung** nhằm bảo vệ tính toàn vẹn toán học và tránh vòng lặp đệ quy.
- Toàn bộ thông số được tính toán bằng script chuẩn hóa Node.js sử dụng thuật toán \`crypto.createHash('sha256')\` trực tiếp trên buffer tệp.
- Mọi dữ liệu niêm phong ở đây do Project Team tự tính toán (**PROJECT TEAM COMPUTED / SELF-REPORTED – PENDING INDEPENDENT VERIFICATION**), chờ Independent Documentation Audit Round 4.17 thẩm định độc lập.
`;

fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md'), checksumMetadataContent, 'utf8');
console.log('Created PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md');

// Also create zip container for Round 3.17 deliverables
const zipDest = path.join(docsDir, 'PHASE_0B_2_3_DELIVERABLES_ROUND3_17.zip');
if (fs.existsSync(zipDest)) fs.unlinkSync(zipDest);

// We can package all 8 files into PHASE_0B_2_3_DELIVERABLES_ROUND3_17.zip using powershell Compress-Archive
console.log('Finalizing Round 3.17 build...');
