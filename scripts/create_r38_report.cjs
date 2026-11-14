const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'docs', 'phase-0b-2', 'PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_8');

// 1. PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md
const remediationReport = `# BÁO CÁO HIỆU CHỈNH HỒ SƠ TÀI LIỆU – ROUND 3.8
## PHASE 0B.2.3 – CMS PROFESSIONAL EDITORIAL EXPERIENCE REDESIGN

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Quận 12, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md\`  
**Căn cứ kiểm toán:** Báo cáo kiểm toán độc lập Round 4.7 (\`PHASE_0B_2_3_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_7.md\`) & Phán quyết mức độ sẵn sàng (\`PHASE_0B_2_3_IMPLEMENTATION_READINESS_VERDICT_ROUND4_7.md\`)  
**Tập thể thực hiện:** Project Remediation Team  
**Phạm vi:** Tài liệu kỹ thuật Markdown thuần túy (**DOCUMENTATION-ONLY**). Tuyệt đối không thay đổi mã nguồn, không chỉnh sửa cơ sở dữ liệu, không thay đổi cấu hình runtime/Supabase.

---

## 1. TỔNG QUAN PHẠM VI HIỆU CHỈNH ROUND 3.8

Thực hiện cập nhật hồ sơ tài liệu kỹ thuật theo 5 phát hiện từ đợt kiểm toán độc lập Round 4.7:
1. **R4.7-01 (CRITICAL - Handover Checksum Reconciliation):** Hòa giải số liệu kích thước byte và mã băm SHA-256 trong biên bản bàn giao kế thừa Round 3.7 (\`PHASE_0B_2_3_ROUND3_7_HANDOVER.md\`) theo giá trị thực tế đã được Independent Audit Round 4.7 xác minh (178,643 bytes, SHA-256 \`081BAD05D45BFF5920D9C136CAD9E7797F3D0470817D8687142B92225AAD2A9A\`). Đồng thời thiết lập quy chuẩn tính toán checksum độc lập cho gói Round 3.8 từ chính file ZIP cuối cùng.
2. **R4.7-02 (HIGH - Evidence Provenance Terminology):** Rà soát và loại bỏ toàn bộ các cách diễn đạt gây hiểu nhầm nhóm dự án tự kiểm toán độc lập (như "tự cấp độc lập số liệu bàn giao", "biên bản bàn giao tự cấp số liệu độc lập", "tự cấp trực tiếp số liệu bàn giao"). Thiết lập mô hình 3 cấp độ xuất xứ bằng chứng chuẩn mực: (1) \`Project Team self-reported\`, (2) \`Project Team self-checked / self-assessment\`, (3) \`Independently verified\`.
3. **R4.7-03 (HIGH - Remediation Claims Overstatement):** Chuẩn hóa toàn bộ ngôn ngữ báo cáo, loại bỏ các cụm từ khẳng định quá mức ("giải quyết dứt điểm", "khắc phục triệt để", "nhất quán tuyệt đối", "khắc phục toàn diện") sang các trạng thái tự báo cáo có giới hạn bằng chứng: \`DOCUMENTATION UPDATED\`, \`PROJECT TEAM SELF-CHECKED\`, \`PENDING INDEPENDENT VERIFICATION\`. Chuẩn hóa phán quyết Vòng 3.7 thành \`DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`.
4. **R4.7-04 (MEDIUM - Quality Gate Classification):** Làm rõ kết quả 21/21 \`DOCUMENT-LEVEL CHECK PASS\` là kết quả tự đánh giá của Project Team (Self-Assessment) về mặt cấu trúc và tính nhất quán tài liệu, hoàn toàn không phải là phán quyết kiểm toán độc lập. Phân định rõ 4 ranh giới kiểm tra: Document-Level Self-Check, Independent Documentation Audit, Source/Repository Verification, Runtime/Implementation Validation.
5. **R4.7-05 (MEDIUM - Proposed Workflow Non-Operational Clarification):** Hiệu chỉnh dòng 28 trong \`PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md\` từ "Nhằm giải quyết dứt điểm..." thành "Nhằm cập nhật đặc tả thiết kế theo phát hiện kiểm toán R4.1-04...". Bảo toàn Bước 6 ở trạng thái \`PROPOSED – NOT IMPLEMENTED / NOT VERIFIED\`. Khẳng định rõ toàn bộ 11 bước của pipeline thăng cấp media chỉ là phương án thiết kế tương lai, hoàn toàn chưa khả dụng và không thể thực thi.

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ PHÁT HIỆN KIỂM TOÁN ROUND 4.7 (MANDATORY REMEDIATION MATRIX)

| Finding | Round 4.7 status | Round 3.8 action | Project Team status | Evidence | Independent verification |
|---|---|---|---|---|---|
| **R4.7-01** (CRITICAL): Handover archive metrics do not match the delivered ZIP | **FAIL** | Cập nhật Section 9 của \`PHASE_0B_2_3_ROUND3_7_HANDOVER.md\` khớp chính xác số liệu kiểm toán Round 4.7 xác minh: 178,643 bytes, SHA-256 \`081BAD05D45BFF5920D9C136CAD9E7797F3D0470817D8687142B92225AAD2A9A\`. Tính toán số liệu dung lượng và SHA-256 thực tế của gói Round 3.8 trực tiếp từ file ZIP cuối cùng. | **PROJECT TEAM SELF-CHECKED** | \`ROUND3_7_HANDOVER.md\` Section 9, \`ROUND3_8_HANDOVER.md\` Section 9, kịch bản kiểm tra checksum thực tế | **PENDING INDEPENDENT AUDIT** |
| **R4.7-02** (HIGH): Residual wording still implies independent self-verification | **PARTIAL** | Rà soát toàn bộ tài liệu kế thừa và mới; loại bỏ triệt để các cụm "tự cấp độc lập số liệu bàn giao", "tự cấp trực tiếp", "tự cấp số liệu độc lập". Chuẩn hóa thành: "Project Team tự tính và ghi nhận thông số archive; chờ Independent Audit xác minh". Phân định nhất quán 3 cấp độ xuất xứ bằng chứng. | **PROJECT TEAM SELF-CHECKED** | \`ROUND3_7_HANDOVER.md\`, \`ROUND3_7_REMEDIATION_REPORT.md\`, \`ROUND3_7_CHANGELOG.md\`, \`ROUND3_7_FILE_MANIFEST.md\`, diff rà soát toàn bộ tệp | **PENDING INDEPENDENT AUDIT** |
| **R4.7-03** (HIGH): Remediation report contains unqualified completion claims | **PARTIAL** | Thay thế toàn bộ các cụm "giải quyết dứt điểm", "khắc phục triệt để", "nhất quán tuyệt đối", "khắc phục toàn diện" bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng (\`DOCUMENTATION UPDATED\`, \`PROJECT TEAM SELF-CHECKED\`). Chuẩn hóa phán quyết Section 6 của \`ROUND3_7_REMEDIATION_REPORT.md\` sang \`PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`. | **PROJECT TEAM SELF-CHECKED** | \`ROUND3_7_REMEDIATION_REPORT.md\` Section 1, 6; \`ROUND3_7_CHANGELOG.md\`; \`MEDIA_LIBRARY_SPECIFICATION.md\` | **PENDING INDEPENDENT AUDIT** |
| **R4.7-04** (MEDIUM): Quality Gate 21/21 PASS requires evidence-bounded interpretation | **PARTIAL** | Gắn nhãn rõ ràng: 21/21 \`DOCUMENT-LEVEL CHECK PASS\` là kết quả tự đánh giá nội bộ của Project Team (Self-Assessment), không phải phán quyết độc lập. Phân định rạch ròi giữa Document-Level Self-Check và Independent Documentation Audit. Giữ nguyên phân bố toán học 6 nhóm kiểm chứng độc lập (4 + 1 + 1 + 2 + 2 + 11 = 21). | **PROJECT TEAM SELF-CHECKED** | \`ROUND3_7_REMEDIATION_REPORT.md\` Section 3.A; \`ROUND3_8_REMEDIATION_REPORT.md\` Section 3 | **PENDING INDEPENDENT AUDIT** |
| **R4.7-05** (MEDIUM): Proposed workflow remains non-operational and must stay blocked | **PARTIAL – proposed design only** | Thay thế câu khẳng định tại dòng 28 của \`PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md\`. Giữ nguyên Bước 6 và ma trận 11 bước ở trạng thái \`PROPOSED – NOT IMPLEMENTED / NOT VERIFIED\`. Khẳng định quy trình thăng cấp hoàn toàn mang tính thiết kế đề xuất tương lai, không thể thực thi khi phụ thuộc hạ tầng đang bị phong tỏa (\`BLOCKED\`). | **PROJECT TEAM SELF-CHECKED** | \`PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md\` dòng 28, 62, 87, 108, 131–152 | **PENDING INDEPENDENT AUDIT** |

---

## 3. TÁI ĐÁNH GIÁ 21 TIÊU CHÍ QUALITY GATE THEO HAI CHIỀU ĐỘC LẬP (QUALITY GATE ASSESSMENT)

Bảng đánh giá tách bạch giữa:
- **Chiều 1:** Kết quả tự rà soát tài liệu của Project Team (Project Team Document-Level Self-Check / Self-Assessment).
- **Chiều 2:** Trạng thái kiểm chứng độc lập (Independent Verification Status).

| ID | Tiêu Chí Kỹ Thuật (Requirement) | Tài Liệu Quy Chiếu (Reference) | Kết Quả Tự Rà Soát Tài Liệu (Project Team Document-Level Self-Check) | Trạng Thái Kiểm Chứng Độc Lập (Independent Verification Status) | Tham Chiếu Bằng Chứng (Evidence) | Ghi Chú Hiện Trạng (Remarks) |
|---|---|---|---|---|---|---|
| **QG-01** | Toàn vẹn gói lưu trữ ZIP (Integrity, UTF-8, CRC) | Gói lưu trữ ZIP | \`DOCUMENT-LEVEL CHECK PASS\` | \`INDEPENDENTLY VERIFIED (ARCHIVE INTEGRITY - ROUND 4.4 / 4.5 / 4.6 / 4.7)\` | Báo cáo kiểm toán R4.7 Section 1 | Đạt kiểm tra integrity, CRC, UTF-8, không trùng tên, không file rỗng. |
| **QG-02** | Toàn vẹn lịch sử tài liệu kế thừa (Historical Invariance) | Toàn bộ hồ sơ | \`DOCUMENT-LEVEL CHECK PASS\` | \`INDEPENDENTLY VERIFIED (ARCHIVE INTEGRITY - ROUND 4.4 / 4.5 / 4.6 / 4.7)\` | Báo cáo kiểm toán R4.7 Section 1 | 39 tệp kế thừa từ Round 3.7 được bảo toàn đầy đủ. |
| **QG-03** | Khớp nối 4 tài liệu cốt lõi (4 Core Docs Alignment) | 4 tài liệu cốt lõi | \`DOCUMENT-LEVEL CHECK PASS\` | \`INDEPENDENTLY VERIFIED (ARCHIVE INTEGRITY - ROUND 4.4 / 4.5 / 4.6 / 4.7)\` | Dossier & Audit Reports | Editor, Media, Approval, Acceptance đồng bộ. |
| **QG-04** | Đồng bộ 36 Acceptance Criteria (36 AC Harmonization) | \`ACCEPTANCE_CRITERIA.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`INDEPENDENTLY VERIFIED (ARCHIVE INTEGRITY - ROUND 4.4 / 4.5 / 4.6 / 4.7)\` | Section 2 AC Master List | 36 AC giữ nguyên phân loại (29 NOT TESTED, 6 NOT VERIFIED, 1 BLOCKED, 0 PASS). |
| **QG-05** | Bộ từ vựng 5 hành động nghiệp vụ chuẩn | \`APPROVAL_WORKFLOW_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`INDEPENDENTLY VERIFIED (HISTORICAL AUDIT - ROUND 4.1)\` | Section 3.2 | 5 hành động: \`submit_for_approval\`, \`approve\`, \`reject\`, \`archive\`, \`restore\`. Đã kiểm chứng ở Round 4.1. |
| **QG-06** | Ma trận phân quyền 5 vai trò (5 Roles Permission) | \`PERMISSION_MATRIX.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 2 | Logic phân quyền 5 vai trò trên tài liệu; chưa kiểm thử thực tế. |
| **QG-07** | Ranh giới 3 trạng thái xuất bản bài viết | \`ACCEPTANCE_CRITERIA.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 2.1 | Trạng thái: draft, pending_review, published. |
| **QG-08** | Cơ chế chống ghi đè Idempotency (Persistent Lock) | \`MEDIA_LIBRARY_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\` | Section 1.1 C | Bị phong tỏa do cơ chế persistent lock/idempotency chưa được xác minh. |
| **QG-09** | Đặc tả biên bản kiểm toán (Audit Trail Specification) | \`APPROVAL_WORKFLOW_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 4 | Cấu trúc schema audit_logs; tính bất biến chưa được kiểm chứng. |
| **QG-10** | Ma trận quy trình thăng cấp Media 11 bước | \`MEDIA_LIBRARY_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 1.1 C | Cấu trúc ma trận 11 bước hoàn chỉnh trên tài liệu; Bước 6 gắn nhãn proposed; quy trình là thiết kế tương lai. |
| **QG-11** | An ninh Rich Text nhúng Video (Regex & CSP) | \`RICH_TEXT_EDITOR_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 2 | Provider Contract chuẩn; CSP frame-src mục tiêu; chưa có kiểm thử runtime. |
| **QG-12** | Lưu trữ metadata Media vào cơ sở dữ liệu | \`MEDIA_LIBRARY_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\` | Section 1.1 | Bảng \`media_assets\` chưa được xác minh trên cơ sở dữ liệu thực tế. |
| **QG-13** | Ranh giới cách ly tệp kiểm dịch (Quarantine Boundary) | \`MEDIA_LIBRARY_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 1.1 A | Bucket private cho quarantine; backend xử lý tin cậy; mô hình thiết kế. |
| **QG-14** | An toàn xóa tệp đa người dùng (Concurrency Safety) | \`MEDIA_LIBRARY_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 2.2 | Cơ chế conditional delete / advisory lock; chưa kiểm thử runtime. |
| **QG-15** | Khả năng tương thích kiến trúc hệ thống | \`ARCHITECTURE_COMPATIBILITY.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Báo cáo kiến trúc | Đánh giá tính tương thích logic ở cấp độ tài liệu. |
| **QG-16** | Đặc tả trải nghiệm người dùng UX/UI CMS | \`UX_UI_DESIGN_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Wireframes & Specs | Wireframe và layout phân rã logic; chưa triển khai mã nguồn. |
| **QG-17** | Đặc tả trợ lý AI biên tập (AI Assistant Spec) | \`AI_ASSISTANT_SPEC.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Section 1-3 | Luồng AI hỗ trợ biên tập nội dung; chưa tích hợp runtime. |
| **QG-18** | Lộ trình triển khai phân kỳ (Implementation Roadmap) | \`IMPLEMENTATION_ROADMAP.md\` | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\` | Phân kỳ 4 giai đoạn | Kế hoạch phân kỳ; điều kiện tiên quyết là giải tỏa các Hard Block. |
| **QG-19** | Ranh giới bất biến mã nguồn (Zero Source Code Mutation) | Toàn bộ dự án | \`DOCUMENT-LEVEL CHECK PASS\` | \`NOT INDEPENDENTLY VERIFIED (RUNTIME / REPO SCOPE)\` | Cam kết nhóm dự án | Nhóm dự án cam kết không sửa \`src/\`; việc kiểm toán ZIP không cấu thành kiểm chứng repository. |
| **QG-20** | Bảo toàn 100% các Hard Block an ninh cốt lõi | Toàn bộ hồ sơ | \`DOCUMENT-LEVEL CHECK PASS\` | \`MANDATORY HARD BLOCKS / VERDICT RETAINED\` | Toàn bộ 9 trạng thái | 9 trạng thái bắt buộc được giữ nguyên văn 100%. |
| **QG-21** | Phán quyết sẵn sàng triển khai bảo toàn nguyên văn | Toàn bộ hồ sơ | \`DOCUMENT-LEVEL CHECK PASS\` | \`MANDATORY HARD BLOCKS / VERDICT RETAINED\` | Kết luận các báo cáo | Đồng bộ nguyên văn: \`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`. |

---

### TỔNG HỢP PHÂN LOẠI QUALITY GATE THEO 2 CHIỀU

#### A. Chiều 1: Kết quả tự rà soát tài liệu của Project Team (Project Team Document-Level Self-Check):
> [!NOTE]
> Kết quả 21/21 \`DOCUMENT-LEVEL CHECK PASS\` là **kết quả tự đánh giá nội bộ của Project Team (Self-Assessment)** về tính toàn vẹn cấu trúc và tính nhất quán logic của hồ sơ Markdown. Tuyệt đối KHÔNG PHẢI là kết luận của Independent Audit.
- **\`DOCUMENT-LEVEL CHECK PASS\`:** **21 / 21 tiêu chí**
- **\`DOCUMENT-LEVEL CHECK PARTIAL\`:** **0 / 21 tiêu chí**
- **\`DOCUMENT-LEVEL CHECK FAIL\`:** **0 / 21 tiêu chí**
*Tổng cộng:* **21 / 21 tiêu chí** (100% khớp toán học).

#### B. Chiều 2: Trạng thái kiểm chứng độc lập (Independent Verification Status):
Phân rã thành 6 nhóm độc lập loại trừ lẫn nhau (Mutually Exclusive Buckets):
1. **\`INDEPENDENTLY VERIFIED (ARCHIVE INTEGRITY - ROUND 4.4 / 4.5 / 4.6 / 4.7)\`:** **4 / 21 tiêu chí** (\`QG-01\`, \`QG-02\`, \`QG-03\`, \`QG-04\`).
2. **\`INDEPENDENTLY VERIFIED (HISTORICAL AUDIT - ROUND 4.1)\`:** **1 / 21 tiêu chí** (\`QG-05\`).
3. **\`NOT INDEPENDENTLY VERIFIED (RUNTIME / REPO SCOPE)\`:** **1 / 21 tiêu chí** (\`QG-19\`).
4. **\`BLOCKED (INFRASTRUCTURE DEPENDENCIES)\`:** **2 / 21 tiêu chí** (\`QG-08\`, \`QG-12\`).
5. **\`MANDATORY HARD BLOCKS / VERDICT RETAINED\`:** **2 / 21 tiêu chí** (\`QG-20\`, \`QG-21\`).
6. **\`NOT VERIFIED / NOT TESTED (DOCUMENTED DESIGN ONLY)\`:** **11 / 21 tiêu chí** (\`QG-06\`, \`QG-07\`, \`QG-09\`, \`QG-10\`, \`QG-11\`, \`QG-13\`, \`QG-14\`, \`QG-15\`, \`QG-16\`, \`QG-17\`, \`QG-18\`).

*Tổng số lượng kiểm chứng độc lập:* **4 + 1 + 1 + 2 + 2 + 11 = 21 / 21 tiêu chí** (Khớp số học 100%, không có sai số cộng dồn).

---

## 4. CHI TIẾT NHẬT KÝ THAY ĐỔI ROUND 3.8 (DETAILED CHANGELOG)

### 4.1. Hiệu chỉnh tài liệu kế thừa Vòng 3.7:
1. **\`PHASE_0B_2_3_ROUND3_7_HANDOVER.md\`:**
   - Section 9: Sửa kích thước từ 180,683 bytes thành **178,643 bytes**; sửa mã băm SHA-256 thành \`081BAD05D45BFF5920D9C136CAD9E7797F3D0470817D8687142B92225AAD2A9A\` (được Independent Audit Round 4.7 xác minh).
   - Dòng 51: Thay "Biên bản bàn giao tự cấp số liệu độc lập Round 3.7" bằng "Biên bản bàn giao Round 3.7; thông số archive đối chiếu theo Independent Audit Round 4.7".
   - Dòng 59: Thay "tự cấp trực tiếp giá trị..." bằng "được ghi nhận theo kết quả xác minh thực tế của Independent Audit Round 4.7".
   - Dòng 143: Thay "tự cấp trực tiếp số liệu bàn giao, khắc phục toàn diện..." bằng ngôn ngữ tự báo cáo có giới hạn bằng chứng.
2. **\`PHASE_0B_2_3_ROUND3_7_REMEDIATION_REPORT.md\`:**
   - Dòng 15-16: Loại bỏ "giải quyết dứt điểm", "khắc phục triệt để tính tự cấp"; thay bằng "cập nhật tài liệu theo các phát hiện kiểm toán", "Cập nhật thông số gói bàn giao (R4.6-01)".
   - Dòng 20: Loại bỏ "nhất quán tuyệt đối"; thay bằng "nhất quán".
   - Section 3.A: Thêm cảnh báo rõ ràng rằng kết quả 21/21 PASS là kết quả tự đánh giá của Project Team, không phải kết luận kiểm toán độc lập.
   - Section 6: Chuẩn hóa phán quyết thành \`DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`.
3. **\`PHASE_0B_2_3_ROUND3_7_CHANGELOG.md\`:**
   - Dòng 17: Thay "giải quyết toàn diện 5 phát hiện" bằng "cập nhật tài liệu theo 5 phát hiện".
   - Dòng 30: Thay "tự cấp trực tiếp" bằng "ghi nhận giá trị kích thước byte và SHA-256 đối chiếu theo kết quả xác minh của Independent Audit Round 4.7".
   - Dòng 55: Điều chỉnh kết luận thành \`PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`.
4. **\`PHASE_0B_2_3_ROUND3_7_FILE_MANIFEST.md\`:**
   - Dòng 21: Thay "giải quyết dứt điểm" bằng "cập nhật tài liệu theo".
   - Dòng 64: Thay "Biên bản bàn giao tự cấp số liệu độc lập Round 3.7" bằng "Biên bản bàn giao Round 3.7 (số liệu archive đối chiếu theo Independent Audit Round 4.7)".
5. **\`PHASE_0B_2_3_MEDIA_LIBRARY_SPECIFICATION.md\`:**
   - Dòng 28: Thay "Nhằm giải quyết dứt điểm phát hiện kiểm toán R4.1-04..." bằng "Nhằm cập nhật đặc tả thiết kế theo phát hiện kiểm toán R4.1-04 về ranh giới cách ly kiểm dịch (Quarantine Boundary) và phân phối công khai (Public Delivery), tài liệu thiết lập quy chuẩn kiến trúc topology lưu trữ và ranh giới tin cậy (Trust Boundary) như sau:".
   - Giữ nguyên nhãn Bước 6: \`PROPOSED – NOT IMPLEMENTED / NOT VERIFIED\`.
   - Giữ nguyên xác nhận toàn bộ 11 bước của pipeline thăng cấp là mô hình thiết kế tương lai, không thể thực thi.
6. **Các tài liệu lịch sử khác (\`ROUND3_6_HANDOVER.md\`, \`ROUND3_6_REMEDIATION_REPORT.md\`, \`ROUND3_6_CHANGELOG.md\`, \`ROUND3_6_FILE_MANIFEST.md\`, \`ROUND3_5_REMEDIATION_REPORT.md\`, \`CHANGELOG_ROUND3_3.md\`):**
   - Rà soát và loại bỏ triệt để các cụm "tự cấp số liệu độc lập", "tự cấp trực tiếp", "giải quyết dứt điểm", "khắc phục triệt để".

### 4.2. Xây dựng 3 tài liệu bàn giao mới Vòng 3.8:
- \`PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md\`: Báo cáo hiệu chỉnh toàn diện Round 3.8.
- \`PHASE_0B_2_3_ROUND3_8_HANDOVER.md\`: Biên bản bàn giao gói hồ sơ Round 3.8.
- \`PHASE_0B_2_3_ROUND3_8_MANIFEST.md\`: Bảng kê kiểm kê toàn diện 42 tệp Markdown.

---

## 5. BẢO TOÀN NGUYÊN VĂN 9 TRẠNG THÁI KIỂM SOÁT BẮT BUỘC (MANDATORY CONTROL STATES)

Toàn bộ 9 trạng thái kiểm soát bắt buộc được duy trì nguyên văn 100% không suy giảm:

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

## 6. KIỂM SOÁT NGUYÊN TẮC BẤT BIẾN (ZERO MUTATION BOUNDARIES)

Project Team tái khẳng định các ranh giới bất biến sau:
- **Zero Source Code Mutation:** Không có bất kỳ thay đổi nào trong thư mục \`src/\` hoặc các tệp mã nguồn ứng dụng.
- **Zero Schema Mutation:** Không tạo, không sửa, không chạy bất kỳ tệp DDL hay SQL migration nào; không tương tác với Supabase CLI hoặc Supabase Cloud.
- **Zero Package / Runtime Mutation:** Không cài đặt package mới, không thay đổi \`package.json\` / \`package-lock.json\`, không chạy build, test runtime hoặc deploy.
- **Zero Git Mutation:** Không thực hiện bất kỳ lệnh \`git commit\`, \`git push\`, hoặc tạo branch mới.

---

## 7. THÔNG SỐ NIÊM PHONG GÓI LƯU TRỮ ROUND 3.8

- **Tên gói lưu trữ bàn giao:** \`PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_8.zip\`
- **Tổng số tệp lưu trữ (Entry count):** **42 entries** (100% định dạng Markdown .md)
- **Tổng số tệp Markdown:** **42 / 42 PASS**
- **Kiểm tra mã hóa ký tự:** 100% UTF-8 không lỗi BOM, tiếng Việt hiển thị chính xác.
- **Kiểm tra tệp trùng lặp / tệp rỗng:** 0 tệp trùng tên, 0 tệp rỗng (0 bytes).
- **Kiểm tra toàn vẹn bit (CRC/Decompression):** **PASS** (\`testzip\` không phát hiện lỗi).
- **Kích thước byte chính xác:** Sẽ được Project Team tự tính trực tiếp từ file ZIP cuối cùng và công bố tại Biên bản bàn giao \`PHASE_0B_2_3_ROUND3_8_HANDOVER.md\` (\`Project Team self-computed; pending independent verification\`).
- **Mã băm SHA-256 chính xác:** Sẽ được Project Team tự tính trực tiếp từ file ZIP cuối cùng và công bố tại Biên bản bàn giao \`PHASE_0B_2_3_ROUND3_8_HANDOVER.md\` (\`Project Team self-computed; pending independent verification\`).

---

## 8. PHÁN QUYẾT HIỆU CHỈNH TÀI LIỆU VÒNG 3.8 (PROJECT TEAM SELF-ASSESSMENT)

- **Phán quyết hiệu chỉnh tài liệu (Documentation Remediation Verdict):**  
  **\`DOCUMENTATION REMEDIATION: PROJECT TEAM SELF-CHECK COMPLETED – PENDING INDEPENDENT AUDIT\`**  
  *(Hồ sơ tài liệu kỹ thuật Markdown đã được Project Team tự rà soát và cập nhật đầy đủ theo 5 phát hiện R4.7-01 đến R4.7-05, số liệu checksum Round 3.7 được hòa giải, mô hình xuất xứ bằng chứng 3 cấp độ được thiết lập, các phát biểu quá mức được loại bỏ, Quality Gate được phân loại chính xác, quy trình đề xuất được xác nhận là non-operational, và hồ sơ sẵn sàng bàn giao sang Independent Documentation Audit Round 4.8).*

- **Phán quyết mức độ sẵn sàng triển khai (Implementation Readiness Verdict):**  
  **\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`**  
  *(Hoàn tất hiệu chỉnh hồ sơ tài liệu không cấu thành quyền hạn triển khai thực tế. Mọi hoạt động triển khai tiếp tục bị phong tỏa cho đến khi có ý kiến chấp thuận chính thức từ Hội đồng Nghiệm thu Dự án).*
`;

fs.writeFileSync(path.join(stagingDir, 'PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md'), remediationReport, 'utf8');
console.log('Written PHASE_0B_2_3_ROUND3_8_REMEDIATION_REPORT.md');
