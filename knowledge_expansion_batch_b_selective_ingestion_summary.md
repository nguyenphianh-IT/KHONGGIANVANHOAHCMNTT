# ADR-002: BATCH B – SELECTIVE INGESTION 01 SUMMARY
## BÁO CÁO NHẬP TÀI LIỆU CÓ ĐỦ CĂN CỨ VÀO STAGING

**Dự án:** Hệ thống Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Giai đoạn:** Knowledge Expansion 01 – Batch B – Selective Ingestion 01  
**Môi trường thực thi:** STAGING (Supabase Cloud & Local Persistent Store)  
**Môi trường Production:** Bảo toàn 100% dữ liệu gốc đang vận hành  
**Thời điểm hoàn tất:** 2026-11-14T17:25:00Z  
**Phương châm:** SELECTIVE INGESTION – SOURCE TRACEABILITY – ZERO SELF-APPROVAL – NO PRODUCTION MUTATION  

---

## I. KẾT QUẢ THỰC HIỆN NHẬP DỮ LIỆU CÓ CHỌN LỌC

Theo đúng chỉ thị của Master Prompt, hệ thống đã thực hiện nhập liệu có chọn lọc đối với 3 ứng viên có nguồn chính thức được kiểm chứng đầy đủ:

1. **DOC-HCM-026 (Ứng viên B-07):** *Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)*
   - Nguồn: Quyết định 1195/QĐ-UB-NC (18/03/1997 của UBND TP.HCM) & Nghị quyết 1685/NQ-UBTVQH15 (16/06/2025 của UBTVQH).
   - Bản quyền: `PUBLIC_DOMAIN_CONFIRMED` (Văn bản QPPL theo Điều 19 Luật SHTT).
   - Số chunks phát sinh: 13 chunks.
   - Checksum: `D5AD64FDEE21C07B2C37BFAAD192521DF992BFB5F32A3F2B4835C727473F0107`.

2. **DOC-HCM-027 (Ứng viên B-10):** *Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)*
   - Nguồn: Quyết định 155/QĐ-UBND (31/07/2014 của UBND Quận 12) & Quyết định 76/QĐ-UBND (01/07/2025 của UBND Phường Thới An) & Kế hoạch 01/KH-NTT.
   - Bản quyền: `OPEN_ACCESS_REUSE_PERMITTED` (Hồ sơ giáo dục công khai của trường, không có dữ liệu cá nhân).
   - Số chunks phát sinh: 11 chunks.
   - Checksum: `EAA1AC69161B610ACF99C308E13D7EFA1178B17730721C6D5004BAF87C2F16A9`.

3. **DOC-HCM-028 (Ứng viên B-02):** *Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí*
   - Nguồn: Thư tịch cổ công cộng của Trịnh Hoài Đức (Gia Định thành thông chí) & Thư mục khoa học Hội KHLS TP.HCM.
   - Bản quyền: `PUBLIC_DOMAIN_CONFIRMED` (Thư tịch cổ thế kỷ XIX).
   - Số chunks phát sinh: 9 chunks.
   - Checksum: `EB906EE701F743046B3D833F7AE737600B84FE41F68E7DA9290F9A515D3BCBFC`.

- **Tổng số tài liệu mới nạp:** 3 tài liệu chính thức (`DOC-HCM-026`, `DOC-HCM-027`, `DOC-HCM-028`).
- **Tổng số chunks phát sinh:** 33 chunks.
- **Trạng thái an toàn quản trị:** 100% tài liệu được gán `approvalStatus: 'PENDING_REVIEW'` và `isAllowedForRag: false`.

---

## II. ĐỐI SOÁT REGISTRY VÀ BẢO TỒN KHO TRI THỨC HIỆN HỮU

| Dải mã tài liệu | Phân loại dữ liệu | Số lượng tài liệu | Trạng thái quản trị | Quyền truy xuất RAG |
|:---|:---|:---:|:---:|:---:|
| **DOC-HCM-001 đến 008, 010 đến 015** | Kho tri thức Production chính thức | 14 | `APPROVED` | ✅ `true` (Đang phục vụ) |
| **DOC-HCM-009** | Security Canary (Kiểm thử cổng an toàn) | 1 | `PENDING_REVIEW` | ❌ `false` (Khóa vĩnh viễn) |
| **DOC-HCM-016 đến 022** | Tri thức nền tảng Batch A | 7 | `PENDING_REVIEW` | ❌ `false` (Chờ duyệt) |
| **DOC-HCM-023 đến 025** | Mốc son lịch sử dòng thời gian | 3 | `APPROVED` | ✅ `true` (Đang phục vụ) |
| **DOC-HCM-026 đến 028** | **Batch B Selective Ingestion 01 (Mới)** | **3** | ⏳ `PENDING_REVIEW` | ❌ `false` (Chờ duyệt 4 mắt) |
| **Tổng số hồ sơ trong Registry:** | | **28** | **17 APPROVED / 11 PENDING** | |

---

## III. NGUYÊN TẮC ZERO SELF-APPROVAL VÀ BẢO VỆ PRODUCTION
1. Script nạp dữ liệu (`uploadedBy: OP-STAGING-INGEST-BATCH-B-SELECTIVE`) tuyệt đối **không tự chuyển tài liệu sang APPROVED**.
2. Toàn bộ 3 tài liệu mới hiện đang nằm trong hàng đợi chờ duyệt (Pending Approval Queue) trên STAGING, không tham gia vào chỉ mục truy xuất (Retrieval Index) của người dùng thông thường.
3. Production Database và Production RAG Runtime được bảo toàn nguyên vẹn $100%$, không có bất kỳ thao tác ghi hay sửa đổi nào.
