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
 * 6. hcmc-history: Lịch sử Thành phố Hồ Chí Minh (và Phường Thới An)
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
    title: 'Truyền thống Lịch sử Anh hùng Dân tộc Nguyễn Trung Trực và Vùng đất Thới An',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'Ban Giám hiệu & Tổ Lịch sử Trường THCS Nguyễn Trung Trực',
    dateOrEra: '1838 - 1868 & Hiện nay',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nguyễn Trung Trực', 'Trường THCS Nguyễn Trung Trực', 'Bảo bối tinh thần', 'Khởi nghĩa kháng Pháp', 'Thới An', 'Thành phố Hồ Chí Minh'],
    sourceUrl: 'https://thcsnguyentrungtruc.hcm.edu.vn',
    content: `Trường THCS Nguyễn Trung Trực tọa lạc tại phường Thới An, TP. Hồ Chí Minh - vùng đất giàu truyền thống cách mạng kiên cường của Chiến khu An Phú Đông oanh liệt.

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
      schoolLocation: 'Phường Thới An, TP.HCM'
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
    status: 'APPROVED',
    isAllowedForRag: true,
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
    status: 'APPROVED',
    isAllowedForRag: true,
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
    status: 'APPROVED',
    isAllowedForRag: true,
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
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Chánh cương vắn tắt', 'Sách lược vắn tắt', 'Chương trình tóm tắt', 'Điều lệ vắn tắt', 'Lời kêu gọi thành lập Đảng', 'Cửu Long 1930', 'Cương lĩnh chính trị đầu tiên'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Các văn kiện thành lập Đảng được Hội nghị hợp nhất thông qua (từ 06/01 đến 07/02/1930 tại Cửu Long, Hương Cảng, do đồng chí Nguyễn Ái Quốc chủ trì):
1. VĂN KIỆN 1 - CHÁNH CƯƠNG VẮN TẮT CỦA ĐẢNG:
Xác định đường lối chiến lược: Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản. Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến tay sai, làm cho nước Nam hoàn toàn độc lập, dựng lên chính phủ công nông binh, tổ chức quân đội công nông, tịch thu tài sản của đế quốc trao cho dân cày nghèo.
2. VĂN KIỆN 2 - SÁCH LƯỢC VẮN TẮT CỦA ĐẢNG:
Đảng là đội tiên phong của vô sản giai cấp; phải thu phục cho được đại bộ phận giai cấp mình, lôi kéo nông dân và liên lạc mật thiết với tiểu tư sản, trí thức, trung nông. Đối với phú nông, trung tiểu địa chủ và tư sản An Nam mà chưa rõ mặt phản cách mạng thì phải lợi dụng, ít nhất làm cho họ đứng trung lập.
3. VĂN KIỆN 3 - CHƯƠNG TRÌNH TÓM TẮT CỦA ĐẢNG:
Đoàn kết công nhân, nông dân; thực hiện ngày làm 8 giờ; xóa bỏ sưu thuế vô lý; bảo đảm quyền tự do hội họp, ngôn luận cho nhân dân lao động.
4. VĂN KIỆN 4 - ĐIỀU LỆ VẮN TẮT CỦA ĐẢNG:
Quy định tôn chỉ mục đích, nguyên tắc tổ chức tập trung dân chủ, điều kiện kết nạp đảng viên và hệ thống tổ chức từ chi bộ đến Trung ương.
5. VĂN KIỆN 5 - LỜI KÊU GỌI NHÂN DỊP THÀNH LẬP ĐẢNG (18/02/1930):
Lời kêu gọi lịch sử của Nguyễn Ái Quốc gửi tới toàn thể công nhân, nông dân, binh lính, thanh niên, học sinh: Đế quốc Pháp xâm lược áp bức đồng bào; nay các tổ chức cộng sản đã thống nhất thành Đảng Cộng sản Việt Nam; kêu gọi toàn thể đồng bào gia nhập và ủng hộ Đảng đánh đuổi giặc ngoại xâm.`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      subDocumentsCount: 5,
      subDocumentsList: [
        'Chánh cương vắn tắt của Đảng',
        'Sách lược vắn tắt của Đảng',
        'Chương trình tóm tắt của Đảng',
        'Điều lệ vắn tắt của Đảng',
        'Lời kêu gọi nhân dịp thành lập Đảng (18/02/1930)'
      ],
      conferenceVenue: 'Cửu Long (Cửu Long - Hương Cảng, Trung Quốc)',
      conferenceDates: '06/01/1930 - 07/02/1930',
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
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Cần', 'Kiệm', 'Liêm', 'Chính', 'Chí công vô tư', 'Lê Quyết Thắng', 'Đạo đức công dân', 'Bốn mùa của trời', 'Báo Cứu Quốc 1949'],
    sourceUrl: 'https://hochiminh.vn/upload/3000001/20251024/65e0340736cc411805ab4818604f62f1HO_CHI_MINH_TOAN_TAP_-_TAP_6.pdf',
    content: `Bộ bốn bài viết chuyên khảo về đạo đức mới của Chủ tịch Hồ Chí Minh, ký bút danh Lê Quyết Thắng đăng liên tiếp trên Báo Cứu Quốc:
- BÀI 1: THẾ NÀO LÀ CẦN? (Đăng báo ngày 30/5/1949):
"Cần tức là siêng năng, chăm chỉ, cố gắng dẻo dai. Muốn cần thì việc gì cũng phải có kế hoạch chu đáo. Biết việc nào nên làm trước, việc nào làm sau. Làm việc gì cũng phải có sáng kiến, tìm cách làm nhanh mà tốt, làm việc bền gan, không nản lòng".
- BÀI 2: THẾ NÀO LÀ KIỆM? (Đăng báo ngày 31/5/1949):
"Kiệm là tiết kiệm, không xa xỉ, không hoang phí, không bừa bãi. Tiết kiệm tiền bạc, tiết kiệm thì giờ, tiết kiệm sức lao động của mình và của nhân dân. Tiết kiệm không phải là bủn xỉn, keo kiệt; việc đáng chi một vạn đồng cũng phải chi, việc không đáng chi một đồng cũng không chi".
- BÀI 3: THẾ NÀO LÀ LIÊM? (Đăng báo ngày 01/6/1949):
"Liêm là trong sạch, không tham lam. Ngày xưa quan lại không đục khoét dân là liêm. Ngày nay, mọi người ai giữ chữ Liêm đều không tham địa vị, không tham tiền tài, không tham tâng bốc. Cán bộ tham ô, lãng phí là tội ác đối với đồng bào, Tổ quốc".
- BÀI 4: THẾ NÀO LÀ CHÍNH? (Đăng báo ngày 02/6/1949):
"Chính nghĩa là không tà, thẳng thắn, đứng đắn. Đối với mình: Không tự cao tự đại, luôn cầu tiến bộ. Đối với người: Không nịnh hót kẻ trên, không xem khinh người dưới; chân thành, khiêm tốn. Đối với việc: Việc thiện dù nhỏ mấy cũng làm, việc ác dù nhỏ mấy cũng tránh. Việc công lên trên, việc tư lên sau".
- TỔNG KẾT BIỆN CHỨNG BỐN ĐỨC TÍNH:
"Trời có bốn mùa: Xuân, Hạ, Thu, Đông.
Đất có bốn phương: Đông, Tây, Nam, Bắc.
Người có bốn đức: Cần, Kiệm, Liêm, Chính.
Thiếu một mùa, thì không thành trời.
Thiếu một phương, thì không thành đất.
Thiếu một đức, thì không thành người".`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      pseudonym: 'Lê Quyết Thắng',
      articleDates: {
        can: '30/05/1949',
        kiem: '31/05/1949',
        liem: '01/06/1949',
        chinh: '02/06/1949'
      },
      newspaper: 'Báo Cứu Quốc (Cơ quan Tổng bộ Việt Minh)',
      batch: 'BATCH_A'
    }
  },

  {
    id: 'DOC-HCM-021',
    title: 'Lời kêu gọi thi đua ái quốc (11/6/1948)',
    category: 'school-education',
    categoryLabel: 'Giáo dục truyền thống & Thi đua ái quốc học đường',
    authorOrSource: 'Chủ tịch Hồ Chí Minh (Viết ngày 11/6/1948; Đăng Báo Cứu Quốc số 968 ngày 24/6/1948)',
    dateOrEra: '11/06/1948 (Đăng báo: 24/06/1948)',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Thi đua ái quốc', '11/6/1948', 'Báo Cứu Quốc số 968', 'Diệt giặc đói', 'Diệt giặc dốt', 'Diệt giặc ngoại xâm', 'Người người thi đua', 'Thi đua là yêu nước'],
    sourceUrl: 'https://hochiminh.vn',
    content: `Lời kêu gọi thi đua ái quốc của Chủ tịch Hồ Chí Minh:
- Ngày soạn thảo và ban hành: 11 tháng 6 năm 1948 tại Chiến khu Việt Bắc (nguồn gốc Ngày truyền thống Thi đua yêu nước Việt Nam).
- Ngày công bố báo chí: Đăng tải lần đầu trên Báo Cứu Quốc, số 968, ngày 24 tháng 6 năm 1948.
Nội dung cốt lõi của Lời kêu gọi:
1. Mục đích thi đua ái quốc: "Diệt giặc đói, diệt giặc dốt, diệt giặc ngoại xâm", đem lại cuộc sống ấm no, độc lập, tự do cho toàn dân tộc.
2. Cách làm: Dựa vào lực lượng của dân, tinh thần của dân để gây hạnh phúc cho dân.
3. Đối tượng tham gia: Bất kỳ ai - già, trẻ, gái, trai, giàu, nghèo, quân, dân - ai nấy đều thi đua làm tròn bổn phận của mình.
4. Chân lý bất hủ: "Thi đua là yêu nước, yêu nước thì phải thi đua. Và những người thi đua là những người yêu nước nhất".
5. Ứng dụng trong nhà trường: Thầy thi đua dạy tốt, trò thi đua học tốt, rèn luyện chăm chỉ đức - trí - thể - mỹ để mai sau phụng sự quê hương đất nước.`,
    metadata: {
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      writtenDate: '11/06/1948',
      publishedDate: '24/06/1948',
      newspaper: 'Báo Cứu Quốc',
      issueNumber: '968',
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
    status: 'APPROVED',
    isAllowedForRag: true,
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

  // ============================================================================
  // BATCH B: BỔ SUNG TRI THỨC ĐỊA PHƯƠNG & KHÔNG GIAN VĂN HÓA (DOC-HCM-026 ĐẾN DOC-HCM-028)
  // ============================================================================

  {
    id: 'DOC-HCM-026',
    title: 'Địa giới hành chính phường Thới An qua các thời kỳ (1997–2025 và hiện hành)',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'UBND Thành phố Hồ Chí Minh & Ủy ban Thường vụ Quốc hội',
    dateOrEra: '1997 - 2025 - Hiện hành',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Địa giới hành chính', 'Phường Thới An', 'Phường Thạnh Xuân', 'Quận 12', 'Nghị quyết 1685', 'Quyết định 1195', 'Sắp xếp ĐVHC 2025'],
    sourceUrl: 'https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-1685-nq-ubtvqh15-sap-xep-cac-dvhc-cap-xa-cua-thanh-pho-ho-chi-minh-nam-2025-119250616211341304.htm',
    content: `Địa giới hành chính phường Thới An qua các thời kỳ (1997 – 2025 và hiện hành):

1. THỜI KỲ THÀNH LẬP QUẬN 12 VÀ PHƯỜNG THỚI AN (NĂM 1997):
Theo Quyết định số 1195/QĐ-UB-NC ngày 18/03/1997 của UBND TP.HCM về việc thành lập Quận 12 và các phường trực thuộc:
- Phường Thới An cũ được thành lập trên cơ sở 451 ha diện tích tự nhiên và 4.883 nhân khẩu của xã Tân Thới Hiệp cũ (thuộc huyện Hóc Môn).
- Phường Thạnh Xuân cũ được thành lập trên cơ sở toàn bộ 968 ha diện tích tự nhiên và 9.489 nhân khẩu của xã Thạnh Xuân cũ (thuộc huyện Hóc Môn).
- Trụ sở UBND Quận 12 thời kỳ này được đặt trên địa bàn phường Thới An.
- Bối cảnh lịch sử tiếp giáp trước sắp xếp (1997 – 30/06/2025): Phường Thạnh Xuân cũ có ranh giới sông Sài Gòn tiếp giáp với tỉnh Bình Dương (thị xã Thuận An, nay là thành phố Thuận An). Đây là ghi nhận lịch sử về địa giới tự nhiên thời kỳ 1997–2025; số liệu 451 ha và 968 ha là số liệu diện tích lịch sử xác định tại thời điểm ban hành Quyết định 1195 năm 1997.

2. NỘI DUNG SẮP XẾP ĐƠN VỊ HÀNH CHÍNH NĂM 2025 THEO NGHỊ QUYẾT 1685/NQ-UBTVQH15:
- Ngày 16 tháng 06 năm 2025, Ủy ban Thường vụ Quốc hội ban hành Nghị quyết số 1685/NQ-UBTVQH15 về việc sắp xếp các đơn vị hành chính cấp xã của Thành phố Hồ Chí Minh năm 2025.
- Căn cứ Khoản 35 Điều 1 Nghị quyết số 1685/NQ-UBTVQH15: Nhập toàn bộ diện tích tự nhiên và quy mô dân số của phường Thạnh Xuân vào phường Thới An.
- Tên gọi chính thức của đơn vị hành chính sau khi sắp xếp: Phường Thới An.
- Thời điểm bắt đầu hoạt động chính thức của đơn vị hành chính mới: Từ ngày 01 tháng 07 năm 2025.
- Về ranh giới tiếp giáp hiện hành: Hệ thống bảo lưu nguyên tắc chỉ trích dẫn văn bản pháp lý chính thức, không tự xác định hay suy diễn các phường hoặc đơn vị hành chính tiếp giáp hiện nay khi chưa có hồ sơ địa giới và bản đồ quy chuẩn do cơ quan nhà nước có thẩm quyền công bố.

3. NGUYÊN TẮC ĐỊA DANH VÀ QUẢN LÝ:
- Địa danh hiện hành chính thức: "Phường Thới An, Thành phố Hồ Chí Minh" (đơn vị hành chính cấp xã trực thuộc chính quyền đô thị TP.HCM).
- Cụm từ "Phường Thới An, Quận 12" chỉ được dùng khi trích dẫn các văn bản quy phạm pháp luật, sự kiện lịch sử ban hành trước ngày 01/07/2025.
- Phường Thới An hiện nay là đơn vị hành chính cấp xã hợp nhất từ phường Thới An và phường Thạnh Xuân cũ; không đồng nhất với toàn bộ địa giới Quận 12 trước đây.`,
    metadata: {
      candidateCode: 'B-07',
      legalBasis: ['Quyết định số 1195/QĐ-UB-NC ngày 18/03/1997', 'Nghị quyết số 1685/NQ-UBTVQH15 ngày 16/06/2025'],
      effectiveDateCurrent: '01/07/2025',
      formerAreaThoiAn1997: '451 ha',
      formerPopulationThoiAn1997: '4.883 nhân khẩu',
      formerAreaThanhXuan1997: '968 ha',
      formerPopulationThanhXuan1997: '9.489 nhân khẩu',
      copyrightStatus: 'PUBLIC_DOMAIN_CONFIRMED',
      batch: 'BATCH_B_SELECTIVE_01'
    }
  },

  {
    id: 'DOC-HCM-027',
    title: 'Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014–nay)',
    category: 'school-education',
    categoryLabel: 'Hoạt động giáo dục và học tập tại nhà trường',
    authorOrSource: 'Trường THCS Nguyễn Trung Trực & UBND Phường Thới An',
    dateOrEra: '2014 - Hiện nay',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Trường THCS Nguyễn Trung Trực', 'Thành lập năm 2014', 'Quyết định 155', 'Quyết định 76', 'Kế hoạch 01/KH-NTT', 'Không gian Văn hóa HCM', 'Trường học Hạnh phúc'],
    sourceUrl: 'https://thcsnguyentrungtruc.hcm.edu.vn/gioi-thieu/gioi-thieu-truong-thcs-nguyen-trung-truc/ct/12684/691487',
    content: `Lịch sử hình thành và phát triển Trường THCS Nguyễn Trung Trực (2014 – nay):

1. MỐC THÀNH LẬP VÀ CĂN CỨ PHÁP LÝ KHỞI ĐẦU NĂM 2014:
Trường Trung học cơ sở Nguyễn Trung Trực được chính thức thành lập theo Quyết định số 155/QĐ-UBND ngày 31 tháng 07 năm 2014 của UBND Quận 12. Nhà trường chính thức khai giảng và đi vào hoạt động giảng dạy từ năm học 2014 – 2015.
Trường vinh dự mang tên Người anh hùng nghĩa quân Nam Bộ Nguyễn Trung Trực (1838 – 1868) với câu nói bất hủ: "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".

2. QUÁ TRÌNH PHÁT TRIỂN VÀ KIỆN TOÀN TỔ CHỨC NĂM 2025:
Trải qua hơn 10 năm phát triển phong trào "Dạy tốt – Học tốt", ngày 01 tháng 07 năm 2025, thực hiện Nghị quyết số 1685/NQ-UBTVQH15 của Quốc hội về việc sắp xếp đơn vị hành chính cấp xã của TP.HCM, UBND Phường Thới An ban hành Quyết định số 76/QĐ-UBND ngày 01/07/2025 về việc quản lý Trường THCS Nguyễn Trung Trực trực thuộc chính quyền địa phương cấp phường (ghi nhận tại Kế hoạch giáo dục nhà trường năm học 2025–2026 số 01/KH-NTT ngày 29/08/2025).
Nguyên tắc pháp lý then chốt: Quyết định năm 2014 là mốc khai sinh thành lập trường; Quyết định năm 2025 là bước kiện toàn tổ chức và thẩm quyền quản lý nhà nước theo mô hình chính quyền đô thị mới. Đây là sự kế thừa liên tục về lịch sử, đội ngũ cán bộ giáo viên và cơ sở vật chất; tuyệt đối không phải là giải thể trường cũ để thành lập một trường hoàn toàn mới.

3. GIÁO DỤC TRUYỀN THỐNG VÀ KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH:
Nhà trường xây dựng mô hình Trường học Hạnh phúc, phát triển toàn diện tri thức và nhân cách. Không gian Văn hóa Hồ Chí Minh học đường được triển khai đồng bộ giữa Không gian vật lý (tủ sách Bác Hồ, khu ảnh tư liệu) và Không gian số (Trợ lý AI RAG phục vụ tra cứu có căn cứ xác thực, giáo dục truyền thống cho học sinh). Hồ sơ tài liệu nhà trường tuân thủ nghiêm ngặt quy định bảo vệ dữ liệu cá nhân, không công khai điểm số hay thông tin riêng tư của học sinh, giáo viên.`,
    metadata: {
      candidateCode: 'B-10',
      foundingDecision: 'Quyết định số 155/QĐ-UBND ngày 31/07/2014 của UBND Quận 12',
      governanceDecisionCurrent: 'Quyết định số 76/QĐ-UBND ngày 01/07/2025 của UBND Phường Thới An',
      addressCurrent: 'Đường Lê Văn Khương, Phường Thới An, Thành phố Hồ Chí Minh',
      copyrightStatus: 'OPEN_ACCESS_REUSE_PERMITTED',
      batch: 'BATCH_B_SELECTIVE_01'
    }
  },

  {
    id: 'DOC-HCM-028',
    title: 'Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'Nguyên tác: Trịnh Hoài Đức (Gia Định thành thông chí, khoảng 1820) | Trích yếu sự kiện lịch sử công cộng: Không gian Văn hóa HCM THCS Nguyễn Trung Trực',
    dateOrEra: 'Thế kỷ XVII - Giữa thế kỷ XIX (1698 - 1858)',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Gia Định thành thông chí', 'Trịnh Hoài Đức', 'Lễ Thành hầu Nguyễn Hữu Cảnh', 'Năm 1698', 'Phủ Gia Định', 'Bến Nghé', 'Khai hoang mở cõi', 'Thương cảng Sài Gòn'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `Trích yếu Lịch sử Sài Gòn – Gia Định thời Nguyễn theo Gia Định thành thông chí:

[GHI CHÚ BẢN QUYỀN VÀ RANH GIỚI VĂN BẢN]
- Nguyên tác: Bộ sử địa chí chữ Hán "Gia Định thành thông chí" của Hiệp biện Đại học sĩ Trịnh Hoài Đức hoàn thành khoảng năm 1820 thời triều Nguyễn thuộc di sản văn hóa công cộng (Public Domain).
- Bản dịch và chú giải hiện đại: Các ấn bản sách in hiện đại có bản quyền dịch thuật và chú thích độc quyền của các dịch giả/nhà xuất bản hiện đại; hệ thống RAG nhà trường tuyệt đối không sao chép trái phép.
- Nội dung trích yếu của dự án: Dưới đây là phần trích lược các sự kiện cương vực lịch sử khách quan đã trở thành tri thức công cộng, bảo toàn xuất xứ của 9 chunks phục vụ giáo dục truyền thống học đường.

1. MỐC THIẾT LẬP TỔ CHỨC HÀNH CHÍNH NĂM 1698 CỦA NGUYỄN HỮU CẢNH:
Theo ghi chép của Trịnh Hoài Đức trong tác phẩm "Gia Định thành thông chí" (Quyển III: Cương vực chí), mùa xuân năm Mậu Dần (1698), chúa Nguyễn Phúc Chu sai Thống suất Chưởng cơ Lễ Thành hầu Nguyễn Hữu Cảnh vào kinh lược đất phương Nam. Nguyễn Hữu Cảnh lấy đất Nông Nại đặt làm Phủ Gia Định, lập xứ Đồng Nai làm huyện Phước Long (dựng dinh Trấn Biên), lập xứ Sài Gòn làm huyện Tân Bình (dựng dinh Phiên Trấn). Mốc năm 1698 chính thức đánh dấu việc vùng đất Sài Gòn – Gia Định được đưa vào bản đồ cương vực hành chính Đại Việt.

2. THƯƠNG CẢNG BẾN NGHÉ VÀ ĐỜI SỐNG TRÙ PHÚ:
Trong "Sơn xuyên chí", Trịnh Hoài Đức miêu tả vùng sông Bến Nghé tàu buôn qua lại như thoi, ghe thuyền tụ hội "Trên bến dưới thuyền", lúa gạo cá muối khắp các tỉnh Nam Bộ tụ về buôn bán sầm uất. Chợ Sài Gòn trở thành trung tâm thương mại tấp nập của xứ Đàng Trong, là nơi giao thoa văn hóa hài hòa giữa các cộng đồng cư dân Việt, Hoa, Khmer, Chăm.

3. Ý NGHĨA KHOA HỌC VÀ BÀI HỌC GIÁO DỤC TRUYỀN THỐNG:
Tác phẩm "Gia Định thành thông chí" của Trịnh Hoài Đức là bộ bách khoa toàn thư cổ đồ sộ, có giá trị lịch sử và pháp lý cao về cương vực phương Nam. Tư liệu giúp học sinh Trường THCS Nguyễn Trung Trực hiểu rõ công lao khai hoang mở cõi kiên cường, bền bỉ của tiền nhân, bồi đắp lòng biết ơn cha ông và niềm tự hào sâu sắc về truyền thống hơn 300 năm của Thành phố mang tên Bác.`,
    metadata: {
      candidateCode: 'B-02',
      chronicleAuthor: 'Trịnh Hoài Đức (1765 - 1825)',
      workCompletedYear: 'Khoảng 1820',
      keySections: ['Quyển III: Cương vực chí', 'Quyển IV: Sơn xuyên chí'],
      copyrightStatus: 'PUBLIC_DOMAIN_EXCERPT_ONLY',
      batch: 'BATCH_B_SELECTIVE_01'
    }
  },

  // ============================================================================
  // KNOWLEDGE EXPANSION BATCH C (DOC-HCM-029 ĐẾN DOC-HCM-040)
  // Bổ sung chuyên sâu 12 hồ sơ tri thức toàn diện 8 danh mục chuẩn mực
  // ============================================================================

  {
    id: 'DOC-HCM-029',
    title: 'Thư Bác Hồ gửi thiếu niên, nhi đồng nhân dịp Tết Trung thu qua các thời kỳ',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Trích Hồ Chí Minh Toàn tập (NXB Chính trị Quốc gia Sự thật)',
    dateOrEra: '1951 - 1960',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Tết Trung thu', 'Thiếu nhi', 'Lời dạy của Bác', 'Kháng chiến', 'Yêu nước', 'Thi đua học hành'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `Sinh thời, Chủ tịch Hồ Chí Minh luôn dành cho thiếu niên, nhi đồng tình yêu thương bao la và sự quan tâm đặc biệt nhất. Cứ mỗi dịp Tết Trung thu đến, dù bận trăm công nghìn việc quốc gia đại sự, Bác luôn dành thời gian viết thư, làm thơ gửi tặng các cháu thiếu nhi cả nước và kiều bào ở nước ngoài.

1. BÀI THƠ TRUNG THU NĂM 1951 - TÌNH YÊU THƯƠNG BAO LA CỦA BÁC:
Giữa khói lửa của cuộc kháng chiến chống thực dân Pháp gian lao, Bác viết bức thư gửi các cháu bằng những vần thơ mộc mạc, tha thiết:
"Ai yêu các nhi đồng
Bằng Bác Hồ Chí Minh?
Tính các cháu ngoan ngoãn,
Mặt các cháu xinh xinh.
Mong các cháu cố gắng,
Thi đua học và hành.
Tuổi nhỏ làm việc nhỏ,
Tùy theo sức của mình:
Để tham gia kháng chiến,
Để gìn giữ hòa bình.
Các cháu hãy xứng đáng:
Cháu Bác Hồ Chí Minh!".
Lời dạy "Tuổi nhỏ làm việc nhỏ, tùy theo sức của mình" đã trở thành phương châm sống, kim chỉ nam rèn luyện của lớp lớp thế hệ măng non Việt Nam trong suốt hơn nửa thế kỷ qua.

2. THƯ TRUNG THU NĂM 1952 VÀ NĂM 1960 - NIỀM TIN VÀO TƯƠNG LAI NƯỚC NHÀ:
Trong thư Trung thu năm 1952, Bác căn dặn các cháu: "Bác mong các cháu: Ngoan ngoãn, đoàn kết, thi đua học tập, thi đua tăng gia. Mong các cháu tiến bộ nhiều. Mai sau các cháu thành người chủ của nước nhà".
Đến Tết Trung thu năm 1960, Bác chia sẻ niềm vui đón trăng cùng các cháu thiếu nhi miền Bắc và gửi trọn nỗi nhớ thương da diết tới các cháu thiếu nhi miền Nam ruột thịt đang sống dưới ách kìm kẹp của quân xâm lược, hẹn ngày non sông liền một dải để Bác cháu sum họp một nhà.

3. Ý NGHĨA SƯ PHẠM VÀ HÀNH ĐỘNG CỦA HỌC SINH THCS:
Những bức thư Trung thu của Bác Hồ không chỉ là món quà tinh thần vô giá mà còn là bài học lớn về lòng yêu nước, ý thức trách nhiệm cộng đồng và tinh thần tự lập. Học sinh Trường THCS Nguyễn Trung Trực noi gương Bác bằng việc tích cực tham gia phong trào "Nghìn việc tốt", giúp đỡ bạn bè có hoàn cảnh khó khăn, chăm ngoan học giỏi để xứng đáng với sự kỳ vọng của Người.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      educationalLevel: 'THCS',
      primaryTarget: 'Đội viên & Thiếu nhi toàn trường'
    }
  },

  {
    id: 'DOC-HCM-030',
    title: 'Tuyển tập những mẩu chuyện cảm động về Bác Hồ với thiếu niên, nhi đồng',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Bảo tàng Hồ Chí Minh & Nhà xuất bản Kim Đồng',
    dateOrEra: 'Tuyển tập truyền thống',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Chiếc vòng bạc', 'Quả táo của Bác', 'Ai ngoan sẽ được thưởng', 'Giữ lời hứa', 'Thật thà', 'Lòng nhân ái'],
    sourceUrl: 'https://nxbkimdong.com.vn',
    content: `Những mẩu chuyện đời thường giản dị về Chủ tịch Hồ Chí Minh là kho tàng bài học đạo đức sống động, gần gũi và sâu sắc nhất đối với lứa tuổi học sinh THCS.

1. CHUYỆN "CHIẾC VÒNG BẠC" - BÀI HỌC VỀ GIỮ CHỮ TÍN VÀ TÔN TRỌNG LỜI HỨA:
Hơn hai năm sau khi Bác đi công tác về vùng cao, lúc trở lại, đồng bào và các cháu thiếu nhi ùa ra đón Bác rộn rã. Bác mở túi lấy ra một chiếc vòng bạc nhỏ sáng lóa trao tận tay một em bé gái. Mọi người đều ngạc nhiên. Bác giải thích: "Trước đây hai năm, khi chia tay, cháu bé này có nói Bác đi đâu về nhớ mua cho cháu một chiếc vòng bạc. Nay Bác về, Bác giữ đúng lời hứa".
-> Bài học: Đã hứa điều gì thì phải cố gắng thực hiện cho bằng được, dù là với một đứa trẻ nhỏ. Giữ chữ tín là nền tảng cao quý nhất của đạo đức làm người.

2. CHUYỆN "QUẢ TÁO CỦA BÁC HỒ" - TÌNH YÊU THƯƠNG TRẺ THƠ KHÔNG BIÊN GIỚI:
Năm 1946, khi sang thăm nước Pháp với tư cách là thượng khách của Chính phủ Pháp, trong một bữa tiệc ngoại giao sang trọng, Bác Hồ đã cầm theo một quả táo ngon khi rời bàn tiệc. Ra đến cửa điện, thấy một phụ nữ nghèo bế em bé đứng nhìn, Bác đã tiến lại mỉm cười ân cần trao quả táo cho cháu bé. Cử chỉ đầy tình nhân ái của Bác đã làm xúc động hàng triệu trái tim nhân dân Pháp và truyền thông quốc tế thời bấy giờ.
-> Bài học: Lòng nhân ái, sự sẻ chia và tình thương yêu trẻ em chân thành, vượt qua mọi ranh giới dân tộc, màu da hay đẳng cấp.

3. CHUYỆN "AI NGOAN SẼ ĐƯỢC THƯỞNG" - BÀI HỌC VỀ TÍNH THẬT THÀ VÀ DŨNG CẢM:
Khi Bác đến thăm một trại nhi đồng, Bác chia kẹo cho các cháu. Cậu bé Tộ đứng nép vào góc lớp không dám nhận kẹo. Khi Bác hỏi lý do, Tộ lí nhí: "Thưa Bác, hôm nay cháu chưa vâng lời cô giáo, cháu chưa ngoan nên không dám nhận kẹo của Bác ạ". Bác cười hiền từ, xoa đầu Tộ và nói: "Cháu biết nhận lỗi, thế là dũng cảm và thật thà, cháu vẫn là đứa trẻ ngoan!". Bác vẫn chia phần kẹo cho Tộ và em hứa từ nay sẽ ngoan ngoãn hơn.
-> Bài học: "Khiêm tốn, thật thà, dũng cảm" theo Điều 5 Bác Hồ dạy. Biết nhận lỗi và dũng cảm sửa đổi là phẩm chất đáng quý nhất của người học sinh.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      educationalLevel: 'THCS',
      valuesHighlighted: ['Chữ tín', 'Lòng nhân ái', 'Sự trung thực']
    }
  },

  {
    id: 'DOC-HCM-031',
    title: 'Cẩm nang thực hành 5 Điều Bác Hồ dạy dành cho Đội viên thiếu niên tiền phong THCS',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Hội đồng Đội Trung ương & Liên đội Trường THCS Nguyễn Trung Trực',
    dateOrEra: '1961 - Hiện hành',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['5 Điều Bác Hồ dạy', 'Đội TNTP Hồ Chí Minh', 'Rèn đức luyện tài', 'Vệ sinh thật tốt', 'Khiêm tốn thật thà dũng cảm'],
    sourceUrl: 'https://thieunhitphcm.vn',
    content: `1. HOÀN CẢNH RA ĐỜI 5 ĐIỀU BÁC HỒ DẠY THIẾU NIÊN NHI ĐỒNG:
Năm 1961, nhân dịp kỷ niệm 20 năm ngày thành lập Đội Thiếu niên Tiền phong (15/5/1941 - 15/5/1961), Chủ tịch Hồ Chí Minh đã gửi thư căn dặn thiếu niên, nhi đồng cả nước 5 điều ngắn gọn, súc tích.
Đến năm 1965, khi chuẩn bị in lại thư khen ngợi các cháu thiếu nhi có thành tích học tập và chống Mỹ cứu nước, Bác đã tự tay bổ sung chữ "thật" vào điều thứ tư: từ "Giữ gìn vệ sinh tốt" thành "Giữ gìn vệ sinh THẬT tốt", thể hiện sự quan tâm tỉ mỉ, thiết thực của Bác đối với nếp sống sạch sẽ, sức khỏe và thể chất của thế hệ tương lai.

2. NỘI DUNG VÀ HƯỚNG DẪN THỰC HÀNH CỤ THỂ CHO HỌC SINH THCS NGUYỄN TRUNG TRỰC:

- Điều 1: Yêu Tổ quốc, yêu đồng bào
  + Thực hành: Đứng nghiêm trang, hát to, đúng nhạc bài Quốc ca - Đội ca trong các lễ chào cờ đầu tuần; tích cực học tập lịch sử dựng nước và giữ nước; yêu thương, giúp đỡ bạn bè trong lớp, không phân biệt hoàn cảnh; kính trọng ông bà, cha mẹ, thầy cô giáo.

- Điều 2: Học tập tốt, lao động tốt
  + Thực hành: Lắng nghe thầy cô giảng bài, làm bài tập đầy đủ, tự giác đọc sách mở rộng tri thức; chủ động tham gia lao động vệ sinh phòng học, giữ gìn tài sản chung của nhà trường, phụ giúp gia đình công việc nhà vừa sức.

- Điều 3: Đoàn kết tốt, kỷ luật tốt
  + Thực hành: Luôn hòa đồng, xây dựng tình bạn trong sáng, tuyệt đối nói không với bạo lực học đường; chấp hành nghiêm túc Nội quy học sinh Trường THCS Nguyễn Trung Trực, chấp hành luật an toàn giao thông khi đến trường.

- Điều 4: Giữ gìn vệ sinh thật tốt
  + Thực hành: Giữ gìn vệ sinh cá nhân, trang phục sạch sẽ, đeo khăn quàng đỏ chỉnh tề; phân loại rác thải tại lớp học, bỏ rác đúng nơi quy định, bảo vệ cây xanh và không gian xanh của nhà trường và địa bàn Phường Thới An.

- Điều 5: Khiêm tốn, thật thà, dũng cảm
  + Thực hành: Luôn lễ phép với người lớn, khiêm tốn học hỏi bạn bè xung quanh; không gian lận trong giờ kiểm tra và thi cử; dũng cảm nhận khuyết điểm khi làm sai và có tinh thần đấu tranh bảo vệ lẽ phải.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      organizationUnit: 'Liên đội THCS Nguyễn Trung Trực',
      practicalChecklist: true
    }
  },

  {
    id: 'DOC-HCM-032',
    title: 'Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh (19/12/1946)',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Bảo vật Quốc gia & Viện Lịch sử Đảng',
    dateOrEra: '19/12/1946',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Toàn quốc kháng chiến', '1946', 'Vạn Phúc Hà Đông', 'Độc lập tự do', 'Kháng chiến kiến quốc'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `1. HOÀN CẢNH LỊCH SỬ RA ĐỜI BẢN HIỆU TRIỆU:
Sau ngày Cách mạng Tháng Tám năm 1945 thành công, thực dân Pháp quyết tâm dùng vũ lực để xâm lược nước ta một lần nữa. Với thiện chí hòa bình, Chủ tịch Hồ Chí Minh và Chính phủ Việt Nam Dân chủ Cộng hòa đã hết sức nhân nhượng, ký Hiệp định Sơ bộ ngày 6/3/1946 và Tạm ước ngày 14/9/1946. Nhưng thực dân Pháp liên tiếp bội ước, gây hấn ở Hải Phòng, Lạng Sơn và gửi tối hậu thư đòi tước vũ khí của lực lượng tự vệ Thủ đô Hà Nội.
Trước tình thế "ngàn cân treo sợi tóc", tối ngày 19 tháng 12 năm 1946, tại làng Vạn Phúc (Hà Đông, nay thuộc Hà Nội), Chủ tịch Hồ Chí Minh đã viết bản "Lời kêu gọi Toàn quốc kháng chiến". Tiếng súng kháng chiến toàn quốc chính thức bùng nổ đêm 19/12/1946.

2. TOÀN VĂN LỜI KÊU GỌI BẤT HỦ:
"Hỡi đồng bào toàn quốc!
Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới, vì chúng quyết tâm cướp nước ta lần nữa!
Không! Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ.
Hỡi đồng bào!
Chúng ta phải đứng lên!
Bất kỳ đàn ông, đàn bà, bất kỳ người già, người trẻ, không chia tôn giáo, đảng phái, dân tộc. Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp để cứu Tổ quốc. Ai có súng dùng súng. Ai có gươm dùng gươm, không có gươm thì dùng cuốc, thuổng, gậy gộc. Ai cũng phải ra sức chống thực dân Pháp cứu nước.
Hỡi anh em binh sĩ, tự vệ, dân quân!
Giờ cứu quốc đã đến. Ta phải hy sinh đến giọt máu cuối cùng, để giữ gìn đất nước.
Dù phải gian lao kháng chiến, nhưng với một lòng kiên quyết hy sinh, thắng lợi nhất định về dân tộc ta!
Việt Nam độc lập và thống nhất muôn năm!
Kháng chiến thắng lợi muôn năm!".

3. Ý NGHĨA THỜI ĐẠI VÀ BÀI HỌC Ý CHÍ:
"Lời kêu gọi Toàn quốc kháng chiến" là áng hùng văn cứu quốc, kết tinh ý chí quật cường của hàng triệu con tim Việt Nam. Tinh thần "Thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ" là ngọn đuốc soi đường bồi dưỡng lòng yêu nước nồng nàn và ý thức tự tôn dân tộc cho các thế hệ học sinh trường Nguyễn Trung Trực hôm nay.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      legalStatus: 'Bảo vật Quốc gia',
      speechLocation: 'Làng Vạn Phúc, Hà Đông'
    }
  },

  {
    id: 'DOC-HCM-033',
    title: 'Tác phẩm "Nhật ký trong tù" – Giá trị nhân văn và các bài thơ rèn luyện ý chí cho thế hệ trẻ',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Bảo vật Quốc gia (Viện Văn học & NXB Văn học)',
    dateOrEra: '1942 - 1943',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nhật ký trong tù', 'Ngục trung nhật ký', 'Học dịch kinh', 'Nghe tiếng giã gạo', 'Tự khuyên mình', 'Ý chí rèn luyện'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `1. HOÀN CẢNH SÁNG TÁC TẬP THƠ BẢO VẬT QUỐC GIA:
Từ tháng 8/1942 đến tháng 9/1943, lãnh tụ Nguyễn Ái Quốc lấy tên là Hồ Chí Minh lên đường sang Trung Quốc để liên lạc với các lực lượng dân chủ quốc tế. Vừa đến thị trấn Túc Vinh (tỉnh Quảng Tây), Người bị chính quyền Tưởng Giới Thạch bắt giữ vô cớ. Suốt 14 tháng bị giam cầm đày ải, bị giải qua gần 30 nhà giam của 13 huyện thuộc tỉnh Quảng Tây, Người đã viết tập thơ "Ngục trung nhật ký" (Nhật ký trong tù) gồm 133 bài thơ bằng chữ Hán trong một cuốn sổ tay nhỏ.

2. NHỮNG BÀI THƠ TIÊU BIỂU VỀ RÈN LUYỆN Ý CHÍ VÀ NHÂN CÁCH HỌC SINH:

- Bài 1: "Tự khuyên mình" (Tự miễn)
  "Ví không có cảnh đông tàn,
  Thì đâu có cảnh huy hoàng ngày xuân;
  Nghĩ mình trong bước gian truân,
  Tai ương rèn luyện tinh thần thêm hăng."
  -> Ý nghĩa: Khó khăn, thử thách chỉ là môi trường tôi luyện bản lĩnh con người. Như sau mùa đông giá rét sẽ là mùa xuân nở hoa, con người vượt qua gian nan sẽ đạt tới thành công rực rỡ.

- Bài 2: "Nghe tiếng giã gạo" (Văn thối mễ thanh)
  "Gạo đem vào giã bao đau đớn,
  Gạo giã xong rồi trắng tựa bông;
  Sống ở trên đời người cũng vậy,
  Gian nan rèn luyện mới thành công."
  -> Ý nghĩa: Triết lý sâu sắc về sự tu dưỡng, rèn luyện nhân cách và học tập. Không có vinh quang nào tự nhiên đến nếu không trải qua quá trình khổ luyện kiên trì mỗi ngày.

- Bài 3: "Học dịch kinh" (Độc Dịch kinh)
  "Hết mưa là nắng hửng lên thôi,
  Hết khổ là vui vốn lẽ đời;
  Mây tạnh mù tan bay hết sạch,
  Thênh thang non nước một phương trời."
  -> Ý nghĩa: Tinh thần lạc quan cách mạng phi thường, làm chủ hoàn cảnh, luôn hướng về ánh sáng và tương lai tươi sáng.

3. BÀI HỌC GIÁO DỤC CHO HỌC SINH THCS:
Tập thơ là tấm gương sáng về tinh thần thép, phong thái ung dung tự tại và tình yêu thiên nhiên, con người bao la. Đối với học sinh, đây là nguồn cảm hứng mạnh mẽ để các em không chùn bước trước các môn học khó, vượt qua áp lực học tập và rèn luyện ý chí vươn lên thành tài.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      legalStatus: 'Bảo vật Quốc gia số 02',
      originalLanguage: 'Chữ Hán'
    }
  },

  {
    id: 'DOC-HCM-034',
    title: 'Thơ chúc Tết của Chủ tịch Hồ Chí Minh qua các thời kỳ lịch sử (1947–1969)',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản văn hóa Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Báo Nhân Dân & NXB Chính trị Quốc gia Sự thật',
    dateOrEra: '1947 - 1969',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Thơ chúc Tết', 'Mừng Xuân', 'Xuân Mậu Thân 1968', 'Xuân Kỷ Dậu 1969', 'Đánh cho Mỹ cút đánh cho Ngụy nhào'],
    sourceUrl: 'https://nhandan.vn',
    content: `Cứ mỗi độ Giao thừa thiêng liêng, người dân Việt Nam trên khắp mọi miền Tổ quốc và kiều bào ở nước ngoài lại quây quần bên chiếc máy thu thanh để hồi hộp lắng nghe giọng đọc thơ chúc Tết ấm áp, hào sảng của Bác Hồ. Thơ chúc Tết của Bác vừa là thi phẩm xuân thắm đượm tình cảm non sông, vừa là lời hiệu triệu hiệu lệnh tiến công lịch sử.

1. XUÂN ĐINH HỢI 1947 - BÀI THƠ CHÚC TẾT KHÁNG CHIẾN ĐẦU TIÊN:
Giữa núi rừng Việt Bắc những ngày đầu toàn quốc kháng chiến, Bác chúc Tết đồng bào:
"Cờ đỏ sao vàng tung bay trước gió,
Tiếng kèn kháng chiến vang dậy non sông.
Toàn dân kháng chiến, toàn diện kháng chiến,
Chí ta đã quyết, lòng ta đã đồng.
Tiến lên chiến sĩ! Tiến lên đồng bào!
Sức ta đã mạnh, người ta đã đông.
Trường kỳ kháng chiến, nhất định thắng lợi!
Thống nhất độc lập, nhất định thành công!".

2. XUÂN MẬU THÂN 1968 - HIỆU LỆNH TỔNG TIẾN CÔNG VÀ NỔI DẬY:
Giao thừa Tết Mậu Thân 1968, lời thơ của Bác vang lên như sấm rền thôi thúc quân dân miền Nam đồng loạt nổi dậy:
"Xuân này hơn hẳn mấy xuân qua,
Thắng trận tin vui khắp nước nhà.
Nam Bắc thi đua đánh giặc Mỹ.
Tiến lên!
Toàn thắng ắt về ta!".

3. XUÂN KỶ DẬU 1969 - BÀI THƠ CHÚC TẾT CUỐI CÙNG CỦA BÁC:
Mùa xuân cuối cùng trước lúc Người đi xa, Bác đã đúc kết phương châm chiến lược đánh đuổi đế quốc Mỹ xâm lược, giải phóng hoàn toàn miền Nam:
"Năm qua thắng lợi vẻ vang,
Năm nay tiền tuyến chắc càng thắng to.
Vì độc lập, vì tự do,
Đánh cho Mỹ cút, đánh cho Ngụy nhào.
Tiến lên! Chiến sĩ, đồng bào,
Bắc - Nam sum họp, xuân nào vui hơn!".

4. GIÁ TRỊ VĂN HÓA VÀ TINH THẦN BẤT DIỆT:
Thơ chúc Tết của Bác Hồ là di sản văn hóa tinh thần vô giá của dân tộc Việt Nam. Mỗi câu thơ là niềm tin mãnh liệt vào chính nghĩa, là lời nhắc nhở thế hệ trẻ không ngừng thi đua rèn đức, luyện tài để giữ vững độc lập, chủ quyền và xây dựng quê hương phồn vinh.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      genre: 'Thơ mừng Xuân & Văn kiện lãnh đạo',
      historicalSpan: '1947 - 1969'
    }
  },

  {
    id: 'DOC-HCM-035',
    title: 'Anh hùng dân tộc Nguyễn Trung Trực – Thân thế, khí tiết và tấm gương trung dũng',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'Hội Khoa học Lịch sử Việt Nam & Ban Tuyên giáo địa phương',
    dateOrEra: '1838 - 1868',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nguyễn Trung Trực', 'Trường THCS Nguyễn Trung Trực', 'Hỏa hồng Nhật Tảo', 'Đốt tàu Hy Vọng', 'Đồn Rạch Giá', 'Bao giờ người Tây nhổ hết cỏ nước Nam'],
    sourceUrl: 'https://hcmcpv.org.vn',
    content: `1. THÂN THẾ VÀ TƯ CHẤT NGƯỜI ANH HÙNG DÂN TỘC:
Nguyễn Trung Trực (1838 - 1868), tên thuở nhỏ là Nguyễn Văn Lịch, sinh ra trong một gia đình làm nghề chài lưới bên bờ sông Vàm Cỏ, thuộc làng Bình Đức, phủ Tân An (nay thuộc xã Bình Đức, huyện Bến Lức, tỉnh Long An). Từ nhỏ, ông đã có tư chất thông minh, sức khỏe phi thường, tinh thần trượng nghĩa và lòng căm thù giặc sâu sắc khi chứng kiến cảnh thực dân Pháp xâm chiếm nước ta.

2. HAI CHIẾN CÔNG HIỂN HÁCH LỪNG LẪY NON SÔNG:
- Chiến công thứ nhất: Hỏa công đốt cháy tàu chiến L'Espérance (Hy Vọng) của Pháp ngày 10/12/1861 trên sông Nhật Tảo.
  Dưới sự chỉ huy mưu trí của ông, nghĩa quân đã ngụy trang áp sát tàu tuần tra tối tân bậc nhất của giặc Pháp, đồng loạt tấn công và châm ngòi hỏa công thiêu rụi toàn bộ tàu chiến cùng quân lính Pháp, làm nức lòng đồng bào cả nước. Danh sĩ Huỳnh Mẫn Đạt đã ca ngợi: "Hỏa hồng Nhật Tảo oanh thiên địa" (Lửa đỏ Nhật Tảo rực trời đất).
- Chiến công thứ hai: Tập kích tiêu diệt đồn Rạch Giá đêm ngày 16/6/1968.
  Nghĩa quân bất ngờ tấn công đánh chiếm tòa thành đầu não của giặc Pháp tại Rạch Giá, tiêu diệt tên chủ tỉnh và toàn bộ quân đồn trú, làm rung chuyển cả hệ thống cai trị của thực dân Pháp ở Nam Bộ. Danh sĩ Huỳnh Mẫn Đạt tiếp tục đề tặng: "Kiếm bạt Kiên Giang khấp quỷ thần" (Kiếm tuốt Kiên Giang quỷ thần khóc).

3. KHÍ TIẾT HIÊN NGANG VÀ CÂU NÓI BẤT HỦ TRƯỚC PHÁP TRƯỜNG:
Sau đó, giặc Pháp tập trung binh lực đàn áp khốc liệt và bắt giữ mẹ già cùng đồng bào để ép ông ra nộp mình. Để cứu tính mạng của mẹ và nhân dân, ông đã chấp nhận hy sinh. Giặc Pháp dùng nhiều bổng lộc, chức tước để mua chuộc dụ dỗ ông quy hàng. Trước mặt bọn xâm lược, ông đã khảng khái tuyên bố câu nói bất hủ khắc sâu vào lịch sử ngàn đời:
"BAO GIỜ NGƯỜI TÂY NHỔ HẾT CỎ NƯỚC NAM THÌ MỚI HẾT NGƯỜI NAM ĐÁNH TÂY!".
Ngày 27 tháng 10 năm 1868, người anh hùng Nguyễn Trung Trực đã hiên ngang đón nhận cái chết tại chợ Rạch Giá khi mới tròn 30 tuổi.

4. NIỀM TỰ HÀO CỦA TRƯỜNG THCS NGUYỄN TRUNG TRỰC:
Được học tập và rèn luyện dưới mái trường vinh dự mang tên Anh hùng dân tộc Nguyễn Trung Trực tại Phường Thới An, Thành phố Hồ Chí Minh, mỗi học sinh luôn khắc ghi truyền thống bất khuất của Người anh hùng áo vải, không ngừng trau dồi tri thức, rèn luyện phẩm chất để trở thành những công dân có ích, xứng đáng với truyền thống vẻ vang của dân tộc.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      schoolPatron: 'Anh hùng dân tộc bảo trợ danh hiệu nhà trường',
      monumentLocations: ['Rạch Giá, Kiên Giang', 'Nhật Tảo, Long An']
    }
  },

  {
    id: 'DOC-HCM-036',
    title: 'Vườn Cau Đỏ – Di tích lịch sử căn cứ cách mạng kiên cường',
    category: 'hcmc-history',
    categoryLabel: 'Lịch sử Thành phố Hồ Chí Minh',
    authorOrSource: 'Tư liệu Lịch sử Đảng bộ & Ban Quản lý Di tích Thành phố Hồ Chí Minh',
    dateOrEra: '1945 - Hiện hành',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Vườn Cau Đỏ', 'Căn cứ lõm', 'Chiến khu An Phú Đông', 'Thới An', 'Thạnh Xuân', 'Địa chỉ đỏ', 'Sài Gòn - Gia Định'],
    sourceUrl: 'https://hcmcpv.org.vn',
    content: `1. VỊ TRÍ ĐỊA LÝ VÀ ĐẶC ĐIỂM TỰ NHIÊN:
Khu di tích lịch sử - Khu tưởng niệm Vườn Cau Đỏ tọa lạc tại số 12 đường Thạnh Xuân 52, Thành phố Hồ Chí Minh, nằm ở vị trí giao thoa truyền thống giữa các vùng đất Thới An, Thạnh Xuân và Thạnh Lộc.
Vùng đất này trước đây là vùng bán đảo trũng thấp ven sông Sài Gòn, kênh rạch chằng chịt, sình lầy hiểm trở, nổi bật với những cánh rừng cau bạt ngàn xen lẫn những vườn trầu xanh ngát của người dân lao động hiền hòa, chất phác.

2. NGUỒN GỐC TÊN GỌI VÀ Ý NGHĨA THIÊNG LIÊNG CỦA CHỮ "ĐỎ":
- Tên gọi Vườn Cau Đỏ bắt nguồn từ thực tế địa hình trồng cau bạt ngàn. Nhưng trong hai cuộc kháng chiến chống thực dân Pháp và đế quốc Mỹ xâm lược, do vị trí chiến lược sát nách Sài Gòn, quân giặc đã điên cuồng dội bom đạn, pháo kích và rải chất độc hóa học xuống khu vực này. Thân cau và ngọn cau bị bom đạn cháy xém, ngả sang màu úa đỏ rực.
- Đặc biệt, chữ "ĐỎ" mang tầng ý nghĩa sâu xa và thiêng liêng nhất: Đó là màu cờ đỏ sao vàng cách mạng mà nhân dân một lòng bảo vệ; là màu máu đỏ của biết bao anh hùng liệt sĩ, cán bộ kiên trung và đồng bào yêu nước đã dũng cảm ngã xuống để che chở cán bộ, giữ vững ngọn lửa kháng chiến cho tới ngày toàn thắng.

3. VAI TRÒ CĂN CỨ ĐỊA CÁCH MẠNG CHIẾN LƯỢC:
- Ngày 25/12/1945, ngay tại Vườn Cau Đỏ, Hội nghị cán bộ chủ chốt tỉnh Gia Định đã họp và ra quyết định lịch sử thành lập Chiến khu An Phú Đông (bao gồm các xã An Phú Đông, Thạnh Lộc, Quới Xuân). Nơi đây trở thành pháo đài thép kiên cường, trung tâm lãnh đạo kháng chiến ở cửa ngõ Tây Bắc Sài Gòn.
- Trong thời kỳ chống Mỹ, Vườn Cau Đỏ được xây dựng thành một "căn cứ lõm" độc đáo: đóng ngay trong lòng địch, giữa vòng vây đồn bốt kìm kẹp nhưng nhờ lòng dân che chở, các cơ quan đầu não của Xứ ủy, Khu ủy Sài Gòn - Gia Định vẫn bám trụ an toàn.
- Nơi đây là trạm dừng chân, tập kết lực lượng của Trung đoàn Gia Định, bộ đội Gò Môn, E115 chuẩn bị bàn đạp xuất kích tiến công vào các cơ quan đầu não của giặc trong cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 và Chiến dịch Hồ Chí Minh lịch sử mùa Xuân năm 1975.

4. KHU TƯỞNG NIỆM VƯỜN CAU ĐỎ NGÀY NAY:
Năm 2010, Đảng bộ và nhân dân địa phương đã xây dựng Khu tưởng niệm Vườn Cau Đỏ trang nghiêm với diện tích hơn 4.000 m². Tượng đài trung tâm là hình ảnh biểu tượng hai hàng cau cao vút đan lá vào nhau thể hiện tình quân dân gắn bó keo sơn máu thịt. Di tích là địa chỉ đỏ truyền thống, nơi thầy trò Trường THCS Nguyễn Trung Trực thường xuyên tổ chức các hoạt động về nguồn, báo công dâng Bác và kết nạp Đội viên, Đoàn viên mới.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      siteArea: 'Hơn 4.000 m2',
      memorialYear: 2010,
      classification: 'Địa chỉ đỏ di tích lịch sử cấp địa phương'
    }
  },

  {
    id: 'DOC-HCM-037',
    title: 'Bến Nhà Rồng – Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước (05/06/1911)',
    category: 'bio-career',
    categoryLabel: 'Chủ tịch Hồ Chí Minh – Tiểu sử và sự nghiệp',
    authorOrSource: 'Bảo tàng Hồ Chí Minh - Chi nhánh Thành phố Hồ Chí Minh',
    dateOrEra: '05/06/1911 - Hiện hành',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Bến Nhà Rồng', 'Nguyễn Tất Thành', 'Văn Ba', 'Tàu Amiral Latouche-Tréville', 'Tìm đường cứu nước', '05/06/1911'],
    sourceUrl: 'https://baotanghochiminh.vn',
    content: `1. BỐI CẢNH LỊCH SỬ VÀ Ý CHÍ CỨU NƯỚC CỦA NGƯỜI THANH NIÊN YÊU NƯỚC:
Đầu thế kỷ XX, đất nước ta chìm trong đêm dài nô lệ dưới ách thống trị tàn bạo của thực dân Pháp. Các phong trào yêu nước theo khuynh hướng phong kiến (Cần Vương) hay dân chủ tư sản (Đông Du của Phan Bội Châu, Duy Tân của Phan Châu Trinh) đều lần lượt thất bại.
Người thanh niên yêu nước Nguyễn Tất Thành (khi đó mới 21 tuổi), với tầm nhìn chiến lược vượt thời đại, đã không đi theo con đường mòn của các bậc tiền bối. Người nung nấu một quyết định táo bạo: Đi sang phương Tây - nơi khởi nguồn của khẩu hiệu "Tự do - Bình đẳng - Bác ái", để xem nước Pháp và các nước khác làm như thế nào, rồi trở về giúp đỡ đồng bào mình.

2. DẤU MỐC LỊCH SỬ NGÀY 05/06/1911 TẠI BẾN CẢNG SÀI GÒN:
Ngày 5 tháng 6 năm 1911, từ Bến cảng Nhà Rồng (Sài Gòn), với tên gọi "Văn Ba", Người bước chân lên con tàu buôn Amiral Latouche-Tréville của hãng vận tải Năm Sao (Pháp), nhận làm công việc phụ bếp nặng nhọc nhất để bắt đầu cuộc hành trình vĩ đại kéo dài suốt 30 năm bôn ba qua 3 đại dương, 4 châu lục và gần 30 quốc gia trên thế giới.
Hành trang mang theo của Người chỉ có lòng yêu nước nồng nàn, bầu nhiệt huyết của tuổi trẻ và hai bàn tay lao động cần cù.

3. TẦM VÓC THỜI ĐẠI CỦA SỰ KIỆN:
Sự kiện ngày 5/6/1911 đã mở ra bước ngoặt quyết định cho vận mệnh dân tộc Việt Nam. Chính từ cuộc bôn ba khảo sát thực tiễn ấy, Người đã tìm thấy ánh sáng của Chủ nghĩa Mác - Lênin, khẳng định con đường cứu nước duy nhất đúng đắn: Con đường cách mạng vô sản, độc lập dân tộc gắn liền với chủ nghĩa xã hội.

4. BẾN NHÀ RỒNG TRONG TRÁI TIM NGƯỜI DÂN THÀNH PHỐ:
Tòa nhà Bến Nhà Rồng ngày nay là Bảo tàng Hồ Chí Minh - Chi nhánh TP.HCM, tọa lạc tại số 01 đường Nguyễn Tất Thành, Quận 4. Nơi đây lưu giữ hàng nghìn hiện vật quý giá về cuộc đời hoạt động cách mạng của Bác và là biểu tượng thiêng liêng thể hiện tấm lòng son sắt thủy chung của đồng bào miền Nam, nhân dân TP.HCM đối với Chủ tịch Hồ Chí Minh vĩ đại.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      monumentName: 'Bảo tàng Hồ Chí Minh - Chi nhánh TP.HCM',
      departureDate: '05/06/1911'
    }
  },

  {
    id: 'DOC-HCM-038',
    title: 'Nghị quyết Đại hội Đảng bộ TP.HCM lần thứ XI về xây dựng Không gian văn hóa Hồ Chí Minh',
    category: 'hcm-cultural-space',
    categoryLabel: 'Không gian văn hóa Hồ Chí Minh TP.HCM',
    authorOrSource: 'Đảng bộ Thành phố Hồ Chí Minh (Văn kiện Đại hội XI nhiệm kỳ 2020-2025)',
    dateOrEra: '2020 - 2025',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Không gian văn hóa Hồ Chí Minh', 'Đại hội XI Đảng bộ TP.HCM', 'Giá trị văn hóa', 'Con người thành phố', 'Thành phố mang tên Bác'],
    sourceUrl: 'https://hcmcpv.org.vn',
    content: `1. MỤC TIÊU VÀ TẦM NHÌN CHIẾN LƯỢC:
Đại hội đại biểu Đảng bộ Thành phố Hồ Chí Minh lần thứ XI (nhiệm kỳ 2020 - 2025) đã đề ra chủ trương mang tính đột phá và nhân văn sâu sắc: "Xây dựng Thành phố Hồ Chí Minh trở thành Không gian văn hóa Hồ Chí Minh".
Mục tiêu là làm cho tư tưởng, đạo đức, phong cách và sự nghiệp của Chủ tịch Hồ Chí Minh thấm sâu vào đời sống xã hội, trở thành nền tảng tinh thần vững chắc, nét văn hóa đặc trưng, nếp sống nghĩa tình tiêu biểu của cán bộ, đảng viên và nhân dân thành phố mang tên Bác.

2. BA TRỤ CỘT CỦA KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH:
- Trụ cột 1: Không gian văn hóa vật thể
  Quy hoạch, trùng tu, nâng cấp các di tích lịch sử, bảo tàng, nhà lưu niệm, tượng đài Bác Hồ và các công trình văn hóa công cộng mang dấu ấn lịch sử trên địa bàn thành phố, tạo thành mạng lưới địa chỉ đỏ giáo dục truyền thống cho nhân dân.
- Trụ cột 2: Không gian văn hóa phi vật thể
  Bồi đắp các giá trị văn hóa tinh thần, lối sống nghĩa tình, tinh thần tương thân tương ái, "mình vì mọi người", xây dựng chuẩn mực con người Thành phố Hồ Chí Minh: văn minh, hiện đại, nghĩa tình, trung thực, trách nhiệm và năng động sáng tạo.
- Trụ cột 3: Không gian văn hóa số trên không gian mạng
  Ứng dụng mạnh mẽ chuyển đổi số để xây dựng các nền tảng trực tuyến: thư viện số, không gian thực tế ảo 3D, hệ thống trợ lý AI học đường nhằm đưa kho tư liệu quý giá về Bác Hồ đến gần hơn với thế hệ trẻ mọi lúc, mọi nơi.

3. TRÁCH NHIỆM CỦA NGÀNH GIÁO DỤC VÀ NHÀ TRƯỜNG:
Mỗi trường học trên địa bàn thành phố, trong đó có Trường THCS Nguyễn Trung Trực tại Phường Thới An, Thành phố Hồ Chí Minh, phải là một "Không gian văn hóa Hồ Chí Minh thu nhỏ" sinh động, nơi thầy cô mẫu mực, học trò chăm ngoan, môi trường học đường tràn đầy tình yêu thương, kỷ cương và hạnh phúc.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      congressSession: 'Đại hội Đảng bộ TP.HCM lần thứ XI',
      period: '2020 - 2025'
    }
  },

  {
    id: 'DOC-HCM-039',
    title: 'Mô hình Trường học hạnh phúc gắn liền với Không gian văn hóa Hồ Chí Minh tại trường THCS',
    category: 'hcm-cultural-space',
    categoryLabel: 'Không gian văn hóa Hồ Chí Minh TP.HCM',
    authorOrSource: 'Sở Giáo dục và Đào tạo Thành phố Hồ Chí Minh',
    dateOrEra: '2023 - 2026',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Trường học hạnh phúc', 'Không gian văn hóa số', 'THCS Nguyễn Trung Trực', 'Thầy cô hạnh phúc', 'Học sinh tích cực'],
    sourceUrl: 'https://hcm.edu.vn',
    content: `1. KHÁI NIỆM TRƯỜNG HỌC HẠNH PHÚC:
Theo định hướng của Sở GD&ĐT Thành phố Hồ Chí Minh, "Trường học hạnh phúc" là môi trường giáo dục được xây dựng dựa trên ba giá trị cốt lõi: YÊU THƯƠNG - AN TOÀN - TÔN TRỌNG. Đó là nơi mỗi ngày đến trường của học sinh thực sự là một ngày vui; nơi thầy cô giáo tìm thấy nguồn cảm hứng sáng tạo và được thấu hiểu; nơi không có áp lực tiêu cực hay bạo lực học đường.

2. MỐI QUAN HỆ HỮU CƠ VỚI KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH:
Xây dựng Không gian văn hóa Hồ Chí Minh trong trường học chính là giải pháp nền tảng vững chắc nhất để kiến tạo Trường học hạnh phúc:
- Lấy tư tưởng giáo dục của Bác "Dạy tốt, học tốt", "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người" làm kim chỉ nam cho mọi hoạt động sư phạm.
- Triển khai phong trào "Mỗi ngày một việc tốt theo lời Bác dạy": Khuyến khích học sinh biết nói lời cảm ơn, xin lỗi, chia sẻ đồ dùng học tập với bạn nghèo, nhặt được của rơi trả người đánh mất.
- Xây dựng góc thư viện Bác Hồ và phòng truyền thống số: Giúp các em học sinh tự do khám phá, đọc sách, nghiên cứu lịch sử và tương tác với trợ lý ảo trong không gian học tập cởi mở, thân thiện.

3. BỘ TIÊU CHÍ ĐÁNH GIÁ TẠI TRƯỜNG THCS NGUYỄN TRUNG TRỰC:
- Tiêu chí 1 về Môi trường nhà trường: Cảnh quan xanh, sạch, đẹp, an toàn, có các biển bảng trích dẫn lời Bác dạy phù hợp tâm lý lứa tuổi.
- Tiêu chí 2 về Hoạt động dạy và học: Thầy cô đổi mới phương pháp giảng dạy, khích lệ sự tự tin sáng tạo của học sinh, không dùng hình phạt xúc phạm danh dự.
- Tiêu chí 3 về Mối quan hệ ứng xử: Xây dựng văn hóa giao tiếp thanh lịch, lễ phép, đoàn kết, chan hòa tình thầy trò và bạn bè.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      governingBody: 'Sở GD&ĐT TP.HCM',
      schoolApplication: 'Trường THCS Nguyễn Trung Trực'
    }
  },

  {
    id: 'DOC-HCM-040',
    title: 'Chỉ thị số 05-CT/TW của Bộ Chính trị về đẩy mạnh học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    category: 'official-dispatches',
    categoryLabel: 'Tài liệu chính thức của cơ quan quản lý',
    authorOrSource: 'Bộ Chính trị Ban Chấp hành Trung ương Đảng khóa XII',
    dateOrEra: '15/05/2016',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Chỉ thị 05-CT/TW', 'Bộ Chính trị', 'Đạo đức phong cách Hồ Chí Minh', 'Giáo dục học đường', 'Chi bộ nhà trường'],
    sourceUrl: 'https://tulieuvankien.dangcongsan.vn',
    content: `1. MỤC TIÊU VÀ Ý NGHĨA CỦA CHỈ THỊ SỐ 05-CT/TW:
Ngày 15 tháng 5 năm 2016, Bộ Chính trị khóa XII đã ban hành Chỉ thị số 05-CT/TW về "Đẩy mạnh học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh".
Chỉ thị nhấn mạnh: Việc học tập và làm theo Bác là một nội dung quan trọng của công tác xây dựng, chỉnh đốn Đảng; góp phần xây dựng Đảng trong sạch, vững mạnh về chính trị, tư tưởng, tổ chức và đạo đức; xây dựng đội ngũ cán bộ, công chức đủ năng lực, phẩm chất, ngang tầm nhiệm vụ; ngăn chặn, đẩy lùi sự suy thoái về tư tưởng chính trị, đạo đức, lối sống.

2. CÁC NỘI DUNG TRỌNG TÂM TRONG NGÀNH GIÁO DỤC:
- Đổi mới, nâng cao chất lượng giảng dạy và học tập tư tưởng, đạo đức, phong cách Hồ Chí Minh trong hệ thống giáo dục quốc dân, phù hợp với từng cấp học và lứa tuổi học sinh THCS.
- Xây dựng đạo đức nhà giáo: Mỗi thầy giáo, cô giáo là một tấm gương sáng về đạo đức, tự học và sáng tạo để học sinh noi theo; kiên quyết chống tiêu cực, bệnh thành tích trong thi cử và bệnh hình thức trong thi đua.
- Giáo dục lý tưởng cách mạng cho thế hệ trẻ: Tăng cường giáo dục truyền thống yêu nước, lòng tự hào dân tộc, bồi dưỡng đạo đức trong sáng, lối sống lành mạnh, tinh thần trách nhiệm với bản thân, gia đình và cộng đồng xã hội.

3. CHƯƠNG TRÌNH HÀNH ĐỘNG CỦA TRƯỜNG THCS NGUYỄN TRUNG TRỰC:
Chi bộ và Ban Giám hiệu nhà trường cụ thể hóa Chỉ thị 05-CT/TW vào kế hoạch nhiệm vụ năm học:
- Tích hợp nội dung học tập và làm theo Bác vào các môn học: Lịch sử, Ngữ văn, Giáo dục công dân, Hoạt động trải nghiệm hướng nghiệp.
- Tổ chức các hội thi trực tuyến tìm hiểu lịch sử, thi kể chuyện tấm gương đạo đức Bác Hồ và bình chọn gương điển hình học sinh chăm ngoan, tiến bộ mỗi tháng.`,
    metadata: {
      batch: 'BATCH_C_EXPANSION_01',
      directiveNumber: '05-CT/TW',
      issuingBody: 'Bộ Chính trị Ban Chấp hành Trung ương Đảng'
    }
  },

  // ============================================================================
  // BATCH D: BỔ SUNG TRI THỨC TỪ TỦ SÁCH ĐIỆN TỬ HỒ CHÍ MINH (HOCHIMINH.VN)
  // (DOC-HCM-041 đến DOC-HCM-046) - Nguồn kiểm chứng: hochiminh.vn (categoryId=3000402)
  // ============================================================================

  {
    id: 'DOC-HCM-041',
    title: 'Học ở trường, học ở sách vở, học lẫn nhau và học nhân dân – Phương pháp học tập suốt đời của Chủ tịch Hồ Chí Minh',
    category: 'teachings-children',
    categoryLabel: 'Những lời dạy của Bác đối với thiếu nhi',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Tủ sách điện tử Hồ Chí Minh (hochiminh.vn) & NXB Trẻ',
    dateOrEra: '1945 - 1969',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Tự học', 'Phương pháp học tập', 'Học suốt đời', 'Học ở nhân dân', 'Học sinh THCS', 'Tủ sách điện tử Hồ Chí Minh'],
    sourceUrl: 'https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/hoc-o-truong-hoc-o-sach-vo-hoc-lan-nhau-va-hoc-nhan-dan-484',
    content: `1. LỜI HUẤN THỊ CỐT LÕI CỦA CHỦ TỊCH HỒ CHÍ MINH VỀ VIỆC HỌC:
Sinh thời, Chủ tịch Hồ Chí Minh luôn căn dặn cán bộ, giáo viên và học sinh:
"Học ở trường, học ở sách vở, học lẫn nhau và học nhân dân, không học nhân dân là một thiếu sót rất lớn".
Theo Bác, tri thức không bao giờ đóng khung trong bốn bức tường lớp học. Trường học cung cấp nền tảng kiến thức căn bản, nhưng người học muốn thực sự trưởng thành và đóng góp cho đất nước thì phải mở rộng không gian học tập ra toàn bộ đời sống xã hội.

2. NGUYÊN LÝ TỰ HỌC VÀ HỌC TẬP SUỐT ĐỜI:
- Học đi đôi với hành: "Học để hành: Học với hành phải đi đôi. Học mà không hành thì vô ích. Hành mà không học thì hành không trôi chảy".
- Học suốt đời: "Còn sống thì còn phải học", "Đường đời là một chiếc thang không có nấc chót; việc học là một quyển sách không có trang cuối cùng".
- Rèn luyện óc suy nghĩ độc lập: Bác phê phán gay gắt lối học vẹt, học tủ, học chỉ để lấy bằng cấp đối phó. Người yêu cầu học trò phải có tinh thần tự lực cánh sinh, đào sâu suy nghĩ, dám thắc mắc và tìm tòi chân lý.

3. TẤM GƯƠNG TỰ HỌC SÁNG NGỜI CỦA BÁC HỒ:
- Trong hơn 30 năm bôn ba qua gần 30 quốc gia trên thế giới, Người vừa lao động nặng nhọc (phụ bếp, cào tuyết, thợ ảnh, viết báo) vừa kiên trì tự học ngoại ngữ và các môn khoa học xã hội.
- Mỗi ngày Người quy định phải học và ghi nhớ một số từ mới, viết chữ lên cánh tay để vừa làm việc vừa nhẩm thuộc lòng. Nhờ tinh thần tự học phi thường, Người đã sử dụng thông thạo nhiều ngoại ngữ như tiếng Pháp, Anh, Nga, Trung Quốc, Đức, Tây Ban Nha, Ý...

4. BÀI HỌC VẬN DỤNG CHO ĐỘI VIÊN, HỌC SINH THCS NGUYỄN TRUNG TRỰC:
- Xây dựng thói quen đọc sách mỗi ngày tại Thư viện thông minh và Không gian văn hóa Hồ Chí Minh của trường.
- Tinh thần "học lẫn nhau": Tích cực tham gia mô hình "Đôi bạn cùng tiến", học nhóm, giúp đỡ bạn bè học yếu cùng vươn lên.
- Tinh thần "học nhân dân": Biết lễ phép, lắng nghe, học hỏi những đức tính cần cù, thật thà, yêu lao động từ ông bà, cha mẹ và người lao động xung quanh.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      bookId: 484,
      pdfUrl: 'https://hochiminh.vn/upload/3000001/20251024/06027212f502726cbace66eb3f4cfb2bHoc-o-truong--HCM.pdf',
      publisher: 'NXB Trẻ & hochiminh.vn'
    }
  },

  {
    id: 'DOC-HCM-042',
    title: 'Tác phẩm "Văn hóa soi đường cho quốc dân đi" – Tư tưởng Hồ Chí Minh về xây dựng nền văn hóa Việt Nam tiên tiến',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Vang vọng lời nước non (Tập 8), NXB Chính trị quốc gia Sự thật & hochiminh.vn',
    dateOrEra: '24/11/1946',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Văn hóa soi đường cho quốc dân đi', 'Hội nghị Văn hóa toàn quốc 1946', 'Nền văn hóa mới', 'Đạo đức văn hóa', 'Không gian văn hóa Hồ Chí Minh'],
    sourceUrl: 'https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/vang-vong-loi-nuoc-non-tap-8-van-hoa-soi-duong-cho-quoc-dan-di-463',
    content: `1. BỐI CẢNH VÀ LUẬN ĐIỂM LỊCH SỬ TẠI HỘI NGHỊ VĂN HÓA TOÀN QUỐC 1946:
Ngày 24 tháng 11 năm 1946, tại Nhà hát Lớn Hà Nội, Hội nghị Văn hóa toàn quốc lần thứ nhất đã long trọng khai mạc.
Tại diễn đàn này, Chủ tịch Hồ Chí Minh đã khẳng định luận điểm bất hủ mang tính định hướng chiến lược:
"Văn hóa soi đường cho quốc dân đi".
Người nhấn mạnh: Văn hóa không phải là thứ trang sức bên ngoài xã hội, mà văn hóa chính là ngọn đuốc dẫn đường, bồi đắp tâm hồn, khai sáng dân trí và khơi dậy khát vọng độc lập, tự do, tự cường của toàn thể dân tộc.

2. ĐỊNH NGHĨA KHOA HỌC VÀ TOÀN DIỆN CỦA HỒ CHÍ MINH VỀ VĂN HÓA:
Tháng 8 năm 1943, trong trang sổ tay "Nhật ký trong tù", Bác Hồ đã ghi lại định nghĩa sâu sắc về văn hóa:
"Vì lẽ sinh tồn cũng như mục đích của cuộc sống, loài người mới sáng tạo và phát minh ra ngôn ngữ, chữ viết, đạo đức, pháp luật, khoa học, tôn giáo, văn học, nghệ thuật, những công cụ cho sinh hoạt hằng ngày về mặc, ăn, ở và các phương thức sử dụng. Toàn bộ những sáng tạo và phát minh đó tức là văn hóa".

3. MỐI QUAN HỆ GIỮA VĂN HÓA VỚI CHÍNH TRỊ VÀ KINH TẾ:
- Bác chỉ rõ: Văn hóa không thể đứng ngoài mà phải ở trong kinh tế và chính trị.
- Kinh tế phát triển sẽ tạo tiền đề vật chất cho văn hóa nảy nở; nhưng văn hóa lại là động lực nội sinh, nâng đỡ đạo đức xã hội, ngăn ngừa sự tha hóa, suy đồi nhân cách.
- Nền văn hóa mới Việt Nam phải thấm nhuần 3 tính chất căn bản: Dân tộc, Khoa học và Đại chúng.

4. Ý NGHĨA ĐỐI VỚI KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH HỌC ĐƯỜNG:
- Luận điểm "Văn hóa soi đường cho quốc dân đi" chính là kim chỉ nam cho việc xây dựng Không gian văn hóa Hồ Chí Minh tại Trường THCS Nguyễn Trung Trực (Phường Thới An, TP.HCM).
- Không gian văn hóa Hồ Chí Minh học đường không dừng lại ở các pano, triển lãm tĩnh, mà phải thẩm thấu vào văn hóa ứng xử hằng ngày: nếp sống văn minh, thầy mẫu mực, trò chăm ngoan, trung thực trong thi cử và tương thân tương ái giữa các học sinh.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      bookId: 463,
      pdfUrl: 'https://hochiminh.vn/upload/3000001/20251024/43ff43ed3f86cd37ac3683f7aea3813avang-vong-loi-nuoc-non-tap-8.pdf',
      publisher: 'NXB Chính trị quốc gia Sự thật & hochiminh.vn'
    }
  },

  {
    id: 'DOC-HCM-043',
    title: 'Tác phẩm "Đại đoàn kết là một lực lượng tất thắng" – Cội nguồn sức mạnh dân tộc theo tư tưởng Hồ Chí Minh',
    category: 'ideology-ethics',
    categoryLabel: 'Tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - Vang vọng lời nước non (Tập 9), NXB Chính trị quốc gia Sự thật & hochiminh.vn',
    dateOrEra: '1930 - 1969',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Đại đoàn kết toàn dân tộc', 'Đoàn kết đoàn kết đại đoàn kết', 'Sức mạnh dân tộc', 'Yêu thương đồng bào', 'Đoàn kết học đường'],
    sourceUrl: 'https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/vang-vong-loi-nuoc-non-tap-9-dai-doan-ket-la-mot-luc-luong-tat-thang-464',
    content: `1. CHÂN LÝ BẤT HỦ VỀ ĐẠI ĐOÀN KẾT:
Trong suốt cuộc đời hoạt động cách mạng của mình, Chủ tịch Hồ Chí Minh đã đúc kết chân lý lịch sử vĩ đại:
"Đoàn kết, đoàn kết, đại đoàn kết,
Thành công, thành công, đại thành công!".
Đoàn kết không chỉ là một sách lược chính trị nhất thời, mà là đường lối chiến lược sống còn, xuyên suốt của cách mạng Việt Nam, là cội nguồn tạo nên sức mạnh vô địch giúp dân tộc ta chiến thắng mọi kẻ thù xâm lược và vượt qua mọi bão giông thử thách.

2. NGUYÊN TẮC VÀ LỰC LƯỢNG CỦA KHỐI ĐẠI ĐOÀN KẾT:
- Đại đoàn kết toàn dân tộc: Tập hợp không phân biệt tôn giáo (lương hay giáo), không phân biệt giai cấp, gái trai, già trẻ, 54 dân tộc anh em cùng chung một dải non sông đất nước.
- Lấy liên minh công - nông - trí thức làm nền tảng, dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
- Kết hợp đại đoàn kết toàn dân tộc với đoàn kết quốc tế: Tranh thủ sự ủng hộ của các lực lượng tiến bộ, yêu chuộng hòa bình trên toàn thế giới vì mục tiêu độc lập, tự do và tình huynh đệ nhân loại.

3. LỜI DẶN DÒ TÂM HUYẾT VỀ ĐOÀN KẾT TRONG DI CHÚC (1969):
Trước lúc đi xa, Người đã thiết tha căn dặn:
"Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta. Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình".

4. BÀI HỌC THỰC TIỄN CHO HỌC SINH THCS NGUYỄN TRUNG TRỰC:
- Rèn luyện Điều 3 trong 5 Điều Bác Hồ dạy: "Đoàn kết tốt, kỷ luật tốt".
- Tinh thần đồng đội và tình bạn trong sáng: Biết bao dung, sẻ chia khó khăn, tương trợ bạn bè trong học tập, kiên quyết bài trừ vấn nạn bạo lực học đường và chia rẽ bè phái.
- Chung tay xây dựng tập thể lớp đoàn kết vững mạnh, ngôi trường hạnh phúc nghĩa tình tại Phường Thới An.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      bookId: 464,
      pdfUrl: 'https://hochiminh.vn/upload/3000001/20251024/7efb763da178a1e30c1e72126c829714vang-vong-loi-nuoc-non-tap-9-%C4%91%C3%A3-n%C3%A9n.pdf',
      publisher: 'NXB Chính trị quốc gia Sự thật & hochiminh.vn'
    }
  },

  {
    id: 'DOC-HCM-044',
    title: 'Ký sự "Một giờ với đồng chí Hồ Chí Minh" – Tầm vóc văn hóa Nguyễn Ái Quốc qua góc nhìn báo chí quốc tế năm 1923',
    category: 'bio-career',
    categoryLabel: 'Cuộc đời và sự nghiệp Chủ tịch Hồ Chí Minh',
    authorOrSource: 'Nhà báo Osip Mandelstam (Tạp chí Ogoniok Liên Xô 1923), NXB Chính trị quốc gia Sự thật & hochiminh.vn',
    dateOrEra: '23/12/1923',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Nguyễn Ái Quốc', 'Osip Mandelstam', 'Tạp chí Ogoniok', 'Moskva 1923', 'Văn hóa tương lai', 'Tình huynh đệ quốc tế'],
    sourceUrl: 'https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/mot-gio-voi-dong-chi-ho-chi-minh-475',
    content: `1. HOÀN CẢNH LỊCH SỬ CỦA BÀI KÝ SỰ BÁO CHÍ NĂM 1923:
Tháng 6 năm 1923, người thanh niên yêu nước Nguyễn Ái Quốc rời Paris sang thủ đô Moskva (Liên Xô) để dự Hội nghị Quốc tế Nông dân và chuẩn bị tham dự Đại hội V Quốc tế Cộng sản.
Vào tháng 12 năm 1923, Osip Mandelstam - nhà thơ, nhà báo danh tiếng của nước Nga Xô Viết đã có một cuộc tiếp xúc, phỏng vấn đặc biệt với Người. Bài ký sự mang tựa đề "Thăm một chiến sĩ Quốc tế Cộng sản - Nguyễn Ái Quốc" được đăng trên Tạp chí Ogoniok (Ngọn lửa nhỏ) số 39 ngày 23/12/1923.

2. NHẬN ĐỊNH BẤT HỦ VỀ VĂN HÓA CỦA NGUYỄN ÁI QUỐC:
Trong bài ký sự, Osip Mandelstam đã ghi lại lời bình luận mang tầm tiên tri và dự báo sâu sắc về văn hóa:
"Từ Nguyễn Ái Quốc đã tỏa ra một thứ văn hóa, không phải văn hóa Âu châu, mà có lẽ là một nền văn hóa của tương lai...
Qua cử chỉ cao thượng, tiếng nói trầm ấm của Nguyễn Ái Quốc, chúng ta như nghe thấy ngày mai, như thấy sự yên tĩnh mênh mông của tình huynh đệ toàn thế giới".

3. KHẮC HỌA CHÂN DUNG VÀ PHONG THÁI CỦA NGƯỜI THANH NIÊN VIỆT NAM:
- Tác giả miêu tả Nguyễn Ái Quốc: Một chàng thanh niên dáng người mảnh khảnh, khuôn mặt thanh tú, đôi mắt sáng rực toát lên sự thông tuệ và lòng quả cảm phi thường.
- Phong thái lịch thiệp, điềm tĩnh, khiêm nhường nhưng ẩn chứa một ý chí thép và khát vọng tự do cháy bỏng cho nhân dân bị áp bức ở xứ Đông Dương và khắp các thuộc địa.
- Sự kết hợp nhuần nhuyễn giữa chiều sâu văn hóa truyền thống phương Đông với những giá trị dân chủ, tự do tiến bộ của văn hóa phương Tây.

4. GIÁ TRỊ GIÁO DỤC LÝ TƯỞNG CHO HỌC SINH THCS:
- Tự hào về nhân cách và tầm vóc văn hóa toàn cầu của Bác Hồ ngay từ những năm tháng Người còn là người thanh niên trẻ tuổi bôn ba tìm đường cứu nước.
- Học tập ở Bác phong thái giao tiếp văn minh, hòa nhã, khiêm tốn, biết lắng nghe và tôn trọng người khác.
- Nuôi dưỡng tinh thần công dân toàn cầu: Mở rộng tầm nhìn tri thức ra thế giới bên ngoài nhưng luôn giữ trọn bản sắc văn hóa và lòng yêu nước nồng nàn của dân tộc Việt Nam.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      bookId: 475,
      pdfUrl: 'https://hochiminh.vn/upload/3000001/20251024/416d7d46d9cd711eee69ce36ec5dc253M%E1%BB%99t-gi%E1%BB%9D-v%E1%BB%9Bi-%C4%91%E1%BB%93ng-ch%C3%AD-H%E1%BB%93-ch%C3%AD-Minh.pdf',
      publisher: 'NXB Chính trị quốc gia Sự thật & hochiminh.vn'
    }
  },

  {
    id: 'DOC-HCM-045',
    title: 'Ký sự lịch sử "Giữ yên giấc ngủ của Người" – Kỳ tích giữ gìn thi hài Bác Hồ và công trình Lăng Chủ tịch Hồ Chí Minh',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản và tác phẩm văn hóa nghệ thuật',
    authorOrSource: 'NXB Quân đội Nhân dân, NXB Trẻ & Tủ sách điện tử hochiminh.vn',
    dateOrEra: '1969 - 1975 & Hiện nay',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Lăng Chủ tịch Hồ Chí Minh', 'Giữ yên giấc ngủ của Người', 'Bộ Tư lệnh Bảo vệ Lăng', 'Khu K84 Đá Chông', 'Quảng trường Ba Đình', 'Địa chỉ đỏ thiêng liêng'],
    sourceUrl: 'https://hochiminh.vn/book/tac-pham-ve-ho-chi-minh/tac-pham-trong-nuoc/giu-yen-giac-ngu-cua-nguoi-483',
    content: `1. BỐI CẢNH LỊCH SỬ THÁNG 9 NĂM 1969 VÀ QUYẾT ĐỊNH LỊCH SỬ CỦA ĐẢNG:
Ngày 2 tháng 9 năm 1969, Chủ tịch Hồ Chí Minh - vị lãnh tụ kính yêu của dân tộc Việt Nam qua đời.
Đáp ứng nguyện vọng thiết tha, thiêng liêng của toàn Đảng, toàn quân, toàn dân cả nước, đặc biệt là đồng bào chiến sĩ miền Nam ruột thịt đang trong khói lửa kháng chiến khát khao ngày thống nhất được gặp Bác, Bộ Chính trị và Trung ương Đảng đã quyết định:
"Phải giữ gìn lâu dài thi hài Bác Hồ và xây dựng Lăng của Người tại Quảng trường Ba Đình lịch sử để nhân dân cả nước và bầu bạn quốc tế mãi mãi được đến viếng Người".

2. KỲ TÍCH GIỮ GÌN BẢO VỆ TUYỆT ĐỐI AN TOÀN THI HÀI BÁC TRONG CHIẾN TRANH:
- Đội ngũ cán bộ y tế, chiến sĩ công binh Đoàn 69 (tiền thân của Bộ Tư lệnh Bảo vệ Lăng) phối hợp chặt chẽ với các chuyên gia y học hàng đầu của Liên Xô thực hiện nhiệm vụ bảo quản y tế thi hài Bác.
- Trong điều kiện máy bay Mỹ leo thang ném bom phá hoại miền Bắc dữ dội, thi hài Bác đã được di chuyển tuyệt mật, vượt qua hiểm nguy qua 6 lần sơ tán giữa các căn cứ:
  + Công trình 75A (Bệnh viện Trung ương Quân đội 108).
  + Căn cứ K84 (Khu căn cứ Đá Chông, Ba Vì, Hà Nội).
  + Căn cứ H21 và các hang đá an toàn ven rừng núi.
Mỗi chuyến hành quân di chuyển thi hài Bác đều là một chiến công thầm lặng, kỳ công và chan chứa nước mắt của cán bộ, chiến sĩ.

3. XÂY DỰNG CÔNG TRÌNH LĂNG CHỦ TỊCH HỒ CHÍ MINH:
- Khởi công ngày 2 tháng 9 năm 1973 và long trọng khánh thành ngày 29 tháng 8 năm 1975 tại Quảng trường Ba Đình lịch sử.
- Công trình là biểu tượng hội tụ tinh hoa và tình cảm của cả non sông: Đá hoa cương từ Thanh Hóa, đá cẩm thạch Ngũ Hành Sơn (Đà Nẵng), gỗ quý Tây Nguyên, cát từ sông Hồng và phù sa đất Mũi Cà Mau... cùng hàng vạn cây xanh quý giá từ khắp các miền quê được gửi về hội tụ bên Lăng Bác.

4. GIÁ TRỊ GIÁO DỤC TRUYỀN THỐNG "UỐNG NƯỚC NHỚ NGUỒN":
- Lăng Bác và Quảng trường Ba Đình là Địa chỉ đỏ thiêng liêng bậc nhất của dân tộc Việt Nam.
- Giáo dục học sinh lòng biết ơn sâu sắc đối với công lao trời biển của Bác Hồ và sự hy sinh to lớn của các thế hệ cha anh đi trước.
- Khơi dậy ý thức phấn đấu rèn luyện, sống xứng đáng với niềm tin yêu mà Bác đã trao trọn cho thế hệ tương lai.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      bookId: 483,
      pdfUrl: 'https://hochiminh.vn/upload/3000001/20251024/a3e23ccabaa80672d9956924ce57dd13Giu-yen-giac-ngu-cua-nguoi.pdf',
      publisher: 'NXB Quân đội Nhân dân & hochiminh.vn'
    }
  },

  {
    id: 'DOC-HCM-046',
    title: 'Tác phẩm "Bản án chế độ thực dân Pháp" (1925) – Đòn sấm sét chính luận vạch trần tội ác của chủ nghĩa thực dân',
    category: 'cultural-heritage',
    categoryLabel: 'Di sản và tác phẩm văn hóa nghệ thuật',
    authorOrSource: 'Nguyễn Ái Quốc - Thư quán Lao động Paris (1925), NXB Sự thật tái bản & hochiminh.vn',
    dateOrEra: '1925',
    status: 'APPROVED',
    isAllowedForRag: true,
    topics: ['Bản án chế độ thực dân Pháp', 'Nguyễn Ái Quốc', 'Paris 1925', 'Le Procès de la colonisation française', 'Thuế máu', 'Gửi thanh niên An Nam'],
    sourceUrl: 'https://hochiminh.vn/tu-sach-dien-tu-ho-chi-minh?categoryId=3000402',
    content: `1. BỐI CẢNH RA ĐỜI CỦA TÁC PHẨM CHÍNH LUẬN NĂM 1925:
Năm 1925, tác phẩm "Bản án chế độ thực dân Pháp" (nguyên bản tiếng Pháp: "Le Procès de la colonisation française") của đồng chí Nguyễn Ái Quốc được xuất bản lần đầu tiên tại Paris bởi Thư quán Lao động (Librairie du Travail).
Tác phẩm gồm 12 chương và một phần Phụ lục nổi tiếng: "Gửi thanh niên An Nam".
Đây là bản cáo trạng đanh thép, mang tính khoa học và thực tiễn sâu sắc, vạch trần toàn bộ bản chất dã man, tàn bạo, phi nhân đạo của chế độ thống trị thực dân Pháp tại Đông Dương và các thuộc địa khác trên thế giới.

2. CÁC NỘI DUNG CHÍNH YẾU VÀ ĐÒN ĐÁNH CHÍNH LUẬN SẮC BÉN:
- Chương 1: "Thuế máu" - Vạch trần sự dối trá của chiêu bài "mẹ mẫu quốc bảo hộ", đẩy hàng vạn người dân bản xứ vô tội sang châu Âu làm bia đỡ đạn cho thực dân Pháp trong Chiến tranh thế giới thứ nhất (1914 - 1918).
- Các chương tiếp theo vạch trần tội ác: Áp đặt sưu cao thuế nặng; đầu độc người dân bằng việc độc quyền buôn bán thuốc phiện và rượu cồn; thi hành chính sách ngu dân để dễ bề áp bức; đàn áp dã man các cuộc nổi dậy yêu nước.
- Phần Phụ lục "Gửi thanh niên An Nam": Lời hiệu triệu lay động hàng triệu trái tim tuổi trẻ:
"Hỡi thanh niên An Nam!... Các bạn hãy nhìn thẳng vào sự thật... Hãy tự giải phóng mình bằng con đường cách mạng!".

3. GIÁ TRỊ LỊCH SỬ VÀ TƯ TƯỞNG CỦA TÁC PHẨM:
- Là vũ khí lý luận sắc bén chuẩn bị về mặt chính trị và tư tưởng cho sự ra đời của Đảng Cộng sản Việt Nam vào mùa xuân năm 1930.
- Khẳng định mối quan hệ khăng khít giữa cách mạng giải phóng dân tộc ở thuộc địa với cách mạng vô sản ở chính quốc; nhấn mạnh công cuộc giải phóng dân tộc phải do chính nhân dân thuộc địa tự đứng lên giành lấy.

4. BÀI HỌC GIÁO DỤC TRUYỀN THỐNG YÊU NƯỚC CHO HỌC SINH THCS:
- Giúp học sinh thấu hiểu sâu sắc những nỗi đau thương, mất mát và áp bức bóc lột cùng cực mà dân tộc ta đã phải gánh chịu dưới ách đô hộ của ngoại bang.
- Bồi dưỡng lòng căm thù áp bức bất công, nâng cao ý thức trân trọng độc lập, tự do và hòa bình hôm nay.
- Học tập nghệ thuật hành văn chính luận khúc chiết, giàu dẫn chứng thép và ngọn lửa nhiệt huyết vì độc lập dân tộc của Nguyễn Ái Quốc.`,
    metadata: {
      batch: 'BATCH_D_HOCHIMINH_VN_EXPANSION',
      publicationYear: 1925,
      originalLanguage: 'Tiếng Pháp (Le Procès de la colonisation française)',
      publisher: 'Thư quán Lao động Paris (1925) & hochiminh.vn'
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
