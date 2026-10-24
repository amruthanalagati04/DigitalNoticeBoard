import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { noticeService } from '../services/noticeService.js';
import { NoticeCategory } from '../types/index.js';
import { ArrowLeft, CheckCircle2, AlertCircle, Send, Pin } from 'lucide-react';

const CATEGORIES: NoticeCategory[] = [
  'Academic',
  'Examination',
  'Events',
  'Placement',
  'General',
];

export const CreateNoticePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Academic');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('Office of the Dean');
  const [pinned, setPinned] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.trim().length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setError('Description must be at least 5 characters long.');
      return;
    }

    if (!date) {
      setError('Please provide an effective notice date.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await noticeService.createNotice({
        title: title.trim(),
        description: description.trim(),
        category,
        date,
        department: department.trim(),
        pinned,
      });

      setSuccessMessage('Notice published successfully! Redirecting to admin dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to publish notice. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top breadcrumb / navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-slate-400">Admin Action</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create & Publish Notice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Issue a verified digital circular to the college notice board repository
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Notice Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notice Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule for Mid-Term Examination Spring 2026"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        {/* Category & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notice Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notice Date (Effective Date) *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-mono"
            />
          </div>
        </div>

        {/* Issuing Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Issuing Department / Authority
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Controller of Examinations, Training & Placement Cell"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        {/* Notice Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Notice Description / Body *
            </label>
            <span className="text-[11px] text-slate-400">
              {description.length} characters
            </span>
          </div>
          <textarea
            required
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the full announcement text, instructions, student guidelines, eligibility, dates and venue details..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 leading-relaxed font-sans"
          />
        </div>

        {/* Pinned Priority Checkbox */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <input
            id="pinned-checkbox"
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="w-4 h-4 text-blue-900 rounded border-slate-300 focus:ring-blue-900"
          />
          <label htmlFor="pinned-checkbox" className="text-xs text-slate-700 cursor-pointer select-none">
            <strong className="text-slate-900 font-semibold flex items-center gap-1">
              <Pin className="w-3.5 h-3.5 text-amber-600 inline" />
              Pin this notice to top of the board
            </strong>
            <span className="block text-slate-500 mt-0.5">
              High-priority alerts remain prominently featured above chronological posts.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Publishing Notice...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
