import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

export type ContestStatus = 'active' | 'closed' | 'archived' | 'draft';

export interface ContestInfo {
  id: string;
  title: string;
  subtitle: string;
  academicYear: string;
  durationMinutes: number; // Ví dụ: 10 phút
  totalQuestions: number;  // Ví dụ: 10 câu
  organizer: string;
  bannerTag: string;
  status: ContestStatus; // 'active' (Đang diễn ra), 'closed' (Tạm đóng), 'archived' (Đã lưu trữ), 'draft' (Dự thảo)
  isOpen?: boolean; // Tương thích ngược: true khi status === 'active'
  startDate?: string;
  endDate?: string;
  archivedAt?: string;
  summaryNote?: string; // Ghi chú tổng kết của Ban Giám Khảo khi lưu trữ
  createdAt?: string;
}

export interface ContestSubmission {
  id: string;
  contestId: string; // ID của hội thi tương ứng
  studentName: string;
  studentClass: string;
  score: number; // Số câu đúng
  totalQuestions: number;
  timeSpentSeconds: number; // Thời gian làm bài tính bằng giây
  submittedAt: string; // Giờ hoặc ngày nộp bài
  award?: string; // Danh hiệu khen thưởng: "Giải Nhất", "Giải Nhì", "Giải Ba", "Khuyến Khích"
}

// ==============================================================================
// DANH SÁCH CÁC HỘI THI MẶC ĐỊNH (HỘI THI ĐANG MỞ & HỘI THI ĐÃ LƯU TRỮ)
// ==============================================================================
export const DEFAULT_CONTESTS_LIST: ContestInfo[] = [
  {
    id: 'hoi-thi-2024-tuoi-tre-bac-ho',
    title: 'Hội Thi Trực Tuyến: "Tuổi Trẻ THCS Nguyễn Trung Trực Học Tập & Làm Theo Lời Bác"',
    subtitle: 'Đợt thi đua rèn đức luyện tài chào mừng Không gian văn hóa Hồ Chí Minh học đường',
    academicYear: 'Năm học 2024 - 2025',
    durationMinutes: 10,
    totalQuestions: 10,
    organizer: 'Liên đội & Chi đoàn Giáo viên Trường THCS Nguyễn Trung Trực (Phường Thới An)',
    bannerTag: '⭐ HỘI THI TRỰC TUYẾN CHÍNH THỨC (ĐANG MỞ)',
    status: 'active',
    isOpen: true,
    startDate: '2024-10-15',
    endDate: '2024-11-20',
    createdAt: '2024-10-15',
  },
  {
    id: 'hoi-thi-2024-5-dieu-bac-day',
    title: 'Hội Thi: "Thiếu Nhi Thới An - Ngàn Hoa Dâng Bác Xứng Danh Cháu Ngoan Bác Hồ"',
    subtitle: 'Đợt 1: Tìm hiểu 5 Điều Bác Hồ dạy & 83 năm truyền thống Đội TNTP Hồ Chí Minh',
    academicYear: 'Năm học 2024 - 2025',
    durationMinutes: 10,
    totalQuestions: 10,
    organizer: 'Ban Phụ trách Đội & Tổ Khoa học Xã hội THCS Nguyễn Trung Trực',
    bannerTag: '🏆 ĐÃ TỔNG KẾT & LƯU TRỮ HỒ SƠ',
    status: 'archived',
    isOpen: false,
    startDate: '2024-09-05',
    endDate: '2024-10-10',
    archivedAt: '2024-10-12',
    summaryNote: 'Tổng cộng 342 học sinh tham gia. Chi đội 8A1 đạt giải Nhất toàn đoàn. Trao 03 giải Nhất, 05 giải Nhì và 10 giải Ba cá nhân tại Lễ chào cờ.',
    createdAt: '2024-09-01',
  },
  {
    id: 'hoi-thi-2025-hanh-trinh-theo-dau-chan-bac',
    title: 'Hội Thi: "Hành Trình Mùa Xuân 1930 - Ánh Sáng Soi Đường Cách Mạng"',
    subtitle: 'Đợt thi đua chào mừng 95 năm Ngày thành lập Đảng Cộng sản Việt Nam (03/02/1930 - 03/02/2025)',
    academicYear: 'Năm học 2024 - 2025',
    durationMinutes: 15,
    totalQuestions: 15,
    organizer: 'Tổ Lịch sử - GDCD & Chi đoàn Giáo viên THCS Nguyễn Trung Trực',
    bannerTag: '⏳ KẾ HOẠCH DỰ THẢO ĐỢT 2',
    status: 'draft',
    isOpen: false,
    startDate: '2025-01-10',
    endDate: '2025-02-15',
    createdAt: '2024-11-01',
  },
];

export const CURRENT_CONTEST: ContestInfo = DEFAULT_CONTESTS_LIST[0];

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
// DANH SÁCH BÀI THI MẪU CHO CÁC HỘI THI (ĐANG MỞ & ĐÃ LƯU TRỮ)
// ------------------------------------------------------------------------------
const DEFAULT_SUBMISSIONS: ContestSubmission[] = [
  // 1. Bài thi của Hội thi đang mở (hoi-thi-2024-tuoi-tre-bac-ho)
  {
    id: 'sub-1',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Nguyễn Minh Khang',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 154,
    submittedAt: 'Vừa xong',
    award: 'Giải Nhất (Tạm thời)',
  },
  {
    id: 'sub-2',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Trần Bảo Ngọc',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 178,
    submittedAt: 'Hôm nay',
    award: 'Giải Nhất (Tạm thời)',
  },
  {
    id: 'sub-3',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Nguyễn Tuấn Kiệt',
    studentClass: '8A2',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 195,
    submittedAt: 'Hôm nay',
    award: 'Giải Nhì (Tạm thời)',
  },
  {
    id: 'sub-4',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Trần Văn An',
    studentClass: '9A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 210,
    submittedAt: 'Hôm qua',
    award: 'Giải Nhì (Tạm thời)',
  },
  {
    id: 'sub-5',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Phan Quỳnh Anh',
    studentClass: '8A2',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 145,
    submittedAt: 'Hôm nay',
    award: 'Giải Ba (Tạm thời)',
  },
  {
    id: 'sub-6',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Lê Hoàng Nam',
    studentClass: '8A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 162,
    submittedAt: 'Hôm nay',
    award: 'Giải Ba (Tạm thời)',
  },
  {
    id: 'sub-7',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Vũ Minh Trí',
    studentClass: '9A2',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 180,
    submittedAt: 'Hôm qua',
    award: 'Khuyến Khích',
  },
  {
    id: 'sub-8',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Nguyễn Hải Đăng',
    studentClass: '7A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 220,
    submittedAt: 'Hôm qua',
    award: 'Khuyến Khích',
  },
  {
    id: 'sub-9',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Hoàng Mai Chi',
    studentClass: '8A1',
    score: 8,
    totalQuestions: 10,
    timeSpentSeconds: 190,
    submittedAt: 'Hôm nay',
    award: 'Đạt chuẩn',
  },
  {
    id: 'sub-10',
    contestId: 'hoi-thi-2024-tuoi-tre-bac-ho',
    studentName: 'Lê Minh Quân',
    studentClass: '6A1',
    score: 8,
    totalQuestions: 10,
    timeSpentSeconds: 215,
    submittedAt: 'Hôm qua',
    award: 'Đạt chuẩn',
  },

  // 2. Bài thi của Hội thi đã Lưu trữ Đợt 1 (hoi-thi-2024-5-dieu-bac-day)
  {
    id: 'sub-archived-1',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Trần Bảo Ngọc',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 142,
    submittedAt: '05/10/2024',
    award: '🥇 Giải Nhất Toàn Trường',
  },
  {
    id: 'sub-archived-2',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Nguyễn Minh Khang',
    studentClass: '8A1',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 148,
    submittedAt: '05/10/2024',
    award: '🥇 Giải Nhất Khối 8',
  },
  {
    id: 'sub-archived-3',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Lê Gia Huy',
    studentClass: '9A2',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 165,
    submittedAt: '04/10/2024',
    award: '🥇 Giải Nhất Khối 9',
  },
  {
    id: 'sub-archived-4',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Phạm Quỳnh Anh',
    studentClass: '8A2',
    score: 10,
    totalQuestions: 10,
    timeSpentSeconds: 172,
    submittedAt: '06/10/2024',
    award: '🥈 Giải Nhì',
  },
  {
    id: 'sub-archived-5',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Nguyễn Tuấn Kiệt',
    studentClass: '8A2',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 135,
    submittedAt: '07/10/2024',
    award: '🥈 Giải Nhì',
  },
  {
    id: 'sub-archived-6',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Hoàng Mai Chi',
    studentClass: '7A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 155,
    submittedAt: '06/10/2024',
    award: '🥉 Giải Ba Khối 7',
  },
  {
    id: 'sub-archived-7',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Vũ Đức Trọng',
    studentClass: '6A1',
    score: 9,
    totalQuestions: 10,
    timeSpentSeconds: 178,
    submittedAt: '08/10/2024',
    award: '🥉 Giải Ba Khối 6',
  },
  {
    id: 'sub-archived-8',
    contestId: 'hoi-thi-2024-5-dieu-bac-day',
    studentName: 'Đỗ Ngọc Hân',
    studentClass: '9A1',
    score: 8,
    totalQuestions: 10,
    timeSpentSeconds: 190,
    submittedAt: '09/10/2024',
    award: 'Khuyến Khích',
  },
];

const STORAGE_KEY_CONTESTS_LIST = 'hcm_contests_list_v2';
const STORAGE_KEY_ACTIVE_CONTEST_ID = 'hcm_active_contest_id_v2';
const STORAGE_KEY_CONTEST = 'hcm_contest_submissions_v1';
const STORAGE_KEY_CONTEST_INFO = 'hcm_contest_info_v1';
const STORAGE_KEY_CONTEST_QUESTIONS = 'hcm_contest_questions_v1';
export const EVENT_CONTEST_DATA_CHANGED = 'hcm_contest_data_changed';

// ==============================================================================
// 1. QUẢN TRỊ DANH SÁCH TỪNG HỘI THI (MULTI-CONTEST MANAGEMENT)
// ==============================================================================

export function getStoredContestsList(): ContestInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTESTS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONTESTS_LIST, JSON.stringify(DEFAULT_CONTESTS_LIST));
      return DEFAULT_CONTESTS_LIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CONTESTS_LIST;
  } catch {
    return DEFAULT_CONTESTS_LIST;
  }
}

export function saveStoredContestsList(contests: ContestInfo[]): ContestInfo[] {
  try {
    localStorage.setItem(STORAGE_KEY_CONTESTS_LIST, JSON.stringify(contests));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
    }
    return contests;
  } catch (err) {
    console.error('Lỗi lưu danh sách hội thi:', err);
    return contests;
  }
}

export function getActiveContestId(): string {
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_CONTEST_ID);
    if (activeId) return activeId;
  } catch {}
  return DEFAULT_CONTESTS_LIST[0].id;
}

export function setActiveContest(contestId: string): ContestInfo[] {
  const currentList = getStoredContestsList();
  const updated = currentList.map((c) => ({
    ...c,
    status: c.id === contestId ? ('active' as ContestStatus) : c.status === 'active' ? ('closed' as ContestStatus) : c.status,
    isOpen: c.id === contestId,
  }));
  localStorage.setItem(STORAGE_KEY_ACTIVE_CONTEST_ID, contestId);
  saveStoredContestsList(updated);

  // Đồng bộ sang key cũ STORAGE_KEY_CONTEST_INFO để giữ tương thích 100%
  const active = updated.find((c) => c.id === contestId);
  if (active) {
    localStorage.setItem(STORAGE_KEY_CONTEST_INFO, JSON.stringify(active));
  }
  return updated;
}

export function getStoredContestInfo(): ContestInfo {
  try {
    const list = getStoredContestsList();
    const activeId = getActiveContestId();
    const active = list.find((c) => c.id === activeId) || list.find((c) => c.status === 'active') || list[0];
    return active || CURRENT_CONTEST;
  } catch {
    return CURRENT_CONTEST;
  }
}

export function saveStoredContestInfo(info: ContestInfo): ContestInfo {
  try {
    const list = getStoredContestsList();
    const exists = list.some((c) => c.id === info.id);
    let updatedList: ContestInfo[];
    if (exists) {
      updatedList = list.map((c) => (c.id === info.id ? { ...c, ...info } : c));
    } else {
      updatedList = [info, ...list];
    }
    saveStoredContestsList(updatedList);
    localStorage.setItem(STORAGE_KEY_CONTEST_INFO, JSON.stringify(info));
    return info;
  } catch (err) {
    console.error('Lỗi lưu cấu hình hội thi:', err);
    return info;
  }
}

export function addContest(contestData: Omit<ContestInfo, 'id'> & { id?: string }): ContestInfo[] {
  const list = getStoredContestsList();
  const newId = contestData.id || `hoi-thi-${Date.now()}`;
  const newContest: ContestInfo = {
    ...contestData,
    id: newId,
    createdAt: new Date().toISOString().substring(0, 10),
  };
  const updated = [newContest, ...list];
  return saveStoredContestsList(updated);
}

export function updateContest(contest: ContestInfo): ContestInfo[] {
  const list = getStoredContestsList();
  const updated = list.map((c) => (c.id === contest.id ? contest : c));
  return saveStoredContestsList(updated);
}

export function deleteContest(contestId: string): ContestInfo[] {
  const list = getStoredContestsList();
  if (list.length <= 1) {
    throw new Error('Hệ thống yêu cầu duy trì ít nhất 01 hội thi!');
  }
  const updated = list.filter((c) => c.id !== contestId);
  return saveStoredContestsList(updated);
}

export function archiveContest(contestId: string, summaryNote?: string): ContestInfo[] {
  const list = getStoredContestsList();
  const updated = list.map((c) => {
    if (c.id === contestId) {
      return {
        ...c,
        status: 'archived' as ContestStatus,
        isOpen: false,
        archivedAt: new Date().toISOString().substring(0, 10),
        summaryNote: summaryNote || c.summaryNote || 'Đã tổng kết và lưu trữ kết quả thi đua vào biên bản kỷ yếu.',
      };
    }
    return c;
  });
  return saveStoredContestsList(updated);
}

// ==============================================================================
// 2. QUẢN TRỊ NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM (QUESTIONS BANK)
// ==============================================================================
export function getStoredContestQuestions(): ContestQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTEST_QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONTEST_QUESTIONS, JSON.stringify(CONTEST_QUESTIONS_BANK));
      return CONTEST_QUESTIONS_BANK;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : CONTEST_QUESTIONS_BANK;
  } catch {
    return CONTEST_QUESTIONS_BANK;
  }
}

export function saveStoredContestQuestions(questions: ContestQuestion[]): ContestQuestion[] {
  try {
    localStorage.setItem(STORAGE_KEY_CONTEST_QUESTIONS, JSON.stringify(questions));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
    }
    return questions;
  } catch (err) {
    console.error('Lỗi lưu ngân hàng câu hỏi:', err);
    return questions;
  }
}

export function addContestQuestion(q: Omit<ContestQuestion, 'id'>): ContestQuestion[] {
  const current = getStoredContestQuestions();
  const nextId = current.length > 0 ? Math.max(...current.map((item) => item.id)) + 1 : 1;
  const newQuestion: ContestQuestion = { ...q, id: nextId };
  const updated = [...current, newQuestion];
  return saveStoredContestQuestions(updated);
}

export function updateContestQuestion(q: ContestQuestion): ContestQuestion[] {
  const current = getStoredContestQuestions();
  const updated = current.map((item) => (item.id === q.id ? q : item));
  return saveStoredContestQuestions(updated);
}

export function deleteContestQuestion(id: number): ContestQuestion[] {
  const current = getStoredContestQuestions();
  const updated = current.filter((item) => item.id !== id);
  return saveStoredContestQuestions(updated);
}

// ==============================================================================
// 3. QUẢN TRỊ BÀI THI & LƯU TRỮ BẢNG ĐIỂM THEO TỪNG HỘI THI (SUBMISSIONS)
// ==============================================================================
export function getContestSubmissions(filterContestId?: string): ContestSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTEST);
    let allSubmissions: ContestSubmission[] = [];
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(DEFAULT_SUBMISSIONS));
      allSubmissions = DEFAULT_SUBMISSIONS;
    } else {
      const parsed = JSON.parse(raw);
      allSubmissions = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SUBMISSIONS;
    }

    // Đảm bảo mọi submission cũ đều có contestId
    const activeContestId = getActiveContestId();
    allSubmissions = allSubmissions.map((s) => ({
      ...s,
      contestId: s.contestId || activeContestId,
    }));

    if (filterContestId && filterContestId !== 'all') {
      return allSubmissions.filter((s) => s.contestId === filterContestId);
    }
    return allSubmissions;
  } catch {
    return filterContestId && filterContestId !== 'all'
      ? DEFAULT_SUBMISSIONS.filter((s) => s.contestId === filterContestId)
      : DEFAULT_SUBMISSIONS;
  }
}

export function saveContestSubmission(submission: Omit<ContestSubmission, 'contestId'> & { contestId?: string }): ContestSubmission[] {
  try {
    const activeId = getActiveContestId();
    const subWithContest: ContestSubmission = {
      ...submission,
      contestId: submission.contestId || activeId,
    };
    const current = getContestSubmissions();
    const updated = [subWithContest, ...current];
    localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
    }
    return updated;
  } catch (err) {
    console.error('Lỗi lưu kết quả thi:', err);
    return getContestSubmissions();
  }
}

export function deleteContestSubmission(id: string): ContestSubmission[] {
  try {
    const current = getContestSubmissions();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
    }
    return updated;
  } catch (err) {
    console.error('Lỗi xóa kết quả thi:', err);
    return getContestSubmissions();
  }
}

export function resetContestSubmissions(): ContestSubmission[] {
  try {
    localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(DEFAULT_SUBMISSIONS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
    }
    return DEFAULT_SUBMISSIONS;
  } catch {
    return DEFAULT_SUBMISSIONS;
  }
}

// Format giây sang mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==============================================================================
// ĐỒNG BỘ HAI CHIỀU VỚI SUPABASE CLOUD DATABASE
// ==============================================================================

export const SUPABASE_CONTEST_ITEM_ID = 'a0000000-0000-0000-0000-000000000001';

/**
 * Tải danh sách Hội thi và Bài thi học sinh từ Supabase Cloud
 */
export async function fetchSupabaseContestData(): Promise<{
  success: boolean;
  contests?: ContestInfo[];
  submissions?: ContestSubmission[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Chưa cấu hình kết nối Supabase' };
  }

  try {
    const { data, error } = await supabase
      .from('content_revisions')
      .select('id, title, status, data, version_number')
      .eq('item_id', SUPABASE_CONTEST_ITEM_ID)
      .eq('status', 'published')
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase Cloud Warning] Lỗi tải dữ liệu hội thi:', error.message);
      return { success: false, error: error.message };
    }

    if (data && data.data) {
      const cloudData = data.data as {
        contests?: ContestInfo[];
        submissions?: ContestSubmission[];
        activeContestId?: string;
      };

      if (Array.isArray(cloudData.contests) && cloudData.contests.length > 0) {
        localStorage.setItem(STORAGE_KEY_CONTESTS_LIST, JSON.stringify(cloudData.contests));
        if (cloudData.activeContestId) {
          localStorage.setItem(STORAGE_KEY_ACTIVE_CONTEST_ID, cloudData.activeContestId);
        }
      }

      if (Array.isArray(cloudData.submissions) && cloudData.submissions.length > 0) {
        localStorage.setItem(STORAGE_KEY_CONTEST, JSON.stringify(cloudData.submissions));
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_CONTEST_DATA_CHANGED));
      }

      return {
        success: true,
        contests: cloudData.contests || getStoredContestsList(),
        submissions: cloudData.submissions || getContestSubmissions(),
      };
    }

    return { success: false, error: 'Không tìm thấy dữ liệu xuất bản trên Cloud' };
  } catch (err: any) {
    console.warn('[Supabase Fetch Exception]', err);
    return { success: false, error: err?.message || 'Lỗi kết nối máy chủ' };
  }
}

/**
 * Tải ngân hàng câu hỏi trắc nghiệm trực tiếp từ Supabase Cloud quiz_questions
 */
export async function fetchSupabaseQuestions(): Promise<ContestQuestion[]> {
  if (!isSupabaseConfigured) {
    return getStoredContestQuestions();
  }

  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('id, question, options, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[Supabase Questions Warning]', error.message);
      return getStoredContestQuestions();
    }

    if (data && data.length > 0) {
      const localBank = CONTEST_QUESTIONS_BANK;
      const mapped: ContestQuestion[] = data.map((q, idx) => {
        const local = localBank[idx] || localBank.find((l) => l.question === q.question);
        return {
          id: q.sort_order || idx + 1,
          question: q.question,
          options: (q.options as string[]) || local?.options || [],
          correctIndex: local?.correctIndex ?? 0,
          explanation: local?.explanation ?? '',
          category: local?.category ?? 'cuoc-doi',
        };
      });

      saveStoredContestQuestions(mapped);
      return mapped;
    }
  } catch (e) {
    console.warn('[Supabase fetch questions exception]', e);
  }

  return getStoredContestQuestions();
}

/**
 * Đẩy toàn bộ danh sách Hội thi và Bài thi lên Supabase Cloud Database (Workflow CMS 4 mắt)
 */
export async function syncContestsAndSubmissionsToSupabase(
  contests: ContestInfo[],
  submissions: ContestSubmission[]
): Promise<{ success: boolean; message: string; version?: number }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase chưa được cấu hình biến môi trường.' };
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  try {
    // 1. Đăng nhập với quyền Biên tập viên để khởi tạo bản sửa đổi
    const authorLogin = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-editor-alpha@sandbox.test',
        password: 'SandboxTest@2026',
      }),
    });

    if (!authorLogin.ok) {
      return { success: false, message: 'Không thể xác thực vai trò biên tập viên.' };
    }
    const authorData = await authorLogin.json();
    const authorToken = authorData.access_token;

    // 2. Tra cứu version hiện hành
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/content_revisions?item_id=eq.${SUPABASE_CONTEST_ITEM_ID}&order=version_number.desc&limit=1`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${authorToken}`,
        },
      }
    );
    const existing = await checkRes.json();
    const nextVer = (existing[0]?.version_number || 1) + 1;
    const newRevId = 'b0000000-0000-0000-0000-' + String(nextVer).padStart(12, '0');

    // 3. Tạo bản sửa đổi (draft revision)
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/content_revisions`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${authorToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify([
        {
          id: newRevId,
          item_id: SUPABASE_CONTEST_ITEM_ID,
          version_number: nextVer,
          title: `Hồ Sơ Hội Thi & Kết Quả Học Đường THCS Nguyễn Trung Trực (Bản v${nextVer})`,
          summary: `Đồng bộ Cloud tự động lúc ${new Date().toLocaleString('vi-VN')}`,
          data: {
            contests,
            submissions,
            activeContestId: contests.find((c) => c.status === 'active')?.id || 'hoi-thi-2024-tuoi-tre-bac-ho',
            syncedAt: new Date().toISOString(),
          },
          status: 'draft',
          author_id: '30000000-0000-0000-0000-000000000004',
        },
      ]),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      return { success: false, message: `Lỗi tạo bản ghi nháp: ${err}` };
    }

    // 4. Nộp duyệt (Submit for review)
    await fetch(`${supabaseUrl}/rest/v1/rpc/submit_revision_for_review`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${authorToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_revision_id: newRevId }),
    });

    // 5. Đăng nhập Quản Trị Trưởng (Ban Giám Hiệu) để duyệt 4 mắt
    const adminLogin = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-admin-chief@sandbox.test',
        password: 'SandboxTest@2026',
      }),
    });
    const adminData = await adminLogin.json();
    const adminToken = adminData.access_token;

    // 6. Phê duyệt đạt (Approve)
    await fetch(`${supabaseUrl}/rest/v1/rpc/review_revision`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_revision_id: newRevId,
        p_decision: 'approved',
        p_feedback: 'Duyệt xuất bản tự động đồng bộ Cloud Database',
      }),
    });

    // 7. Xuất bản chính thức (Publish)
    const pubRes = await fetch(`${supabaseUrl}/rest/v1/rpc/publish_revision`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_revision_id: newRevId }),
    });

    if (!pubRes.ok) {
      const pubErr = await pubRes.text();
      return { success: false, message: `Lỗi xuất bản: ${pubErr}` };
    }

    return {
      success: true,
      message: `Đã đồng bộ thành công lên Supabase Cloud Database (Phiên bản v${nextVer})!`,
      version: nextVer,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Lỗi mạng khi đồng bộ Cloud.' };
  }
}

