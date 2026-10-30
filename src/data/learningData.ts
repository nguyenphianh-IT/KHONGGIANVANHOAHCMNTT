import { LearningTopic, QuizQuestion } from '../types';

export const learningTopics: LearningTopic[] = [
  {
    id: 'topic-1',
    title: '5 Điều Bác Hồ Dạy Thiếu Niên, Nhi Đồng',
    subtitle: 'Kim chỉ nam rèn đức, luyện tài cho mọi học sinh',
    targetAudience: 'Toàn thể học sinh THCS Nguyễn Trung Trực',
    coreMessage: 'Yêu Tổ quốc, yêu đồng bào - Học tập tốt, lao động tốt - Đoàn kết tốt, kỷ luật tốt - Giữ gìn vệ sinh thật tốt - Khiêm tốn, thật thà, dũng cảm.',
    quote: '"Các cháu hãy cố gắng thi đua học tập và rèn luyện, xứng đáng là cháu ngoan Bác Hồ."',
    iconName: 'Award',
    content: [
      'Điều 1: Yêu Tổ quốc, yêu đồng bào - Thể hiện qua lòng tự hào về lịch sử quê hương, yêu quý gia đình, thầy cô, bạn bè và tinh thần tương thân tương ái.',
      'Điều 2: Học tập tốt, lao động tốt - Chăm chỉ, chủ động tìm tòi kiến thức; không ngại tham gia lao động công ích, dọn dẹp vệ sinh trường lớp, giúp đỡ cha mẹ việc nhà.',
      'Điều 3: Đoàn kết tốt, kỷ luật tốt - Chan hòa, tương trợ bạn bè cùng tiến bộ; chấp hành nghiêm nội quy nhà trường, pháp luật và trật tự an toàn giao thông.',
      'Điều 4: Giữ gìn vệ sinh thật tốt - Rèn luyện nếp sống văn minh, giữ gìn thân thể sạch sẽ, bảo vệ môi trường học đường xanh - sạch - đẹp, không xả rác bừa bãi.',
      'Điều 5: Khiêm tốn, thật thà, dũng cảm - Luôn giữ sự trung thực trong kiểm tra, dũng cảm nhận lỗi khi làm sai, không kiêu căng, biết lắng nghe và tôn trọng mọi người.'
    ],
    actionAdvice: [
      'Thuộc lòng và đối chiếu từng hành động mỗi ngày với 5 điều Bác dạy.',
      'Chủ động phát biểu bài và giúp đỡ bạn cùng tiến trong học tập.',
      'Giữ gìn bàn ghế sạch đẹp, phân loại rác tại nguồn ở lớp học.'
    ]
  },
  {
    id: 'topic-2',
    title: 'Tinh Thần Tự Học Và Tình Yêu Đọc Sách',
    subtitle: 'Học ở trường, học trong sách vở, học lẫn nhau và học nhân dân',
    targetAudience: 'Học sinh các khối 6, 7, 8, 9',
    coreMessage: 'Chủ tịch Hồ Chí Minh là tấm gương sáng ngời về tinh thần tự học suốt đời, biết nhiều thứ tiếng và có vốn kiến thức uyên bác.',
    quote: '"Đường đời là một chiếc thang không có nấc chót; học tập là một quyển vở không có trang cuối cùng."',
    iconName: 'BookOpen',
    content: [
      'Bác Hồ tự học ngoại ngữ trong hoàn cảnh vô cùng gian khổ: khi làm phụ bếp trên tàu biển, ban ngày làm việc vất vả, đêm về Bác ghi từ mới vào cánh tay để vừa làm vừa học.',
      'Bác học mọi lúc mọi nơi: học từ sách báo, từ đồng nghiệp, từ đời sống thực tiễn và phong trào công nhân thế giới.',
      'Bác luôn nhắc nhở: "Học để làm việc, làm người, làm cán bộ. Học để phụng sự Đoàn thể, giai cấp và nhân dân, Tổ quốc và nhân loại".'
    ],
    actionAdvice: [
      'Dành ít nhất 30 - 45 phút mỗi ngày để đọc sách tại Tủ sách Bác Hồ của thư viện trường.',
      'Lập sổ tay ghi chép từ vựng mới, những câu nói truyền cảm hứng và bài học rút ra.',
      'Hạn chế lướt mạng vô bổ, tận dụng internet để tra cứu tài liệu học tập bổ ích.'
    ]
  },
  {
    id: 'topic-3',
    title: 'Lối Sống Giản Dị, Tiết Kiệm & Đức Khiêm Tốn',
    subtitle: 'Cần kiệm liêm chính, chí công vô tư bắt đầu từ việc nhỏ',
    targetAudience: 'Đội viên Đội Thiếu niên Tiền phong Hồ Chí Minh',
    coreMessage: 'Dù ở cương vị Chủ tịch nước, Bác Hồ vẫn sống trong ngôi nhà sàn mộc mạc, bữa ăn đạm bạc, áo vải vá vai và đôi dép cao su.',
    quote: '"Cơm ăn một bát, áo mặc một tấm, sự nghiệp giản dị nhưng tấm lòng rộng mở như đại dương."',
    iconName: 'HeartHandshake',
    content: [
      'Tiết kiệm của Bác không phải là bủn xỉn, mà là quý trọng mồ hôi nước mắt của nhân dân, không lãng phí dù chỉ một hạt gạo, một mẩu giấy, một giọt nước.',
      'Bác luôn khiêm tốn: "Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành".',
      'Lối sống giản dị giúp tâm hồn thanh thản, gần gũi với bạn bè và mọi người xung quanh.'
    ],
    actionAdvice: [
      'Tắt đèn, quạt điện và vòi nước trước khi rời khỏi lớp học.',
      'Ăn hết khẩu phần cơm, không bỏ thừa lãng phí đồ ăn.',
      'Chi tiêu tiền tiết kiệm hợp lý, không đòi hỏi đua đòi theo mốt.'
    ]
  },
  {
    id: 'topic-4',
    title: 'Tình Yêu Quê Hương, Đất Nước & Biển Đảo',
    subtitle: 'Biết ơn thế hệ đi trước và tự hào là người con Việt Nam',
    targetAudience: 'Tuổi trẻ phường Thới An & THCS Nguyễn Trung Trực',
    coreMessage: 'Noi gương Anh hùng dân tộc Nguyễn Trung Trực và Bác Hồ kính yêu, tuổi trẻ hôm nay ra sức rèn đức luyện tài bảo vệ giang sơn.',
    quote: '"Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước."',
    iconName: 'Compass',
    content: [
      'Trường THCS Nguyễn Trung Trực tự hào mang tên người anh hùng kiên trung với câu nói bất hủ: "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".',
      'Thế hệ học sinh hôm nay thể hiện lòng yêu nước bằng việc học giỏi, bảo vệ môi trường, tôn trọng di tích lịch sử - văn hóa tại địa phương.',
      'Hiểu rõ chủ quyền biển đảo thiêng liêng Hoàng Sa, Trường Sa và tích cực lan tỏa thông điệp hòa bình, hữu nghị.'
    ],
    actionAdvice: [
      'Tìm hiểu về tiểu sử Anh hùng Nguyễn Trung Trực và lịch sử Đảng bộ phường Thới An.',
      'Tham gia đầy đủ các buổi sinh hoạt truyền thống, lễ chào cờ đầu tuần trang nghiêm.',
      'Tích cực giới thiệu những nét đẹp của trường và địa phương đến bạn bè gần xa.'
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Chủ tịch Hồ Chí Minh rời Bến cảng Nhà Rồng ra đi tìm đường cứu nước vào ngày tháng năm nào?',
    options: [
      'Ngày 19 tháng 5 năm 1890',
      'Ngày 05 tháng 6 năm 1911',
      'Ngày 03 tháng 2 năm 1930',
      'Ngày 02 tháng 9 năm 1945'
    ],
    correctIndex: 1,
    explanation: 'Chính xác! Ngày 05/06/1911, người thanh niên yêu nước Nguyễn Tất Thành với tên Văn Ba đã bước lên con tàu Amiral Latouche-Tréville rời Bến Nhà Rồng (Sài Gòn) bắt đầu hành trình cứu nước cứu dân suốt 30 năm.'
  },
  {
    id: 2,
    question: 'Trong bức thư gửi học sinh nhân ngày khai trường đầu tiên (9/1945), Bác Hồ viết: "Non sông Việt Nam có trở nên tươi đẹp hay không... chính là nhờ một phần lớn ở công..." gì của các em?',
    options: [
      'Lao động sản xuất',
      'Học tập',
      'Rèn luyện thể thao',
      'Tiết kiệm chi tiêu'
    ],
    correctIndex: 1,
    explanation: 'Chính xác! Bác căn dặn: "...dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em."'
  },
  {
    id: 3,
    question: 'Điều thứ năm trong "5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng" là gì?',
    options: [
      'Đoàn kết tốt, kỷ luật tốt',
      'Giữ gìn vệ sinh thật tốt',
      'Khiêm tốn, thật thà, dũng cảm',
      'Học tập tốt, lao động tốt'
    ],
    correctIndex: 2,
    explanation: 'Chính xác! Điều thứ năm là: "Khiêm tốn, thật thà, dũng cảm" - nhắc nhở các em học sinh luôn giữ tấm lòng trong sáng, không dối trá và dũng cảm nhận khuyết điểm.'
  },
  {
    id: 4,
    question: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa tại đâu?',
    options: [
      'Quảng trường Ba Đình (Hà Nội)',
      'Bến cảng Nhà Rồng (Sài Gòn)',
      'Chiến khu Tân Trào (Tuyên Quang)',
      'Hang Pác Bó (Cao Bằng)'
    ],
    correctIndex: 0,
    explanation: 'Chính xác! Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Bác đã đọc bản Tuyên ngôn Độc lập, mở ra kỷ nguyên độc lập tự do cho Tổ quốc.'
  },
  {
    id: 5,
    question: 'Trường THCS của chúng ta vinh dự mang tên vị anh hùng dân tộc nào gắn liền với chiến công đốt cháy tàu Espérance (Hy Vọng) của thực dân Pháp?',
    options: [
      'Anh hùng Lý Tự Trọng',
      'Anh hùng Nguyễn Trung Trực',
      'Anh hùng Võ Thị Sáu',
      'Anh hùng Kim Đồng'
    ],
    correctIndex: 1,
    explanation: 'Chính xác! Ngôi trường THCS Nguyễn Trung Trực (phường Thới An) vinh dự mang tên người anh hùng kiên trung với câu nói bất hủ: "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".'
  }
];

export const dailyPractices = [
  {
    id: 'p-1',
    title: 'Nói lời hay, làm việc tốt',
    desc: 'Lễ phép chào hỏi thầy cô, người lớn tuổi, nhường nhịn và hòa đồng với bạn bè.',
    tag: 'Đạo đức'
  },
  {
    id: 'p-2',
    title: 'Trung thực trong học tập',
    desc: 'Tự giác làm bài tập về nhà, không quay cóp trong giờ kiểm tra và thi cử.',
    tag: 'Kỷ luật'
  },
  {
    id: 'p-3',
    title: 'Bảo vệ không gian xanh',
    desc: 'Không vứt rác bừa bãi trong sân trường, chăm sóc bồn hoa cây cảnh của lớp.',
    tag: 'Môi trường'
  },
  {
    id: 'p-4',
    title: 'Tiết kiệm tài nguyên',
    desc: 'Tắt đèn, quạt khi ra khỏi phòng học; khóa vòi nước sau khi rửa tay.',
    tag: 'Ý thức'
  }
];
