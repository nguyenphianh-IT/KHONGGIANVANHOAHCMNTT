import React, { useEffect } from 'react';
import { Bot, Sparkles, X, ShieldAlert, Cpu, MessageSquare } from 'lucide-react';

interface ChatbotPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ isOpen, onClose, onOpen }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const upcomingFeatures = [
    {
      title: 'Hỏi đáp tri thức lịch sử chuẩn xác',
      desc: 'Giải đáp các thắc mắc về cuộc đời, sự nghiệp của Bác Hồ dựa trên nguồn sử liệu đã kiểm chứng.'
    },
    {
      title: 'Gợi ý bài học đạo đức học đường',
      desc: 'Tư vấn tình huống thực tế giúp học sinh THCS vận dụng 5 Điều Bác dạy vào cuộc sống hàng ngày.'
    },
    {
      title: 'Hỗ trợ tra cứu tài liệu học tập',
      desc: 'Giúp học sinh và giáo viên nhanh chóng tìm thấy các tác phẩm văn học, bài thơ, thước phim phù hợp bài giảng.'
    }
  ];

  const sampleQuestions = [
    'Bác Hồ dạy thiếu nhi điều gì về tinh thần kỷ luật và đoàn kết?',
    'Ý nghĩa của bản Tuyên ngôn Độc lập ngày 2/9/1945 là gì?',
    'Kể cho em một câu chuyện giản dị về lối sống tiết kiệm của Bác Hồ?',
    'Làm thế nào để học sinh lớp 8 rèn luyện tinh thần tự học theo gương Bác?'
  ];

  return (
    <>
      {/* Floating Action Button - Tối ưu kích thước gọn gàng, không che khuất nội dung trang */}
      <div className="fixed bottom-[4.25rem] right-3 sm:bottom-[4.5rem] sm:right-3.5 xl:bottom-6 xl:right-5 2xl:right-8 z-40">
        <button
          onClick={onOpen}
          className="group relative flex items-center justify-center p-2.5 min-[1440px]:px-4 min-[1440px]:py-2.5 rounded-full bg-gradient-to-r from-heritage-red-700 to-heritage-red-900 text-white shadow-xl hover:shadow-heritage-gold-400/30 border-2 border-heritage-gold-400 hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Mở thông tin Bạn đồng hành văn hóa Hồ Chí Minh"
          title="Bạn đồng hành văn hóa Hồ Chí Minh"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-heritage-gold-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-heritage-gold-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-heritage-gold-500" />
            </span>
          </div>

          <div className="text-left hidden min-[1440px]:flex items-center ml-2">
            <span className="text-xs font-bold font-serif text-heritage-ivory-50 whitespace-nowrap">
              Bạn đồng hành AI
            </span>
          </div>
        </button>
      </div>

      {/* Modal giới thiệu lộ trình Chatbot RAG (Giai đoạn 2) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-heritage-gold-400 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-dialog-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-heritage-ivory-300">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-heritage-red-700 text-heritage-gold-300 border border-heritage-gold-400 flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-heritage-gold-100 text-heritage-red-900 border border-heritage-gold-300 text-[11px] font-bold rounded">
                    <Sparkles className="w-3 h-3 text-heritage-gold-600" />
                    <span>Dự án Giai đoạn 2 • Đang phát triển</span>
                  </div>
                  <h3 id="chatbot-dialog-title" className="font-serif text-lg sm:text-xl font-bold text-heritage-ink-900 mt-1">
                    Bạn Đồng Hành Văn Hóa Hồ Chí Minh
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-heritage-ink-500 hover:text-heritage-ink-900 hover:bg-heritage-ivory-200 transition-colors"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-5 space-y-4">
              {/* Transparency Notice */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-1">
                    Thông báo minh bạch về tính năng Trợ lý AI:
                  </strong>
                  <p>
                    Website hiện đang ở <strong>Giai đoạn 1 (Giao diện số hóa & Kho tư liệu học đường)</strong>.
                    Hệ thống Chatbot AI RAG (Retrieval-Augmented Generation) đang trong lộ trình thẩm định và chuẩn hóa cơ sở tri thức
                    bởi Hội đồng chuyên môn Trường THCS Nguyễn Trung Trực.
                  </p>
                  <p className="mt-1 font-medium text-amber-800">
                    * Nhằm tôn trọng sự chuẩn xác của lịch sử cách mạng, hệ thống tuyệt đối không tạo câu trả lời AI giả lập khi chưa kết nối mô hình chính thức.
                  </p>
                </div>
              </div>

              {/* Technical Roadmap Overview */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-heritage-red-700 mb-2 flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>Định hướng phát triển trong Giai đoạn 2:</span>
                </h4>
                <div className="space-y-2">
                  {upcomingFeatures.map((feat, idx) => (
                    <div key={idx} className="p-3 bg-heritage-ivory-100 rounded-lg border border-heritage-ivory-200 text-xs sm:text-sm">
                      <strong className="text-heritage-ink-900 block font-bold mb-0.5">
                        {idx + 1}. {feat.title}
                      </strong>
                      <p className="text-heritage-ink-600">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample questions preview */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-heritage-gold-600 mb-2 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-heritage-gold-500" />
                  <span>Bộ câu hỏi định hướng học sinh THCS có thể tra cứu sau này:</span>
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-heritage-ivory-50 border border-heritage-ivory-200 text-xs text-heritage-ink-700 italic flex items-center space-x-2"
                    >
                      <span className="text-heritage-red-700 font-bold">•</span>
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular component architecture note */}
              <div className="pt-2 text-[11px] text-heritage-ink-500 text-center">
                Cấu trúc module độc lập sẵn sàng tích hợp Endpoint API & RAG Vector Database khi bước vào Giai đoạn 2.
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-heritage-ivory-300 flex items-center justify-between">
              <span className="text-xs text-heritage-ink-500">
                Không gian văn hóa Hồ Chí Minh • Trường THCS Nguyễn Trung Trực
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-heritage-red-700 hover:bg-heritage-red-800 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Tôi đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
