# ADR-002: BATCH B – SELECTIVE INGESTION 01 PENDING APPROVAL DOSSIER
## HỒ SƠ TRÌNH DUYỆT 4 MẮT DÀNH CHO HỘI ĐỒNG THẨM ĐỊNH CHUYÊN MÔN

**Dự án:** Hệ thống Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Giai đoạn:** Knowledge Expansion 01 – Batch B – Selective Ingestion 01  
**Môi trường:** STAGING (Supabase Cloud & Local Persistent Store)  
**Thời điểm lập:** 2026-11-14T17:30:00Z  
**Quy trình:** FOUR-EYES APPROVAL WORKFLOW (Tuân thủ ADR-001 & ADR-002)  

---

## I. HỒ SƠ 03 TÀI LIỆU CHỜ PHÊ DUYỆT ĐỘC LẬP

Căn cứ nguyên tắc **Zero Self-Approval**, người thực hiện nạp dữ liệu không có thẩm quyền tự phê duyệt.
Dưới đây là 3 hồ sơ tri thức đã được chuẩn hóa và tính mã băm SHA-256 trên STAGING, kính trình Hội đồng Thẩm định chuyên môn xem xét phê duyệt:

| Mã tài liệu | Tên tài liệu | Nguồn pháp lý / Xuất bản | Tình trạng bản quyền | Số chunks | Mã SHA-256 | Trạng thái hiện tại |
|:---|:---|:---|:---|:---:|:---|:---:|
| **DOC-HCM-026** | Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành) | QĐ 1195/QĐ-UB-NC & NQ 1685/NQ-UBTVQH15 | `PUBLIC_DOMAIN_CONFIRMED` | 15 | `51476B0AE4233DA1C129E91CF6FB1C9E392A7D097FB4B94BE8D42C156653C5E4` | ⏳ **PENDING_REVIEW** |
| **DOC-HCM-027** | Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay) | QĐ 155/QĐ-UBND 2014 & QĐ 76/QĐ-UBND 2025 & KH 01/2025 | `OPEN_ACCESS_REUSE_PERMITTED` | 11 | `EAA1AC69161B610ACF99C308E13D7EFA1178B17730721C6D5004BAF87C2F16A9` | ⏳ **PENDING_REVIEW** |
| **DOC-HCM-028** | Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí | Gia Định thành thông chí (Trịnh Hoài Đức) | `PUBLIC_DOMAIN_CONFIRMED` | 11 | `29061599DA7EF89859AF8554C501EB0A0C44BD459A30F59DBAF4601B4DCDAD5D` | ⏳ **PENDING_REVIEW** |

---

## II. HƯỚNG DẪN THAO TÁC PHÊ DUYỆT TRÊN CMS (DÀNH CHO NGƯỜI DUYỆT ĐỘC LẬP)

1. **Truy cập:** Đăng nhập vào trang Quản trị Hệ thống STAGING với tài khoản Thẩm định viên độc lập (khác với tài khoản nạp dữ liệu).
2. **Kiểm tra hồ sơ:** Vào menu **Quản lý Tri thức RAG** $ightarrow$ Tab **Phê duyệt tài liệu**.
3. **Thẩm định 4 tiêu chí:**
   - *Tính xác thực:* Đối chiếu số hiệu văn bản pháp lý (QĐ 1195, NQ 1685, QĐ 155, QĐ 76).
   - *Chuẩn hóa địa danh:* Đảm bảo phân biệt chính xác địa danh lịch sử (Quận 12) và địa danh hiện hành (Phường Thới An, Thành phố Hồ Chí Minh).
   - *Bảo mật thông tin riêng tư:* Xác nhận không có dữ liệu cá nhân hay điểm số của học sinh trong tài liệu nhà trường.
   - *Toàn vẹn Checksum:* Kiểm tra mã SHA-256 trùng khớp với văn bản lưu trữ.
4. **Hành động duyệt:**
   - Nhấn nút **"Phê duyệt tài liệu"** hoặc gửi yêu cầu API `POST /api/rag/documents/[id]/approve`.
   - Hệ thống sẽ tự động cập nhật:
     - `approvalStatus: 'APPROVED'`
     - `isAllowedForRag: true`
     - Ghi nhận `approverId`, `approvedByName` và `approvedAt` vào cơ sở dữ liệu Supabase STAGING.

> [!WARNING]
> Mọi nỗ lực tự duyệt từ tài khoản của kỹ sư tải lên sẽ bị hệ thống máy chủ tự động từ chối với mã lỗi **403 Forbidden - Four-Eyes Principle Violation**.
