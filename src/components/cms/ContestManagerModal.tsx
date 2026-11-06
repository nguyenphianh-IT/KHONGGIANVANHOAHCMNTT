import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  HelpCircle,
  Users,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  X,
  Save,
  Check,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  ContestInfo,
  ContestQuestion,
  ContestSubmission,
  getStoredContestInfo,
  saveStoredContestInfo,
  getStoredContestQuestions,
  addContestQuestion,
  updateContestQuestion,
  deleteContestQuestion,
  getContestSubmissions,
  deleteContestSubmission,
  resetContestSubmissions,
  formatTime,
  EVENT_CONTEST_DATA_CHANGED
} from '../../data/contestData';
import {
  SCHOOL_CLASSES,
  getStoredStudentsByClass,
  addStudentToClassRoster,
  removeStudentFromClassRoster,
  resetStudentsRoster,
  validateStudentName,
  EVENT_STUDENTS_ROSTER_CHANGED
} from '../../data/studentsData';

interface ContestManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'questions' | 'contest' | 'students' | 'roster';
}

export const ContestManagerModal: React.FC<ContestManagerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'questions'
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'contest' | 'students' | 'roster'>(initialTab);

  // 1. Data States
  const [contestInfo, setContestInfo] = useState<ContestInfo>(getStoredContestInfo);
  const [questions, setQuestions] = useState<ContestQuestion[]>(getStoredContestQuestions);
  const [submissions, setSubmissions] = useState<ContestSubmission[]>(getContestSubmissions);
  const [roster, setRoster] = useState<Record<string, string[]>>(getStoredStudentsByClass);

  // 2. Feedback Toast
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // 3. Question Form Modal State (for Adding/Editing)
  const [editingQuestion, setEditingQuestion] = useState<ContestQuestion | null>(null);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [questionFormData, setQuestionFormData] = useState<{
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    category: ContestQuestion['category'];
  }>({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    category: 'cuoc-doi'
  });

  // Questions Filters
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('all');

  // Students & Submissions Filters
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionClassFilter, setSubmissionClassFilter] = useState('all');

  // Roster Tab State
  const [selectedRosterClass, setSelectedRosterClass] = useState('8A1');
  const [newStudentNameInput, setNewStudentNameInput] = useState('');
  const [rosterError, setRosterError] = useState<string | null>(null);

  // Sync with changes
  useEffect(() => {
    const handleSync = () => {
      setContestInfo(getStoredContestInfo());
      setQuestions(getStoredContestQuestions());
      setSubmissions(getContestSubmissions());
      setRoster(getStoredStudentsByClass());
    };
    window.addEventListener(EVENT_CONTEST_DATA_CHANGED, handleSync);
    window.addEventListener(EVENT_STUDENTS_ROSTER_CHANGED, handleSync);
    return () => {
      window.removeEventListener(EVENT_CONTEST_DATA_CHANGED, handleSync);
      window.removeEventListener(EVENT_STUDENTS_ROSTER_CHANGED, handleSync);
    };
  }, []);

  // Update initialTab when prop changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Toast auto-hide
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Memoized filter calculations (Luôn chạy trước mọi early return để tuân thủ Rules of Hooks)
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.options.some((opt) => opt.toLowerCase().includes(questionSearch.toLowerCase()));
      const matchCategory =
        questionCategoryFilter === 'all' || q.category === questionCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [questions, questionSearch, questionCategoryFilter]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchSearch = s.studentName.toLowerCase().includes(submissionSearch.toLowerCase());
      const matchClass =
        submissionClassFilter === 'all' || s.studentClass === submissionClassFilter;
      return matchSearch && matchClass;
    });
  }, [submissions, submissionSearch, submissionClassFilter]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMsg({ type, text });
  };

  // ─── QUESTIONS MANAGEMENT HANDLERS ────────────────────────────────
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      category: 'cuoc-doi'
    });
    setIsQuestionFormOpen(true);
  };

  const handleOpenEditQuestion = (q: ContestQuestion) => {
    setEditingQuestion(q);
    setQuestionFormData({
      question: q.question,
      options: [q.options[0] || '', q.options[1] || '', q.options[2] || '', q.options[3] || ''],
      correctIndex: q.correctIndex,
      explanation: q.explanation || '',
      category: q.category
    });
    setIsQuestionFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.question.trim()) {
      showToast('error', 'Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!questionFormData.options[i].trim()) {
        showToast('error', `Vui lòng nhập đầy đủ nội dung đáp án ${String.fromCharCode(65 + i)}!`);
        return;
      }
    }

    if (editingQuestion) {
      // Update
      const updated: ContestQuestion = {
        ...editingQuestion,
        question: questionFormData.question.trim(),
        options: questionFormData.options.map((opt) => opt.trim()),
        correctIndex: questionFormData.correctIndex,
        explanation: questionFormData.explanation.trim(),
        category: questionFormData.category
      };
      const res = updateContestQuestion(updated);
      setQuestions(res);
      showToast('success', `Đã cập nhật câu hỏi số ${editingQuestion.id} thành công!`);
    } else {
      // Add
      const res = addContestQuestion({
        question: questionFormData.question.trim(),
        options: questionFormData.options.map((opt) => opt.trim()),
        correctIndex: questionFormData.correctIndex,
        explanation: questionFormData.explanation.trim(),
        category: questionFormData.category
      });
      setQuestions(res);
      showToast('success', 'Đã thêm câu hỏi trắc nghiệm mới thành công!');
    }
    setIsQuestionFormOpen(false);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa câu hỏi số ${id} khỏi ngân hàng đề thi?`)) {
      const res = deleteContestQuestion(id);
      setQuestions(res);
      showToast('info', `Đã xóa câu hỏi số ${id}`);
    }
  };

  // ─── CONTEST SETTINGS HANDLERS ────────────────────────────────────
  const handleSaveContestSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredContestInfo(contestInfo);
    showToast('success', 'Đã lưu cấu hình Hội thi thành công!');
  };

  // ─── SUBMISSIONS & GRADES HANDLERS ────────────────────────────────
  const handleDeleteSubmission = (id: string, name: string) => {
    if (confirm(`Xác nhận xóa kết quả thi của học sinh "${name}"?`)) {
      const res = deleteContestSubmission(id);
      setSubmissions(res);
      showToast('info', `Đã xóa bài thi của học sinh ${name}`);
    }
  };

  const handleResetAllSubmissions = () => {
    if (confirm('Khôi phục danh sách kết quả về mặc định (xóa các lượt thi thử nghiệm)?')) {
      const res = resetContestSubmissions();
      setSubmissions(res);
      showToast('success', 'Đã đặt lại danh sách bài thi về mặc định.');
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      showToast('error', 'Chưa có bài thi nào để xuất bảng điểm!');
      return;
    }
    // Prepare CSV with UTF-8 BOM for Excel
    const headers = ['STT', 'Họ và tên', 'Chi đội lớp', 'Điểm số', 'Tổng số câu', 'Thời gian làm bài', 'Thời điểm nộp bài'];
    const rows = submissions.map((s, idx) => [
      idx + 1,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.studentClass}"`,
      s.score,
      s.totalQuestions,
      `"${formatTime(s.timeSpentSeconds)}"`,
      `"${s.submittedAt}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bang_Diem_Hoi_Thi_THCS_Nguyen_Trung_Truc_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Đã xuất file bảng điểm Excel/CSV thành công!');
  };

  // ─── ROSTER MANAGEMENT HANDLERS ───────────────────────────────────
  const currentClassStudents = roster[selectedRosterClass] || [];

  const handleAddStudentToRoster = (e: React.FormEvent) => {
    e.preventDefault();
    setRosterError(null);
    const check = validateStudentName(newStudentNameInput);
    if (!check.isValid) {
      setRosterError(check.errorMessage || 'Tên học sinh không hợp lệ');
      return;
    }
    const sanitized = check.sanitizedName || newStudentNameInput.trim();
    if (currentClassStudents.includes(sanitized)) {
      setRosterError(`Học sinh "${sanitized}" đã có trong danh sách lớp ${selectedRosterClass}!`);
      return;
    }
    const updated = addStudentToClassRoster(selectedRosterClass, sanitized);
    setRoster(updated);
    setNewStudentNameInput('');
    showToast('success', `Đã thêm "${sanitized}" vào lớp ${selectedRosterClass}`);
  };

  const handleRemoveStudentFromRoster = (studentName: string) => {
    if (confirm(`Xóa học sinh "${studentName}" khỏi danh sách lớp ${selectedRosterClass}?`)) {
      const updated = removeStudentFromClassRoster(selectedRosterClass, studentName);
      setRoster(updated);
      showToast('info', `Đã xóa học sinh ${studentName}`);
    }
  };

  const handleResetRoster = () => {
    if (confirm('Khôi phục danh sách học sinh các lớp về mẫu chuẩn ban đầu?')) {
      const updated = resetStudentsRoster();
      setRoster(updated);
      showToast('success', 'Đã khôi phục danh sách học sinh mẫu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-heritage-ink-950/85 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 animate-bounce">
          <div
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-bold border ${
              toastMsg.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-400'
                : toastMsg.type === 'error'
                ? 'bg-red-800 text-white border-red-400'
                : 'bg-heritage-ink-900 text-heritage-gold-300 border-heritage-gold-400'
            }`}
          >
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            ) : toastMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-heritage-gold-400 flex-shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="bg-heritage-ivory-50 rounded-3xl max-w-6xl w-full shadow-2xl border-2 border-heritage-gold-400/80 max-h-[95vh] flex flex-col overflow-hidden text-heritage-ink-900 animate-slideUp">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0 shadow-md">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-heritage-gold-400/20 border border-heritage-gold-300 flex items-center justify-center text-heritage-gold-300 flex-shrink-0">
              <Trophy className="w-5 h-5 fill-heritage-gold-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                Hệ Quản Trị Hội Thi, Ngân Hàng Câu Hỏi & Học Sinh
              </h2>
              <p className="text-[11px] text-heritage-gold-200 truncate">
                Trường THCS Nguyễn Trung Trực • Liên đội & Chi đoàn Giáo viên
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Đóng bảng quản trị"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Navigation Tabs Bar */}
        <div className="bg-heritage-ivory-200 border-b border-heritage-gold-300/80 px-4 sm:px-6 flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar flex-shrink-0 py-2">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-heritage-red-700 text-white shadow-sm'
                : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ngân hàng Câu hỏi ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contest')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'contest'
                ? 'bg-heritage-red-700 text-white shadow-sm'
                : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Cấu hình Hội thi</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-heritage-red-700 text-white shadow-sm'
                : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Bài thi & Bảng điểm ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'roster'
                ? 'bg-heritage-red-700 text-white shadow-sm'
                : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh mục Lớp & Học sinh (24 lớp)</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 select-text">
          {/* ─────────────────────────────────────────────────────────────
              TAB 1: NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Actions & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-heritage-gold-300/80 shadow-xs">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm nội dung câu hỏi hoặc đáp án..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                    />
                  </div>

                  <select
                    value={questionCategoryFilter}
                    onChange={(e) => setQuestionCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                  >
                    <option value="all">Tất cả chủ đề ({questions.length})</option>
                    <option value="cuoc-doi">Cuộc đời & Sự nghiệp</option>
                    <option value="tu-tuong">Tư tưởng Hồ Chí Minh</option>
                    <option value="5-dieu-bac-day">5 Điều Bác Hồ dạy</option>
                    <option value="thoi-an-truyen-thong">Truyền thống Thới An & NTT</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddQuestion}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm câu hỏi mới</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-heritage-ivory-300">
                    <BookOpen className="w-10 h-10 text-heritage-ink-400 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm text-heritage-ink-600 font-medium">
                      Không tìm thấy câu hỏi nào phù hợp với từ khóa!
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl p-4 border border-heritage-ivory-300 hover:border-heritage-gold-400 shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-heritage-red-100 text-heritage-red-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-heritage-gold-50 text-heritage-gold-800 border border-heritage-gold-300">
                            {q.category === 'cuoc-doi'
                              ? 'Cuộc đời & Sự nghiệp'
                              : q.category === 'tu-tuong'
                              ? 'Tư tưởng Hồ Chí Minh'
                              : q.category === '5-dieu-bac-day'
                              ? '5 Điều Bác Hồ dạy'
                              : 'Truyền thống Thới An'}
                          </span>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="p-1.5 rounded-lg bg-heritage-ivory-100 hover:bg-heritage-gold-100 text-heritage-ink-700 hover:text-heritage-red-700 transition"
                            title="Sửa nội dung câu hỏi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 rounded-lg bg-heritage-ivory-100 hover:bg-red-50 text-heritage-ink-700 hover:text-red-700 transition"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h4 className="font-serif font-bold text-sm sm:text-base text-heritage-ink-900 leading-snug mb-3">
                        {q.question}
                      </h4>

                      {/* 4 Choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl text-xs flex items-start space-x-2 border ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                                  : 'bg-heritage-ivory-50 border-heritage-ivory-200 text-heritage-ink-800'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                  isCorrect ? 'bg-emerald-700 text-white' : 'bg-heritage-ivory-300 text-heritage-ink-700'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && (
                                <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 ml-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="text-[11px] sm:text-xs text-heritage-ink-600 bg-heritage-gold-50/60 p-2.5 rounded-xl border border-heritage-gold-200">
                          <span className="font-bold text-heritage-gold-800">💡 Căn cứ lịch sử: </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: CẤU HÌNH HỘI THI
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'contest' && (
            <form onSubmit={handleSaveContestSettings} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-heritage-gold-300/80 shadow-sm">
              <div className="border-b border-heritage-ivory-300 pb-3">
                <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900">
                  Cấu hình Chung Hội Thi Trực Tuyến
                </h3>
                <p className="text-xs text-heritage-ink-600">
                  Điều chỉnh thông tin giải thi đua, thời gian làm bài và trạng thái cổng thi của Liên đội
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Tên Hội thi chính thức
                  </label>
                  <input
                    type="text"
                    value={contestInfo.title}
                    onChange={(e) => setContestInfo({ ...contestInfo, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm font-bold text-heritage-ink-900 focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Khẩu hiệu / Mục đích thi đua
                  </label>
                  <input
                    type="text"
                    value={contestInfo.subtitle}
                    onChange={(e) => setContestInfo({ ...contestInfo, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm text-heritage-ink-800 focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                      Thời lượng làm bài (Phút)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={contestInfo.durationMinutes}
                      onChange={(e) =>
                        setContestInfo({ ...contestInfo, durationMinutes: parseInt(e.target.value) || 10 })
                      }
                      className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm font-bold text-heritage-ink-900 focus:outline-none focus:border-heritage-red-700"
                      required
                    />
                    <span className="text-[10px] text-heritage-ink-500 italic mt-0.5 block">
                      Đồng hồ đếm ngược trong phòng thi sẽ chạy theo số phút này.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                      Năm học tổ chức
                    </label>
                    <input
                      type="text"
                      value={contestInfo.academicYear}
                      onChange={(e) => setContestInfo({ ...contestInfo, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm text-heritage-ink-800 focus:outline-none focus:border-heritage-red-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Đơn vị tổ chức & Chỉ đạo
                  </label>
                  <input
                    type="text"
                    value={contestInfo.organizer}
                    onChange={(e) => setContestInfo({ ...contestInfo, organizer: e.target.value })}
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm text-heritage-ink-800 focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Thẻ biểu trưng / Huy hiệu đầu trang
                  </label>
                  <input
                    type="text"
                    value={contestInfo.bannerTag}
                    onChange={(e) => setContestInfo({ ...contestInfo, bannerTag: e.target.value })}
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm text-heritage-ink-800 focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 bg-heritage-ivory-100 rounded-2xl border border-heritage-ivory-300">
                    <input
                      type="checkbox"
                      checked={contestInfo.isOpen !== false}
                      onChange={(e) => setContestInfo({ ...contestInfo, isOpen: e.target.checked })}
                      className="w-4 h-4 text-heritage-red-700 rounded focus:ring-heritage-red-700"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-heritage-ink-900 block">
                        Mở cổng nhận bài thi trực tuyến
                      </span>
                      <span className="text-[11px] text-heritage-ink-600 block">
                        Nếu bỏ chọn, học sinh sẽ không thể bấm vào thi và nhận thông báo "Hội thi đã kết thúc".
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-heritage-ivory-200 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu cấu hình Hội thi</span>
                </button>
              </div>
            </form>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: BÀI THI & BẢNG ĐIỂM HỌC SINH
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Statistics & Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-heritage-gold-300/80 shadow-xs">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên học sinh..."
                      value={submissionSearch}
                      onChange={(e) => setSubmissionSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                    />
                  </div>

                  <select
                    value={submissionClassFilter}
                    onChange={(e) => setSubmissionClassFilter(e.target.value)}
                    className="px-3 py-1.5 bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                  >
                    <option value="all">Tất cả lớp ({submissions.length} bài)</option>
                    {SCHOOL_CLASSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
                    title="Xuất danh sách điểm thi ra file Excel (CSV)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xuất Excel (CSV)</span>
                  </button>

                  <button
                    onClick={handleResetAllSubmissions}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded-xl text-xs font-semibold transition"
                    title="Đặt lại bảng điểm về mặc định"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại</span>
                  </button>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-2xl border border-heritage-gold-300/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-heritage-ivory-200 text-heritage-red-950 font-bold uppercase text-[10px] sm:text-[11px] tracking-wider border-b border-heritage-gold-300">
                      <tr>
                        <th className="py-3 px-3 sm:px-4">Hạng</th>
                        <th className="py-3 px-3 sm:px-4">Họ và Tên Học Sinh</th>
                        <th className="py-3 px-3 sm:px-4">Chi Đội Lớp</th>
                        <th className="py-3 px-3 sm:px-4">Điểm Số</th>
                        <th className="py-3 px-3 sm:px-4">Thời Gian</th>
                        <th className="py-3 px-3 sm:px-4">Thời Điểm Thi</th>
                        <th className="py-3 px-3 sm:px-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-heritage-ivory-200">
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-heritage-ink-500">
                            Chưa có dữ liệu bài thi nào phù hợp với bộ lọc!
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-heritage-ivory-50 transition">
                            <td className="py-3 px-3 sm:px-4 font-bold text-heritage-ink-700">
                              {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                            </td>
                            <td className="py-3 px-3 sm:px-4 font-bold text-heritage-ink-900">
                              {sub.studentName}
                            </td>
                            <td className="py-3 px-3 sm:px-4">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-heritage-ivory-200 font-bold text-heritage-red-800 text-xs">
                                {sub.studentClass}
                              </span>
                            </td>
                            <td className="py-3 px-3 sm:px-4">
                              <span className="font-bold text-heritage-red-700">
                                {sub.score}
                              </span>
                              <span className="text-heritage-ink-400">/{sub.totalQuestions}</span>
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-heritage-ink-600 font-mono text-xs">
                              {formatTime(sub.timeSpentSeconds)}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-heritage-ink-500 text-xs">
                              {sub.submittedAt}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-right">
                              <button
                                onClick={() => handleDeleteSubmission(sub.id, sub.studentName)}
                                className="p-1.5 rounded-lg text-heritage-ink-400 hover:text-red-700 hover:bg-red-50 transition"
                                title="Xóa bài thi này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 4: DANH MỤC LỚP & HỌC SINH MẪU (24 LỚP)
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-white p-4 rounded-2xl border border-heritage-gold-300/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-heritage-red-100 text-heritage-red-800 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-heritage-ink-900">
                      Danh Mục Học Sinh Gợi Ý Theo Lớp (Giải pháp 1)
                    </h3>
                    <p className="text-[11px] text-heritage-ink-600">
                      Giúp học sinh chọn tên nhanh trong 1 giây, hạn chế tối đa việc gõ tên bậy hoặc sai chính tả.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetRoster}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded-xl text-xs font-semibold transition"
                  title="Khôi phục danh sách chuẩn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục mẫu</span>
                </button>
              </div>

              {/* Class Selection & Student Editor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left 4 Cols: Class Selector */}
                <div className="md:col-span-4 bg-white rounded-2xl border border-heritage-ivory-300 p-3 max-h-[500px] overflow-y-auto space-y-1">
                  <span className="text-[10px] font-bold text-heritage-ink-500 uppercase tracking-wider px-2 block mb-1">
                    Chọn Chi đội Lớp (24 Lớp)
                  </span>
                  {SCHOOL_CLASSES.map((cls) => {
                    const isSelected = cls.id === selectedRosterClass;
                    const count = (roster[cls.id] || []).length;

                    return (
                      <button
                        key={cls.id}
                        onClick={() => {
                          setSelectedRosterClass(cls.id);
                          setRosterError(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-heritage-red-700 text-white shadow-xs'
                            : 'hover:bg-heritage-ivory-100 text-heritage-ink-800'
                        }`}
                      >
                        <span className="truncate">{cls.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-heritage-ivory-200 text-heritage-ink-600'
                          }`}
                        >
                          {count} em
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right 8 Cols: Students in Selected Class */}
                <div className="md:col-span-8 bg-white rounded-2xl border border-heritage-ivory-300 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-heritage-ivory-200 pb-2.5">
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-heritage-red-900">
                        Danh sách học sinh lớp {selectedRosterClass}
                      </h4>
                      <p className="text-[11px] text-heritage-ink-500">
                        Đang có {currentClassStudents.length} học sinh gợi ý trong menu chọn tên
                      </p>
                    </div>
                  </div>

                  {/* Add Student Form */}
                  <form onSubmit={handleAddStudentToRoster} className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Nhập họ và tên học sinh mới (ví dụ: Nguyễn Hoàng Nam)..."
                        value={newStudentNameInput}
                        onChange={(e) => {
                          setNewStudentNameInput(e.target.value);
                          setRosterError(null);
                        }}
                        className="flex-1 px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition whitespace-nowrap"
                      >
                        + Thêm vào lớp
                      </button>
                    </div>
                    {rosterError && (
                      <p className="text-xs text-red-700 font-semibold">{rosterError}</p>
                    )}
                  </form>

                  {/* Student List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1">
                    {currentClassStudents.length === 0 ? (
                      <p className="text-xs text-heritage-ink-500 col-span-2 py-6 text-center">
                        Lớp này chưa có học sinh nào trong danh mục mẫu.
                      </p>
                    ) : (
                      currentClassStudents.map((stName, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-heritage-ivory-50 border border-heritage-ivory-200 text-xs"
                        >
                          <span className="font-bold text-heritage-ink-800 truncate mr-2">
                            {idx + 1}. {stName}
                          </span>
                          <button
                            onClick={() => handleRemoveStudentFromRoster(stName)}
                            className="p-1 rounded text-heritage-ink-400 hover:text-red-700 transition"
                            title={`Xóa ${stName} khỏi lớp`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="bg-heritage-ivory-100 px-6 py-3 border-t border-heritage-ivory-300 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-heritage-ink-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mọi thay đổi tự động đồng bộ ngay lập tức tới giao diện phòng thi của học sinh.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-heritage-red-800 hover:bg-heritage-red-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition"
          >
            Hoàn tất & Đóng
          </button>
        </footer>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          INLINE MODAL: THÊM / SỬA CÂU HỎI TRẮC NGHIỆM
          ───────────────────────────────────────────────────────────── */}
      {isQuestionFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-heritage-gold-400 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between border-b border-heritage-ivory-300 pb-3 mb-4">
              <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900">
                {editingQuestion ? `Chỉnh sửa Câu hỏi #${editingQuestion.id}` : 'Thêm Câu Hỏi Trắc Nghiệm Mới'}
              </h3>
              <button
                onClick={() => setIsQuestionFormOpen(false)}
                className="p-1 rounded-full hover:bg-heritage-ivory-200"
              >
                <X className="w-5 h-5 text-heritage-ink-700" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Chủ đề câu hỏi
                </label>
                <select
                  value={questionFormData.category}
                  onChange={(e) =>
                    setQuestionFormData({
                      ...questionFormData,
                      category: e.target.value as ContestQuestion['category']
                    })
                  }
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-heritage-red-700"
                >
                  <option value="cuoc-doi">Cuộc đời & Sự nghiệp của Bác</option>
                  <option value="tu-tuong">Tư tưởng, Đạo đức, Phong cách Hồ Chí Minh</option>
                  <option value="5-dieu-bac-day">5 Điều Bác Hồ dạy Thiếu niên, Nhi đồng</option>
                  <option value="thoi-an-truyen-thong">Truyền thống Thới An & Trường Nguyễn Trung Trực</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Nội dung câu hỏi <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={questionFormData.question}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, question: e.target.value })
                  }
                  placeholder="Ví dụ: Bác Hồ ra đi tìm đường cứu nước từ bến cảng nào vào ngày 05/06/1911?"
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-heritage-red-700"
                  required
                />
              </div>

              {/* 4 Choices */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider">
                  4 Lựa chọn đáp án (Chọn nút tròn bên trái để xác định đáp án đúng) <span className="text-red-600">*</span>
                </label>
                {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                  const isCorrect = questionFormData.correctIndex === optIdx;
                  return (
                    <div
                      key={letter}
                      className={`flex items-center space-x-2.5 p-2 rounded-xl border transition ${
                        isCorrect ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-heritage-ivory-50 border-heritage-ivory-200'
                      }`}
                    >
                      <label className="flex items-center space-x-1.5 cursor-pointer flex-shrink-0">
                        <input
                          type="radio"
                          name="correctAnswerRadio"
                          checked={isCorrect}
                          onChange={() =>
                            setQuestionFormData({ ...questionFormData, correctIndex: optIdx })
                          }
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isCorrect ? 'bg-emerald-700 text-white' : 'bg-heritage-ivory-200 text-heritage-ink-700'
                        }`}>
                          {letter}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={questionFormData.options[optIdx]}
                        onChange={(e) => {
                          const newOpts = [...questionFormData.options] as [string, string, string, string];
                          newOpts[optIdx] = e.target.value;
                          setQuestionFormData({ ...questionFormData, options: newOpts });
                        }}
                        placeholder={`Nhập nội dung đáp án ${letter}...`}
                        className="flex-1 px-3 py-1.5 bg-white border border-heritage-ivory-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Căn cứ & Giải thích lịch sử (Hiển thị cho học sinh sau khi nộp bài)
                </label>
                <textarea
                  rows={2}
                  value={questionFormData.explanation}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, explanation: e.target.value })
                  }
                  placeholder="Ví dụ: Ngày 05/06/1911, người thanh niên Nguyễn Tất Thành lên tàu Latouche-Tréville..."
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsQuestionFormOpen(false)}
                  className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition"
                >
                  {editingQuestion ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
