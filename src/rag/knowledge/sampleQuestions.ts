/**
 * Sample Pedagogical Questions for Knowledge Documents (ADR-002 Staging CMS)
 * Powers the Review Readiness Inspection Modal for Evaluators & Teachers.
 */

export interface SampleQuestion {
  questionId: string;
  question: string;
  expectedEvidence?: string;
}

export const SAMPLE_QUESTIONS_MAP: Record<string, SampleQuestion[]> = {
  'DOC-HCM-016': [
    { questionId: 'Q-016-1', question: 'Quê hương và hoàn cảnh gia đình của cậu bé Nguyễn Sinh Cung (Chủ tịch Hồ Chí Minh) thời niên thiếu như thế nào?' },
    { questionId: 'Q-016-2', question: 'Những yếu tố truyền thống quê hương và lịch sử nào đã sớm hun đúc tinh thần yêu nước của Nguyễn Tất Thành?' },
    { questionId: 'Q-016-3', question: 'Vì sao Người thanh niên Nguyễn Tất Thành quyết định sang phương Tây tìm đường cứu nước vào ngày 5/6/1911?' },
    { questionId: 'Q-016-4', question: 'Những hoạt động và đóng góp tiêu biểu của Nguyễn Ái Quốc trên trường quốc tế trong giai đoạn 1919–1924 là gì?' },
    { questionId: 'Q-016-5', question: 'Nguyễn Ái Quốc đã có những đóng góp quyết định nào tại Quảng Châu giai đoạn 1925–1927 để chuẩn bị cho việc thành lập Đảng?' }
  ],
  'DOC-HCM-017': [
    { questionId: 'Q-017-1', question: 'Những hoạt động nổi bật của đồng chí Nguyễn Ái Quốc giai đoạn 1930–1941 ở nước ngoài?' },
    { questionId: 'Q-017-2', question: 'Sự kiện ngày 28/01/1941 tại Pác Bó (Cao Bằng) có ý nghĩa bước ngoặt như thế nào đối với phong trào cách mạng Việt Nam?' },
    { questionId: 'Q-017-3', question: 'Ý nghĩa của việc thành lập Mặt trận Việt Minh tại Hội nghị Trung ương 8 (tháng 5/1941) dưới sự chủ tọa của Nguyễn Ái Quốc?' },
    { questionId: 'Q-017-4', question: 'Quá trình chuẩn bị vũ trang và lực lượng chính trị dẫn tới Tổng khởi nghĩa Tháng Tám năm 1945 ghi nhận những dấu mốc then chốt nào?' },
    { questionId: 'Q-017-5', question: 'Các dấu mốc lịch sử đưa đến sự kiện Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập ngày 2/9/1945?' }
  ],
  'DOC-HCM-018': [
    { questionId: 'Q-018-1', question: 'Tác phẩm "Đường Kách mệnh" của đồng chí Nguyễn Ái Quốc được xuất bản vào năm nào và trong bối cảnh lịch sử nào?' },
    { questionId: 'Q-018-2', question: 'Trong tác phẩm "Đường Kách mệnh", Bác Hồ nêu rõ mục đích của cuốn sách để nói cho đồng bào biết những điều gì?' },
    { questionId: 'Q-018-3', question: 'Về "Tư cách một người kách mệnh", tác phẩm "Đường Kách mệnh" đề ra những chuẩn mực "Tự mình phải" như thế nào?' },
    { questionId: 'Q-018-4', question: 'Nguyễn Ái Quốc đã giải thích mối quan hệ giữa Đảng tiền phong và phong trào cách mạng của nhân chúng bằng hình ảnh ẩn dụ nào?' },
    { questionId: 'Q-018-5', question: 'Học sinh THCS có thể liên hệ và rèn luyện theo những phẩm chất nào trong chương "Tư cách một người kách mệnh"?' }
  ],
  'DOC-HCM-019': [
    { questionId: 'Q-019-1', question: 'Hội nghị thành lập Đảng Cộng sản Việt Nam diễn ra vào thời gian nào, ở đâu và do ai chủ trì?' },
    { questionId: 'Q-019-2', question: 'Hội nghị thành lập Đảng đã thông qua những văn kiện lịch sử chủ yếu nào tạo thành Cương lĩnh chính trị đầu tiên?' },
    { questionId: 'Q-019-3', question: 'Bản "Chánh cương vắn tắt của Đảng" năm 1930 xác định phương hướng chiến lược và nhiệm vụ chính trị của cách mạng Việt Nam là gì?' },
    { questionId: 'Q-019-4', question: 'Bản "Sách lược vắn tắt của Đảng" đề ra đường lối tập hợp lực lượng cách mạng và chính sách liên minh giai cấp như thế nào?' },
    { questionId: 'Q-019-5', question: 'Ý nghĩa lịch sử to lớn của việc thành lập Đảng Cộng sản Việt Nam vào mùa Xuân năm 1930 đối với vận mệnh dân tộc?' }
  ],
  'DOC-HCM-020': [
    { questionId: 'Q-020-1', question: 'Chủ tịch Hồ Chí Minh giải thích khái niệm chữ "Cần" trong loạt bài báo năm 1949 như thế nào?' },
    { questionId: 'Q-020-2', question: 'Theo Bác Hồ, "Kiệm" khác với tính keo kiệt, bủn xỉn ở những điểm cốt lõi nào?' },
    { questionId: 'Q-020-3', question: 'Đức tính "Liêm" được Chủ tịch Hồ Chí Minh biểu thị qua những hành vi cụ thể nào của người cán bộ và công dân?' },
    { questionId: 'Q-020-4', question: 'Chữ "Chính" được Bác Hồ chỉ rõ qua ba mối quan hệ: đối với mình, đối với người và đối với việc như thế nào?' },
    { questionId: 'Q-020-5', question: 'Học sinh Trường THCS Nguyễn Trung Trực có thể thực hành bốn đức tính Cần, Kiệm, Liêm, Chính trong cuộc sống hàng ngày ra sao?' }
  ],
  'DOC-HCM-021': [
    { questionId: 'Q-021-1', question: 'Lời kêu gọi thi đua ái quốc của Chủ tịch Hồ Chí Minh được viết vào ngày nào và đăng trên báo nào?' },
    { questionId: 'Q-021-2', question: 'Trong Lời kêu gọi thi đua ái quốc, Bác Hồ nêu ba mục đích cốt lõi của phong trào thi đua là gì?' },
    { questionId: 'Q-021-3', question: 'Phương châm hành động và phương pháp thực hiện thi đua ái quốc được Bác Hồ chỉ ra như thế nào?' },
    { questionId: 'Q-021-4', question: 'Ý nghĩa của câu khẩu hiệu kết luận nổi tiếng trong Lời kêu gọi: "Thi đua là yêu nước, yêu nước thì phải thi đua"?' },
    { questionId: 'Q-021-5', question: 'Học sinh THCS có thể hưởng ứng phong trào thi đua ái quốc qua những phong trào học đường cụ thể nào?' }
  ],
  'DOC-HCM-022': [
    { questionId: 'Q-022-1', question: 'Tác phẩm "Đạo đức cách mạng" của Chủ tịch Hồ Chí Minh được đăng lần đầu tiên vào thời điểm nào, trên tạp chí nào và dưới bút danh gì?' },
    { questionId: 'Q-022-2', question: 'Chủ tịch Hồ Chí Minh dùng những hình tượng thiên nhiên nào để khẳng định vai trò của đạo đức cách mạng đối với người cách mạng?' },
    { questionId: 'Q-022-3', question: 'Nội dung cốt lõi và bản chất của "Đạo đức cách mạng" theo Bác Hồ được định nghĩa như thế nào?' },
    { questionId: 'Q-022-4', question: 'Vì sao Chủ tịch Hồ Chí Minh khẳng định việc xây dựng CNXH không thể tách rời cuộc đấu tranh trừ bỏ chủ nghĩa cá nhân?' },
    { questionId: 'Q-022-5', question: 'Bác Hồ chỉ dẫn phương pháp rèn luyện đạo đức như thế nào qua câu nói nổi tiếng "ngọc càng mài càng sáng, vàng càng luyện càng trong"? Học sinh THCS liên hệ việc rèn luyện bản thân ra sao?' }
  ],
  'DOC-HCM-026': [
    { questionId: 'Q-026-1', question: 'Theo Quyết định số 1195/QĐ-UB-NC ngày 18/03/1997 của UBND TP.HCM, phường Thới An cũ được thành lập trên cơ sở diện tích và dân số của xã nào?' },
    { questionId: 'Q-026-2', question: 'Theo Nghị quyết số 1685/NQ-UBTVQH15 ngày 16/06/2025 của Ủy ban Thường vụ Quốc hội, Phường Thới An hiện nay được hình thành từ những đơn vị nào?' },
    { questionId: 'Q-026-3', question: 'Vì sao không được dùng danh xưng "Quận 12" như đơn vị hành chính hiện tại khi nói về Phường Thới An sau ngày 01/07/2025?' },
    { questionId: 'Q-026-4', question: 'Khi lập bảng đối chiếu lịch sử địa giới, quy tắc bảo tồn tính chân thực văn bản cũ đòi hỏi người nghiên cứu phải làm gì?' },
    { questionId: 'Q-026-5', question: 'Học sinh cần nắm rõ địa chỉ hành chính chính thức của nhà trường hiện nay để ghi vào giấy tờ, hồ sơ học tập như thế nào?' }
  ],
  'DOC-HCM-027': [
    { questionId: 'Q-027-1', question: 'Trường THCS Nguyễn Trung Trực được thành lập theo quyết định pháp lý nào và bắt đầu hoạt động giảng dạy từ năm học nào?' },
    { questionId: 'Q-027-2', question: 'Quyết định số 76/QĐ-UBND ngày 01/07/2025 của UBND Phường Thới An có ý nghĩa gì đối với vị thế pháp lý của nhà trường?' },
    { questionId: 'Q-027-3', question: 'Vì sao cần khẳng định Quyết định năm 2025 là sự kiện kế thừa liên tục, không phải chấm dứt hoạt động của ngôi trường thành lập năm 2014?' },
    { questionId: 'Q-027-4', question: 'Mô hình Không gian Văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực được kết hợp giữa không gian vật lý và không gian số như thế nào?' },
    { questionId: 'Q-027-5', question: 'Câu nói bất hủ "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây" của Anh hùng Nguyễn Trung Trực nhắc nhở học sinh điều gì?' }
  ],
  'DOC-HCM-028': [
    { questionId: 'Q-028-1', question: 'Sự kiện Lễ Thành hầu Nguyễn Hữu Cảnh vào kinh lược phương Nam năm 1698 có ý nghĩa bước ngoặt lịch sử như thế nào?' },
    { questionId: 'Q-028-2', question: 'Thương cảng Bến Nghé - Sài Gòn đã hình thành và phát triển sầm uất ra sao trong thế kỷ XVIII và đầu thế kỷ XIX theo Gia Định thành thông chí?' },
    { questionId: 'Q-028-3', question: 'Cộng đồng các dân tộc (Việt, Hoa, Khmer, Chăm...) đã đóng góp như thế nào vào diện mạo văn hóa đa dạng của Sài Gòn - Gia Định?' },
    { questionId: 'Q-028-4', question: 'Vai trò chiến lược quân sự và kinh tế của Gia Định Thành đối với vương triều Nguyễn được thể hiện qua các công trình nào?' },
    { questionId: 'Q-028-5', question: 'Tác phẩm "Gia Định thành thông chí" của Trịnh Hoài Đức có giá trị học thuật và tư liệu như thế nào đối với lịch sử Nam Bộ?' }
  ]
};

export const getSampleQuestionsForDoc = (docId: string): SampleQuestion[] => {
  return SAMPLE_QUESTIONS_MAP[docId] || [
    { questionId: `${docId}-1`, question: `Ý nghĩa lịch sử và nội dung cốt lõi của tài liệu ${docId} là gì?` },
    { questionId: `${docId}-2`, question: `Những luận điểm chính được Chủ tịch Hồ Chí Minh hoặc tài liệu nêu ra là gì?` },
    { questionId: `${docId}-3`, question: `Bối cảnh lịch sử ra đời và tính cấp thiết của văn kiện đối với cách mạng Việt Nam?` },
    { questionId: `${docId}-4`, question: `Bài học kinh nghiệm thực tiễn và giá trị tư tưởng của tài liệu đối với hiện nay?` },
    { questionId: `${docId}-5`, question: `Học sinh và giáo viên Trường THCS Nguyễn Trung Trực có thể vận dụng tài liệu này vào học tập ra sao?` }
  ];
};
