const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const targetDir = path.resolve('docs/phase-0b-3/phase-0b-3-1');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Target directory ready: ' + targetDir);

// -------------------------------------------------------------
// Deliverable 01: PHASE_0B_3_1_PILOT_SCOPE.md
// -------------------------------------------------------------
const pilotScopeContent = `# TÀI LIỆU PHẠM VI TRIỂN KHAI THỬ NGHIỆM (PILOT SCOPE DOCUMENT)
## PHASE 0B.3.1 – PILOT SCOPE & GOVERNANCE
### PILOT ENTRY PACKAGE – DOCUMENTATION ONLY

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_3_1_PILOT_SCOPE.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Đơn vị thẩm định:** Independent Reviewer  
**Người có thẩm quyền phê duyệt:** Project Owner  
**Trạng thái phê duyệt:** \`PROPOSED BY PROJECT REMEDIATION TEAM – PENDING PROJECT OWNER APPROVAL (GATE G0/G0A)\`  
**Nguyên tắc chỉ đạo:** \`EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED\`

---

## A. Project Context

### 1. Bối cảnh dự án
Hệ thống Không gian văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực đã hoàn thành các vòng hiệu chỉnh tài liệu Phase 0B.2.3 (từ Round 3.0 đến Round 3.20) dưới sự thẩm định của đơn vị kiểm toán độc lập. Hồ sơ tài liệu kỹ thuật đã được đồng bộ hóa và đóng gói hoàn chỉnh.

### 2. Mục tiêu của Giai đoạn Phase 0B.3
Giai đoạn Phase 0B.3 ("Pilot Deployment Preparation & Controlled Pilot") nhằm mục đích chuẩn bị có kiểm soát các điều kiện kỹ thuật, quản trị và quy trình để tiến hành kiểm chứng khả năng vận hành thực tế của CMS trên môi trường thử nghiệm độc lập (Staging/Pilot).

### 3. Phạm vi của Phân hệ Phase 0B.3.1
Phase 0B.3.1 là bước chuẩn bị tài liệu nền tảng ("Pilot Scope & Governance"), tập trung vào việc thiết lập:
- Phạm vi chức năng thử nghiệm được kiểm soát nghiêm ngặt.
- Ma trận phân định trách nhiệm RACI theo nguyên tắc Four-Eyes.
- Bảng đăng ký rủi ro (Risk Register) toàn diện cho toàn bộ các chốt chặn an toàn.
- Tiêu chí tiếp nhận thử nghiệm (Pilot Entry Criteria) gắn liền với các Hard Block kỹ thuật.
- Quy chế quản trị, kiểm soát cổng (Gate Control) và cơ chế dừng khẩn cấp (Fail Closed).

### 4. Ranh giới bất biến và giới hạn giai đoạn
- **Zero Schema Mutation:** Tuyệt đối không thay đổi Database Schema, RLS, Storage policies, RPC hoặc Edge Functions.
- **Zero Source Code Mutation:** Tuyệt đối không can thiệp mã nguồn trong \`src/\`, package hay cấu hình hệ thống.
- **Zero Production Deployment:** Tuyệt đối không triển khai hay can thiệp vào môi trường Production.
- **Documentation Only:** Toàn bộ công tác ở Phase 0B.3.1 chỉ giới hạn trong việc lập hồ sơ quy chuẩn, không cấu thành việc cấp quyền thực thi Pilot (\`PILOT EXECUTION: NOT AUTHORIZED\`).

---

## B. Pilot Objectives

1. **Kiểm chứng quy trình biên tập nội dung (Editorial Workflow):** Xác thực luồng tạo bản thảo, chỉnh sửa, gửi duyệt và phê duyệt bài viết trong không gian văn hóa.
2. **Kiểm chứng phân quyền và kiểm soát truy cập (Access & Authorization):** Xác thực ranh giới vai trò biên tập viên, kiểm duyệt viên và quản trị viên trong môi trường thử nghiệm.
3. **Kiểm chứng tính toàn vẹn của Audit Trail:** Đảm bảo mọi thao tác biên tập và phê duyệt đều ghi nhận nhật ký bất biến có thể truy vết.
4. **Kiểm chứng an toàn thao tác Media:** Xác minh cơ chế tải lên, gắn metadata và xử lý xóa Media đồng thời khi có các biện pháp an toàn được chứng minh độc lập.
5. **Kiểm chứng cơ chế chống lặp (Idempotency):** Đảm bảo không xảy ra hiện tượng trùng lặp dữ liệu bài viết khi có thao tác gửi lặp từ người dùng.
6. **Kiểm chứng khả năng ứng phó sự cố (Recovery):** Xác nhận quy trình dừng khẩn cấp và khôi phục dữ liệu mẫu thử nghiệm.

*(Lưu ý: Toàn bộ các mục tiêu trên là mục tiêu kiểm chứng dự kiến trong tương lai; Project Team không tuyên bố các chức năng này đã đạt yêu cầu vận hành thực tế khi chưa có bằng chứng kiểm thử được Independent Reviewer xác nhận).*

---

## C. Proposed Pilot Scope

Phạm vi chức năng dự kiến được phân thành 8 nhóm kiểm chứng có điều kiện:

| Nhóm Chức Năng | Mục Tiêu Kiểm Chứng | Phạm Vi Dự Kiến Trong Pilot | Điều Kiện Tiên Quyết Bắt Buộc | Bằng Chứng Cần Thu Thập | Rủi Ro Nhận Diện | Trạng Thái Hiện Tại |
|---|---|---|---|---|---|:---:|
| **1. CMS Access & Authorization** | Kiểm soát đăng nhập và ranh giới phân quyền | Đăng nhập tài khoản thử nghiệm, phân quyền Editor / Reviewer / Admin | Cơ chế Trusted Contributor Provenance được xác minh | Log đăng nhập, token phân quyền, bằng chứng từ chối truy cập vượt quyền | Leo thang đặc quyền, rò rỉ credential | \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\` |
| **2. Editorial Workflow** | Luồng vòng đời bài viết | Chuyển trạng thái: Bản thảo (Draft) -> Chờ duyệt (Pending) -> Đã duyệt (Approved) | Phân quyền vai trò được kích hoạt độc lập | Lịch sử chuyển trạng thái, chữ ký người duyệt, timestamp | Duyệt chéo trái thẩm quyền, tự phê duyệt | \`NOT VERIFIED\` (Chờ mở Gate G2) |
| **3. Content Management** | Quản lý nội dung văn bản | Tạo, lưu trữ và cập nhật nội dung bài viết về Không gian văn hóa | Cơ chế Idempotency chống trùng lặp | Payload bài viết mẫu, ID bài viết, phiên bản nội dung | Mất dữ liệu khi lưu đồng thời | \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\` |
| **4. Media Management** | Quản trị tài nguyên số | Tải lên hình ảnh mẫu, xem danh mục, xóa tài nguyên thử nghiệm | Upload Gate và Deletion Concurrency Safety được kiểm chứng | File hash ảnh mẫu, storage path, metadata DB record, log xóa | Ghi đè file, mất đồng bộ giữa Storage và DB, xóa cạnh tranh | \`MEDIA UPLOAD GATE: BLOCKED\` & \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\` |
| **5. Rich Text & Embedded Video** | Xử lý nội dung đa phương tiện | Soạn thảo rich text, nhúng mã video tư liệu văn hóa | Bộ lọc XSS và Video Security Architecture được xác nhận | HTML sanitized output, danh sách domain iframe được phép (allowlist) | Mã độc XSS, nhúng iframe độc hại, rò rỉ phiên | \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\` |
| **6. Audit Trail** | Ghi nhận nhật ký kiểm toán bất biến | Ghi nhận mọi hành động: login, tạo bài, sửa, duyệt, xóa media | Cơ chế Audit Log Immutability được kiểm chứng | Bảng audit_logs, chuỗi hash liên kết, chứng chỉ append-only | Log bị sửa đổi, xóa log để che giấu hành vi | \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\` |
| **7. Idempotency** | Xử lý chống lặp yêu cầu | Thao tác nhấn đúp "Publish", gửi lại form khi mạng trễ | Persistent State Idempotency Key được kiểm chứng | Request ID, response cache, bảng khóa trạng thái idempotency | Tạo trùng lặp bản ghi, sai lệch đếm bài | \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\` |
| **8. Recovery & Incident Handling** | Ứng phó sự cố và phục hồi | Quy trình kích hoạt dừng khẩn cấp và khôi phục DB mẫu | Kịch bản phục hồi và backup được phê duyệt | Bản sao lưu mẫu trước kiểm thử, biên bản phục hồi, log sự cố | Không thể hoàn tác dữ liệu lỗi | \`NOT VERIFIED\` (Chờ mở Gate G1) |

---

## D. Out-of-Scope (Ngoại vi phạm vi Pilot)

Tuyệt đối không đưa vào phạm vi Pilot các nội dung sau:
1. **Môi trường Production:** Không triển khai, không kết nối và không thao tác trên hạ tầng Production.
2. **Dữ liệu thật:** Không sử dụng dữ liệu thông tin cá nhân của học sinh, giáo viên, cán bộ nhà trường hoặc dữ liệu thực tế của Trường THCS Nguyễn Trung Trực.
3. **Người dùng ngoài nhóm thử nghiệm:** Không cấp quyền truy cập công khai hoặc cho người dùng không thuộc danh sách phê duyệt tại Gate G0/G1.
4. **Thay đổi Schema và Source Code:** Không thực hiện bất kỳ migration DDL hay sửa đổi mã nguồn nào trong quá trình chạy Pilot nếu chưa lập Change Request được phê duyệt độc lập.
5. **Tải lên tệp Media thực tế:** Không tải lên các tệp media có dung lượng lớn, tệp không rõ nguồn gốc hoặc tệp ngoài danh mục định dạng synthetic đã quy định.

---

## E. Pilot Participants (Nhóm Vai Trò Tham Gia)

Không tự gán danh tính cá nhân cụ thể. Toàn bộ người tham gia được phân định theo vai trò chức năng:

| Vai Trò | Trách Nhiệm Dự Kiến | Quyền Hạn Trong Môi Trường Pilot |
|---|---|---|
| **Project Owner (PO)** | Phê duyệt phạm vi, mở Gate và kết luận kết quả | Toàn quyền quyết định quản trị |
| **Independent Reviewer (IR)** | Thẩm định hồ sơ, đối soát bằng chứng độc lập | Quyền kiểm toán và khuyến nghị Gate |
| **Technical Lead (TL)** | Giám sát kỹ thuật môi trường Staging | Kiểm soát cấu hình thử nghiệm |
| **Security Reviewer (SR)** | Giám sát an ninh, phát hiện lỗ hổng và kích hoạt Fail-Closed | Quyền phủ quyết an toàn (Veto power) |
| **Pilot Coordinator (PC)** | Điều phối kịch bản thử nghiệm và ghi nhận log | Điều phối phiên kiểm thử |
| **Editorial Testers (ET)** | Thực hiện thao tác biên tập trên dữ liệu mẫu | Quyền Editor / Reviewer thử nghiệm |

---

## F. Pilot Data Policy (Chính Sách Dữ Liệu Thử Nghiệm)

1. **100% Synthetic / Mock Data:** Toàn bộ văn bản, hình ảnh, tài liệu phục vụ kiểm thử phải là dữ liệu giả định được biên soạn riêng cho mục đích thử nghiệm kỹ thuật.
2. **Không có PII (Personally Identifiable Information):** Tuyệt đối không chứa họ tên, hình ảnh, ngày sinh, lớp học hay bất kỳ dữ liệu định danh nào của học sinh và nhân sự nhà trường.
3. **Cô lập dữ liệu:** Tuyệt đối không sao chép dữ liệu từ Production sang Staging hoặc ngược lại.
4. **Hủy dữ liệu có kiểm soát:** Toàn bộ dữ liệu phát sinh trong quá trình thử nghiệm phải có kịch bản dọn dẹp và khôi phục về trạng thái sạch ban đầu.

---

## G. Pilot Duration (Kế Hoạch Thời Gian Dự Kiến)

- Kế hoạch thời lượng dự kiến: **2 đến 3 tuần** kể từ thời điểm Gate G1 được phê duyệt.
- Lịch trình cụ thể chỉ được thiết lập sau khi Project Owner phê duyệt Gate G0 và Independent Reviewer chấp thuận Gate G0A.
- Tuyệt đối không tự ý ấn định ngày bắt đầu hoặc ngày kết thúc cụ thể khi chưa có văn bản phê duyệt.

---

## H. Pilot Success Criteria (Tiêu Chí Đánh Giá Thành Công)

1. 100% các kịch bản kiểm thử thuộc phạm vi được duyệt hoàn thành và có bằng chứng ghi nhận.
2. Không còn bất kỳ khiếm khuyết an ninh hoặc lỗi nghiêm trọng (Critical/High) nào chưa được xử lý.
3. 100% thao tác trong phạm vi kiểm thử được ghi nhận đầy đủ, bất biến trong Audit Trail.
4. Ranh giới phân quyền phân định rõ ràng, không có trường hợp leo thang đặc quyền.
5. Cơ chế Fail-Closed và quy trình khôi phục sự cố được chứng minh hoạt động tin cậy.

---

## I. Pilot Stop Conditions (Điều Kiện Bắt Buộc Dừng Pilot)

Lập tức kích hoạt quy trình tạm dừng Pilot (Fail-Closed) khi xảy ra một trong các điều kiện:
1. Phát hiện hành vi truy cập trái phép, vượt quyền hoặc leo thang đặc quyền.
2. Phát hiện mất dữ liệu, sai lệch cấu trúc dữ liệu hoặc không thể khôi phục trạng thái ban đầu.
3. Audit Log bị gián đoạn, mất bản ghi hoặc có dấu hiệu bị can thiệp.
4. Thao tác Media Upload / Deletion gây lỗi cạnh tranh hoặc xung đột lưu trữ.
5. Phát hiện nội dung độc hại hoặc video nhúng vượt qua bộ lọc an ninh.
6. Không xác định được danh tính người thực hiện thao tác thử nghiệm.
7. Thao tác vượt ra ngoài phạm vi đã được phê duyệt tại Gate G0/G2.

---

## J. Approval Status & Mandatory Control State

Project Team xác nhận trạng thái phê duyệt hiện tại của tài liệu phạm vi:

\`PILOT SCOPE: PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL (GATE G0)\`

\`PILOT EXECUTION: NOT AUTHORIZED\`

\`PRODUCTION DEPLOYMENT: NOT AUTHORIZED\`

\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`

Duy trì nguyên văn toàn bộ 9 chuỗi trạng thái kiểm soát bắt buộc:
1. \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`
2. \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\`
3. \`UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED\`
4. \`MEDIA UPLOAD GATE: BLOCKED\`
5. \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\`
6. \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\`
7. \`MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\`
8. \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\`
9. \`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`
`;

fs.writeFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_SCOPE.md'), pilotScopeContent, 'utf8');
console.log('Created PHASE_0B_3_1_PILOT_SCOPE.md');

// -------------------------------------------------------------
// Deliverable 02: PHASE_0B_3_1_RACI_MATRIX.md
// -------------------------------------------------------------
const raciContent = `# MA TRẬN PHÂN ĐỊNH TRÁCH NHIỆM RACI (RACI MATRIX)
## PHASE 0B.3.1 – PILOT SCOPE & GOVERNANCE
### PILOT ENTRY PACKAGE – DOCUMENTATION ONLY

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_3_1_RACI_MATRIX.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Đơn vị thẩm định:** Independent Reviewer  
**Người có thẩm quyền phê duyệt:** Project Owner  
**Trạng thái:** \`PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL\`  
**Nguyên tắc chỉ đạo:** \`EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED\`

---

## 1. Định Nghĩa Các Vai Trò (Roles Definition)

- **PO (Project Owner):** Đại diện chủ quản dự án, nắm giữ thẩm quyền phê duyệt cao nhất đối với các cổng Gate và quyết định kết thúc Pilot.
- **PRT (Project Remediation Team):** Nhóm kỹ thuật chịu trách nhiệm xây dựng hồ sơ, kịch bản thử nghiệm và tổng hợp bằng chứng.
- **TL (Technical Lead):** Phụ trách kỹ thuật hệ thống, giám sát cấu hình môi trường Staging độc lập.
- **SR (Security Reviewer):** Chuyên viên an ninh độc lập, đánh giá rủi ro an toàn thông tin và có quyền phủ quyết (Veto power).
- **IR (Independent Reviewer):** Đơn vị thẩm định độc lập, thực hiện đối soát khách quan toàn bộ hồ sơ và bằng chứng trước khi mở Gate.
- **PC (Pilot Coordinator):** Điều phối viên quản lý việc vận hành các phiên thử nghiệm thực tế.
- **PP (Pilot Participants):** Các nhân sự được chỉ định tham gia thực hiện kịch bản thao tác trên dữ liệu mẫu.

*Quy tắc chuẩn:* Không gán tên cá nhân thực tế vào bảng phân vai; phân định rõ ràng theo chức danh trách nhiệm.

---

## 2. Quy Chuẩn Ký Hiệu RACI

- **R (Responsible):** Người trực tiếp thực hiện công việc.
- **A (Accountable):** Người chịu trách nhiệm giải trình cuối cùng và có quyền phê duyệt duy nhất (Mỗi hoạt động chỉ có đúng 1 vai trò A).
- **C (Consulted):** Người được tham vấn chuyên môn, cung cấp ý kiến hai chiều.
- **I (Informed):** Người được thông báo kết quả một chiều sau khi hoạt động hoàn thành.

---

## 3. Ma Trận RACI Hoạt Động Chi Tiết

| STT | Hoạt Động / Quyết Định Quản Trị | PO | PRT | TL | SR | IR | PC | PP | Cơ Chế Kiểm Soát Bắt Buộc |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| 1 | **Phê duyệt Kế hoạch & Phạm vi Pilot (Gate G0)** | **A** | R | C | C | C | I | I | Quyết định văn bản của Project Owner |
| 2 | **Xây dựng bộ hồ sơ Pilot Entry Package (Phase 0B.3.1)** | I | **A/R** | C | C | C | I | I | Project Team hoàn thành trọn vẹn 5 tài liệu |
| 3 | **Thẩm định hồ sơ Pilot Entry Package (Gate G0A)** | I | C | I | C | **A/R** | I | I | Independent Reviewer đánh giá độc lập |
| 4 | **Đánh giá Technical Readiness (8 hạng mục an toàn)** | I | R | C | C | **A** | I | I | Đánh giá độc lập trên bằng chứng kỹ thuật |
| 5 | **Xác minh kiến trúc bảo mật & Access Control** | I | C | C | **A/R** | C | I | I | Báo cáo an ninh độc lập từ Security Reviewer |
| 6 | **Thiết lập và cách ly Môi trường Staging (Gate G1)** | **A** | C | R | C | C | I | I | Phê duyệt Gate G1 của PO sau khi SR/IR thẩm định |
| 7 | **Chuẩn bị và phê duyệt Bộ dữ liệu mẫu (Synthetic Data)** | **A** | R | C | C | C | C | I | Cam kết 100% dữ liệu phi danh tính thật |
| 8 | **Phê duyệt mở cổng Kiểm thử Chức năng (Gate G2)** | **A** | C | C | C | C | I | I | Chỉ mở khi các điều kiện an toàn đạt yêu cầu |
| 9 | **Điều phối và thực thi Kịch bản Thử nghiệm Pilot** | I | C | C | I | I | **A** | R | Thực thi nghiêm ngặt theo kịch bản đã duyệt |
| 10 | **Ghi nhận, phân loại và xử lý Sự cố thử nghiệm** | I | R | C | C | I | **A** | C | Báo cáo sự cố tức thời cho SR và TL |
| 11 | **Kích hoạt Lệnh Dừng Khẩn Cấp (Fail-Closed Stop)** | I | C | R | **A** | I | R | I | Quyền phủ quyết an toàn tức thời của SR |
| 12 | **Tổng hợp Báo cáo Đánh giá Kết quả Pilot (Phase 0B.3.5)** | I | **A/R** | C | C | C | C | I | Lập hồ sơ hoàn chỉnh kết quả kiểm thử |
| 13 | **Thẩm định Kết quả Thử nghiệm Pilot (Gate G3)** | I | C | I | C | **A/R** | I | I | Đánh giá độc lập của Independent Reviewer |
| 14 | **Quyết định Kết thúc Pilot & Đánh giá Gate G4** | **A** | C | C | C | C | I | I | Quyết định chính thức của Project Owner |

---

## 4. Nguyên Tắc Four-Eyes Và Phân Lập Trách Nhiệm

1. **Phân lập tuyệt đối giữa Thực hiện (R) và Thẩm định (A/Review):** Vai trò PRT hoặc TL khi trực tiếp tạo lập hồ sơ, cấu hình hoặc bằng chứng thì tuyệt đối không được kiêm nhiệm vai trò IR hoặc SR để tự thẩm định sản phẩm của chính mình.
2. **Quyền phủ quyết an ninh (Security Veto Power):** Security Reviewer (SR) được trao quyền kích hoạt cơ chế dừng khẩn cấp độc lập khi phát hiện bất kỳ dấu hiệu rủi ro an toàn thông tin nào mà không cần sự đồng ý trước của các bên thực hiện.
3. **Thẩm quyền phê duyệt Gate duy nhất:** Toàn bộ việc chuyển tiếp qua các Gate G0, G1, G2, G3, G4 đều thuộc thẩm quyền duy nhất của Project Owner (PO) trên cơ sở khuyến nghị độc lập từ Independent Reviewer (IR).
4. **Các nội dung chưa xác định:** Các cá nhân cụ thể đảm nhiệm vai trò sẽ được xác định bằng văn bản bổ nhiệm chính thức; hiện tại tạm ghi nhận: \`TBD – PROJECT OWNER CONFIRMATION REQUIRED\`.

---

## 5. Trạng Thái Quản Trị Bắt Buộc

\`RACI MATRIX: PROPOSED – PENDING PROJECT OWNER APPROVAL (GATE G0)\`  
\`PILOT EXECUTION: NOT AUTHORIZED\`  
\`PRODUCTION DEPLOYMENT: NOT AUTHORIZED\`  
\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`
`;

fs.writeFileSync(path.join(targetDir, 'PHASE_0B_3_1_RACI_MATRIX.md'), raciContent, 'utf8');
console.log('Created PHASE_0B_3_1_RACI_MATRIX.md');

// -------------------------------------------------------------
// Deliverable 03: PHASE_0B_3_1_PILOT_RISK_REGISTER.md
// -------------------------------------------------------------
const riskRegisterContent = `# SỔ ĐĂNG KÝ VÀ THEO DÕI RỦI RO THỬ NGHIỆM (PILOT RISK REGISTER)
## PHASE 0B.3.1 – PILOT SCOPE & GOVERNANCE
### PILOT ENTRY PACKAGE – DOCUMENTATION ONLY

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_3_1_PILOT_RISK_REGISTER.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Đơn vị thẩm định:** Independent Reviewer  
**Người có thẩm quyền phê duyệt:** Project Owner  
**Trạng thái:** \`PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL\`  
**Nguyên tắc chỉ đạo:** \`EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED\`

---

## 1. Phương Pháp Luận Đánh Giá Rủi Ro

- **Khả năng xảy ra (Likelihood):** Thấp (Low) / Trung bình (Medium) / Cao (High).
- **Mức độ tác động (Severity):** Thấp (Low) / Trung bình (Medium) / Cao (High) / Nghiêm trọng (Critical).
- **Mức độ rủi ro (Risk Level):** Thấp (Low) / Trung bình (Medium) / Cao (High) / Nghiêm trọng (Critical).
- **Trạng thái kiểm soát (Status):** \`HARD BLOCK\` / \`BLOCKED\` / \`NOT VERIFIED\` / \`OPEN\`.
- **Nguyên tắc xử lý:** Mọi rủi ro có trạng thái \`HARD BLOCK\` hoặc \`BLOCKED\` là điều kiện tiên quyết bắt buộc phải giải quyết trước khi được xem xét mở Gate tương ứng; không được tự ý hạ mức độ rủi ro khi chưa có bằng chứng kỹ thuật được xác minh độc lập.

---

## 2. Bảng Đăng Ký Rủi Ro Chi Tiết (14 Nhóm Rủi Ro Trọng Yếu)

| Risk ID | Tên Rủi Ro & Mô Tả | Nguyên Nhân Cốt Lõi | Tác Động Tiềm Tàng | Likelihood | Severity | Trạng Thái Hiện Tại | Bằng Chứng Hiện Hữu | Biện Pháp Giảm Thiểu Bắt Buộc | Vai Trò Chịu Trách Nhiệm | Rủi Ro Còn Lại | Gate Phụ Thuộc |
|:---:|---|---|---|:---:|:---:|:---:|---|---|:---:|:---:|:---:|
| **RSK-01** | **Trusted Contributor Provenance chưa xác minh**<br>Người đóng góp mã nguồn hoặc cấu hình chưa được chứng thực danh tính tin cậy | Thiếu quy trình ký mã số và cơ chế xác thực nguồn gốc độc lập | Mã nguồn hoặc cấu hình bị chèn trái phép, backdoor, không thể truy nguyên | High | Critical | **HARD BLOCK** | Chưa có bằng chứng xác thực contributor độc lập | Thiết lập quy trình Four-Eyes, kiểm toán khóa công khai và ký commit | PO / SR / IR | High | **Gate G1 & G2** |
| **RSK-02** | **Tính bất biến của Audit Log chưa xác minh**<br>Nhật ký kiểm toán có thể bị chỉnh sửa hoặc xóa để xóa dấu vết | Chưa chứng minh được cơ chế Append-Only và bảo vệ quyền ghi tại DB/Storage | Mất khả năng truy vết pháp lý khi có sự cố biên tập hoặc xâm nhập | Medium | Critical | **NOT VERIFIED** | Hồ sơ Phase 0B.2.3 ghi nhận NOT VERIFIED | Triển khai bảng log bất biến, cấm UPDATE/DELETE bằng RLS nghiêm ngặt | TL / SR | Medium | **Gate G2** |
| **RSK-03** | **Kiến trúc an toàn Upload chưa xác minh**<br>Quy trình tải tệp có thể bị lợi dụng để đưa mã độc vào hệ thống | Chưa có đặc tả và kiểm thử độc lập đối với luồng tiền xử lý tệp tải lên | Tải lên mã độc thực thi, tấn công từ chối dịch vụ lưu trữ | High | Critical | **NOT VERIFIED** | Hồ sơ Phase 0B.2.3 ghi nhận NOT VERIFIED | Kiểm tra MIME-type thực tế bằng magic bytes, cách ly vùng lưu trữ tạm | SR / TL | High | **Gate G2** |
| **RSK-04** | **Chốt chặn Media Upload Gate bị khóa**<br>Cổng tải lên media đang ở trạng thái BLOCKED | Các ràng buộc an toàn kỹ thuật chưa được kiểm chứng độc lập | Thao tác upload bị chặn, không thể thực hiện quy trình biên tập ảnh | High | High | **BLOCKED** | Mandatory status \`MEDIA UPLOAD GATE: BLOCKED\` | Giữ nguyên trạng thái khóa; chỉ mở khi RSK-03 và RSK-07 được giải quyết | PO / IR | High | **Gate G2** |
| **RSK-05** | **Xung đột xóa Media đồng thời (Concurrency Safety)**<br>Nhiều phiên xóa cùng một tài nguyên gây mất đồng bộ | Thiếu cơ chế khóa lạc quan (optimistic locking) hoặc hàng đợi xóa an toàn | Xóa nhầm file đang dùng trong bài viết khác, lỗi tham chiếu gãy | Medium | High | **NOT VERIFIED** | Chưa có kiểm thử tải và tương tranh | Thiết kế cơ chế khóa tài nguyên và kiểm tra liên kết tham chiếu trước xóa | TL / PRT | Medium | **Gate G2** |
| **RSK-06** | **An toàn nhúng Video và Rich Text chưa xác minh**<br>Mã nhúng video iframe có thể chứa mã độc XSS | Chưa kiểm chứng bộ lọc HTML sanitizer và danh sách allowlist domain video | Đánh cắp phiên đăng nhập (Session Hijacking), chèn nội dung phản cảm | Medium | Critical | **NOT VERIFIED** | Chưa có tài liệu kiểm định bộ lọc nhúng | Cấu hình CSP nghiêm ngặt, chỉ cho phép domain video được chỉ định | SR / TL | Medium | **Gate G2** |
| **RSK-07** | **Lưu trữ Metadata Media phụ thuộc Schema chưa xác minh**<br>Bảng lưu thông tin ảnh/video phụ thuộc vào schema chưa được chứng minh | Database schema hiện hành chưa được kiểm chứng độc lập về tính tương thích | Dữ liệu metadata bị mất, hình ảnh tải lên không liên kết được bài viết | Medium | High | **BLOCKED** | Mandatory status \`MEDIA METADATA PERSISTENCE: BLOCKED\` | Giữ ranh giới Zero Schema Mutation; thiết kế bảng độc lập ở môi trường thử | TL / IR | Medium | **Gate G1 & G2** |
| **RSK-08** | **Chống lặp thao tác (Idempotency) chưa có cơ chế bền vững**<br>Yêu cầu biên tập gửi nhiều lần tạo bản ghi trùng lặp | Cơ chế lưu vết Idempotency Key trong persistent state chưa được kiểm chứng | Tạo nhiều bài viết trùng lặp, sai lệch dữ liệu kiểm kê | Medium | Medium | **BLOCKED** | Mandatory status \`IDEMPOTENCY ENFORCEMENT: BLOCKED\` | Thiết lập cơ chế Idempotency Key duy nhất lưu trong DB với thời gian hết hạn | TL / PRT | Medium | **Gate G2** |
| **RSK-09** | **Leo thang đặc quyền và kiểm soát truy cập (Access Control)**<br>Người dùng vai trò biên tập viên thao tác duyệt hoặc xóa trái quyền | Phân quyền RBAC có thể bị bypass qua API trực tiếp | Can thiệp trái phép nội dung giáo dục, vi phạm chính sách phê duyệt | Medium | High | **NOT VERIFIED** | Chưa kiểm chứng độc lập chính sách RLS | Kiểm thử bảo mật API, thiết lập ma trận phân quyền tối thiểu (Least Privilege) | SR / IR | Medium | **Gate G1 & G2** |
| **RSK-10** | **Rò rỉ dữ liệu cá nhân học sinh / giáo viên (Data Privacy)**<br>Dữ liệu thật vô tình bị đưa vào môi trường thử nghiệm | Vi phạm chính sách dữ liệu thử nghiệm, sao chép dữ liệu từ nguồn ngoài | Vi phạm quy định bảo vệ dữ liệu cá nhân học đường | Low | Critical | **OPEN** | Đã ban hành chính sách dữ liệu thử nghiệm | Bắt buộc sử dụng 100% dữ liệu synthetic; nghiêm cấm nạp dữ liệu thật | PC / PO | Low | **Gate G1** |
| **RSK-11** | **Mất dữ liệu và không thể khôi phục (Backup & Recovery)**<br>Hệ thống gặp sự cố trong quá trình thử nghiệm làm mất trạng thái | Chưa có kịch bản và diễn tập khôi phục dữ liệu mẫu định kỳ | Gián đoạn quy trình thử nghiệm, dữ liệu kiểm chứng bị sai lệch | Low | Medium | **NOT VERIFIED** | Chưa diễn tập quy trình phục hồi | Thiết lập lịch sao lưu tự động trước mỗi phiên thử nghiệm, kiểm tra restore | TL / PC | Low | **Gate G1** |
| **RSK-12** | **Xâm lấn ranh giới giữa Pilot và Production**<br>Môi trường thử nghiệm vô tình kết nối hoặc ảnh hưởng đến Production | Cấu hình nhầm lẫn biến môi trường hoặc dùng chung tài khoản dịch vụ | Làm hỏng dữ liệu hoặc làm gián đoạn hệ thống Production đang chạy | Low | Critical | **OPEN** | Cam kết ranh giới Zero Production Deployment | Tách biệt hoàn toàn network, domain, database và bộ credential | TL / SR | Low | **Gate G1** |
| **RSK-13** | **Mở rộng phạm vi thử nghiệm mất kiểm soát (Scope Creep)**<br>Tự ý kiểm thử các tính năng ngoài phạm vi đã duyệt tại Gate G0 | Thiếu sự giám sát chặt chẽ từ điều phối viên và quy trình thay đổi | Phát sinh rủi ro kỹ thuật ngoài tầm kiểm soát, vi phạm cam kết quản trị | Medium | Medium | **OPEN** | Đã ban hành tài liệu phạm vi Pilot Scope | Mọi thay đổi phạm vi phải qua quy trình Change Management chính thức | PC / PO | Low | **Gate G2** |
| **RSK-14** | **Tính toàn vẹn của bằng chứng thử nghiệm (Evidence Integrity)**<br>Bằng chứng kiểm thử bị làm sai lệch, tự gán kết quả PASS | Thiếu công cụ thu thập log độc lập và ký niêm phong bằng chứng | Kết luận đánh giá không trung thực, ngộ nhận hệ thống sẵn sàng | Low | High | **OPEN** | Quy tắc kiểm soát tài liệu và checksum độc lập | Bắt buộc Independent Reviewer đối soát chéo từng artifact bằng chứng | IR / PO | Low | **Gate G3** |

---

## 3. Kết Luận Và Ràng Buộc Cổng (Gate Binding)

- **Các rủi ro RSK-01, RSK-04, RSK-07, RSK-08** hiện đang ở trạng thái **HARD BLOCK** hoặc **BLOCKED**. Các rủi ro này trực tiếp ngăn chặn việc mở **Gate G2** (Kiểm thử chức năng).
- **Rủi ro RSK-10, RSK-11, RSK-12** là điều kiện tiên quyết bắt buộc phải hoàn thành biện pháp giảm thiểu trước khi được xem xét mở **Gate G1** (Môi trường Staging).
- Toàn bộ các đánh giá trong Sổ đăng ký này là kết quả tự rà soát ban đầu của Project Remediation Team (**PROJECT TEAM SELF-REPORTED – PENDING INDEPENDENT REVIEW**), chờ Independent Reviewer thẩm định tại Gate G0A.
`;

fs.writeFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_RISK_REGISTER.md'), riskRegisterContent, 'utf8');
console.log('Created PHASE_0B_3_1_PILOT_RISK_REGISTER.md');

// -------------------------------------------------------------
// Deliverable 04: PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md
// -------------------------------------------------------------
const entryCriteriaContent = `# TIÊU CHÍ TIẾP NHẬN TRIỂN KHAI THỬ NGHIỆM (PILOT ENTRY CRITERIA)
## PHASE 0B.3.1 – PILOT SCOPE & GOVERNANCE
### PILOT ENTRY PACKAGE – DOCUMENTATION ONLY

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Đơn vị thẩm định:** Independent Reviewer  
**Người có thẩm quyền phê duyệt:** Project Owner  
**Trạng thái:** \`PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL\`  
**Nguyên tắc chỉ đạo:** \`EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED\`

---

## 1. Nguyên Tắc Phân Loại Trạng Thái Tiêu Chí

Mỗi điều kiện tiếp nhận bắt buộc phải được đánh giá minh bạch theo đúng 1 trong 5 trạng thái:
1. \`PASS – EVIDENCE VERIFIED\`: Điều kiện đã có đầy đủ bằng chứng cụ thể và được xác minh độc lập.
2. \`FAIL\`: Điều kiện đã kiểm tra nhưng không đạt yêu cầu.
3. \`NOT VERIFIED\`: Điều kiện chưa có đủ bằng chứng kỹ thuật hoặc chưa được thẩm định độc lập.
4. \`BLOCKED\`: Điều kiện đang bị khóa bởi một Hard Block hoặc rào cản kỹ thuật chưa giải quyết.
5. \`NOT APPLICABLE – JUSTIFICATION REQUIRED\`: Điều kiện không áp dụng kèm giải trình cụ thể.

*Tuyệt đối không sử dụng trạng thái PASS khi chưa có bằng chứng xác thực được Independent Reviewer thẩm định.*

---

## 2. Bảng Đối Soát Tiêu Chí Tiếp Nhận Pilot (Pilot Entry Criteria Checklist)

### Nhóm A: Quản Trị Dự Án & Hồ Sơ (Governance Criteria)

| Mã Tiêu Chí | Nội Dung Điều Kiện Tiếp Nhận | Tiêu Chuẩn Nghiệm Thu Bắt Buộc | Bằng Chứng Tham Chiếu Hiện Hữu | Trạng Thái Đánh Giá | Ghi Chú & Khuyến Nghị |
|:---:|---|---|---|:---:|---|
| **CRIT-A01** | **Phê duyệt Kế hoạch Chuyển giai đoạn (Gate G0)** | Project Owner ban hành quyết định phê duyệt chính thức bằng văn bản | Tệp \`PHASE_0B_3_PILOT_TRANSITION_PLAN.md\` đã thiết lập | **NOT VERIFIED** | Đang chờ văn bản phê duyệt chính thức của Project Owner |
| **CRIT-A02** | **Xác nhận Ma trận Trách nhiệm RACI** | Ma trận RACI được các bên PO, TL, SR, IR ký nhận phân định vai trò | Tệp \`PHASE_0B_3_1_RACI_MATRIX.md\` đã biên soạn | **NOT VERIFIED** | Cần PO phê duyệt bổ nhiệm các cá nhân cụ thể |
| **CRIT-A03** | **Xác nhận Phạm vi Thử nghiệm (Pilot Scope)** | Tài liệu phạm vi được duyệt, ranh giới Out-of-Scope được xác lập | Tệp \`PHASE_0B_3_1_PILOT_SCOPE.md\` đã biên soạn | **NOT VERIFIED** | Đang chờ thẩm định Gate G0A |
| **CRIT-A04** | **Phê duyệt Quy trình Quản trị & Ứng phó Sự cố** | Quy trình Four-Eyes, quản trị thay đổi và cơ chế dừng khẩn cấp được duyệt | Tệp \`PHASE_0B_3_1_PILOT_GOVERNANCE.md\` đã biên soạn | **NOT VERIFIED** | Đang chờ thẩm định Gate G0A |

### Nhóm B: An Ninh & Kiểm Soát Truy Cập (Security Criteria)

| Mã Tiêu Chí | Nội Dung Điều Kiện Tiếp Nhận | Tiêu Chuẩn Nghiệm Thu Bắt Buộc | Bằng Chứng Tham Chiếu Hiện Hữu | Trạng Thái Đánh Giá | Ghi Chú & Khuyến Nghị |
|:---:|---|---|---|:---:|---|
| **CRIT-B01** | **Xác minh Trusted Contributor Provenance** | Danh tính người đóng góp mã nguồn được chứng thực qua khóa mã hóa độc lập | Hiện tại chưa có bằng chứng xác minh | **BLOCKED** | \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\` |
| **CRIT-B02** | **Đánh giá và Kiểm soát Quyền Truy Cập (RBAC)** | Phân quyền tối thiểu (Least Privilege), ranh giới vai trò không bị bypass | Chưa kiểm chứng độc lập chính sách RLS | **NOT VERIFIED** | Cần báo cáo kiểm thử phân quyền từ Security Reviewer |
| **CRIT-B03** | **Xác minh Tính Bất Biến của Audit Log** | Bằng chứng kỹ thuật về cơ chế Append-Only và bảo vệ chống sửa/xóa log | Chưa có bằng chứng kiểm thử bất biến | **NOT VERIFIED** | \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\` |
| **CRIT-B04** | **Xác minh Kiến trúc An Toàn Tải Lên (Upload Security)** | Luồng kiểm soát tệp tải lên (magic bytes, quét mã độc) được chứng minh | Chưa có bằng chứng kiểm thử upload | **NOT VERIFIED** | \`UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED\` |
| **CRIT-B05** | **Xác minh An Toàn Xóa Media Đồng Thời** | Cơ chế khóa tương tranh và kiểm tra tham chiếu toàn vẹn trước khi xóa | Chưa có kiểm thử cạnh tranh | **NOT VERIFIED** | \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\` |
| **CRIT-B06** | **Xác minh An Toàn Nhúng Video & Rich Text** | Bộ lọc HTML sanitizer và chính sách CSP allowlist domain video được chứng minh | Chưa có kết quả kiểm tra bộ lọc XSS | **NOT VERIFIED** | \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\` |

### Nhóm C: Dữ Liệu & Tính Bền Vững (Data & Persistence Criteria)

| Mã Tiêu Chí | Nội Dung Điều Kiện Tiếp Nhận | Tiêu Chuẩn Nghiệm Thu Bắt Buộc | Bằng Chứng Tham Chiếu Hiện Hữu | Trạng Thái Đánh Giá | Ghi Chú & Khuyến Nghị |
|:---:|---|---|---|:---:|---|
| **CRIT-C01** | **Xác minh Lưu Trữ Metadata Media Bền Vững** | Ràng buộc phụ thuộc Schema được kiểm chứng không ảnh hưởng hệ thống | Schema hiện hành chưa được kiểm chứng độc lập | **BLOCKED** | \`MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\` |
| **CRIT-C02** | **Xác minh Cơ Chế Trạng Thái Chống Lặp (Idempotency)** | Cơ chế khóa idempotency key trong persistent state được xác nhận | Cơ chế lưu vết trạng thái chưa chứng minh | **BLOCKED** | \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\` |
| **CRIT-C03** | **Chính Sách Dữ Liệu Thử Nghiệm 100% Synthetic** | Cam kết không sử dụng dữ liệu học sinh thật, chỉ dùng mock data | Quy định đã nêu trong Pilot Scope | **NOT VERIFIED** | Cần duyệt danh mục bộ dữ liệu mẫu trước Gate G1 |

### Nhóm D: Môi Trường & Vận Hành Thử Nghiệm (Environment Criteria)

| Mã Tiêu Chí | Nội Dung Điều Kiện Tiếp Nhận | Tiêu Chuẩn Nghiệm Thu Bắt Buộc | Bằng Chứng Tham Chiếu Hiện Hữu | Trạng Thái Đánh Giá | Ghi Chú & Khuyến Nghị |
|:---:|---|---|---|:---:|---|
| **CRIT-D01** | **Cách Ly Tuyệt Đối Môi Trường Pilot và Production** | Môi trường Staging tách biệt hoàn toàn về mạng, DB và credential | Cam kết Zero Production Deployment | **NOT VERIFIED** | Cần kiểm tra cấu hình thực tế khi chuẩn bị Gate G1 |
| **CRIT-D02** | **Quản Trị Tài Khoản và Khóa Bí Mật Thử Nghiệm** | Tài khoản thử nghiệm riêng biệt, không dùng chung secret với Production | Chưa tạo tài khoản thử nghiệm | **NOT VERIFIED** | Sẽ thiết lập tại Phase 0B.3.3 sau khi mở Gate G1 |
| **CRIT-D03** | **Phương Án Sao Lưu và Khôi Phục (Disaster Recovery)** | Kịch bản backup trước thử nghiệm và diễn tập phục hồi dữ liệu sạch | Chưa có biên bản diễn tập phục hồi | **NOT VERIFIED** | Bắt buộc kiểm chứng trước khi chạy kịch bản thử nghiệm |
| **CRIT-D04** | **Cơ Chế Giám Sát và Kích Hoạt Dừng Khẩn Cấp** | Giám sát log thời gian thực và chốt chặn Fail-Closed kích hoạt được ngay | Quy chế đã định nghĩa trong Pilot Governance | **NOT VERIFIED** | Cần kiểm tra kỹ thuật tại môi trường Staging |

### Nhóm E: Thẩm Định Độc Lập (Independent Review Criteria)

| Mã Tiêu Chí | Nội Dung Điều Kiện Tiếp Nhận | Tiêu Chuẩn Nghiệm Thu Bắt Buộc | Bằng Chứng Tham Chiếu Hiện Hữu | Trạng Thái Đánh Giá | Ghi Chú & Khuyến Nghị |
|:---:|---|---|---|:---:|---|
| **CRIT-E01** | **Thẩm Định Độc Lập Hồ Sơ Pilot Entry Package (Gate G0A)** | Báo cáo đánh giá độc lập của Independent Reviewer chấp thuận hồ sơ | Đang hoàn thiện bộ hồ sơ bàn giao | **NOT VERIFIED** | Chờ Independent Reviewer thực hiện thẩm định |
| **CRIT-E02** | **Xử Lý Triệt Để Các Phát Hiện Nghiêm Trọng** | Không còn phát hiện kiểm toán loại Critical/High nào tồn đọng | Cần kết luận từ báo cáo thẩm định G0A | **NOT VERIFIED** | Sẽ rà soát theo kết luận thẩm định |
| **CRIT-E03** | **Phê Duyệt Mở Cổng Môi Trường (Gate G1)** | Project Owner phê duyệt bằng văn bản trên cơ sở thẩm định của IR/SR | Gate G1 hiện đang bị khóa (\`LOCKED\`) | **BLOCKED** | Chỉ mở sau khi CRIT-A, D và E01 đạt yêu cầu |

---

## 3. Tổng Hợp Đánh Giá Điều Kiện Tiếp Nhận

- **Tổng số điều kiện đánh giá:** 19 tiêu chí.
- **Phân loại hiện tại:**
  - \`PASS – EVIDENCE VERIFIED\`: **0**
  - \`FAIL\`: **0**
  - \`NOT VERIFIED\`: **14** (Đang trong giai đoạn chuẩn bị hồ sơ hoặc chờ phê duyệt/thẩm định).
  - \`BLOCKED\`: **5** (Bị khóa bởi các Hard Block: CRIT-B01, CRIT-C01, CRIT-C02, CRIT-E03 và Media Gate).
- **Kết luận:** Hệ thống **CHƯA ĐỦ ĐIỀU KIỆN TIẾP NHẬN PILOT (PILOT ENTRY CRITERIA NOT MET)**. Toàn bộ hồ sơ phải được chuyển giao cho Independent Reviewer thẩm định tại Gate G0A.
`;

fs.writeFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md'), entryCriteriaContent, 'utf8');
console.log('Created PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md');

// -------------------------------------------------------------
// Deliverable 05: PHASE_0B_3_1_PILOT_GOVERNANCE.md
// -------------------------------------------------------------
const governanceContent = `# QUY CHẾ QUẢN TRỊ VÀ KIỂM SOÁT CỔNG PILOT (PILOT GOVERNANCE & GATE CONTROL)
## PHASE 0B.3.1 – PILOT SCOPE & GOVERNANCE
### PILOT ENTRY PACKAGE – DOCUMENTATION ONLY

**Dự án:** Hệ thống Không gian văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Địa điểm:** Phường Thới An, Thành phố Hồ Chí Minh  
**Mã tài liệu:** \`PHASE_0B_3_1_PILOT_GOVERNANCE.md\`  
**Thời điểm lập:** 2026-11-04  
**Đơn vị thực hiện:** Project Remediation Team  
**Đơn vị thẩm định:** Independent Reviewer  
**Người có thẩm quyền phê duyệt:** Project Owner  
**Trạng thái:** \`PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL\`  
**Nguyên tắc chỉ đạo:** \`EVIDENCE FIRST – DOCUMENTATION ONLY – ZERO MUTATION – FAIL CLOSED\`

---

## 1. Cơ Cấu Quản Trị Thử Nghiệm (Governance Structure)

Cơ cấu quản trị giai đoạn Phase 0B.3 được tổ chức thành 3 tầng độc lập:
1. **Tầng Phê Duyệt Chiến Lược (Strategic Approval Layer):** **Project Owner (PO)** giữ quyền quyết định cao nhất đối với việc mở các cổng kiểm soát (Gates) và chấp thuận phạm vi.
2. **Tầng Giám Sát & Thẩm Định Độc Lập (Independent Review Layer):** **Independent Reviewer (IR)** và **Security Reviewer (SR)** thực hiện đối soát khách quan, đánh giá rủi ro và có quyền phủ quyết an toàn (Veto power).
3. **Tầng Thực Thi Kỹ Thuật (Technical Execution Layer):** **Project Remediation Team (PRT)**, **Technical Lead (TL)**, **Pilot Coordinator (PC)** và **Pilot Participants (PP)** chịu trách nhiệm lập tài liệu, vận hành môi trường thử nghiệm và thực hiện kịch bản.

---

## 2. Vai Trò Và Phân Định Quyền Hạn

- **Project Owner:** Quyết định phê duyệt phạm vi, mở Gate G0, G1, G2, G3 và chuyển tiếp G4.
- **Independent Reviewer:** Thực hiện thẩm định độc lập toàn bộ tài liệu, bằng chứng kỹ thuật; đưa ra khuyến nghị độc lập cho từng Gate.
- **Security Reviewer:** Thẩm định kiến trúc an ninh, giám sát an toàn thông tin và có quyền đơn phương kích hoạt lệnh dừng khẩn cấp.
- **Technical Lead:** Quản lý môi trường Staging cách ly, kiểm soát cấu hình và giám sát sao lưu dữ liệu.
- **Pilot Coordinator:** Điều hành phiên thử nghiệm theo đúng kịch bản đã được phê duyệt tại Gate G2.
- **Project Remediation Team:** Chuẩn bị tài liệu, tổng hợp nhật ký và lập báo cáo tự rà soát.

---

## 3. Quy Trình Ra Quyết Định Tuần Tự (Decision-Making Workflow)

Mọi quyết định trong giai đoạn Phase 0B.3 phải tuân thủ quy trình 4 bước bắt buộc:
\`\`\`
Bước 1: Project Team chuẩn bị Hồ sơ & Bằng chứng kỹ thuật (Self-Report)
   │
   ▼
Bước 2: Security Reviewer kiểm tra điều kiện an toàn & rủi ro (Security Appraisal)
   │
   ▼
Bước 3: Independent Reviewer đối soát chéo độc lập & lập Báo cáo Thẩm định (Independent Review)
   │
   ▼
Bước 4: Project Owner xem xét Báo cáo Thẩm định và ban hành Quyết định phê duyệt Gate (Formal Approval)
\`\`\`

---

## 4. Quy Trình Four-Eyes (Cơ Chế Bốn Mắt Bắt Buộc)

1. **Không tự chứng nhận:** Một bằng chứng kỹ thuật, tài liệu hoặc cấu hình do một bên tạo ra tuyệt đối không được bên đó tự đánh dấu đạt yêu cầu (PASS).
2. **Đối soát độc lập:** Bắt buộc phải có sự xác nhận độc lập của ít nhất hai bên khác nhau (Người thực hiện và Người thẩm định độc lập) trước khi đệ trình Project Owner.
3. **Bảo vệ tính khách quan:** Ý kiến thẩm định của Independent Reviewer và Security Reviewer phải được lưu giữ nguyên văn, không bị chỉnh sửa hay làm nhẹ mức độ bởi nhóm thực hiện.

---

## 5. Quy Trình Quản Lý Bằng Chứng (Evidence Management Workflow)

1. **Tiêu chuẩn bằng chứng:** Mỗi tuyên bố kỹ thuật phải gắn liền với artifact cụ thể (file log, dump dữ liệu mẫu, ảnh chụp màn hình kiểm thử có timestamp, output kiểm tra tự động).
2. **Niêm phong số:** Bằng chứng được niêm phong bằng thuật toán SHA-256 và ghi nhận kích thước byte thực tế tại thời điểm tạo lập.
3. **Phân loại xuất xứ minh bạch:**
   - \`VERIFIED FROM PROVIDED ARTIFACT\`
   - \`PROJECT TEAM SELF-REPORTED\`
   - \`INDEPENDENTLY VERIFIED\`
   - \`NOT VERIFIED\`
   - \`NOT PROVIDED\`
   - \`REQUIRES PROJECT OWNER APPROVAL\`

---

## 6. Quy Trình Quản Lý Thay Đổi (Change Management Workflow)

1. Trong giai đoạn Phase 0B.3.1, tuân thủ tuyệt đối **Zero Schema Mutation** và **Zero Source Code Mutation**.
2. Nếu quá trình chuẩn bị phát hiện yêu cầu kỹ thuật cần sửa đổi mã nguồn hoặc schema:
   - Nhóm thực hiện **không được tự ý sửa đổi**.
   - Phải lập phiếu yêu cầu thay đổi kỹ thuật (Technical Change Request - CR).
   - Đánh giá tác động đến an ninh và tính tương thích hệ thống.
   - Gửi Security Reviewer và Independent Reviewer thẩm định.
   - Đệ trình Project Owner phê duyệt thành một gói công việc riêng biệt trước khi áp dụng.

---

## 7. Quy Trình Ghi Nhận Và Xử Lý Sự Cố (Incident Management Workflow)

1. Mọi sai lệch, lỗi phần mềm, hành vi bất thường hoặc cảnh báo an ninh phát sinh trong quá trình chuẩn bị và thử nghiệm phải được ghi nhận vào **Pilot Incident Log**.
2. Phân loại sự cố:
   - **Severity 1 (Critical):** Lỗ hổng bảo mật, mất dữ liệu, sai lệch ranh giới phân quyền, sự cố môi trường.
   - **Severity 2 (High):** Lỗi chức năng chính, hỏng luồng biên tập, lỗi không thể lưu bài viết.
   - **Severity 3 (Medium/Low):** Lỗi giao diện, sai sót định dạng văn bản nhỏ.
3. Sự cố Severity 1 và 2 phải được báo cáo ngay lập tức cho Security Reviewer và Technical Lead trong vòng tối đa 2 giờ kể từ khi phát hiện.

---

## 8. Quy Trình Dừng Khẩn Cấp (Emergency Stop / Fail-Closed Workflow)

1. **Điều kiện kích hoạt:** Xảy ra bất kỳ điều kiện nào trong 7 điều kiện dừng đã quy định tại Pilot Scope và Transition Plan.
2. **Thẩm quyền kích hoạt:** Security Reviewer, Technical Lead, Pilot Coordinator hoặc Independent Reviewer đều có quyền kích hoạt lệnh dừng khẩn cấp.
3. **Hành động tức thời khi kích hoạt:**
   - Thu hồi toàn bộ quyền truy cập của các tài khoản thử nghiệm trên môi trường Staging.
   - Đóng băng toàn bộ log và snapshot trạng thái cơ sở dữ liệu thử nghiệm phục vụ điều tra.
   - Thông báo khẩn cấp cho Project Owner bằng văn bản.
   - Chuyển trạng thái hệ thống về \`PILOT EXECUTION: SUSPENDED / FAIL-CLOSED\`.
4. **Quy trình tái khởi động:** Chỉ được tiếp tục khi nguyên nhân gốc rễ đã được xử lý triệt để, có báo cáo khắc phục được Independent Reviewer thẩm định và được Project Owner ký lệnh cho phép tiếp tục.

---

## 9. Quy Trình Xem Xét Và Mở Gate (Gate Review Workflow)

Mô hình kiểm soát 6 cổng tuần tự của giai đoạn Phase 0B.3:

\`\`\`
[Gate G0] ──► [Gate G0A] ──► [Gate G1] ──► [Gate G2] ──► [Gate G3] ──► [Gate G4]
  Kế hoạch     Hồ sơ Pilot    Môi trường    Kiểm thử     Đánh giá     Production
  Phase 0B.3    Entry Pkg      Staging      Chức năng    Kết quả      Readiness
 (PO Duyệt)    (IR Thẩm định)  (PO Duyệt)   (PO Duyệt)  (IR/PO Duyệt) (Thẩm định riêng)
\`\`\`

### Trạng thái các cổng hiện thời:
- **Gate G0:** \`PENDING PROJECT OWNER REVIEW\` (Chờ Project Owner xem xét Kế hoạch chuyển giai đoạn).
- **Gate G0A:** \`NOT OPENED\` (Chờ bàn giao trọn vẹn Pilot Entry Package để Independent Reviewer thẩm định).
- **Gate G1:** \`LOCKED\` (Khóa chặt - Chỉ mở sau khi G0A đạt yêu cầu).
- **Gate G2:** \`LOCKED\` (Khóa chặt - Chỉ mở khi các điều kiện kỹ thuật an toàn đạt yêu cầu).
- **Gate G3:** \`LOCKED\` (Khóa chặt - Chỉ mở khi kiểm thử hoàn tất).
- **Gate G4:** \`LOCKED\` (Khóa chặt - Nằm ngoài phạm vi thực hiện của Phase 0B.3.1).

---

## 10. Quy Trình Kết Thúc Pilot (Pilot Exit Decision Workflow)

1. Sau khi hoàn thành toàn bộ kịch bản thử nghiệm tại Phase 0B.3.4, Project Team tổng hợp Báo cáo Đánh giá Kết quả Pilot (Phase 0B.3.5).
2. Independent Reviewer thực hiện kiểm toán độc lập trên toàn bộ hồ sơ kiểm thử và log thực tế.
3. Ban hành kết luận chỉ theo 1 trong 3 mức độ:
   - **PILOT ACCEPTED:** Thử nghiệm đạt yêu cầu trong phạm vi kiểm chứng có giới hạn.
   - **PILOT CONDITIONALLY ACCEPTED:** Thử nghiệm đạt một phần, tồn tại các vấn đề cần xử lý tiếp.
   - **PILOT REJECTED / BLOCKED:** Thử nghiệm không đạt hoặc tồn đọng rủi ro an toàn không thể chấp nhận.
4. *Quy định bất biến:* Kết luận \`PILOT ACCEPTED\` chỉ xác nhận kết quả thử nghiệm trong phạm vi hẹp, tuyệt đối không đồng nghĩa với việc hệ thống đã sẵn sàng đưa vào vận hành Production (\`PRODUCTION READY\`).

---

## 11. Quy Tắc Lưu Trữ Và Bảo Toàn Hồ Sơ (Record Preservation Rules)

1. Mọi tài liệu thuộc bộ hồ sơ Pilot Entry Package phải được lưu trữ tập trung tại thư mục quy chuẩn: \`docs/phase-0b-3/phase-0b-3-1/\`.
2. Không ghi đè hoặc xóa bỏ các tài liệu lịch sử của Phase 0B.2.3 hoặc Phase 0B.3.
3. Mọi phiên bản hiệu chỉnh hồ sơ phải đi kèm tệp Changelog ghi nhận minh bạch nguyên nhân và nội dung thay đổi.
4. Toàn bộ hồ sơ bàn giao phải được niêm phong bằng bảng mã băm SHA-256 ngoại vi tuân thủ nguyên tắc loại trừ tự tham chiếu (Non-self-referential integrity).

---

## 12. Tuyên Bố Trạng Thái Bắt Buộc

\`PILOT GOVERNANCE: PROPOSED BY PROJECT TEAM – PENDING PROJECT OWNER APPROVAL (GATE G0)\`  
\`PILOT EXECUTION: NOT AUTHORIZED\`  
\`PRODUCTION DEPLOYMENT: NOT AUTHORIZED\`  
\`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`

Duy trì nguyên văn toàn bộ 9 chuỗi trạng thái kiểm soát bắt buộc:
1. \`FOUR-EYES: HARD BLOCK – TRUSTED CONTRIBUTOR PROVENANCE NOT VERIFIED\`
2. \`AUDIT LOG IMMUTABILITY: NOT VERIFIED\`
3. \`UPLOAD SECURITY ARCHITECTURE: NOT VERIFIED\`
4. \`MEDIA UPLOAD GATE: BLOCKED\`
5. \`MEDIA DELETION CONCURRENCY SAFETY: NOT VERIFIED\`
6. \`RICH TEXT VIDEO SECURITY: NOT VERIFIED\`
7. \`MEDIA METADATA PERSISTENCE: BLOCKED – SCHEMA DEPENDENCY NOT VERIFIED\`
8. \`IDEMPOTENCY ENFORCEMENT: BLOCKED – PERSISTENT STATE MECHANISM NOT VERIFIED\`
9. \`IMPLEMENTATION READINESS: NOT READY – HARD BLOCK / NOT VERIFIED\`
`;

fs.writeFileSync(path.join(targetDir, 'PHASE_0B_3_1_PILOT_GOVERNANCE.md'), governanceContent, 'utf8');
console.log('Created PHASE_0B_3_1_PILOT_GOVERNANCE.md');

// -------------------------------------------------------------
// Measure all 5 deliverables
// -------------------------------------------------------------
const deliverables = [
  'PHASE_0B_3_1_PILOT_SCOPE.md',
  'PHASE_0B_3_1_RACI_MATRIX.md',
  'PHASE_0B_3_1_PILOT_RISK_REGISTER.md',
  'PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md',
  'PHASE_0B_3_1_PILOT_GOVERNANCE.md'
];

console.log('\n--- MEASURING PILOT ENTRY PACKAGE DELIVERABLES ---');
const metricsTable = [];
deliverables.forEach(f => {
  const p = path.join(targetDir, f);
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
  const lines = buf.toString('utf8').split('\n').length;
  metricsTable.push({ file: f, size: buf.length, hash, lines });
  console.log(`${f}: size=${buf.length}, hash=${hash}, lines=${lines}`);
});

fs.writeFileSync(path.join(targetDir, 'metrics.json'), JSON.stringify(metricsTable, null, 2), 'utf8');
console.log('\nSaved metrics to metrics.json');
