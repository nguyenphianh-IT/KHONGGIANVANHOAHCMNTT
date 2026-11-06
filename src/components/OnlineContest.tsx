import React, { useState, useEffect, useMemo } from 'react';
import {
  SCHOOL_CLASSES,
  getStoredStudentsByClass,
  validateStudentName,
  EVENT_STUDENTS_ROSTER_CHANGED,
} from '../data/studentsData';
import {
  ContestInfo,
  ContestQuestion,
  ContestSubmission,
  getStoredContestsList,
  getStoredContestInfo,
  getStoredContestQuestions,
  getContestSubmissions,
  saveContestSubmission,
  formatTime,
  EVENT_CONTEST_DATA_CHANGED,
  fetchSupabaseContestData,
  fetchSupabaseQuestions,
} from '../data/contestData';
import {
  Trophy, Award, Clock, CheckCircle2, AlertTriangle, ChevronRight,
  User, Printer, Settings, BookOpen, Layers, FolderArchive, Cloud, Lock
} from 'lucide-react';
import { ContestManagerModal } from './cms/ContestManagerModal';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './cms/AuthModal';

export const OnlineContest: React.FC = () => {
  // Xác thực Cán bộ Quản trị & Ban Giám Khảo (RBAC bảo vệ ngân hàng đề & bảng điểm)
  const { user, profile, hasRole } = useAuth();
  const isStaff = Boolean(user && (hasRole('editor') || hasRole('admin') || hasRole('super_admin')));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Trạng thái màn hình: 'intro' | 'register' | 'exam' | 'result' | 'leaderboard'
  const [screen, setScreen] = useState<'intro' | 'register' | 'exam' | 'result' | 'leaderboard'>('intro');

  // Trạng thái modal Quản trị Ban Giám Khảo & Giáo Viên
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [managerInitialTab, setManagerInitialTab] = useState<'questions' | 'contest' | 'students' | 'roster'>('questions');

  // Dữ liệu quản trị động (đồng bộ qua LocalStorage và sự kiện hệ thống)
  const [contestsList, setContestsList] = useState<ContestInfo[]>(getStoredContestsList);
  const [contestInfo, setContestInfo] = useState<ContestInfo>(getStoredContestInfo);
  const [questions, setQuestions] = useState<ContestQuestion[]>(getStoredContestQuestions);
  const [roster, setRoster] = useState<Record<string, string[]>>(getStoredStudentsByClass);
  const [submissions, setSubmissions] = useState<ContestSubmission[]>(getContestSubmissions);
  const [leaderboardContestId, setLeaderboardContestId] = useState<string>(() => getStoredContestInfo().id);

  // Thông tin đăng ký dự thi
  const [selectedClass, setSelectedClass] = useState<string>('8A1');
  const [useManualName, setUseManualName] = useState<boolean>(false);
  const [selectedPresetName, setSelectedPresetName] = useState<string>('');
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Thí sinh đang thi
  const [currentCandidate, setCurrentCandidate] = useState<{ name: string; className: string } | null>(null);

  // Trạng thái bài thi
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(contestInfo.durationMinutes * 60);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Kết quả vừa thi
  const [latestSubmission, setLatestSubmission] = useState<ContestSubmission | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Bảng xếp hạng & Trạng thái Supabase Cloud
  const [leaderboardTab, setLeaderboardTab] = useState<'individual' | 'class'>('individual');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Kéo dữ liệu câu hỏi và hội thi từ Supabase Cloud khi người dùng truy cập
  useEffect(() => {
    let isMounted = true;
    const initCloud = async () => {
      try {
        const [cloudData, cloudQuestions] = await Promise.all([
          fetchSupabaseContestData(),
          fetchSupabaseQuestions(),
        ]);
        if (isMounted) {
          if (cloudData.success) {
            setIsCloudConnected(true);
            if (cloudData.contests) setContestsList(cloudData.contests);
            if (cloudData.submissions) setSubmissions(cloudData.submissions);
          }
          if (cloudQuestions && cloudQuestions.length > 0) {
            setQuestions(cloudQuestions);
          }
        }
      } catch (err) {
        console.warn('[OnlineContest Cloud Init Warning]', err);
      }
    };
    initCloud();
    return () => { isMounted = false; };
  }, []);

  // Lắng nghe sự kiện đồng bộ dữ liệu từ Modal Quản trị hoặc Tab khác
  useEffect(() => {
    const handleSync = () => {
      const active = getStoredContestInfo();
      setContestsList(getStoredContestsList());
      setContestInfo(active);
      setQuestions(getStoredContestQuestions());
      setSubmissions(getContestSubmissions());
      setRoster(getStoredStudentsByClass());
    };

    window.addEventListener(EVENT_CONTEST_DATA_CHANGED, handleSync);
    window.addEventListener(EVENT_STUDENTS_ROSTER_CHANGED, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(EVENT_CONTEST_DATA_CHANGED, handleSync);
      window.removeEventListener(EVENT_STUDENTS_ROSTER_CHANGED, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Đồng bộ ID hội thi trên bảng xếp hạng khi hội thi hiện hành thay đổi
  useEffect(() => {
    if (contestInfo?.id) {
      setLeaderboardContestId(contestInfo.id);
    }
  }, [contestInfo?.id]);

  // Đặt tên mặc định khi đổi lớp hoặc khi danh sách lớp cập nhật
  useEffect(() => {
    const list = roster[selectedClass] || [];
    if (list && list.length > 0) {
      setSelectedPresetName(list[0]);
    } else {
      setSelectedPresetName('');
    }
    setValidationError(null);
  }, [selectedClass, roster]);

  // Đồng hồ đếm ngược phòng thi
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (screen === 'exam' && !isExamCompleted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screen, isExamCompleted, timeLeftSeconds]);

  // Xác thực và bắt đầu thi (KẾT HỢP GIẢI PHÁP 1 & GIẢI PHÁP 2)
  const handleStartExam = () => {
    if (contestInfo.isOpen === false) {
      alert('Cổng thi hiện đang tạm đóng theo thông báo của Ban Tổ Chức!');
      return;
    }

    if (questions.length === 0) {
      alert('Ngân hàng câu hỏi hiện chưa có câu hỏi nào. Vui lòng liên hệ Thầy/Cô Quản Trị!');
      return;
    }

    setValidationError(null);

    let finalName = '';
    if (!useManualName) {
      // GIẢI PHÁP 1: Chọn từ danh sách chuẩn của lớp
      if (!selectedPresetName) {
        setValidationError('Vui lòng chọn tên của em từ danh sách lớp!');
        return;
      }
      finalName = selectedPresetName;
    } else {
      // GIẢI PHÁP 2: Tự nhập có bộ lọc chặn từ ngữ xấu & kiểm tra chuẩn tên tiếng Việt
      const check = validateStudentName(customNameInput);
      if (!check.isValid) {
        setValidationError(check.errorMessage || 'Họ tên không hợp lệ!');
        return;
      }
      finalName = check.sanitizedName || customNameInput.trim();
    }

    setCurrentCandidate({
      name: finalName,
      className: selectedClass,
    });

    // Reset thông số bài thi
    setCurrentQuestionIdx(0);
    setAnswers({});
    setTimeLeftSeconds(contestInfo.durationMinutes * 60);
    setTimeSpentSeconds(0);
    setIsExamCompleted(false);
    setScreen('exam');
  };

  // Chọn đáp án
  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  // Nộp bài thi
  const handleSubmitExam = () => {
    if (Object.keys(answers).length < questions.length) {
      const confirmSubmit = window.confirm(
        `Em mới làm ${Object.keys(answers).length}/${questions.length} câu. Em có chắc chắn muốn nộp bài sớm không?`
      );
      if (!confirmSubmit) return;
    }
    finalizeExam();
  };

  // Tự động nộp khi hết giờ
  const handleAutoSubmit = () => {
    alert('Hết giờ làm bài thi! Hệ thống đang tự động nộp và chấm điểm bài làm của em.');
    finalizeExam();
  };

  // Tính điểm & lưu bảng xếp hạng
  const finalizeExam = () => {
    setIsExamCompleted(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const newSub: ContestSubmission = {
      id: `sub-${Date.now()}`,
      contestId: contestInfo.id,
      studentName: currentCandidate?.name || 'Học sinh',
      studentClass: currentCandidate?.className || '8A1',
      score: correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds: timeSpentSeconds,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setLatestSubmission(newSub);
    const updated = saveContestSubmission(newSub);
    setSubmissions(updated);
    setScreen('result');
  };

  // Lọc danh sách bài thi theo hội thi đang được chọn trên bảng xếp hạng
  const activeLeaderboardSubmissions = useMemo(() => {
    return submissions.filter((s) => s.contestId === leaderboardContestId);
  }, [submissions, leaderboardContestId]);

  // Tính bảng xếp hạng cá nhân Top 10 (Sắp xếp: Điểm cao nhất -> Thời gian nhanh nhất)
  const sortedIndividuals = useMemo(() => {
    return [...activeLeaderboardSubmissions].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSpentSeconds - b.timeSpentSeconds;
    }).slice(0, 10);
  }, [activeLeaderboardSubmissions]);

  // Tính bảng xếp hạng thi đua tập thể theo Chi đội / Lớp
  const classLeaderboard = useMemo(() => {
    const classMap: Record<string, { totalScore: number; count: number; perfectCount: number }> = {};

    activeLeaderboardSubmissions.forEach((sub) => {
      if (!classMap[sub.studentClass]) {
        classMap[sub.studentClass] = { totalScore: 0, count: 0, perfectCount: 0 };
      }
      classMap[sub.studentClass].totalScore += sub.score;
      classMap[sub.studentClass].count += 1;
      if (sub.score === sub.totalQuestions && sub.totalQuestions > 0) {
        classMap[sub.studentClass].perfectCount += 1;
      }
    });

    const list = Object.keys(classMap).map((cls) => {
      const item = classMap[cls];
      const avg = (item.totalScore / item.count).toFixed(1);
      return {
        className: cls,
        participantsCount: item.count,
        avgScore: parseFloat(avg),
        perfectCount: item.perfectCount,
      };
    });

    return list.sort((a, b) => {
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      return b.participantsCount - a.participantsCount;
    });
  }, [activeLeaderboardSubmissions]);

  // In / Tải giấy khen
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 0. THANH ĐIỀU HÀNH DÀNH RIÊNG CHO BAN TỔ CHỨC, BAN GIÁM KHẢO & GIÁO VIÊN   */}
      {/* BẢO MẬT RBAC: CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP VAI TRÒ CÁN BỘ / GIÁO VIÊN      */}
      {/* HỌC SINH DỰ THI HOÀN TOÀN KHÔNG NHÌN THẤY NGÂN HÀNG ĐỀ & BẢNG ĐIỂM         */}
      {/* ========================================================================= */}
      {isStaff && (
        <div className="mb-5 bg-gradient-to-r from-heritage-ivory-100 via-amber-50 to-heritage-ivory-100 border-2 border-heritage-gold-400/80 rounded-2xl p-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-heritage-red-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-heritage-gold-400">
              <Trophy className="w-5 h-5 text-heritage-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xs sm:text-sm text-heritage-red-950 uppercase tracking-tight">
                  Ban Giám Khảo & Quản Trị Hội Thi
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  contestInfo.isOpen !== false
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {contestInfo.isOpen !== false ? '🟢 Cổng thi mở' : '🔴 Cổng thi đóng'}
                </span>
                {isCloudConnected && (
                  <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    <Cloud className="w-3 h-3 text-blue-600" />
                    <span>Supabase Live</span>
                  </span>
                )}
                <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <User className="w-3 h-3 text-amber-800" />
                  <span>{profile?.full_name ? profile.full_name.split('(')[0].trim() : user?.email}</span>
                </span>
              </div>
              <p className="text-[11px] text-heritage-ink-600 mt-0.5">
                Ngân hàng: <strong>{questions.length} câu hỏi</strong> • Đã nộp: <strong>{submissions.length} bài thi</strong> • 24 lớp THCS
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => {
                setManagerInitialTab('questions');
                setIsManagerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 border border-heritage-gold-400/40"
              title="Mở Quản lý ngân hàng câu hỏi trắc nghiệm"
            >
              <BookOpen className="w-3.5 h-3.5 text-heritage-gold-300" />
              <span>Ngân hàng câu hỏi</span>
            </button>

            <button
              onClick={() => {
                setManagerInitialTab('students');
                setIsManagerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-red-950 font-black text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 border border-heritage-gold-500"
              title="Xem danh sách bài thi, chấm điểm và xuất file Excel CSV"
            >
              <Printer className="w-3.5 h-3.5 text-heritage-red-900" />
              <span>Bảng điểm & Xuất Excel</span>
            </button>

            <button
              onClick={() => {
                setManagerInitialTab('roster');
                setIsManagerOpen(true);
              }}
              className="px-3 py-1.5 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-800 font-bold text-xs rounded-xl shadow-xs transition border border-heritage-ivory-300 flex items-center space-x-1"
              title="Quản lý danh sách học sinh theo 24 lớp"
            >
              <Layers className="w-3.5 h-3.5 text-heritage-red-700" />
              <span>24 Lớp</span>
            </button>

            <button
              onClick={() => {
                setManagerInitialTab('contest');
                setIsManagerOpen(true);
              }}
              className="p-1.5 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-700 border border-heritage-ivory-300 rounded-xl transition shadow-xs"
              title="Cấu hình thông tin hội thi & Mở/Đóng cổng"
            >
              <Settings className="w-4 h-4 text-heritage-red-700" />
            </button>
          </div>
        </div>
      )}

      {/* 1. MÀN HÌNH GIỚI THIỆU HỘI THI (INTRO) */}
      {screen === 'intro' && (
        <div className="bg-gradient-to-br from-heritage-red-900 via-heritage-red-800 to-heritage-red-950 text-white rounded-3xl p-6 sm:p-10 border border-heritage-gold-400/50 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-heritage-gold-400/10 pointer-events-none blur-2xl" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-gold-400/20 text-heritage-gold-300 border border-heritage-gold-400/40 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-heritage-gold-400" />
                <span>{contestInfo.bannerTag}</span>
              </div>
              {contestInfo.isOpen === false && (
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/40 text-xs font-bold">
                  🔒 Cổng thi đang tạm đóng
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-black text-heritage-ivory-50 tracking-tight leading-tight mb-3">
              {contestInfo.title}
            </h3>

            <p className="text-heritage-gold-200 font-medium text-sm sm:text-base mb-6 leading-relaxed">
              {contestInfo.subtitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <span className="text-[11px] text-heritage-gold-300 uppercase block font-semibold">Thời lượng thi</span>
                <span className="font-serif text-lg sm:text-xl font-bold text-white">{contestInfo.durationMinutes} Phút</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <span className="text-[11px] text-heritage-gold-300 uppercase block font-semibold">Số lượng câu hỏi</span>
                <span className="font-serif text-lg sm:text-xl font-bold text-white">{questions.length} Câu trắc nghiệm</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <span className="text-[11px] text-heritage-gold-300 uppercase block font-semibold">Đơn vị tổ chức</span>
                <span className="font-serif text-xs sm:text-sm font-bold text-white truncate block" title={contestInfo.organizer}>
                  Liên đội trường
                </span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <span className="text-[11px] text-heritage-gold-300 uppercase block font-semibold">Vinh danh</span>
                <span className="font-serif text-xs sm:text-sm font-bold text-emerald-400 flex items-center space-x-1">
                  <span>📜 Giấy khen điện tử</span>
                </span>
              </div>
            </div>

            {contestInfo.isOpen === false && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔒</span>
                  <span>Cổng thi trực tuyến hiện đang tạm đóng theo thông báo của Ban Tổ Chức.</span>
                </div>
                {isStaff && (
                  <button
                    onClick={() => {
                      setManagerInitialTab('contest');
                      setIsManagerOpen(true);
                    }}
                    className="px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition whitespace-nowrap"
                  >
                    Mở cổng thi
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => setScreen('register')}
                disabled={contestInfo.isOpen === false}
                className={`px-8 py-3.5 font-black text-sm sm:text-base rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                  contestInfo.isOpen !== false
                    ? 'bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 hover:brightness-110 text-heritage-red-950'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>Tham Gia Dự Thi Ngay</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setScreen('leaderboard')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-heritage-ivory-100 font-bold text-sm sm:text-base rounded-xl border border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Trophy className="w-4 h-4 text-heritage-gold-300" />
                <span>Xem Bảng Xếp Hạng ({submissions.length} Lượt thi)</span>
              </button>

              {isStaff && (
                <button
                  onClick={() => {
                    setManagerInitialTab('questions');
                    setIsManagerOpen(true);
                  }}
                  className="px-5 py-3.5 bg-black/30 hover:bg-black/50 text-heritage-gold-300 font-bold text-xs sm:text-sm rounded-xl border border-heritage-gold-400/40 transition-all flex items-center justify-center space-x-1.5"
                  title="Bảng điều khiển dành cho Giáo viên & Ban Tổ Chức"
                >
                  <Settings className="w-4 h-4" />
                  <span>Quản Trị Toàn Diện</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MÀN HÌNH ĐĂNG KÝ THI (KẾT HỢP GIẢI PHÁP 1 & GIẢI PHÁP 2) */}
      {screen === 'register' && (
        <div className="max-w-2xl mx-auto bg-heritage-ivory-100 rounded-3xl p-6 sm:p-10 border border-heritage-gold-400 shadow-xl animate-fadeIn">
          <div className="text-center mb-6 pb-5 border-b border-heritage-ivory-300">
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200 mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Định danh Thí Sinh Dự Thi</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900">
              Nhập Thông Tin Học Sinh
            </h3>
            <p className="text-xs sm:text-sm text-heritage-ink-600 mt-1">
              Thông tin sẽ được ghi nhận lên Bảng vinh danh và Giấy chứng nhận của nhà trường.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. CHỌN LỚP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-heritage-ink-800 mb-1.5">
                1. Chọn Lớp / Chi đội của em *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-heritage-gold-400 rounded-xl text-sm font-bold text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600 shadow-sm"
              >
                {SCHOOL_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. CHỌN TÊN (GIẢI PHÁP 1) HOẶC TỰ NHẬP (GIẢI PHÁP 2) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-heritage-ink-800">
                  2. Họ và tên học sinh *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseManualName(!useManualName);
                    setValidationError(null);
                  }}
                  className="text-xs font-semibold text-heritage-red-700 hover:underline flex items-center space-x-1"
                >
                  <span>{useManualName ? '← Chọn từ danh sách lớp có sẵn' : '✏️ Tên em chưa có? Tự nhập'}</span>
                </button>
              </div>

              {!useManualName ? (
                /* GIẢI PHÁP 1: Chọn từ danh sách lớp */
                <div className="space-y-1.5">
                  <select
                    value={selectedPresetName}
                    onChange={(e) => setSelectedPresetName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-heritage-gold-400 rounded-xl text-sm font-bold text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600 shadow-sm"
                  >
                    {(roster[selectedClass] || []).map((name) => (
                      <option key={name} value={name}>
                        {name} ({selectedClass})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Tên đã được xác thực chuẩn mực từ danh sách lớp {selectedClass}.</span>
                  </p>
                </div>
              ) : (
                /* GIẢI PHÁP 2: Tự nhập có bộ lọc kiểm tra nghiêm ngặt */
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={(e) => {
                      setCustomNameInput(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="Ví dụ: Nguyễn Văn An (tối thiểu 2 từ, chỉ chữ cái)"
                    className="w-full px-4 py-3 bg-white border border-heritage-gold-400 rounded-xl text-sm font-semibold text-heritage-ink-900 outline-none focus:ring-2 focus:ring-heritage-red-600 shadow-sm"
                  />
                  <p className="text-[11px] text-heritage-ink-500">
                    * Bắt buộc nhập Họ và Tên thật đầy đủ có dấu (không chứa số, ký tự lạ hay từ ngữ phản cảm).
                  </p>
                </div>
              )}
            </div>

            {/* Báo lỗi xác thực nếu có */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl flex items-start space-x-2 text-xs text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{validationError}</span>
              </div>
            )}

            {/* Nút bắt đầu */}
            <div className="pt-4 border-t border-heritage-ivory-300 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen('intro')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-heritage-ink-700 hover:bg-heritage-ivory-200 transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleStartExam}
                className="px-7 py-3 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-2"
              >
                <span>Bắt Đầu Làm Bài</span>
                <ChevronRight className="w-5 h-5 text-heritage-gold-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHÒNG THI CHÍNH THỨC (EXAM ROOM CÓ ĐẾM GIỜ) */}
      {screen === 'exam' && (
        <div className="max-w-4xl mx-auto bg-heritage-ivory-100 rounded-3xl p-5 sm:p-8 border border-heritage-gold-400/70 shadow-2xl animate-fadeIn">
          {/* Header phòng thi */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-heritage-ivory-300 mb-6">
            <div>
              <span className="text-xs text-heritage-ink-500 uppercase font-semibold">Thí sinh:</span>
              <h4 className="font-serif text-base sm:text-lg font-bold text-heritage-red-800">
                {currentCandidate?.name} • <span className="text-heritage-gold-700">{currentCandidate?.className}</span>
              </h4>
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border shadow-sm font-mono font-black text-sm sm:text-base ${
              timeLeftSeconds <= 120
                ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                : 'bg-white text-heritage-ink-900 border-heritage-gold-300'
            }`}>
              <Clock className="w-4 h-4 text-heritage-red-600" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Bản đồ câu hỏi (Question Navigation Rail) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = currentQuestionIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all flex-shrink-0 ${
                    isCurrent
                      ? 'bg-heritage-red-700 text-white ring-2 ring-heritage-gold-400 shadow-md'
                      : isAnswered
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:border-heritage-gold-400'
                  }`}
                  aria-label={`Câu ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Câu hỏi hiện tại */}
          {questions[currentQuestionIdx] && (
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-heritage-ivory-300 shadow-sm mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-heritage-red-700 mb-3">
                <span>Câu hỏi {currentQuestionIdx + 1} / {questions.length}</span>
                <span className="text-heritage-ink-500 font-normal">
                  {answers[currentQuestionIdx] !== undefined ? '✓ Đã chọn đáp án' : 'Chưa chọn'}
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-xl font-bold text-heritage-ink-900 leading-relaxed mb-6">
                {questions[currentQuestionIdx].question}
              </h3>

              {/* Lựa chọn A, B, C, D */}
              <div className="space-y-3">
                {questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-heritage-red-50 border-heritage-red-700 text-heritage-red-950 font-bold shadow-sm ring-1 ring-heritage-red-700'
                          : 'bg-heritage-ivory-50 border-heritage-ivory-300 text-heritage-ink-800 hover:bg-white hover:border-heritage-gold-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                          isSelected
                            ? 'bg-heritage-red-700 text-white border-heritage-red-700'
                            : 'bg-white text-heritage-ink-700 border-heritage-ivory-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Điều khiển chân trang */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-heritage-ivory-300 text-heritage-ink-700 hover:bg-heritage-ivory-200 disabled:opacity-40 transition"
            >
              ← Câu trước
            </button>

            <div className="flex items-center space-x-2">
              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((p) => Math.min(questions.length - 1, p + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-900 transition flex items-center space-x-1"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all active:scale-95"
              >
                Nộp Bài Thi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MÀN HÌNH KẾT QUẢ & XEM LẠI ĐÁP ÁN */}
      {screen === 'result' && latestSubmission && (
        <div className="max-w-3xl mx-auto bg-heritage-ivory-100 rounded-3xl p-6 sm:p-10 border border-heritage-gold-400 shadow-2xl animate-fadeIn text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-heritage-gold-300 to-heritage-gold-500 text-heritage-red-950 mx-auto flex items-center justify-center shadow-lg mb-4">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-heritage-red-700 bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200">
            Hoàn Thành Bài Thi Hội Thi
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-black text-heritage-ink-900 mt-2 mb-1">
            Chúc Mừng Thí Sinh: {latestSubmission.studentName}
          </h3>
          <p className="text-sm font-semibold text-heritage-gold-700 mb-6">
            Chi đội: Lớp {latestSubmission.studentClass} • Trường THCS Nguyễn Trung Trực
          </p>

          {/* Hộp điểm số */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="p-4 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-xs text-heritage-ink-500 block">Số câu đúng</span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-heritage-red-700">
                {latestSubmission.score} <span className="text-sm text-heritage-ink-400 font-normal">/ {latestSubmission.totalQuestions}</span>
              </span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-xs text-heritage-ink-500 block">Thời gian thi</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-heritage-ink-900">
                {formatTime(latestSubmission.timeSpentSeconds)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-xs text-heritage-ink-500 block">Đánh giá</span>
              <span className="font-serif text-base sm:text-lg font-bold text-emerald-700">
                {latestSubmission.score >= 9 ? '⭐ Xuất sắc' : latestSubmission.score >= 7 ? 'Giỏi' : 'Đạt'}
              </span>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {latestSubmission.score >= 7 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-6 py-3 bg-gradient-to-r from-heritage-gold-500 to-heritage-gold-600 hover:brightness-110 text-heritage-red-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>📜 Xem Giấy Khen Điện Tử</span>
              </button>
            )}

            <button
              onClick={() => setScreen('leaderboard')}
              className="px-6 py-3 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-heritage-gold-300" />
              <span>Xem Bảng Xếp Hạng Toàn Trường</span>
            </button>

            <button
              onClick={() => setScreen('register')}
              className="px-5 py-3 bg-white hover:bg-heritage-ivory-200 text-heritage-ink-700 border border-heritage-ivory-300 font-semibold text-xs sm:text-sm rounded-xl transition"
            >
              Thi lại
            </button>
          </div>
        </div>
      )}

      {/* 5. MÀN HÌNH BẢNG XẾP HẠNG & VINH DANH (LEADERBOARD) */}
      {screen === 'leaderboard' && (
        <div className="max-w-4xl mx-auto bg-heritage-ivory-100 rounded-3xl p-5 sm:p-8 md:p-10 border border-heritage-gold-400 shadow-xl animate-fadeIn">
          {/* Header Bảng xếp hạng */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-heritage-ivory-300 gap-4 mb-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center space-x-2 mb-2">
                <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3 py-1 rounded-full border border-heritage-red-200">
                  <Trophy className="w-3.5 h-3.5 text-heritage-gold-600" />
                  <span>Bảng Vinh Danh Học Đường</span>
                </div>
                {isCloudConnected && (
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Cloud Sync</span>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900">
                Bảng Xếp Hạng Hội Thi Trực Tuyến
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-heritage-gold-300 shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-heritage-red-700 flex-shrink-0" />
                <select
                  value={leaderboardContestId}
                  onChange={(e) => setLeaderboardContestId(e.target.value)}
                  className="bg-transparent font-bold text-xs text-heritage-ink-900 focus:outline-none cursor-pointer max-w-[200px] truncate"
                  title="Chọn Hội thi cần xem bảng xếp hạng"
                >
                  {contestsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.status === 'active' ? '⭐ [Đang mở]' : c.status === 'archived' ? '📦 [Đã lưu trữ]' : '📝 [Dự thảo]'} {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setLeaderboardTab('individual')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  leaderboardTab === 'individual'
                    ? 'bg-heritage-red-700 text-white shadow-sm'
                    : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:bg-heritage-red-50'
                }`}
              >
                Cá Nhân Top 10
              </button>
              <button
                onClick={() => setLeaderboardTab('class')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  leaderboardTab === 'class'
                    ? 'bg-heritage-red-700 text-white shadow-sm'
                    : 'bg-white text-heritage-ink-700 border border-heritage-ivory-300 hover:bg-heritage-red-50'
                }`}
              >
                Thi Đua Chi Đội Lớp
              </button>
              {isStaff && (
                <button
                  onClick={() => {
                    setManagerInitialTab('students');
                    setIsManagerOpen(true);
                  }}
                  className="px-3.5 py-2 bg-heritage-gold-400 hover:bg-heritage-gold-300 text-heritage-ink-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 border border-heritage-gold-500/50"
                  title="Quản lý toàn bộ danh sách điểm thi & Xuất Excel"
                >
                  <Settings className="w-3.5 h-3.5 text-heritage-red-800" />
                  <span>Quản trị điểm & Xuất Excel</span>
                </button>
              )}
            </div>
          </div>

          {/* Banner Kỷ yếu nếu xem Hội thi đã Lưu trữ */}
          {(() => {
            const currentC = contestsList.find((c) => c.id === leaderboardContestId);
            if (currentC && currentC.status === 'archived') {
              return (
                <div className="mb-6 p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-start space-x-3 text-xs text-purple-950 shadow-xs">
                  <FolderArchive className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-purple-900 block">
                      Bảng Vàng Kỷ Yếu Danh Dự (Đã Tổng Kết & Lưu Trữ Hồ Sơ {currentC.archivedAt ? `ngày ${currentC.archivedAt}` : ''})
                    </span>
                    <p className="text-xs text-purple-800 italic mt-1 leading-relaxed">
                      {currentC.summaryNote || 'Hội thi đã hoàn thành xuất sắc các mục tiêu thi đua đề ra.'}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* TAB 1: BẢNG XẾP HẠNG CÁ NHÂN */}
          {leaderboardTab === 'individual' && (
            <div className="space-y-2.5">
              {sortedIndividuals.map((sub, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;

                return (
                  <div
                    key={sub.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isTop1
                        ? 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-white border-amber-400 shadow-md ring-1 ring-amber-400'
                        : isTop2
                        ? 'bg-gradient-to-r from-slate-100/90 via-slate-50 to-white border-slate-300 shadow-sm'
                        : isTop3
                        ? 'bg-gradient-to-r from-orange-100/70 via-orange-50 to-white border-orange-300 shadow-sm'
                        : 'bg-white border-heritage-ivory-300 hover:border-heritage-gold-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Vị trí xếp hạng */}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                        isTop1
                          ? 'bg-amber-400 text-amber-950 shadow'
                          : isTop2
                          ? 'bg-slate-300 text-slate-900'
                          : isTop3
                          ? 'bg-orange-300 text-orange-950'
                          : 'bg-heritage-ivory-200 text-heritage-ink-700'
                      }`}>
                        {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-heritage-ink-900 truncate">
                          {sub.studentName}
                        </h4>
                        <p className="text-[11px] text-heritage-ink-500 font-medium">
                          Lớp {sub.studentClass} • {sub.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-serif font-black text-sm sm:text-base text-heritage-red-700 block">
                        {sub.score} / {sub.totalQuestions} điểm
                      </span>
                      <span className="font-mono text-[11px] text-heritage-ink-500">
                        ⏱️ {formatTime(sub.timeSpentSeconds)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: BẢNG XẾP HẠNG THI ĐUA CHI ĐỘI LỚP */}
          {leaderboardTab === 'class' && (
            <div className="space-y-2.5">
              {classLeaderboard.map((cls, idx) => (
                <div
                  key={cls.className}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-heritage-ivory-300 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-heritage-red-50 text-heritage-red-700 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-heritage-ink-900">
                        Chi đội Lớp {cls.className}
                      </h4>
                      <p className="text-[11px] text-heritage-ink-500">
                        {cls.participantsCount} học sinh tham gia • {cls.perfectCount} điểm 10 tuyệt đối
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-black text-sm text-heritage-gold-700 block">
                      ĐTB: {cls.avgScore} / 10
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Tích cực
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nút hành động chân trang */}
          <div className="mt-8 pt-5 border-t border-heritage-ivory-300 flex items-center justify-between">
            <button
              onClick={() => setScreen('intro')}
              className="text-xs sm:text-sm font-semibold text-heritage-ink-700 hover:text-heritage-red-700 transition"
            >
              ← Về trang chủ hội thi
            </button>
            <button
              onClick={() => setScreen('register')}
              className="px-6 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition"
            >
              Vào Thi Ngay
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL GIẤY CHỨNG NHẬN ĐIỆN TỬ (E-CERTIFICATE) */}
      {showCertificate && latestSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full border-4 border-heritage-gold-400 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Giấy chứng nhận */}
            <div className="text-center border-b-2 border-heritage-red-700/30 pb-4 mb-6">
              <span className="text-xs font-bold tracking-widest uppercase text-heritage-red-800">
                ĐỘI TNTP HỒ CHÍ MINH • LIÊN ĐỘI THCS NGUYỄN TRUNG TRỰC
              </span>
              <p className="text-[11px] text-heritage-ink-500 italic mt-0.5">
                Phường Thới An, Thành phố Hồ Chí Minh
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-heritage-red-800 tracking-wider uppercase mt-3">
                GIẤY CHỨNG NHẬN
              </h2>
              <p className="text-xs font-serif italic text-heritage-gold-600 font-semibold">
                Đạt thành tích xuất sắc trong Hội thi Trực tuyến tìm hiểu về Bác Hồ
              </p>
            </div>

            {/* Nội dung chứng nhận */}
            <div className="space-y-3 mb-6">
              <p className="text-xs sm:text-sm text-heritage-ink-700">Chứng nhận em:</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-heritage-ink-900 text-heritage-red-900">
                {latestSubmission.studentName}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-heritage-ink-800">
                Học sinh Chi đội Lớp <span className="text-heritage-red-700 font-extrabold">{latestSubmission.studentClass}</span>
              </p>
              <p className="text-xs sm:text-sm text-heritage-ink-700 leading-relaxed max-w-lg mx-auto">
                Đã xuất sắc đạt điểm số <strong>{latestSubmission.score} / {latestSubmission.totalQuestions}</strong> trong đợt thi đua rèn đức luyện tài theo gương Bác Hồ vĩ đại tại Không gian văn hóa Hồ Chí Minh.
              </p>
            </div>

            {/* Chữ ký & Dấu mộc số */}
            <div className="flex items-center justify-between pt-4 border-t border-heritage-ivory-300 text-xs">
              <div className="text-left">
                <span className="text-[10px] text-heritage-ink-500 block">Mã chứng nhận số:</span>
                <span className="font-mono font-bold text-heritage-ink-800 text-[11px]">NTT-HCM-{latestSubmission.id.slice(-6)}</span>
              </div>
              <div className="text-center">
                <span className="text-[11px] italic text-heritage-ink-600 block">Thới An, Ngày {new Date().toLocaleDateString('vi-VN')}</span>
                <span className="font-bold text-heritage-red-800 text-xs block mt-1">BAN TỔ CHỨC HỘI THI</span>
                <span className="inline-block px-2 py-0.5 mt-1 border border-red-500 text-red-600 text-[9px] font-bold rounded">
                  ĐÃ XÁC THỰC SỐ
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In Giấy Chứng Nhận</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 bg-heritage-ivory-200 hover:bg-heritage-ivory-300 text-heritage-ink-800 rounded-xl text-xs sm:text-sm font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CHÂN TRANG ĐIỀU HÀNH DÀNH RIÊNG CHO BAN GIÁM KHẢO (NẾU CHƯA ĐĂNG NHẬP) */}
      {/* ========================================================================= */}
      {!isStaff && (
        <div className="mt-8 pt-4 border-t border-heritage-ivory-300 flex flex-wrap items-center justify-between gap-3 text-xs text-heritage-ink-500">
          <div className="flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-heritage-gold-600" />
            <span className="font-medium text-heritage-ink-600">
              Hội thi học đường • Liên đội Trường THCS Nguyễn Trung Trực (Phường Thới An, Q.12)
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-heritage-ink-600 hover:text-heritage-red-700 transition font-medium px-2.5 py-1.5 rounded-xl hover:bg-heritage-ivory-200 border border-transparent hover:border-heritage-gold-300/60"
            title="Dành cho Ban Giám Khảo & Cán bộ quản lý đăng nhập để điều hành hội thi"
          >
            <Lock className="w-3.5 h-3.5 text-heritage-ink-400" />
            <span>Dành cho Ban Giám Khảo / Quản trị</span>
          </button>
        </div>
      )}

      {/* Modal Đăng nhập / Chuyển quyền Ban Giám Khảo */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 7. MODAL HỆ QUẢN TRỊ CÂU HỎI, HỘI THI & HỌC SINH (CHO GIÁO VIÊN / ADMIN)   */}
      {/* ========================================================================= */}
      <ContestManagerModal
        isOpen={isManagerOpen && isStaff}
        onClose={() => setIsManagerOpen(false)}
        initialTab={managerInitialTab}
      />
    </div>
  );
};
