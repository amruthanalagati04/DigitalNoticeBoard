import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || (isAdmin ? '/admin' : '/notices');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/notices');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@college.edu');
      setPassword('Admin@123');
    } else {
      setEmail('student@college.edu');
      setPassword('Student@123');
    }
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Sign In to College Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access institutional notices, admin controls, and academic schedules
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
          <p className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Quick Demo Credentials</span>
            <span className="text-[10px] text-slate-400 font-normal">(Click to autofill)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-900 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px] group-hover:text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Login</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">admin@college.edu</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('student')}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-900 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px] group-hover:text-blue-900">
                <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Student Login</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">student@college.edu</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New student without credentials?{' '}
          <Link to="/register" className="font-semibold text-blue-900 hover:text-blue-700 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
