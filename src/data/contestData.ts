// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// DỮ LIỆU ĐỀ THI HỘI THI TRỰC TUYẾN & QUẢN LÝ BẢNG XẾP HẠNG HỌC ĐƯỜNG
// ==============================================================================

export interface ContestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'cuoc-doi' | 'tu-tuong' | '5-dieu-bac-day' | 'thoi-an-truyen-thong';
}

export interface ContestInfo {
  id: string;
  title: string;
  subtitle: string;
  academicYear: string;
  durationMinutes: number; // 10 phút
  totalQuestions: number;  // 10 câu
  organizer: string;
  bannerTag: string;
}

export interface ContestSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  score: number; // Số câu đúng (0 - 10)
  totalQuestions: number;
  timeSpentSeconds: number; // Thời gian làm bài tính bằng giây
  submittedAt: string; // ISO hoặc ngày giờ
}

export const CURRENT_CONTEST: ContestInfo = {
  id: 'hoi-thi-2024-tuoi-tre-bac-ho',
  title: 'Hội Thi Trực Tuyến: "Tuổi Trẻ THCS Nguyễn Trung Trực Học Tập & Làm Theo Lời Bác"',
  subtitle: 'Đợt thi đua rèn đức luyện tài chào mừng Không gian văn hóa Hồ Chí Minh học đường',
  academicYear: 'Năm học 2024 - 2025',
  durationMinutes: 10,
  totalQuestions: 10,
  organizer: 'Liên đội & Chi đoàn Giáo viên Trường THCS Nguyễn Trung Trực (Phường Thới An)',
  bannerTag: '⭐ HỘI THI TRỰC TUYẾN HỌC ĐƯỜNG CHÍNH THỨC',
};

export const CONTEST_QUESTIONS_BANK: ContestQuestion[] = [
  {
    id: 1,
    question: 'Chủ tịch Hồ Chí Minh rời Bến cảng Nhà Rồng (Sài Gòn) ra đi tìm đường cứu nước vào ngày tháng năm nào?',
    options: [
      'Ngày 19 tháng 5 năm 1890',
      'Ngày 05 tháng 6 năm 1911',
      'Ngày 03 tháng 2 năm 1930',
      'Ngày 02 tháng 9 năm 1945',
    ],
    correctIndex: 1,
    explanation: 'Ngày 05/06/1911, người thanh niên yêu nước Nguyễn Tất Thành (với tên Văn Ba) đã lên tàu Amiral Latouche-Tréville rời Bến Nhà Rồng bắt đầu hành trình cứu nước suốt 30 năm.',
    category: 'cuoc-doi',
  },
  {
    id: 2,
    question: 'Điều thứ 5 trong "5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng" là gì?',
    options: [
      'Đoàn kết tốt, kỷ luật tốt',
      'Giữ gìn vệ sinh thật tốt',
      'Khiêm tốn, thật thà, dũng cảm',
      'Học tập tốt, lao động tốt',
    ],
    correctIndex: 2,
    explanation: 'Điều thứ 5 Bác dạy là: "Khiêm tốn, thật thà, dũng cảm" - nhắc nhở học sinh luôn trung thực, không dối trá và dũng cảm nhận lỗi để tiến bộ.',
    category: '5-dieu-bac-day',
  },
  {
    id: 3,
    question: 'Trong bức thư gửi học sinh nhân ngày khai trường đầu tiên (9/1945), Bác Hồ căn dặn: "...non sông Việt Nam có trở nên tươi đẹp hay không... chính là nhờ một phần lớn ở công..." gì của các em?',
    options: [
      'Lao động sản xuất',
      'Học tập',
      'Rèn luyện thể thao',
      'Tiết kiệm tài nguyên',
    ],
    correctIndex: 1,
    explanation: 'Bác khẳng định: "...dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em."',
    category: 'tu-tuong',
  },
  {
    id: 4,
    question: 'Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa tại đâu và vào thời gian nào?',
    options: [
      'Quảng trường Ba Đình (Hà Nội) - Ngày 02/09/1945',
      'Chiến khu Tân Trào (Tuyên Quang) - Ngày 16/08/1945',
      'Bến cảng Nhà Rồng (Sài Gòn) - Ngày 23/09/1945',
      'Hang Pác Bó (Cao Bằng) - Ngày 28/01/1941',
    ],
    correctIndex: 0,
    explanation: 'Sáng ngày 02/09/1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đã thay mặt Chính phủ lâm thời đọc Tuyên ngôn Độc lập lịch sử.',
    category: 'cuoc-doi',
  },
  {
    id: 5,
    question: 'Trường THCS của chúng ta vinh dự mang tên vị Anh hùng dân tộc Nguyễn Trung Trực với câu nói bất hủ nào trước quân thù?',
    options: [
      'Không có gì quý hơn độc lập, tự do!',
      'Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây.',
      'Thà làm quỷ nước Nam chứ không thèm làm vương đất Bắc.',
      'Quyết tử để Tổ quốc quyết sinh.',
    ],
    correctIndex: 1,
    explanation: 'Anh hùng Nguyễn Trung Trực đã khẳng khái tuyên bố trước thực dân Pháp câu nói sáng ngời khí tiết: "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".',
    category: 'thoi-an-truyen-thong',
  },
  {
    id: 6,
    question: 'Bản Di chúc thiêng liêng của Chủ tịch Hồ Chí Minh được Bác bắt đầu viết vào năm nào?',
    options: [
      'Năm 1960',
      'Năm 1965',
      'Năm 1968',
      'Năm 1969',
    ],
    correctIndex: 1,
    explanation: 'Bác Hồ bắt đầu viết tài liệu Tuyệt đối bí mật (Bản Di chúc lịch sử) vào lúc 9 giờ sáng ngày 10/5/1965 nhân dịp sinh nhật lần thứ 75 của Người.',
    category: 'tu-tuong',
  },
  {
    id: 7,
    question: 'Chân lý thời đại bất hủ: "Không có gì quý hơn độc lập, tự do" được Bác Hồ phát biểu kêu gọi toàn quốc chống Mỹ cứu nước vào năm nào?',
    options: [
      'Năm 1954',
      'Năm 1960',
      'Năm 1966',
      'Năm 1969',
    ],
    correctIndex: 2,
    explanation: 'Sáng ngày 17/7/1966, trên làn sóng Đài Tiếng nói Việt Nam, Bác Hồ đã đọc Lời kêu gọi đồng bào chiến sĩ cả nước với câu nói nổi tiếng khắc sâu vào tâm khảm dân tộc.',
    category: 'tu-tuong',
  },
  {
    id: 8,
    question: 'Tập thơ chữ Hán nổi tiếng gồm 133 bài thơ được Bác Hồ sáng tác trong chốn lao tù gian khổ có tên là gì?',
    options: [
      'Việt Bắc anh dũng',
      'Nhật ký trong tù (Ngục trung nhật ký)',
      'Bài ca chúc Tết',
      'Trăng chiến khu',
    ],
    correctIndex: 1,
    explanation: 'Tác phẩm "Nhật ký trong tù" khắc họa ý chí gang thép, tinh thần lạc quan cách mạng và tâm hồn nhân đạo cao đẹp của Chủ tịch Hồ Chí Minh.',
    category: 'tu-tuong',
  },
  {
    id: 9,
    question: 'Địa chỉ đỏ di tích lịch sử cách mạng hào hùng gắn liền với truyền thống quê hương chúng ta tại Thành phố Hồ Chí Minh là:',
    options: [
      'Địa đạo Củ Chi',
      'Chiến khu An Phú Đông',
      'Rừng Sác Cần Giờ',
      'Bến Dược',
    ],
    correctIndex: 1,
    explanation: 'Chiến khu An Phú Đông là căn cứ kháng chiến kiên cường, nơi quân dân địa phương lập nên nhiều chiến công hiển hách trong hai cuộc kháng chiến.',
    category: 'thoi-an-truyen-thong',
  },
  {
    id: 10,
    question: 'Thành phố Sài Gòn - Gia Định vinh dự được Quốc hội chính thức đổi tên thành Thành phố Hồ Chí Minh vào tháng năm nào?',
    options: [
      'Ngày 30/04/1975',
      'Ngày 02/07/1976',
      'Ngày 19/05/1975',
      'Ngày 02/09/1976',
    ],
    correctIndex: 1,
    explanation: 'Tại kỳ họp thứ nhất Quốc hội khóa VI (ngày 02/07/1976), Quốc hội đã nhất trí quyết nghị chính thức đặt tên thành phố là Thành phố Hồ Chí Minh.',
    category: 'thoi-an-truyen-thong',
  },
];

// ------------------------------------------------------------------------------
// DANH SÁCH BẢNG XẾP HẠNG MẪU BAN ĐẦU ĐỂ TẠO KHÍ THẾ THI ĐUA HỌC ĐƯỜNG
// ------------------------------------------------------------------------------
const DEFAULT_SUBMISSIONS: ContestSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Nguyễn Minh Khang',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 154, // 2 phút 34 giây
    submittedAt: 'Vừa xong',
  },
  {
    id: 'sub-2',
    studentName: 'Trần Bảo Ngọc',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 178, // 2 phút 58 giây
    submittedAt: 'Hôm nay',
  },
  {
    id: 'sub-3',
    studentName: 'Nguyễn Tuấn Kiệt',
    studentClass: '8A2',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 195,
    submittedAt: 'Hôm nay',
  },
  {
    id: 'sub-4',
    studentName: 'Trần Văn An',
    studentClass: '9A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 210,
    submittedAt: 'Hôm qua',
  },
  {
    id: 'sub-5',
    studentName: 'Phan Quỳnh Anh',
    studentClass: '8A2',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 145,
    submittedAt: 'Hôm nay',
  },
  {
    id: 'sub-6',
    studentName: 'Lê Hoàng Nam',
    studentClass: '8A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 162,
    submittedAt: 'Hôm nay',
  },
  {
    id: 'sub-7',
    studentName: 'Vũ Minh Trí',
    studentClass: '9A2',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 180,
    submittedAt: 'Hôm qua',
  },
  {
    id: 'sub-8',
    studentName: 'Nguyễn Hải Đăng',
    studentClass: '7A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 220,
    submittedAt: 'Hôm qua',
  },
  {
    id: 'sub-9',
    studentName: 'Hoàng Mai Chi',
    studentClass: '8A1',
    score: 8,
    totalQuestions: 10,
    timeSpentSeconds: 190,
    submittedAt: 'Hôm nay',
  },
  {
    id: 'sub-10',
    studentName: 'Lê Minh Quân',
    studentClass: '6A1',
    score: 8,
    totalQuestions: 10,
    timeSpentSeconds: 215,
    submittedAt: 'Hôm qua',
  },
];

const STORAGE_KEY_CONTEST = 'hcm_contest_submissions_v1';

export function getContestSubmissions(): ContestSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTEST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(DEFAULT_SUBMISSIONS));
      return DEFAULT_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_SUBMISSIONS;
  } catch {
    return DEFAULT_SUBMISSIONS;
  }
}

export function saveContestSubmission(submission: ContestSubmission): ContestSubmission[] {
  try {
    const current = getContestSubmissions();
    // Thêm lượt thi mới lên đầu
    const updated = [submission, ...current];
    localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Lỗi lưu kết quả thi:', err);
    return getContestSubmissions();
  }
}

// Format giây sang mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
