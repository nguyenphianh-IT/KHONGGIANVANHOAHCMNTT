import React, { useState, useEffect, useMemo } from 'react';
import {
  ClassInfo,
  getStoredClasses,
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
  getStandardizedScore10,
  compareSubmissions,
  EVENT_CONTEST_DATA_CHANGED,
  fetchSupabaseContestData,
  fetchSupabaseQuestions,
} from '../data/contestData';
import {
  Trophy, Award, Clock, CheckCircle2, AlertTriangle, ChevronRight,
  User, Printer, Settings, BookOpen, Layers, FolderArchive, Cloud, Lock,
  Users, Sparkles, Medal, Search, Filter
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
  const [classesList, setClassesList] = useState<ClassInfo[]>(getStoredClasses);
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

  // Trạng thái bài thi (hỗ trợ số lượng câu hỏi linh hoạt theo cấu hình)
  const [examQuestions, setExamQuestions] = useState<ContestQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(contestInfo.durationMinutes * 60);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Danh sách các hội thi đang mở song song trên hệ thống
  const activeContests = useMemo(() => {
    return contestsList.filter((c) => c.status === 'active');
  }, [contestsList]);

  // Số lượng bài nộp của riêng hội thi đang được chọn
  const activeContestSubmissionsCount = useMemo(() => {
    return submissions.filter((s) => s.contestId === contestInfo.id).length;
  }, [submissions, contestInfo.id]);

  // Chuyển đổi hội thi đang chọn khi có 2 hoặc nhiều hội thi song song
  const handleSelectActiveContest = (contest: ContestInfo) => {
    setContestInfo(contest);
    setLeaderboardContestId(contest.id);
  };

  // Tính số lượng câu hỏi thực tế của đề thi dựa trên cấu hình (contestInfo.totalQuestions)
  const targetExamQuestionCount = useMemo(() => {
    if (contestInfo.totalQuestions && contestInfo.totalQuestions > 0) {
      return questions.length > 0 ? Math.min(contestInfo.totalQuestions, questions.length) : contestInfo.totalQuestions;
    }
    return questions.length;
  }, [contestInfo.totalQuestions, questions.length]);

  // Bộ câu hỏi hiện thời dùng trong phòng thi
  const activeExamQuestions = examQuestions.length > 0 ? examQuestions : questions;

  // Kết quả vừa thi
  const [latestSubmission, setLatestSubmission] = useState<ContestSubmission | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Bảng xếp hạng & Trạng thái Supabase Cloud
  const [leaderboardTab, setLeaderboardTab] = useState<'individual' | 'class'>('individual');
  const [leaderboardFilterMode, setLeaderboardFilterMode] = useState<'best' | 'all'>('best');
  const [leaderboardViewMode, setLeaderboardViewMode] = useState<'top10' | 'all'>('top10');
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>('');
  const [classSortMode, setClassSortMode] = useState<'movement' | 'avg' | 'participants'>('movement');
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
      setClassesList(getStoredClasses());
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

    // 1. RÚT ĐỀ THI LINH HOẠT THEO CẤU HÌNH VÀ CHỦ ĐỀ HỘI THI (5, 10, 15, 20... CÂU)
    let eligibleQuestions = [...questions];
    if (contestInfo.categoryFilter && contestInfo.categoryFilter !== 'all') {
      const categorySpecific = questions.filter((q) => q.category === contestInfo.categoryFilter);
      if (categorySpecific.length >= 5) {
        eligibleQuestions = categorySpecific;
      }
    } else if (contestInfo.id === 'hoi-thi-2024-5-dieu-bac-day') {
      // Ưu tiên câu hỏi về 5 Điều Bác Hồ dạy & Đội TNTP cho Hội thi thiếu nhi
      const topicSpecific = questions.filter((q) => q.category === '5-dieu-bac-day' || q.category === 'thoi-an-truyen-thong');
      if (topicSpecific.length >= 5) {
        eligibleQuestions = [...topicSpecific, ...questions.filter((q) => !topicSpecific.includes(q))];
      }
    }

    const count = contestInfo.totalQuestions && contestInfo.totalQuestions > 0
      ? Math.min(contestInfo.totalQuestions, eligibleQuestions.length)
      : eligibleQuestions.length;

    let selectedExamQuestions: ContestQuestion[] = [];
    if (eligibleQuestions.length <= count) {
      selectedExamQuestions = [...eligibleQuestions];
    } else {
      // Xáo trộn ngẫu nhiên bộ câu hỏi từ ngân hàng để chống nhìn bài nhau
      const shuffled = [...eligibleQuestions].sort(() => 0.5 - Math.random());
      selectedExamQuestions = shuffled.slice(0, count);
    }
    setExamQuestions(selectedExamQuestions);

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
    const totalQ = activeExamQuestions.length;
    if (Object.keys(answers).length < totalQ) {
      const confirmSubmit = window.confirm(
        `Em mới làm ${Object.keys(answers).length}/${totalQ} câu. Em có chắc chắn muốn nộp bài sớm không?`
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

    const questionsToScore = activeExamQuestions;
    let correctCount = 0;
    questionsToScore.forEach((q, idx) => {
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
      totalQuestions: questionsToScore.length,
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

  // Danh sách thí sinh sau khi lọc/gộp theo chế độ "Mỗi em 1 bài cao nhất" hoặc "Tất cả lượt thi"
  const processedIndividuals = useMemo(() => {
    let list = [...activeLeaderboardSubmissions];

    if (leaderboardFilterMode === 'best') {
      // Mỗi học sinh (theo Họ tên + Lớp) chỉ lấy bài thi có kết quả tốt nhất
      const bestMap = new Map<string, ContestSubmission>();
      list.forEach((sub) => {
        const key = `${sub.studentName.trim().toLowerCase()}__${sub.studentClass.trim().toLowerCase()}`;
        const existing = bestMap.get(key);
        if (!existing) {
          bestMap.set(key, sub);
        } else {
          // So sánh, nếu sub tốt hơn existing thì thay thế
          if (compareSubmissions(sub, existing) < 0) {
            bestMap.set(key, sub);
          }
        }
      });
      list = Array.from(bestMap.values());
    }

    // Sắp xếp chuẩn theo xếp hạng: Thang 10 cao nhất -> Thời gian nhanh nhất -> Nộp trước
    list.sort(compareSubmissions);

    // Tìm kiếm nếu có gõ từ khóa
    if (leaderboardSearch.trim()) {
      const q = leaderboardSearch.trim().toLowerCase();
      list = list.filter((s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.studentClass.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeLeaderboardSubmissions, leaderboardFilterMode, leaderboardSearch]);

  // Danh sách hiển thị trên Bảng xếp hạng cá nhân (Top 10 hoặc Toàn bộ)
  const displayIndividuals = useMemo(() => {
    if (leaderboardViewMode === 'top10' && !leaderboardSearch.trim()) {
      return processedIndividuals.slice(0, 10);
    }
    return processedIndividuals;
  }, [processedIndividuals, leaderboardViewMode, leaderboardSearch]);

  // Top 3 Thí sinh dẫn đầu của Hội thi đang hiển thị trên Banner Bảng Vàng
  const bannerTopCandidates = useMemo(() => {
    const contestSubs = submissions.filter((s) => s.contestId === contestInfo.id);
    if (contestSubs.length === 0) return [];

    // Mỗi học sinh (Họ tên + Lớp) chỉ lấy bài thi có kết quả tốt nhất để xếp hạng công bằng
    const bestMap = new Map<string, ContestSubmission>();
    contestSubs.forEach((sub) => {
      const key = `${sub.studentName.trim().toLowerCase()}__${sub.studentClass.trim().toLowerCase()}`;
      const existing = bestMap.get(key);
      if (!existing || compareSubmissions(sub, existing) < 0) {
        bestMap.set(key, sub);
      }
    });

    return Array.from(bestMap.values()).sort(compareSubmissions).slice(0, 3);
  }, [submissions, contestInfo.id]);

  // Tra cứu thứ hạng của bài thi vừa nộp
  const candidateRankInfo = useMemo(() => {
    if (!latestSubmission) return null;
    const allSorted = [...activeLeaderboardSubmissions].sort(compareSubmissions);
    const idx = allSorted.findIndex((s) => s.id === latestSubmission.id);
    if (idx === -1) return null;
    return {
      rank: idx + 1,
      total: allSorted.length,
      isTop10: idx < 10,
    };
  }, [latestSubmission, activeLeaderboardSubmissions]);

  // Tính bảng xếp hạng thi đua tập thể theo Chi đội / Lớp
  const classLeaderboard = useMemo(() => {
    const classMap: Record<string, {
      totalScore10: number;
      submissionsCount: number;
      uniqueStudents: Set<string>;
      perfectCount: number;
    }> = {};

    activeLeaderboardSubmissions.forEach((sub) => {
      const cls = sub.studentClass;
      if (!classMap[cls]) {
        classMap[cls] = {
          totalScore10: 0,
          submissionsCount: 0,
          uniqueStudents: new Set<string>(),
          perfectCount: 0,
        };
      }
      const score10 = getStandardizedScore10(sub);
      classMap[cls].totalScore10 += score10;
      classMap[cls].submissionsCount += 1;
      classMap[cls].uniqueStudents.add(sub.studentName.trim().toLowerCase());
      if (score10 >= 9.99 || (sub.score === sub.totalQuestions && sub.totalQuestions > 0)) {
        classMap[cls].perfectCount += 1;
      }
    });

    const list = Object.keys(classMap).map((cls) => {
      const item = classMap[cls];
      const count = item.submissionsCount;
      const studentCount = item.uniqueStudents.size;
      const avg = Number((item.totalScore10 / count).toFixed(1));
      // Điểm phong trào toàn diện: ĐTB x 10 + Số học sinh x 5 + Số điểm 10 x 10
      const movementScore = Math.round((avg * 10) + (studentCount * 5) + (item.perfectCount * 10));
      return {
        className: cls,
        participantsCount: studentCount,
        submissionsCount: count,
        avgScore: avg,
        perfectCount: item.perfectCount,
        movementScore,
      };
    });

    return list.sort((a, b) => {
      if (classSortMode === 'movement') {
        if (b.movementScore !== a.movementScore) return b.movementScore - a.movementScore;
        if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
        return b.participantsCount - a.participantsCount;
      }
      if (classSortMode === 'avg') {
        if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
        return b.participantsCount - a.participantsCount;
      }
      if (b.participantsCount !== a.participantsCount) return b.participantsCount - a.participantsCount;
      return b.avgScore - a.avgScore;
    });
  }, [activeLeaderboardSubmissions, classSortMode]);

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
                Ngân hàng: <strong>{questions.length} câu hỏi</strong> • Đã nộp: <strong>{submissions.length} bài thi</strong> • {classesList.length} lớp THCS
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
              title="Quản lý danh sách học sinh theo từng lớp"
            >
              <Layers className="w-3.5 h-3.5 text-heritage-red-700" />
              <span>{classesList.length} Lớp</span>
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

      {/* ========================================================================= */}
      {/* THANH CHUYỂN ĐỔI HỘI THI SONG SONG (PARALLEL CONTEST SELECTOR)           */}
      {/* TỰ ĐỘNG HIỂN THỊ KHI NHÀ TRƯỜNG MỞ TỪ 2 HỘI THI TRỰC TUYẾN CÙNG LÚC       */}
      {/* ========================================================================= */}
      {screen === 'intro' && activeContests.length > 1 && (
        <div className="mb-6 bg-gradient-to-r from-heritage-ivory-100 via-amber-50 to-heritage-ivory-100 p-3.5 sm:p-4 rounded-3xl border-2 border-heritage-gold-400/80 shadow-lg animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 mb-3">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-heritage-red-600"></span>
              </span>
              <div>
                <h4 className="font-serif font-black text-xs sm:text-sm text-heritage-red-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-heritage-gold-600 flex-shrink-0" />
                  <span>Các Hội Thi Trực Tuyến Đang Mở Song Song ({activeContests.length})</span>
                </h4>
              </div>
            </div>
            <div className="text-[11px] text-heritage-ink-700 font-medium bg-white/90 px-3 py-1 rounded-full border border-heritage-gold-300/60 shadow-2xs">
              👉 Em hãy chọn Hội thi phù hợp với khối lớp để tham gia hoặc tra cứu:
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeContests.map((c, idx) => {
              const isSelected = c.id === contestInfo.id;
              const subCount = submissions.filter((s) => s.contestId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectActiveContest(c)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border-2 relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#78121f] to-[#4c0911] text-white border-heritage-gold-400 shadow-xl ring-2 ring-heritage-gold-400/40 scale-[1.01]'
                      : 'bg-white hover:bg-amber-50/70 text-heritage-ink-900 border-heritage-ivory-300 hover:border-heritage-gold-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isSelected
                            ? 'bg-heritage-gold-400 text-heritage-red-950'
                            : 'bg-heritage-red-100 text-heritage-red-900 border border-heritage-red-200'
                        }`}>
                          Hội thi số {idx + 1}
                        </span>
                        {c.targetAudience && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected
                              ? 'bg-white/20 text-heritage-gold-200 border border-white/20'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            🎯 {c.targetAudience}
                          </span>
                        )}
                      </div>

                      {isSelected ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[11px] font-bold border border-emerald-400/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Đang chọn thi</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-heritage-red-700 font-bold group-hover:underline">
                          Bấm chọn thi →
                        </span>
                      )}
                    </div>

                    <h5 className={`font-serif font-black text-sm sm:text-base leading-snug mb-1.5 line-clamp-2 ${
                      isSelected ? 'text-heritage-ivory-50' : 'text-heritage-ink-950'
                    }`}>
                      {c.title}
                    </h5>

                    <p className={`text-xs line-clamp-2 mb-3 leading-relaxed ${
                      isSelected ? 'text-heritage-gold-100/90' : 'text-heritage-ink-600'
                    }`}>
                      {c.subtitle}
                    </p>
                  </div>

                  <div className={`pt-2.5 border-t flex items-center justify-between text-xs ${
                    isSelected ? 'border-white/15 text-heritage-gold-200' : 'border-heritage-ivory-200 text-heritage-ink-600'
                  }`}>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{c.durationMinutes} Phút</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{c.totalQuestions} Câu</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-heritage-gold-500" />
                      <span>{subCount} Bài nộp</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. MÀN HÌNH GIỚI THIỆU HỘI THI (INTRO) - GIAO DIỆN 2 CỘT SANG TRỌNG & CÂN ĐỐI */}
      {screen === 'intro' && (
        <div className="bg-gradient-to-br from-[#73101c] via-[#871423] to-[#4c0911] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-heritage-gold-400/70 shadow-2xl relative overflow-hidden">
          {/* Lớp nền ánh sáng hoàng kim lan tỏa */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-heritage-gold-400/20 pointer-events-none blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-red-600/20 pointer-events-none blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-6 sm:space-y-7">
            {/* ========================================================= */}
            {/* KHỐI TIÊU ĐỀ TRẢI RỘNG TOÀN KHUNG ĐẢM BẢO 1 DÒNG DUY NHẤT */}
            {/* ========================================================= */}
            <div className="border-b border-white/10 pb-5 sm:pb-6">
              {/* Huy hiệu hội thi & Trạng thái mở cổng */}
              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-heritage-gold-400/25 to-amber-500/20 text-heritage-gold-300 border border-heritage-gold-400/40 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-heritage-gold-400" />
                  <span>{contestInfo.bannerTag || 'HỘI THI TRỰC TUYẾN CHÍNH THỨC'}</span>
                </div>
                
                {contestInfo.isOpen !== false ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Đang mở nhận bài dự thi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/30 text-red-200 border border-red-400/50 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-red-300" />
                    <span>Cổng thi đang tạm đóng</span>
                  </span>
                )}

                <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 text-heritage-gold-200 text-xs font-medium border border-white/10">
                  <span>Niên khóa 2025 - 2026</span>
                </span>
              </div>

              {/* Tiêu đề chính hội thi */}
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black text-heritage-ivory-50 tracking-tight leading-snug mb-2.5 drop-shadow-sm">
                {contestInfo.title}
              </h3>

              {/* Mô tả phong trào thi đua */}
              <p className="text-heritage-gold-100/90 font-medium text-xs sm:text-sm lg:text-base leading-relaxed max-w-4xl">
                {contestInfo.subtitle}
              </p>
            </div>

            {/* ========================================================= */}
            {/* BỐ CỤC 2 CỘT DƯỚI: THÔNG SỐ + NÚT BẤM (TRÁI) VÀ BẢNG VÀNG (PHẢI) */}
            {/* ========================================================= */}
            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
              {/* CỘT TRÁI (THÔNG SỐ & NÚT DỰ THI) */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div>
                  {/* 4 Khối thông số thi được thiết kế đẳng cấp dạng Frosted Glass */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
                    {/* 1. Thời lượng */}
                    <div className="bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-heritage-gold-400/30 hover:border-heritage-gold-400/60 transition shadow-inner">
                      <div className="flex items-center space-x-1.5 text-heritage-gold-300 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5 text-heritage-gold-400 flex-shrink-0" />
                        <span>Thời lượng</span>
                      </div>
                      <span className="font-serif text-base sm:text-xl font-black text-white block">
                        {contestInfo.durationMinutes} Phút
                      </span>
                      <span className="text-[10px] text-heritage-gold-200/70 block mt-0.5">Đếm ngược tự động</span>
                    </div>

                    {/* 2. Số câu hỏi */}
                    <div className="bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-heritage-gold-400/30 hover:border-heritage-gold-400/60 transition shadow-inner">
                      <div className="flex items-center space-x-1.5 text-heritage-gold-300 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-heritage-gold-400 flex-shrink-0" />
                        <span>Số câu hỏi</span>
                      </div>
                      <span className="font-serif text-base sm:text-xl font-black text-white block">
                        {targetExamQuestionCount} Câu hỏi
                      </span>
                      <span className="text-[10px] text-heritage-gold-200/70 block mt-0.5">
                        {questions.length > targetExamQuestionCount ? `Rút từ kho ${questions.length} câu` : 'Trắc nghiệm 4 lựa chọn'}
                      </span>
                    </div>

                    {/* 3. Đối tượng dự thi */}
                    <div className="bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-heritage-gold-400/30 hover:border-heritage-gold-400/60 transition shadow-inner">
                      <div className="flex items-center space-x-1.5 text-heritage-gold-300 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider mb-1">
                        <Users className="w-3.5 h-3.5 text-heritage-gold-400 flex-shrink-0" />
                        <span>Đối tượng</span>
                      </div>
                      <span className="font-serif text-xs sm:text-sm font-bold text-white truncate block mt-0.5" title={contestInfo.targetAudience || 'Khối 6, 7, 8, 9 THCS'}>
                        {contestInfo.targetAudience || 'Khối 6, 7, 8, 9'}
                      </span>
                      <span className="text-[10px] text-heritage-gold-200/70 block mt-0.5 truncate">THCS Nguyễn Trung Trực</span>
                    </div>

                    {/* 4. Giải thưởng & Khen thưởng */}
                    <div className="bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-emerald-400/40 hover:border-emerald-400/60 transition shadow-inner">
                      <div className="flex items-center space-x-1.5 text-emerald-300 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider mb-1">
                        <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Khen thưởng</span>
                      </div>
                      <span className="font-serif text-xs sm:text-sm font-bold text-emerald-300 block truncate mt-0.5">
                        Giấy khen điện tử
                      </span>
                      <span className="text-[10px] text-emerald-200/70 block mt-0.5 truncate">
                        Đạt từ {Math.ceil(targetExamQuestionCount * 0.7)}/{targetExamQuestionCount} câu (≥70%)
                      </span>
                    </div>
                  </div>

                  {/* Thông báo khi cổng đóng */}
                  {contestInfo.isOpen === false && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
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
                          className="px-3.5 py-1.5 bg-amber-400 text-amber-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition whitespace-nowrap shadow"
                        >
                          Mở cổng thi
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Các nút hành động chính */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={() => setScreen('register')}
                    disabled={contestInfo.isOpen === false}
                    className={`px-8 py-4 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2.5 ${
                      contestInfo.isOpen !== false
                        ? 'bg-gradient-to-r from-heritage-gold-400 via-amber-300 to-heritage-gold-500 hover:from-amber-300 hover:to-heritage-gold-400 text-heritage-red-950 shadow-amber-950/40 hover:shadow-2xl hover:shadow-amber-400/30 hover:-translate-y-0.5'
                        : 'bg-white/20 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-heritage-red-950" />
                    <span>Tham Gia Dự Thi Ngay</span>
                    <ChevronRight className="w-5 h-5 text-heritage-red-950" />
                  </button>

                  <button
                    onClick={() => {
                      setLeaderboardContestId(contestInfo.id);
                      setScreen('leaderboard');
                    }}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-heritage-gold-100 hover:text-white font-bold text-xs sm:text-sm rounded-2xl border border-heritage-gold-400/40 hover:border-heritage-gold-400/80 transition-all flex items-center justify-center space-x-2 backdrop-blur-sm shadow-sm"
                  >
                    <Trophy className="w-4 h-4 text-heritage-gold-400" />
                    <span>Xem Bảng Xếp Hạng ({activeContestSubmissionsCount} Lượt thi)</span>
                  </button>

                  {isStaff && (
                    <button
                      onClick={() => {
                        setManagerInitialTab('questions');
                        setIsManagerOpen(true);
                      }}
                      className="px-4 py-4 bg-black/40 hover:bg-black/60 text-heritage-gold-300 font-bold text-xs rounded-2xl border border-heritage-gold-400/40 transition-all flex items-center justify-center space-x-1.5"
                      title="Bảng điều khiển dành cho Giáo viên & Ban Tổ Chức"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Quản Trị Toàn Diện</span>
                    </button>
                  )}
                </div>
              </div>

            {/* ========================================================= */}
            {/* CỘT PHẢI: BẢNG VÀNG VINH DANH TOP 3 HỌC ĐƯỜNG (PODIUM)    */}
            {/* ========================================================= */}
            <div className="lg:w-[420px] xl:w-[460px] flex-shrink-0 flex flex-col justify-between">
              <div className="bg-gradient-to-b from-black/55 via-black/45 to-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-heritage-gold-400/40 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
                {/* Vệt sáng trang trí góc thẻ */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-heritage-gold-400/15 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Header thẻ Bảng vàng */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-heritage-gold-400 to-amber-600 text-heritage-red-950 flex items-center justify-center shadow-sm">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-black text-xs sm:text-sm uppercase tracking-wide text-heritage-gold-300 block">
                          Bảng Vàng Học Đường • Top 3
                        </span>
                        <span className="text-[10px] text-white/70 block">
                          Thi đua rèn đức luyện tài
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Live Sync</span>
                    </span>
                  </div>

                  {/* BỤC VINH DANH TOP 3 (OLYMPIC PODIUM SHOWCASE) */}
                  {bannerTopCandidates.length > 0 ? (
                    <div className="pt-2 pb-1">
                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 items-end">
                        {/* 🥈 BỤC HẠNG 2: Á KHOA 1 (TRÁI) */}
                        <div className="flex flex-col items-center text-center">
                          {bannerTopCandidates[1] ? (
                            <>
                              <div className="relative mb-1.5">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-slate-300/80">
                                  {bannerTopCandidates[1].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute -top-1 -right-1 text-xs">🥈</span>
                              </div>
                              <h5 className="font-serif font-bold text-[11px] sm:text-xs text-white truncate max-w-[85px] sm:max-w-[105px]" title={bannerTopCandidates[1].studentName}>
                                {bannerTopCandidates[1].studentName}
                              </h5>
                              <span className="text-[10px] text-slate-300 font-medium block truncate max-w-[80px]">
                                Lớp {bannerTopCandidates[1].studentClass}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-slate-200 mb-1.5 block">
                                {getStandardizedScore10(bannerTopCandidates[1])}đ • {formatTime(bannerTopCandidates[1].timeSpentSeconds)}
                              </span>
                            </>
                          ) : (
                            <div className="h-16 flex flex-col items-center justify-center text-[10px] text-white/40 italic">
                              <span>🥈</span>
                              <span>Chờ Á khoa 1</span>
                            </div>
                          )}
                          <div className="w-full h-11 sm:h-13 bg-gradient-to-t from-slate-700/80 via-slate-500/50 to-slate-400/40 border-t-2 border-l border-r border-slate-300/80 rounded-t-xl flex flex-col items-center justify-center shadow-md">
                            <span className="font-serif font-black text-xs sm:text-sm text-slate-100 drop-shadow">2</span>
                            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider">Á KHOA</span>
                          </div>
                        </div>

                        {/* 🥇 BỤC HẠNG 1: THỦ KHOA (GIỮA, CAO NHẤT) */}
                        <div className="flex flex-col items-center text-center">
                          {bannerTopCandidates[0] ? (
                            <>
                              <div className="relative mb-1.5">
                                <span className="text-sm sm:text-base block -mb-0.5 animate-bounce">👑</span>
                                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-heritage-gold-300 via-amber-400 to-heritage-gold-500 text-heritage-red-950 font-black text-sm sm:text-base flex items-center justify-center shadow-lg ring-3 ring-heritage-gold-300">
                                  {bannerTopCandidates[0].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute bottom-0 right-0 text-xs">🥇</span>
                              </div>
                              <h5 className="font-serif font-black text-xs sm:text-sm text-amber-200 truncate max-w-[95px] sm:max-w-[120px]" title={bannerTopCandidates[0].studentName}>
                                {bannerTopCandidates[0].studentName}
                              </h5>
                              <span className="text-[10px] text-amber-100 font-bold block truncate max-w-[90px]">
                                Lớp {bannerTopCandidates[0].studentClass}
                              </span>
                              <span className="font-mono text-xs font-black text-heritage-gold-300 mb-1.5 block">
                                {getStandardizedScore10(bannerTopCandidates[0])} Điểm ({bannerTopCandidates[0].score}/{bannerTopCandidates[0].totalQuestions}c)
                              </span>
                            </>
                          ) : (
                            <div className="h-20 flex flex-col items-center justify-center text-[10px] text-white/40 italic">
                              <span>🥇</span>
                              <span>Chờ Thủ khoa</span>
                            </div>
                          )}
                          <div className="w-full h-16 sm:h-18 bg-gradient-to-t from-amber-700/90 via-heritage-gold-500/60 to-heritage-gold-400/70 border-t-2 border-l border-r border-heritage-gold-300 rounded-t-xl flex flex-col items-center justify-center shadow-xl">
                            <span className="font-serif font-black text-sm sm:text-base text-white drop-shadow">1</span>
                            <span className="text-[8px] sm:text-[9px] uppercase font-black text-heritage-red-950 bg-heritage-gold-300 px-1.5 py-0.2 rounded-full tracking-wider">THỦ KHOA</span>
                          </div>
                        </div>

                        {/* 🥉 BỤC HẠNG 3: Á KHOA 2 (PHẢI) */}
                        <div className="flex flex-col items-center text-center">
                          {bannerTopCandidates[2] ? (
                            <>
                              <div className="relative mb-1.5">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-amber-600/80">
                                  {bannerTopCandidates[2].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute -top-1 -right-1 text-xs">🥉</span>
                              </div>
                              <h5 className="font-serif font-bold text-[11px] sm:text-xs text-white truncate max-w-[85px] sm:max-w-[105px]" title={bannerTopCandidates[2].studentName}>
                                {bannerTopCandidates[2].studentName}
                              </h5>
                              <span className="text-[10px] text-amber-200/90 font-medium block truncate max-w-[80px]">
                                Lớp {bannerTopCandidates[2].studentClass}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-amber-300 mb-1.5 block">
                                {getStandardizedScore10(bannerTopCandidates[2])}đ • {formatTime(bannerTopCandidates[2].timeSpentSeconds)}
                              </span>
                            </>
                          ) : (
                            <div className="h-16 flex flex-col items-center justify-center text-[10px] text-white/40 italic">
                              <span>🥉</span>
                              <span>Chờ Á khoa 2</span>
                            </div>
                          )}
                          <div className="w-full h-8 sm:h-10 bg-gradient-to-t from-amber-900/90 via-amber-800/60 to-amber-700/50 border-t-2 border-l border-r border-amber-500/80 rounded-t-xl flex flex-col items-center justify-center shadow-md">
                            <span className="font-serif font-black text-xs sm:text-sm text-amber-100 drop-shadow">3</span>
                            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-300 tracking-wider">HẠNG 3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-heritage-gold-200/80">
                      Hội thi đã sẵn sàng! Hãy là thí sinh đầu tiên ghi danh lên Bảng Vàng danh dự.
                    </div>
                  )}
                </div>

                {/* Tóm tắt phong trào các chi đội lớp */}
                <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-heritage-gold-200">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-heritage-gold-400" />
                    <span>Đã nộp: <strong className="text-white font-bold">{activeContestSubmissionsCount} bài</strong></span>
                  </div>
                  {classLeaderboard.length > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <Medal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Top 1 Lớp: <strong className="text-amber-300 font-bold">Lớp {classLeaderboard[0].className}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900 whitespace-nowrap">
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
                {classesList.map((cls) => (
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
            {activeExamQuestions.map((_, idx) => {
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
          {activeExamQuestions[currentQuestionIdx] && (
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-heritage-ivory-300 shadow-sm mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-heritage-red-700 mb-3">
                <span>Câu hỏi {currentQuestionIdx + 1} / {activeExamQuestions.length}</span>
                <span className="text-heritage-ink-500 font-normal">
                  {answers[currentQuestionIdx] !== undefined ? '✓ Đã chọn đáp án' : 'Chưa chọn'}
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-xl font-bold text-heritage-ink-900 leading-relaxed mb-6">
                {activeExamQuestions[currentQuestionIdx].question}
              </h3>

              {/* Lựa chọn A, B, C, D */}
              <div className="space-y-3">
                {activeExamQuestions[currentQuestionIdx].options.map((opt, optIdx) => {
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
              {currentQuestionIdx < activeExamQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((p) => Math.min(activeExamQuestions.length - 1, p + 1))}
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

          {/* Hộp điểm số & Thứ hạng thi đua */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            <div className="p-3.5 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-[11px] text-heritage-ink-500 font-bold uppercase tracking-wider block">Điểm thang 10</span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-heritage-red-700 block mt-0.5">
                {getStandardizedScore10(latestSubmission)}
                <span className="text-xs text-heritage-ink-400 font-normal ml-0.5">/ 10</span>
              </span>
              <span className="text-[10px] text-heritage-ink-500 font-medium">
                {latestSubmission.score}/{latestSubmission.totalQuestions} câu đúng
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-[11px] text-heritage-ink-500 font-bold uppercase tracking-wider block">Thời gian thi</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-heritage-ink-900 block mt-0.5">
                {formatTime(latestSubmission.timeSpentSeconds)}
              </span>
              <span className="text-[10px] text-heritage-ink-500 font-medium">
                {latestSubmission.submittedAt}
              </span>
            </div>

            <div className="p-3.5 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-heritage-gold-400 shadow-sm">
              <span className="text-[11px] text-heritage-red-800 font-black uppercase tracking-wider block">Xếp hạng hiện tại</span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-heritage-red-900 block mt-0.5">
                #{candidateRankInfo?.rank || 1}
              </span>
              <span className="text-[10px] text-heritage-ink-600 font-semibold">
                /{candidateRankInfo?.total || activeLeaderboardSubmissions.length} lượt thi
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-heritage-ivory-300 shadow-sm">
              <span className="text-[11px] text-heritage-ink-500 font-bold uppercase tracking-wider block">Đánh giá</span>
              <span className="font-serif text-base sm:text-lg font-bold text-emerald-700 block mt-1.5">
                {(() => {
                  const s10 = getStandardizedScore10(latestSubmission);
                  return s10 >= 9.99 ? '⭐ Xuất sắc' : s10 >= 8 ? 'Giỏi' : s10 >= 5 ? 'Đạt chuẩn' : 'Cần cố gắng';
                })()}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                {latestSubmission.score >= Math.ceil(latestSubmission.totalQuestions * 0.7) ? 'Đủ đ/k cấp giấy khen' : 'Chưa đạt 70%'}
              </span>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {latestSubmission.score >= Math.ceil(latestSubmission.totalQuestions * 0.7) && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-6 py-3 bg-gradient-to-r from-heritage-gold-500 to-heritage-gold-600 hover:brightness-110 text-heritage-red-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>📜 Xem Giấy Khen Điện Tử</span>
              </button>
            )}

            <button
              onClick={() => {
                if (latestSubmission?.contestId) {
                  setLeaderboardContestId(latestSubmission.contestId);
                }
                setScreen('leaderboard');
              }}
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
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900 whitespace-nowrap">
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

          {/* Chuyển đổi nhanh giữa các Hội thi song song trên Bảng xếp hạng */}
          {activeContests.length > 1 && (
            <div className="mb-6 p-2.5 bg-white/90 border border-heritage-gold-400/60 rounded-2xl flex flex-wrap items-center gap-2 shadow-xs">
              <span className="text-xs font-bold text-heritage-red-950 px-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-heritage-gold-600" />
                <span>Xem điểm Hội thi:</span>
              </span>
              {activeContests.map((c, idx) => {
                const isSelected = c.id === leaderboardContestId;
                const subCount = submissions.filter((s) => s.contestId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setLeaderboardContestId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-heritage-red-700 text-white shadow-sm ring-1 ring-heritage-gold-400'
                        : 'bg-heritage-ivory-100 text-heritage-ink-800 hover:bg-amber-50 border border-heritage-ivory-300'
                    }`}
                  >
                    <span>Hội thi {idx + 1}: {c.targetAudience ? `(${c.targetAudience})` : c.title.slice(0, 25)}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-heritage-gold-400 text-heritage-red-950' : 'bg-heritage-ivory-200 text-heritage-ink-600'
                    }`}>
                      {subCount} bài
                    </span>
                  </button>
                );
              })}
            </div>
          )}

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
            <div className="space-y-4">
              {/* Thanh điều khiển bộ lọc & Tra cứu nhanh cá nhân */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-heritage-ivory-300 shadow-2xs">
                {/* Ô tìm kiếm học sinh / lớp */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-heritage-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leaderboardSearch}
                    onChange={(e) => setLeaderboardSearch(e.target.value)}
                    placeholder="Tìm tên học sinh hoặc lớp..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-heritage-ivory-100 border border-heritage-ivory-300 rounded-xl focus:outline-none focus:border-heritage-red-700 font-medium"
                  />
                  {leaderboardSearch && (
                    <button
                      onClick={() => setLeaderboardSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-heritage-ink-400 hover:text-heritage-ink-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Chế độ gom thành tích: Mỗi em 1 bài cao nhất vs Tất cả lượt thi */}
                  <div className="inline-flex rounded-xl bg-heritage-ivory-200 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLeaderboardFilterMode('best')}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        leaderboardFilterMode === 'best'
                          ? 'bg-heritage-red-700 text-white shadow-2xs'
                          : 'text-heritage-ink-700 hover:text-heritage-red-700'
                      }`}
                      title="Mỗi học sinh chỉ hiển thị 01 bài thi có điểm cao nhất và nhanh nhất"
                    >
                      ⭐ Mỗi em 1 bài cao nhất
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeaderboardFilterMode('all')}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        leaderboardFilterMode === 'all'
                          ? 'bg-heritage-red-700 text-white shadow-2xs'
                          : 'text-heritage-ink-700 hover:text-heritage-red-700'
                      }`}
                      title="Hiển thị toàn bộ các lượt làm bài thi"
                    >
                      📋 Tất cả ({activeLeaderboardSubmissions.length})
                    </button>
                  </div>

                  {/* Chế độ xem Top 10 vs Toàn bộ danh sách */}
                  <button
                    type="button"
                    onClick={() => setLeaderboardViewMode(leaderboardViewMode === 'top10' ? 'all' : 'top10')}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold border border-heritage-ivory-300 bg-white text-heritage-ink-700 hover:bg-heritage-ivory-100 transition"
                  >
                    {leaderboardViewMode === 'top10' ? `Xem tất cả (${processedIndividuals.length})` : 'Chỉ xem Top 10'}
                  </button>
                </div>
              </div>

              {/* Danh sách thí sinh xếp hạng */}
              {displayIndividuals.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-heritage-ivory-300 text-center text-heritage-ink-500 text-xs sm:text-sm">
                  {leaderboardSearch
                    ? `Không tìm thấy thí sinh nào với từ khóa "${leaderboardSearch}"!`
                    : 'Chưa có bài thi nào nộp vào hội thi này. Em hãy là người đầu tiên tham gia!'}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* ========================================================================= */}
                  {/* BỤC VINH DANH TOP 3 XUẤT SẮC NHẤT (CHỈ HIỂN THỊ KHI KHÔNG TÌM KIẾM)        */}
                  {/* ========================================================================= */}
                  {!leaderboardSearch && displayIndividuals.length > 0 && (
                    <div className="bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 p-4 sm:p-5 rounded-3xl border-2 border-heritage-gold-400/80 shadow-md">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-heritage-gold-300/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-heritage-gold-400 text-heritage-red-950 flex items-center justify-center font-bold shadow-xs">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <span className="font-serif font-black text-xs sm:text-sm uppercase tracking-wide text-heritage-red-950">
                            Bục Vinh Danh Top 3 Xuất Sắc Nhất
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-heritage-gold-100 text-heritage-red-950 border border-heritage-gold-300">
                          Thế Hệ Bác Hồ Khuyên
                        </span>
                      </div>

                      {/* Bố cục bục vinh danh 3 cột: Á Khoa 1 (Trái) - Thủ Khoa (Giữa) - Á Khoa 2 (Phải) */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-1 pb-1">
                        {/* 🥈 BỤC HẠNG 2: Á KHOA 1 */}
                        <div className="flex flex-col items-center text-center">
                          {displayIndividuals[1] ? (
                            <>
                              <div className="relative mb-2">
                                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center shadow-md ring-3 ring-slate-300">
                                  {displayIndividuals[1].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute -top-1 -right-1 text-sm">🥈</span>
                              </div>
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-ink-900 truncate max-w-[95px] sm:max-w-[140px]" title={displayIndividuals[1].studentName}>
                                {displayIndividuals[1].studentName}
                              </h4>
                              <span className="text-[10px] sm:text-[11px] text-heritage-ink-600 font-bold block truncate max-w-[90px] sm:max-w-[130px]">
                                Chi đội {displayIndividuals[1].studentClass}
                              </span>
                              <span className="font-mono text-xs font-black text-slate-700 mb-2 block">
                                {getStandardizedScore10(displayIndividuals[1])} Điểm ({formatTime(displayIndividuals[1].timeSpentSeconds)})
                              </span>
                            </>
                          ) : (
                            <div className="h-20 flex flex-col items-center justify-center text-[10px] text-heritage-ink-400 italic">
                              <span>🥈</span>
                              <span>Đang chờ Á khoa 1</span>
                            </div>
                          )}
                          <div className="w-full h-14 sm:h-16 bg-gradient-to-t from-slate-400/80 via-slate-300/60 to-slate-200/50 border-t-2 border-l border-r border-slate-300 rounded-t-2xl flex flex-col items-center justify-center shadow-md">
                            <span className="font-serif font-black text-base sm:text-lg text-slate-800">2</span>
                            <span className="text-[9px] uppercase font-black text-slate-700 tracking-wider">Á KHOA 1</span>
                          </div>
                        </div>

                        {/* 🥇 BỤC HẠNG 1: THỦ KHOA */}
                        <div className="flex flex-col items-center text-center">
                          {displayIndividuals[0] ? (
                            <>
                              <div className="relative mb-2">
                                <span className="text-base sm:text-lg block -mb-0.5 animate-bounce">👑</span>
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-heritage-gold-300 via-amber-400 to-heritage-gold-500 text-heritage-red-950 font-black text-base sm:text-lg flex items-center justify-center shadow-xl ring-4 ring-heritage-gold-400 animate-pulse">
                                  {displayIndividuals[0].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute bottom-0 right-0 text-base">🥇</span>
                              </div>
                              <h4 className="font-serif font-black text-xs sm:text-base text-heritage-red-950 truncate max-w-[105px] sm:max-w-[160px]" title={displayIndividuals[0].studentName}>
                                {displayIndividuals[0].studentName}
                              </h4>
                              <span className="text-[10px] sm:text-[11px] text-heritage-red-800 font-bold block truncate max-w-[100px] sm:max-w-[150px]">
                                Chi đội {displayIndividuals[0].studentClass}
                              </span>
                              <span className="font-mono text-xs sm:text-sm font-black text-heritage-red-700 mb-2 block">
                                {getStandardizedScore10(displayIndividuals[0])} Điểm ({displayIndividuals[0].score}/{displayIndividuals[0].totalQuestions}c • {formatTime(displayIndividuals[0].timeSpentSeconds)})
                              </span>
                            </>
                          ) : (
                            <div className="h-24 flex flex-col items-center justify-center text-[10px] text-heritage-ink-400 italic">
                              <span>🥇</span>
                              <span>Đang chờ Thủ khoa</span>
                            </div>
                          )}
                          <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-500/90 via-heritage-gold-400/80 to-amber-300/80 border-t-2 border-l border-r border-heritage-gold-400 rounded-t-2xl flex flex-col items-center justify-center shadow-xl">
                            <span className="font-serif font-black text-lg sm:text-xl text-heritage-red-950">1</span>
                            <span className="text-[9px] uppercase font-black text-heritage-red-950 bg-white/70 px-2 py-0.5 rounded-full tracking-wider">THỦ KHOA</span>
                          </div>
                        </div>

                        {/* 🥉 BỤC HẠNG 3: Á KHOA 2 */}
                        <div className="flex flex-col items-center text-center">
                          {displayIndividuals[2] ? (
                            <>
                              <div className="relative mb-2">
                                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-100 font-black text-sm sm:text-base flex items-center justify-center shadow-md ring-3 ring-amber-600/80">
                                  {displayIndividuals[2].studentName.trim().split(' ').slice(-1)[0][0]}
                                </div>
                                <span className="absolute -top-1 -right-1 text-sm">🥉</span>
                              </div>
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-ink-900 truncate max-w-[95px] sm:max-w-[140px]" title={displayIndividuals[2].studentName}>
                                {displayIndividuals[2].studentName}
                              </h4>
                              <span className="text-[10px] sm:text-[11px] text-heritage-ink-600 font-bold block truncate max-w-[90px] sm:max-w-[130px]">
                                Chi đội {displayIndividuals[2].studentClass}
                              </span>
                              <span className="font-mono text-xs font-black text-amber-800 mb-2 block">
                                {getStandardizedScore10(displayIndividuals[2])} Điểm ({formatTime(displayIndividuals[2].timeSpentSeconds)})
                              </span>
                            </>
                          ) : (
                            <div className="h-20 flex flex-col items-center justify-center text-[10px] text-heritage-ink-400 italic">
                              <span>🥉</span>
                              <span>Đang chờ Á khoa 2</span>
                            </div>
                          )}
                          <div className="w-full h-11 sm:h-13 bg-gradient-to-t from-amber-700/80 via-amber-600/60 to-amber-500/50 border-t-2 border-l border-r border-amber-600 rounded-t-2xl flex flex-col items-center justify-center shadow-md">
                            <span className="font-serif font-black text-base sm:text-lg text-amber-100">3</span>
                            <span className="text-[9px] uppercase font-black text-amber-100 tracking-wider">Á KHOA 2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* DANH SÁCH BẢNG VÀNG TIẾP THEO (TỪ HẠNG 4 TRỞ ĐI HOẶC KẾT QUẢ TÌM KIẾM)    */}
                  {/* ========================================================================= */}
                  <div className="space-y-2.5">
                    {/* Tiêu đề danh sách tiếp theo nếu có bục vinh danh */}
                    {!leaderboardSearch && displayIndividuals.length > 3 && (
                      <div className="flex items-center space-x-2 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-heritage-red-800">
                        <Sparkles className="w-3.5 h-3.5 text-heritage-gold-600" />
                        <span>Danh Sách Thí Sinh Tiếp Theo (Từ Hạng 4)</span>
                      </div>
                    )}

                    {(!leaderboardSearch ? displayIndividuals.slice(3) : displayIndividuals).map((sub, listIdx) => {
                      const actualRank = !leaderboardSearch ? listIdx + 4 : listIdx + 1;
                      const isMyRecentSub = latestSubmission && sub.id === latestSubmission.id;
                      const s10 = getStandardizedScore10(sub);

                      return (
                        <div
                          key={sub.id}
                          className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                            isMyRecentSub
                              ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-white border-2 border-heritage-gold-500 shadow-md ring-2 ring-heritage-gold-400/50'
                              : 'bg-white border-heritage-ivory-300 hover:border-heritage-gold-400 shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5 min-w-0">
                            {/* Vị trí xếp hạng */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                              isMyRecentSub
                                ? 'bg-heritage-red-700 text-white shadow'
                                : 'bg-heritage-ivory-200 text-heritage-ink-800 font-mono'
                            }`}>
                              #{actualRank}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-serif text-xs sm:text-sm font-bold text-heritage-ink-900 truncate">
                                  {sub.studentName}
                                </h4>
                                {isMyRecentSub && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-heritage-gold-400 text-heritage-red-950 flex-shrink-0 animate-pulse">
                                    Bài thi của em
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-heritage-ink-500 font-medium mt-0.5">
                                Chi đội Lớp {sub.studentClass} • Nộp lúc {sub.submittedAt}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="font-serif font-black text-sm sm:text-base text-heritage-red-700 block">
                              {s10} điểm
                            </span>
                            <span className="text-[11px] text-heritage-ink-600 block">
                              {sub.score}/{sub.totalQuestions} câu • ⏱️ {formatTime(sub.timeSpentSeconds)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Thông báo vị trí nếu bài thi vừa nộp nằm ngoài Top 10 đang xem */}
              {latestSubmission && candidateRankInfo && candidateRankInfo.rank > 10 && leaderboardViewMode === 'top10' && !leaderboardSearch && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-heritage-ivory-100 border-2 border-heritage-gold-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-heritage-red-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      #{candidateRankInfo.rank}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif font-bold text-xs sm:text-sm text-heritage-red-950">
                          {latestSubmission.studentName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-gold-400 text-heritage-red-950">
                          Bài vừa nộp của em
                        </span>
                      </div>
                      <p className="text-[11px] text-heritage-ink-600 mt-0.5">
                        Em đạt <strong>{getStandardizedScore10(latestSubmission)} điểm</strong> ({latestSubmission.score}/{latestSubmission.totalQuestions} câu đúng) • Chi đội Lớp {latestSubmission.studentClass}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setLeaderboardViewMode('all')}
                    className="px-3.5 py-1.5 bg-heritage-red-700 hover:bg-heritage-red-800 text-white font-bold text-xs rounded-xl transition self-start sm:self-auto shadow-2xs whitespace-nowrap"
                  >
                    Xem vị trí trong toàn bộ bảng điểm →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BẢNG XẾP HẠNG THI ĐUA CHI ĐỘI LỚP */}
          {leaderboardTab === 'class' && (
            <div className="space-y-4">
              {/* Bộ lọc sắp xếp thi đua chi đội */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-heritage-ivory-300 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-ink-700 flex items-center space-x-1">
                  <Filter className="w-3.5 h-3.5 text-heritage-red-700" />
                  <span>Tiêu chí xếp hạng chi đội:</span>
                </span>

                <div className="inline-flex rounded-xl bg-heritage-ivory-200 p-0.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setClassSortMode('movement')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      classSortMode === 'movement'
                        ? 'bg-heritage-red-700 text-white shadow-2xs'
                        : 'text-heritage-ink-700 hover:text-heritage-red-700'
                    }`}
                    title="Xếp theo điểm phong trào toàn diện (kết hợp ĐTB, số lượng học sinh tham gia và số điểm 10)"
                  >
                    🏆 Phong trào toàn diện
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassSortMode('avg')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      classSortMode === 'avg'
                        ? 'bg-heritage-red-700 text-white shadow-2xs'
                        : 'text-heritage-ink-700 hover:text-heritage-red-700'
                    }`}
                    title="Xếp theo Điểm trung bình (ĐTB) cao nhất"
                  >
                    📈 Điểm trung bình (ĐTB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassSortMode('participants')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      classSortMode === 'participants'
                        ? 'bg-heritage-red-700 text-white shadow-2xs'
                        : 'text-heritage-ink-700 hover:text-heritage-red-700'
                    }`}
                    title="Xếp theo số lượng học sinh tham gia đông nhất"
                  >
                    👥 Sĩ số tham gia
                  </button>
                </div>
              </div>

              {/* Danh sách lớp thi đua */}
              <div className="space-y-2.5">
                {classLeaderboard.map((cls, idx) => (
                  <div
                    key={cls.className}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-heritage-ivory-300 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className={`w-8 h-8 rounded-full font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-orange-300 text-orange-950'
                          : 'bg-heritage-ivory-200 text-heritage-ink-700'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-heritage-ink-900 truncate">
                          Chi đội Lớp {cls.className}
                        </h4>
                        <p className="text-[11px] text-heritage-ink-500 mt-0.5">
                          {cls.participantsCount} học sinh tham gia ({cls.submissionsCount} lượt nộp) • {cls.perfectCount} điểm 10 tuyệt đối
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="font-serif font-black text-sm text-heritage-gold-700 block">
                        ĐTB: {cls.avgScore} / 10
                      </span>
                      <span className="text-[10px] text-heritage-red-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-heritage-gold-300 block mt-0.5">
                        {cls.movementScore} điểm thi đua
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
              <p className="text-xs font-serif italic text-heritage-gold-600 font-semibold max-w-lg mx-auto">
                Đạt thành tích xuất sắc trong: {contestsList.find((c) => c.id === latestSubmission?.contestId)?.title || contestInfo.title}
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
