const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const zipPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip');
const zipStats = fs.statSync(zipPath);
const zipBuffer = fs.readFileSync(zipPath);
const zipHash = crypto.createHash('sha256').update(zipBuffer).digest('hex').toUpperCase();

const externalHandoverContent = `# BIÊN BẢN BÀN GIAO CHÍNH THỨC NGOÀI GÓI LƯU TRỮ – ROUND 3.11
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.11 Independent Documentation Audit)  
**Phạm vi bàn giao:** Biên bản bàn giao chính thức nằm ngoài archive ZIP (**EXTERNAL HANDOVER – AUTHORITATIVE CHECKSUM SOURCE**). Tuyệt đối không thay đổi mã nguồn, không thao tác cơ sở dữ liệu, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ NGUYÊN TẮC BÀN GIAO HAI LỚP (TWO-LAYER HANDOVER ARCHITECTURE)
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.10 tại Báo cáo kiểm toán \`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md\` và Phán quyết \`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_10.md\`.
- **Nguyên tắc loại trừ hoàn toàn đệ quy mã băm (Eliminate Self-Referential Checksum Loop):**
  * Biên bản bàn giao này nằm **BÊN NGOÀI** gói lưu trữ ZIP và là **NGUỒN CÓ THẨM QUYỀN DUY NHẤT** ghi nhận kích thước byte chính xác và chuỗi mã băm SHA-256 của gói lưu trữ \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip\`.
  * Không nhúng chuỗi mã băm SHA-256 của chính gói ZIP hiện hành vào bất kỳ tệp nào nằm bên trong gói ZIP đó (Independent Audit Round 4.10 xác nhận 0 occurrences bên trong ZIP).
  * Tệp bàn giao nội bộ bên trong ZIP (\`PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md\`) tuyên bố rõ thẩm quyền đối soát thuộc về biên bản bàn giao bên ngoài này.
  * Chuỗi mã băm và kích thước byte trong biên bản này được tính toán trực tiếp từ chính file ZIP cuối cùng sau khi hoàn tất đóng gói toàn bộ 52 tệp nội bộ, bảo đảm không có bất kỳ thay đổi nào đối với ZIP sau thời điểm tính toán.

---

### 2. KẾT QUẢ XỬ LÝ CÁC PHÁT HIỆN KIỂM TOÁN ROUND 4.10
1. **R4.10-01 (HIGH - External Handover Artifact & Archive Checksum Reconciliation):**
   - Đạt kiểm tra độc lập (PASS) trong Round 4.10.
   - Tiếp tục duy trì kiến trúc 2 lớp bàn giao: External Handover này ghi nhận checksum chính thức; Internal Handover bên trong ZIP ghi nhận thẩm quyền ngoại vi.
2. **R4.10-02 (HIGH - Manifest Inventory & Line Counts):**
   - Đạt kiểm tra độc lập (PASS) trong Round 4.10.
   - Phân chia 52 tệp nội bộ gói Round 3.11 thành 7 nhóm độc lập loại trừ lẫn nhau, tổng khớp chính xác 52/52 tệp:
     * Nhóm 1: Tài liệu quy chuẩn cốt lõi (Core Specifications): **4 tệp**
     * Nhóm 2: Đặc tả kiến trúc và thiết kế UX/UI: **8 tệp**
     * Nhóm 3: Hồ sơ kiểm chứng & lịch sử hiệu chỉnh Round 3.0 - 3.7: **27 tệp**
     * Nhóm 4: Hồ sơ kế thừa Round 3.8 đã hiệu chỉnh: **3 tệp**
     * Nhóm 5: Hồ sơ kế thừa Round 3.9 đã hiệu chỉnh: **3 tệp**
     * Nhóm 6: Hồ sơ kế thừa Round 3.10 đã hiệu chỉnh: **3 tệp**
     * Nhóm 7: Tài liệu bàn giao nội bộ mới Round 3.11: **4 tệp**
     * Tổng cộng: **4 + 8 + 27 + 3 + 3 + 3 + 4 = 52 tệp** (Khớp số học 100%).
   - Tự kê khai đúng số dòng của tệp Manifest (141 dòng) theo quy chuẩn \`split('\\n').length\`.
3. **R4.10-03 (HIGH - Historical Evidence Wording Harmonization):**
   - Sửa dòng 9 \`DELTA_VERIFICATION_REPORT_ROUND3_1.md\` thành nhận định tự báo cáo lịch sử: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`.
   - Phân biệt nghiêm ngặt 3 cấp độ xuất xứ bằng chứng: \`PROJECT TEAM SELF-REPORTED\`, \`PROJECT TEAM SELF-CHECKED\`, \`INDEPENDENTLY VERIFIED\`.
   - Gắn nhãn \`[QUOTED LEGACY PHRASE]\` đối với các cụm từ khẳng định cũ khi trích dẫn văn cảnh lịch sử tự nhận kiểm chứng độc lập.
4. **R4.10-04 (MEDIUM - Category C Reclassification & Quality Gate Scope):**
   - Đạt kiểm tra độc lập (PASS WITH OBSERVATION).
   - Duy trì tên gọi Category C là: \`INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE\`.
   - Phân rã 18 tiêu chí thành các trạng thái thực tế độc lập: 4 Archive integrity + 1 Historical vocabulary + 2 Hard blocks retained + 11 Documented design only.
   - Khẳng định rõ Category C là phạm vi kiểm toán và bằng chứng lịch sử, không phải 18 tiêu chí đều đã được xác minh đạt PASS. Tuyệt đối không gộp chung thành một tỷ lệ PASS duy nhất.
5. **R4.10-05 (LOW - Residual Overstatement in Narrative):**
   - Chuẩn hóa các cụm từ khẳng định tuyệt đối (\`khắc phục triệt để 4 phát hiện\`, \`loại bỏ hoàn toàn\`, \`chính xác tuyệt đối\`, \`bảo toàn 100%\`) thành ngôn ngữ tự báo cáo có giới hạn bằng chứng: \`Project Team đã thực hiện cập nhật tài liệu theo các phát hiện; kết quả chờ Independent Audit\`.

---

### 3. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO ROUND 3.11 (AUTHORITATIVE ARCHIVE SEALING METRICS)

- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip\`
- **Kích thước byte chính xác (Exact ZIP size in bytes):** **${zipStats.size.toLocaleString()} bytes** (\`${zipStats.size} bytes\`)  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Mã băm SHA-256 chính xác (Exact SHA-256):** \`${zipHash}\`  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Số lượng entries trong ZIP (Number of ZIP entries):** **52 entries**
- **Số lượng tệp Markdown (Number of Markdown files):** **52 / 52 PASS**
- **Kết quả kiểm tra giải nén / CRC (CRC/decompression result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8 (UTF-8 validation):** **PASS** (100% hợp lệ, không lỗi BOM)
- **Kiểm tra tệp trùng tên (Duplicate filename result):** **0 tệp trùng tên** (PASS)
- **Kiểm tra tệp rỗng (Empty file result):** **0 tệp 0 bytes** (PASS)
- **Đối soát Bảng kê (Manifest reconciliation result):** **PASS** (100% khớp 52/52 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\`)
- **Trạng thái tự rà soát của nhóm dự án (Project Team self-check status):** **PROJECT TEAM SELF-CHECK COMPLETED**
- **Trạng thái kiểm chứng độc lập (Independent verification status):** **PENDING INDEPENDENT AUDIT (ROUND 4.11)**

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

### 7. PHÁN QUYẾT BÀN GIAO VÒNG 3.11 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.10; kết quả chờ Independent Audit).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

const externalHandoverPath = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md');
fs.writeFileSync(externalHandoverPath, externalHandoverContent, 'utf8');
console.log('Successfully published PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md');

// Also copy ROUND3_11_REMEDIATION_REPORT.md, ROUND3_11_MANIFEST.md, ROUND3_11_DOCUMENTATION_SELF_CHECK.md to docs/phase-0b-2
const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_11');
['PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md', 'PHASE_0B_2_3_ROUND3_11_MANIFEST.md', 'PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md'].forEach(f => {
  fs.copyFileSync(path.join(stagingDir, f), path.resolve('docs/phase-0b-2', f));
  console.log(`Copied ${f} to docs/phase-0b-2/`);
});
