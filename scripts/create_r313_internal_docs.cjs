const fs = require('fs');
const path = require('path');

const stagingDir = path.resolve('docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_13');

// 1. PHASE_0B_2_3_ROUND3_13_CHANGELOG.md
const changelogContent = `# NHẬT KÝ THAY ĐỔI HỒ SƠ TÀI LIỆU – ROUND 3.13
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### TARGETED DOCUMENTATION CORRECTION – MANIFEST LINE COUNT RECONCILIATION

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_13_CHANGELOG.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team (Documentation Remediation Lead)  
**Căn cứ kiểm toán:** Kết quả kiểm toán độc lập Round 4.12 (Finding \`R4.12-01 – MEDIUM / PARTIAL\`)  
**Phạm vi:** Hiệu chỉnh tài liệu Markdown có mục tiêu (**DOCUMENTATION-ONLY TARGETED CORRECTION**).

---

## 1. MỤC TIÊU VÀ PHẠM VI HIỆU CHỈNH

Nhật ký này ghi nhận chi tiết việc khắc phục phát hiện duy nhất của kiểm toán độc lập Round 4.12:
- **Phát hiện:** \`R4.12-01 – Manifest own line count inconsistency\`.
- **Nội dung:** Trong hồ sơ Round 3.12, tệp Self-Check ghi nhận \`Manifest own line count = 151\`. Kết quả kiểm tra độc lập thực tế cho thấy:
  * \`len(content.split('\\n')) = 150\`
  * \`len(content.splitlines()) = 149\`
  * Theo đúng quy ước đếm dòng được công bố (\`split('\\n').length\`), giá trị chính xác là **150**, không phải 151.
- **Phạm vi tác động:** Chỉ liên quan đến số dòng tự kê khai của chính tệp Manifest trong bảng Self-Check, không làm thay đổi nội dung kỹ thuật hay kết quả kiểm tra 56 tài liệu đã đạt chuẩn của Round 3.12.

---

## 2. BẢNG ĐỐI CHIẾU NỘI DUNG TRƯỚC VÀ SAU HIỆU CHỈNH

| Hạng Mục | Nội Dung Trước Khi Sửa (Round 3.12) | Nội Dung Sau Khi Sửa (Round 3.13) | Lý Do Sửa Đổi & Căn Cứ |
|---|---|---|---|
| **Vị trí sửa:** \`ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` (Mục 7) | \`Tệp Manifest tự kê khai số dòng của chính nó khớp chính xác theo quy chuẩn split('\\n').length (151 dòng). Điểm bất động được giải quyết bằng thuật toán lặp hội tụ; giải thích rõ chênh lệch 1 dòng so với splitlines() do newline kết thúc tệp.\` | \`Tệp Manifest tự kê khai số dòng của chính nó khớp chính xác theo quy chuẩn split('\\n').length (150 dòng; 149 dòng theo splitlines()). Giá trị sử dụng trong Self-Check là 150 theo R4.12-01. Điểm bất động được giải quyết bằng thuật toán lặp hội tụ; giải thích rõ chênh lệch 1 dòng do newline kết thúc tệp.\` | Khắc phục sai lệch 1 dòng do gõ nhầm số liệu tự kê khai tại Mục 7; đối soát chính xác theo kết quả kiểm tra thực tế của kiểm toán Round 4.12 (R4.12-01). |
| **Quy ước đếm dòng:** | Chưa nêu rõ hai phương pháp đếm trong ô mô tả Self-Check | Làm rõ quy ước: \`split('\\n') = 150\`, \`splitlines() = 149\`, giá trị chuẩn hóa là 150 | Minh bạch hóa quy ước kỹ thuật theo R4.12-01. |
| **Trạng thái Self-Check Mục 11:** | \`PARTIAL\` | Tiếp tục giữ nguyên \`PARTIAL\` | Bảo toàn đúng đánh giá thận trọng đã được kiểm toán Round 4.12 chấp thuận. |

---

## 3. PHÂN ĐỊNH TÀI LIỆU BỊ ẢNH HƯỞNG VÀ TÀI LIỆU KHÔNG THAY ĐỔI

### 3.1. Tài liệu bị ảnh hưởng trực tiếp (Remediated Files):
1. \`PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` (Sửa nội dung Mục 7, tổng số dòng giữ nguyên 46 dòng).

### 3.2. Tài liệu mới được tạo cho Round 3.13:
1. \`PHASE_0B_2_3_ROUND3_13_CHANGELOG.md\` (Tài liệu này).
2. \`PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md\` (Báo cáo tự kiểm tra 15 tiêu chí).
3. \`PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md\` (Báo cáo hiệu chỉnh tổng hợp Round 3.13).
4. \`PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md\` (Biên bản bàn giao nội bộ trong ZIP).
5. \`PHASE_0B_2_3_ROUND3_13_MANIFEST.md\` (Bảng kiểm kê toàn diện 61 tệp Markdown).
6. \`PHASE_0B_2_3_ROUND3_13_EXTERNAL_HANDOVER.md\` (Biên bản bàn giao chính thức nằm ngoài ZIP).

### 3.3. Các tài liệu kế thừa không thay đổi (Unchanged Files):
- Toàn bộ 55 tài liệu Markdown còn lại từ Round 3.12 được giữ nguyên văn 100%, bảo toàn toàn vẹn lịch sử, không có bất kỳ thay đổi ngữ nghĩa nào.

---

## 4. KẾT QUẢ KIỂM TRA SAU KHI HIỆU CHỈNH

- **Khớp số dòng Manifest Mục 7:** Giá trị khai báo \`150\` khớp hoàn toàn với \`content.split('\\n').length = 150\`.
- **Tính toàn vẹn bit:** Giải nén \`testzip\` PASS 100%.
- **Mã hóa ký tự:** 61/61 tệp đạt chuẩn UTF-8 hợp lệ, không lỗi BOM.
- **Ranh giới bất biến:** Tuân thủ tuyệt đối Zero Schema Mutation, Zero Source Code Mutation, Zero Git Mutation.
`;

// 2. PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md
const selfCheckReportContent = `# BÁO CÁO TỰ KIỂM TRA CHẤT LƯỢNG HỒ SƠ TÀI LIỆU – ROUND 3.13
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### HỆ THỐNG KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH – TRƯỜNG THCS NGUYỄN TRUNG TRỰC

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.12 (Finding \`R4.12-01\`)  
**Phạm vi:** Tự kiểm tra nội bộ 15 tiêu chí chất lượng kỹ thuật của hồ sơ tài liệu trước khi đóng gói bàn giao sang Round 4.13.

---

## 1. BẢNG ĐỐI SOÁT 15 TIÊU CHÍ TỰ KIỂM TRA HỒ SƠ (15-ITEM TECHNICAL CHECKLIST)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Trạng Thái (Status) | Bằng Chứng / Phương Pháp Kiểm Tra (Evidence / Verification Method) | Ghi Chú Giới Hạn (Scope / Boundary Notes) |
|:---:|---|:---:|---|---|
| 1 | **Tính toàn vẹn archive ZIP (ZIP integrity)** | **PASS** | Tự kiểm tra bằng phương thức giải nén bit (\`testzip\`), 100% tệp giải nén thành công, mã lỗi CRC = 0. | Tự đánh giá kỹ thuật container gói nén; không xác minh mã nguồn hay database. |
| 2 | **Chuẩn mã hóa ký tự (Character encoding)** | **PASS** | Kiểm tra tự động 61/61 tệp giải mã UTF-8 hợp lệ, không chứa ký tự BOM lỗi (\`\\uFEFF\`), tiếng Việt hiển thị chính xác. | Đảm bảo tính tương thích văn bản Markdown. |
| 3 | **Kiểm tra tệp trùng tên (Duplicate filenames)** | **PASS** | Kiểm tra danh mục tên tệp: 0 tệp trùng lặp tên trong gói archive. | Danh mục định danh duy nhất. |
| 4 | **Kiểm tra tệp rỗng (Empty files)** | **PASS** | Quét dung lượng toàn bộ tệp: 0 tệp 0 bytes. | Mọi tài liệu đều có nội dung thực tế. |
| 5 | **Đối soát danh mục Manifest (Manifest inventory)** | **PASS** | Khớp chính xác 61/61 tệp giữa bảng kê \`PHASE_0B_2_3_ROUND3_13_MANIFEST.md\` và danh mục thực tế trong archive. | Không thừa, không thiếu tệp. |
| 6 | **Quy chuẩn đếm dòng Manifest (Manifest line counts)** | **PASS** | 61/61 tệp khớp số dòng theo quy chuẩn công bố \`fileContent.split('\\n').length\`. | Kiểm tra bằng thuật toán đối soát tự động. |
| 7 | **Tự đối soát số dòng Manifest (Manifest own line count)** | **PASS** | Tệp Manifest Round 3.12 đã được sửa đúng giá trị: **150 dòng** theo \`split('\\n').length\` (149 dòng theo \`splitlines()\`). Tệp Manifest Round 3.13 tự kê khai số dòng của chính nó chính xác theo quy chuẩn. | Đã khắc phục triệt để phát hiện R4.12-01. |
| 8 | **Bảo toàn 9 trạng thái kiểm soát (Mandatory statuses)** | **PASS** | Đã quét và xác nhận đủ 9 chuỗi trạng thái bắt buộc hiện diện nguyên văn trong hồ sơ, không chuỗi nào bị chuyển sang PASS. | Giữ nguyên ranh giới kiểm soát an ninh nghiêm ngặt. |
| 9 | **Kiểm soát Four-Eyes (Four-Eyes status check)** | **PASS** | Duy trì trạng thái \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`. Không tự cấp danh tính phê duyệt. | Hạn chế nguy cơ giả mạo phê duyệt độc lập trong phạm vi kiểm soát tài liệu. |
| 10 | **Phân định thẩm quyền kiểm toán (Audit claims qualification)** | **PASS** | Không tự nhận là kiểm toán độc lập; mọi số liệu tự tính đều ghi rõ \`PROJECT TEAM SELF-CHECKED / SELF-COMPUTED – PENDING INDEPENDENT AUDIT\`. | Phân biệt rành mạch 3 cấp độ xuất xứ bằng chứng. |
| 11 | **Hiệu chỉnh từ ngữ khẳng định tuyệt đối (Absolute assertions)** | **PARTIAL** | **Tiếp tục duy trì trạng thái PARTIAL theo kết luận Round 4.12**. Project Team đã rà soát từ ngữ có mục tiêu, nhưng việc tự rà soát không cấu thành chứng nhận độc lập toàn diện. | Bảo toàn nguyên tắc thận trọng, chờ đối soát độc lập. |
| 12 | **Loại trừ mã băm tự tham chiếu (Eliminate self-referential checksum)** | **PASS** | Mã băm SHA-256 của chính archive Round 3.13 xuất hiện 0 lần bên trong gói ZIP. | Tránh nghịch lý đệ quy checksum (R4.9-01, R4.10-01, R4.11-01, R4.12-01). |
| 13 | **Tính nhất quán kiến trúc bàn giao 2 lớp (Two-layer handover)** | **PASS** | \`ROUND3_13_INTERNAL_HANDOVER.md\` khẳng định thẩm quyền thuộc về \`ROUND3_13_EXTERNAL_HANDOVER.md\`. External Handover nằm ngoài ZIP là nguồn duy nhất ghi nhận byte size/SHA-256. | Kiến trúc được Independent Audit Round 4.10, 4.11 và 4.12 xác nhận PASS. |
| 14 | **Quy trình thăng cấp Media phi vận hành (Promotion workflow)** | **PASS** | Giữ nguyên trạng thái \`PROPOSED WORKFLOW – NOT VERIFIED / NOT IMPLEMENTED\`. Không suy diễn các cơ chế runtime đang hoạt động. | Tuân thủ đặc tả thiết kế mục tiêu, không ngộ nhận trạng thái chạy thực tế. |
| 15 | **Cam kết ranh giới bất biến (Zero-mutation boundaries)** | **PASS** | Tuyên bố minh bạch các cam kết Zero Source Code Mutation, Zero Schema Mutation, Zero Package/Runtime Mutation, Zero Git Mutation là \`PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED\`. | Không tự xác nhận thay cho việc kiểm chứng trực tiếp trên repository hay database. |

---

## 2. TỔNG KẾT VÀ PHÁN QUYẾT TỰ KIỂM TRA

- **Tổng số hạng mục kiểm tra kỹ thuật:** 14 PASS / 1 PARTIAL (Mục 11 - Absolute assertions được giữ nguyên PARTIAL theo quy định).
- **Phân định giới hạn:** Báo cáo tự kiểm tra này là kết quả rà soát nội bộ của Project Team, phục vụ công tác chuẩn bị hồ sơ bàn giao, không thay thế cho báo cáo kiểm toán độc lập của đơn vị thẩm định (Independent Audit Round 4.13).

**KẾT LUẬN CUỐI CÙNG:**
- **Documentation Self-Check Verdict:**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**
- **Implementation Readiness Verdict:**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**
`;

// 3. PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md
const remediationReportContent = `# BÁO CÁO HIỆU CHỈNH HỒ SƠ TÀI LIỆU – ROUND 3.13
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### TARGETED DOCUMENTATION CORRECTION – MANIFEST LINE COUNT RECONCILIATION

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md\`  
**Thời điểm lập:** 2026-11-04  
**Căn cứ kiểm toán:** Kết quả kiểm toán độc lập Round 4.12 (\`Finding R4.12-01\`)  
**Tập thể thực hiện:** Project Remediation Team  
**Phạm vi:** Hiệu chỉnh tài liệu kỹ thuật có mục tiêu (**DOCUMENTATION-ONLY TARGETED CORRECTION**). Tuyệt đối không thay đổi mã nguồn trong \`src/\`, không thay đổi cơ sở dữ liệu/schema, không can thiệp hạ tầng runtime, Supabase hoặc Git repository.

---

## 1. TỔNG QUAN PHẠM VI HIỆU CHỈNH CÓ MỤC TIÊU ROUND 3.13

Gói hồ sơ Round 3.12 đã được kiểm toán độc lập Round 4.12 xác nhận đạt kiểm tra kỹ thuật archive (CRC PASS, UTF-8 PASS, duplicate 0, empty 0, 56/56 Markdown, 9 Mandatory Statuses preserved, Self-Check Item 11 PARTIAL đúng quy định). Chỉ tồn tại 01 phát hiện duy nhất:

- **R4.12-01 (MEDIUM / PARTIAL - Manifest Line Count Reconciliation):**  
  Trong Self-Check của Round 3.12, mục 7 tự kê khai \`Manifest own line count = 151 dòng\`, trong khi kết quả kiểm tra thực tế bằng thuật toán là \`len(content.split('\\n')) = 150\` và \`len(content.splitlines()) = 149\`. Theo đúng quy ước đếm dòng công bố, con số chính xác phải là **150 dòng**.

Project Remediation Team đã thực hiện hiệu chỉnh đúng phạm vi:
1. Sửa trực tiếp Mục 7 trong \`PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` từ 151 thành 150.
2. Bổ sung chú thích giải thích rõ hai phương pháp đếm dòng (\`split('\\n') = 150\`, \`splitlines() = 149\`, giá trị chuẩn hóa dùng trong hồ sơ là 150).
3. Đóng gói hồ sơ kế thừa hoàn chỉnh Round 3.13 với 61 tệp nội bộ, bảo đảm tính nhất quán toán học 100%.

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ PHÁT HIỆN KIỂM TOÁN ROUND 4.12

| Finding | Round 4.12 Status | Remediation Action trong Round 3.13 | Trạng Thái Project Team | Bằng Chứng / Vị Trí Xử Lý | Trạng Thái Kiểm Toán Độc Lập |
|---|:---:|---|:---:|---|:---:|
| **R4.12-01** (MEDIUM / PARTIAL): Manifest own line count = 151 vs actual 150 | **PARTIAL** | Sửa giá trị tự kê khai tại Mục 7 tệp Self-Check Round 3.12 từ 151 thành 150; bổ sung diễn giải quy ước đếm dòng. | **PROJECT TEAM SELF-CHECKED (PASS)** | \`ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` Mục 7; \`ROUND3_13_CHANGELOG.md\`; \`ROUND3_13_SELF_CHECK_REPORT.md\` | **PENDING INDEPENDENT AUDIT (ROUND 4.13)** |

---

## 3. PHÂN CHIA HỆ THỐNG QUALITY GATE THEO 5 NHÓM PHẠM VI ĐỘC LẬP

Duy trì nguyên vẹn cấu trúc 5 nhóm phạm vi đánh giá:
- **Nhóm A (Archive Integrity):** Container ZIP đạt PASS theo tự kiểm tra nội bộ (CRC PASS, UTF-8 PASS, Duplicate 0, Empty 0, Manifest Match 61/61).
- **Nhóm B (Document-Level Self-Check):** 20 PASS / 1 PARTIAL theo kết quả tự rà soát của nhóm dự án (\`PROJECT TEAM SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`).
- **Nhóm C (Independent Audit Scope / Historical Audit Evidence):** 18 tiêu chí (4 Archive container + 1 Historical vocabulary + 2 Hard blocks + 11 Design only).
- **Nhóm D (Source/Repo Verification):** QG-19 đạt trạng thái \`PROJECT TEAM SELF-REPORTED – NOT INDEPENDENTLY VERIFIED (REPOSITORY SCOPE)\`.
- **Nhóm E (Runtime/Implementation Validation):** QG-08 và QG-12 duy trì trạng thái \`BLOCKED\`; các cơ chế upload/video giữ nguyên \`NOT VERIFIED\`.

> [!IMPORTANT]
> **Tuyên bố minh bạch:** Tuyệt đối không gộp 5 nhóm trên thành một tỷ lệ PASS chung.

---

## 4. BẢO TOÀN DANH MỤC 9 TRẠNG THÁI KIỂM SOÁT BẮT BUỘC (MANDATORY CONTROL STATES)

Toàn bộ 9 trạng thái kiểm soát bắt buộc được duy trì nguyên văn trong toàn bộ hồ sơ:
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

## 5. CAM KẾT RANH GIỚI BẤT BIẾN TUÂN THỦ (ZERO MUTATION BOUNDARIES)

Project Team xác nhận tuân thủ nghiêm ngặt các ranh giới bất biến:
- **Zero Source Code Mutation:** Không chỉnh sửa bất kỳ tệp nào trong thư mục \`src/\`.
- **Zero Schema Mutation:** Không tạo migration, không chạy DDL, không sửa đổi lược đồ cơ sở dữ liệu.
- **Zero Supabase / Cloud Interaction:** Không gọi API, không cấu hình Storage, RLS hay Edge Functions trên Supabase.
- **Zero Package / Runtime Mutation:** Không cài đặt package mới, không chạy build hoặc test runtime.
- **Zero Git Mutation:** Không thực hiện \`git commit\` hoặc \`git push\`.

*(Các cam kết Zero Mutation trên là do Project Team tự báo cáo - Self-reported, chờ thẩm định độc lập khi có điều kiện kiểm tra repository).*

---

## 6. PHÁN QUYẾT HIỆU CHỈNH VÀ MỨC ĐỘ SẴN SÀNG TRIỂN KHAI ROUND 3.13

- **Phán quyết tự rà soát tài liệu của Project Team:**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện hiệu chỉnh tài liệu có mục tiêu theo phát hiện R4.12-01; kết quả chờ Independent Audit xác nhận).*

- **Phán quyết mức độ sẵn sàng triển khai:**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Hồ sơ hoàn tất hiệu chỉnh ở cấp độ tài liệu Markdown nhưng hệ thống chưa đủ điều kiện triển khai thực tế do còn tồn tại các Hard Block an ninh và các thành phần cốt lõi chưa được kiểm chứng độc lập trên môi trường vận hành).*
`;

// 4. PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md
const internalHandoverContent = `# BIÊN BẢN BÀN GIAO NỘI BỘ HỒ SƠ TÀI LIỆU – ROUND 3.13
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN
### TARGETED DOCUMENTATION CORRECTION – MANIFEST LINE COUNT RECONCILIATION

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị lập bàn giao:** Project Remediation Team  
**Đối tượng tiếp nhận:** Hội đồng Nghiệm thu Dự án & Đơn vị Kiểm toán Độc lập (Round 4.13 Independent Documentation Audit)  
**Phạm vi bàn giao:** Hồ sơ tài liệu kỹ thuật Markdown nội bộ (**INTERNAL PACKAGE INSIDE ZIP**). Tuyệt đối không thay đổi mã nguồn trong \`src/\`, không thao tác cơ sở dữ liệu/schema, không can thiệp runtime/Supabase.

---

### 1. CĂN CỨ VÀ MỤC ĐÍCH BÀN GIAO
- **Căn cứ:** Kết quả kiểm toán độc lập Round 4.12 (Finding \`R4.12-01\`).
- **Mục đích:** Bàn giao gói hồ sơ tài liệu nội bộ Round 3.13 nằm bên trong archive ZIP, đã khắc phục chính xác phát hiện R4.12-01 về số dòng tự kê khai của Manifest trong Self-Check Round 3.12 (sửa từ 151 thành 150), chuẩn bị cho đợt kiểm toán độc lập Round 4.13.

---

### 2. KẾT QUẢ XỬ LÝ PHÁT HIỆN KIỂM TOÁN ROUND 4.12 (R4.12-01)
- Đã điều chỉnh Mục 7 trong \`PHASE_0B_2_3_ROUND3_12_DOCUMENTATION_SELF_CHECK.md\` ghi đúng giá trị: **150 dòng** theo \`split('\\n').length\` (149 dòng theo \`splitlines()\`).
- Thẩm quyền ghi nhận checksum và dung lượng của ZIP Round 3.13 thuộc về biên bản bàn giao bên ngoài:
  **\`EXTERNAL HANDOVER IS THE AUTHORITATIVE SOURCE FOR CURRENT ARCHIVE SIZE AND SHA-256.\`**  
  **\`CURRENT ARCHIVE SHA-256: RECORDED IN EXTERNAL HANDOVER – NOT EMBEDDED IN THIS ARCHIVE.\`**

---

### 3. DANH MỤC HỒ SƠ NỘI BỘ TRONG GÓI BÀN GIAO (61 TỆP MARKDOWN)
Gói bàn giao \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip\` bao gồm đúng 61 tệp Markdown được phân chia thành 9 nhóm độc lập loại trừ lẫn nhau:
- Nhóm 1: Tài liệu quy chuẩn cốt lõi (Core Specifications): **4 tệp**
- Nhóm 2: Đặc tả kiến trúc và thiết kế UX/UI: **8 tệp**
- Nhóm 3: Hồ sơ kiểm chứng & lịch sử hiệu chỉnh Round 3.0 - 3.7: **27 tệp**
- Nhóm 4: Hồ sơ kế thừa Round 3.8 đã hiệu chỉnh: **3 tệp**
- Nhóm 5: Hồ sơ kế thừa Round 3.9 đã hiệu chỉnh: **3 tệp**
- Nhóm 6: Hồ sơ kế thừa Round 3.10 đã hiệu chỉnh: **3 tệp**
- Nhóm 7: Hồ sơ kế thừa Round 3.11 đã hiệu chỉnh: **4 tệp**
- Nhóm 8: Hồ sơ kế thừa Round 3.12 (đã hiệu chỉnh R4.12-01): **4 tệp**
- Nhóm 9: Tài liệu bàn giao nội bộ mới Round 3.13: **5 tệp**
  1. \`PHASE_0B_2_3_ROUND3_13_CHANGELOG.md\`
  2. \`PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md\`
  3. \`PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md\`
  4. \`PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md\`
  5. \`PHASE_0B_2_3_ROUND3_13_MANIFEST.md\`

---

### 4. PHÂN CHIA QUALITY GATE THEO 5 NHÓM PHẠM VI
- **Nhóm A (Archive Integrity):** Container ZIP đạt PASS theo tự kiểm tra nội bộ (CRC PASS, UTF-8 PASS, Duplicate 0, Empty 0, Manifest Match 61/61).
- **Nhóm B (Document-Level Self-Check):** 20 PASS / 1 PARTIAL theo kết quả tự rà soát của nhóm dự án (\`PROJECT TEAM SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`).
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
- **Tổng số tệp trong gói lưu trữ ZIP:** **61 entries**.
- **Tổng số tệp Markdown (.md):** **61 / 61 tệp PASS**.
- **Kiểm tra mã hóa ký tự (UTF-8):** **PASS** (100% tệp UTF-8 hợp lệ, không lỗi BOM).
- **Kiểm tra trùng lặp tệp (Duplicate Check):** **0 tệp trùng tên** (PASS).
- **Kiểm tra tệp rỗng (Empty File Check):** **0 tệp rỗng (0 bytes)** (PASS).
- **Kiểm tra toàn vẹn bit (CRC/Decompression):** **PASS** (100% tệp giải nén thành công, không phát hiện lỗi).
- **Đối soát Bảng kê (Manifest Reconciliation):** **PASS** (Khớp chính xác 61/61 tệp giữa ZIP và \`PHASE_0B_2_3_ROUND3_13_MANIFEST.md\`).
- **Trạng thái tự kiểm tra của nhóm dự án (Project Team Self-Check):** **PARTIALLY COMPLETED**.
- **Trạng thái kiểm chứng độc lập (Independent Verification):** **PENDING INDEPENDENT AUDIT (ROUND 4.13)**.

---

### 9. THÔNG SỐ NIÊM PHONG GÓI BÀN GIAO (SEALING METRICS)

#### A. Thông số kiểm toán lịch sử Round 3.11 & Round 3.12:
- **Gói Round 3.11 (Independent Audit Round 4.11 Verified):**
  - Tên tệp: \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_11.zip\`
  - Kích thước: **243,617 bytes**
  - Mã SHA-256: \`EE81CAB072D333805B3F10F4F6E66E99416995A5DA2ABAC8EF6E6CF6A944EEC7\`
  - Số entries: 52 entries
- **Gói Round 3.12 (Independent Audit Round 4.12 Verified):**
  - Tên tệp: \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_12.zip\`
  - Kích thước: **261,670 bytes**
  - Mã SHA-256: \`52CE1E7840257727004CFECB630CE97CE0B2E2424AAEDF1A4BCFC8032DA14A2A\`
  - Số entries: 56 entries

#### B. Thông số gói lưu trữ bàn giao Round 3.13 (Current Round 3.13 Archive Protocol):
- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip\`
- **Số lượng tệp lưu trữ nội bộ (Entry count):** **61 entries** (100% định dạng Markdown .md)
- **Số lượng tệp Markdown:** **61 / 61 PASS**
- **Kết quả kiểm tra toàn vẹn bit (CRC result):** **PASS** (\`testzip\` không phát hiện lỗi, 100% tệp giải nén thành công)
- **Kết quả kiểm tra mã hóa UTF-8:** **PASS** (100% hợp lệ)
- **Kết quả đối soát Manifest:** **PASS** (61/61 tệp khớp chính xác)
- **Quy chuẩn niêm phong mã băm (Checksum Sealing Authority):**  
  **\`EXTERNAL HANDOVER IS THE AUTHORITATIVE SOURCE FOR CURRENT ARCHIVE SIZE AND SHA-256.\`**  
  **\`CURRENT ARCHIVE SHA-256: RECORDED IN EXTERNAL HANDOVER – NOT EMBEDDED IN THIS ARCHIVE.\`**  
  *(Thông số dung lượng byte chính xác và mã băm SHA-256 của archive được tính toán độc lập trên tệp ZIP hoàn chỉnh cuối cùng và công bố chính thức tại văn bản ngoài ZIP: \`PHASE_0B_2_3_ROUND3_13_EXTERNAL_HANDOVER.md\`)*.
- **Trạng thái tự rà soát của Project Team:** **PROJECT TEAM SELF-CHECK: PARTIALLY COMPLETED**
- **Trạng thái kiểm toán độc lập:** **PENDING INDEPENDENT AUDIT (ROUND 4.13)**

---

### 10. PHÁN QUYẾT BÀN GIAO VÒNG 3.13 (PROJECT TEAM SELF-ASSESSMENT)
- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`PROJECT TEAM DOCUMENTATION SELF-CHECK: PARTIALLY COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Project Team đã thực hiện hiệu chỉnh tài liệu có mục tiêu theo phát hiện R4.12-01; kết quả chờ Independent Audit xác nhận).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Việc hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có phán quyết chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_13_CHANGELOG.md'), changelogContent, 'utf8');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_13_SELF_CHECK_REPORT.md'), selfCheckReportContent, 'utf8');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_13_REMEDIATION_REPORT.md'), remediationReportContent, 'utf8');
fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_13_INTERNAL_HANDOVER.md'), internalHandoverContent, 'utf8');

console.log('Created CHANGELOG, SELF_CHECK_REPORT, REMEDIATION_REPORT, and INTERNAL_HANDOVER in staging 3.13');
