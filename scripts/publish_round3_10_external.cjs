const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs', 'phase-0b-2');
const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_10');

const exactSize = '224,851';
const exactHash = '27E13AE310B61238ADB1835A8E9DD1306E0DA7A3C187C61B268C8EE5D23348E8';

const externalHandoverContent = `# BIÊN BẢN BÀN GIAO CHÍNH THỨC NGOÀI GÓI LƯU TRỮ – ROUND 3.10
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_10_EXTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.10 Independent Documentation Audit)  
**Phạm vi bàn giao:** Biên bản bàn giao chính thức nằm ngoài archive ZIP (**EXTERNAL HANDOVER – AUTHORITATIVE CHECKSUM SOURCE**). Tuyệt đối không thay đổi mã nguồn, không thao tác cơ sở dữ liệu, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ NGUYÊN TẮC BÀN GIAO MỚI (R4.9-01 / R3.10-01 ARCHITECTURE)
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.9 tại Báo cáo kiểm toán \`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_9.md\` và Phán quyết \`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_9.md\`.
- **Nguyên tắc loại bỏ hoàn toàn đệ quy mã băm (Eliminate Self-Referential Checksum):**
  * Biên bản bàn giao này nằm **BÊN NGOÀI** gói lưu trữ ZIP và là **NGUỒN CÓ THẨM QUYỀN DUY NHẤT** ghi nhận kích thước byte chính xác và chuỗi mã băm SHA-256 của gói lưu trữ \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_10.zip\`.
  * Không nhúng chuỗi mã băm SHA-256 của chính gói ZIP hiện hành vào bất kỳ tệp nào nằm bên trong gói ZIP đó.
  * Tệp bàn giao nội bộ bên trong ZIP (\`PHASE_0B_2_3_ROUND3_10_INTERNAL_HANDOVER.md\`) tuyên bố rõ thẩm quyền đối soát thuộc về biên bản bàn giao bên ngoài này.
  * Chuỗi mã băm và kích thước byte trong biên bản này được tính toán trực tiếp từ chính file ZIP cuối cùng sau khi hoàn tất đóng gói toàn bộ 48 tệp nội bộ, bảo đảm không có bất kỳ thay đổi nào đối với ZIP sau thời điểm tính toán.

---

### 2. KẾT QUẢ XỬ LÝ 4 PHÁT HIỆN KIỂM TOÁN ROUND 4.9
1. **R4.9-01 (CRITICAL - Eliminate Self-Referential Checksum):**
   - Đã cập nhật Section 9 \`ROUND3_9_HANDOVER.md\` và Section 7 \`ROUND3_9_REMEDIATION_REPORT.md\` ghi đúng mã băm lịch sử do Round 4.9 xác minh: 209,460 bytes, SHA-256 \`CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693\` (\`Independent Audit Round 4.9 verified\`).
   - Thiết lập cấu trúc bàn giao 2 lớp: External Handover này ghi nhận checksum chính thức; Internal Handover bên trong ZIP ghi nhận thẩm quyền ngoại vi.
2. **R4.9-02 (HIGH - Manifest Inventory & Classification):**
   - Phân chia 48 tệp nội bộ gói Round 3.10 thành 6 nhóm độc lập loại trừ lẫn nhau, tổng khớp chính xác 48/48 tệp:
     * Nhóm 1: Tài liệu quy chuẩn cốt lõi (Core Specifications): **4 tệp**
     * Nhóm 2: Đặc tả kiến trúc và thiết kế UX/UI: **8 tệp**
     * Nhóm 3: Hồ sơ kiểm chứng & lịch sử hiệu chỉnh Round 3.0 - 3.7: **27 tệp**
     * Nhóm 4: Hồ sơ kế thừa Round 3.8 đã hiệu chỉnh: **3 tệp**
     * Nhóm 5: Hồ sơ kế thừa Round 3.9 đã hiệu chỉnh: **3 tệp**
     * Nhóm 6: Tài liệu bàn giao nội bộ mới Round 3.10: **3 tệp**
     * Tổng cộng: **4 + 8 + 27 + 3 + 3 + 3 = 48 tệp** (Khớp số học 100%).
   - Tự kê khai đúng số dòng của tệp Manifest (132 dòng) theo quy chuẩn \`split('\\n').length\`.
3. **R4.9-03 (HIGH - Evidence Provenance & Historical Claim Wording):**
   - Sửa dòng 9 \`DELTA_VERIFICATION_REPORT_ROUND3_2.md\` thành nhận định tự báo cáo lịch sử: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`.
   - Phân biệt nghiêm ngặt 3 cấp độ: \`PROJECT TEAM SELF-REPORTED\`, \`PROJECT TEAM SELF-CHECKED\`, \`INDEPENDENTLY VERIFIED\`.
   - Gắn nhãn \`[QUOTED LEGACY PHRASE]\` đối với các cụm từ khẳng định cũ khi trích dẫn văn cảnh lịch sử.
4. **R4.9-04 (MEDIUM - Quality Gate Scope & Category C Reclassification):**
   - Đổi tên Category C thành: \`INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE\`.
   - Phân rã 18 tiêu chí thành các trạng thái thực tế độc lập: 4 Archive integrity + 1 Historical vocabulary + 2 Hard blocks retained + 11 Documented design only.
   - Khẳng định rõ Category C là phạm vi kiểm toán và bằng chứng lịch sử, không phải 18 tiêu chí đều đã được xác minh đạt PASS. Tuyệt đối không gộp chung thành một tỷ lệ PASS duy nhất.

---

### 3. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO ROUND 3.10 (AUTHORITATIVE ARCHIVE SEALING METRICS)

- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_10.zip\`
- **Kích thước byte chính xác (Exact ZIP size in bytes):** **${exactSize} bytes**  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Mã băm SHA-256 chính xác (Exact SHA-256):** \`${exactHash}\`  
  *(\`PROJECT TEAM SELF-COMPUTED FROM FINAL ZIP – PENDING INDEPENDENT VERIFICATION\`)*
- **Số lượng entries trong ZIP (Number of ZIP entries):** **48 entries**
- **Số lượng tệp Markdown (Number of Markdown files):** **48 / 48 PASS**
- **Kết quả kiểm tra giải nén / CRC (CRC/decompression result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8 (UTF-8 validation):** **PASS** (100% hợp lệ, không lỗi BOM)
- **Kiểm tra tệp trùng tên (Duplicate filename result):** **0 tệp trùng tên** (PASS)
- **Kiểm tra tệp rỗng (Empty file result):** **0 tệp 0 bytes** (PASS)
- **Đối soát Bảng kê (Manifest reconciliation result):** **PASS** (100% khớp 48/48 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_10_MANIFEST.md\`)
- **Trạng thái tự rà soát của nhóm dự án (Project Team self-check status):** **PROJECT TEAM SELF-CHECK COMPLETED**
- **Trạng thái kiểm chứng độc lập (Independent verification status):** **PENDING INDEPENDENT AUDIT (ROUND 4.10)**

---

### 4. BẢO TOÀN DANH MỤC TRẠNG THÁI BẮT BUỘC (MANDATORY STATUSES RETAINED)
Toàn bộ 9 trạng thái kiểm soát bắt buộc được giữ nguyên văn 100%:
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

---

### 7. PHÁN QUYẾT BÀN GIAO VÒNG 3.10 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Hồ sơ tài liệu kỹ thuật đã hoàn tất tự hiệu chỉnh theo 4 phát hiện R4.9-01 đến R4.9-04, loại bỏ hoàn toàn đệ quy mã băm tự tham chiếu bằng biên bản bàn giao bên ngoài có thẩm quyền số liệu duy nhất, chuẩn hóa Category C thành phạm vi kiểm toán/bằng chứng lịch sử, chuẩn hóa phát biểu lịch sử, Manifest đối soát 48 tệp, và hồ sơ sẵn sàng chuyển giao sang Independent Documentation Audit Round 4.10).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

fs.writeFileSync(path.join(docsDir, 'PHASE_0B_2_3_ROUND3_10_EXTERNAL_HANDOVER.md'), externalHandoverContent, 'utf8');
console.log('Written docs/phase-0b-2/PHASE_0B_2_3_ROUND3_10_EXTERNAL_HANDOVER.md');

// Also copy report and manifest to docs/phase-0b-2/
fs.copyFileSync(
  path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_10_REMEDIATION_REPORT.md'),
  path.join(docsDir, 'PHASE_0B_2_3_ROUND3_10_REMEDIATION_REPORT.md')
);
console.log('Copied PHASE_0B_2_3_ROUND3_10_REMEDIATION_REPORT.md to docs/phase-0b-2/');

fs.copyFileSync(
  path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_10_MANIFEST.md'),
  path.join(docsDir, 'PHASE_0B_2_3_ROUND3_10_MANIFEST.md')
);
console.log('Copied PHASE_0B_2_3_ROUND3_10_MANIFEST.md to docs/phase-0b-2/');
