import React, { useState } from 'react';
import { learningTopics, quizQuestions, dailyPractices } from '../data/learningData';
import { LearningTopic } from '../types';
import { Award, BookOpen, CheckCircle, HelpCircle, ChevronRight, RotateCcw, Sparkles, CheckSquare, Square, XCircle, Trophy } from 'lucide-react';
import { OnlineContest } from './OnlineContest';

export const LearningCorner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'quiz' | 'contest' | 'practices'>('contest');
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic>(learningTopics[0]);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Daily practices checked state
  const [checkedPractices, setCheckedPractices] = useState<Record<string, boolean>>({
    'p-1': true,
  });

  const togglePractice = (id: string) => {
    setCheckedPractices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentQuestion = quizQuestions[currentQuizIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuizIdx]: idx }));
  };

  const handleCheckAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let score = 0;
      quizQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });
      setQuizScore(score);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setQuizScore(null);
  };

  return (
    <section id="learning" className="py-8 sm:py-10 md:py-12 bg-white border-b border-heritage-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Nâng cấp nhận diện trang trọng, uy nghiêm */}
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-heritage-red-700 font-bold bg-heritage-red-50 px-3.5 py-1.5 rounded-full border border-heritage-red-200 mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-heritage-red-700" />
            <span>KHÔNG GIAN RÈN ĐỨC LUYỆN TÀI • TRƯỜNG THCS NGUYỄN TRUNG TRỰC</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-heritage-ink-950 tracking-tight whitespace-nowrap drop-shadow-2xs">
            Góc Học Tập & Rèn Luyện
          </h2>

          {/* Dải hoa văn di sản đối xứng tinh tế */}
          <div className="flex items-center justify-center space-x-2.5 my-3.5" aria-hidden="true">
            <div className="w-8 sm:w-14 h-0.5 bg-gradient-to-r from-transparent to-heritage-gold-400 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-heritage-gold-500 ring-2 ring-heritage-gold-200" />
            <div className="w-8 sm:w-14 h-0.5 bg-gradient-to-l from-transparent to-heritage-gold-400 rounded-full" />
          </div>

          <p className="mt-2 text-sm sm:text-base md:text-lg text-heritage-ink-700 leading-relaxed max-w-3xl mx-auto">
            Nơi các em học sinh trường THCS Nguyễn Trung Trực cùng tìm hiểu các bài học giản dị mà sâu sắc
            của Bác, thực hành việc tốt mỗi ngày và thử tài tri thức lịch sử.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION: 4 THẺ TƯƠNG TÁC HỌC TẬP (INTERACTIVE BENTO CARDS GRID)         */}
        {/* ========================================================================= */}
        <div 
          role="tablist" 
          aria-label="Các phân khu chức năng Góc học tập và rèn luyện"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8"
        >
          {/* THẺ 1: HỘI THI & BẢNG XẾP HẠNG */}
          <button
            role="tab"
            aria-selected={activeTab === 'contest'}
            aria-controls="panel-contest"
            onClick={() => setActiveTab('contest')}
            className={`text-left p-3.5 sm:p-4.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-400 focus-visible:ring-offset-2 select-none ${
              activeTab === 'contest'
                ? 'bg-gradient-to-br from-[#7a121f] via-[#630d17] to-[#450810] text-white border-heritage-gold-400 shadow-xl shadow-heritage-red-950/25 ring-2 ring-heritage-gold-400/40 -translate-y-0.5'
                : 'bg-heritage-ivory-100 hover:bg-white text-heritage-ink-900 border-heritage-ivory-300 hover:border-heritage-gold-400 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                  activeTab === 'contest'
                    ? 'bg-gradient-to-br from-heritage-gold-300 to-heritage-gold-500 text-heritage-red-950'
                    : 'bg-heritage-red-50 text-heritage-red-700 group-hover:bg-heritage-red-100'
                }`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  activeTab === 'contest'
                    ? 'bg-heritage-gold-400 text-heritage-red-950 animate-pulse'
                    : 'bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300'
                }`}>
                  Thi đua
                </span>
              </div>

              <h3 className={`font-serif font-black text-sm sm:text-base leading-snug line-clamp-1 ${
                activeTab === 'contest' ? 'text-heritage-ivory-50' : 'text-heritage-ink-950'
              }`}>
                Hội Thi Trực Tuyến
              </h3>

              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed line-clamp-2 ${
                activeTab === 'contest' ? 'text-heritage-gold-100/90' : 'text-heritage-ink-600'
              }`}>
                Đợt thi đua rèn đức luyện tài & Bảng Vàng vinh danh
              </p>
            </div>

            {activeTab === 'contest' && (
              <div className="w-8 h-1 bg-heritage-gold-400 rounded-full mt-3" aria-hidden="true" />
            )}
          </button>

          {/* THẺ 2: 5 ĐIỀU BÁC DẠY */}
          <button
            role="tab"
            aria-selected={activeTab === 'topics'}
            aria-controls="panel-topics"
            onClick={() => setActiveTab('topics')}
            className={`text-left p-3.5 sm:p-4.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-400 focus-visible:ring-offset-2 select-none ${
              activeTab === 'topics'
                ? 'bg-gradient-to-br from-[#7a121f] via-[#630d17] to-[#450810] text-white border-heritage-gold-400 shadow-xl shadow-heritage-red-950/25 ring-2 ring-heritage-gold-400/40 -translate-y-0.5'
                : 'bg-heritage-ivory-100 hover:bg-white text-heritage-ink-900 border-heritage-ivory-300 hover:border-heritage-gold-400 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                  activeTab === 'topics'
                    ? 'bg-gradient-to-br from-heritage-gold-300 to-heritage-gold-500 text-heritage-red-950'
                    : 'bg-heritage-red-50 text-heritage-red-700 group-hover:bg-heritage-red-100'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'topics'
                    ? 'bg-white/20 text-heritage-gold-200'
                    : 'bg-heritage-ivory-200 text-heritage-ink-700'
                }`}>
                  5 Chuyên đề
                </span>
              </div>

              <h3 className={`font-serif font-black text-sm sm:text-base leading-snug line-clamp-1 ${
                activeTab === 'topics' ? 'text-heritage-ivory-50' : 'text-heritage-ink-950'
              }`}>
                5 Điều Bác Hồ Dạy
              </h3>

              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed line-clamp-2 ${
                activeTab === 'topics' ? 'text-heritage-gold-100/90' : 'text-heritage-ink-600'
              }`}>
                Chương trình rèn luyện Đội viên TNTP Hồ Chí Minh
              </p>
            </div>

            {activeTab === 'topics' && (
              <div className="w-8 h-1 bg-heritage-gold-400 rounded-full mt-3" aria-hidden="true" />
            )}
          </button>

          {/* THẺ 3: MINI QUIZ */}
          <button
            role="tab"
            aria-selected={activeTab === 'quiz'}
            aria-controls="panel-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`text-left p-3.5 sm:p-4.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-400 focus-visible:ring-offset-2 select-none ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-br from-[#7a121f] via-[#630d17] to-[#450810] text-white border-heritage-gold-400 shadow-xl shadow-heritage-red-950/25 ring-2 ring-heritage-gold-400/40 -translate-y-0.5'
                : 'bg-heritage-ivory-100 hover:bg-white text-heritage-ink-900 border-heritage-ivory-300 hover:border-heritage-gold-400 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-br from-heritage-gold-300 to-heritage-gold-500 text-heritage-red-950'
                    : 'bg-heritage-red-50 text-heritage-red-700 group-hover:bg-heritage-red-100'
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'quiz'
                    ? 'bg-white/20 text-heritage-gold-200'
                    : 'bg-heritage-ivory-200 text-heritage-ink-700'
                }`}>
                  Tự rèn luyện
                </span>
              </div>

              <h3 className={`font-serif font-black text-sm sm:text-base leading-snug line-clamp-1 ${
                activeTab === 'quiz' ? 'text-heritage-ivory-50' : 'text-heritage-ink-950'
              }`}>
                Luyện Tập Mini-Quiz
              </h3>

              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed line-clamp-2 ${
                activeTab === 'quiz' ? 'text-heritage-gold-100/90' : 'text-heritage-ink-600'
              }`}>
                Thử tài nhanh tri thức lịch sử Bác Hồ & nhà trường
              </p>
            </div>

            {activeTab === 'quiz' && (
              <div className="w-8 h-1 bg-heritage-gold-400 rounded-full mt-3" aria-hidden="true" />
            )}
          </button>

          {/* THẺ 4: VIỆC TỐT MỖI NGÀY */}
          <button
            role="tab"
            aria-selected={activeTab === 'practices'}
            aria-controls="panel-practices"
            onClick={() => setActiveTab('practices')}
            className={`text-left p-3.5 sm:p-4.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold-400 focus-visible:ring-offset-2 select-none ${
              activeTab === 'practices'
                ? 'bg-gradient-to-br from-[#7a121f] via-[#630d17] to-[#450810] text-white border-heritage-gold-400 shadow-xl shadow-heritage-red-950/25 ring-2 ring-heritage-gold-400/40 -translate-y-0.5'
                : 'bg-heritage-ivory-100 hover:bg-white text-heritage-ink-900 border-heritage-ivory-300 hover:border-heritage-gold-400 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                  activeTab === 'practices'
                    ? 'bg-gradient-to-br from-heritage-gold-300 to-heritage-gold-500 text-heritage-red-950'
                    : 'bg-heritage-red-50 text-heritage-red-700 group-hover:bg-heritage-red-100'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'practices'
                    ? 'bg-white/20 text-heritage-gold-200'
                    : 'bg-heritage-ivory-200 text-heritage-ink-700'
                }`}>
                  Nhật ký
                </span>
              </div>

              <h3 className={`font-serif font-black text-sm sm:text-base leading-snug line-clamp-1 ${
                activeTab === 'practices' ? 'text-heritage-ivory-50' : 'text-heritage-ink-950'
              }`}>
                Việc Tốt Mỗi Ngày
              </h3>

              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed line-clamp-2 ${
                activeTab === 'practices' ? 'text-heritage-gold-100/90' : 'text-heritage-ink-600'
              }`}>
                Đánh dấu những hành động đẹp làm theo lời Bác dạy
              </p>
            </div>

            {activeTab === 'practices' && (
              <div className="w-8 h-1 bg-heritage-gold-400 rounded-full mt-3" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* TAB 0: HỘI THI TRỰC TUYẾN & BẢNG XẾP HẠNG HỌC ĐƯỜNG */}
        {activeTab === 'contest' && (
          <div id="panel-contest" role="tabpanel" aria-label="Hội thi trực tuyến và Bảng xếp hạng">
            <OnlineContest />
          </div>
        )}

        {/* TAB 1: TOPICS */}
        {activeTab === 'topics' && (
          <div id="panel-topics" role="tabpanel" aria-label="5 Điều Bác Hồ Dạy" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left list */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-heritage-red-700 mb-3 px-1">
                Danh sách chuyên đề rèn luyện
              </h3>
              {learningTopics.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-heritage-red-700 text-white border-heritage-red-700 shadow-md font-semibold'
                        : 'bg-heritage-ivory-100 text-heritage-ink-800 border-heritage-ivory-300 hover:bg-white hover:border-heritage-gold-400'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-bold leading-snug">
                        {topic.title}
                      </h4>
                      <p className={`text-xs sm:text-sm mt-1 truncate ${isSelected ? 'text-heritage-gold-200' : 'text-heritage-ink-500'}`}>
                        {topic.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-heritage-gold-300' : 'text-heritage-ink-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Topic Detail Card */}
            <div className="lg:col-span-8 bg-heritage-ivory-100 rounded-2xl p-6 sm:p-8 md:p-10 border border-heritage-gold-400/40 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-heritage-ivory-300 mb-6">
                <span className="text-xs sm:text-sm font-bold px-3.5 py-1 bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300 rounded-full">
                  Đối tượng: {selectedTopic.targetAudience}
                </span>
                <span className="text-xs sm:text-sm text-heritage-ink-600 font-medium">
                  Chương trình rèn luyện đội viên
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-heritage-ink-900 mb-2 leading-tight">
                {selectedTopic.title}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-heritage-red-700 mb-6">
                {selectedTopic.subtitle}
              </p>

              {/* Quote block */}
              <blockquote className="p-4 sm:p-5 rounded-xl bg-white border-l-4 border-heritage-gold-400 italic text-heritage-ink-900 text-sm sm:text-base font-serif mb-6 shadow-sm leading-relaxed">
                {selectedTopic.quote}
              </blockquote>

              {/* Core Content */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-heritage-ink-900">
                  Nội dung cốt lõi & Ý nghĩa:
                </h4>
                <div className="space-y-2.5">
                  {selectedTopic.content.map((p, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-sm sm:text-base text-heritage-ink-800">
                      <span className="w-2 h-2 rounded-full bg-heritage-red-700 mt-2 flex-shrink-0" />
                      <p className="leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action advice */}
              <div className="p-4 sm:p-5 rounded-xl bg-heritage-red-50 border border-heritage-red-200">
                <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-heritage-red-700 mb-2.5 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-red-700 flex-shrink-0" />
                  <span>Học sinh THCS Nguyễn Trung Trực vận dụng mỗi ngày:</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-heritage-ink-900">
                  {selectedTopic.actionAdvice.map((adv, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="text-heritage-gold-600 font-bold text-sm sm:text-base">✓</span>
                      <span className="leading-relaxed">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MINI QUIZ */}
        {activeTab === 'quiz' && (
          <div id="panel-quiz" role="tabpanel" aria-label="Luyện tập Mini-Quiz" className="max-w-4xl mx-auto bg-heritage-ivory-100 rounded-2xl p-6 sm:p-8 md:p-10 border border-heritage-gold-400/50 shadow-md">
            {quizScore === null ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-heritage-ivory-300 mb-6">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs sm:text-sm font-bold px-3 py-1 bg-heritage-red-700 text-white rounded">
                      Câu {currentQuizIdx + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-xs sm:text-sm text-heritage-ink-600 font-medium">
                      Trắc nghiệm lịch sử THCS
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-heritage-gold-600 font-bold">
                    Đã chọn: {selectedAnswers[currentQuizIdx] !== undefined ? '1 lựa chọn' : 'Chưa chọn'}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-heritage-ink-900 mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3.5 mb-6">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQuizIdx] === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let btnStyle = 'bg-white border-heritage-ivory-300 text-heritage-ink-800 hover:border-heritage-gold-400';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                      } else {
                        btnStyle = 'bg-white/60 opacity-60 border-heritage-ivory-300';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-heritage-red-50 border-heritage-red-700 text-heritage-red-900 font-semibold shadow-sm';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        aria-label={`Lựa chọn ${String.fromCharCode(65 + idx)}: ${opt}${
                          isAnswerSubmitted
                            ? isCorrect
                              ? ' (Đáp án đúng)'
                              : isSelected
                              ? ' (Bạn đã chọn - Chưa chính xác)'
                              : ''
                            : isSelected
                            ? ' (Đang chọn)'
                            : ''
                        }`}
                        className={`w-full text-left p-4 sm:p-4.5 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>
                        {isAnswerSubmitted && (
                          isCorrect ? (
                            <span className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs sm:text-sm flex-shrink-0">
                              <span className="hidden sm:inline">Chính xác</span>
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </span>
                          ) : isSelected ? (
                            <span className="flex items-center space-x-1.5 text-red-700 font-bold text-xs sm:text-sm flex-shrink-0">
                              <span className="hidden sm:inline">Chưa đúng</span>
                              <XCircle className="w-5 h-5 text-red-600" />
                            </span>
                          ) : null
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback explanation after check */}
                {isAnswerSubmitted && (
                  <div className={`p-4 sm:p-5 rounded-xl mb-6 text-sm sm:text-base leading-relaxed border ${
                    selectedAnswers[currentQuizIdx] === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <p className="font-bold mb-1 text-sm sm:text-base">
                      {selectedAnswers[currentQuizIdx] === currentQuestion.correctIndex
                        ? '🎉 Rất xuất sắc!'
                        : '💡 Gợi ý học tập:'}
                    </p>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-heritage-ivory-300">
                  <span className="text-xs sm:text-sm text-heritage-ink-500 font-medium">
                    Học tập theo tư tưởng Bác Hồ
                  </span>
                  <div>
                    {!isAnswerSubmitted ? (
                      <button
                        disabled={selectedAnswers[currentQuizIdx] === undefined}
                        onClick={handleCheckAnswer}
                        className="px-6 py-3 bg-heritage-red-700 hover:bg-heritage-red-800 disabled:opacity-50 text-white rounded-lg font-bold text-sm sm:text-base transition-all"
                      >
                        Kiểm tra câu trả lời
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-3 bg-heritage-gold-500 hover:bg-heritage-gold-600 text-heritage-red-950 font-bold rounded-lg text-sm sm:text-base transition-all flex items-center space-x-1.5"
                      >
                        <span>{currentQuizIdx < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Quiz Result Screen */
              <div className="text-center py-6 sm:py-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-heritage-gold-100 text-heritage-gold-600 mx-auto flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-ink-900 mb-2">
                  Hoàn Thành Thử Tài Lịch Sử!
                </h3>
                <p className="text-base sm:text-lg text-heritage-ink-700 mb-6">
                  Bạn đã trả lời đúng <strong className="text-heritage-red-700 text-2xl font-bold">{quizScore}</strong> / {quizQuestions.length} câu hỏi.
                </p>

                <div className="p-5 bg-white rounded-xl border border-heritage-ivory-300 mb-6 text-sm sm:text-base text-heritage-ink-800 leading-relaxed max-w-lg mx-auto">
                  {quizScore === 5 ? (
                    'Tuyệt vời! Bạn có vốn hiểu biết rất sâu sắc và vững vàng về Chủ tịch Hồ Chí Minh và ngôi trường THCS Nguyễn Trung Trực.'
                  ) : quizScore >= 3 ? (
                    'Khá tốt! Bạn đã nắm được những mốc lịch sử cốt lõi. Hãy ghé thăm Kho tư liệu để tìm hiểu thêm nhiều câu chuyện thú vị nữa nhé!'
                  ) : (
                    'Cố gắng lên nhé! Hãy dành thời gian đọc lại các mốc thời gian lịch sử trong mục Chủ tịch Hồ Chí Minh để tự tin làm lại nào!'
                  )}
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="px-7 py-3.5 bg-heritage-red-700 text-white font-bold rounded-lg text-sm sm:text-base hover:bg-heritage-red-800 transition-colors inline-flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Làm lại bài trắc nghiệm</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DAILY PRACTICES */}
        {activeTab === 'practices' && (
          <div id="panel-practices" role="tabpanel" aria-label="Việc tốt mỗi ngày" className="max-w-4xl mx-auto">
            <div className="bg-heritage-ivory-100 rounded-2xl p-6 sm:p-8 md:p-10 border border-heritage-ivory-300">
              <div className="text-center mb-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-ink-900">
                  Nhật Ký "Việc Tốt Mỗi Ngày Làm Theo Lời Bác"
                </h3>
                <p className="text-xs sm:text-sm text-heritage-ink-600 mt-1.5">
                  Đánh dấu các việc tốt bạn đã hoàn thành hôm nay tại trường THCS Nguyễn Trung Trực hoặc ở nhà!
                </p>
              </div>

              <div className="space-y-3.5">
                {dailyPractices.map((p) => {
                  const isChecked = checkedPractices[p.id];
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePractice(p.id)}
                      className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-all flex items-start space-x-3.5 ${
                        isChecked
                          ? 'bg-white border-heritage-gold-400 shadow-sm'
                          : 'bg-white/70 border-heritage-ivory-300 hover:bg-white'
                      }`}
                    >
                      <button className="mt-0.5 text-heritage-red-700 focus:outline-none">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-heritage-red-700" />
                        ) : (
                          <Square className="w-5 h-5 sm:w-6 sm:h-6 text-heritage-ink-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2.5">
                          <h4 className={`text-sm sm:text-base font-bold ${isChecked ? 'text-heritage-ink-900' : 'text-heritage-ink-700'}`}>
                            {p.title}
                          </h4>
                          <span className="px-2.5 py-0.5 text-xs bg-heritage-red-100 text-heritage-red-800 rounded font-semibold">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-heritage-ink-600 mt-1 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-heritage-gold-100/70 border border-heritage-gold-300 text-xs sm:text-sm text-heritage-red-950 text-center leading-relaxed font-medium">
                <strong>Lời Bác dạy:</strong> "Mỗi người tốt, mỗi việc tốt là một bông hoa đẹp, cả dân tộc ta là một rừng hoa đẹp."
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
