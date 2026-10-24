import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { noticeService } from '../services/noticeService.js';
import { Notice, NoticeStats } from '../types/index.js';
import { NoticeCard } from '../components/NoticeCard.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState<NoticeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [noticesData, statsData] = await Promise.all([
          noticeService.getNotices(),
          noticeService.getStats(),
        ]);
        setRecentNotices(noticesData.slice(0, 4));
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load home page notices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_college_campus_1791612120086.jpg"
            alt="LBRCE Campus"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-blue-200 backdrop-blur-xs">
              <img
                src="/src/assets/images/lbrce_official_logo.png"
                alt="LBRCE Crest"
                className="w-5 h-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <span>Lakireddy Bali Reddy College of Engineering (Autonomous)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Digital Notice Board for Academic & Campus Updates
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Stay informed with real-time institutional announcements, examination schedules, placement bulletins, and campus events. A modern, centralized platform replacing physical bulletin boards.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/notices"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
              >
                <span>Browse All Notices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {isAdmin ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-xs"
                >
                  <span>Open Admin Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-xs"
                >
                  <span>Staff & Student Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick stats on Hero */}
          <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notice Board Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <p className="text-2xl font-bold text-white tabular-nums font-mono">
                  {stats?.totalNotices ?? 7}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total Announcements</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <p className="text-2xl font-bold text-emerald-400 tabular-nums font-mono">
                  {stats?.categories ? Object.keys(stats.categories).length : 5}
                </p>
                <p className="text-xs text-slate-400 mt-1">Active Categories</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span>Academic Circulars:</span>
                <span className="font-semibold text-slate-200 font-mono tabular-nums">{stats?.categories?.Academic ?? 2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Examinations:</span>
                <span className="font-semibold text-slate-200 font-mono tabular-nums">{stats?.categories?.Examination ?? 2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Placement Drives:</span>
                <span className="font-semibold text-slate-200 font-mono tabular-nums">{stats?.categories?.Placement ?? 1}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter announcements according to specific campus domains</p>
          </div>
          <Link
            to="/notices"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            {
              name: 'Academic',
              desc: 'Syllabus, calendars & timetables',
              icon: BookOpen,
              color: 'text-blue-700 bg-blue-50/70 border-blue-100',
              count: stats?.categories?.Academic ?? 0,
            },
            {
              name: 'Examination',
              desc: 'Hall tickets, datesheets & results',
              icon: CalendarCheck,
              color: 'text-amber-700 bg-amber-50/70 border-amber-100',
              count: stats?.categories?.Examination ?? 0,
            },
            {
              name: 'Events',
              desc: 'Symposiums, hackathons & sports',
              icon: Sparkles,
              color: 'text-purple-700 bg-purple-50/70 border-purple-100',
              count: stats?.categories?.Events ?? 0,
            },
            {
              name: 'Placement',
              desc: 'Campus recruitment & internships',
              icon: Briefcase,
              color: 'text-emerald-700 bg-emerald-50/70 border-emerald-100',
              count: stats?.categories?.Placement ?? 0,
            },
            {
              name: 'General',
              desc: 'Library hours & administrative notices',
              icon: Bell,
              color: 'text-slate-700 bg-slate-50/70 border-slate-200',
              count: stats?.categories?.General ?? 0,
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/notices?category=${cat.name}`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${cat.color} mb-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono tabular-nums">{cat.count} published</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Published Notices Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Latest Announcements</h2>
            <p className="text-xs text-slate-500 mt-0.5">Recently published notices from college administration</p>
          </div>
          <Link
            to="/notices"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View Full Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : recentNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentNotices.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No notices available currently.
          </div>
        )}
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-xl font-bold text-slate-900">Modern Digital Notice Management</h2>
            <p className="text-sm text-slate-600 mt-1">
              Engineered using the MERN stack with JWT authentication and role-based access control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-semibold text-xs border border-blue-100">
                01
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Role-Based Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated administration dashboard with permissions for publishing and managing notices, while students receive instant read access without clutter.
              </p>
            </div>

            <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-semibold text-xs border border-blue-100">
                02
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Categorized Channels</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every announcement is classified under Academic, Examination, Events, Placement, or General to enable targeted discovery and prevent missed deadlines.
              </p>
            </div>

            <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-semibold text-xs border border-blue-100">
                03
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Instant Search & Filter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time keyword search and segmented category filters allow students and faculty to locate past or upcoming circulars in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
