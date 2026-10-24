import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { StudentNoticesPage } from './pages/StudentNoticesPage.js';
import { NoticeDetailsPage } from './pages/NoticeDetailsPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { CreateNoticePage } from './pages/CreateNoticePage.js';
import { ManageNoticesPage } from './pages/ManageNoticesPage.js';
import { ShieldAlert } from 'lucide-react';

// Protected Route Component for Admin Only Pages
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The requested page is restricted to verified College Administrators. You are currently signed in as a Student ({user?.name}).
        </p>
        <div className="pt-2">
          <Navigate to="/notices" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public & Student Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/notices" element={<StudentNoticesPage />} />
              <Route path="/notices/:id" element={<NoticeDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/create"
                element={
                  <AdminRoute>
                    <CreateNoticePage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage"
                element={
                  <AdminRoute>
                    <ManageNoticesPage />
                  </AdminRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
