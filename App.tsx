
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

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
