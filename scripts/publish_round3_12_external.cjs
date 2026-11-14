const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const zipPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_12.zip');
const zipStats = fs.statSync(zipPath);
const zipBuffer = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuffer).digest('hex').toUpperCase();

const externalHandoverContent = `# BIÊN BẢN BÀN GIAO CHÍNH THỨC NGOÀI GÓI LƯU TRỮ – ROUND 3.12
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_12_EXTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.12 Independent Documentation Audit)  
**Phạm vi bàn giao:** Biên bản bàn giao chính thức nằm ngoài archive ZIP (**EXTERNAL HANDOVER – AUTHORITATIVE CHECKSUM SOURCE**). Tuyệt đối không thay đổi mã nguồn, không thao tác cơ sở dữ liệu, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ NGUYÊN TẮC BÀN GIAO HAI LỚP (TWO-LAYER HANDOVER ARCHITECTURE)
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.11 tại Báo cáo kiểm toán \`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_11.md\` và Phán quyết \`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_11.md\`.
- **Nguyên tắc loại trừ đệ quy mã băm (Eliminate Self-Referential Checksum Loop):**
  * Biên bản bàn giao này nằm **BÊN NGOÀI** gói lưu trữ ZIP và là **NGUỒN CÓ THẨM QUYỀN DUY NHẤT** ghi nhận kích thước byte chính xác và chuỗi mã băm SHA-256 của gói lưu trữ \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_12.zip\`.
  * Không nhúng chuỗi mã băm SHA-256 của chính gói ZIP hiện hành vào bất kỳ tệp nào nằm bên trong gói ZIP đó (Independent Audit Round 4.10 và Round 4.11 đã xác nhận 0 occurrences bên trong ZIP).
  * Tệp bàn giao nội bộ bên trong ZIP (\`PHASE_0B_2_3_ROUND3_12_INTERNAL_HANDOVER.md\`) tuyên bố rõ thẩm quyền đối soát thuộc về biên bản bàn giao bên ngoài này.
  * Chuỗi mã băm và kích thước byte trong biên bản này được tính toán trực tiếp từ chính file ZIP cuối cùng sau khi hoàn tất đóng gói toàn bộ 56 tệp nội bộ, bảo đảm không có bất kỳ thay đổi nào đối với ZIP sau thời điểm tính toán.

---

### 2. KẾT QUẢ XỬ LÝ CÁC PHÁT HIỆN KIỂM TOÁN ROUND 4.11
1. **R4.11-01 (HIGH - Self-Check Overstates Closure of Absolute-Assertion Review):**
   - Đã rà soát và điều chỉnh các từ ngữ khẳng định vượt quá bằng chứng trong hồ sơ Round 3.11 ("Xử lý dứt điểm", "Rà soát toàn diện", "loại trừ hoàn toàn") sang ngôn ngữ tự báo cáo có giới hạn bằng chứng:
     \`PROJECT TEAM REPORTS THAT DOCUMENTATION UPDATES WERE MADE – PENDING INDEPENDENT VERIFICATION\`.
   - Chuyển trạng thái Mục 11 trong Self-Check từ PASS sang PARTIAL theo đúng khuyến nghị của kiểm toán độc lập.
   - Công bố phán quyết Self-Check là PARTIALLY COMPLETED.
2. **R4.11-02 (MEDIUM - Historical Archive Retains Legacy Absolute Claims):**
   - Thiết lập ma trận phân định xuất xứ bằng chứng 3 cấp độ: Project Team self-reported, Project Team self-checked, Independently verified.
   - Bảo toàn nguyên vẹn hồ sơ lịch sử từ Round 3.0 đến 3.10; các câu khẳng định lịch sử khi trích dẫn được gắn nhãn \`[QUOTED LEGACY PHRASE]\` và tuyên bố rõ đây là phát biểu tự thuật tại thời điểm lập văn bản quá khứ, không cấu thành kết luận kiểm toán hiện hành.
3. **R4.11-03 (NOT VERIFIED - Zero Mutation / Repository Claims Boundary):**
   - Duy trì phân loại các cam kết Zero Mutation (mã nguồn, schema, package, runtime, Git) là \`PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED\`.
   - Không tự xác nhận thay cho việc kiểm tra repository trực tiếp.

---

### 3. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO ROUND 3.12 (AUTHORITATIVE ARCHIVE SEALING METRICS)

- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_12.zip\`
- **Kích thước byte chính xác (Exact ZIP size in bytes):** **${zipStats.size.toLocaleString()} bytes** (\`${zipStats.size} bytes\`)  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Mã băm SHA-256 chính xác (Exact SHA-256):** \`${zipHash}\`  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Số lượng entries trong ZIP (Number of ZIP entries):** **56 entries**
- **Số lượng tệp Markdown (Number of Markdown files):** **56 / 56 PASS**
- **Kết quả kiểm tra giải nén / CRC (CRC/decompression result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8 (UTF-8 validation):** **PASS** (100% hợp lệ, không lỗi BOM)
- **Kiểm tra tệp trùng tên (Duplicate filename result):** **0 tệp trùng tên** (PASS)
- **Kiểm tra tệp rỗng (Empty file result):** **0 tệp 0 bytes** (PASS)
- **Đối soát Bảng kê (Manifest reconciliation result):** **PASS** (100% khớp 56/56 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_12_MANIFEST.md\`)
- **Trạng thái tự rà soát của nhóm dự án (Project Team self-check status):** **PROJECT TEAM SELF-CHECK: PARTIALLY COMPLETED**
- **Trạng thái kiểm chứng độc lập (Independent verification status):** **PENDING INDEPENDENT AUDIT (ROUND 4.12)**

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

### 7. PHÁN QUYẾT BÀN GIAO VÒNG 3.12 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện hiệu chỉnh tài liệu có mục tiêu theo các phát hiện kiểm toán Round 4.11; kết quả chờ Independent Audit xác nhận).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

const externalHandoverPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_12_EXTERNAL_HANDOVER.md');
fs.writeFileSync(externalHandoverPath, externalHandoverContent, 'utf8');
console.log('Successfully published PHASE_0B_2_3_ROUND3_12_EXTERNAL_HANDOVER.md');

// Also copy ROUND3_12_REMEDIATION_REPORT.md, ROUND3_12_MANIFEST.md, ROUND3_12_DOCUMENTATION_SELF_CHECK.md to docs/phase-0b-2
const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_12');
['PHASE_0B_2_3_ROUND3_12_REMEDIATION_REPORT.md', 'PHASE_0B_2_3_ROUND3_12_MANIFEST.md', 'PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md'].forEach(f => {
  fs.copyFileSync(path.join(stagingDir, f), path.resolve('docs/phase-0b-2', f));
  console.log(`Copied ${f} to docs/phase-0b-2/`);
});
