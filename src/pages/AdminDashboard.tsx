import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { noticeService } from '../services/noticeService.js';
import { Notice, NoticeStats } from '../types/index.js';
import {
  PlusCircle,
  FileText,
  Eye,
  BookOpen,
  CalendarCheck,
  Briefcase,
  Sparkles,
  Bell,
  TrendingUp,
  Clock,
  ArrowRight,
  Shield,
  RefreshCw,
  AlertCircle,
  Pin,
  Download,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<NoticeStats | null>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, noticesData] = await Promise.all([
        noticeService.getStats(),
        noticeService.getNotices(),
      ]);
      setStats(statsData);
      setRecentNotices(noticesData.slice(0, 5));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch admin dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const categoryBreakdown = [
    {
      category: 'Academic',
      count: stats?.categories?.Academic ?? 0,
      icon: BookOpen,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-100',
    },
    {
      category: 'Examination',
      count: stats?.categories?.Examination ?? 0,
      icon: CalendarCheck,
      color: 'text-amber-800',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-100',
    },
    {
      category: 'Events',
      count: stats?.categories?.Events ?? 0,
      icon: Sparkles,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50/70',
      borderColor: 'border-purple-100',
    },
    {
      category: 'Placement',
      count: stats?.categories?.Placement ?? 0,
      icon: Briefcase,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-100',
    },
    {
      category: 'General',
      count: stats?.categories?.General ?? 0,
      icon: Bell,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100/70',
      borderColor: 'border-slate-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Welcome message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Management Console</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of published campus bulletins, category distributions, and moderation actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/download-zip"
            download="lbrce-digital-notice-board.zip"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors shadow-xs"
            title="Download full project source code as a ZIP file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Code (.ZIP)</span>
          </a>
          <button
            onClick={fetchDashboardData}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Notice</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Notices */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Total Notices</span>
            <FileText className="w-4 h-4 text-blue-900" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {stats?.totalNotices ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Across all college departments</p>
          </div>
        </div>

        {/* Recent 7 Days */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Recent Notices</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {stats?.recentNotices ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Published within past 7 days</p>
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Categories</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {stats?.categories ? Object.keys(stats.categories).length : 5}
            </p>
            <p className="text-xs text-slate-500 mt-1">Academic channels configured</p>
          </div>
        </div>

        {/* Registered Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Student Reach</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {stats?.totalStudents ?? 1}
            </p>
            <p className="text-xs text-slate-500 mt-1">Enrolled student portal accounts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/create"
            className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-xs transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                Publish New Notice
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Draft a new announcement with custom categories, effective dates, and priority flags.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/manage"
            className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-xs transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-slate-100 text-slate-800 rounded-lg group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                Manage All Notices
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Search, filter, update details, or delete existing circulars from the repository.
              </p>
            </div>
          </Link>

          <Link
            to="/notices"
            className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-xs transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-slate-100 text-slate-800 rounded-lg group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                View Student Board
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Preview the live public notice board as visible to campus students and guests.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Category-Wise Statistics Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Category-Wise Statistics</h2>
          <span className="text-xs text-slate-400">Real-time announcement distribution</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
          {categoryBreakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.category}
                className={`p-4 rounded-xl border ${item.borderColor} ${item.bgColor} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${item.color}`}>{item.category}</span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {item.count}
                  </span>
                  <span className="text-[11px] text-slate-500 ml-1.5">notices</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recently Published Notices</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quick moderation overview of latest notices</p>
          </div>
          <Link
            to="/admin/manage"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Full Notice Management</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading announcements...</div>
        ) : recentNotices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentNotices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {notice.pinned && <Pin className="w-3 h-3 text-amber-600 shrink-0" />}
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
                          {notice.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {notice.category}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono tabular-nums">
                      {notice.date}
                    </td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-[150px]">
                      {notice.department || 'Administration'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/notices/${notice._id}`}
                        className="text-blue-900 hover:underline font-semibold"
                      >
                        View
                      </Link>
                      <Link
                        to="/admin/manage"
                        className="text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No notices published yet. Click "Create Notice" to add your first circular.
          </div>
        )}
      </div>
    </div>
  );
};
