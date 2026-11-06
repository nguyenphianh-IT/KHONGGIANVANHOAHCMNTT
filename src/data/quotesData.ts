export interface UncleHoQuote {
  id: number;
  quote: string;
  context: string;
  year?: string;
  category: string;
  lesson: string;
}

export const UNCLE_HO_QUOTES: UncleHoQuote[] = [
  {
    id: 1,
    quote: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.',
    context: 'Bài nói chuyện tại Lớp hướng dẫn giáo viên cấp II, cấp III toàn miền Bắc',
    year: '1958',
    category: 'Giáo dục & Sự nghiệp trồng người',
    lesson: 'Nhắc nhở thầy và trò Trường THCS Nguyễn Trung Trực về sứ mệnh trường tồn của giáo dục, bồi đắp con người toàn diện cả tài lẫn đức.',
  },
  {
    id: 2,
    quote: 'Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em.',
    context: 'Thư gửi học sinh nhân ngày khai trường đầu tiên của nước Việt Nam Dân chủ Cộng hòa',
    year: '1945',
    category: 'Trách nhiệm non sông',
    lesson: 'Động lực thi đua học tập, bồi dưỡng hoài bão lớn lao cho mỗi học sinh tự tin bước vào kỷ nguyên hội nhập và số hóa.',
  },
  {
    id: 3,
    quote: 'Không có việc gì khó, chỉ sợ lòng không bền. Đào núi và lấp biển, quyết chí ắt làm nên.',
    context: 'Tặng Đội Thanh niên xung phong tại Nà Tu, Cẩm Giàng, Bạch Thông, Bắc Kạn',
    year: '1951',
    category: 'Rèn luyện ý chí & Nghị lực',
    lesson: 'Lời khuyên quý báu về tinh thần kiên trì, không nản lòng trước bài toán khó hay thử thách của cuộc sống.',
  },
  {
    id: 4,
    quote: 'Học để làm việc, làm người, làm cán bộ. Học để phụng sự Đoàn thể, phụng sự giai cấp và nhân dân, phụng sự Tổ quốc và nhân loại.',
    context: 'Huấn thị tại Lễ khai giảng Trường Nguyễn Ái Quốc khóa II',
    year: '1949',
    category: 'Lý tưởng học tập',
    lesson: 'Định hướng mục đích cao cả của tri thức là cống hiến cho gia đình, nhà trường, quê hương Thới An và đất nước.',
  },
  {
    id: 5,
    quote: 'Trẻ em như búp trên cành, biết ăn ngủ, biết học hành là ngoan.',
    context: 'Bài thơ "Trẻ con" đăng trên Báo Việt Nam Độc lập',
    year: '1941',
    category: 'Yêu thương thiếu nhi',
    lesson: 'Tình cảm ấm áp và kỳ vọng của Bác, nhắc nhở các em thiếu niên chăm ngoan, giữ gìn nề nếp, vâng lời thầy cô và cha mẹ.',
  },
  {
    id: 6,
    quote: 'Thầy cũng như trò, cán bộ cũng như nhân viên, phải thật thà yêu nghề của mình... Dạy cũng như học phải biết chú trọng cả tài lẫn đức. Đức là đạo đức cách mạng, đó là cái gốc, rất là quan trọng.',
    context: 'Bài nói chuyện tại Hội nghị cán bộ giáo dục toàn miền Bắc',
    year: '1957',
    category: 'Tu dưỡng đạo đức',
    lesson: 'Đạo đức là cái gốc nền tảng; tài năng và tri thức phải luôn song hành cùng lòng trung thực, nhân ái và trách nhiệm.',
  },
  {
    id: 7,
    quote: 'Một năm khởi đầu từ mùa xuân. Một đời khởi đầu từ tuổi trẻ. Tuổi trẻ là mùa xuân của xã hội.',
    context: 'Thư gửi thanh niên và nhi đồng toàn quốc nhân dịp Tết Bính Tuất',
    year: '1946',
    category: 'Khát vọng tuổi trẻ',
    lesson: 'Lứa tuổi học trò là mùa xuân tươi đẹp nhất của đời người, hãy sống trọn vẹn với nhiệt huyết, tri thức và tình bạn trong sáng.',
  },
  {
    id: 8,
    quote: 'Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.',
    context: 'Bài phát biểu tại Đại hội đại biểu Mặt trận Tổ quốc Việt Nam lần thứ II',
    year: '1961',
    category: 'Sức mạnh đoàn kết',
    lesson: 'Đoàn kết tạo nên sức mạnh vô địch; tập thể lớp gắn bó, thầy trò đồng lòng cùng xây dựng trường học hạnh phúc.',
  },
  {
    id: 9,
    quote: 'Đường đời là một chiếc thang không nấc chót, việc học là một quyển sách không có trang cuối cùng.',
    context: 'Lời căn dặn của Bác về tinh thần tự học và học tập suốt đời',
    year: '1954',
    category: 'Học tập suốt đời',
    lesson: 'Khơi gợi niềm đam mê đọc sách, chủ động nghiên cứu và làm chủ công nghệ mới trong kỷ nguyên số hóa.',
  },
  {
    id: 10,
    quote: 'Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước.',
    context: 'Căn dặn cán bộ, chiến sĩ Đại đoàn Quân Tiên Phong tại Đền Hùng, Phú Thọ',
    year: '1954',
    category: 'Lòng yêu nước & Tự hào dân tộc',
    lesson: 'Ghi nhớ công lao của các bậc tiền nhân, nuôi dưỡng lòng yêu nước và trách nhiệm gìn giữ non sông Việt Nam.',
  },
];
