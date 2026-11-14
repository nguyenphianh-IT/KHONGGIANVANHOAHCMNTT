# ADR-002: KNOWLEDGE EXPANSION BATCH A – PENDING APPROVAL DOSSIER

**Dự án:** Hệ thống Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Giai đoạn:** Knowledge Expansion 01 – Batch A  
**Môi trường:** STAGING (Supabase Cloud & Local Persistent Store)  
**Thời điểm lập:** 2026-11-14T09:35:00Z  
**Quy trình quản trị:** FOUR-EYES APPROVAL WORKFLOW (Tuân thủ ADR-001 & ADR-002)  

---

## I. HỒ SƠ TÀI LIỆU CHỜ PHÊ DUYỆT ĐỘC LẬP (PENDING REVIEW QUEUE)

Tất cả 7 hồ sơ tri thức mới của Batch A đã được chuẩn hóa, tính mã băm SHA-256 và nhập thành công vào môi trường STAGING.
Theo nguyên tắc quản trị **Zero Self-Approval**, người tải lên (`uploadedBy: OP-STAGING-INGEST-BATCH-A`) **tuyệt đối không được phép tự phê duyệt**.

Toàn bộ tài liệu hiện đang ở trạng thái **PENDING_REVIEW** và **bị khóa truy xuất (`isAllowedForRag: false`)** chờ kiểm định độc lập:

| Mã tài liệu | Tên tài liệu | Phân loại | Tác giả / Nguồn xuất bản | Tình trạng bản quyền | Trạng thái hiện tại | Quyền truy xuất RAG |
|:---|:---|:---|:---|:---|:---:|:---:|
| **DOC-HCM-016** | Hồ Chí Minh – Biên niên tiểu sử, Tập 1 (1890–1929) | `bio-career` | Viện Lịch sử Đảng - NXB Sự thật | `METADATA_ONLY` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-017** | Hồ Chí Minh – Biên niên tiểu sử, Tập 2 (1930–9/1945) | `bio-career` | Viện Lịch sử Đảng - NXB Sự thật | `METADATA_ONLY` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-018** | Đường Kách mệnh (1927) | `ideology-ethics` | Nguyễn Ái Quốc (Bảo vật Quốc gia) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-019** | Các văn kiện thành lập Đảng năm 1930 | `ideology-ethics` | Nguyễn Ái Quốc (Hương Cảng 1930) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-020** | Cần, Kiệm, Liêm, Chính (1949) | `ideology-ethics` | Bút danh Lê Quyết Thắng | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-021** | Lời kêu gọi thi đua ái quốc (11/6/1948) | `school-education` | Chủ tịch Hồ Chí Minh | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ **PENDING_REVIEW** | ❌ `false` |
| **DOC-HCM-022** | Đạo đức cách mạng (1958) | `ideology-ethics` | Bút danh Trần Lực (Tạp chí Học tập) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ **PENDING_REVIEW** | ❌ `false` |

---

## II. BẢNG TIÊU CHÍ KIỂM ĐỊNH DÀNH CHO NGƯỜI PHÊ DUYỆT ĐỘC LẬP
Người phê duyệt độc lập (Đại diện Hội đồng Thẩm định chuyên môn Trường THCS Nguyễn Trung Trực) sẽ kiểm tra theo 4 tiêu chí bắt buộc trước khi kích hoạt phê duyệt:

1. **Tính xác thực nguồn gốc (Authenticity & Provenance):**
   - Tài liệu có nguồn dẫn xác định từ cơ quan quản lý tư liệu Đảng, Nhà nước hoặc Bảo tàng Hồ Chí Minh hay không?
   - Mã băm SHA-256 có trùng khớp với nội dung nguyên bản hay không?

2. **Tính chuẩn xác và phù hợp sư phạm (Educational Appropriateness):**
   - Nội dung có phù hợp với tâm lý lứa tuổi học sinh trung học cơ sở và chương trình Giáo dục Lịch sử - Địa phương hay không?
   - Các trích dẫn có đúng văn cảnh và tư tưởng Hồ Chí Minh hay không?

3. **Cổng bản quyền và quyền sử dụng (Copyright Clearance):**
   - Với sách nghiên cứu: Đã đảm bảo chỉ lưu trữ ở chế độ `METADATA_ONLY`, không sao chép trái phép toàn bộ sách hay chưa?
   - Với văn kiện lịch sử công cộng: Đã kiểm chứng tư cách văn kiện quốc gia công khai hay chưa?

4. **Kiểm tra an toàn hệ thống (Security Gate Verification):**
   - Xác nhận tài liệu không chứa mã độc, nội dung sai lệch hoặc vi phạm chính sách của nhà trường.

---

## III. HƯỚNG DẪN THAO TÁC PHÊ DUYỆT (DÀNH CHO NGƯỜI DUYỆT ĐỘC LẬP)
Khi người duyệt độc lập thực hiện quy trình phê duyệt:
- Đăng nhập với tài khoản có quyền Quản trị viên/Người phê duyệt (khác với `OP-STAGING-INGEST-BATCH-A`).
- Truy cập giao diện Quản lý Tri thức RAG: tab **Quản lý phê duyệt tài liệu**.
- Nhấn **Phê duyệt (Approve)** hoặc gửi API request `POST /api/rag/documents/[id]/approve` kèm chữ ký thẩm định.
- Hệ thống sẽ tự động cập nhật:
  - `approvalStatus: 'APPROVED'`
  - `isAllowedForRag: true`
  - Ghi nhận `approverId`, `approvedByName` và `approvedAt` vào cơ sở dữ liệu Supabase STAGING.

> [!WARNING]
> Tuyệt đối không tự phê duyệt từ script tự động hoặc từ tài khoản của người tải lên. Mọi nỗ lực tự duyệt sẽ bị hệ thống chặn bằng mã lỗi **403 Forbidden - Four-Eyes Principle Violation**.
