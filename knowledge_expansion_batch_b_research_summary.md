# ADR-002: KNOWLEDGE EXPANSION BATCH B – RESEARCH SUMMARY
## TỔNG KẾT NGHIÊN CỨU LỊCH SỬ ĐỊA PHƯƠNG & KHỞI TẠO NGUỒN TƯ LIỆU BATCH B

**Dự án:** Hệ thống Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Giai đoạn:** Knowledge Expansion 01 – Batch B  
**Phạm vi:** 10 nhóm tư liệu (B-01 đến B-10)  
**Môi trường:** STAGING (Nghiên cứu & Chuẩn hóa hồ sơ)  
**Môi trường Production:** Bảo toàn nguyên vẹn 100% dữ liệu đang vận hành  
**Thời điểm hoàn tất:** 2026-11-14T17:15:00Z  
**Phương châm:** HISTORICAL ACCURACY – OFFICIAL SOURCES – GEOGRAPHICAL PRECISION – EDUCATIONAL VALUE  

---

## I. KẾT QUẢ ĐẠT ĐƯỢC TOÀN DIỆN

1. **Khởi tạo đầy đủ 12 nguồn tư liệu chính thống (Source Register):**
   - 100% nguồn được gắn định danh `SRC-B-001` đến `SRC-B-012`.
   - Xác thực trạng thái trực tuyến của các cổng thông tin chính phủ (`tphcm.chinhphu.vn`, `xaydungchinhsach.chinhphu.vn`, `congbao.hochiminhcity.gov.vn`, `thcsnguyentrungtruc.hcm.edu.vn`, `ubmttq.hochiminhcity.gov.vn`).

2. **Chuẩn hóa 10 nhóm hồ sơ ứng viên (Candidate Manifest CAND-B-01 đến CAND-B-10):**
   - Phân định rành mạch giữa lịch sử đại cương Thành phố (B-01 đến B-05), lịch sử địa phương Thới An (B-06 đến B-09) và lịch sử nhà trường (B-10).
   - Trạng thái kiểm duyệt đúng thực tế:
     - `METADATA_ONLY`: B-01, B-03, B-04, B-05 (Bộ sách chuyên khảo được bảo vệ bản quyền).
     - `SOURCE_CONFIRMED`: B-02 (Có nguồn thư tịch cổ công cộng đối soát).
     - `READY_FOR_INGESTION_REVIEW`: B-07 (Văn bản pháp quy QĐ 1195 và NQ 1685), B-10 (Hồ sơ chính thức nhà trường).
     - `SOURCE_GAP`: B-06, B-08, B-09 (Ghi nhận khoảng trống dữ liệu để bổ sung).

3. **Thiết lập bảng đối chiếu Địa danh - Không gian - Thời gian (Geo-Temporal Crosswalk):**
   - Phân định rõ 5 thời kỳ lịch sử.
   - Định danh chuẩn hiện hành: **Phường Thới An, Thành phố Hồ Chí Minh** (Nghị quyết số 1685/NQ-UBTVQH15, hiệu lực từ 01/07/2025).
   - Bảo toàn tên gọi lịch sử khi trích dẫn văn bản cũ (Phường Thới An, Quận 12; Phường Thạnh Xuân, Quận 12; Huyện Hóc Môn).

4. **Xây dựng Sổ theo dõi khoảng trống tư liệu (Source Gap Register):**
   - Ghi nhận 4 giới hạn bằng chứng (GAP-B-01 đến GAP-B-04): Đình Thới An chưa có quyết định xếp hạng di tích; số liệu thống kê sau sáp nhập 2025 cần chờ niên giám; Anh hùng Nguyễn Trung Trực không có di tích chiến công tại Thới An; bộ sách 6 tập kết thúc năm 2015.

5. **Bộ câu hỏi giáo dục sư phạm chuẩn mực:**
   - Hoàn thành **50 câu hỏi** chất lượng cao (5 câu cho mỗi nhóm B-01 đến B-10) với đầy đủ metadata, mức độ sư phạm và định hướng câu trả lời cho học sinh THCS.

---

## II. BẢNG PHÂN LOẠI TRẠNG THÁI 10 NHÓM TƯ LIỆU BATCH B

| Mã nhóm | Tên hồ sơ tư liệu | Danh mục | Phân loại bản quyền | Trạng thái ứng viên | Quyền nạp RAG |
|:---|:---|:---|:---|:---:|:---:|
| **B-01** | Khởi nguồn đến TK XVI | `hcmc-history` | `METADATA_ONLY` | `METADATA_ONLY` | ❌ Chỉ lưu thư mục |
| **B-02** | TK XVII đến giữa TK XIX | `hcmc-history` | `METADATA_ONLY` / `PUBLIC_DOMAIN_CONFIRMED` | `SOURCE_CONFIRMED` | ⚠️ Trích yếu công cộng |
| **B-03** | Giai đoạn 1859–1945 | `hcmc-history` | `METADATA_ONLY` | `METADATA_ONLY` | ❌ Chỉ lưu thư mục |
| **B-04** | Giai đoạn 1945–1975 | `hcmc-history` | `METADATA_ONLY` | `METADATA_ONLY` | ❌ Chỉ lưu thư mục |
| **B-05** | Giai đoạn 1975–2015 & Lược sử | `hcmc-history` | `METADATA_ONLY` | `METADATA_ONLY` | ❌ Chỉ lưu thư mục |
| **B-06** | Lịch sử vùng đất Thới An | `hcmc-history` | `METADATA_ONLY` | `SOURCE_GAP` | ⏳ Chờ bổ sung nguồn |
| **B-07** | Địa giới hành chính Thới An qua các thời kỳ | `hcmc-history` | `PUBLIC_DOMAIN_CONFIRMED` | `READY_FOR_INGESTION_REVIEW` | ✅ Sẵn sàng thẩm định |
| **B-08** | Địa lý, dân cư và phát triển | `hcmc-history` | `PUBLIC_DOMAIN_CONFIRMED` | `SOURCE_GAP` | ⏳ Chờ niên giám mới |
| **B-09** | Địa danh, công trình văn hóa Thới An | `cultural-heritage` | `METADATA_ONLY` | `SOURCE_GAP` | ⏳ Chờ hồ sơ di tích |
| **B-10** | Lịch sử Trường THCS Nguyễn Trung Trực | `school-education` | `OPEN_ACCESS_REUSE_PERMITTED` | `READY_FOR_INGESTION_REVIEW` | ✅ Sẵn sàng thẩm định |

---

## III. CAM KẾT TUÂN THỦ CHỈ THỊ MASTER PROMPT
- ✅ **Chưa nhập hàng loạt vào Supabase:** Toàn bộ công việc ở giai đoạn này dừng lại ở việc chuẩn hóa hồ sơ, xác minh nguồn và xây dựng crosswalk.
- ✅ **Zero Production Mutation:** Hệ thống Production đang vận hành giữ nguyên trạng $100%$.
- ✅ **Zero Hallucination:** Mọi khoảng trống thông tin được ghi nhận trung thực dưới mã `SOURCE_GAP`, không bịa đặt số liệu hay dựng sử khống.
