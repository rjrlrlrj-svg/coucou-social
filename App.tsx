
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import WelcomePage from './pages/WelcomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import HomePage from './pages/HomePage.tsx';
import DetailPage from './pages/DetailPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import CreatePage from './pages/CreatePage.tsx';
import MessagesPage from './pages/MessagesPage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import EditActivityPage from './pages/EditActivityPage.tsx';
import BottomNav from './components/BottomNav.tsx';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const showBottomNav = user && ['/home', '/profile', '/messages', '/explore'].includes(location.pathname);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false); // Demo Mode: Don't block

  useEffect(() => {
    console.log('App Build: 2026-01-13 12:56 - Verifying Connection...');
    // 组件挂载时检查数据库连接状态
    import('./services/supabase.ts').then(({ verifyConnection }) => {
      verifyConnection().then(ok => {
        if (!ok) {
          console.warn('Supabase connection failed. Running in Demo Mode.');
        }
        // Force success to avoid blocking UI for prototype demo
        setConnectionError(false);
        setIsCheckingConnection(false);
      });
    });

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  if (isCheckingConnection) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">正在连接服务器...</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-red-50 text-red-800 text-center">
        <div>
          <span className="material-symbols-outlined text-[48px] mb-4">error</span>
          <h1 className="text-xl font-bold mb-2">连接失败</h1>
          <p className="text-sm">无法连接到 Supabase 服务器。</p>
          <p className="text-xs mt-2 opacity-75">请检查 Netlify 环境变量配置 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background-light dark:bg-background-dark overflow-hidden flex flex-col shadow-2xl">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute><MessagesPage /></ProtectedRoute>
        } />
        <Route path="/explore" element={
          <ProtectedRoute><ExplorePage /></ProtectedRoute>
        } />
        <Route path="/activity/:id" element={
          <ProtectedRoute><DetailPage /></ProtectedRoute>
        } />
        <Route path="/activity/edit/:id" element={
          <ProtectedRoute><EditActivityPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage onToggleDark={toggleDarkMode} isDark={isDarkMode} /></ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute><CreatePage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
