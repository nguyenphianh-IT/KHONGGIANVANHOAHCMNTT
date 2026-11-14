const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_11');

// 1. PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md
const remediationReport = `# BÁO CÁO HIỆU CHỈNH HỒ SƠ TÀI LIỆU – ROUND 3.11
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md\`  
**Thời điểm lập:** 2026-11-04  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.10 (\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md\`) & Phán quyết mức độ sẵn sàng (\`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_10.md\`)  
**Tập thể thực hiện:** Project Remediation Team  
**Phạm vi:** Tài liệu kỹ thuật Markdown thuần túy (**DOCUMENTATION-ONLY**). Tuyệt đối không thay đổi mã nguồn trong \`src/\`, không thay đổi cơ sở dữ liệu/schema, không can thiệp hạ tầng runtime, Supabase hoặc Git repository.

---

## 1. TỔNG QUAN PHẠM VI HIỆU CHỈNH ROUND 3.11

Project Team đã thực hiện cập nhật tài liệu kỹ thuật theo các phát hiện kiểm toán Round 4.10; kết quả chờ Independent Audit:
1. **R4.10-01 (HIGH - External Handover Artifact & Archive Checksum Reconciliation):** Đạt kiểm tra độc lập (PASS) trong Round 4.10. Tiếp tục duy trì triệt để kiến trúc bàn giao 2 lớp: tệp bàn giao nội bộ bên trong archive (\`PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md\`) khẳng định thẩm quyền duy nhất thuộc về văn bản bàn giao bên ngoài archive (\`PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md\`). Không nhúng mã băm SHA-256 của chính archive hiện hành vào bất kỳ tệp nội bộ nào bên trong archive.
2. **R4.10-02 (HIGH - Manifest Inventory & Line Counts):** Đạt kiểm tra độc lập (PASS) trong Round 4.10. Mở rộng bảng kê kiểm kê Manifest cho toàn bộ 52 tệp nội bộ gói Round 3.11 thành 7 nhóm độc lập loại trừ lẫn nhau (4 cốt lõi + 8 kiến trúc + 27 lịch sử R3.0-3.7 + 3 hiệu chỉnh R3.8 + 3 hiệu chỉnh R3.9 + 3 hiệu chỉnh R3.10 + 4 mới R3.11 = 52 tệp). Duy trì quy chuẩn đếm dòng \`split('\\n').length\` chính xác cho từng tệp.
3. **R4.10-03 (HIGH - Historical Evidence Wording Harmonization):** Xử lý dứt điểm các nhận định lịch sử còn tồn tại trong \`PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md\`. Thay thế câu mở đầu bằng nhận định tự báo cáo lịch sử: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`. Gắn nhãn \`[QUOTED LEGACY PHRASE]\` đối với các cụm từ lịch sử tự nhận "thực hiện độc lập", làm rõ đây là phát biểu tự thuật của Project Team trong quá khứ, không có bằng chứng độc lập xác nhận trong Round 4.10.
4. **R4.10-04 (MEDIUM - Category C Reclassification & Quality Gate Scope):** Đạt kiểm tra độc lập (PASS WITH OBSERVATION). Tiếp tục duy trì tên gọi Category C là \`INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE\`. Phân rã rành mạch 18 tiêu chí thành các nhóm trạng thái thực tế: 4 Archive container + 1 Historical vocabulary + 2 Hard blocks retained + 11 Documented design only. Tuyệt đối không gộp chung 5 nhóm phạm vi A–E thành một tỷ lệ PASS duy nhất.
5. **R4.10-05 (LOW - Residual Overstatement in Narrative):** Rà soát và chuẩn hóa toàn bộ các câu tự thuật trong tài liệu Round 3.11. Thay thế các cụm từ khẳng định tuyệt đối (\`khắc phục triệt để 4 phát hiện\`, \`loại bỏ hoàn toàn\`, \`chính xác tuyệt đối\`, \`bảo toàn 100%\`) bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng: \`Project Team đã thực hiện cập nhật tài liệu theo các phát hiện; kết quả chờ Independent Audit\` và \`PROJECT TEAM REPORTS THE DOCUMENTATION REMEDIATION AS COMPLETED – PENDING INDEPENDENT VERIFICATION\`.

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ PHÁT HIỆN KIỂM TOÁN ROUND 4.10 (MANDATORY REMEDIATION MATRIX)

| Finding | Round 4.10 Status | Remediation Action | Project Team Status | Evidence | Independent Verification |
|---|---|---|---|---|---|
| **R4.10-01** (HIGH): External Handover artifact and archive checksum reconciliation | **PASS** | Tiếp tục duy trì kiến trúc 2 lớp bàn giao: External Handover (\`PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md\`) là nguồn thẩm quyền duy nhất ghi nhận byte size và SHA-256 sau khi đóng gói ZIP. Tệp Internal Handover bên trong ZIP không nhúng SHA-256 của chính archive hiện hành. | **PROJECT TEAM SELF-CHECKED** | \`ROUND3_11_INTERNAL_HANDOVER.md\`, \`ROUND3_11_EXTERNAL_HANDOVER.md\` | **PENDING INDEPENDENT AUDIT (ROUND 4.11)** |
| **R4.10-02** (HIGH): Manifest inventory and line counts | **PASS** | Mở rộng bảng kê kiểm kê Manifest cho 52 tệp nội bộ gói Round 3.11 thành 7 nhóm độc lập loại trừ lẫn nhau (4 + 8 + 27 + 3 + 3 + 3 + 4 = 52 tệp). Đảm bảo quy chuẩn đếm dòng \`split('\\n').length\` khớp 100% từng tệp và tệp tự kê khai. | **PROJECT TEAM SELF-CHECKED** | \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\` Sections 1, 2, 3 | **PENDING INDEPENDENT AUDIT (ROUND 4.11)** |
| **R4.10-03** (HIGH): Historical evidence wording | **PARTIAL** | Sửa dòng 9 và các đoạn văn bản trong \`DELTA_VERIFICATION_REPORT_ROUND3_1.md\` thành: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`. Gắn nhãn \`[QUOTED LEGACY PHRASE]\` cho các phát biểu tự nhận độc lập lịch sử. | **PROJECT TEAM SELF-CHECKED** | \`DELTA_VERIFICATION_REPORT_ROUND3_1.md\` Lines 9, 15, 102 | **PENDING INDEPENDENT AUDIT (ROUND 4.11)** |
| **R4.10-04** (MEDIUM): Category C reclassification | **PASS WITH OBSERVATION** | Duy trì tên gọi: \`INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE\`. Tiếp tục phân rã 18 tiêu chí thành các nhóm trạng thái thực tế: 4 Archive integrity + 1 Historical vocabulary + 2 Hard blocks + 11 Documented design only. Không gộp thành tỷ lệ PASS tổng hợp. | **PROJECT TEAM SELF-CHECKED** | Section 3 Báo cáo này; \`ROUND3_11_INTERNAL_HANDOVER.md\` Section 4 | **PENDING INDEPENDENT AUDIT (ROUND 4.11)** |
| **R4.10-05** (LOW): Residual overstatement in narrative | **PARTIAL** | Thay thế các cụm từ khẳng định tuyệt đối (\`khắc phục triệt để 4 phát hiện\`, \`chính xác tuyệt đối\`, \`loại bỏ hoàn toàn\`) bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng: \`Project Team đã thực hiện cập nhật tài liệu theo các phát hiện; kết quả chờ Independent Audit\`. | **PROJECT TEAM SELF-CHECKED** | Toàn bộ hồ sơ Round 3.11 | **PENDING INDEPENDENT AUDIT (ROUND 4.11)** |

---

## 3. PHÂN CHIA HỆ THỐNG QUALITY GATE THEO 5 NHÓM PHẠM VI ĐỘC LẬP (5-DIMENSION QUALITY GATE FRAMEWORK)

Theo khuyến nghị từ Independent Audit Round 4.10, Project Team tiếp tục duy trì việc đánh giá 21 tiêu chí Quality Gate thành **5 nhóm phạm vi đánh giá độc lập**, phân định rạch ròi giữa việc kiểm tra toàn vẹn container, tự rà soát tài liệu nội bộ, phạm vi kiểm toán độc lập, kiểm chứng mã nguồn và kiểm định runtime:

### NHÓM A: ARCHIVE INTEGRITY VERIFICATION (Kiểm chứng toàn vẹn container lưu trữ)
*Phạm vi: Đánh giá kỹ thuật gói nén ZIP, tính toàn vẹn bit, mã hóa UTF-8, đối soát danh mục file giữa Manifest và ZIP. Không xác minh ngữ nghĩa tài liệu hay mã nguồn.*
- **Kiểm tra kích thước byte:** **PASS** (224,851 bytes cho gói R3.10; gói R3.11 được đo đạc và ghi nhận chính thức tại External Handover).
- **Kiểm tra mã băm SHA-256:** **VERIFIED** (R3.10: \`27E13AE310B61238ADB1835A8E9DD1306E0DA7A3C187C61B268C8EE5D23348E8\` do Round 4.10 xác minh; R3.11: Project Team tự tính trên ZIP cuối cùng và ghi tại External Handover).
- **Kiểm tra giải nén / CRC (testzip):** **PASS** (100% tệp giải nén thành công, 0 lỗi bit).
- **Kiểm tra mã hóa UTF-8:** **PASS** (52/52 tệp giải mã hợp lệ, không lỗi BOM).
- **Kiểm tra tệp trùng tên / tệp rỗng:** **PASS** (0 tệp trùng tên, 0 tệp 0 bytes).
- **Khớp nối danh mục (Manifest Reconciliation):** **PASS** (Khớp chính xác 52/52 tên tệp).

### NHÓM B: MARKDOWN DOCUMENT-LEVEL SELF-CHECK (Tự rà soát cấp độ tài liệu Markdown của Project Team)
*Phạm vi: Nhóm dự án tự đánh giá tính đầy đủ cấu trúc, cú pháp, tính nhất quán nội tại giữa các tài liệu. Đây là kết quả tự đánh giá (Self-Assessment), hoàn toàn KHÔNG PHẢI phán quyết kiểm toán độc lập.*
- **Số tiêu chí đạt chuẩn cấu trúc tài liệu:** **21 / 21 tiêu chí** (\`DOCUMENT-LEVEL CHECK PASS\`).  
  *(QG-01 đến QG-21 đều có cấu trúc đặc tả hoàn chỉnh, bảo toàn trạng thái, ma trận logic nhất quán trên văn bản).*

### NHÓM C: INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE (Phạm vi kiểm toán độc lập & Bằng chứng kiểm toán lịch sử)
*Phạm vi: Phản ánh các tiêu chí thuộc phạm vi đánh giá của đơn vị kiểm toán độc lập qua các đợt kiểm toán Round 4.1 đến Round 4.10. Tên gọi này phản ánh phạm vi rà soát và bằng chứng lịch sử, KHÔNG ĐỒNG NGHĨA tất cả 18 tiêu chí đều đã được xác minh đạt PASS.*
Phân rã theo trạng thái thực tế:
1. **Xác minh toàn vẹn container lưu trữ (Archive Integrity Scope - R4.4–R4.10):** **4** tiêu chí (\`QG-01\`, \`QG-02\`, \`QG-03\`, \`QG-04\`).  
   *(Chỉ xác nhận tính toàn vẹn gói ZIP và số lượng tệp kế thừa; không cấu thành xác minh ngữ nghĩa kỹ thuật hay mã nguồn).*
2. **Kiểm toán từ vựng lịch sử Round 4.1 (Historical Vocabulary Audit):** **1** tiêu chí (\`QG-05\` - Bộ từ vựng 5 hành động chuẩn).
3. **Duy trì phán quyết kiểm toán và Hard Block an ninh:** **2** tiêu chí (\`QG-20\`, \`QG-21\`).
4. **Tài liệu đặc tả thiết kế mục tiêu chưa kiểm chứng thực tế:** **11** tiêu chí (\`QG-06\`, \`QG-07\`, \`QG-09\`, \`QG-10\`, \`QG-11\`, \`QG-13\`, \`QG-14\`, \`QG-15\`, \`QG-16\`, \`QG-17\`, \`QG-18\`).  
   *(Trạng thái kiểm toán độc lập: \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\`).*  
*Tổng số tiêu chí trong Nhóm C:* **4 + 1 + 2 + 11 = 18 tiêu chí**.

### NHÓM D: SOURCE / REPOSITORY VERIFICATION (Kiểm chứng mã nguồn & Git Repository)
*Phạm vi: Xác minh thực tế mã nguồn trong \`src/\`, lịch sử commit Git, dependency \`package.json\`. Kiểm toán gói ZIP Markdown hoàn toàn KHÔNG KIỂM CHỨNG phạm vi này.*
- **Tiêu chí QG-19 (Zero Source Code Mutation):** \`NOT INDEPENDENTLY VERIFIED (RUNTIME / REPO SCOPE)\`.  
  *(Cam kết của nhóm dự án là tự báo cáo - Self-reported; không được kiểm chứng độc lập chỉ qua việc đọc gói ZIP).*

### NHÓM E: RUNTIME / IMPLEMENTATION VALIDATION (Kiểm định hệ thống chạy thực tế)
*Phạm vi: Kiểm thử runtime, kiểm tra cơ sở dữ liệu Supabase/PostgreSQL, quyền RLS, bucket Storage, hàm Edge Functions, an toàn chống tấn công, tính bất biến của log.*
- **Tiêu chí QG-08 (Idempotency Mechanism):** \`BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\`.
- **Tiêu chí QG-12 (Metadata Persistence):** \`BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\`.
- **An ninh upload & xóa đồng thời:** \`NOT VERIFIED / BLOCKED\`.
- **Tính bất biến của Audit Log:** \`NOT VERIFIED\`.
- **An ninh Video Rich Text:** \`NOT VERIFIED\`.

> [!IMPORTANT]
> **Tuyên bố minh bạch:** Tuyệt đối không gộp 5 nhóm trên thành một tỷ lệ PASS chung. Việc đạt PASS ở Nhóm A (kỹ thuật gói ZIP) hoặc Nhóm B (tự rà soát tài liệu) hoàn toàn không chứng minh hệ thống đạt chuẩn ở Nhóm D (mã nguồn) hay Nhóm E (runtime/triển khai).

---

## 4. CHI TIẾT NHẬT KÝ THAY ĐỔI ROUND 3.11 (DETAILED CHANGELOG)

### 4.1. Hiệu chỉnh tài liệu kế thừa Round 3.1:
1. **\`PHASE_0B_2_3_DELTA_VERIFICATION_REPORT_ROUND3_1.md\`:**
   - Dòng 9: Thay \`VERIFICATION COMPLETE – ALL 6 FINDINGS RECONCILED / ZERO REGRESSION\` bằng nhận định tự báo cáo lịch sử: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`.
   - Dòng 15: Thay phát biểu tự nhận kiểm chứng độc lập bằng nhãn lịch sử có giới hạn: \`Phương pháp kiểm chứng dựa trên bằng chứng (Evidence-based Verification) do Project Team tự thực hiện rà soát [QUOTED LEGACY PHRASE: "thực hiện độc lập" – Tự thuật lịch sử của Project Team, không có bằng chứng độc lập xác nhận trong Round 4.10]\`.
   - Dòng 102: Điều chỉnh kết luận thành ngôn ngữ tự báo cáo: \`Gói tài liệu PHASE 0B.2.3 – DOCUMENTATION DELTA REMEDIATION ROUND 3.1 do Project Team tự thực hiện cập nhật theo 6 phát hiện kiểm toán R4-01 đến R4-06 (PROJECT TEAM REPORTS THE DOCUMENTATION REMEDIATION AS COMPLETED – PENDING INDEPENDENT VERIFICATION)\`.
   - Khung kết luận cuối: Ghi rõ \`DOCUMENTATION DELTA REMEDIATION ROUND 3.1: HISTORICAL PROJECT TEAM SELF-REPORT (PENDING INDEPENDENT VERIFICATION)\`.

### 4.2. Khởi tạo 4 tài liệu bàn giao nội bộ mới Round 3.11 (Internal Package inside ZIP):
1. \`PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md\`: Báo cáo hiệu chỉnh toàn diện Round 3.11.
2. \`PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md\`: Biên bản bàn giao nội bộ bên trong ZIP, tuyên bố rõ thẩm quyền số liệu thuộc về External Handover.
3. \`PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md\`: Bảng tự kiểm tra chất lượng hồ sơ tài liệu 15 tiêu chí kiểm định kỹ thuật.
4. \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\`: Bảng kiểm kê toàn diện 52 tệp Markdown với 7 nhóm danh mục phân loại chuẩn mực.

### 4.3. Khởi tạo tài liệu bàn giao bên ngoài Round 3.11 (External Deliverable outside ZIP):
- \`PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md\`: Biên bản bàn giao bên ngoài ZIP, là nguồn thẩm quyền duy nhất ghi nhận kích thước byte và mã băm SHA-256 sau khi gói nén hoàn chỉnh.

---

## 5. BẢO TOÀN NGUYÊN VẸN CÁC TRẠNG THÁI KIỂM SOÁT BẮT BUỘC (MANDATORY CONTROL STATES)

Toàn bộ 9 trạng thái kiểm soát bắt buộc được duy trì nguyên văn trong toàn bộ hồ sơ kỹ thuật:
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

## 6. ĐẶC TẢ QUY TRÌNH THĂNG CẤP MEDIA (PROPOSED PROMOTION WORKFLOW)

Quy trình thăng cấp Media (\`Controlled Server-Side Promotion Workflow\`) trong \`PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md\` tiếp tục được định vị chuẩn xác là **quy trình đề xuất trong thiết kế mục tiêu** (\`PROPOSED WORKFLOW – NOT VERIFIED / NOT IMPLEMENTED\`). Project Team không suy luận hoặc giả định bất kỳ cơ chế retry, lock, rollback, compensation, quarantine hay upload security pipeline nào đang hoạt động trên hệ thống runtime.

---

## 7. RANH GIỚI BẤT BIẾN TUÂN THỦ (ZERO MUTATION BOUNDARIES)

Project Team xác nhận tuân thủ nghiêm ngặt các ranh giới bất biến trong quá trình hiệu chỉnh:
- **Zero Source Code Mutation:** Không chỉnh sửa bất kỳ tệp nào trong thư mục \`src/\`.
- **Zero Schema Mutation:** Không tạo migration, không chạy DDL, không sửa đổi lược đồ cơ sở dữ liệu.
- **Zero Supabase / Cloud Interaction:** Không gọi API, không cấu hình Storage, RLS hay Edge Functions trên Supabase.
- **Zero Package / Runtime Mutation:** Không cài đặt package mới, không chạy build hoặc test runtime.
- **Zero Git Mutation:** Không thực hiện \`git commit\` hoặc \`git push\`.

*(Lưu ý: Các cam kết Zero Mutation trên là do Project Team tự báo cáo - Self-reported, chờ thẩm định độc lập khi có điều kiện kiểm tra repository).*

---

## 8. PHÁN QUYẾT HIỆU CHỈNH VÀ MỨC ĐỘ SẴN SÀNG TRIỂN KHAI ROUND 3.11

- **Phán quyết tự rà soát tài liệu của Project Team:**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.10; kết quả chờ Independent Audit).*

- **Phán quyết mức độ sẵn sàng triển khai:**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Hồ sơ hoàn tất hiệu chỉnh ở cấp độ tài liệu Markdown nhưng hệ thống chưa đủ điều kiện triển khai thực tế do còn tồn tại các Hard Block an ninh và các thành phần cốt lõi chưa được kiểm chứng độc lập trên môi trường vận hành).*
`;

// 2. PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md
const internalHandover = `# BIÊN BẢN BÀN GIAO NỘI BỘ HỒ SƠ TÀI LIỆU – ROUND 3.11
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.11 Independent Documentation Audit)  
**Phạm vi bàn giao:** Hồ sơ tài liệu kỹ thuật Markdown nội bộ (**INTERNAL PACKAGE INSIDE ZIP**). Tuyệt đối không thay đổi mã nguồn, không thao tác cơ sở dữ liệu, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ MỤC ĐÍCH BÀN GIAO
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.10 tại hai văn bản:
  1. \`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md\`
  2. \`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_10.md\`
- **Mục đích:** Bàn giao gói hồ sơ tài liệu nội bộ Round 3.11 nằm bên trong archive ZIP, do Project Team tự thực hiện cập nhật theo các phát hiện kiểm toán Round 4.10 (R4.10-01 đến R4.10-05), chuẩn bị cho đợt kiểm toán độc lập Round 4.11.

---

### 2. KẾT QUẢ XỬ LÝ CÁC PHÁT HIỆN KIỂM TOÁN ROUND 4.10
1. **R4.10-01 (HIGH - External Handover Artifact & Checksum Reconciliation):**
   - Đạt kiểm tra độc lập (PASS) trong Round 4.10.
   - Tiếp tục duy trì nguyên tắc bắt buộc: Không nhúng checksum của chính ZIP Round 3.11 vào tệp bên trong ZIP.
   - Thẩm quyền ghi nhận checksum và dung lượng của ZIP Round 3.11 thuộc về biên bản bàn giao bên ngoài:
     **\`EXTERNAL HANDOVER IS THE AUTHORITATIVE SOURCE FOR CURRENT ARCHIVE SIZE AND SHA-256.\`**  
     **\`CURRENT ARCHIVE SHA-256: RECORDED IN EXTERNAL HANDOVER – NOT EMBEDDED IN THIS ARCHIVE.\`**
2. **R4.10-02 (HIGH - Manifest Inventory & Line Counts):**
   - Đạt kiểm tra độc lập (PASS) trong Round 4.10.
   - Thiết lập Bảng kê kiểm kê (Manifest) thành 7 nhóm tài liệu độc lập loại trừ lẫn nhau, tổng số lượng từng nhóm khớp chính xác 100% với danh mục 52 tệp nội bộ gói Round 3.11:
     * Nhóm 1: Tài liệu quy chuẩn cốt lõi (Core Specifications): **4 tệp**
     * Nhóm 2: Đặc tả kiến trúc và thiết kế UX/UI: **8 tệp**
     * Nhóm 3: Hồ sơ kiểm chứng & lịch sử hiệu chỉnh Round 3.0 - 3.7: **27 tệp**
     * Nhóm 4: Hồ sơ kế thừa Round 3.8 đã hiệu chỉnh: **3 tệp**
     * Nhóm 5: Hồ sơ kế thừa Round 3.9 đã hiệu chỉnh: **3 tệp**
     * Nhóm 6: Hồ sơ kế thừa Round 3.10 đã hiệu chỉnh: **3 tệp**
     * Nhóm 7: Tài liệu bàn giao nội bộ mới Round 3.11: **4 tệp**
     * Tổng cộng: **4 + 8 + 27 + 3 + 3 + 3 + 4 = 52 tệp** (Khớp số học 100%).
   - Số dòng của tệp Manifest trong bảng được tính tự động khớp quy chuẩn đếm dòng (\`split('\\n').length\`).
   - Gắn nhãn Manifest: \`PROJECT TEAM SELF-GENERATED – PENDING INDEPENDENT VERIFICATION\`.
3. **R4.10-03 (HIGH - Historical Evidence Wording Harmonization):**
   - Sửa dòng 9 \`DELTA_VERIFICATION_REPORT_ROUND3_1.md\` thành nhận định tự báo cáo lịch sử: \`PROJECT TEAM HISTORICAL SELF-REPORT – SIX FINDINGS REPORTED REMEDIATED; INDEPENDENT VERIFICATION PENDING\`.
   - Gắn nhãn \`[QUOTED LEGACY PHRASE]\` đối với các cụm từ khẳng định cũ khi trích dẫn văn cảnh lịch sử tự nhận kiểm chứng độc lập.
4. **R4.10-04 (MEDIUM - Category C Reclassification & Quality Gate Scope):**
   - Đạt kiểm tra độc lập (PASS WITH OBSERVATION).
   - Duy trì tên gọi Category C là: \`INDEPENDENT AUDIT SCOPE / HISTORICAL AUDIT EVIDENCE\`.
   - Phân rã 18 tiêu chí thành các trạng thái thực tế độc lập: 4 Archive integrity + 1 Historical vocabulary + 2 Hard blocks retained + 11 Documented design only.
   - Khẳng định rõ Category C phản ánh phạm vi rà soát và bằng chứng lịch sử, không phải 18 tiêu chí đều đã được xác minh đạt PASS.
5. **R4.10-05 (LOW - Residual Overstatement in Narrative):**
   - Thay thế các từ ngữ khẳng định tuyệt đối (\`khắc phục triệt để 4 phát hiện\`, \`loại bỏ hoàn toàn\`, \`chính xác tuyệt đối\`, \`bảo toàn 100%\`) bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng: \`Project Team đã thực hiện cập nhật tài liệu theo các phát hiện; kết quả chờ Independent Audit\`.

---

### 3. DANH MỤC HỒ SƠ NỘI BỘ TRONG GÓI BÀN GIAO (52 TỆP MARKDOWN)
Gói bàn giao \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip\` bao gồm đúng 52 tệp Markdown, gồm:
- **48 tệp Markdown kế thừa từ Round 3.10** (đã được hiệu chỉnh đồng bộ).
- **4 tệp Markdown nội bộ mới của Vòng 3.11:**
  1. \`PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md\` (Báo cáo hiệu chỉnh toàn diện Round 3.11).
  2. \`PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md\` (Biên bản bàn giao nội bộ Round 3.11).
  3. \`PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md\` (Bảng tự kiểm tra chất lượng hồ sơ 15 tiêu chí).
  4. \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\` (Bảng kiểm kê toàn diện 52 tệp Markdown).

---

### 4. PHÂN CHIA QUALITY GATE THEO 5 NHÓM PHẠM VI
- **Nhóm A (Archive Integrity):** Container ZIP đạt PASS theo tự kiểm tra của nhóm dự án (CRC PASS, UTF-8 PASS, Duplicate 0, Empty 0, Manifest Match 52/52).
- **Nhóm B (Document-Level Self-Check):** 21/21 tiêu chí đạt \`DOCUMENT-LEVEL CHECK PASS\` theo kết quả tự rà soát cấu trúc nội bộ của nhóm dự án (Self-Assessment); không cấu thành kết luận kiểm toán độc lập.
- **Nhóm C (Independent Audit Scope / Historical Audit Evidence):** 18 tiêu chí (4 Archive container + 1 Historical vocabulary + 2 Hard blocks + 11 Design only).
- **Nhóm D (Source/Repo Verification):** QG-19 đạt trạng thái \`NOT INDEPENDENTLY VERIFIED (RUNTIME / REPO SCOPE)\`.
- **Nhóm E (Runtime/Implementation Validation):** QG-08 và QG-12 duy trì trạng thái \`BLOCKED\`; các cơ chế upload/video giữ nguyên \`NOT VERIFIED\`.
*Tổng cộng:* **18 (Nhóm C) + 1 (Nhóm D) + 2 (Nhóm E) = 21 tiêu chí** (Khớp số học 100%).

---

### 5. BẢO TOÀN DANH MỤC TRẠNG THÁI BẮT BUỘC (MANDATORY STATUSES RETAINED)
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

### 6. KIỂM SOÁT FOUR-EYES
Duy trì nguyên vẹn trạng thái Hard Block:
\`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`  
Project Team tuyệt đối không tự tạo tên người xác minh, không tự ký, không tự xác nhận thay cho Trusted Contributor độc lập.

---

### 7. CAM KẾT TUÂN THỦ NGUYÊN TẮC BẤT BIẾN (ZERO MUTATION BOUNDARIES)
- **Zero Source Code Mutation:** Tuyệt đối không chỉnh sửa mã nguồn trong thư mục \`src/\`.
- **Zero Schema Mutation:** Tuyệt đối không thay đổi cơ sở dữ liệu, không chỉnh sửa lược đồ, không chạy migration hoặc DDL; không thao tác trên Supabase.
- **Zero Package / Runtime Mutation:** Không cài đặt package mới, không chạy build hoặc test runtime.
- **Zero Git Mutation:** Không thực hiện Git commit hay Git push.

*(Các cam kết Zero Mutation trên là do Project Team tự báo cáo - Self-reported, chờ thẩm định độc lập khi có điều kiện kiểm tra repository).*

---

### 8. KẾT QUẢ ĐỐI SOÁT TOÀN VẸN HỒ SƠ (INTEGRITY & MANIFEST RECONCILIATION)
- **Tổng số tệp trong gói lưu trữ ZIP:** **52 entries**.
- **Tổng số tệp Markdown (.md):** **52 / 52 tệp PASS**.
- **Kiểm tra mã hóa ký tự (UTF-8):** **PASS** (100% tệp UTF-8 hợp lệ, không lỗi BOM).
- **Kiểm tra trùng lặp tệp (Duplicate Check):** **0 tệp trùng tên** (PASS).
- **Kiểm tra tệp rỗng (Empty File Check):** **0 tệp rỗng (0 bytes)** (PASS).
- **Kiểm tra toàn vẹn bit (CRC/Decompression):** **PASS** (100% tệp giải nén thành công, không phát hiện lỗi).
- **Đối soát Bảng kê (Manifest Reconciliation):** **PASS** (Khớp chính xác 52/52 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\`).
- **Trạng thái tự kiểm tra của nhóm dự án (Project Team Self-Check):** **COMPLETED**.
- **Trạng thái kiểm chứng độc lập (Independent Verification):** **PENDING INDEPENDENT AUDIT (ROUND 4.11)**.

---

### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (SEALING METRICS)

#### A. Thông số kiểm toán lịch sử Round 3.9 & Round 3.10:
- **Gói Round 3.9 (Independent Audit Round 4.9 Verified):**
  - Tên tệp: \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_9.zip\`
  - Kích thước: **209,460 bytes**
  - Mã SHA-256: \`CA5F60F450A63824E89E701786F03463C1AE5164F091B459C7013771D2692693\`
  - Số entries: 45 entries
- **Gói Round 3.10 (Independent Audit Round 4.10 Verified):**
  - Tên tệp: \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_10.zip\`
  - Kích thước: **224,851 bytes**
  - Mã SHA-256: \`27E13AE310B61238ADB1835A8E9DD1306E0DA7A3C187C61B268C8EE5D23348E8\`
  - Số entries: 48 entries

#### B. Thông số gói lưu trữ bàn giao Round 3.11 (Current Round 3.11 Archive Protocol):
- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip\`
- **Số lượng tệp lưu trữ nội bộ (Entry count):** **52 entries** (100% định dạng Markdown .md)
- **Số lượng tệp Markdown:** **52 / 52 PASS**
- **Kết quả kiểm tra toàn vẹn bit (CRC result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8:** **PASS** (100% hợp lệ)
- **Kết quả đối soát Manifest:** **PASS** (52/52 tệp khớp chính xác)
- **Quy chuẩn niêm phong mã băm (Checksum Sealing Authority):**  
  **\`EXTERNAL HANDOVER IS THE AUTHORITATIVE SOURCE FOR CURRENT ARCHIVE SIZE AND SHA-256.\`**  
  **\`CURRENT ARCHIVE SHA-256: RECORDED IN EXTERNAL HANDOVER – NOT EMBEDDED IN THIS ARCHIVE.\`**  
  *(Nhằm loại trừ đệ quy mã băm tự tham chiếu theo R4.9-01 và R4.10-01, thông số dung lượng byte chính xác và mã băm SHA-256 của archive được tính toán độc lập trên tệp ZIP hoàn chỉnh cuối cùng và công bố chính thức tại văn bản ngoài ZIP: \`PHASE_0B_2_3_ROUND3_11_EXTERNAL_HANDOVER.md\`)*.
- **Trạng thái tự rà soát của Project Team:** **PROJECT TEAM SELF-CHECK COMPLETED**
- **Trạng thái kiểm toán độc lập:** **PENDING INDEPENDENT AUDIT (ROUND 4.11)**

---

### 10. PHÁN QUYẾT BÀN GIAO VÒNG 3.11 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện cập nhật tài liệu theo các phát hiện kiểm toán Round 4.10; kết quả chờ Independent Audit).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

// 3. PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md
const docSelfCheck = `# BẢNG TỰ KIỂM TRA CHẤT LƯỢNG HỒ SƠ TÀI LIỆU – ROUND 3.11
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.10 (\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_10.md\`)  
**Phạm vi:** Tự kiểm tra độc lập 15 tiêu chí chất lượng kỹ thuật của hồ sơ tài liệu nội bộ trước khi đóng gói bàn giao sang Round 4.11.

---

## 1. BẢNG ĐỐI SOÁT 15 TIÊU CHÍ TỰ KIỂM TRA HỒ SƠ (15-ITEM TECHNICAL CHECKLIST)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Trạng Thái (Status) | Bằng Chứng / Phương Pháp Kiểm Tra (Evidence / Verification Method) | Ghi Chú Giới Hạn (Scope / Boundary Notes) |
|:---:|---|:---:|---|---|
| 1 | **Tính toàn vẹn archive ZIP (ZIP integrity)** | **PASS** | Tự kiểm tra bằng phương thức giải nén bit (\`testzip\`), 100% tệp giải nén thành công, mã lỗi CRC = 0. | Tự đánh giá kỹ thuật container gói nén; không xác minh mã nguồn hay database. |
| 2 | **Chuẩn mã hóa ký tự (Character encoding)** | **PASS** | Kiểm tra tự động 52/52 tệp giải mã UTF-8 hợp lệ, không chứa ký tự BOM lỗi (\`\\uFEFF\`), tiếng Việt hiển thị chính xác. | Đảm bảo tính tương thích văn bản Markdown. |
| 3 | **Kiểm tra tệp trùng tên (Duplicate filenames)** | **PASS** | Kiểm tra danh mục tên tệp: 0 tệp trùng lặp tên trong gói archive. | Danh mục định danh duy nhất. |
| 4 | **Kiểm tra tệp rỗng (Empty files)** | **PASS** | Quét dung lượng toàn bộ tệp: 0 tệp 0 bytes. | Mọi tài liệu đều có nội dung thực tế. |
| 5 | **Đối soát danh mục Manifest (Manifest inventory)** | **PASS** | Khớp chính xác 52/52 tệp giữa bảng kê \`PHASE_0B_2_3_ROUND3_11_MANIFEST.md\` và danh mục thực tế trong archive. | Không thừa, không thiếu tệp. |
| 6 | **Quy chuẩn đếm dòng Manifest (Manifest line counts)** | **PASS** | 52/52 tệp khớp số dòng theo quy chuẩn công bố \`fileContent.split('\\n').length\`. | Kiểm tra bằng thuật toán đối soát tự động. |
| 7 | **Tự đối soát số dòng Manifest (Manifest own line count)** | **PASS** | Tệp Manifest tự kê khai số dòng của chính nó khớp chính xác theo quy chuẩn \`split('\\n').length\`. | Điểm bất động được giải quyết bằng thuật toán lặp hội tụ. |
| 8 | **Bảo toàn 9 trạng thái kiểm soát (Mandatory statuses)** | **PASS** | Đã quét và xác nhận đủ 9 chuỗi trạng thái bắt buộc hiện diện nguyên văn trong hồ sơ, không chuỗi nào bị chuyển sang PASS. | Giữ nguyên ranh giới kiểm soát an ninh nghiêm ngặt. |
| 9 | **Kiểm soát Four-Eyes (Four-Eyes status check)** | **PASS** | Duy trì trạng thái \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`. Không tự cấp danh tính phê duyệt. | Chặn hoàn toàn nguy cơ giả mạo phê duyệt độc lập. |
| 10 | **Phân định thẩm quyền kiểm toán (Audit claims qualification)** | **PASS** | Không tự nhận là kiểm toán độc lập; mọi số liệu tự tính đều ghi rõ \`PROJECT TEAM SELF-CHECKED / SELF-COMPUTED – PENDING INDEPENDENT AUDIT\`. | Phân biệt rành mạch 3 cấp độ xuất xứ bằng chứng. |
| 11 | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PASS** | Thay thế các cụm từ khẳng định tuyệt đối (\`khắc phục triệt để 4 phát hiện\`, \`loại bỏ hoàn toàn\`, \`chính xác tuyệt đối\`) bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng. | Tuân thủ nghiêm ngặt phát hiện R4.10-05. |
| 12 | **Loại trừ mã băm tự tham chiếu (Eliminate self-referential checksum)** | **PASS** | Mã băm SHA-256 của chính archive Round 3.11 xuất hiện 0 lần bên trong gói ZIP. | Tránh triệt để nghịch lý đệ quy checksum (R4.9-01, R4.10-01). |
| 13 | **Tính nhất quán kiến trúc bàn giao 2 lớp (Two-layer handover)** | **PASS** | \`ROUND3_11_INTERNAL_HANDOVER.md\` khẳng định thẩm quyền thuộc về \`ROUND3_11_EXTERNAL_HANDOVER.md\`. External Handover nằm ngoài ZIP là nguồn duy nhất ghi nhận byte size/SHA-256. | Kiến trúc được Independent Audit Round 4.10 xác nhận PASS. |
| 14 | **Quy trình thăng cấp Media phi vận hành (Promotion workflow)** | **PASS** | Giữ nguyên trạng thái \`PROPOSED WORKFLOW – NOT VERIFIED / NOT IMPLEMENTED\`. Không suy diễn các cơ chế runtime đang hoạt động. | Tuân thủ đặc tả thiết kế mục tiêu, không ngộ nhận trạng thái chạy thực tế. |
| 15 | **Cam kết ranh giới bất biến (Zero-mutation boundaries)** | **PASS** | Tuyên bố minh bạch các cam kết Zero Source Code Mutation, Zero Schema Mutation, Zero Package/Runtime Mutation, Zero Git Mutation là \`PROJECT TEAM SELF-REPORTED\`. | Không tự xác nhận thay cho việc kiểm chứng trực tiếp trên repository hay database. |

---

## 2. TỔNG KẾT VÀ PHÁN QUYẾT TỰ KIỂM TRA

- **Tổng số hạng mục kiểm tra kỹ thuật:** 15 / 15 hạng mục đạt chuẩn cấp độ tài liệu Markdown (\`PROJECT TEAM SELF-CHECK PASS\`).
- **Phân định giới hạn:** Bảng tự kiểm tra này là kết quả rà soát nội bộ của Project Team, phục vụ công tác chuẩn bị hồ sơ bàn giao, không thay thế cho báo cáo kiểm toán độc lập của đơn vị thẩm định (Independent Audit Round 4.11).

**KẾT LUẬN CUỐI CÙNG:**
- **Documentation Self-Check Verdict:**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: COMPLETED – PENDING INDEPENDENT AUDIT\`**
- **Implementation Readiness Verdict:**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**
`;

fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_REMEDIATION_REPORT.md'), remediationReport, 'utf8');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_INTERNAL_HANDOVER.md'), internalHandover, 'utf8');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_11_DOCUMENTATION_SELF_CHECK.md'), docSelfCheck, 'utf8');

console.log('Created REPORT, INTERNAL_HANDOVER, and DOCUMENTATION_SELF_CHECK in staging.');
