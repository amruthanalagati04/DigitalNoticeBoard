import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Menu, X, Bell, Shield, LogOut, User as UserIcon, PlusCircle, LayoutDashboard, FileText } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/src/assets/images/lbrce_official_logo.png"
              alt="LBRCE Official Logo"
              className="h-12 w-auto max-w-[48px] object-contain shrink-0 drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors whitespace-nowrap">
                LBRCE
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                Digital Notice Board
              </span>
            </div>
          </Link>

          {/* Zone 2: Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors whitespace-nowrap ${
                isActive('/') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/notices"
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive('/notices') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Notices</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/admin') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  to="/admin/manage"
                  className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/admin/manage') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Manage Notices</span>
                </Link>
              </>
            )}
          </nav>

          {/* Zone 3: Actions / User Profile */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    to="/admin/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Notice</span>
                  </Link>
                ) : null}

                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 capitalize font-medium flex items-center justify-end gap-1">
                      {user.role === 'admin' ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5 inline" /> Admin
                        </span>
                      ) : (
                        <span>Student</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs whitespace-nowrap"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/notices"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Notices
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/manage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Manage Notices
                </Link>
                <Link
                  to="/admin/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-blue-900 bg-blue-50 font-semibold"
                >
                  Create New Notice
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role} · {user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-900 rounded-lg"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
