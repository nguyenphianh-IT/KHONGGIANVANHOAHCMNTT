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
  RotateCcw,
  X,
  Check,
  Sparkles,
  Archive,
  Clock,
  PlayCircle,
  PauseCircle,
  FolderArchive,
  FileSpreadsheet,
  Cloud,
  CloudUpload,
  RefreshCw,
  Settings
} from 'lucide-react';
import {
  ContestInfo,
  ContestQuestion,
  ContestSubmission,
  ContestStatus,
  getStoredContestsList,
  getActiveContestId,
  setActiveContest,
  toggleContestActive,
  getStoredContestInfo,
  addContest,
  updateContest,
  deleteContest,
  archiveContest,
  getStoredContestQuestions,
  addContestQuestion,
  updateContestQuestion,
  deleteContestQuestion,
  getContestSubmissions,
  deleteContestSubmission,
  resetContestSubmissions,
  formatTime,
  EVENT_CONTEST_DATA_CHANGED,
  syncContestsAndSubmissionsToSupabase,
  fetchSupabaseContestData
} from '../../data/contestData';
import {
  ClassInfo,
  getStoredClasses,
  addClass,
  deleteClass,
  resetClasses,
  parseBulkStudentNames,
  bulkAddStudentsToClass,
  clearClassRoster,
  getStoredStudentsByClass,
  addStudentToClassRoster,
  removeStudentFromClassRoster,
  resetStudentsRoster,
  validateStudentName,
  EVENT_STUDENTS_ROSTER_CHANGED
} from '../../data/studentsData';
import { useAuth } from '../../context/AuthContext';

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
  const [contestsList, setContestsList] = useState<ContestInfo[]>(getStoredContestsList);
  const [activeContestId, setActiveContestIdState] = useState<string>(getActiveContestId);
  const [contestInfo, setContestInfo] = useState<ContestInfo>(getStoredContestInfo);
  const [questions, setQuestions] = useState<ContestQuestion[]>(getStoredContestQuestions);
  const [submissions, setSubmissions] = useState<ContestSubmission[]>(getContestSubmissions);
  const [classesList, setClassesList] = useState<ClassInfo[]>(getStoredClasses);
  const [roster, setRoster] = useState<Record<string, string[]>>(getStoredStudentsByClass);

  // 2. Feedback Toast & Cloud Sync State
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);

  const handleSyncToCloud = async () => {
    setIsSyncingCloud(true);
    setCloudSyncStatus(null);
    try {
      const res = await syncContestsAndSubmissionsToSupabase(contestsList, submissions);
      if (res.success) {
        setCloudSyncStatus(res.message);
        setToastMsg({ type: 'success', text: res.message });
      } else {
        setCloudSyncStatus(res.message);
        setToastMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      const msg = `Lỗi: ${err?.message || 'Không thể đồng bộ Supabase'}`;
      setCloudSyncStatus(msg);
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setCloudSyncStatus(null), 6000);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncingCloud(true);
    setCloudSyncStatus(null);
    try {
      const res = await fetchSupabaseContestData();
      if (res.success) {
        if (res.contests) setContestsList(res.contests);
        if (res.submissions) setSubmissions(res.submissions);
        const successMsg = 'Đã tải thành công dữ liệu mới nhất từ Supabase Cloud!';
        setCloudSyncStatus(successMsg);
        setToastMsg({ type: 'success', text: successMsg });
      } else {
        const errMsg = res.error || 'Không thể tải dữ liệu từ Cloud';
        setCloudSyncStatus(errMsg);
        setToastMsg({ type: 'error', text: errMsg });
      }
    } catch (err: any) {
      const msg = `Lỗi: ${err?.message || 'Không thể tải từ Supabase'}`;
      setCloudSyncStatus(msg);
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setCloudSyncStatus(null), 5000);
    }
  };

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

  // 4. Contest Form Modal State (for Adding/Editing Contests)
  const [isContestFormOpen, setIsContestFormOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<ContestInfo | null>(null);
  const [contestFormData, setContestFormData] = useState<Omit<ContestInfo, 'id'>>({
    title: '',
    subtitle: '',
    academicYear: 'Năm học 2024 - 2025',
    durationMinutes: 10,
    totalQuestions: 10,
    organizer: 'Liên đội & Chi đoàn Giáo viên Trường THCS Nguyễn Trung Trực (Phường Thới An)',
    bannerTag: '⭐ HỘI THI TRỰC TUYẾN CHÍNH THỨC',
    targetAudience: 'Dành cho toàn thể học sinh',
    status: 'active',
    startDate: '',
    endDate: '',
    summaryNote: '',
  });

  // 5. Archive Contest Modal State
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archivingContest, setArchivingContest] = useState<ContestInfo | null>(null);
  const [archiveSummaryInput, setArchiveSummaryInput] = useState('');

  // 6. Filters
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('all');

  const [selectedContestFilter, setSelectedContestFilter] = useState<string>(() => getActiveContestId());
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionClassFilter, setSubmissionClassFilter] = useState('all');

  // 7. Roster & Class Management State
  const [selectedRosterClass, setSelectedRosterClass] = useState('8A1');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | '6' | '7' | '8' | '9'>('all');
  const [newStudentNameInput, setNewStudentNameInput] = useState('');
  const [rosterError, setRosterError] = useState<string | null>(null);

  // Modal Thêm Lớp Học Mới
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [classFormData, setClassFormData] = useState<{ id: string; name: string; grade: '6' | '7' | '8' | '9' }>({
    id: '',
    name: '',
    grade: '8',
  });
  const [newClassInitialStudentsText, setNewClassInitialStudentsText] = useState('');

  // Khu vực Dán Nhanh Danh Sách Học Sinh (Bulk Import)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [bulkImportReplace, setBulkImportReplace] = useState(false);

  // Sync with changes
  useEffect(() => {
    const handleSync = () => {
      setContestsList(getStoredContestsList());
      setActiveContestIdState(getActiveContestId());
      setContestInfo(getStoredContestInfo());
      setQuestions(getStoredContestQuestions());
      setSubmissions(getContestSubmissions());
      setClassesList(getStoredClasses());
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
      const matchContest =
        selectedContestFilter === 'all' || s.contestId === selectedContestFilter;
      const matchSearch = s.studentName.toLowerCase().includes(submissionSearch.toLowerCase());
      const matchClass =
        submissionClassFilter === 'all' || s.studentClass === submissionClassFilter;
      return matchContest && matchSearch && matchClass;
    });
  }, [submissions, selectedContestFilter, submissionSearch, submissionClassFilter]);

  // Thống kê của Hội thi đang được chọn
  const currentContestObj = useMemo(() => {
    if (selectedContestFilter === 'all') return null;
    return contestsList.find((c) => c.id === selectedContestFilter) || null;
  }, [contestsList, selectedContestFilter]);

  const contestStats = useMemo(() => {
    const list = selectedContestFilter === 'all'
      ? submissions
      : submissions.filter((s) => s.contestId === selectedContestFilter);

    if (list.length === 0) {
      return { total: 0, avgScore: 0, perfectCount: 0, topClass: 'Chưa có' };
    }

    const total = list.length;
    const avgScore = (list.reduce((acc, curr) => acc + curr.score, 0) / total).toFixed(1);
    const perfectCount = list.filter((s) => s.score === s.totalQuestions && s.totalQuestions > 0).length;

    const classCountMap: Record<string, number> = {};
    list.forEach((s) => {
      classCountMap[s.studentClass] = (classCountMap[s.studentClass] || 0) + 1;
    });
    let topClass = '8A1';
    let maxCount = 0;
    Object.entries(classCountMap).forEach(([cls, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topClass = cls;
      }
    });

    return { total, avgScore, perfectCount, topClass };
  }, [submissions, selectedContestFilter]);

  const { user, hasRole } = useAuth();
  const isStaff = Boolean(user && (hasRole('editor') || hasRole('admin') || hasRole('super_admin')));

  if (!isOpen) return null;

  if (!isStaff) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-ink-950/75 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-heritage-ivory-100 border-2 border-heritage-red-400 rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-heritage-red-100 border border-heritage-red-300 text-heritage-red-700 flex items-center justify-center shadow-inner">
            <AlertCircle className="w-9 h-9" />
          </div>
          <h3 className="font-serif font-black text-xl text-heritage-red-950 mb-2">
            Khu Vực Giới Hạn Quản Trị
          </h3>
          <p className="text-xs sm:text-sm text-heritage-ink-700 mb-6 leading-relaxed">
            Ngân hàng câu hỏi trắc nghiệm, đáp án chuẩn, bảng điểm và danh sách học sinh chỉ dành riêng cho <strong>Ban Giám Khảo, Thầy/Cô Giáo Viên và Cán Bộ Quản Trị</strong>. Học sinh tham gia thi không có quyền truy cập khu vực này.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-sm font-bold transition shadow-md"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    );
  }

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

  // ─── MULTI-CONTEST MANAGEMENT HANDLERS ────────────────────────────
  const handleToggleContestActive = (contestId: string, isActive: boolean) => {
    const updated = toggleContestActive(contestId, isActive);
    setContestsList(updated);
    const target = updated.find((c) => c.id === contestId);
    if (target) {
      if (target.id === activeContestId) {
        setContestInfo(target);
      }
      showToast(
        isActive ? 'success' : 'info',
        isActive
          ? `Đã mở cổng thi song song cho "${target.title}"!`
          : `Đã tạm đóng cổng nhận bài cho "${target.title}"!`
      );
    }
  };

  const handleSwitchActiveContest = (contestId: string) => {
    const updated = setActiveContest(contestId);
    setContestsList(updated);
    setActiveContestIdState(contestId);
    const target = updated.find((c) => c.id === contestId);
    if (target) {
      setContestInfo(target);
      setSelectedContestFilter(contestId);
      showToast('success', `Đã chọn "${target.title}" làm Hội thi hiển thị chính trên trang chủ!`);
    }
  };

  const handleOpenAddContest = () => {
    setEditingContest(null);
    setContestFormData({
      title: '',
      subtitle: '',
      academicYear: 'Năm học 2024 - 2025',
      durationMinutes: 10,
      totalQuestions: 10,
      organizer: 'Liên đội & Chi đoàn Giáo viên Trường THCS Nguyễn Trung Trực (Phường Thới An)',
      bannerTag: '⭐ HỘI THI TRỰC TUYẾN MỚI',
      targetAudience: 'Dành cho Khối 6, 7 hoặc Khối 8, 9',
      status: 'active',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: '',
      summaryNote: '',
    });
    setIsContestFormOpen(true);
  };

  const handleOpenEditContest = (c: ContestInfo) => {
    setEditingContest(c);
    setContestFormData({
      title: c.title,
      subtitle: c.subtitle,
      academicYear: c.academicYear,
      durationMinutes: c.durationMinutes,
      totalQuestions: c.totalQuestions,
      organizer: c.organizer,
      bannerTag: c.bannerTag,
      targetAudience: c.targetAudience || '',
      status: c.status,
      startDate: c.startDate || '',
      endDate: c.endDate || '',
      summaryNote: c.summaryNote || '',
    });
    setIsContestFormOpen(true);
  };

  const handleSaveContestForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestFormData.title.trim()) {
      showToast('error', 'Vui lòng nhập tên hội thi!');
      return;
    }

    if (editingContest) {
      const updatedContest: ContestInfo = {
        ...editingContest,
        ...contestFormData,
        isOpen: contestFormData.status === 'active',
      };
      const res = updateContest(updatedContest);
      setContestsList(res);
      if (updatedContest.id === activeContestId) {
        setContestInfo(updatedContest);
      }
      showToast('success', `Đã cập nhật thông tin hội thi "${updatedContest.title}"!`);
    } else {
      const newId = `hoi-thi-${Date.now()}`;
      const res = addContest({
        ...contestFormData,
        id: newId,
        isOpen: contestFormData.status === 'active',
      });
      setContestsList(res);
      showToast('success', 'Đã khởi tạo hội thi mới thành công!');
    }
    setIsContestFormOpen(false);
  };

  const handleDeleteContestClick = (c: ContestInfo) => {
    if (contestsList.length <= 1) {
      showToast('error', 'Không thể xóa hội thi duy nhất trong hệ thống!');
      return;
    }
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa hội thi "${c.title}"? Dữ liệu bài thi của hội thi này sẽ được dọn dẹp an toàn.`)) {
      try {
        const res = deleteContest(c.id);
        setContestsList(res);
        if (c.id === activeContestId) {
          handleSwitchActiveContest(res[0].id);
        }
        showToast('info', `Đã xóa hội thi "${c.title}"`);
      } catch (err: any) {
        showToast('error', err?.message || 'Lỗi khi xóa hội thi');
      }
    }
  };

  // Mở modal đóng gói & lưu trữ kết quả hội thi
  const handleOpenArchiveModal = (c: ContestInfo) => {
    setArchivingContest(c);
    const subCount = submissions.filter((s) => s.contestId === c.id).length;
    setArchiveSummaryInput(
      c.summaryNote ||
      `Tổng kết đợt thi đua: Có ${subCount} học sinh tham gia hoàn thành bài thi. Đã phê chuẩn danh sách khen thưởng và lưu trữ kỷ yếu.`
    );
    setIsArchiveModalOpen(true);
  };

  const handleConfirmArchiveContest = () => {
    if (!archivingContest) return;
    const res = archiveContest(archivingContest.id, archiveSummaryInput.trim());
    setContestsList(res);
    setIsArchiveModalOpen(false);
    showToast('success', `Đã đóng gói và lưu trữ hồ sơ kết quả hội thi "${archivingContest.title}" vào Kỷ yếu thành công!`);
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
    if (filteredSubmissions.length === 0) {
      showToast('error', 'Chưa có bài thi nào trong bộ lọc để xuất file!');
      return;
    }

    const targetContest = currentContestObj || contestInfo;
    const exportDate = new Date().toLocaleDateString('vi-VN');

    const headers = [
      'STT / Hạng',
      'Họ và Tên Học Sinh',
      'Lớp / Chi Đội',
      'Điểm Số',
      'Tổng Số Câu',
      'Thời Gian Làm Bài',
      'Thời Điểm Nộp Bài',
      'Xếp Loại / Danh Hiệu',
      'Tên Hội Thi'
    ];

    const rows = filteredSubmissions.map((s, idx) => [
      idx + 1,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.studentClass}"`,
      s.score,
      s.totalQuestions,
      `"${formatTime(s.timeSpentSeconds)}"`,
      `"${s.submittedAt}"`,
      `"${s.award || (s.score === 10 ? 'Xuất Sắc (10/10)' : s.score >= 8 ? 'Giỏi' : s.score >= 5 ? 'Đạt Chuẩn' : 'Cần Rèn Luyện')}"`,
      `"${(contestsList.find((c) => c.id === s.contestId)?.title || targetContest.title).replace(/"/g, '""')}"`
    ]);

    const titleBlock = [
      `"TRƯỜNG THCS NGUYỄN TRUNG TRỰC - PHƯỜNG THỚI AN - THÀNH PHỐ HỒ CHÍ MINH"`,
      `"BẢNG ĐIỂM & KẾT QUẢ HỘI THI TRỰC TUYẾN: ${targetContest.title.toUpperCase()}"`,
      `"Niên khóa: ${targetContest.academicYear} - Ngày xuất báo cáo: ${exportDate}"`,
      `"Đơn vị tổ chức: ${targetContest.organizer}"`,
      `""`
    ].join('\r\n');

    const csvContent = '\uFEFF' + titleBlock + '\r\n' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = targetContest.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 35);
    link.download = `Bang_Diem_${safeTitle}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Đã xuất file bảng điểm Excel/CSV thành công!');
  };

  // ─── ROSTER MANAGEMENT HANDLERS ───────────────────────────────────
  const currentClassStudents = roster[selectedRosterClass] || [];

  const currentClassObj = useMemo(() => {
    return classesList.find((c) => c.id === selectedRosterClass) || null;
  }, [classesList, selectedRosterClass]);

  const filteredClasses = useMemo(() => {
    if (selectedGradeFilter === 'all') return classesList;
    return classesList.filter((c) => c.grade === selectedGradeFilter);
  }, [classesList, selectedGradeFilter]);

  const parsedBulkNames = useMemo(() => {
    return parseBulkStudentNames(bulkImportText);
  }, [bulkImportText]);

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

  // ─── CLASS & BULK ROSTER HANDLERS ─────────────────────────────────
  const handleOpenAddClassModal = () => {
    setClassFormData({
      id: '',
      name: '',
      grade: '8',
    });
    setNewClassInitialStudentsText('');
    setIsAddClassModalOpen(true);
  };

  const handleSaveNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    const id = classFormData.id.trim().toUpperCase().replace(/\s+/g, '');
    if (!id) {
      showToast('error', 'Vui lòng nhập mã lớp (ví dụ: 6A7, 8A7, 6/1)!');
      return;
    }
    const name = classFormData.name.trim() || `Lớp ${id}`;
    try {
      const updatedClasses = addClass({
        id,
        name,
        grade: classFormData.grade,
      });
      setClassesList(updatedClasses);

      // Nếu có dán danh sách học sinh ban đầu
      if (newClassInitialStudentsText.trim()) {
        const parsed = parseBulkStudentNames(newClassInitialStudentsText);
        if (parsed.length > 0) {
          const updatedRoster = bulkAddStudentsToClass(id, parsed, true);
          setRoster(updatedRoster);
        }
      }

      setSelectedRosterClass(id);
      setIsAddClassModalOpen(false);
      showToast('success', `Đã thêm thành công lớp "${name}" vào danh mục nhà trường!`);
    } catch (err: any) {
      showToast('error', err?.message || 'Lỗi khi thêm lớp học');
    }
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (classesList.length <= 1) {
      showToast('error', 'Hệ thống yêu cầu duy trì ít nhất 01 lớp học!');
      return;
    }
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa lớp "${className}" khỏi danh mục nhà trường?`)) {
      try {
        const updated = deleteClass(classId);
        setClassesList(updated);
        if (selectedRosterClass === classId) {
          setSelectedRosterClass(updated[0].id);
        }
        showToast('info', `Đã xóa lớp "${className}"`);
      } catch (err: any) {
        showToast('error', err?.message || 'Lỗi khi xóa lớp');
      }
    }
  };

  const handleSaveBulkStudents = () => {
    const parsed = parseBulkStudentNames(bulkImportText);
    if (parsed.length === 0) {
      showToast('error', 'Không tìm thấy họ tên học sinh hợp lệ trong nội dung vừa dán!');
      return;
    }
    const updated = bulkAddStudentsToClass(selectedRosterClass, parsed, bulkImportReplace);
    setRoster(updated);
    setBulkImportText('');
    setIsBulkImportOpen(false);
    showToast('success', `Đã nhập thành công ${parsed.length} học sinh vào lớp ${selectedRosterClass}!`);
  };

  const handleClearClassRoster = (classId: string) => {
    if (confirm(`Xóa toàn bộ danh sách học sinh của lớp ${classId} để nạp lại danh sách mới?`)) {
      const updated = clearClassRoster(classId);
      setRoster(updated);
      showToast('info', `Đã dọn sạch danh sách học sinh lớp ${classId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-heritage-ink-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-heritage-ivory-100 border border-heritage-gold-300 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-heritage-ink-900">
        
        {/* Toast Feedback */}
        {toastMsg && (
          <div
            className={`absolute top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs sm:text-sm font-bold animate-slideIn ${
              toastMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : toastMsg.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-300'
                : 'bg-blue-50 text-blue-800 border-blue-300'
            }`}
          >
            {toastMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {toastMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            {toastMsg.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Modal Header */}
        <header className="bg-gradient-to-r from-heritage-red-900 via-heritage-red-800 to-heritage-red-900 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-heritage-gold-400/40 flex-shrink-0 shadow-md">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-heritage-gold-400/20 border border-heritage-gold-300 flex items-center justify-center text-heritage-gold-300 flex-shrink-0">
              <Trophy className="w-5 h-5 fill-heritage-gold-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                Quản Trị Từng Hội Thi, Lưu Trữ Kết Quả & Ngân Hàng Đề Thi
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

        {/* Navigation Tabs Bar & Supabase Cloud Controls */}
        <div className="bg-heritage-ivory-200 border-b border-heritage-gold-300/80 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 flex-shrink-0 py-2">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('contest')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'contest'
                  ? 'bg-heritage-red-700 text-white shadow-sm'
                  : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Quản Lý Từng Hội Thi ({contestsList.length})</span>
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
              <span>Bảng Điểm & Lưu Trữ Kết Quả ({filteredSubmissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'bg-heritage-red-700 text-white shadow-sm'
                  : 'text-heritage-ink-700 hover:text-heritage-red-700 hover:bg-white/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
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
              <span>Danh Mục Lớp Học ({classesList.length} Lớp)</span>
            </button>
          </div>

          {/* Supabase Cloud Live Sync Buttons */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Cloud Live</span>
            </div>

            <button
              onClick={handleSyncToCloud}
              disabled={isSyncingCloud}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
              title="Đẩy toàn bộ hội thi và bài thi học sinh lên Supabase Cloud Database"
            >
              {isSyncingCloud ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5" />
              )}
              <span>Đồng Bộ Cloud</span>
            </button>

            <button
              onClick={handlePullFromCloud}
              disabled={isSyncingCloud}
              className="p-1.5 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-700 border border-heritage-gold-300 rounded-xl transition shadow-xs"
              title="Tải lại dữ liệu mới nhất từ Supabase Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Cloud Sync Notification Banner */}
        {cloudSyncStatus && (
          <div className="bg-emerald-500 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4" />
              <span>{cloudSyncStatus}</span>
            </div>
            <button onClick={() => setCloudSyncStatus(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 select-text">

          {/* ─────────────────────────────────────────────────────────────
              TAB: QUẢN LÝ TỪNG HỘI THI (MULTI-CONTEST MANAGEMENT)
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'contest' && (
            <div className="space-y-5">
              {/* Thống kê đợt thi & Đang mở song song */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-3.5 flex items-center space-x-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {contestsList.filter((c) => c.status === 'active').length}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Đang Mở Thi Song Song</span>
                    <span className="text-[11px] text-emerald-700 font-medium">Học sinh tự do chọn thi</span>
                  </div>
                </div>

                <div className="bg-purple-50/90 border border-purple-300/80 rounded-2xl p-3.5 flex items-center space-x-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {contestsList.filter((c) => c.status === 'archived').length}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-950 block">Đã Lưu Trữ Kỷ Yếu</span>
                    <span className="text-[11px] text-purple-700 font-medium">Lưu trữ biên bản hồ sơ</span>
                  </div>
                </div>

                <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3.5 flex items-center space-x-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {submissions.length}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Tổng Bài Nộp Hệ Thống</span>
                    <span className="text-[11px] text-amber-700 font-medium">24 lớp THCS Nguyễn Trung Trực</span>
                  </div>
                </div>
              </div>

              {/* Thông báo trạng thái Song song */}
              {contestsList.filter((c) => c.status === 'active').length > 1 && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/10 border-2 border-heritage-gold-400/80 rounded-2xl flex items-center space-x-3 text-xs text-heritage-red-950 shadow-xs">
                  <Sparkles className="w-5 h-5 text-heritage-gold-600 flex-shrink-0" />
                  <span className="leading-relaxed">
                    <strong>Chế độ Hội thi song song đang kích hoạt:</strong> Có <strong>{contestsList.filter((c) => c.status === 'active').length} hội thi</strong> đang cùng mở nhận bài. Học sinh trên trang chủ sẽ thấy thanh chọn hội thi để lựa chọn dự thi theo đúng khối lớp của mình.
                  </span>
                </div>
              )}

              {/* Top Banner & Add Contest Button */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900 flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-heritage-gold-600" />
                    <span>Danh Sách & Hồ Sơ Các Đợt Hội Thi Trực Tuyến</span>
                  </h3>
                  <p className="text-xs text-heritage-ink-600 mt-0.5">
                    Quản lý từng đợt thi đua học đường, mở cổng thi song song và đóng gói lưu trữ kết quả kỷ yếu.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddContest}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Hội Thi Mới</span>
                </button>
              </div>

              {/* Contests Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {contestsList.map((c) => {
                  const isActive = c.id === activeContestId;
                  const contestSubmissionsCount = submissions.filter((s) => s.contestId === c.id).length;

                  return (
                    <div
                      key={c.id}
                      className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                        isActive
                          ? 'border-heritage-gold-500 ring-2 ring-heritage-gold-400/50 shadow-md'
                          : c.status === 'archived'
                          ? 'border-purple-200 bg-purple-50/20'
                          : 'border-heritage-ivory-300 hover:border-heritage-gold-300'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Status Badge & Banner tag */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            {c.status === 'active' && (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                <span>ĐANG MỞ THI (SONG SONG)</span>
                              </span>
                            )}
                            {c.status === 'closed' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>TẠM ĐÓNG CỔNG</span>
                              </span>
                            )}
                            {c.status === 'archived' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                <FolderArchive className="w-3.5 h-3.5 text-purple-600" />
                                <span>ĐÃ LƯU TRỮ KỶ YẾU</span>
                              </span>
                            )}
                            {c.status === 'draft' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>KẾ HOẠCH DỰ THẢO</span>
                              </span>
                            )}

                            {c.targetAudience && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                🎯 {c.targetAudience}
                              </span>
                            )}

                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-red-100 text-heritage-red-800 border border-heritage-red-300">
                                ★ Tiêu Điểm Trang Chủ
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] text-heritage-ink-500 font-semibold">
                            {c.academicYear}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-heritage-ink-900 leading-snug">
                            {c.title}
                          </h4>
                          <p className="text-xs text-heritage-ink-600 mt-1 line-clamp-2">
                            {c.subtitle}
                          </p>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-2 bg-heritage-ivory-100/80 p-2.5 rounded-xl border border-heritage-ivory-300 text-xs text-heritage-ink-700">
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-heritage-red-700" />
                            <span>{c.durationMinutes} Phút</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-heritage-gold-600" />
                            <span>{c.totalQuestions} Câu hỏi</span>
                          </div>
                          <div className="flex items-center space-x-1.5 font-bold text-heritage-red-800">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{contestSubmissionsCount} Bài nộp</span>
                          </div>
                        </div>

                        {/* Archived Summary Note (If present) */}
                        {c.status === 'archived' && c.summaryNote && (
                          <div className="p-3 bg-purple-100/50 border border-purple-200 rounded-xl text-xs text-purple-900">
                            <span className="font-bold flex items-center space-x-1 mb-0.5">
                              <Archive className="w-3 h-3 text-purple-700" />
                              <span>Biên bản lưu trữ {c.archivedAt ? `(${c.archivedAt})` : ''}:</span>
                            </span>
                            <p className="italic text-[11px] leading-relaxed">{c.summaryNote}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="mt-4 pt-3 border-t border-heritage-ivory-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {c.status === 'active' ? (
                            <button
                              onClick={() => handleToggleContestActive(c.id, false)}
                              className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                              title="Tạm đóng cổng nhận bài của hội thi này"
                            >
                              <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
                              <span>Tạm đóng</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleContestActive(c.id, true)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                              title="Mở cổng thi (hỗ trợ chạy song song cùng hội thi khác)"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Mở thi (Song song)</span>
                            </button>
                          )}

                          {!isActive && (
                            <button
                              onClick={() => handleSwitchActiveContest(c.id)}
                              className="px-2.5 py-1.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-800 rounded-lg text-xs font-bold transition flex items-center space-x-1 border border-heritage-ivory-300"
                              title="Đặt làm hội thi tiêu điểm mặc định trên trang chủ"
                            >
                              <span>★ Tiêu điểm</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedContestFilter(c.id);
                              setActiveTab('students');
                            }}
                            className="px-2.5 py-1.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-800 rounded-lg text-xs font-bold transition flex items-center space-x-1 border border-heritage-ivory-300"
                            title="Xem bảng điểm của riêng hội thi này"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-heritage-red-700" />
                            <span>Xem điểm ({contestSubmissionsCount})</span>
                          </button>

                          {c.status !== 'archived' ? (
                            <button
                              onClick={() => handleOpenArchiveModal(c)}
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                              title="Đóng cổng thi và lưu trữ kết quả kỷ yếu"
                            >
                              <FolderArchive className="w-3.5 h-3.5 text-purple-700" />
                              <span>Lưu trữ</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenArchiveModal(c)}
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium transition flex items-center space-x-1"
                              title="Cập nhật biên bản lưu trữ kỷ yếu"
                            >
                              <Edit2 className="w-3 h-3 text-purple-600" />
                              <span>Sửa biên bản</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditContest(c)}
                            className="p-1.5 rounded-lg text-heritage-ink-600 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 transition"
                            title="Chỉnh sửa cấu hình hội thi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteContestClick(c)}
                            className="p-1.5 rounded-lg text-heritage-ink-400 hover:text-red-700 hover:bg-red-50 transition"
                            title="Xóa hội thi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB: BÀI THI & BẢNG ĐIỂM (LƯU TRỮ KẾT QUẢ THEO TỪNG HỘI THI)
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Contest Selector & KPI Summary */}
              <div className="bg-white p-4 rounded-2xl border border-heritage-gold-300/80 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-heritage-ivory-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-heritage-red-700 flex-shrink-0" />
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-heritage-ink-500 block">
                        Chọn Hội Thi Cần Xem Bảng Điểm & Kết Quả
                      </label>
                      <select
                        value={selectedContestFilter}
                        onChange={(e) => setSelectedContestFilter(e.target.value)}
                        className="font-serif font-bold text-xs sm:text-sm text-heritage-red-950 bg-heritage-ivory-100 border border-heritage-gold-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-heritage-red-700"
                      >
                        <option value="all">Tất cả bài thi các đợt ({submissions.length} bài)</option>
                        {contestsList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.status === 'active' ? '⭐ [Đang mở]' : c.status === 'archived' ? '📦 [Đã lưu trữ]' : '📝 [Dự thảo]'} {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentContestObj && currentContestObj.status !== 'archived' && (
                      <button
                        onClick={() => handleOpenArchiveModal(currentContestObj)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        title="Đóng gói và lưu trữ kết quả hội thi này vào kỷ yếu"
                      >
                        <FolderArchive className="w-3.5 h-3.5" />
                        <span>Lưu trữ Hội thi này</span>
                      </button>
                    )}

                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      title="Xuất bảng điểm ra file Excel (CSV)"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Xuất Excel (CSV)</span>
                    </button>

                    <button
                      onClick={handleResetAllSubmissions}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded-xl text-xs font-semibold transition"
                      title="Đặt lại bảng điểm về mặc định"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Đặt lại</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-heritage-ivory-100 p-3 rounded-xl border border-heritage-ivory-300">
                    <span className="text-[10px] text-heritage-ink-500 uppercase font-bold block">Tổng thí sinh</span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-heritage-red-900">{contestStats.total} lượt</span>
                  </div>
                  <div className="bg-heritage-ivory-100 p-3 rounded-xl border border-heritage-ivory-300">
                    <span className="text-[10px] text-heritage-ink-500 uppercase font-bold block">Điểm trung bình</span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-heritage-gold-700">{contestStats.avgScore} / 10</span>
                  </div>
                  <div className="bg-heritage-ivory-100 p-3 rounded-xl border border-heritage-ivory-300">
                    <span className="text-[10px] text-heritage-ink-500 uppercase font-bold block">Điểm 10 Tuyệt Đối</span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-emerald-700">{contestStats.perfectCount} học sinh</span>
                  </div>
                  <div className="bg-heritage-ivory-100 p-3 rounded-xl border border-heritage-ivory-300">
                    <span className="text-[10px] text-heritage-ink-500 uppercase font-bold block">Lớp dẫn đầu phong trào</span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-heritage-red-800">Chi đội {contestStats.topClass}</span>
                  </div>
                </div>

                {/* Archive summary banner (if viewing archived contest) */}
                {currentContestObj && currentContestObj.status === 'archived' && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start space-x-2">
                    <Archive className="w-4 h-4 text-purple-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Hồ sơ kết quả đã lưu trữ vào Kỷ yếu {currentContestObj.archivedAt ? `ngày ${currentContestObj.archivedAt}` : ''}:</span>
                      <p className="mt-0.5 text-purple-800 italic">{currentContestObj.summaryNote || 'Đã tổng kết và hoàn tất đợt thi đua.'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-heritage-gold-300/80 shadow-xs">
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
                    <option value="all">Tất cả lớp ({filteredSubmissions.length} bài)</option>
                    {classesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.id}
                      </option>
                    ))}
                  </select>
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
                        <th className="py-3 px-3 sm:px-4">Danh Hiệu / Khen Thưởng</th>
                        <th className="py-3 px-3 sm:px-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-heritage-ivory-200">
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-heritage-ink-500">
                            Chưa có dữ liệu bài thi nào phù hợp với bộ lọc hội thi này!
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
                            <td className="py-3 px-3 sm:px-4 text-xs font-semibold">
                              {sub.award ? (
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                  sub.award.includes('Nhất')
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : sub.award.includes('Nhì')
                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                    : sub.award.includes('Ba')
                                    ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}>
                                  {sub.award}
                                </span>
                              ) : sub.score === 10 ? (
                                <span className="text-amber-700 font-bold">★ Xuất sắc 10/10</span>
                              ) : sub.score >= 8 ? (
                                <span className="text-emerald-700 font-semibold">Đạt loại Giỏi</span>
                              ) : (
                                <span className="text-heritage-ink-500">Đạt yêu cầu</span>
                              )}
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
              TAB: NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Băng thông báo hướng dẫn linh hoạt số câu hỏi */}
              <div className="bg-gradient-to-r from-amber-50 via-heritage-ivory-100 to-amber-50 border-2 border-heritage-gold-400/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-heritage-red-700 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm border border-heritage-gold-400">
                    <Sparkles className="w-5 h-5 text-heritage-gold-300" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-red-950">
                      Ngân Hàng Đề Thi Mở Linh Hoạt ({questions.length} Câu Hỏi Hiện Có)
                    </h4>
                    <p className="text-[11px] text-heritage-ink-700 mt-0.5 leading-relaxed">
                      Thầy/Cô có thể <strong>thêm mới, chỉnh sửa hoặc xóa bớt câu hỏi tự do</strong> không giới hạn. Mỗi hội thi có thể cấu hình số lượng câu hỏi thi riêng biệt (5, 10, 15, 20 câu hoặc toàn bộ).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('contest')}
                  className="px-3.5 py-2 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-red-950 font-black rounded-xl text-xs whitespace-nowrap shadow-xs transition flex items-center space-x-1.5 border border-heritage-gold-500 flex-shrink-0"
                >
                  <Settings className="w-3.5 h-3.5 text-heritage-red-900" />
                  <span>Cấu hình số câu thi</span>
                </button>
              </div>
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
                    <option value="all">Tất cả chủ đề ({questions.length} câu)</option>
                    <option value="cuoc-doi">Cuộc đời & Sự nghiệp</option>
                    <option value="tu-tuong">Tư tưởng Hồ Chí Minh</option>
                    <option value="5-dieu-bac-day">5 Điều Bác Hồ dạy</option>
                    <option value="thoi-an-truyen-thong">Truyền thống Thới An & NTT</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddQuestion}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm câu hỏi mới</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-heritage-gold-300/80 text-center text-heritage-ink-500 text-sm">
                    Không tìm thấy câu hỏi trắc nghiệm nào phù hợp!
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/80 shadow-xs space-y-3 hover:border-heritage-gold-400 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-heritage-red-100 text-heritage-red-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 bg-heritage-ivory-200 text-heritage-red-800">
                              {q.category === 'cuoc-doi'
                                ? 'Cuộc đời & Sự nghiệp'
                                : q.category === 'tu-tuong'
                                ? 'Tư tưởng Hồ Chí Minh'
                                : q.category === '5-dieu-bac-day'
                                ? '5 Điều Bác Hồ dạy'
                                : 'Truyền thống Thới An & Trường NTT'}
                            </span>
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-ink-900 leading-snug">
                              {q.question}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="p-1.5 rounded-lg text-heritage-ink-600 hover:text-heritage-red-700 hover:bg-heritage-ivory-200 transition"
                            title="Sửa câu hỏi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 rounded-lg text-heritage-ink-400 hover:text-red-700 hover:bg-red-50 transition"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 4 Choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = q.correctIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2 ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                  : 'bg-heritage-ivory-50 border-heritage-ivory-200 text-heritage-ink-800'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-heritage-ivory-200 text-heritage-ink-700'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
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
              TAB: QUẢN LÝ DANH MỤC LỚP HỌC & HỌC SINH TOÀN TRƯỜNG
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              {/* Top Banner & Control Actions */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-heritage-red-700 text-white flex items-center justify-center font-bold shadow-sm border border-heritage-gold-400 flex-shrink-0">
                    <Users className="w-5 h-5 text-heritage-gold-300" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-heritage-ink-900 flex items-center space-x-2">
                      <span>Quản Lý Danh Mục Lớp Học & Học Sinh</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-heritage-red-100 text-heritage-red-800 border border-heritage-red-200">
                        {classesList.length} Lớp THCS
                      </span>
                    </h3>
                    <p className="text-[11px] text-heritage-ink-600 mt-0.5 leading-relaxed">
                      Thầy/Cô có thể <strong>thêm lớp học mới</strong>, quản lý theo từng khối 6 - 9, và <strong>dán nhanh cả danh sách lớp từ file Excel hoặc Word</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={handleOpenAddClassModal}
                    className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
                    title="Thêm một lớp học mới vào danh mục nhà trường"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Lớp Mới</span>
                  </button>

                  <button
                    onClick={() => setIsBulkImportOpen(!isBulkImportOpen)}
                    className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-red-950 font-black rounded-xl text-xs shadow-xs transition border border-heritage-gold-500"
                    title="Mở khung dán danh sách học sinh từ file Excel hoặc Word"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-heritage-red-900" />
                    <span>Dán Danh Sách Từ Excel</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Khôi phục danh mục lớp và danh sách học sinh về mặc định của nhà trường?')) {
                        const resClasses = resetClasses();
                        setClassesList(resClasses);
                        const resRoster = resetStudentsRoster();
                        setRoster(resRoster);
                        showToast('success', 'Đã đặt lại danh mục lớp và học sinh về mặc định!');
                      }
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded-xl text-xs font-semibold transition"
                    title="Khôi phục danh sách lớp gốc của nhà trường"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục mẫu</span>
                  </button>
                </div>
              </div>

              {/* Bộ lọc Khối Lớp (Tất cả / Khối 6 / Khối 7 / Khối 8 / Khối 9) */}
              <div className="bg-white p-3.5 rounded-2xl border border-heritage-gold-300/80 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-heritage-ivory-200 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-700">
                      Lọc theo khối lớp:
                    </span>
                    {(['all', '6', '7', '8', '9'] as const).map((grade) => {
                      const count = grade === 'all'
                        ? classesList.length
                        : classesList.filter((c) => c.grade === grade).length;
                      const isSelected = selectedGradeFilter === grade;
                      return (
                        <button
                          key={grade}
                          onClick={() => setSelectedGradeFilter(grade)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            isSelected
                              ? 'bg-heritage-red-700 text-white shadow-xs'
                              : 'bg-heritage-ivory-100 text-heritage-ink-700 hover:bg-heritage-ivory-200 border border-heritage-ivory-300'
                          }`}
                        >
                          {grade === 'all' ? `Tất cả (${count})` : `Khối ${grade} (${count})`}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[11px] text-heritage-ink-500 italic">
                    Bấm vào lớp để xem hoặc nhập danh sách học sinh
                  </span>
                </div>

                {/* Danh sách các Thẻ Lớp Học (Class Pills) */}
                <div className="flex flex-wrap gap-2">
                  {filteredClasses.map((c) => {
                    const isSelected = selectedRosterClass === c.id;
                    const count = (roster[c.id] || []).length;
                    return (
                      <div
                        key={c.id}
                        className={`inline-flex items-center rounded-xl transition border text-xs font-bold shadow-xs ${
                          isSelected
                            ? 'bg-heritage-red-700 text-white border-heritage-gold-400 ring-2 ring-heritage-gold-400/40'
                            : 'bg-heritage-ivory-100 hover:bg-heritage-ivory-200 text-heritage-ink-800 border-heritage-ivory-300'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setSelectedRosterClass(c.id);
                            setRosterError(null);
                          }}
                          className="px-3 py-2 flex items-center space-x-1.5 text-left"
                          title={c.name}
                        >
                          <span>Lớp {c.id}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-heritage-ivory-200 text-heritage-ink-600'
                            }`}
                          >
                            {count} em
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(c.id, c.name);
                          }}
                          className={`pr-2 pl-1 py-2 text-inherit opacity-40 hover:opacity-100 transition ${
                            isSelected ? 'hover:text-amber-300' : 'hover:text-red-700'
                          }`}
                          title={`Xóa lớp ${c.id} khỏi danh mục`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Nút Thêm Lớp Nhanh ngay trong lưới */}
                  <button
                    onClick={handleOpenAddClassModal}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 bg-dashed border-2 border-dashed border-heritage-gold-400 text-heritage-red-900 hover:bg-amber-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm Lớp Mới</span>
                  </button>
                </div>
              </div>

              {/* KHU VỰC DÁN NHANH DANH SÁCH TỪ EXCEL / WORD (BULK IMPORT DRAWER) */}
              {isBulkImportOpen && (
                <div className="bg-gradient-to-r from-amber-50 via-heritage-ivory-100 to-amber-50 p-4 sm:p-5 rounded-2xl border-2 border-heritage-gold-400 shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-start justify-between gap-2 border-b border-heritage-gold-300/80 pb-2.5">
                    <div>
                      <h4 className="font-serif font-black text-sm sm:text-base text-heritage-red-950 flex items-center space-x-2">
                        <FileSpreadsheet className="w-5 h-5 text-heritage-red-700" />
                        <span>Dán Nhanh Danh Sách Học Sinh Cho Lớp {selectedRosterClass}</span>
                      </h4>
                      <p className="text-xs text-heritage-ink-700 mt-0.5 leading-relaxed">
                        Thầy/Cô chỉ cần <strong>copy cột Họ và Tên</strong> từ bảng tính Excel hoặc văn bản Word rồi dán vào khung dưới đây. Hệ thống sẽ tự động tách dòng, bỏ số thứ tự đầu dòng (1, 2, 3...) và định dạng chuẩn tên tiếng Việt.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsBulkImportOpen(false)}
                      className="p-1 text-heritage-ink-400 hover:text-heritage-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={6}
                      value={bulkImportText}
                      onChange={(e) => setBulkImportText(e.target.value)}
                      placeholder={`Ví dụ: Dán danh sách học sinh vào đây, mỗi em 1 dòng:\n1. Nguyễn Minh Khang\n2. Trần Bảo Ngọc\n03 - Lê Hoàng Nam\nPhạm Thùy Linh\nĐặng Gia Huy...`}
                      className="w-full p-3 bg-white border border-heritage-gold-400 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-red-700 shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="font-bold text-heritage-red-950 flex items-center space-x-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Đã nhận diện: <strong className="text-emerald-700 text-sm font-black">{parsedBulkNames.length}</strong> học sinh hợp lệ</span>
                      </span>

                      <label className="flex items-center space-x-1.5 cursor-pointer text-heritage-ink-800 font-medium">
                        <input
                          type="checkbox"
                          checked={bulkImportReplace}
                          onChange={(e) => setBulkImportReplace(e.target.checked)}
                          className="w-4 h-4 text-heritage-red-700 rounded focus:ring-heritage-red-500"
                        />
                        <span>Thay thế toàn bộ danh sách lớp này</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsBulkImportOpen(false)}
                        className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 rounded-xl text-xs font-semibold transition"
                      >
                        Đóng
                      </button>

                      <button
                        type="button"
                        disabled={parsedBulkNames.length === 0}
                        onClick={handleSaveBulkStudents}
                        className={`px-5 py-2 font-bold rounded-xl text-xs sm:text-sm transition flex items-center space-x-1.5 shadow-sm ${
                          parsedBulkNames.length > 0
                            ? 'bg-heritage-red-700 hover:bg-heritage-red-800 text-white'
                            : 'bg-heritage-ivory-300 text-heritage-ink-400 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>Lưu {parsedBulkNames.length} Học Sinh Vào Lớp {selectedRosterClass}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chi Tiết Lớp Đang Chọn & Danh Sách Học Sinh */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold-300/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-heritage-ivory-200 pb-3">
                  <div>
                    <h4 className="font-serif font-black text-sm sm:text-base text-heritage-red-950 flex items-center space-x-2">
                      <span>Danh Sách Học Sinh: {currentClassObj?.name || `Lớp ${selectedRosterClass}`}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-heritage-red-100 text-heritage-red-800">
                        {currentClassStudents.length} học sinh
                      </span>
                    </h4>
                    <p className="text-[11px] text-heritage-ink-600 mt-0.5">
                      Khối {currentClassObj?.grade || '8'} • Mã lớp: <strong>{selectedRosterClass}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsBulkImportOpen(true)}
                      className="px-3 py-1.5 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-red-950 font-bold rounded-xl text-xs transition flex items-center space-x-1 border border-heritage-gold-500 shadow-2xs"
                      title="Mở khung dán danh sách nhiều em từ Excel"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-heritage-red-900" />
                      <span>Dán từ Excel</span>
                    </button>

                    {currentClassStudents.length > 0 && (
                      <button
                        onClick={() => handleClearClassRoster(selectedRosterClass)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        title="Xóa toàn bộ danh sách lớp này để nhập lại danh sách mới"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa hết</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Thêm 1 Học Sinh Thủ Công */}
                <form
                  onSubmit={handleAddStudentToRoster}
                  className="p-3 bg-heritage-ivory-50 rounded-xl border border-heritage-ivory-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Thêm 1 em học sinh vào lớp ${selectedRosterClass} (Ví dụ: Nguyễn Minh Khang)...`}
                      value={newStudentNameInput}
                      onChange={(e) => setNewStudentNameInput(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-heritage-ivory-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-heritage-red-700 font-medium"
                    />
                    {rosterError && (
                      <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                        ⚠ {rosterError}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm 1 em</span>
                  </button>
                </form>

                {/* Lưới Thẻ Học Sinh Của Lớp */}
                {currentClassStudents.length === 0 ? (
                  <div className="p-8 text-center bg-heritage-ivory-50 rounded-2xl border-2 border-dashed border-heritage-gold-300 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-700" />
                    </div>
                    <h5 className="font-serif font-bold text-sm text-heritage-red-950">
                      Lớp {selectedRosterClass} hiện chưa có danh sách học sinh
                    </h5>
                    <p className="text-xs text-heritage-ink-600 max-w-md mx-auto">
                      Thầy/Cô hãy bấm <strong>"Dán Danh Sách Từ Excel"</strong> ở trên để nạp cả lớp trong 1 giây, hoặc nhập từng em vào ô phía trên.
                    </p>
                    <button
                      onClick={() => setIsBulkImportOpen(true)}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-red-950 font-black rounded-xl text-xs transition shadow-xs mt-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Dán danh sách cả lớp ngay</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {currentClassStudents.map((name, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-heritage-ivory-50 border border-heritage-ivory-200 flex items-center justify-between group hover:border-heritage-gold-400 hover:bg-white transition shadow-2xs"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-heritage-red-100 text-heritage-red-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-heritage-ink-900 truncate">
                            {name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveStudentFromRoster(name)}
                          className="opacity-30 group-hover:opacity-100 p-1 text-heritage-ink-400 hover:text-red-700 transition flex-shrink-0"
                          title={`Xóa học sinh ${name} khỏi lớp`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MODAL CON: TẠO / SỬA HỘI THI (CONTEST FORM MODAL)
          ───────────────────────────────────────────────────────────────── */}
      {isContestFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-heritage-gold-400 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-heritage-ivory-200 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-heritage-gold-600" />
                <span>{editingContest ? 'Chỉnh Sửa Thông Tin Hội Thi' : 'Tạo Đợt Hội Thi Trực Tuyến Mới'}</span>
              </h3>
              <button
                onClick={() => setIsContestFormOpen(false)}
                className="p-1 text-heritage-ink-400 hover:text-heritage-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContestForm} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Tên Hội Thi Chính Thức <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={contestFormData.title}
                  onChange={(e) => setContestFormData({ ...contestFormData, title: e.target.value })}
                  placeholder="Ví dụ: Hội Thi Trực Tuyến: Tuổi Trẻ Học Tập Lời Bác..."
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-bold text-heritage-ink-900 focus:outline-none focus:border-heritage-red-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Khẩu Hiệu / Mục Đích Thi Đua
                </label>
                <input
                  type="text"
                  value={contestFormData.subtitle}
                  onChange={(e) => setContestFormData({ ...contestFormData, subtitle: e.target.value })}
                  placeholder="Ví dụ: Đợt thi đua rèn đức luyện tài chào mừng Ngày thành lập Đoàn..."
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Niên Khóa Tổ Chức
                  </label>
                  <input
                    type="text"
                    value={contestFormData.academicYear}
                    onChange={(e) => setContestFormData({ ...contestFormData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Thời Lượng Thi (Phút)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={contestFormData.durationMinutes}
                    onChange={(e) => setContestFormData({ ...contestFormData, durationMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-bold focus:outline-none focus:border-heritage-red-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Trạng Thái Hội Thi
                  </label>
                  <select
                    value={contestFormData.status}
                    onChange={(e) => setContestFormData({ ...contestFormData, status: e.target.value as ContestStatus })}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-bold focus:outline-none focus:border-heritage-red-700"
                  >
                    <option value="active">🟢 Đang diễn ra (Mở cổng)</option>
                    <option value="closed">🔒 Tạm đóng cổng</option>
                    <option value="draft">📝 Dự thảo kế hoạch</option>
                    <option value="archived">📦 Đã tổng kết & Lưu trữ</option>
                  </select>
                </div>
              </div>

              {/* CẤU HÌNH SỐ LƯỢNG CÂU HỎI THI (TỰ DO ĐIỀU CHỈNH THEO NHU CẦU GIÁO VIÊN) */}
              <div className="bg-gradient-to-r from-amber-50 to-heritage-ivory-100 border border-amber-300/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-heritage-red-950 uppercase tracking-wider">
                    Số Lượng Câu Hỏi Trong Mỗi Đề Thi *
                  </label>
                  <span className="text-[11px] text-heritage-ink-600 font-medium">
                    (Ngân hàng hiện có: <strong className="text-heritage-red-700 font-bold">{questions.length} câu hỏi</strong>)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="w-full sm:w-36">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={contestFormData.totalQuestions || 10}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setContestFormData({ ...contestFormData, totalQuestions: Math.max(1, val) });
                      }}
                      className="w-full px-3.5 py-2 bg-white border-2 border-heritage-gold-400 rounded-xl font-black text-base text-heritage-red-900 focus:outline-none focus:ring-2 focus:ring-heritage-red-700 shadow-inner text-center"
                      required
                    />
                  </div>

                  {/* Nút chọn nhanh số câu hỏi */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    <span className="text-[11px] text-heritage-ink-500 font-semibold mr-1 hidden sm:inline">Chọn nhanh:</span>
                    {[5, 10, 15, 20, 25, 30].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, totalQuestions: num })}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                          contestFormData.totalQuestions === num
                            ? 'bg-heritage-red-700 text-white border-heritage-red-700 shadow-xs'
                            : 'bg-white text-heritage-ink-800 border-heritage-ivory-300 hover:bg-heritage-ivory-200'
                        }`}
                      >
                        {num} câu
                      </button>
                    ))}
                    {questions.length > 0 && ![5, 10, 15, 20, 25, 30].includes(questions.length) && (
                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, totalQuestions: questions.length })}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                          contestFormData.totalQuestions === questions.length
                            ? 'bg-heritage-red-700 text-white border-heritage-red-700 shadow-xs'
                            : 'bg-white text-heritage-ink-800 border-heritage-ivory-300 hover:bg-heritage-ivory-200'
                        }`}
                      >
                        Toàn bộ ({questions.length} câu)
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-heritage-ink-600 italic">
                  💡 <strong>Gợi ý sư phạm:</strong> Nếu ngân hàng có nhiều hơn số câu cài đặt (ví dụ ngân hàng có {questions.length} câu nhưng cài 10 câu), hệ thống sẽ tự động xáo trộn và rút ngẫu nhiên đúng số câu này cho mỗi thí sinh để đề thi phong phú và chống nhìn bài nhau.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Ngày Bắt Đầu
                  </label>
                  <input
                    type="date"
                    value={contestFormData.startDate}
                    onChange={(e) => setContestFormData({ ...contestFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Ngày Kết Thúc Dự Kiến
                  </label>
                  <input
                    type="date"
                    value={contestFormData.endDate}
                    onChange={(e) => setContestFormData({ ...contestFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Đơn Vị Tổ Chức & Chỉ Đạo
                </label>
                <input
                  type="text"
                  value={contestFormData.organizer}
                  onChange={(e) => setContestFormData({ ...contestFormData, organizer: e.target.value })}
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Khối Lớp / Đối Tượng Dự Thi (Hiển thị nổi bật trên thẻ hội thi song song)
                </label>
                <input
                  type="text"
                  value={contestFormData.targetAudience || ''}
                  onChange={(e) => setContestFormData({ ...contestFormData, targetAudience: e.target.value })}
                  placeholder="Ví dụ: Dành cho Khối 6 & Khối 7, hoặc Dành cho Khối 8, Khối 9 & Toàn trường"
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Thẻ Biểu Trưng / Huy Hiệu Tiêu Đề
                </label>
                <input
                  type="text"
                  value={contestFormData.bannerTag}
                  onChange={(e) => setContestFormData({ ...contestFormData, bannerTag: e.target.value })}
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsContestFormOpen(false)}
                  className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 font-semibold rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold rounded-xl shadow-sm transition"
                >
                  {editingContest ? 'Lưu cập nhật hội thi' : 'Khởi tạo hội thi mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MODAL CON: ĐÓNG GÓI & LƯU TRỮ HỒ SƠ HỘI THI (ARCHIVE MODAL)
          ───────────────────────────────────────────────────────────────── */}
      {isArchiveModalOpen && archivingContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-purple-400 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-purple-900 flex items-center space-x-2">
                <FolderArchive className="w-5 h-5 text-purple-700" />
                <span>Đóng Gói & Lưu Trữ Hồ Sơ Hội Thi</span>
              </h3>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-1 text-heritage-ink-400 hover:text-purple-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-heritage-ink-800">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="font-bold block text-purple-950 mb-0.5">{archivingContest.title}</span>
                <span className="text-[11px] text-purple-800 block">
                  Đã ghi nhận: {submissions.filter((s) => s.contestId === archivingContest.id).length} bài dự thi đã nộp.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Biên Bản Tổng Kết & Ghi Chú Khen Thưởng <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={archiveSummaryInput}
                  onChange={(e) => setArchiveSummaryInput(e.target.value)}
                  placeholder="Ví dụ: Đã tổng kết khen thưởng đợt 1. Trao 01 giải Nhất tập thể cho Chi đội 8A1, trao 03 giải Nhất cá nhân tại Lễ chào cờ..."
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-purple-700 text-xs sm:text-sm"
                  required
                />
                <span className="text-[11px] text-heritage-ink-500 mt-1 block italic">
                  Biên bản này sẽ được lưu cố định vào hồ sơ Kỷ yếu hội thi học đường để làm căn cứ báo cáo thi đua.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 font-semibold rounded-xl transition text-xs sm:text-sm"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmArchiveContest}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm transition text-xs sm:text-sm flex items-center space-x-1.5"
              >
                <FolderArchive className="w-4 h-4" />
                <span>Xác nhận đóng gói & Lưu trữ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MODAL CON: THÊM / SỬA CÂU HỎI TRẮC NGHIỆM
          ───────────────────────────────────────────────────────────────── */}
      {isQuestionFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-heritage-gold-400 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-heritage-ivory-200 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900">
                {editingQuestion ? `Chỉnh sửa Câu hỏi số ${editingQuestion.id}` : 'Thêm Câu hỏi Trắc nghiệm Mới'}
              </h3>
              <button
                onClick={() => setIsQuestionFormOpen(false)}
                className="p-1 text-heritage-ink-400 hover:text-heritage-red-700"
              >
                <X className="w-5 h-5" />
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

      {/* ─────────────────────────────────────────────────────────────────
          MODAL CON: THÊM LỚP HỌC MỚI VÀO DANH MỤC NHÀ TRƯỜNG
          ───────────────────────────────────────────────────────────────── */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border-2 border-heritage-gold-400 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-ivory-200 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-heritage-red-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-heritage-gold-600" />
                <span>Thêm Lớp Học Mới Vào Danh Mục</span>
              </h3>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1 text-heritage-ink-400 hover:text-heritage-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClass} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Mã Lớp Học <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={classFormData.id}
                    onChange={(e) => setClassFormData({ ...classFormData, id: e.target.value })}
                    placeholder="Ví dụ: 6A7, 8A7, 6/1..."
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-black text-heritage-red-950 focus:outline-none focus:border-heritage-red-700 uppercase"
                    required
                  />
                  <span className="text-[10px] text-heritage-ink-500 mt-0.5 block">
                    Mã hiển thị ngắn trên bài thi và bảng xếp hạng
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                    Khối Lớp <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={classFormData.grade}
                    onChange={(e) => setClassFormData({ ...classFormData, grade: e.target.value as '6' | '7' | '8' | '9' })}
                    className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-bold text-heritage-ink-900 focus:outline-none focus:border-heritage-red-700"
                  >
                    <option value="6">Khối 6 (Lớp 6)</option>
                    <option value="7">Khối 7 (Lớp 7)</option>
                    <option value="8">Khối 8 (Lớp 8)</option>
                    <option value="9">Khối 9 (Lớp 9)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider mb-1">
                  Tên Lớp / Tên Chi Đội Đầy Đủ
                </label>
                <input
                  type="text"
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                  placeholder="Ví dụ: Lớp 8A7 (Chi đội Trần Phú) hoặc Lớp 6A7..."
                  className="w-full px-3.5 py-2 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl font-semibold text-heritage-ink-900 focus:outline-none focus:border-heritage-red-700"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-heritage-ink-800 uppercase tracking-wider">
                    Dán Danh Sách Học Sinh Của Lớp Này (Tùy chọn)
                  </label>
                  <span className="text-[10px] text-heritage-ink-500">
                    Mỗi học sinh 1 dòng (Copy từ Excel)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={newClassInitialStudentsText}
                  onChange={(e) => setNewClassInitialStudentsText(e.target.value)}
                  placeholder="Dán cột họ tên học sinh từ file Excel hoặc Word vào đây (nếu có)..."
                  className="w-full p-2.5 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs focus:outline-none focus:border-heritage-red-700 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-heritage-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-700 font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Lưu Lớp Học Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
