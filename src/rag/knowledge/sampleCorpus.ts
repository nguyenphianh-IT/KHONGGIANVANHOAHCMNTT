/**
 * ADR-002 Phase 04: Real Knowledge Base Corpus (Controlled Pilot)
 * Project: Hệ thống Không gian Văn hóa Hồ Chí Minh - Trường THCS Nguyễn Trung Trực
 *
 * Fully populated across 8 Standard Categories (HCM_STANDARD_CATEGORIES):
 * 1. bio-career: Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp
 * 2. ideology-ethics: Tư tưởng, đạo đức, phong cách Hồ Chí Minh
 * 3. teachings-children: Những lời dạy của Bác đối với thiếu nhi
 * 4. cultural-heritage: Di sản văn hóa Hồ Chí Minh
 * 5. hcm-cultural-space: Không gian văn hóa Hồ Chí Minh TP.HCM
 * 6. hcmc-history: Lịch sử Thành phố Hồ Chí Minh (và Thới An - Quận 12)
 * 7. school-education: Hoạt động giáo dục và học tập tại nhà trường
 * 8. official-dispatches: Tài liệu chính thức của cơ quan quản lý
 *
 * Source criteria:
 * - High authenticity historical documents, official editions, and verified school archives.
 * - Clear governance status: APPROVED vs PENDING_REVIEW.
 * - Explicit topic taxonomy and provenance metadata.
 */

import { KnowledgeDocument } from '../types/ragTypes';

export const SAMPLE_HCM_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'DOC-HCM-001',
    title: 'Toàn văn Tuyên ngôn Độc lập ngày 2/9/1945',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Lưu trữ Văn kiện Đảng & Bảo tàng Lịch sử Quốc gia',
    dateOrEra: '02/09/1945',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Tuyên ngôn độc lập', 'Ba Đình', '1945', 'Quyền con người', 'Chủ quyền dân tộc'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh soạn thảo tại căn nhà số 48 phố Hàng Ngang (Hà Nội) và đọc trước quốc dân đồng bào tại Quảng trường Ba Đình ngày 2 tháng 9 năm 1945.

"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc". Lời bất hủ ấy ở trong bản Tuyên ngôn Độc lập năm 1776 của nước Mỹ. Suy rộng ra, câu ấy có ý nghĩa là: tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.

Bản Tuyên ngôn Nhân quyền và Dân quyền của Cách mạng Pháp năm 1791 cũng nói: "Người ta sinh ra tự do và bình đẳng về quyền lợi; và phải luôn luôn được tự do và bình đẳng về quyền lợi". Đó là những lẽ phải không ai chối cãi được.

Chủ tịch Hồ Chí Minh khẳng định ý chí sắt đá của toàn thể dân tộc: "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy".`,
    metadata: {
      volume: 'Hồ Chí Minh Toàn tập - Tập 4',
      historicalSignificance: 'Khai sinh nước Việt Nam Dân chủ Cộng hòa',
      location: 'Quảng trường Ba Đình, Hà Nội'
    }
  },

  {
    id: 'DOC-HCM-002',
    title: 'Di chúc của Chủ tịch Hồ Chí Minh (Bản công bố chính thức)',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Ban Chấp hành Trung ương Đảng công bố',
    dateOrEra: '1965 - 1969',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Di chúc', 'Đoàn kết', 'Thế hệ trẻ', 'Vừa hồng vừa chuyên', 'Đạo đức cách mạng'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Bản Di chúc lịch sử được Bác Hồ khởi thảo từ tháng 5/1965 và tiếp tục bổ sung, chỉnh sửa vào các dịp tháng 5 hàng năm cho đến tháng 5/1969.

VỀ ĐOÀN KẾT:
"Đoàn kết là một truyền thống cực kỳ báu vật của Đảng và của dân ta. Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình. Trong Đảng phải thực hành dân chủ rộng rãi, thường xuyên và nghiêm chỉnh tự phê bình và phê bình là cách tốt nhất để củng cố và phát triển sự đoàn kết và thống nhất của Đảng".

VỀ ĐOÀN VIÊN VÀ THANH NIÊN:
"Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái xung phong, không ngại hy sinh gian khổ, có chí tiến thủ. Đảng cần phải chăm lo giáo dục đạo đức cách mạng cho họ, đào tạo họ thành những người thừa kế xây dựng chủ nghĩa xã hội vừa 'hồng' vừa 'chuyên'. Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết".

ĐIỀU MONG MUỐN CUỐI CÙNG:
"Điều mong muốn cuối cùng của tôi là: Toàn Đảng, toàn dân ta đoàn kết phấn đấu, xây dựng một nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ và giàu mạnh, và góp phần xứng đáng vào sự nghiệp cách mạng thế giới".`,
    metadata: {
      classification: 'Bảo vật Quốc gia số 01',
      reviewBoard: 'Viện Lịch sử Đảng & Hội đồng Khoa học Bảo tàng HCM'
    }
  },

  {
    id: 'DOC-HCM-003',
    title: 'Thư gửi các học sinh nhân ngày khai trường đầu tiên của nước Việt Nam Dân chủ Cộng hòa',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Báo Cứu Quốc số 34 & Hồ Chí Minh Toàn tập Tập 4',
    dateOrEra: 'Tháng 9/1945',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Thư khai trường', 'Học sinh', 'Sánh vai cường quốc', 'Trách nhiệm học tập', 'Giáo dục THCS'],
    sourceUrl: 'https://moet.gov.vn',
    content: `Bức thư Chủ tịch Hồ Chí Minh gửi các em học sinh trên toàn quốc nhân ngày khai trường đầu tiên của nước Việt Nam độc lập vào tháng 9 năm 1945.

Bác viết: "Hôm nay là ngày khai trường đầu tiên ở nước Việt Nam Dân chủ Cộng hòa. Tôi đã tưởng tượng thấy trước mắt cái cảnh nhộn nhịp tưng bừng của ngày tựu trường ở khắp các nơi. Các em hết thảy đều vui vẻ vì sau một cuộc chuyển biến biến đổi lớn lao, các em bắt đầu được nhận một nền giáo dục hoàn toàn Việt Nam".

Lời căn dặn thiêng liêng đối với thế hệ tương lai:
"Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em. Ngày hôm nay, các em được hưởng sự may mắn hơn cha anh là được hấp thụ một nền giáo dục của một nước độc lập, một nền giáo dục nó rèn luyện các em nên những người công dân hữu ích cho nước Việt Nam, một nền giáo dục làm phát triển hoàn toàn những năng lực sẵn có của các em".`,
    metadata: {
      schoolSignificance: 'Kim chỉ nam giáo dục học sinh trường THCS Nguyễn Trung Trực',
      publicationDate: '05/09/1945'
    }
  },

  {
    id: 'DOC-HCM-004',
    title: 'Năm Điều Bác Hồ dạy Thiếu niên, Nhi đồng (Nguồn gốc & Nội dung chuẩn)',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Trung ương Đoàn TNCS Hồ Chí Minh & Bảo tàng Hồ Chí Minh xác thực',
    dateOrEra: '1961 - 1965',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['5 Điều Bác Hồ dạy', 'Thiếu nhi', 'Kỷ luật', 'Đoàn kết', 'Khiêm tốn', 'Dũng cảm'],
    sourceUrl: 'https://doanthanhnien.vn',
    content: `Năm Điều Bác Hồ dạy thiếu niên, nhi đồng là bài học vỡ lòng và kim chỉ nam rèn luyện của mọi thế hệ học sinh Việt Nam.

Năm 1961, nhân dịp kỷ niệm 20 năm Ngày thành lập Đội Thiếu niên Tiền phong Việt Nam (15/5/1941 - 15/5/1961), Bác Hồ đã gửi thư căn dặn thiếu niên nhi đồng cả nước 5 điều:
1. Yêu Tổ quốc, yêu đồng bào.
2. Học tập tốt, lao động tốt.
3. Đoàn kết tốt, kỷ luật tốt.
4. Giữ gìn vệ sinh.
5. Khiêm tốn, thật thà, dũng cảm.

Đến năm 1965, để chuẩn bị kỷ niệm 25 năm ngày thành lập Đội (15/5/1966), Bác Hồ tự tay bổ sung chữ "thật" vào điều thứ tư thành: "Giữ gìn vệ sinh thật tốt", để câu đối xứng và nhấn mạnh ý thức rèn luyện nếp sống văn minh, sạch sẽ của học sinh.

Nội dung 5 Điều Bác dạy hiện nay được toàn thể đội viên, học sinh Trường THCS Nguyễn Trung Trực thực hiện hàng ngày trong học tập, lao động, quan hệ bạn bè và sinh hoạt gia đình.`,
    metadata: {
      standardEdition: 'Ban hành chính thức bởi Hội đồng Đội Trung ương',
      coreAudience: 'Học sinh Tiểu học & THCS'
    }
  },

  {
    id: 'DOC-HCM-005',
    title: 'Bài viết "Dân vận" đăng trên Báo Sự Thật ngày 15/10/1949',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Bút danh X.Y.Z (Chủ tịch Hồ Chí Minh) - Báo Sự Thật số 120',
    dateOrEra: '15/10/1949',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Dân vận', 'Đoàn kết nhân dân', 'Cán bộ', 'Dân vận khéo', '1949'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Bài báo "Dân vận" của Bác Hồ đăng trên báo Sự Thật số 120, ngày 15 tháng 10 năm 1949 với bút danh X.Y.Z là tác phẩm mẫu mực về công tác vận động quần chúng.

Bác đặt câu hỏi: "Vấn đề Dân vận là gì?" và trả lời: "Dân vận là vận động tất cả lực lượng của mỗi một người dân không để sót một người dân nào, góp thành lực lượng toàn dân, để thực hành những công việc nên làm, những công việc Chính phủ và Đoàn thể đã giao cho".

Bác chỉ rõ phương pháp dân vận:
"Những người phụ trách dân vận cần phải óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm. Chứ không phải chỉ nói suông, chỉ ngồi viết mệnh lệnh. Họ phải thật thà nhúng tay vào việc".

Kết luận bất hủ của bài báo:
"Lực lượng của dân rất to. Việc dân vận rất quan trọng. Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công".`,
    metadata: {
      volume: 'Hồ Chí Minh Toàn tập - Tập 6',
      penName: 'X.Y.Z'
    }
  },

  {
    id: 'DOC-HCM-006',
    title: 'Tác phẩm "Sửa đổi lối làm việc" (10/1947) - Về Đạo đức Cách mạng',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Bút danh Tân Sinh (Chủ tịch Hồ Chí Minh) - NXB Sự Thật',
    dateOrEra: 'Tháng 10/1947',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Sửa đổi lối làm việc', 'Cần kiệm liêm chính', 'Chí công vô tư', 'Đạo đức cách mạng'],
    sourceUrl: 'https://nxbctqg.org.vn',
    content: `Tác phẩm "Sửa đổi lối làm việc" viết vào tháng 10/1947 tại chiến khu Việt Bắc, ký bút danh Tân Sinh, là cẩm nang giáo dục cán bộ, đảng viên và thế hệ trẻ về phương pháp công tác và phẩm chất đạo đức.

Về tư cách người cách mạng:
Phải thực hiện 5 điều căn bản: Nhân, Nghĩa, Trí, Dũng, Liêm.
- "Cần": Siêng năng, chăm chỉ, cố gắng dẻo dai.
- "Kiệm": Tiết kiệm thời giờ, công sức, tiền bạc của dân, của nước, không xa xỉ lãng phí.
- "Liêm": Trong sạch, không tham lam, không hám địa vị danh lợi.
- "Chính": Ngay thẳng, đứng đắn, việc đúng thì làm, việc sai thì kiên quyết tránh.
- "Chí công vô tư": Đem lòng chí công vô tư mà đối với người, với việc; đặt lợi ích chung lên trên lợi ích riêng.

Bác căn dặn: "Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân".`,
    metadata: {
      volume: 'Hồ Chí Minh Toàn tập - Tập 5',
      penName: 'Tân Sinh'
    }
  },

  {
    id: 'DOC-HCM-007',
    title: 'Tập thơ "Nhật ký trong tù" (Ngục trung nhật ký) - Bài học ý chí và lạc quan',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Viện Văn học & NXB Văn học',
    dateOrEra: '1942 - 1943',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nhật ký trong tù', 'Thơ Bác Hồ', 'Ý chí nghị lực', 'Lạc quan cách mạng'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Tập thơ gồm 133 bài thơ chữ Hán được Bác sáng tác trong suốt 14 tháng bị chính quyền Tưởng Giới Thạch giam giữ trái phép tại gần 30 nhà lao thuộc tỉnh Quảng Tây (Trung Quốc) từ tháng 8/1942 đến tháng 9/1943.

Bài thơ mở đầu (Đề từ):
"Thân thể ở trong lao,
Tinh thần ở ngoài lao;
Muốn nên sự nghiệp lớn,
Tinh thần càng phải cao".

Bài thơ "Tự khuyên mình":
"Ví không có cảnh đông tàn,
Thì đâu có cảnh huy hoàng ngày xuân;
Nghĩ mình trong bước gian truân,
Tai ương rèn luyện tinh thần thêm hăng".

Bài thơ "Không ngủ được":
"Một canh... hai canh... lại ba canh,
Trằn trọc băn khoăn, giấc chẳng thành;
Canh bốn, canh năm vừa chợp mắt,
Sao vàng năm cánh mộng hồn quanh".

Tác phẩm phản ánh tinh thần tự do bất khuất, phong thái ung dung tự tại giữa ngục tù tăm tối, là bài học lớn về rèn luyện ý chí vượt khó cho học sinh THCS.`,
    metadata: {
      poemCount: 133,
      originalLanguage: 'Chữ Hán'
    }
  },

  {
    id: 'DOC-HCM-008',
    title: 'Lời kêu gọi Toàn quốc kháng chiến (19/12/1946)',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Đài Tiếng nói Việt Nam phát thanh đêm 19/12/1946',
    dateOrEra: '19/12/1946',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Toàn quốc kháng chiến', 'Vạn Phúc', '1946', 'Độc lập dân tộc', 'Ý chí quyết tử'],
    sourceUrl: 'https://vov.vn',
    content: `Đêm ngày 19 tháng 12 năm 1946, tại làng Vạn Phúc (Hà Đông, nay thuộc Hà Nội), Chủ tịch Hồ Chí Minh đã ra Lời kêu gọi Toàn quốc kháng chiến:

"Hỡi đồng bào toàn quốc!
Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới, vì chúng quyết tâm cướp nước ta lần nữa!
Không! Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ.

Hỡi đồng bào!
Chúng ta phải đứng lên!
Bất kỳ đàn ông, đàn bà, bất kỳ người già, người trẻ, không chia tôn giáo, đảng phái, dân tộc. Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp để cứu Tổ quốc. Ai có súng dùng súng. Ai có gươm dùng gươm, không có gươm thì dùng cuốc, thuổng, gậy gộc. Ai cũng phải ra sức chống thực dân Pháp cứu nước...
Dù phải gian lao kháng chiến, nhưng với một lòng kiên quyết hy sinh, thắng lợi nhất định về dân tộc ta!".`,
    metadata: {
      location: 'Làng Vạn Phúc, Hà Đông',
      historicEvent: 'Mở đầu Kháng chiến chống Pháp toàn quốc'
    }
  },

  {
    id: 'DOC-HCM-010',
    title: 'Tiểu sử Chủ tịch Hồ Chí Minh: Thời niên thiếu và Dấu mốc lịch sử Bến Nhà Rồng năm 1911',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Viện Lịch sử Đảng - Học viện Chính trị Quốc gia Hồ Chí Minh',
    dateOrEra: '1890 - 1911',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Tiểu sử Bác Hồ', 'Nguyễn Sinh Cung', 'Nguyễn Tất Thành', 'Kim Liên', 'Bến Nhà Rồng', '1911'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Chủ tịch Hồ Chí Minh (lúc nhỏ tên là Nguyễn Sinh Cung, đi học lấy tên là Nguyễn Tất Thành) sinh ngày 19 tháng 5 năm 1890 tại quê ngoại làng Hoàng Trù (Chùa), quê nội làng Kim Liên (Sen), huyện Nam Đàn, tỉnh Nghệ An.

Thân phụ là cụ Phó bảng Nguyễn Sinh Sắc, thân mẫu là bà Hoàng Thị Loan. Từ thuở nhỏ, Nguyễn Tất Thành đã chứng kiến nỗi thống khổ của nhân dân dưới ách thực dân phong kiến và sớm nung nấu lòng yêu nước thương dân sâu sắc.

Ngày 5 tháng 6 năm 1911, từ Bến Cảng Nhà Rồng (Sài Gòn - nay là TP. Hồ Chí Minh), trên con tàu buôn Đô đốc Latouche-Tréville, người thanh niên yêu nước Nguyễn Tất Thành với tên gọi Văn Ba đã rời Tổ quốc ra đi tìm con đường cứu nước, cứu dân. Trải qua 30 năm bôn ba qua nhiều châu lục, Người đã tìm thấy chân lý cứu nước và lãnh đạo cách mạng Việt Nam đi đến thắng lợi lịch sử.`,
    metadata: {
      birthDate: '19/05/1890',
      departureDate: '05/06/1911',
      departurePort: 'Bến Nhà Rồng, Sài Gòn'
    }
  },

  {
    id: 'DOC-HCM-011',
    title: 'Truyền thống Lịch sử Anh hùng Dân tộc Nguyễn Trung Trực và Vùng đất Thới An - Quận 12',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'Ban Giám hiệu & Tổ Lịch sử Trường THCS Nguyễn Trung Trực',
    dateOrEra: '1838 - 1868 & Hiện nay',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nguyễn Trung Trực', 'Trường THCS Nguyễn Trung Trực', 'Bảo bối tinh thần', 'Khởi nghĩa kháng Pháp', 'Thới An', 'Quận 12'],
    sourceUrl: 'https://thcsnguyentrungtruc.hcm.edu.vn',
    content: `Trường THCS Nguyễn Trung Trực tọa lạc tại phường Thới An, Quận 12, TP. Hồ Chí Minh - vùng đất giàu truyền thống cách mạng Chiến khu An Phú Đông oanh liệt.

Ngôi trường tự hào mang tên người anh hùng nghĩa quân Nam Bộ kiên cường bất khuất trong cuộc kháng chiến chống thực dân Pháp:
Anh hùng Nguyễn Trung Trực (1838 - 1868) nổi tiếng với hai chiến công vang dội:
1. Đốt cháy tàu chiến Hy Vọng (Espérance) của thực dân Pháp trên sông Nhật Tảo ngày 10/12/1861.
2. Đánh úp đồn Rạch Giá ngày 16/6/1868 tiêu diệt tên chủ tỉnh và binh lính thực dân.

Khi bị giặc bắt và hành quyết ngày 27/10/1868 tại chợ Rạch Giá, ông đã hiên ngang tuyên bố câu nói bất hủ:
"Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây!".

Noi gương tinh thần yêu nước quật cường của Anh hùng Nguyễn Trung Trực và lời dạy của Bác Hồ kính yêu, các thế hệ thầy và trò Trường THCS Nguyễn Trung Trực luôn nỗ lực thi đua Dạy tốt - Học tốt, xây dựng môi trường học đường văn minh, kỷ cương và nhân ái.`,
    metadata: {
      heroBirthYear: 1838,
      heroDeathYear: 1868,
      schoolLocation: 'Phường Thới An, Quận 12, TP.HCM'
    }
  },

  {
    id: 'DOC-HCM-012',
    title: 'Đề án Xây dựng Không gian Văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực',
    category: 'hcm-cultural-space',
    categoryLabel: 'Không gian văn hóa Hồ Chí Minh TP.HCM',
    authorOrSource: 'Chi bộ & Ban Chỉ đạo Không gian Văn hóa HCM - THCS Nguyễn Trung Trực',
    dateOrEra: '2025 - 2026',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Không gian Văn hóa HCM', 'Trường học số', 'Thư viện mở', 'Chuyển đổi số', 'Trải nghiệm trực quan'],
    sourceUrl: 'https://thcsnguyentrungtruc.hcm.edu.vn',
    content: `Thực hiện Nghị quyết Đại hội Đảng bộ TP. Hồ Chí Minh về xây dựng Không gian Văn hóa Hồ Chí Minh, Trường THCS Nguyễn Trung Trực triển khai mô hình kết hợp hài hòa giữa Không gian vật lý học đường và Không gian số tương tác (Digital Cultural Space).

1. KHÔNG GIAN VẬT LÝ HỌC ĐƯỜNG:
- Khu trưng bày tượng Bác và triển lãm ảnh tư liệu về cuộc đời hoạt động cách mạng của Bác Hồ.
- Tủ sách Bác Hồ tại Thư viện trường với hàng trăm đầu sách quý, truyện tranh lịch sử, tác phẩm văn học phù hợp lứa tuổi thiếu niên.
- Góc rèn luyện "5 Điều Bác Hồ dạy" tại từng chi đội lớp học.

2. KHÔNG GIAN VĂN HÓA SỐ (RAG KNOWLEDGE PLATFORM):
- Xây dựng kho tư liệu số hóa có thẩm định, lưu trữ văn kiện, audio, hình ảnh và câu chuyện kể về Bác.
- Tích hợp Trợ lý AI hỏi đáp tư liệu (RAG Chatbot) giúp học sinh và giáo viên tra cứu tài liệu học tập một cách trực quan, chuẩn xác, có trích dẫn nguồn gốc lịch sử rõ ràng.
- Tổ chức các hội thi trực tuyến tìm hiểu lịch sử, kể chuyện Bác Hồ và rèn luyện đạo đức học sinh.`,
    metadata: {
      programCode: 'KG-HCM-NTT-2026',
      approvalYear: 2026
    }
  },

  {
    id: 'DOC-HCM-013',
    title: 'Kế hoạch số 48/KH-THCSNTT về Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    category: 'school-education',
    categoryLabel: 'Hoạt động giáo dục và học tập tại nhà trường',
    authorOrSource: 'Hiệu trưởng & Chi bộ Trường THCS Nguyễn Trung Trực ban hành',
    dateOrEra: 'Năm học 2025 - 2026',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Kế hoạch 48', 'Chỉ thị 05', 'Học tập Bác Hồ', 'Chi bộ nhà trường', 'Giáo viên', 'Học sinh'],
    sourceUrl: 'https://thcsnguyentrungtruc.hcm.edu.vn',
    content: `Kế hoạch số 48/KH-THCSNTT của Trường THCS Nguyễn Trung Trực về việc tiếp tục đẩy mạnh học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh trong năm học 2025 - 2026.

MỤC TIÊU TRỌNG TÂM:
1. Đưa việc học tập và làm theo gương Bác thành nền nếp thường xuyên trong mọi hoạt động sư phạm, giảng dạy và rèn luyện của cán bộ, giáo viên, nhân viên và học sinh toàn trường.
2. Đổi mới phương pháp dạy học các môn Lịch sử, Ngữ văn, Giáo dục công dân (GDCD) gắn liền với các câu chuyện thực tế về tấm gương đạo đức Bác Hồ.
3. Ứng dụng công nghệ thông tin và chuyển đổi số trong quản lý, chia sẻ tài liệu học tập tư tưởng Hồ Chí Minh.

TIÊU CHÍ ĐÁNH GIÁ HỌC SINH:
- Thực hiện nghiêm túc 5 Điều Bác Hồ dạy bằng việc làm cụ thể: trung thực trong thi cử, lễ phép với thầy cô, hòa đồng giúp đỡ bạn bè, bảo vệ môi trường trường học xanh - sạch - đẹp.`,
    metadata: {
      dispatchNumber: '48/KH-THCSNTT',
      signDate: '15/09/2025',
      signer: 'Hiệu trưởng Trường THCS Nguyễn Trung Trực'
    }
  },

  {
    id: 'DOC-HCM-014',
    title: 'Phong cách ứng xử và lối sống giản dị của Chủ tịch Hồ Chí Minh: Đôi dép cao su và Chiếc áo nâu sờn',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Bảo tàng Hồ Chí Minh - Chuyện kể về Bác Hồ',
    dateOrEra: '1947 - 1969',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Lối sống giản dị', 'Đôi dép cao su', 'Áo nâu sờn', 'Phong cách Hồ Chí Minh', 'Gần dân'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Phong cách sống giản dị, khiêm tốn của Bác Hồ là bài học đạo đức cao đẹp và sâu sắc nhất cho các thế hệ học sinh.

CHUYỆN VỀ ĐÔI DÉP CAO SU:
Đôi dép của Bác được làm từ lốp ô tô quân sự của thực dân Pháp bị quân ta phục kích tại chiến khu Việt Bắc năm 1947. Đôi dép ấy đã theo chân Bác đi khắp mọi miền đất nước, từ chiến dịch Biên giới năm 1950 đến những chuyến thăm đồng ruộng, công trường, nhà máy và cả trong các chuyến công du ngoại giao quốc tế.
Khi dép mòn, các đồng chí phục vụ xin Bác đổi dép mới, Bác cười bảo: "Dép còn dùng được, chỉ cần đóng quai lại là đi tốt. Nước ta còn nghèo, đồng bào ta còn vất vả, Bác đi đôi dép này vừa nhẹ, vừa tiện".

BỮA ĂN VÀ CHIẾC ÁO NÂU:
Bữa ăn hàng ngày của Bác đạm bạc với những món ăn dân dã quê hương như cá kho nghệ, canh cua rau đay, quả cà muối. Bác không bao giờ để thừa một hạt cơm, ăn xong tự tay sắp xếp bát đĩa gọn gàng.
Chiếc áo nâu sờn vá vai hay chiếc quạt mo cau những trưa hè oi ả chứng minh một vĩ nhân thế giới luôn giữ trọn tấm lòng trong sáng, đồng cam cộng khổ cùng nhân dân.`,
    metadata: {
      theme: 'Tấm gương đạo đức và lối sống Bác Hồ',
      targetAudience: 'Học sinh phổ thông'
    }
  },

  {
    id: 'DOC-HCM-015',
    title: 'Hướng dẫn Đẩy mạnh Xây dựng Không gian Văn hóa Hồ Chí Minh trong ngành Giáo dục và Đào tạo',
    category: 'official-dispatches',
    categoryLabel: 'Tài liệu chính thức của cơ quan quản lý',
    authorOrSource: 'Sở Giáo dục và Đào tạo TP. Hồ Chí Minh',
    dateOrEra: '2024 - 2025',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Hướng dẫn sở GDĐT', 'Không gian văn hóa Hồ Chí Minh', 'Học đường', 'Nghị quyết Thành ủy'],
    sourceUrl: 'https://hcm.edu.vn',
    content: `Văn bản hướng dẫn của Sở Giáo dục và Đào tạo TP. Hồ Chí Minh về việc triển khai xây dựng Không gian Văn hóa Hồ Chí Minh trong các cơ sở giáo dục trên toàn địa bàn Thành phố.

YÊU CẦU ĐỐI VỚI CÁC TRƯỜNG THCS:
1. Xây dựng không gian văn hóa phù hợp với đặc thù tâm lý lứa tuổi học sinh trung học cơ sở, tránh hình thức, phô trương, lãng phí.
2. Tích hợp giáo dục truyền thống lịch sử, lý tưởng cách mạng thông qua các hoạt động trải nghiệm, tiết sinh hoạt dưới cờ, câu lạc bộ văn hóa - nghệ thuật.
3. Đẩy mạnh số hóa tài liệu, xây dựng thư viện điện tử và ứng dụng chuyển đổi số nhằm tạo điều kiện cho học sinh tiếp cận tư liệu về Bác Hồ mọi lúc, mọi nơi.`,
    metadata: {
      officialDispatchNo: '114/HD-SGDĐT',
      issuingAuthority: 'Sở Giáo dục và Đào tạo TP. Hồ Chí Minh'
    }
  },

  {
    id: 'DOC-HCM-016',
    title: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1 (1890–1929)',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Viện Lịch sử Đảng - Học viện Chính trị Quốc gia Hồ Chí Minh (NXB Sự thật)',
    dateOrEra: '1890 - 1929',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Biên niên tiểu sử', 'Nguyễn Sinh Cung', 'Nguyễn Tất Thành', 'Nguyễn Ái Quốc', 'Bến Nhà Rồng', 'Đại hội Tours', 'Hội VN Cách mạng Thanh niên'],
    sourceUrl: 'https://hochiminh.vn/book/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh/ho-chi-minh-bien-nien-tieu-su-tap-1-19-5-1890-1929-21',
    content: `Hồ sơ thư mục và trích yếu mốc niên biểu lịch sử giai đoạn 1890 - 1929:
- 19/05/1890: Cậu bé Nguyễn Sinh Cung cất tiếng khóc chào đời tại quê ngoại làng Hoàng Trù (xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An). Thân phụ là cụ Phó bảng Nguyễn Sinh Sắc, thân mẫu là bà Hoàng Thị Loan.
- 05/06/1911: Người thanh niên Nguyễn Tất Thành với tên Văn Ba bước lên con tàu Đô đốc Latouche-Tréville tại Bến cảng Nhà Rồng (Sài Gòn), bắt đầu cuộc trường chinh tìm đường cứu nước.
- 18/06/1919: Thay mặt Hội những người Việt Nam yêu nước tại Pháp, Nguyễn Ái Quốc gửi bản "Yêu sách của nhân dân An Nam" 8 điểm tới Hội nghị Versailles.
- Tháng 12/1920: Tại Đại hội XVIII Đảng Xã hội Pháp ở Tours, Nguyễn Ái Quốc bỏ phiếu tán thành gia nhập Quốc tế III và sáng lập Đảng Cộng sản Pháp.
- Tháng 6/1925: Sáng lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu (Trung Quốc), ra báo Thanh Niên (21/6/1925) và xuất bản Đường Kách mệnh (1927).
(Ghi chú: Bản quyền chuyên khảo thuộc NXB Chính trị quốc gia Sự thật. Lưu trữ chế độ METADATA_ONLY, chờ phê duyệt độc lập).`,
    metadata: {
      copyrightStatus: 'METADATA_ONLY',
      volume: 'Tập 1 (1890 - 1929)',
      isbn: '978-604-57-2384-5',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-017',
    title: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 2 (1930–9/1945)',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Viện Lịch sử Đảng - Học viện Chính trị Quốc gia Hồ Chí Minh (NXB Sự thật)',
    dateOrEra: '1930 - 9/1945',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Biên niên tiểu sử', 'Thành lập Đảng', 'Hội nghị Trung ương 8', 'Pác Bó 1941', 'Mặt trận Việt Minh', 'Cách mạng Tháng Tám', 'Tuyên ngôn Độc lập'],
    sourceUrl: 'https://hochiminh.vn/book/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh/ho-chi-minh-bien-nien-tieu-su-tap-2-1930-9-1945-22',
    content: `Hồ sơ thư mục và trích yếu mốc niên biểu lịch sử giai đoạn 1930 - tháng 9/1945:
- 06/01 - 07/02/1930: Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất các tổ chức cộng sản tại Cửu Long (Hương Cảng, Trung Quốc), thành lập Đảng Cộng sản Việt Nam và thông qua Chánh cương vắn tắt, Sách lược vắn tắt.
- 28/01/1941: Sau 30 năm bôn ba, Người vượt qua mốc 108 biên giới Việt - Trung về đến Pác Bó (Trường Hà, Hà Quảng, Cao Bằng), trực tiếp lãnh đạo cách mạng Việt Nam.
- 10 - 19/05/1941: Chủ trì Hội nghị Trung ương 8 tại lán Khuổi Nặm, quyết định đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và thành lập Mặt trận Việt Minh (19/5/1941).
- 22/12/1944: Chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân tại nguyên quán Cao Bằng.
- Tháng 8/1945: Lãnh đạo Tổng khởi nghĩa giành chính quyền thắng lợi trong toàn quốc.
- 02/09/1945: Đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.
(Ghi chú: Bản quyền chuyên khảo thuộc NXB Chính trị quốc gia Sự thật. Lưu trữ chế độ METADATA_ONLY, chờ phê duyệt độc lập).`,
    metadata: {
      copyrightStatus: 'METADATA_ONLY',
      volume: 'Tập 2 (1930 - 9/1945)',
      isbn: '978-604-57-2385-2',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-018',
    title: 'Đường Kách mệnh (1927)',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Lãnh tụ Nguyễn Ái Quốc (Bảo vật Quốc gia số 1)',
    dateOrEra: '1927',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Đường Kách mệnh', 'Tư cách người cách mệnh', 'Quảng Châu', 'Lý luận và thực tiễn', 'Đoàn kết', 'Bảo vật Quốc gia'],
    sourceUrl: 'https://hochiminh.vn/tac-pham-cua-ho-chi-minh',
    content: `Tác phẩm Đường Kách mệnh xuất bản năm 1927 tại Quảng Châu, là cẩm nang chính trị nền tảng chuẩn bị cho việc thành lập Đảng.
1. Tư cách một người cách mệnh:
- Tự mình phải: Cần kiệm. Hòa mà không tư. Cả quyết sửa lỗi mình. Cẩn thận mà không nhút nhát. Hay hỏi. Nhẫn nại. Vị công vong tư. Không hiếu danh, không kiêu ngạo. Nói thì phải làm. Giữ chủ nghĩa cho vững. Hy sinh. Ít lòng tham muốn về vật chất. Giữ bí mật.
- Đối người phải: Với từng người thì khoan thứ. Với đoàn thể thì nghiêm. Có lòng bày vẽ cho người. Trực mà không táo bạo. Đặng xem xét người.
- Làm việc phải: Xem xét hoàn cảnh kỹ càng. Quyết đoán. Dũng cảm. Phục tùng đoàn thể.
2. Vai trò của lý luận tiền phong: "Cách mệnh trước hết phải có đảng cách mệnh, để trong thì vận động và tổ chức dân chúng, ngoài thì liên lạc với dân tộc bị áp bức và vô sản giai cấp mọi nơi. Đảng có vững cách mệnh mới thành công, cũng như người cầm lái có vững thuyền mới chạy".`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      nationalTreasureNo: 1,
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-019',
    title: 'Các văn kiện thành lập Đảng năm 1930',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Đồng chí Nguyễn Ái Quốc chủ trì Hội nghị thành lập Đảng',
    dateOrEra: '03/02/1930',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Chánh cương vắn tắt', 'Sách lược vắn tắt', 'Chương trình tóm tắt', 'Điều lệ vắn tắt', 'Hương Cảng 1930', 'Cương lĩnh chính trị đầu tiên'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Các văn kiện được Hội nghị hợp nhất thông qua (từ 06/01 đến 07/02/1930 tại Cửu Long, Hương Cảng):
1. Chánh cương vắn tắt của Đảng: Chủ trương làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản. Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến, làm cho nước Nam hoàn toàn độc lập.
2. Sách lược vắn tắt của Đảng: Đảng là đội tiên phong của vô sản giai cấp; phải thu phục cho được đại bộ phận giai cấp mình, lôi kéo nông dân và liên lạc với tiểu tư sản, trí thức, trung nông.
3. Chương trình tóm tắt & Điều lệ vắn tắt của Đảng: Xác định mục tiêu giải phóng dân tộc, quyền tự do dân chủ và nguyên tắc tổ chức của Đảng tiên phong.
4. Lời kêu gọi nhân dịp thành lập Đảng: Hiệu triệu công nhân, nông dân, binh lính, thanh niên, học sinh đoàn kết dưới ngọn cờ của Đảng.`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      subDocumentsCount: 5,
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-020',
    title: 'Cần, Kiệm, Liêm, Chính (1949)',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh (Bút danh Lê Quyết Thắng - Báo Cứu Quốc)',
    dateOrEra: 'Tháng 5 - 6/1949',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Cần', 'Kiệm', 'Liêm', 'Chính', 'Chí công vô tư', 'Lê Quyết Thắng', 'Đạo đức công dân', 'Bốn mùa của trời'],
    sourceUrl: 'https://hochiminh.vn/upload/3000001/20251024/65e0340736cc411805ab4818604f62f1HO_CHI_MINH_TOAN_TAP_-_TAP_6.pdf',
    content: `Tác phẩm gồm 4 bài báo xuất bản trên Báo Cứu Quốc từ ngày 30/5 đến 02/06/1949 dưới bút danh Lê Quyết Thắng:
"Trời có bốn mùa: Xuân, Hạ, Thu, Đông.
Đất có bốn phương: Đông, Tây, Nam, Bắc.
Người có bốn đức: Cần, Kiệm, Liêm, Chính.
Thiếu một mùa, thì không thành trời.
Thiếu một phương, thì không thành đất.
Thiếu một đức, thì không thành người".
- Cần: Siêng năng, chăm chỉ, cố gắng dẻo dai. Lao động có kế hoạch, có sáng kiến, có năng suất cao.
- Kiệm: Tiết kiệm thì giờ, tiền của, công sức của dân và của nước. Tiết kiệm không phải là bủn xỉn, keo kiệt.
- Liêm: Trong sạch, không tham lam địa vị, tiền tài. Không lấy của công làm của tư.
- Chính: Thẳng thắn, đứng đắn. Việc thiện dù nhỏ mấy cũng làm, việc ác dù nhỏ mấy cũng tránh.
Bốn đức tính gắn bó mật thiết tạo nên nền tảng đạo đức cách mạng của người cán bộ và công dân.`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      pseudonym: 'Lê Quyết Thắng',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-021',
    title: 'Lời kêu gọi thi đua ái quốc (11/6/1948)',
    category: 'school-education',
    categoryLabel: 'Giáo dục truyền thống & Thi đua ái quốc học đường',
    authorOrSource: 'Chủ tịch Hồ Chí Minh (Báo Cứu Quốc số 968)',
    dateOrEra: '11/06/1948',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Thi đua ái quốc', 'Diệt giặc đói', 'Diệt giặc dốt', 'Diệt giặc ngoại xâm', 'Người người thi đua', 'Thi đua là yêu nước'],
    sourceUrl: 'https://hochiminh.vn',
    content: `Ngày 11 tháng 6 năm 1948, Chủ tịch Hồ Chí Minh ra Lời kêu gọi thi đua ái quốc để động viên toàn thể dân tộc vượt qua muôn vàn gian khổ:
1. Mục đích thi đua: "Diệt giặc đói, diệt giặc dốt, diệt giặc ngoại xâm".
2. Cách làm: Dựa vào lực lượng của dân, tinh thần của dân để gây hạnh phúc cho dân.
3. Đối tượng: Bất kỳ ai - già, trẻ, gái, trai, giàu, nghèo, quân, dân - ai nấy đều thi đua làm tròn bổn phận của mình.
4. Khẩu hiệu bất hủ: "Thi đua là yêu nước, yêu nước thì phải thi đua. Và những người thi đua là những người yêu nước nhất".
Đối với học đường: Thầy thi đua dạy tốt, trò thi đua học tốt, rèn luyện chăm chỉ để mai sau kiến thiết nước nhà.`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      newspaperNo: '968',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-022',
    title: 'Đạo đức cách mạng (1958)',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh (Bút danh Trần Lực - Tạp chí Học tập số 12/1958)',
    dateOrEra: 'Tháng 12/1958',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Đạo đức cách mạng', 'Chống chủ nghĩa cá nhân', 'Trần Lực', 'Tạp chí Học tập', 'Ngọc càng mài càng sáng', 'Đặt lợi ích nhân dân lên trên hết'],
    sourceUrl: 'https://hochiminh.vn/tac-pham-cua-ho-chi-minh/nang-cao-dao-duc-cach-mang-quet-sach-chu-nghia-ca-nhan-7748',
    content: `Tác phẩm đăng trên Tạp chí Học tập số 12/1958 dưới bút danh Trần Lực:
1. Vị trí nền tảng của đạo đức: "Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân. Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo".
2. Bản chất đạo đức cách mạng: Quyết tâm suốt đời đấu tranh cho Đảng, cho cách mạng; đặt lợi ích của Đảng và của nhân dân lao động lên trên, lên trước lợi ích riêng của cá nhân mình.
3. Chống chủ nghĩa cá nhân: Chủ nghĩa cá nhân là thứ vi trùng rất độc, đẻ ra hàng trăm thứ bệnh hư hỏng (khoe khoang, tham ô, lười biếng, độc đoán). Xây dựng CNXH không thể tách rời cuộc đấu tranh trừ bỏ chủ nghĩa cá nhân.
4. Phương pháp rèn luyện: "Đạo đức cách mạng không phải trên trời sa xuống. Nó do đấu tranh, rèn luyện bền bỉ hàng ngày mà phát triển và củng cố. Cũng như ngọc càng mài càng sáng, vàng càng luyện càng trong".`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      journalNo: '12/1958',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-023',
    title: 'Bản Yêu sách của nhân dân An Nam gửi Hội nghị Versailles (18/6/1919)',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Nguyễn Ái Quốc (thay mặt Nhóm những người Việt Nam yêu nước tại Pháp)',
    dateOrEra: '18/06/1919',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Yêu sách nhân dân An Nam', 'Versailles', '1919', 'Nguyễn Ái Quốc', 'Quyền tự do dân chủ', 'Hội nghị hòa bình'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Ngày 18 tháng 6 năm 1919, nhân dịp các nước thắng trận trong Thế chiến thứ nhất họp Hội nghị hòa bình tại Cung điện Versailles (Pháp), thay mặt "Nhóm những người Việt Nam yêu nước" tại Pháp, đồng chí Nguyễn Ái Quốc đã gửi tới Hội nghị bản "Yêu sách của nhân dân An Nam" (Revendications du peuple annamite).

Bản Yêu sách gồm 8 điểm đòi quyền tự do, bình đẳng và dân chủ cơ bản:
1. Tổng ân xá cho tất cả những người bản xứ bị tù đày chính trị.
2. Cải cách nền tư pháp ở Đông Dương bằng cách cho người bản xứ được quyền hưởng những bảo đảm tư pháp như người châu Âu; xóa bỏ các tòa án đặc biệt.
3. Tự do báo chí và tự do ngôn luận.
4. Tự do lập hội và hội họp.
5. Tự do cư trú và xuất dương.
6. Tự do học tập, mở các trường kỹ thuật và chuyên nghiệp cho người bản xứ ở các tỉnh.
7. Thay thế chế độ cai trị bằng các sắc lệnh bằng chế độ ra các đạo luật.
8. Có đoàn đại biểu thường trực của người bản xứ do chính người bản xứ bầu ra tại Nghị viện Pháp để phản ánh nguyện vọng địa phương.

Ý nghĩa lịch sử: Đây là lần đầu tiên tên gọi Nguyễn Ái Quốc xuất hiện công khai trên vũ đài chính trị quốc tế, tạo tiếng vang chấn động dư luận Pháp và các thuộc địa, mở đầu thời kỳ đấu tranh chính trị trực diện của dân tộc Việt Nam.`,
    metadata: {
      eventDate: '18/06/1919',
      location: 'Cung điện Versailles, Paris, Cộng hòa Pháp',
      historicSignificance: 'Mốc son xuất hiện danh xưng Nguyễn Ái Quốc trên trường quốc tế'
    }
  },

  {
    id: 'DOC-HCM-024',
    title: 'Thành lập Hội Việt Nam Cách mạng Thanh niên (6/1925) & Báo Thanh Niên',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Lãnh tụ Nguyễn Ái Quốc - Quảng Châu, Trung Quốc',
    dateOrEra: 'Tháng 6/1925',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Hội Việt Nam Cách mạng Thanh niên', 'Báo Thanh Niên', 'Quảng Châu', '1925', 'Đường Kách mệnh', 'Chuẩn bị thành lập Đảng'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Tháng 6 năm 1925, tại thành phố Quảng Châu (Trung Quốc), đồng chí Nguyễn Ái Quốc sáng lập Hội Việt Nam Cách mạng Thanh niên - tổ chức tiền thân có ý nghĩa quyết định trực tiếp tới sự ra đời của Đảng Cộng sản Việt Nam.

Những cống hiến lịch sử tiêu biểu của Hội:
1. Trực tiếp mở các lớp huấn luyện chính trị cách mạng do đồng chí Nguyễn Ái Quốc trực tiếp giảng dạy, đào tạo đội ngũ cán bộ kiên trung đầu tiên cho cách mạng Việt Nam như Trần Phú, Lê Hồng Phong, Nguyễn Thị Minh Khai...
2. Xuất bản tuần báo "Thanh Niên" - cơ quan ngôn luận của Tổng bộ Hội, số 1 ra ngày 21/6/1925. Đây là mốc son mở đầu dòng Báo chí Cách mạng Việt Nam, lấy ngày 21/6 làm Ngày Báo chí Cách mạng Việt Nam.
3. Xuất bản cuốn cẩm nang lý luận kinh điển "Đường Kách mệnh" (năm 1927) tập hợp các bài giảng của Người, chỉ rõ tính chất cách mạng giải phóng dân tộc và vai trò lãnh đạo của Đảng tiên phong.

Hội Việt Nam Cách mạng Thanh niên là cầu nối truyền bá chủ nghĩa Mác - Lênin vào phong trào công nhân và phong trào yêu nước, chuẩn bị chín muồi về chính trị, tư tưởng và tổ chức cho Hội nghị thành lập Đảng đầu năm 1930.`,
    metadata: {
      eventDate: 'Tháng 6/1925',
      pressLaunchDate: '21/06/1925',
      location: 'Quảng Châu, Trung Quốc',
      historicSignificance: 'Tổ chức tiền thân trực tiếp chuẩn bị thành lập Đảng Cộng sản Việt Nam'
    }
  },

  {
    id: 'DOC-HCM-025',
    title: 'Mốc son Lịch sử Năm 1968: Kháng chiến Chống Mỹ & Tấm lòng Bác Hồ vì Sức khỏe Nhân dân',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Bảo tàng Hồ Chí Minh & Khu di tích Phủ Chủ tịch',
    dateOrEra: '1968',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Mậu Thân 1968', '19/8/1968', 'Nhà sàn Bác Hồ', 'Bác sĩ Lê Ngọc Mẫn', 'Vì sức khỏe nhân dân', 'Chí công vô tư'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Năm 1968 là mốc son lịch sử có ý nghĩa bước ngoặt chiến lược trong cuộc kháng chiến chống Mỹ, cứu nước của dân tộc Việt Nam:

1. Thắng lợi của cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 cùng các đợt tiến công tiếp nối (đợt 3 nổ súng ngày 17 - 19/8/1968) đã giáng đòn sấm sét vào ý chí xâm lược của đế quốc Mỹ, buộc Tổng thống Mỹ phải tuyên bố ném bom hạn chế rồi chấm dứt không điều kiện chiến tranh phá hoại miền Bắc và chấp nhận ngồi vào bàn đàm phán tại Paris.

2. Chiều ngày 19 tháng 8 năm 1968, tại Nhà sàn Phủ Chủ tịch (Hà Nội), một câu chuyện cảm động và sâu sắc về đạo đức Bác Hồ đã được ghi lại:
Khi tổ chức phân công bác sĩ Lê Ngọc Mẫn (chuyên gia y tế) về làm việc chuyên trách chăm sóc sức khỏe cho Bác, Người xúc động nắm tay bác sĩ và căn dặn:
"Bác có một mình mà những hai bác sĩ. Trong khi đó ở ngoài mặt trận bộ đội, thương binh, và nhân dân vùng địch đánh phá còn rất thiếu cán bộ y tế, thiếu thầy thuốc chữa bệnh...".

Câu nói chân thành, mộc mạc của Người làm các đồng chí có mặt rưng rưng xúc động. Trong bất kỳ hoàn cảnh nào, dù tuổi cao sức yếu giữa khói lửa chiến tranh, Bác Hồ luôn nghĩ về nhân dân, bộ đội, thương binh trước khi nghĩ đến bản thân mình. Đó là bài học ngời sáng về đức tính khiêm tốn, chí công vô tư và tấm lòng bao la của vị Cha già dân tộc.`,
    metadata: {
      eventDate: '19/08/1968',
      location: 'Nhà sàn Bác Hồ, Phủ Chủ tịch, Hà Nội',
      witnessDoctor: 'Bác sĩ Lê Ngọc Mẫn'
    }
  },

  // Security Canary test document: PENDING_REVIEW & isAllowedForRag: false
  // Must NEVER be returned by retrieval engine!
  {
    id: 'DOC-HCM-009',
    title: 'Tài liệu thử nghiệm nội bộ - Chưa qua thẩm định của Hội đồng chuyên môn',
    category: 'ideology-ethics',
    categoryLabel: 'Dự thảo thẩm định',
    authorOrSource: 'Bản thảo nội bộ phòng kỹ thuật',
    dateOrEra: '2026',
    status: 'PENDING_REVIEW',
    isAllowedForRag: false,
    topics: ['Nội bộ', 'Chưa duyệt', 'Bảo mật'],
    content: `Đây là tài liệu giả định nội bộ dùng để kiểm tra cổng an toàn truy xuất.
Nếu hệ thống RAG truy xuất hoặc dẫn chứng tài liệu này khi người dùng hỏi, điều đó chứng minh bộ lọc bảo mật kiểm soát nguồn (Security Gate) bị vi phạm!`,
    metadata: {
      isSecurityCanary: true
    }
  }
];
