# KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
> **Đơn vị thực hiện:** Trường THCS Nguyễn Trung Trực, Phường Thới An, Thành phố Hồ Chí Minh  
> **Nền tảng:** React 18 + Vite + TypeScript + Tailwind CSS

---

## 1. Giới Thiệu Dự Án

**KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC** là website văn hóa - giáo dục trực tuyến nhằm hiện thực hóa chủ trương xây dựng Không gian văn hóa Hồ Chí Minh của Đảng bộ TP. Hồ Chí Minh trong học đường. 

Website được thiết kế trang trọng, chuẩn mực, hiện đại và thân thiện với học sinh THCS, giáo viên, phụ huynh và cộng đồng cư dân phường Thới An. Nền tảng được xây dựng với cấu trúc module độc lập, sẵn sàng mở rộng để tích hợp Trợ lý ảo AI RAG và Kho cơ sở dữ liệu tri thức được kiểm duyệt trong giai đoạn 2.

---

## 2. Điểm Nổi Bật Về Thiết Kế & Giao Diện

- **Hệ màu sắc truyền thống trang trọng:**
  - **Đỏ đô (`#8B151B`):** Biểu tượng của nhiệt huyết cách mạng, cội nguồn lịch sử thiêng liêng.
  - **Vàng kim (`#D4AF37`):** Ánh sao vàng, sự rạng ngời và trang nghiêm của văn hóa dân tộc.
  - **Trắng ngà (`#FDFBF7`):** Nền dịu mắt, tăng độ tương phản đọc trên màn hình máy tính và thiết bị di động.
- **Phông chữ tiếng Việt chuẩn mực:** Kết hợp giữa *Merriweather* (tiêu đề trang trọng) và *Be Vietnam Pro* (nội dung rõ nét, dễ đọc cho học sinh).
- **Trải nghiệm Responsive:** Tương thích mượt mà trên Desktop, Laptop, Máy tính bảng (Tablet) và Điện thoại thông minh (Mobile).
- **Trợ năng & Tương tác:** Hỗ trợ điều hướng bàn phím (phím `Tab`, `Esc` để đóng modal), trạng thái focus rõ ràng, nút cuộn nhanh lên đầu trang (Back to top).

---

## 3. Cấu Trúc Chức Năng Website

1. **Header (Thanh điều hướng):**
   - Biểu tượng huy hiệu sao vàng trang nghiêm.
   - Tên không gian **KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH** & đơn vị **Trường THCS Nguyễn Trung Trực**.
   - Menu điều hướng nhanh đến 6 phân khu nội dung.
   - Menu Mobile dạng trượt đóng/mở tiện lợi.
2. **Hero Banner:**
   - Đại tự **KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC**, thông điệp truyền cảm hứng học tập và noi gương Bác.
   - 2 nút CTA: *Khám phá không gian* và *Tìm hiểu tư liệu*.
   - 3 trụ cột giá trị cốt lõi.
3. **Phần Giới thiệu (About):**
   - Mục đích, vai trò trong công tác giáo dục học đường tại phường Thới An.
   - 4 khối trụ cột trực quan: Mục đích xây dựng, Chuyển đổi số, Đổi mới dạy & học, Gắn kết cộng đồng.
4. **Chủ tịch Hồ Chí Minh (Timeline):**
   - Tiểu sử và dòng thời gian các mốc lịch sử xác thực từ 1890 đến 1969.
   - Bộ lọc thời kỳ: Thời niên thiếu (1890), Bôn ba cứu nước (1911 - 1920), Lãnh đạo cách mạng (1930 - 1954), Di chúc thiêng liêng (1969).
   - Modal xem chi tiết diễn biến, địa danh và ý nghĩa lịch sử của từng mốc.
5. **Kho tư liệu số hóa (Resources):**
   - Bộ lọc theo danh mục: Văn kiện & Bài viết, Sách & Tài liệu, Hình ảnh lịch sử, Phim tư liệu.
   - Tìm kiếm thời gian thực (Realtime search) theo từ khóa.
   - Trạng thái Empty state thông minh khi không tìm thấy kết quả.
   - Modal xem toàn văn tư liệu và trích dẫn bản quyền học đường.
6. **Góc học tập THCS (Learning Corner):**
   - **Chuyên đề 5 Điều Bác Hồ dạy & Rèn luyện:** Phân tích sâu sắc và gợi ý hành động thiết thực mỗi ngày.
   - **Thử tài lịch sử (Mini-Quiz):** Trắc nghiệm 5 câu hỏi tương tác với phản hồi sư phạm, chấm điểm tức thì.
   - **Nhật ký Việc tốt mỗi ngày:** Bảng checklist rèn luyện phẩm chất tốt đẹp.
7. **Hoạt động phong trào (Activities):**
   - Tin tức, hình ảnh về Hội thi kể chuyện Bác Hồ, Lễ kết nạp Đoàn, Hành trình về nguồn, Tủ sách Bác Hồ.
   - Ghi chú minh bạch nguồn dữ liệu mẫu minh họa.
8. **Khu vực Chatbot AI tương lai (Chatbot Preview):**
   - Nút nổi cố định: *“Bạn đồng hành văn hóa Hồ Chí Minh”*.
   - Cửa sổ giới thiệu lộ trình phát triển Giai đoạn 2 (ứng dụng công nghệ RAG).
   - Minh bạch cam kết: **Tuyệt đối không giả lập câu trả lời AI giả mạo khi chưa kết nối mô hình thật**.
   - Danh sách câu hỏi mẫu định hướng học sinh tra cứu sau này.
9. **Footer (Chân trang):**
   - Tên cơ quan chủ quản: Trường THCS Nguyễn Trung Trực, Phường Thới An.
   - Khu vực thông tin liên hệ được quy hoạch sẵn chờ cập nhật chính thức từ Ban Giám hiệu.
   - Bản quyền học đường và nút cuộn về đầu trang.

---

## 4. Cấu Trúc Thư Mục Dự Án

```
├── index.html                  # HTML entry point với phông chữ Google Fonts tiếng Việt
├── package.json                # Cấu hình dự án & danh sách thư viện
├── postcss.config.js           # Cấu hình PostCSS
├── tailwind.config.js          # Hệ màu sắc Đỏ đô, Vàng kim, Trắng ngà & Typo
├── tsconfig.json               # Cấu hình TypeScript
├── vite.config.ts              # Cấu hình Vite bundler
├── src/
│   ├── main.tsx                # Điểm khởi chạy React
│   ├── App.tsx                 # Layout tổng thể và điều hướng
│   ├── index.css               # CSS toàn cục, scrollbar tùy biến
│   ├── types/
│   │   └── index.ts            # Định nghĩa Interface dữ liệu TypeScript
│   ├── data/
│   │   ├── timelineData.ts     # Dữ liệu các mốc lịch sử xác thực (1890 - 1969)
│   │   ├── resourcesData.ts    # Dữ liệu kho tài liệu, văn kiện, hình ảnh số hóa
│   │   ├── learningData.ts     # Dữ liệu 5 điều Bác dạy, quiz tương tác, việc tốt
│   │   └── activitiesData.ts   # Dữ liệu hoạt động phong trào nhà trường
│   └── components/
│       ├── Header.tsx          # Thanh điều hướng trên cùng & Mobile Menu
│       ├── Hero.tsx            # Khối Banner chính
│       ├── About.tsx           # Khối giới thiệu không gian văn hóa số
│       ├── Timeline.tsx        # Trục thời gian lịch sử Chủ tịch Hồ Chí Minh
│       ├── Resources.tsx       # Kho tư liệu với tìm kiếm & lọc danh mục
│       ├── ResourceModal.tsx   # Modal xem chi tiết tư liệu
│       ├── LearningCorner.tsx  # Góc học tập, quiz & nhật ký việc tốt
│       ├── Activities.tsx      # Thẻ hoạt động phong trào trường học
│       ├── ActivityModal.tsx   # Modal xem chi tiết sự kiện hoạt động
│       ├── ChatbotPreview.tsx  # Nút nổi & Modal lộ trình Trợ lý AI (GĐ2)
│       ├── Footer.tsx          # Chân trang & Thông tin liên hệ
│       └── BackToTop.tsx       # Nút cuộn lên đầu trang
```

---

## 5. Hướng Dẫn Cài Đặt & Chạy Trên Windows

Bạn có thể sử dụng **Windows Terminal**, **PowerShell** hoặc **Command Prompt (CMD)** để chạy dự án:

### Bước 1: Mở thư mục dự án
```powershell
cd "D:\Web\Không gian văn hoá HCM"
```

### Bước 2: Cài đặt dependencies (nếu chưa cài)
```powershell
npm install
```

### Bước 3: Khởi chạy môi trường phát triển (Development)
```powershell
npm run dev
```
Sau khi chạy, giao diện dòng lệnh sẽ hiển thị địa chỉ truy cập cục bộ:
👉 Mở trình duyệt và truy cập: `http://localhost:5173/`

### Bước 4: Kiểm tra TypeScript & Đóng gói sản phẩm (Production Build)
```powershell
npm run build
```
Lệnh này sẽ biên dịch mã nguồn TypeScript và tạo thư mục `dist/` tối ưu sẵn sàng triển khai.

### Bước 5: Xem trước bản Build (Preview)
```powershell
npm run preview
```

---

## 6. Lộ Trình Phát Triển Tiếp Theo (Giai Đoạn 2)

1. **Tích hợp Chatbot AI RAG:**
   - Xây dựng backend kết nối Vector Database (như ChromaDB / pgvector).
   - Nạp toàn bộ tài liệu lịch sử đã được Hội đồng giáo dục Trường THCS Nguyễn Trung Trực phê duyệt.
   - Thay thế component `ChatbotPreview.tsx` bằng giao diện hội thoại tương tác thời gian thực với streaming text.
2. **Hệ thống Quản trị Nội dung (Admin Dashboard):**
   - Cho phép Ban Giám hiệu và giáo viên quản lý tải lên bài viết, video, thông báo hoạt động mới.
3. **Mở rộng Đa phương tiện:**
   - Tích hợp không gian ảo 3D (Virtual Tour 360) tham quan Bến Nhà Rồng và Lăng Bác.
