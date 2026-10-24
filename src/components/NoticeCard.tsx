import React from 'react';
import { Link } from 'react-router-dom';
import { Notice } from '../types/index.js';
import { Pin, ArrowUpRight, Calendar, Building2 } from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Academic: 'text-blue-700',
  Examination: 'text-amber-800',
  Events: 'text-purple-700',
  Placement: 'text-emerald-700',
  General: 'text-slate-700',
};

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, compact = false }) => {
  const categoryColor = CATEGORY_COLORS[notice.category] || 'text-slate-700';

  // Format date cleanly
  const formattedDate = new Date(notice.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between ${
        notice.pinned ? 'bg-amber-50/20' : ''
      }`}
    >
      <div>
        {/* Unboxed Metadata Header (Zero-Pill discipline) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold tracking-wide ${categoryColor}`}>
              {notice.category}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 tabular-nums font-mono text-[11px] text-slate-600">
              <Calendar className="w-3 h-3 text-slate-400 inline" />
              {formattedDate}
            </span>
            {notice.department && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="truncate max-w-[160px] text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 inline" />
                  {notice.department}
                </span>
              </>
            )}
          </div>

          {notice.pinned && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-transparent">
              <Pin className="w-3 h-3 text-amber-600" />
              <span>Pinned</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug mb-2">
          <Link to={`/notices/${notice._id}`} className="focus:outline-hidden focus:underline">
            {notice.title}
          </Link>
        </h3>

        {/* Description Excerpt */}
        {!compact && (
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {notice.description}
          </p>
        )}
      </div>

      {/* Footer link & Author */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span className="truncate max-w-[200px]">
          By <strong className="font-medium text-slate-700">{notice.createdBy?.name || 'Administrator'}</strong>
        </span>
        <Link
          to={`/notices/${notice._id}`}
          className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700 transition-colors shrink-0"
        >
          <span>View Notice</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
