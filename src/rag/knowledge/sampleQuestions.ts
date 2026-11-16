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
  ],
  'DOC-HCM-029': [
    { questionId: 'Q-029-1', question: 'Trong bức thư Trung thu năm 1951, Bác Hồ đã gửi gắm phương châm rèn luyện nào cho các cháu thiếu nhi qua hai câu thơ nổi tiếng?' },
    { questionId: 'Q-029-2', question: 'Câu thơ "Tuổi nhỏ làm việc nhỏ, tùy theo sức của mình" có ý nghĩa giáo dục như thế nào đối với lứa tuổi học sinh THCS?' },
    { questionId: 'Q-029-3', question: 'Trong thư gửi thiếu nhi năm 1952, Bác Hồ căn dặn các cháu thi đua những nội dung gì để mai sau trở thành người chủ nước nhà?' },
    { questionId: 'Q-029-4', question: 'Nỗi niềm và tình cảm của Bác đối với thiếu nhi miền Nam ruột thịt trong dịp Tết Trung thu năm 1960 được thể hiện ra sao?' },
    { questionId: 'Q-029-5', question: 'Đội viên Trường THCS Nguyễn Trung Trực có thể hưởng ứng lời Bác dạy trong thư Trung thu bằng những việc làm thiết thực nào?' }
  ],
  'DOC-HCM-030': [
    { questionId: 'Q-030-1', question: 'Mẩu chuyện "Chiếc vòng bạc" giáo dục bài học đạo đức cốt lõi nào về chữ tín và việc giữ đúng lời hứa?' },
    { questionId: 'Q-030-2', question: 'Cử chỉ của Bác Hồ tặng quả táo cho em bé Pháp năm 1946 biểu thị giá trị nhân văn và thông điệp ngoại giao nhân dân như thế nào?' },
    { questionId: 'Q-030-3', question: 'Vì sao trong câu chuyện "Ai ngoan sẽ được thưởng", bạn Tộ nhận lỗi và không dám nhận kẹo nhưng Bác Hồ vẫn khen ngợi và thưởng kẹo?' },
    { questionId: 'Q-030-4', question: 'Học sinh rút ra bài học gì về đức tính "khiêm tốn, thật thà, dũng cảm" từ những câu chuyện Bác Hồ với thiếu nhi?' },
    { questionId: 'Q-030-5', question: 'Tình cảm và sự ân cần của Bác khi đến thăm trại trẻ Kim Đồng gợi nhắc trách nhiệm gì của cộng đồng đối với trẻ em có hoàn cảnh khó khăn?' }
  ],
  'DOC-HCM-031': [
    { questionId: 'Q-031-1', question: '5 Điều Bác Hồ dạy thiếu niên nhi đồng ra đời trong hoàn cảnh nào và vào năm nào?' },
    { questionId: 'Q-031-2', question: 'Vì sao năm 1965 Bác Hồ lại tự tay bổ sung chữ "thật" vào điều thứ 4: "Giữ gìn vệ sinh thật tốt"?' },
    { questionId: 'Q-031-3', question: 'Đội viên THCS Nguyễn Trung Trực thực hành Điều 1 "Yêu Tổ quốc, yêu đồng bào" và Điều 2 "Học tập tốt, lao động tốt" bằng những hành động cụ thể nào?' },
    { questionId: 'Q-031-4', question: 'Nội dung Điều 3 "Đoàn kết tốt, kỷ luật tốt" giúp ngăn chặn bạo lực học đường và xây dựng tình bạn đẹp ra sao?' },
    { questionId: 'Q-031-5', question: 'Học sinh rèn luyện tính "khiêm tốn, thật thà, dũng cảm" theo Điều 5 như thế nào trong học tập và các kỳ thi?' }
  ],
  'DOC-HCM-032': [
    { questionId: 'Q-032-1', question: 'Hoàn cảnh lịch sử nào dẫn tới việc Chủ tịch Hồ Chí Minh viết "Lời kêu gọi Toàn quốc kháng chiến" ngày 19/12/1946 tại làng Vạn Phúc?' },
    { questionId: 'Q-032-2', question: 'Câu nói bất hủ: "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ" thể hiện ý chí gì của dân tộc?' },
    { questionId: 'Q-032-3', question: 'Đường lối chiến tranh nhân dân toàn dân, toàn diện của Đảng ta được Bác Hồ nêu rõ trong Lời kêu gọi qua những câu văn nào?' },
    { questionId: 'Q-032-4', question: 'Ý nghĩa to lớn của Lời kêu gọi Toàn quốc kháng chiến đối với việc mở đầu thắng lợi của cuộc kháng chiến chống thực dân Pháp?' },
    { questionId: 'Q-032-5', question: 'Thế hệ trẻ học sinh hôm nay tiếp nối tinh thần quật khởi của Toàn quốc kháng chiến 1946 vào công cuộc xây dựng và bảo vệ Tổ quốc ra sao?' }
  ],
  'DOC-HCM-033': [
    { questionId: 'Q-033-1', question: 'Tập thơ "Nhật ký trong tù" của Chủ tịch Hồ Chí Minh được sáng tác trong hoàn cảnh nào và gồm bao nhiêu bài thơ?' },
    { questionId: 'Q-033-2', question: 'Triết lý nhân sinh và bài học rèn luyện ý chí trong bài thơ "Nghe tiếng giã gạo" (Văn thối mễ thanh) là gì?' },
    { questionId: 'Q-033-3', question: 'Bài thơ "Tự khuyên mình" (Tự miễn) dùng hình ảnh ẩn dụ mùa đông giá rét và mùa xuân huy hoàng để khuyên nhủ con người điều gì?' },
    { questionId: 'Q-033-4', question: 'Tinh thần lạc quan cách mạng và phong thái ung dung tự tại của Bác Hồ được khắc họa như thế nào trong bài thơ "Học dịch kinh"?' },
    { questionId: 'Q-033-5', question: 'Học sinh THCS có thể vận dụng tinh thần thép và ý chí vượt khó từ "Nhật ký trong tù" vào việc học tập các môn học khó ra sao?' }
  ],
  'DOC-HCM-034': [
    { questionId: 'Q-034-1', question: 'Truyền thống chúc Tết bằng thơ của Bác Hồ có ý nghĩa tinh thần và văn hóa đặc biệt như thế nào đối với nhân dân ta mỗi độ xuân về?' },
    { questionId: 'Q-034-2', question: 'Bài thơ chúc Tết Xuân Đinh Hợi (1947) – mùa xuân kháng chiến đầu tiên – đã truyền đi thông điệp quyết tâm gì tới đồng bào và chiến sĩ?' },
    { questionId: 'Q-034-3', question: 'Bài thơ chúc Tết Xuân Mậu Thân (1968) có vai trò như thế nào như một hiệu lệnh lịch sử cho cuộc Tổng tiến công và nổi dậy?' },
    { questionId: 'Q-034-4', question: 'Mục tiêu chiến lược cách mạng Việt Nam được Bác Hồ đúc kết trong bài thơ Xuân Kỷ Dậu 1969 qua hai câu thơ nổi tiếng nào?' },
    { questionId: 'Q-034-5', question: 'Những nét độc đáo trong ngôn từ và phong cách thi ca chúc Tết của Chủ tịch Hồ Chí Minh?' }
  ],
  'DOC-HCM-035': [
    { questionId: 'Q-035-1', question: 'Anh hùng dân tộc Nguyễn Trung Trực sinh ra ở đâu và xuất thân trong hoàn cảnh gia đình như thế nào?' },
    { questionId: 'Q-035-2', question: 'Chiến công hỏa công đốt tàu L\'Espérance (tàu Hy Vọng) trên sông Nhật Tảo ngày 10/12/1861 của nghĩa quân Nguyễn Trung Trực diễn ra như thế nào?' },
    { questionId: 'Q-035-3', question: 'Trận tập kích đánh chiếm đồn Rạch Giá đêm 16/6/1868 có ý nghĩa ra sao và câu đối ca ngợi của danh sĩ Huỳnh Mẫn Đạt là gì?' },
    { questionId: 'Q-035-4', question: 'Trước pháp trường giặc Pháp, Nguyễn Trung Trực đã hiên ngang tuyên bố câu nói bất hủ nào khắc ghi muôn đời?' },
    { questionId: 'Q-035-5', question: 'Học sinh Trường THCS Nguyễn Trung Trực tự hào và kế thừa khí phách người anh hùng mang tên trường bằng những việc làm gì?' }
  ],
  'DOC-HCM-036': [
    { questionId: 'Q-036-1', question: 'Di tích lịch sử Khu tưởng niệm Vườn Cau Đỏ tọa lạc tại địa chỉ nào và gắn liền với các vùng đất nào của Quận 12?' },
    { questionId: 'Q-036-2', question: 'Nguồn gốc tên gọi "Vườn Cau Đỏ" bắt nguồn từ đâu và chữ "ĐỎ" mang tầng ý nghĩa thiêng liêng nào đối với lịch sử cách mạng địa phương?' },
    { questionId: 'Q-036-3', question: 'Sự kiện lịch sử thành lập Chiến khu An Phú Đông ngày 25/12/1945 tại Vườn Cau Đỏ có ý nghĩa then chốt như thế nào?' },
    { questionId: 'Q-036-4', question: 'Vai trò "căn cứ lõm" độc đáo của Vườn Cau Đỏ trong việc nuôi giấu bộ đội chuẩn bị bàn đạp cho chiến dịch Mậu Thân 1968 và Chiến dịch Hồ Chí Minh 1975?' },
    { questionId: 'Q-036-5', question: 'Học sinh Trường THCS Nguyễn Trung Trực học tập và phát huy truyền thống cách mạng anh hùng của Vườn Cau Đỏ qua các hoạt động về nguồn nào?' }
  ],
  'DOC-HCM-037': [
    { questionId: 'Q-037-1', question: 'Vì sao người thanh niên Nguyễn Tất Thành quyết định chọn Bến cảng Sài Gòn để ra đi tìm đường cứu nước vào ngày 5/6/1911?' },
    { questionId: 'Q-037-2', question: 'Con tàu buôn và công việc mà người thanh niên mang tên Văn Ba đã nhận khi rời Bến Nhà Rồng là gì?' },
    { questionId: 'Q-037-3', question: 'Tầm nhìn chiến lược vượt thời đại của Nguyễn Tất Thành khác biệt như thế nào so với các bậc tiền bối Đông Du hay Duy Tân?' },
    { questionId: 'Q-037-4', question: 'Hành trình 30 năm bôn ba qua 3 đại dương và 4 châu lục đã giúp Người tìm ra con đường cứu nước đúng đắn nào cho dân tộc?' },
    { questionId: 'Q-037-5', question: 'Ý nghĩa lịch sử và văn hóa thiêng liêng của Bảo tàng Hồ Chí Minh - Bến Nhà Rồng trong lòng nhân dân Thành phố mang tên Bác?' }
  ],
  'DOC-HCM-038': [
    { questionId: 'Q-038-1', question: 'Mục tiêu chiến lược của Đảng bộ TP.HCM trong Nghị quyết Đại hội XI về việc xây dựng Không gian văn hóa Hồ Chí Minh là gì?' },
    { questionId: 'Q-038-2', question: 'Ba trụ cột cấu thành Không gian văn hóa Hồ Chí Minh (vật thể, phi vật thể, không gian số) được định hình ra sao?' },
    { questionId: 'Q-038-3', question: 'Không gian văn hóa phi vật thể hướng tới việc bồi đắp những giá trị chuẩn mực nào cho con người Thành phố Hồ Chí Minh?' },
    { questionId: 'Q-038-4', question: 'Vai trò của chuyển đổi số và công nghệ trí tuệ nhân tạo (AI, RAG, 3D) trong việc xây dựng Không gian văn hóa số học đường?' },
    { questionId: 'Q-038-5', question: 'Trường THCS Nguyễn Trung Trực cụ thể hóa Nghị quyết xây dựng Không gian văn hóa Hồ Chí Minh bằng những mô hình thiết thực nào?' }
  ],
  'DOC-HCM-039': [
    { questionId: 'Q-039-1', question: 'Khái niệm "Trường học hạnh phúc" theo định hướng của Sở GD&ĐT TP.HCM được xây dựng dựa trên 3 giá trị cốt lõi nào?' },
    { questionId: 'Q-039-2', question: 'Mối quan hệ hữu cơ gắn bó giữa việc xây dựng Trường học hạnh phúc và Không gian văn hóa Hồ Chí Minh thể hiện ở điểm nào?' },
    { questionId: 'Q-039-3', question: 'Phong trào "Mỗi ngày một việc tốt theo lời Bác dạy" giúp học sinh rèn luyện nhân cách và xây dựng nề nếp văn minh ra sao?' },
    { questionId: 'Q-039-4', question: 'Thư viện số Bác Hồ và phòng truyền thống ảo đóng góp thế nào vào việc tạo môi trường học tập hạnh phúc, giảm áp lực cho học sinh?' },
    { questionId: 'Q-039-5', question: 'Mỗi học sinh THCS Nguyễn Trung Trực có thể đóng góp những hành động gì để lớp học và trường học của mình thực sự hạnh phúc?' }
  ],
  'DOC-HCM-040': [
    { questionId: 'Q-040-1', question: 'Mục đích và tầm quan trọng của Chỉ thị số 05-CT/TW ngày 15/5/2016 của Bộ Chính trị khóa XII là gì?' },
    { questionId: 'Q-040-2', question: 'Chỉ thị số 05-CT/TW đặt ra những yêu cầu trọng tâm nào đối với công tác giảng dạy và giáo dục đạo đức lối sống trong nhà trường?' },
    { questionId: 'Q-040-3', question: 'Vai trò gương mẫu của đội ngũ cán bộ quản lý và thầy cô giáo trong việc "học tập và làm theo Bác" được nhấn mạnh ra sao?' },
    { questionId: 'Q-040-4', question: 'Học sinh học tập tư tưởng, đạo đức, phong cách Hồ Chí Minh qua những môn học và hoạt động giáo dục cụ thể nào ở trường THCS?' },
    { questionId: 'Q-040-5', question: 'Kế hoạch hành động của Chi bộ và Ban Giám hiệu Trường THCS Nguyễn Trung Trực nhằm đưa Chỉ thị 05-CT/TW đi vào thực chất?' }
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
