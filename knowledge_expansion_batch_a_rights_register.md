# ADR-002: KNOWLEDGE EXPANSION BATCH A – COPYRIGHT & CONTENT RIGHTS REGISTER

**Dự án:** Hệ thống Không gian Văn hóa Hồ Chí Minh – Trường THCS Nguyễn Trung Trực  
**Giai đoạn:** Knowledge Expansion 01 – Batch A  
**Môi trường:** STAGING  
**Thời điểm lập:** 2026-11-14T09:20:00Z  
**Cơ chế:** SOURCE FIRST – VERIFY – NORMALIZE – INGEST – REVIEW – APPROVE  

---

## I. TỔNG QUAN PHÂN LOẠI QUYỀN SỬ DỤNG BATCH A

Tuân thủ nghiêm ngặt **Mục V (Copyright & Content Rights Gate)** của Master Prompt:
- Không tự kết luận tài liệu được tự do sao chép chỉ vì có thể đọc trực tuyến.
- Không vượt qua cổng quyền sử dụng bằng cách chia nhỏ hoặc đổi định dạng.
- Phân định rành mạch giữa **Nguyên tác văn bản lịch sử công cộng** và **Công trình nghiên cứu, sách chuyên khảo có bản quyền xuất bản**.

| Mã tài liệu | Tên tài liệu | Đơn vị sở hữu / Nguồn gốc | Phân loại bản quyền | Quyền đưa vào RAG STAGING | Ghi chú điều kiện sử dụng |
|:---|:---|:---|:---|:---|:---|
| **DOC-HCM-016** | Hồ Chí Minh – Biên niên tiểu sử, Tập 1 (1890–1929) | NXB Chính trị quốc gia Sự thật & Viện Lịch sử Đảng | `METADATA_ONLY` / `LICENSE_REQUIRED` | ❌ Chưa (Chỉ lưu hồ sơ thư mục & tóm lược mốc) | Sách nghiên cứu có bản quyền xuất bản. Không sao chép toàn văn. |
| **DOC-HCM-017** | Hồ Chí Minh – Biên niên tiểu sử, Tập 2 (1930–9/1945) | NXB Chính trị quốc gia Sự thật & Viện Lịch sử Đảng | `METADATA_ONLY` / `LICENSE_REQUIRED` | ❌ Chưa (Chỉ lưu hồ sơ thư mục & tóm lược mốc) | Sách nghiên cứu có bản quyền xuất bản. Không sao chép toàn văn. |
| **DOC-HCM-018** | Đường Kách mệnh (1927) | Nguyễn Ái Quốc (Bảo vật Quốc gia số 1) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ PENDING_REVIEW (Chờ duyệt 4 mắt) | Tác phẩm lịch sử xuất bản năm 1927, di sản công cộng toàn dân tộc. |
| **DOC-HCM-019** | Các văn kiện thành lập Đảng năm 1930 | Nguyễn Ái Quốc & Hội nghị thành lập Đảng 1930 | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ PENDING_REVIEW (Chờ duyệt 4 mắt) | Cương lĩnh chính trị đầu tiên của Đảng, văn kiện lịch sử quốc gia. |
| **DOC-HCM-020** | Cần, Kiệm, Liêm, Chính (1949) | Bút danh Lê Quyết Thắng (Báo Cứu Quốc) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ PENDING_REVIEW (Chờ duyệt 4 mắt) | Bài báo lịch sử năm 1949, thuộc Hồ Chí Minh Toàn tập công khai. |
| **DOC-HCM-021** | Lời kêu gọi thi đua ái quốc (11/6/1948) | Chủ tịch Hồ Chí Minh (Báo Cứu Quốc số 968) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ PENDING_REVIEW (Chờ duyệt 4 mắt) | Văn kiện Lời kêu gọi lịch sử toàn dân tộc năm 1948. |
| **DOC-HCM-022** | Đạo đức cách mạng (1958) | Bút danh Trần Lực (Tạp chí Học tập số 12/1958) | `PUBLIC_DOMAIN_CONFIRMED` | ⏳ PENDING_REVIEW (Chờ duyệt 4 mắt) | Bài viết lý luận chính trị lịch sử năm 1958. |

---

## II. ĐÁNH GIÁ PHÁP LÝ CHI TIẾT THEO TỪNG NHÓM TÀI LIỆU

### 1. Nhóm ấn phẩm nghiên cứu chuyên khảo (DOC-HCM-016 & DOC-HCM-017):
- **Căn cứ pháp lý:** Luật Sở hữu trí tuệ Việt Nam quy định quyền tác giả đối với công trình nghiên cứu, tuyển tập, biên niên do các tổ chức khoa học và nhà xuất bản biên soạn.
- **Biện pháp tuân thủ:**
  - Hệ thống chỉ lưu thông tin thư mục khoa học (tên sách, nhà xuất bản, năm xuất bản, chỉ số ISBN, đường dẫn chính thức).
  - Tóm lược các mốc thời gian khách quan đã được bảo tàng công bố rộng rãi.
  - Tuyệt đối không sao chép nguyên văn các trang sách hoặc phân phối bản scan/ebook trái phép.

### 2. Nhóm tác phẩm kinh điển của Chủ tịch Hồ Chí Minh (DOC-HCM-018, DOC-HCM-020, DOC-HCM-021, DOC-HCM-022):
- **Căn cứ pháp lý:** Các tác phẩm, bài báo, lời kêu gọi của Chủ tịch Hồ Chí Minh viết từ năm 1927 đến năm 1958 là tài sản văn hóa - lịch sử thiêng liêng vô giá của dân tộc Việt Nam, được xuất bản chính thức trong Hồ Chí Minh Toàn tập và phổ biến rộng rãi phục vụ học tập, nghiên cứu và giáo dục chính trị tư tưởng.
- **Biện pháp tuân thủ:**
  - Sử dụng đúng nguyên bản đã được Nhà xuất bản Chính trị quốc gia Sự thật và Bảo tàng Hồ Chí Minh xác thực.
  - Bảo toàn tính toàn vẹn của văn bản, ghi rõ thời điểm ra đời, bút danh và cơ quan báo chí đăng tải đầu tiên.

### 3. Nhóm văn kiện lịch sử thành lập Đảng (DOC-HCM-019):
- **Căn cứ pháp lý:** Cương lĩnh chính trị đầu tiên của Đảng (Chánh cương vắn tắt, Sách lược vắn tắt, Điều lệ vắn tắt...) do Nguyễn Ái Quốc khởi thảo và Hội nghị thành lập Đảng thông qua ngày 03/02/1930. Đây là văn kiện lịch sử chính trị thuộc sở hữu công cộng của Nhà nước và toàn thể nhân dân Việt Nam.
- **Biện pháp tuân thủ:** Tách rõ 5 văn kiện thành phần con, lưu trữ nguồn từ Kho tư liệu Văn kiện Đảng và Cổng thông tin Hồ Chí Minh.

---

## III. CAM KẾT HÀNG RÀO AN TOÀN TRUY XUẤT (RETRIEVAL ACCESS BOUNDARY)
1. Cả 7 tài liệu Batch A được gắn cờ `isAllowedForRag = false` và trạng thái `PENDING_REVIEW`.
2. Không một chunk nào thuộc Batch A được đưa vào chỉ mục truy xuất phục vụ người dùng công cộng cho đến khi có Biên bản phê duyệt độc lập của Hội đồng Thẩm định chuyên môn.
3. Không thực hiện bất kỳ hành vi né tránh kiểm soát bản quyền.
