-- ==============================================================================
-- BẢN MIGRATION 016: ĐỒNG BỘ 25 CÂU HỎI HỘI THI CHUẨN TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH (KHONGGIANVANHOAHCMNTT)
-- MỤC ĐÍCH: Nạp chính thức 25 câu hỏi trắc nghiệm lịch sử vào public.quiz_questions
--          và public.quiz_answers, xóa bỏ dữ liệu mock thử nghiệm cũ.
-- ==============================================================================

BEGIN;

-- 1. Xóa các câu hỏi mock thử nghiệm cũ (nếu có)
DELETE FROM public.quiz_answers 
WHERE question_id IN (SELECT id FROM public.quiz_questions WHERE sort_order > 25);

-- 2. Nạp chính thức 25 câu hỏi vào public.quiz_questions và public.quiz_answers

-- CÂU 1
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'Chủ tịch Hồ Chí Minh rời Bến cảng Nhà Rồng (Sài Gòn) ra đi tìm đường cứu nước vào ngày tháng năm nào?',
    '["Ngày 19 tháng 5 năm 1890", "Ngày 05 tháng 6 năm 1911", "Ngày 03 tháng 2 năm 1930", "Ngày 02 tháng 9 năm 1945"]'::jsonb,
    1,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    1,
    'Ngày 05/06/1911, người thanh niên yêu nước Nguyễn Tất Thành (với tên Văn Ba) đã lên tàu Amiral Latouche-Tréville rời Bến Nhà Rồng bắt đầu hành trình cứu nước suốt 30 năm.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 2
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000002',
    'Điều thứ 5 trong "5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng" là gì?',
    '["Đoàn kết tốt, kỷ luật tốt", "Giữ gìn vệ sinh thật tốt", "Khiêm tốn, thật thà, dũng cảm", "Học tập tốt, lao động tốt"]'::jsonb,
    2,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000002',
    2,
    'Điều thứ 5 Bác dạy là: "Khiêm tốn, thật thà, dũng cảm" - nhắc nhở học sinh luôn trung thực, không dối trá và dũng cảm nhận lỗi để tiến bộ.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 3
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000003',
    'Trong bức thư gửi học sinh nhân ngày khai trường đầu tiên (9/1945), Bác Hồ căn dặn: "...non sông Việt Nam có trở nên tươi đẹp hay không... chính là nhờ một phần lớn ở công..." gì của các em?',
    '["Lao động sản xuất", "Học tập", "Rèn luyện thể thao", "Tiết kiệm tài nguyên"]'::jsonb,
    3,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000003',
    1,
    'Bác khẳng định: "...dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em."'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 4
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000004',
    'Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa tại đâu và vào thời gian nào?',
    '["Quảng trường Ba Đình (Hà Nội) - Ngày 02/09/1945", "Chiến khu Tân Trào (Tuyên Quang) - Ngày 16/08/1945", "Bến cảng Nhà Rồng (Sài Gòn) - Ngày 23/09/1945", "Hang Pác Bó (Cao Bằng) - Ngày 28/01/1941"]'::jsonb,
    4,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000004',
    0,
    'Sáng ngày 02/09/1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đã thay mặt Chính phủ lâm thời đọc Tuyên ngôn Độc lập lịch sử.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 5
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000005',
    'Trường THCS của chúng ta vinh dự mang tên vị Anh hùng dân tộc Nguyễn Trung Trực với câu nói bất hủ nào trước quân thù?',
    '["Không có gì quý hơn độc lập, tự do!", "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây.", "Thà làm quỷ nước Nam chứ không thèm làm vương đất Bắc.", "Quyết tử để Tổ quốc quyết sinh."]'::jsonb,
    5,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000005',
    1,
    'Anh hùng Nguyễn Trung Trực đã khẳng khái tuyên bố trước thực dân Pháp câu nói sáng ngời khí tiết: "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 6
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000006',
    'Bản Di chúc thiêng liêng của Chủ tịch Hồ Chí Minh được Bác bắt đầu viết vào năm nào?',
    '["Năm 1960", "Năm 1965", "Năm 1968", "Năm 1969"]'::jsonb,
    6,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000006',
    1,
    'Bác Hồ bắt đầu viết tài liệu Tuyệt đối bí mật (Bản Di chúc lịch sử) vào lúc 9 giờ sáng ngày 10/5/1965 nhân dịp sinh nhật lần thứ 75 của Người.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 7
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000007',
    'Chân lý thời đại bất hủ: "Không có gì quý hơn độc lập, tự do" được Bác Hồ phát biểu kêu gọi toàn quốc chống Mỹ cứu nước vào năm nào?',
    '["Năm 1954", "Năm 1960", "Năm 1966", "Năm 1969"]'::jsonb,
    7,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000007',
    2,
    'Sáng ngày 17/7/1966, trên làn sóng Đài Tiếng nói Việt Nam, Bác Hồ đã đọc Lời kêu gọi đồng bào chiến sĩ cả nước với câu nói nổi tiếng khắc sâu vào tâm khảm dân tộc.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 8
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000008',
    'Tập thơ chữ Hán nổi tiếng gồm 133 bài thơ được Bác Hồ sáng tác trong chốn lao tù gian khổ có tên là gì?',
    '["Việt Bắc anh dũng", "Nhật ký trong tù (Ngục trung nhật ký)", "Bài ca chúc Tết", "Trăng chiến khu"]'::jsonb,
    8,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000008',
    1,
    'Tác phẩm "Nhật ký trong tù" khắc họa ý chí gang thép, tinh thần lạc quan cách mạng và tâm hồn nhân đạo cao đẹp của Chủ tịch Hồ Chí Minh.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 9
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000009',
    'Địa chỉ đỏ di tích lịch sử cách mạng hào hùng gắn liền với truyền thống quê hương chúng ta tại Thành phố Hồ Chí Minh là:',
    '["Địa đạo Củ Chi", "Chiến khu An Phú Đông", "Rừng Sác Cần Giờ", "Bến Dược"]'::jsonb,
    9,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000009',
    1,
    'Chiến khu An Phú Đông là căn cứ kháng chiến kiên cường, nơi quân dân địa phương lập nên nhiều chiến công hiển hách trong hai cuộc kháng chiến.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 10
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000010',
    'Thành phố Sài Gòn - Gia Định vinh dự được Quốc hội chính thức đổi tên thành Thành phố Hồ Chí Minh vào tháng năm nào?',
    '["Ngày 30/04/1975", "Ngày 02/07/1976", "Ngày 19/05/1975", "Ngày 02/09/1976"]'::jsonb,
    10,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000010',
    1,
    'Tại kỳ họp thứ nhất Quốc hội khóa VI (ngày 02/07/1976), Quốc hội đã nhất trí quyết nghị chính thức đặt tên thành phố là Thành phố Hồ Chí Minh.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 11
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000011',
    'Đội Thiếu niên Tiền phong Hồ Chí Minh được thành lập vào ngày tháng năm nào?',
    '["Ngày 15 tháng 5 năm 1941", "Ngày 19 tháng 5 năm 1890", "Ngày 03 tháng 2 năm 1930", "Ngày 26 tháng 3 năm 1931"]'::jsonb,
    11,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000011',
    0,
    'Ngày 15/05/1941, tại thôn Nà Mạ, xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng, Đội Nhi đồng Cứu quốc (tiền thân Đội TNTP Hồ Chí Minh) chính thức được thành lập.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 12
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000012',
    'Người đội trưởng đầu tiên của Đội Nhi đồng Cứu quốc (tiền thân Đội TNTP Hồ Chí Minh) là người anh hùng nhỏ tuổi nào?',
    '["Kim Đồng (Nông Văn Dền)", "Vừ A Dính", "Lê Văn Tám", "Kpa Klơng"]'::jsonb,
    12,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000012',
    0,
    'Anh hùng liệt sĩ Kim Đồng (tên thật là Nông Văn Dền) là người đội trưởng đầu tiên của Đội Nhi đồng Cứu quốc, hy sinh anh dũng khi làm nhiệm vụ canh gác bảo vệ cán bộ cách mạng.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 13
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000013',
    'Điều thứ nhất trong "5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng" là gì?',
    '["Yêu Tổ quốc, yêu đồng bào", "Học tập tốt, lao động tốt", "Đoàn kết tốt, kỷ luật tốt", "Khiêm tốn, thật thà, dũng cảm"]'::jsonb,
    13,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000013',
    0,
    'Điều 1 trong 5 Điều Bác Hồ dạy là: "Yêu Tổ quốc, yêu đồng bào" - giáo dục thiếu nhi lòng tự hào dân tộc, tình yêu quê hương đất nước và tình yêu thương con người.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 14
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000014',
    'Bài hát chính thức "Cùng nhau ta đi lên" (Đội ca Đội TNTP Hồ Chí Minh) do nhạc sĩ nào sáng tác?',
    '["Nhạc sĩ Phong Nhã", "Nhạc sĩ Văn Cao", "Nhạc sĩ Phạm Tuyên", "Nhạc sĩ Trịnh Công Sơn"]'::jsonb,
    14,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000014',
    0,
    'Bài hát "Cùng nhau ta đi lên" do nhạc sĩ Phong Nhã sáng tác năm 1950, được chọn làm bài hát Đội ca chính thức của Đội TNTP Hồ Chí Minh.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 15
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000015',
    'Khăn quàng đỏ của Đội viên Đội TNTP Hồ Chí Minh có hình gì và mang ý nghĩa thiêng liêng nào?',
    '["Hình tam giác cân - một phần lá cờ Tổ quốc, màu đỏ tượng trưng cho lý tưởng cách mạng", "Hình vuông - tượng trưng cho sự đoàn kết các dân tộc", "Hình chữ nhật - tượng trưng cho kỷ luật Đội", "Hình thoi - tượng trưng cho sự vươn lên trong học tập"]'::jsonb,
    15,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000015',
    0,
    'Khăn quàng đỏ có hình tam giác cân màu đỏ, là một phần của cờ Tổ quốc; màu đỏ tượng trưng cho lý tưởng cách mạng và sự cống hiến của thế hệ cha anh.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 16
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000016',
    'Khẩu hiệu hành động của Đội Thiếu niên Tiền phong Hồ Chí Minh là gì?',
    '["\"Vì Tổ quốc xã hội chủ nghĩa, vì lý tưởng của Bác Hồ vĩ đại: Sẵn sàng!\"", "\"Học tập tốt, rèn luyện tốt, ngày mai lập nghiệp!\"", "\"Tiến bước lên Đoàn, xứng danh Cháu ngoan Bác Hồ!\"", "\"Đoàn kết, tự tin, sáng tạo và hội nhập!\""]'::jsonb,
    16,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000016',
    0,
    'Khẩu hiệu truyền thống của Đội là: "Vì Tổ quốc xã hội chủ nghĩa, vì lý tưởng của Bác Hồ vĩ đại: Sẵn sàng!".'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 17
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000017',
    'Bác Hồ đã căn dặn sự nghiệp giáo dục thế hệ tương lai bằng câu nói nổi tiếng nào?',
    '["Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người", "Học để làm việc, làm người, làm cán bộ cách mạng", "Học hành là sự nghiệp cả đời của thanh niên", "Non sông Việt Nam trông cậy vào thanh thiếu nhi"]'::jsonb,
    17,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000017',
    0,
    'Chủ tịch Hồ Chí Minh đã căn dặn: "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người" khẳng định tầm quan trọng đặc biệt của giáo dục.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 18
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000018',
    'Người thiếu niên anh hùng dũng cảm ôm bom cảm tử phá hủy kho đạn Thị Nghè của thực dân Pháp năm 1945 là ai?',
    '["Lê Văn Tám", "Kim Đồng", "Vừ A Dính", "Nguyễn Bá Ngọc"]'::jsonb,
    18,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000018',
    0,
    'Hình tượng thiếu niên anh hùng Lê Văn Tám tự biến mình thành cây đuốc sống thiêu rụi kho đạn Thị Nghè đã trở thành biểu tượng quật cường của thiếu nhi Nam Bộ.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 19
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000019',
    'Chiến dịch lịch sử toàn thắng mang tên Bác đã giải phóng hoàn toàn miền Nam, thống nhất non sông vào ngày tháng năm nào?',
    '["Ngày 30 tháng 4 năm 1975 (Chiến dịch Hồ Chí Minh)", "Ngày 07 tháng 5 năm 1954 (Chiến dịch Điện Biên Phủ)", "Ngày 26 tháng 3 năm 1975", "Ngày 19 tháng 5 năm 1975"]'::jsonb,
    19,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000019',
    0,
    'Đúng 11h30 ngày 30/04/1975, lá cờ cách mạng phấp phới tung bay trên nóc Dinh Độc Lập, đánh dấu Chiến dịch Hồ Chí Minh lịch sử đại thắng, non sông thu về một mối.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 20
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000020',
    'Bác Hồ sinh ngày tháng năm nào và tại quê hương nào?',
    '["19/05/1890 tại Kim Liên, Nam Đàn, Nghệ An", "05/06/1911 tại Bến Nhà Rồng, Sài Gòn", "03/02/1930 tại Hương Cảng, Trung Quốc", "02/09/1945 tại Ba Đình, Hà Nội"]'::jsonb,
    20,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000020',
    0,
    'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Hoàng Trù (quê ngoại) và lớn lên ở làng Sen (xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An).'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 21
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000021',
    'Chiến thắng vang dội đốt cháy tàu Espérance (Hy Vọng) của Pháp trên sông Nhật Tảo (năm 1861) gắn liền với tên tuổi vị Anh hùng dân tộc nào?',
    '["Anh hùng Nguyễn Trung Trực", "Anh hùng Trương Định", "Anh hùng Võ Duy Dương", "Anh hùng Thủ Khoa Huân"]'::jsonb,
    21,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000021',
    0,
    'Anh hùng Nguyễn Trung Trực đã chỉ huy nghĩa quân đốt cháy tàu chiến Espérance trên sông Nhật Tảo ngày 10/12/1861, làm rúng động chính giới thực dân Pháp.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 22
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000022',
    'Trước khi rời Tổ quốc ra đi tìm đường cứu nước, người thanh niên yêu nước Nguyễn Tất Thành đã dạy học tại ngôi trường nào?',
    '["Trường Dục Thanh (Phan Thiết, Bình Thuận)", "Trường Quốc học Huế", "Trường Tiểu học Pháp - Việt Vinh", "Trường Bưởi (Hà Nội)"]'::jsonb,
    22,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000022',
    0,
    'Từ tháng 9/1910 đến tháng 2/1911, thầy giáo Nguyễn Tất Thành đã dạy chữ Hán, chữ Quốc ngữ và thể dục tại Trường Dục Thanh (Phan Thiết) trước khi vào Sài Gòn.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 23
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000023',
    'Điều thứ tư trong "5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng" căn dặn các em điều gì?',
    '["Giữ gìn vệ sinh thật tốt", "Đoàn kết tốt, kỷ luật tốt", "Khiêm tốn, thật thà, dũng cảm", "Học tập tốt, lao động tốt"]'::jsonb,
    23,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000023',
    0,
    'Điều 4 Bác Hồ dạy là: "Giữ gìn vệ sinh thật tốt" - nhắc nhở thiếu nhi giữ gìn vệ sinh thân thể, trường lớp và môi trường sống xanh sạch đẹp.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 24
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000024',
    'Người nữ anh hùng trẻ tuổi quê ở Đất Đỏ (Bà Rịa) kiên cường, hiên ngang trước mũi súng quân thù tại Côn Đảo là ai?',
    '["Chị Võ Thị Sáu", "Chị Nguyễn Thị Minh Khai", "Chị Út Tịch", "Chị Mạc Thị Bưởi"]'::jsonb,
    24,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000024',
    0,
    'Chị Võ Thị Sáu hy sinh kiên cường năm 1952 tại Côn Đảo, là biểu tượng bất khuất của tuổi trẻ Việt Nam để Đội viên Đội TNTP noi gương.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

-- CÂU 25
INSERT INTO public.quiz_questions (id, question, options, sort_order, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000025',
    'Phong trào "Kế hoạch nhỏ" do Đội Thiếu niên Tiền phong Hồ Chí Minh phát động có ý nghĩa giáo dục nào?',
    '["Rèn luyện đức tính tiết kiệm, yêu lao động, bảo vệ môi trường và giúp đỡ bạn khó khăn", "Nâng cao kỹ năng thuyết trình", "Tham gia các hoạt động thể dục thể thao", "Luyện tập đội ngũ nghi thức Đội"]'::jsonb,
    25,
    true
)
ON CONFLICT (id) DO UPDATE SET 
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    sort_order = EXCLUDED.sort_order,
    is_active = true;

INSERT INTO public.quiz_answers (question_id, correct_index, explanation)
VALUES (
    'f0000000-0000-0000-0000-000000000025',
    0,
    'Phong trào "Kế hoạch nhỏ" được khởi xướng từ năm 1958, giáo dục đội viên ý thức tiết kiệm, tinh thần tương thân tương ái và góp phần xây dựng các công trình măng non.'
)
ON CONFLICT (question_id) DO UPDATE SET 
    correct_index = EXCLUDED.correct_index,
    explanation = EXCLUDED.explanation;

COMMIT;

-- ==============================================================================
-- HOÀN TẤT ĐỒNG BỘ 25 CÂU HỎI HỘI THI TRƯỜNG THCS NGUYỄN TRUNG TRỰC VÀO CƠ SỞ DỮ LIỆU!
-- ==============================================================================
