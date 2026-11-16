import React from 'react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

interface RagQuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const RagQuickPrompts: React.FC<RagQuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  const prompts = [
    {
      label: '5 điều Bác dạy thiếu nhi',
      query: 'Bác Hồ dạy thiếu niên, nhi đồng 5 điều gì và ý nghĩa với học sinh?'
    },
    {
      label: 'Ý nghĩa Tuyên ngôn Độc lập 1945',
      query: 'Ý nghĩa của bản Tuyên ngôn Độc lập ngày 2/9/1945 là gì?'
    },
    {
      label: 'Lời dặn thanh niên trong Di chúc',
      query: 'Lời dặn của Bác Hồ về đoàn viên và thanh niên trong bản Di chúc?'
    },
    {
      label: 'Thư gửi học sinh khai trường 1945',
      query: 'Bác Hồ gửi gắm điều gì trong thư gửi học sinh nhân ngày khai trường 1945?'
    },
    {
      label: 'Quan điểm về công tác Dân vận',
      query: 'Quan điểm của Bác Hồ về công tác Dân vận là gì?'
    },
    {
      label: 'Tinh thần thép trong Nhật ký trong tù',
      query: 'Bài học ý chí và nghị lực trong tập thơ Nhật ký trong tù của Bác?'
    }
  ];

  return (
    <div className="py-1">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
        <div className="flex items-center space-x-1 text-[11px] font-bold text-heritage-red-800 shrink-0 pr-1.5 border-r border-heritage-ivory-300">
          <Sparkles className="w-3.5 h-3.5 text-heritage-gold-600" />
          <span>Gợi ý:</span>
        </div>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(p.query)}
            title={p.query}
            className="shrink-0 text-left text-xs px-2.5 py-1 rounded-full bg-white hover:bg-heritage-gold-50 text-heritage-ink-800 hover:text-heritage-red-900 border border-heritage-ivory-300 hover:border-heritage-gold-400 transition-all shadow-xs flex items-center space-x-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircleQuestion className="w-3 h-3 text-heritage-gold-600 shrink-0" />
            <span className="font-medium whitespace-nowrap">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
