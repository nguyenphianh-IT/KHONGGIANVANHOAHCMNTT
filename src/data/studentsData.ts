// ==============================================================================
// DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
// DỮ LIỆU DANH SÁCH LỚP, HỌC SINH MẪU & BỘ LỌC TÊN CHUẨN MỰC HỌC ĐƯỜNG
// ==============================================================================

export interface ClassInfo {
  id: string;
  name: string;
  grade: '6' | '7' | '8' | '9';
}

export const SCHOOL_CLASSES: ClassInfo[] = [
  // Khối 6
  { id: '6A1', name: 'Lớp 6A1 (Chi đội Kim Đồng)', grade: '6' },
  { id: '6A2', name: 'Lớp 6A2 (Chi đội Lê Văn Tám)', grade: '6' },
  { id: '6A3', name: 'Lớp 6A3 (Chi đội Võ Thị Sáu)', grade: '6' },
  { id: '6A4', name: 'Lớp 6A4', grade: '6' },
  { id: '6A5', name: 'Lớp 6A5', grade: '6' },
  { id: '6A6', name: 'Lớp 6A6', grade: '6' },

  // Khối 7
  { id: '7A1', name: 'Lớp 7A1 (Chi đội Vừ A Dính)', grade: '7' },
  { id: '7A2', name: 'Lớp 7A2 (Chi đội Nguyễn Viết Xuân)', grade: '7' },
  { id: '7A3', name: 'Lớp 7A3', grade: '7' },
  { id: '7A4', name: 'Lớp 7A4', grade: '7' },
  { id: '7A5', name: 'Lớp 7A5', grade: '7' },
  { id: '7A6', name: 'Lớp 7A6', grade: '7' },

  // Khối 8
  { id: '8A1', name: 'Lớp 8A1 (Chi đội Lý Tự Trọng)', grade: '8' },
  { id: '8A2', name: 'Lớp 8A2 (Chi đội Nguyễn Bá Ngọc)', grade: '8' },
  { id: '8A3', name: 'Lớp 8A3 (Chi đội Trần Văn Ơn)', grade: '8' },
  { id: '8A4', name: 'Lớp 8A4', grade: '8' },
  { id: '8A5', name: 'Lớp 8A5', grade: '8' },
  { id: '8A6', name: 'Lớp 8A6', grade: '8' },

  // Khối 9
  { id: '9A1', name: 'Lớp 9A1 (Chi đội Nguyễn Trung Trực)', grade: '9' },
  { id: '9A2', name: 'Lớp 9A2 (Chi đội Bến Nhà Rồng)', grade: '9' },
  { id: '9A3', name: 'Lớp 9A3', grade: '9' },
  { id: '9A4', name: 'Lớp 9A4', grade: '9' },
  { id: '9A5', name: 'Lớp 9A5', grade: '9' },
  { id: '9A6', name: 'Lớp 9A6', grade: '9' },
];

// ------------------------------------------------------------------------------
// GIẢI PHÁP 1: DANH SÁCH HỌC SINH MẪU THEO LỚP ĐỂ CHỌN NHANH (TRIỆT TIÊU TỰ GÕ BẬY)
// ------------------------------------------------------------------------------
export const SAMPLE_STUDENTS_BY_CLASS: Record<string, string[]> = {
  '8A1': [
    'Nguyễn Minh Khang',
    'Trần Bảo Ngọc',
    'Lê Hoàng Nam',
    'Phạm Thùy Linh',
    'Đặng Gia Huy',
    'Vũ Khánh An',
    'Bùi Đức Anh',
    'Hoàng Mai Chi',
    'Đỗ Quốc Bảo',
    'Phan Cẩm Tú',
  ],
  '8A2': [
    'Nguyễn Tuấn Kiệt',
    'Phan Quỳnh Anh',
    'Trần Đình Trọng',
    'Đỗ Thu Hà',
    'Ngô Tiến Đạt',
    'Dương Mỹ Duyên',
    'Trịnh Hoàng Long',
    'Cao Phương Thảo',
    'Lý Gia Hưng',
    'Mai Ngọc Trâm',
  ],
  '8A3': [
    'Phạm Đức Minh',
    'Lê Thảo My',
    'Nguyễn Hữu Thắng',
    'Võ Thanh Trúc',
    'Đinh Quang Hải',
    'Tô Hải Yến',
  ],
  '9A1': [
    'Trần Văn An',
    'Nguyễn Thị Kim Ngân',
    'Lê Quang Huy',
    'Phạm Ngọc Hân',
    'Hoàng Nhật Minh',
    'Đỗ Bảo Châu',
  ],
  '9A2': [
    'Vũ Minh Trí',
    'Đặng Thanh Mai',
    'Bùi Quốc Thái',
    'Nguyễn Phương Linh',
    'Phan Đình Khải',
  ],
  '7A1': [
    'Nguyễn Hải Đăng',
    'Trần Như Ý',
    'Lê Tuấn Hưng',
    'Phạm Thảo Vy',
    'Hoàng Tuấn Dũng',
  ],
  '7A2': [
    'Đỗ Hoàng Bách',
    'Vũ Bảo Trân',
    'Đặng Trung Kiên',
    'Ngô Yến Nhi',
  ],
  '6A1': [
    'Lê Minh Quân',
    'Nguyễn Thục Quyên',
    'Trần Đức Thịnh',
    'Phạm Hoài An',
  ],
  '6A2': [
    'Hoàng Khánh Linh',
    'Đỗ Gia Bảo',
    'Vũ Hoàng Yến',
    'Nguyễn Tấn Đạt',
  ],
};

// ------------------------------------------------------------------------------
// GIẢI PHÁP 2: BỘ TỪ ĐIỂN CHẶN TỪ CẤM & HÀM KIỂM TRA CHUẨN TÊN TIẾNG VIỆT
// ------------------------------------------------------------------------------
const PROFANITY_BLACKLIST = [
  // Từ ngữ tục tĩu tiếng Việt phổ biến
  'dm', 'dcm', 'cl', 'clgt', 'vcl', 'vl', 'vkl', 'vcc', 'cc', 'lon', 'cac', 'buoi',
  'loz', 'cho', 'cho de', 'deo', 'me kiep', 'dkm', 'dit', 'djt', 'du ma', 'du me',
  'mat day', 'khon nan', 'ngu', 'oc cho', 'suc vat', 'thang dien', 'con dien',
  'fuck', 'shit', 'bitch', 'asshole', 'sex', 'porn', 'xxx',
  // Biệt danh chế giễu, bỡn cợt không chuẩn mực học đường
  'tre trau', 'nghien ngap', 'dai ca', 'giang ho', 'ong trum', 'hack', 'admin', 'hacker',
  'bac ho', 'ho chi minh', 'nguyen ai quoc', // Tránh mạo danh danh nhân lịch sử
];

// Regex chỉ chấp nhận chữ cái tiếng Việt và khoảng trắng
const VIETNAMESE_NAME_REGEX = /^[a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ\s]+$/;

export interface NameValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedName?: string;
}

export function validateStudentName(rawName: string): NameValidationResult {
  const trimmed = rawName.trim().replace(/\s+/g, ' ');

  // 1. Kiểm tra rỗng
  if (!trimmed || trimmed.length < 3) {
    return {
      isValid: false,
      errorMessage: 'Vui lòng nhập đầy đủ Họ và Tên của em (tối thiểu 3 ký tự)!',
    };
  }

  // 2. Kiểm tra ký tự lạ, chữ số, ký tự đặc biệt
  if (!VIETNAMESE_NAME_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Họ tên chỉ được chứa chữ cái tiếng Việt, không chứa số hoặc ký tự đặc biệt (@, #, 1, 2...)!',
    };
  }

  // 3. Kiểm tra số lượng từ (bắt buộc ít nhất 2 từ: Họ + Tên)
  const words = trimmed.split(' ');
  if (words.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Vui lòng nhập cả Họ và Tên (ví dụ: Nguyễn An, Trần Minh Quân)!',
    };
  }

  if (words.length > 5) {
    return {
      isValid: false,
      errorMessage: 'Họ tên quá dài (tối đa 5 từ), vui lòng kiểm tra lại!',
    };
  }

  // 4. Kiểm tra các từ gõ phím vô nghĩa liên tiếp (ví dụ: asdfgh, zzzzzz)
  const lower = trimmed.toLowerCase();
  for (const word of words) {
    if (word.length >= 4 && /([a-z])\1{2,}/i.test(word)) {
      return {
        isValid: false,
        errorMessage: 'Họ tên không hợp lệ (chứa chuỗi ký tự lặp vô nghĩa)!',
      };
    }
  }

  // 5. Kiểm tra danh sách từ cấm / tiếng lóng phản cảm
  const normalizedNoPunctuation = lower.replace(/[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, ' ');
  for (const badWord of PROFANITY_BLACKLIST) {
    const regex = new RegExp(`\\b${badWord}\\b`, 'i');
    if (regex.test(normalizedNoPunctuation)) {
      return {
        isValid: false,
        errorMessage: '⚠️ Tên không phù hợp với chuẩn mực học đường! Vui lòng nhập đúng Họ và tên thật.',
      };
    }
  }

  // Viết hoa chữ cái đầu mỗi từ chuẩn chính tả tiếng Việt
  const capitalized = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    isValid: true,
    sanitizedName: capitalized,
  };
}

// ==============================================================================
// 6. QUẢN LÝ DANH SÁCH HỌC SINH MẪU THEO LỚP (PERSISTENCE)
// ==============================================================================
const STORAGE_KEY_STUDENTS_ROSTER = 'hcm_students_roster_v1';
export const EVENT_STUDENTS_ROSTER_CHANGED = 'hcm_students_roster_changed';

export function getStoredStudentsByClass(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS_ROSTER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS_ROSTER, JSON.stringify(SAMPLE_STUDENTS_BY_CLASS));
      return SAMPLE_STUDENTS_BY_CLASS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_STUDENTS_BY_CLASS;
  }
}

export function saveStoredStudentsByClass(roster: Record<string, string[]>): Record<string, string[]> {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS_ROSTER, JSON.stringify(roster));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_STUDENTS_ROSTER_CHANGED));
    }
    return roster;
  } catch (err) {
    console.error('Lỗi lưu danh sách học sinh:', err);
    return roster;
  }
}

export function addStudentToClassRoster(className: string, studentName: string): Record<string, string[]> {
  const current = getStoredStudentsByClass();
  const classList = current[className] || [];
  if (!classList.includes(studentName)) {
    const updated = {
      ...current,
      [className]: [...classList, studentName]
    };
    return saveStoredStudentsByClass(updated);
  }
  return current;
}

export function removeStudentFromClassRoster(className: string, studentName: string): Record<string, string[]> {
  const current = getStoredStudentsByClass();
  const classList = current[className] || [];
  const updated = {
    ...current,
    [className]: classList.filter(s => s !== studentName)
  };
  return saveStoredStudentsByClass(updated);
}

export function resetStudentsRoster(): Record<string, string[]> {
  return saveStoredStudentsByClass(SAMPLE_STUDENTS_BY_CLASS);
}
