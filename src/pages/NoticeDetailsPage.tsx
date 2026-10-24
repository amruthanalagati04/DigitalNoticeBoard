import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { noticeService } from '../services/noticeService.js';
import { Notice } from '../types/index.js';
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  Pin,
  Share2,
  Printer,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const NoticeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [relatedNotices, setRelatedNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadNotice() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const fetchedNotice = await noticeService.getNoticeById(id);
        setNotice(fetchedNotice);

        // Fetch related notices with the same category
        const allNotices = await noticeService.getNotices({
          category: fetchedNotice.category,
        });
        setRelatedNotices(allNotices.filter((n) => n._id !== id).slice(0, 3));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Notice not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadNotice();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Notice Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested notice could not be found. It may have expired or been removed by an administrator.
        </p>
        <div className="pt-2">
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Notice Board</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(notice.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const publishedTime = new Date(notice.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back bar and actions */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Board</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Copy Notice Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Print this notice"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Notice Article */}
      <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        {/* Category & Status header (Zero-Pill discipline) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
              {notice.category} Announcement
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 tabular-nums font-mono text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Effective Date: {formattedDate}
            </span>
          </div>

          {notice.pinned && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              <Pin className="w-3.5 h-3.5 text-amber-600" />
              <span>Pinned Announcement</span>
            </span>
          )}
        </div>

        {/* Notice Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
          {notice.title}
        </h1>

        {/* Issuer & Authority Information Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400">Issuing Authority / Department</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">
                {notice.department || 'College Administration'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400">Authorized Signatory</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">
                {notice.createdBy?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-500">
                Published on {publishedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div className="prose prose-slate max-w-none pt-2">
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {notice.description}
          </p>
        </div>

        {/* Verification and Authentication Seal Notice */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Digitally authenticated by LBRCE Academic Secretariat</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 tabular-nums">
            Ref: {notice._id}
          </span>
        </div>
      </article>

      {/* Related Notices in the same Category */}
      {relatedNotices.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold text-slate-900">
            More in {notice.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedNotices.map((rel) => (
              <Link
                key={rel._id}
                to={`/notices/${rel._id}`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <p className="text-[11px] font-mono text-slate-500 tabular-nums mb-1">
                    {new Date(rel.date).toLocaleDateString()}
                  </p>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <p className="text-xs text-blue-900 font-semibold mt-3">Read Circular →</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
