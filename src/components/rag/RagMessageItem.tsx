import React, { useState } from 'react';
import {
  Bot,
  User,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  X
} from 'lucide-react';
import { RagAnswerResponse } from '../../rag/types/ragTypes';
import { RagCitationViewer } from './RagCitationViewer';
import { RagService } from '../../services/ragService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  ragResponse?: RagAnswerResponse;
  userQuery?: string;
  timestamp: string;
}

interface RagMessageItemProps {
  message: ChatMessage;
  userRole?: 'student' | 'teacher' | 'guest';
}

export const RagMessageItem: React.FC<RagMessageItemProps> = ({ message, userRole = 'student' }) => {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'unhelpful' | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'inaccurate' | 'unclear' | 'missing_info' | 'other'>('inaccurate');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const isUser = message.sender === 'user';
  const query = message.userQuery || (message.ragResponse?.query) || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbUp = async () => {
    if (feedbackGiven) return;
    setFeedbackGiven('helpful');
    await RagService.sendFeedback({
      query: query || message.text.slice(0, 50),
      answerSnippet: message.text.slice(0, 300),
      isHelpful: true,
      category: 'positive',
      userRole
    });
  };

  const handleThumbDownClick = () => {
    if (feedbackGiven) return;
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await RagService.sendFeedback({
        query: query || message.text.slice(0, 50),
        answerSnippet: message.text.slice(0, 300),
        isHelpful: false,
        category: feedbackCategory,
        comment: feedbackComment.trim() || undefined,
        userRole
      });
      setFeedbackGiven('unhelpful');
      setShowFeedbackModal(false);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Basic markdown-like rendering for bold text and paragraphs
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      // Check for blockquote
      if (para.startsWith('>')) {
        return (
          <blockquote
            key={pIdx}
            className="my-2 pl-3 py-1 border-l-2 border-heritage-gold-500 bg-heritage-gold-50/50 italic text-xs sm:text-sm text-heritage-ink-800 rounded-r"
          >
            {para.replace(/^>\s*/, '')}
          </blockquote>
        );
      }

      // Check for numbered list or normal lines
      const lines = para.split('\n');
      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[92%] sm:max-w-[85%] items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
            isUser ? 'bg-heritage-ink-800' : 'bg-heritage-red-700 border border-heritage-gold-400'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-heritage-gold-300" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl p-4 shadow-sm border ${
            isUser
              ? 'bg-heritage-red-700 text-white border-heritage-red-800 rounded-tr-none'
              : 'bg-white text-heritage-ink-900 border-heritage-ivory-300 rounded-tl-none'
          }`}
        >
          {/* Header metadata for Assistant */}
          {!isUser && message.ragResponse && (
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-heritage-ivory-200 text-[11px] text-heritage-ink-500">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-heritage-red-700">Bạn Đồng Hành AI</span>
                <span>•</span>
                <span className="text-heritage-ink-600 font-mono text-[10px]">
                  {message.ragResponse.modelUsed}
                </span>
              </div>

              {message.ragResponse.metrics && (
                <div className="flex items-center space-x-2 text-[10px] text-heritage-ink-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-heritage-gold-600" />
                    <span>{message.ragResponse.metrics.totalTimeMs}ms</span>
                  </span>
                  <span>•</span>
                  <span>{message.ragResponse.metrics.chunksUsedInAnswer} nguồn</span>
                </div>
              )}
            </div>
          )}

          {/* Evidence found indicator */}
          {!isUser && message.ragResponse && !message.ragResponse.evidenceFound && (
            <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Chưa tìm thấy tư liệu kiểm chứng tương ứng trong kho lưu trữ</span>
            </div>
          )}

          {/* Main message text */}
          <div className="text-heritage-ink-900">{renderFormattedText(message.text)}</div>

          {/* Citations Viewer if assistant message */}
          {!isUser && message.ragResponse && message.ragResponse.citations.length > 0 && (
            <RagCitationViewer citations={message.ragResponse.citations} />
          )}

          {/* Action Bar: Governance notice, Feedback & Copy buttons */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-heritage-ivory-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-heritage-ink-500">
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1 text-heritage-ink-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] hidden sm:inline">Không gian Văn hóa HCM</span>
                </span>

                {/* Feedback Buttons */}
                <div className="flex items-center space-x-1 border-l border-heritage-ivory-300 pl-2">
                  <button
                    type="button"
                    onClick={handleThumbUp}
                    disabled={feedbackGiven !== null}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                      feedbackGiven === 'helpful'
                        ? 'bg-emerald-100 text-emerald-800 font-medium'
                        : 'hover:bg-heritage-ivory-200 text-heritage-ink-600'
                    }`}
                    title="Câu trả lời hữu ích"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{feedbackGiven === 'helpful' ? 'Hữu ích' : 'Thích'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleThumbDownClick}
                    disabled={feedbackGiven !== null}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                      feedbackGiven === 'unhelpful'
                        ? 'bg-amber-100 text-amber-800 font-medium'
                        : 'hover:bg-heritage-ivory-200 text-heritage-ink-600'
                    }`}
                    title="Cần cải thiện chất lượng"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>{feedbackGiven === 'unhelpful' ? 'Đã góp ý' : 'Góp ý'}</span>
                  </button>
                </div>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-heritage-ink-800 flex items-center space-x-1 px-2 py-0.5 rounded border border-heritage-ivory-300 hover:bg-heritage-ivory-100 transition-colors text-[10px]"
                title="Sao chép nội dung"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          )}

          {/* Feedback Form Modal / Drawer */}
          {!isUser && showFeedbackModal && (
            <div className="mt-3 p-3 bg-heritage-ivory-50 border border-heritage-ivory-300 rounded-xl text-xs text-heritage-ink-900 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-heritage-red-800 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-heritage-red-700" />
                  <span>Góp ý chất lượng câu trả lời</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-heritage-ink-400 hover:text-heritage-ink-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-heritage-ink-700 mb-1">
                    Vấn đề gặp phải:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <label className={`flex items-center p-1.5 rounded border cursor-pointer ${feedbackCategory === 'inaccurate' ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' : 'bg-white border-heritage-ivory-300'}`}>
                      <input
                        type="radio"
                        name="category"
                        value="inaccurate"
                        checked={feedbackCategory === 'inaccurate'}
                        onChange={() => setFeedbackCategory('inaccurate')}
                        className="sr-only"
                      />
                      <span>Chưa chính xác</span>
                    </label>

                    <label className={`flex items-center p-1.5 rounded border cursor-pointer ${feedbackCategory === 'unclear' ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' : 'bg-white border-heritage-ivory-300'}`}>
                      <input
                        type="radio"
                        name="category"
                        value="unclear"
                        checked={feedbackCategory === 'unclear'}
                        onChange={() => setFeedbackCategory('unclear')}
                        className="sr-only"
                      />
                      <span>Diễn đạt khó hiểu</span>
                    </label>

                    <label className={`flex items-center p-1.5 rounded border cursor-pointer ${feedbackCategory === 'missing_info' ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' : 'bg-white border-heritage-ivory-300'}`}>
                      <input
                        type="radio"
                        name="category"
                        value="missing_info"
                        checked={feedbackCategory === 'missing_info'}
                        onChange={() => setFeedbackCategory('missing_info')}
                        className="sr-only"
                      />
                      <span>Thiếu ý quan trọng</span>
                    </label>

                    <label className={`flex items-center p-1.5 rounded border cursor-pointer ${feedbackCategory === 'other' ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' : 'bg-white border-heritage-ivory-300'}`}>
                      <input
                        type="radio"
                        name="category"
                        value="other"
                        checked={feedbackCategory === 'other'}
                        onChange={() => setFeedbackCategory('other')}
                        className="sr-only"
                      />
                      <span>Lý do khác</span>
                    </label>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Góp ý cụ thể để giúp tổ tư liệu nhà trường hoàn thiện thêm..."
                    className="w-full text-[11px] p-2 border border-heritage-ivory-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-heritage-red-600"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-2.5 py-1 text-[11px] text-heritage-ink-600 hover:bg-heritage-ivory-200 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="px-3 py-1 text-[11px] bg-heritage-red-700 text-white font-medium rounded hover:bg-heritage-red-800 flex items-center space-x-1"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>{isSubmittingFeedback ? 'Đang gửi...' : 'Gửi góp ý'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
