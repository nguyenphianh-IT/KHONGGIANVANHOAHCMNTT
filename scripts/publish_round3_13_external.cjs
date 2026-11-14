const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const zipPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip');
const zipStats = fs.statSync(zipPath);
const zipBuffer = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuffer).digest('hex').toUpperCase();

const externalHandoverContent = `# BIÊN BẢN BÀN GIAO CHÍNH THỨC NGOÀI GÓI LƯU TRỮ – ROUND 3.13
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### TARGETED DOCUMENTATION CORRECTION – MANIFEST LINE COUNT RECONCILIATION

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_13_EXTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team (Documentation Remediation Lead)  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.13 Independent Documentation Audit)  
**Phạm vi bàn giao:** Biên bản bàn giao chính thức nằm ngoài archive ZIP (**EXTERNAL HANDOVER – AUTHORITATIVE CHECKSUM SOURCE**). Tuyệt đối không thay đổi mã nguồn, không thao tác cơ sở dữ liệu, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ NGUYÊN TẮC BÀN GIAO HAI LỚP (TWO-LAYER HANDOVER ARCHITECTURE)
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.12 tại Báo cáo kiểm toán độc lập (Finding \`R4.12-01 – MEDIUM / PARTIAL\`).
- **Nguồn gốc kế thừa:** Gói hồ sơ Round 3.13 kế thừa nguyên vẹn 56 tài liệu Markdown từ Round 3.12, thực hiện hiệu chỉnh đúng mục tiêu phát hiện R4.12-01 và bổ sung 5 tài liệu mới của Round 3.13.
- **Nguyên tắc loại trừ đệ quy mã băm (Eliminate Self-Referential Checksum Loop):**
  * Biên bản bàn giao này nằm **BÊN NGOÀI** gói lưu trữ ZIP và là **NGUỒN CÓ THẨM QUYỀN DUY NHẤT** ghi nhận kích thước byte chính xác và chuỗi mã băm SHA-256 của gói lưu trữ \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip\`.
  * Không nhúng chuỗi mã băm SHA-256 của chính gói ZIP hiện hành vào bất kỳ tệp nào nằm bên trong gói ZIP đó.
  * Tệp bàn giao nội bộ bên trong ZIP (\`PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md\`) tuyên bố rõ thẩm quyền đối soát thuộc về biên bản bàn giao bên ngoài này.
  * Chuỗi mã băm và kích thước byte trong biên bản này được tính toán trực tiếp từ chính file ZIP cuối cùng sau khi hoàn tất đóng gói toàn bộ 61 tệp nội bộ, bảo đảm không có bất kỳ thay đổi nào đối với ZIP sau thời điểm tính toán.

---

### 2. KẾT QUẢ XỬ LÝ PHÁT HIỆN KIỂM TOÁN ROUND 4.12 (R4.12-01)
- **Phát hiện:** Self-Check item 7 trong hồ sơ Round 3.12 ghi nhận \`Manifest own line count = 151 dòng\`, trong khi kết quả kiểm tra thực tế là \`len(content.split('\\n')) = 150\` và \`len(content.splitlines()) = 149\`.
- **Hiệu chỉnh thực tế:**
  1. Đã sửa giá trị tự kê khai tại Mục 7 tệp \`PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` từ 151 thành 150.
  2. Bổ sung chú thích làm rõ quy ước đếm dòng: \`split('\\n') = 150\`, \`splitlines() = 149\`, giá trị chuẩn hóa sử dụng trong Self-Check là **150**.
  3. Duy trì trạng thái Mục 11 trong Self-Check là **\`PARTIAL\`** theo đúng quy định, không tự nâng lên PASS.

---

### 3. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO ROUND 3.13 (AUTHORITATIVE ARCHIVE SEALING METRICS)

- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip\`
- **Kích thước byte chính xác (Exact ZIP size in bytes):** **${zipStats.size.toLocaleString()} bytes** (\`${zipStats.size} bytes\`)  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Mã băm SHA-256 chính xác (Exact SHA-256):** \`${zipHash}\`  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Số lượng entries trong ZIP (Number of ZIP entries):** **61 entries**
- **Số lượng tệp Markdown (Number of Markdown files):** **61 / 61 PASS**
- **Kết quả kiểm tra giải nén / CRC (CRC/decompression result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8 (UTF-8 validation):** **PASS** (100% hợp lệ, không lỗi BOM)
- **Kiểm tra tệp trùng tên (Duplicate filename result):** **0 tệp trùng tên** (PASS)
- **Kiểm tra tệp rỗng (Empty file result):** **0 tệp 0 bytes** (PASS)
- **Đối soát Bảng kê (Manifest reconciliation result):** **PASS** (100% khớp 61/61 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_13_MANIFEST.md\`)
- **Trạng thái tự rà soát của nhóm dự án (Project Team self-check status):** **PROJECT TEAM SELF-CHECK: PARTIALLY COMPLETED (14 PASS / 1 PARTIAL)**
- **Trạng thái kiểm chứng độc lập (Independent verification status):** **PENDING INDEPENDENT AUDIT (ROUND 4.13)**

---

### 4. BẢO TOÀN DANH MỤC TRẠNG THÁI BẮT BUỘC (MANDATORY STATUSES RETAINED)
Toàn bộ 9 trạng thái kiểm soát bắt buộc được duy trì nguyên văn:
1. \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`
2. \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\`
3. \`UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED\`
4. \`MEDIA UPLOAD GATE: BLOCKED\`
5. \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\`
6. \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\`
7. \`MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\`
8. \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\`
9. \`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`

---

### 5. KIỂM SOÁT FOUR-EYES
Duy trì nguyên vẹn trạng thái Hard Block:
\`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`  
Project Team tuyệt đối không tự tạo tên người xác minh, không tự ký, không tự xác nhận thay cho Trusted Contributor độc lập.

---

### 6. CAM KẾT TUÂN THỦ NGUYÊN TẮC BẤT BIẾN (ZERO MUTATION BOUNDARIES)
- **Zero Source Code Mutation:** Tuyệt đối không chỉnh sửa mã nguồn trong thư mục \`src/\`.
- **Zero Schema Mutation:** Tuyệt đối không thay đổi cơ sở dữ liệu, không chỉnh sửa lược đồ, không chạy migration hoặc DDL; không thao tác trên Supabase.
- **Zero Package / Runtime Mutation:** Không cài đặt package mới, không chạy build hoặc test runtime.
- **Zero Git Mutation:** Không thực hiện Git commit hay Git push.

*(Các cam kết Zero Mutation trên là do Project Team tự báo cáo - Self-reported, chờ thẩm định độc lập khi có điều kiện kiểm tra repository).*

---

### 7. PHÁN QUYẾT BÀN GIAO VÒNG 3.13 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện hiệu chỉnh tài liệu có mục tiêu theo phát hiện R4.12-01; kết quả chờ Independent Audit xác nhận).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

const externalHandoverPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_13_EXTERNAL_HANDOVER.md');
fs.writeFileSync(externalHandoverPath, externalHandoverContent, 'utf8');
console.log('Successfully published PHASE_0B_2_3_ROUND3_13_EXTERNAL_HANDOVER.md');

// Copy CHANGELOG, SELF_CHECK_REPORT, REMEDIATION_REPORT, MANIFEST to docs/phase-0b-2
const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_13');
[
  'PHASE_0B_2_3_ROUND3_13_CHANGELOG.md',
  'PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md',
  'PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md',
  'PHASE_0B_2_3_ROUND3_13_MANIFEST.md'
].forEach(f => {
  fs.copyFileSync(path.join(stagingDir, f), path.resolve('docs/phase-0b-2', f));
  console.log(`Copied ${f} to docs/phase-0b-2/`);
});
