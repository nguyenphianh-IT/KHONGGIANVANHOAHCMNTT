import React from 'react';
import { Sparkles } from 'lucide-react';

interface RagQuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const RagQuickPrompts: React.FC<RagQuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  const prompts = [
    'Bác Hồ dạy thiếu niên, nhi đồng 5 điều gì?',
    'Ý nghĩa của bản Tuyên ngôn Độc lập ngày 2/9/1945 là gì?',
    'Lời dặn của Bác về đoàn viên và thanh niên trong Di chúc?',
    'Bác Hồ gửi gắm điều gì trong thư gửi học sinh nhân ngày khai trường 1945?',
    'Quan điểm của Bác Hồ về công tác Dân vận là gì?',
    'Bài học ý chí trong tập thơ Nhật ký trong tù?'
  ];

  return (
    <div className="py-2">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-heritage-red-700 uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5 text-heritage-gold-500" />
        <span>Câu hỏi gợi ý từ kho tư liệu đã duyệt:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(p)}
            className="text-left text-xs px-3 py-1.5 rounded-lg bg-heritage-ivory-100 hover:bg-heritage-gold-100 text-heritage-ink-800 border border-heritage-ivory-300 hover:border-heritage-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            "{p}"
          </button>
        ))}
      </div>
    </div>
  );
};
