import React from 'react';
import { BookOpen, ShieldCheck, ExternalLink, Hash, Calendar, User } from 'lucide-react';
import { RagCitation } from '../../rag/types/ragTypes';

interface RagCitationViewerProps {
  citations: RagCitation[];
  onSelectCitation?: (citation: RagCitation) => void;
}

export const RagCitationViewer: React.FC<RagCitationViewerProps> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-heritage-ivory-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-heritage-ink-700 flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-heritage-red-700" />
          <span>Nguồn tư liệu trích dẫn kiểm chứng ({citations.length}):</span>
        </span>
      </div>

      <div className="space-y-2">
        {citations.map((c) => (
          <div
            key={c.citationId}
            className="p-2.5 rounded-lg bg-heritage-ivory-50 border border-heritage-ivory-300 text-xs hover:border-heritage-gold-400 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-heritage-red-800 flex items-center space-x-1">
                <span className="px-1.5 py-0.5 rounded bg-heritage-red-100 text-heritage-red-900 font-mono text-[11px]">
                  {c.citationId}
                </span>
                <span>{c.documentTitle}</span>
              </div>
              <span className="inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium whitespace-nowrap">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Đã kiểm định</span>
              </span>
            </div>

            {/* Metadata tags */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-heritage-ink-600">
              <span className="flex items-center space-x-1">
                <User className="w-3 h-3 text-heritage-ink-500" />
                <span>{c.authorOrSource}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-heritage-ink-500" />
                <span>{c.dateOrEra}</span>
              </span>
              <span className="flex items-center space-x-1 font-mono text-heritage-ink-500">
                <Hash className="w-3 h-3" />
                <span>{c.sectionOrPage}</span>
              </span>
            </div>

            {/* Verbatim quote snippet */}
            <div className="mt-1.5 p-2 rounded bg-white/80 border-l-2 border-heritage-gold-500 text-[11px] text-heritage-ink-800 italic leading-relaxed">
              "{c.snippet}"
            </div>

            {/* Optional external link */}
            {c.sourceUrl && (
              <div className="mt-1 text-right">
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-heritage-red-700 hover:text-heritage-red-900 underline font-medium"
                >
                  <span>Mở tư liệu nguồn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
