
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { updateUserProfile, updatePassword } from '../services/authService.ts';
import { getCreditLevel } from '../utils/creditLevel.ts';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 密码修改相关状态
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // 初始化用户数据
  useEffect(() => {
    if (user) {
      setNickname(user.name);
    }
  }, [user]);

  // 保存用户资料到数据库
  const handleSave = async () => {
    if (!user || !nickname.trim()) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      await updateUserProfile(user.id, { name: nickname.trim() });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('保存失败:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) return;

    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('退出失败:', error);
      setIsLoggingOut(false);
    }
  };

  // 修改密码
  const handlePasswordChange = async () => {
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('密码至少需要6个字符');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await updatePassword(newPassword);
      alert('密码修改成功！');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      setPasswordError(error.message || '密码修改失败');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 获取保存按钮样式和文字
  const getSaveButtonProps = () => {
    switch (saveStatus) {
      case 'saving':
        return { text: '保存中...', className: 'text-gray-400' };
      case 'saved':
        return { text: '已保存', className: 'text-emerald-500' };
      case 'error':
        return { text: '保存失败', className: 'text-red-500' };
      default:
        return { text: '保存', className: 'text-primary' };
    }
  };

  const saveButtonProps = getSaveButtonProps();

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden font-body">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">设置</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`text-sm font-bold transition-colors disabled:opacity-50 ${saveButtonProps.className}`}
        >
          {saveButtonProps.text}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        <section className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">基本资料</label>
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-sm font-medium">头像</span>
              <img src={user.avatar} className="size-12 rounded-full object-cover border-2 border-primary/20" />
            </div>

            <div className="flex flex-col gap-1.5 py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-xs text-gray-400">昵称</span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-base font-bold p-0"
                placeholder="设置你的昵称"
              />
            </div>

            <div className="flex flex-col gap-1.5 py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-xs text-gray-400">邮箱</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">用户 ID</span>
              <span className="text-sm text-gray-400 font-mono">{user.id.slice(0, 8)}...</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">账号安全</label>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
              <span className="text-sm font-medium">等级</span>
              <span className={`text-sm font-bold ${getCreditLevel(user.creditScore).color}`}>{getCreditLevel(user.creditScore).name}</span>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium">修改密码</span>
              <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="pt-8 space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-bold active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="size-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                退出中...
              </>
            ) : (
              '退出登录'
            )}
          </button>
          <p className="text-[10px] text-gray-400 text-center px-8 leading-relaxed">
            退出后需要重新登录才能使用全部功能
          </p>
        </section>

        <div className="py-10 text-center">
          <p className="text-[10px] text-gray-300 font-black tracking-[0.2em]">COUCOU VERSION 1.2.0</p>
        </div>
      </main>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">修改密码</h2>
              <button onClick={() => setShowPasswordModal(false)} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {passwordError && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-xl">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">确认新密码</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={isUpdatingPassword}
              className="w-full h-12 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isUpdatingPassword ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '确认修改'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
