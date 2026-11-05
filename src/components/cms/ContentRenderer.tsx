import React from 'react';
import { getStoredMedia, cleanBase64FromContent } from '../../lib/cmsStore';

interface ContentRendererProps {
  content: string;
  className?: string;
  fontSize?: 'normal' | 'large';
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  className = '',
  fontSize = 'normal',
}) => {
  if (!content) return null;

  // Tự động thu gọn và chuyển đổi bất kỳ chuỗi Base64 thô nào (chỉ hiển thị, không ghi đĩa khi render)
  const { cleanedText } = cleanBase64FromContent(content, 'Hệ thống Không gian văn hóa', { persistMedia: false });

  // Split into block paragraphs by double newline
  const blocks = cleanedText.split(/\n\s*\n/);

  const bodyTextClass = fontSize === 'large'
    ? 'text-base sm:text-lg leading-relaxed'
    : 'text-sm sm:text-base leading-relaxed';

  return (
    <div className={`space-y-5 font-serif text-heritage-ink-800 ${className}`}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. YouTube Video Embed Tag: [VIDEO: url]
        if (trimmed.startsWith('[VIDEO:') && trimmed.endsWith(']')) {
          const videoUrl = trimmed.substring(7, trimmed.length - 1).trim();
          if (videoUrl) {
            return (
              <div key={index} className="my-6 rounded-2xl overflow-hidden shadow-lg border-2 border-heritage-gold-300 bg-black aspect-video max-w-4xl mx-auto">
                <iframe
                  src={videoUrl}
                  title="Tư liệu video Không gian văn hóa"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }
        }

        // 2. Markdown Image Tag: ![alt](url) - Safe string slicing & media resolver
        if (trimmed.startsWith('![') && trimmed.includes('](')) {
          const splitIdx = trimmed.indexOf('](');
          const endIdx = trimmed.lastIndexOf(')');
          if (splitIdx !== -1 && endIdx > splitIdx) {
            const altText = trimmed.substring(2, splitIdx).trim() || 'Hình ảnh tư liệu lịch sử';
            let imgUrl = trimmed.substring(splitIdx + 2, endIdx).trim();

            // Phân giải định danh Media Tag: media://<id>
            if (imgUrl.startsWith('media://') || imgUrl.startsWith('media:')) {
              const mediaId = imgUrl.replace(/^media:\/\//, '').replace(/^media:/, '');
              const mediaList = getStoredMedia();
              const found = mediaList.find((m) => m.id === mediaId || m.name === mediaId);
              if (found) {
                imgUrl = found.url;
              }
            }

            if (imgUrl) {
              return (
                <figure key={index} className="my-6 rounded-2xl overflow-hidden border border-heritage-gold-300 shadow-md bg-white p-2.5 max-w-3xl mx-auto">
                  <img
                    src={imgUrl}
                    alt={altText}
                    className="w-full max-h-[480px] object-contain rounded-xl mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/logo-bieu-tuong.png';
                    }}
                  />
                  {altText && (
                    <figcaption className="text-center text-xs font-sans italic text-heritage-ink-600 mt-2.5 py-1">
                      {altText}
                    </figcaption>
                  )}
                </figure>
              );
            }
          }
        }

        // 2b. Nếu là chuỗi data:image/ đơn lẻ, hiển thị trực tiếp thành hình ảnh thay vì ký tự
        if (trimmed.startsWith('data:image/')) {
          return (
            <figure key={index} className="my-6 rounded-2xl overflow-hidden border border-heritage-gold-300 shadow-md bg-white p-2.5 max-w-2xl mx-auto">
              <img
                src={trimmed}
                alt="Tư liệu lịch sử số hóa"
                className="w-full max-h-[480px] object-contain rounded-xl mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo-bieu-tuong.png';
                }}
              />
              <figcaption className="text-center text-xs font-sans italic text-heritage-ink-600 mt-2.5 py-1">
                Tư liệu lịch sử số hóa
              </figcaption>
            </figure>
          );
        }

        // 3. Blockquote: > text
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <div key={index} className="my-6 relative bg-gradient-to-r from-heritage-gold-100/80 via-heritage-gold-50/50 to-transparent p-5 sm:p-6 rounded-2xl border-l-4 border-heritage-gold-500 shadow-sm">
              <span className="font-serif text-3xl sm:text-4xl text-heritage-gold-600 select-none opacity-60 leading-none mr-2">“</span>
              <blockquote className="inline italic font-serif text-sm sm:text-base md:text-lg text-heritage-red-950 font-medium leading-relaxed">
                {quoteText}
              </blockquote>
              <span className="font-serif text-3xl sm:text-4xl text-heritage-gold-600 select-none opacity-60 leading-none ml-2">”</span>
            </div>
          );
        }

        // 4. Heading 1: # Title
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={index} className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-heritage-red-950 mt-7 mb-3 border-b border-heritage-gold-300/40 pb-2">
              {trimmed.substring(2)}
            </h2>
          );
        }

        // 5. Heading 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="font-serif font-bold text-lg sm:text-xl text-heritage-red-900 mt-6 mb-2">
              {trimmed.substring(3)}
            </h3>
          );
        }

        // 6. Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={index} className="font-serif font-bold text-base text-heritage-red-800 mt-5 mb-1.5">
              {trimmed.substring(4)}
            </h4>
          );
        }

        const lines = trimmed.split('\n');

        // 7. Check if all lines are numbered items (e.g. "1. ", "2. ")
        const isNumberedList = lines.length > 1 && lines.every((l) => /^\d+[\.\)]\s+/.test(l.trim()));
        if (isNumberedList) {
          return (
            <ol key={index} className="my-5 space-y-3 bg-heritage-gold-50/50 p-4 sm:p-6 rounded-2xl border border-heritage-gold-300/70 shadow-sm">
              {lines.map((l, lIdx) => {
                const cleanText = l.trim().replace(/^\d+[\.\)]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start space-x-3.5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-heritage-red-800 text-white font-bold text-xs flex items-center justify-center shadow-sm font-sans mt-0.5">
                      {lIdx + 1}
                    </span>
                    <span className={`flex-grow font-serif text-heritage-red-950 font-medium pt-0.5 ${bodyTextClass}`}>
                      {renderInlineFormattedText(cleanText)}
                    </span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // 8. Check if all lines are bullet items (- or *)
        const isBulletList = lines.length > 1 && lines.every((l) => /^[-*•]\s+/.test(l.trim()));
        if (isBulletList) {
          return (
            <ul key={index} className="my-4 space-y-2.5 pl-3">
              {lines.map((l, lIdx) => {
                const cleanText = l.trim().replace(/^[-*•]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-heritage-gold-600 mt-2" />
                    <span className={`flex-grow ${bodyTextClass}`}>{renderInlineFormattedText(cleanText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 9. Regular paragraph with safe inline formatting
        return (
          <p key={index} className={`${bodyTextClass} text-justify leading-relaxed text-heritage-ink-900`}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineFormattedText(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

// Safe inline renderer avoiding regex catastrophic backtracking on long text
function renderInlineFormattedText(text: string) {
  if (!text) return null;
  const trimmed = text.trim();
  // Ngăn chặn triệt để các khối chuỗi ký tự Base64 thô (AAAA...) hoặc chuỗi mã hoá dài hiển thị ra giao diện người dùng
  if (
    trimmed.includes('AAAA') ||
    trimmed.startsWith('data:image/') ||
    (trimmed.length > 25 && /^[A-Za-z0-9+/=]+$/.test(trimmed)) ||
    /[A-Za-z0-9+/=]{40,}/.test(trimmed)
  ) {
    return null;
  }
  if (text.length > 2000) {
    return text.substring(0, 100) + '...';
  }
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-heritage-red-950">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
