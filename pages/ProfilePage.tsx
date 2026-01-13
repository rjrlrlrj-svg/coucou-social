
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getUserActivities, getUserStats } from '../services/activityService.ts';
import { Activity } from '../types.ts';
import { getCreditLevel } from '../utils/creditLevel.ts';

interface ProfilePageProps {
  onToggleDark: () => void;
  isDark: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onToggleDark, isDark }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ started: 0, joined: 0 });
  const [joinedActivities, setJoinedActivities] = useState<Activity[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // 并行加载统计数据和活动列表
        const [statsData, activitiesData] = await Promise.all([
          getUserStats(user.id),
          getUserActivities(user.id)
        ]);

        setStats(statsData);
        setJoinedActivities(activitiesData.joined);
      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleIdentityVerify = () => {
    alert('认证功能开发中...');
  };

  const handleContactService = () => {
    alert('正在为您连接 AI 客服... 请稍后在“消息”中查看回复。');
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto no-scrollbar relative">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="w-10" />
        <h1 className="text-lg font-bold">个人中心</h1>
        <div className="flex items-center gap-1">
          <button onClick={onToggleDark} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[24px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="px-4 pt-8 pb-6 flex flex-col items-center">
            <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg relative">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
            <div className="mt-2 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-primary text-[16px] fill-current">workspace_premium</span>
              <span className={`text-sm font-bold ${getCreditLevel(user.creditScore).color}`}>{getCreditLevel(user.creditScore).name}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 max-w-[200px] text-center">{getCreditLevel(user.creditScore).description}</p>
          </div>

          <div className="px-4 mb-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between">
              <div className="flex flex-col items-center flex-1 border-r border-gray-100 dark:border-gray-800">
                <span className="text-2xl font-black text-primary">{stats.started}</span>
                <span className="text-xs text-text-secondary">我发起的</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-2xl font-black text-secondary">{stats.joined}</span>
                <span className="text-xs text-text-secondary">我参与的</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="px-4 space-y-3">
        {/* 我的订单 */}
        <button
          onClick={() => setShowOrders(true)}
          className="w-full bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 p-4 active:scale-[0.98] transition-all"
        >
          <div className="size-10 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <p className="flex-1 text-left font-bold">我的活动订单</p>
          <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
        </button>

        {/* 实名认证 */}
        <button
          onClick={handleIdentityVerify}
          className="w-full bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 p-4 active:scale-[0.98] transition-all"
        >
          <div className="size-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-500 shrink-0">
            <span className="material-symbols-outlined">badge</span>
          </div>
          <p className="flex-1 text-left font-bold">实名认证</p>
          <span className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">已认证</span>
        </button>

        {/* 联系客服 */}
        <button
          onClick={handleContactService}
          className="w-full bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 p-4 active:scale-[0.98] transition-all"
        >
          <div className="size-10 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 shrink-0">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <p className="flex-1 text-left font-bold">联系 AI 客服</p>
          <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
        </button>

        {/* 设置跳转 */}
        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 p-4 active:scale-[0.98] transition-all"
        >
          <div className="size-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
            <span className="material-symbols-outlined">settings</span>
          </div>
          <p className="flex-1 text-left font-bold">偏好设置</p>
          <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* 我的活动订单弹窗 */}
      {showOrders && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">参与的项目 ({joinedActivities.length})</h3>
              <button onClick={() => setShowOrders(false)} className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {joinedActivities.length > 0 ? (
                joinedActivities.map(act => (
                  <div
                    key={act.id}
                    onClick={() => { setShowOrders(false); navigate(`/activity/${act.id}`); }}
                    className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <img src={act.images[0]} className="size-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate dark:text-gray-100">{act.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {act.time}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {act.location}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                  <p>暂无参与的活动</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
