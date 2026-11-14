import React, { useState } from 'react';
import { Bot, User, Clock, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { RagAnswerResponse } from '../../rag/types/ragTypes';
import { RagCitationViewer } from './RagCitationViewer';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  ragResponse?: RagAnswerResponse;
  timestamp: string;
}

interface RagMessageItemProps {
  message: ChatMessage;
}

export const RagMessageItem: React.FC<RagMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      // Check for numbered list
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

          {/* Governance Notice & Copy Button */}
          {!isUser && (
            <div className="mt-3 pt-2 border-t border-heritage-ivory-200 flex items-center justify-between text-[10px] text-heritage-ink-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Không gian Văn hóa HCM • THCS Nguyễn Trung Trực</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-heritage-ink-700 flex items-center space-x-1 p-1 rounded transition-colors"
                title="Sao chép nội dung"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
