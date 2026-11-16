import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Database,
  Info,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { RagService } from '../../services/ragService';
import { RagMessageItem, ChatMessage } from './RagMessageItem';
import { RagQuickPrompts } from './RagQuickPrompts';

interface RagChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPreviewRoadmap?: () => void;
  initialQuery?: string;
  contextDocumentTitle?: string;
  defaultRole?: 'student' | 'teacher' | 'guest';
}

export const RagChatbotModal: React.FC<RagChatbotModalProps> = ({
  isOpen,
  onClose,
  onSwitchToPreviewRoadmap,
  initialQuery,
  contextDocumentTitle,
  defaultRole = 'student'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'guest'>(defaultRole);
  const [systemStats, setSystemStats] = useState<{
    status: string;
    totalDocuments: number;
    approvedDocuments: number;
    totalChunks: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialQueryTriggered = useRef(false);

  const isRagEnabled = (import.meta as any).env?.VITE_RAG_ENABLED !== 'false';

  // Initialize welcome message & fetch health stats on open
  useEffect(() => {
    if (isOpen) {
      if (!isRagEnabled) {
        setMessages([
          {
            id: 'msg-disabled',
            sender: 'assistant',
            text: `Hệ thống Trợ lý AI đang được tạm dừng để bảo trì hoặc cập nhật dữ liệu theo kế hoạch quản trị của nhà trường. Quý thầy cô và các em học sinh vui lòng tra cứu trực tiếp tại mục **Kho tư liệu số hóa** trên website.`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      if (messages.length === 0) {
        setMessages([
          {
            id: 'msg-welcome',
            sender: 'assistant',
            text: `Xin chào quý thầy cô và các em học sinh Trường THCS Nguyễn Trung Trực!\n\nTôi là **Bạn Đồng Hành Văn Hóa Hồ Chí Minh** – Trợ lý AI đồng hành tìm hiểu tư tưởng, đạo đức, phong cách Bác Hồ và truyền thống lịch sử hào hùng của dân tộc.\n\n✨ **Đặc điểm nổi bật:**\n• **Nguồn gốc chuẩn xác:** 100% câu trả lời được đối soát trực tiếp từ 45 tư liệu chính thống đã qua quy trình thẩm định 4 mắt của nhà trường.\n• **Trích dẫn minh bạch:** Luôn đính kèm tên tài liệu, trang đoạn và liên kết đối chiếu nguyên tác.\n• **Đồng hành học đường:** Hỗ trợ bài học đạo đức, phong trào Đội, bồi dưỡng lý tưởng cách mạng và trả lời các thắc mắc lịch sử.\n\n*Mời thầy cô và các em chọn câu hỏi gợi ý bên dưới hoặc tự nhập câu hỏi vào khung chat nhé!*`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      RagService.checkHealth().then(setSystemStats).catch(() => {});

      // If initialQuery is passed, auto-fill or trigger
      if (initialQuery && !initialQueryTriggered.current) {
        initialQueryTriggered.current = true;
        setTimeout(() => {
          handleSend(initialQuery);
        }, 300);
      } else {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    } else {
      initialQueryTriggered.current = false;
    }
  }, [isOpen, initialQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const ragRes = await RagService.askQuestion(text);
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: ragRes.answer,
        ragResponse: ragRes,
        userQuery: text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Đã xảy ra lỗi khi kết nối với bộ máy RAG Runtime: ${err?.message || 'Không thể truy xuất dữ liệu'}. Vui lòng thử lại sau.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Cuộc trò chuyện đã được làm mới. Mời em hoặc thầy cô đặt câu hỏi tiếp theo!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-heritage-ivory-100 rounded-2xl max-w-3xl w-full h-[90vh] max-h-[820px] flex flex-col shadow-2xl border border-heritage-gold-400/80 overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rag-dialog-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-heritage-red-800 via-heritage-red-900 to-heritage-red-950 text-white p-3.5 sm:p-4 border-b border-heritage-gold-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-heritage-red-950 border border-heritage-gold-400/80 flex items-center justify-center shadow-md flex-shrink-0">
              <Bot className="w-6 h-6 text-heritage-gold-300" />
            </div>
            <div className="min-w-0">
              <h3 id="rag-dialog-title" className="font-serif text-base sm:text-lg font-bold text-heritage-gold-200 tracking-tight truncate">
                Bạn Đồng Hành Văn Hóa Hồ Chí Minh
              </h3>
              <div className="text-[11px] text-heritage-ivory-200/90 flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="font-medium">Trường THCS Nguyễn Trung Trực</span>
                <span>•</span>
                <span className="text-heritage-gold-300 font-mono text-[10px] inline-flex items-center space-x-1">
                  <Database className="w-3 h-3 text-heritage-gold-400" />
                  <span>{systemStats ? `${systemStats.approvedDocuments} tư liệu (${systemStats.totalChunks} đoạn)` : '45 tư liệu'}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Vận hành chính thức</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0 pl-2">
            {onSwitchToPreviewRoadmap && (
              <button
                type="button"
                onClick={onSwitchToPreviewRoadmap}
                className="px-2 py-1 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center space-x-1 border border-heritage-gold-500/30"
                title="Xem lộ trình phát triển"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-medium">Lộ trình</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audience Mode Selector Bar */}
        <div className="bg-heritage-red-950/80 text-white px-4 py-1.5 flex items-center justify-between text-xs border-b border-heritage-gold-500/20 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-heritage-ivory-300 text-[11px] font-medium">Chế độ trải nghiệm:</span>
            <div className="inline-flex rounded-lg bg-black/30 p-0.5 border border-heritage-gold-500/30 text-[10px]">
              <button
                type="button"
                onClick={() => setUserRole('student')}
                className={`px-2.5 py-0.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  userRole === 'student'
                    ? 'bg-heritage-gold-500 text-heritage-red-950 font-bold shadow-xs'
                    : 'text-heritage-ivory-200 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Học sinh THCS</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('teacher')}
                className={`px-2.5 py-0.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  userRole === 'teacher'
                    ? 'bg-heritage-gold-500 text-heritage-red-950 font-bold shadow-xs'
                    : 'text-heritage-ivory-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Giáo viên / Thầy cô</span>
              </button>
            </div>
          </div>

          {contextDocumentTitle && (
            <div className="text-[10px] text-heritage-gold-300 truncate max-w-[220px] hidden sm:block">
              Đang tham chiếu: <span className="font-medium underline">{contextDocumentTitle}</span>
            </div>
          )}
        </div>

        {/* Quality & Trust Assurance Ribbon */}
        <div className="bg-emerald-50/90 border-b border-emerald-200/80 px-4 py-1.5 text-[11px] text-emerald-950 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-1.5 min-w-0">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            <span className="truncate">
              <strong>Kho tri thức chuẩn mực:</strong> 100% câu trả lời được đối soát từ tư liệu lịch sử đã qua kiểm định 4 mắt.
            </span>
          </div>
          <span className="text-emerald-800 font-semibold text-[10px] hidden sm:inline whitespace-nowrap pl-2">
            Chuẩn mực sư phạm THCS
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-heritage-ivory-100">
          {messages.map(msg => (
            <RagMessageItem key={msg.id} message={msg} userRole={userRole} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-heritage-red-700 border border-heritage-gold-400 flex items-center justify-center flex-shrink-0 text-white">
                <Bot className="w-4 h-4 text-heritage-gold-300" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-heritage-ivory-300 flex items-center space-x-2.5 text-xs text-heritage-ink-600">
                <Loader2 className="w-4 h-4 animate-spin text-heritage-red-700" />
                <span>Đang truy xuất kho tư liệu và kiểm định bằng chứng...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel Bar */}
        <div className="px-3.5 sm:px-4 py-1.5 bg-heritage-ivory-200/90 border-t border-heritage-ivory-300 flex-shrink-0">
          <RagQuickPrompts onSelectPrompt={p => handleSend(p)} disabled={isLoading} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-3.5 bg-white border-t border-heritage-ivory-300 flex-shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder={
                  userRole === 'teacher'
                    ? 'Đặt câu hỏi nghiên cứu (ví dụ: Phân tích bối cảnh ra đời của tác phẩm Sửa đổi lối làm việc)...'
                    : 'Đặt câu hỏi về Bác Hồ (ví dụ: Bác Hồ dạy thiếu nhi 5 điều gì?)...'
                }
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-heritage-ivory-400 focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-300/30 text-xs sm:text-sm text-heritage-ink-900 bg-heritage-ivory-50/80 outline-none transition-all disabled:opacity-50 shadow-inner"
              />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-ink-400 hover:text-heritage-ink-700 text-xs p-1"
                  title="Xóa nội dung"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 hover:from-heritage-red-800 hover:to-heritage-red-900 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Hỏi</span>
              <Send className="w-3.5 h-3.5 text-heritage-gold-300" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-heritage-ink-500">
            <span>Nhấn Enter để gửi • Hỗ trợ tiếng Việt có dấu và không dấu</span>
            <span className="text-heritage-red-800 font-semibold hidden sm:inline">Không gian Văn hóa Hồ Chí Minh THCS Nguyễn Trung Trực</span>
          </div>
        </div>
      </div>
    </div>
  );
};
