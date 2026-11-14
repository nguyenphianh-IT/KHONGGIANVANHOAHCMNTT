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

  // Initialize welcome message & fetch health stats on open
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            id: 'msg-welcome',
            sender: 'assistant',
            text: `Xin chào các em học sinh và quý thầy cô Trường THCS Nguyễn Trung Trực!\n\nTôi là **Bạn Đồng Hành Văn Hóa Hồ Chí Minh** (phiên bản RAG Staging Thử nghiệm). Tôi được kết nối trực tiếp với kho tư liệu lịch sử đã qua thẩm định của nhà trường, sẵn sàng giải đáp các câu hỏi về cuộc đời, sự nghiệp, các tác phẩm và lời dạy của Bác Hồ.\n\n*Em có thể bấm vào các câu hỏi gợi ý bên dưới hoặc tự nhập câu hỏi vào ô bên dưới nhé!*`,
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
        className="bg-heritage-ivory-100 rounded-2xl max-w-2xl w-full h-[92vh] max-h-[820px] flex flex-col shadow-2xl border-2 border-heritage-gold-400 overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rag-dialog-title"
      >
        {/* Header */}
        <div className="bg-heritage-red-800 text-white p-3.5 sm:p-4 border-b border-heritage-gold-500/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-heritage-red-900 border border-heritage-gold-400 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-heritage-gold-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="rag-dialog-title" className="font-serif text-sm sm:text-lg font-bold text-heritage-gold-200">
                  Bạn Đồng Hành Văn Hóa Hồ Chí Minh
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-gold-400/20 text-heritage-gold-300 border border-heritage-gold-400/40">
                  RAG Pilot
                </span>
              </div>
              <div className="text-[11px] text-heritage-ivory-200 flex items-center space-x-2">
                <span>Trường THCS Nguyễn Trung Trực</span>
                {systemStats && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-heritage-gold-300 font-mono text-[10px]">
                      <Database className="w-3 h-3" />
                      <span>{systemStats.approvedDocuments} tài liệu ({systemStats.totalChunks} đoạn đã duyệt)</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {onSwitchToPreviewRoadmap && (
              <button
                type="button"
                onClick={onSwitchToPreviewRoadmap}
                className="p-1.5 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-heritage-red-700/60 transition-colors text-xs flex items-center space-x-1"
                title="Xem lộ trình"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Lộ trình</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-heritage-red-700/60 transition-colors"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-heritage-gold-300 hover:text-white hover:bg-heritage-red-700/60 transition-colors"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audience Mode Selector Bar */}
        <div className="bg-heritage-red-900/90 text-white px-4 py-1.5 flex items-center justify-between text-xs border-b border-heritage-gold-500/20">
          <div className="flex items-center space-x-1.5">
            <span className="text-heritage-ivory-300 text-[11px]">Chế độ trải nghiệm:</span>
            <div className="inline-flex rounded-lg bg-heritage-red-950 p-0.5 border border-heritage-gold-500/30 text-[10px]">
              <button
                type="button"
                onClick={() => setUserRole('student')}
                className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
                  userRole === 'student'
                    ? 'bg-heritage-gold-500 text-heritage-red-950 font-bold shadow-sm'
                    : 'text-heritage-ivory-200 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Học sinh THCS</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('teacher')}
                className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
                  userRole === 'teacher'
                    ? 'bg-heritage-gold-500 text-heritage-red-950 font-bold shadow-sm'
                    : 'text-heritage-ivory-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Giáo viên / Thầy cô</span>
              </button>
            </div>
          </div>

          {contextDocumentTitle && (
            <div className="text-[10px] text-heritage-gold-300 truncate max-w-[200px] hidden sm:block">
              Đang xem: <span className="font-medium underline">{contextDocumentTitle}</span>
            </div>
          )}
        </div>

        {/* Governance Staging Sandbox Banner */}
        <div className="bg-amber-100/90 border-b border-amber-300 px-4 py-1.5 text-[11px] text-amber-900 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            <span>
              <strong>PHIÊN BẢN THỬ NGHIỆM NỘI BỘ (STAGING / ADR-002):</strong> Trả lời dựa trên kho tri thức đã qua kiểm định Four-Eyes.
            </span>
          </div>
          <span className="text-amber-800 font-mono text-[10px] hidden sm:inline">
            ZERO HALLUCINATION • FAIL CLOSED
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

        {/* Quick Prompts Panel */}
        <div className="px-4 py-2 bg-heritage-ivory-200/80 border-t border-heritage-ivory-300 flex-shrink-0">
          <RagQuickPrompts onSelectPrompt={p => handleSend(p)} disabled={isLoading} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-heritage-ivory-300 flex-shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={
                userRole === 'teacher'
                  ? 'Đặt câu hỏi nghiên cứu (ví dụ: Phân tích bối cảnh ra đời của Tác phẩm Sửa đổi lối làm việc 1947)...'
                  : 'Đặt câu hỏi về Bác Hồ (ví dụ: Bác Hồ dạy thiếu nhi 5 điều gì?)...'
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-heritage-ivory-400 focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-300/30 text-xs sm:text-sm text-heritage-ink-900 bg-heritage-ivory-50 outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-heritage-red-700 hover:bg-heritage-red-800 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
            >
              <span>Hỏi</span>
              <Send className="w-4 h-4 text-heritage-gold-300" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-heritage-ink-400">
            <span>Nhấn Enter để gửi • Hỗ trợ tiếng Việt có dấu và không dấu</span>
            <span className="text-heritage-red-700 font-medium">Bảo vệ tính xác thực tư liệu lịch sử</span>
          </div>
        </div>
      </div>
    </div>
  );
};
