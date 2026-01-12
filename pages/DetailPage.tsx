
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, joinActivity } from '../services/activityService.ts';
import { createActivityNotification } from '../services/messageService.ts';
import { Activity } from '../types.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [act, setAct] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // 加载活动详情
  const loadActivity = async () => {
    if (!id) return;
    try {
      const data = await getActivityById(id);
      setAct(data);
    } catch (error) {
      console.error('Failed to load activity', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, [id]);

  // 检查当前用户是否已加入
  useEffect(() => {
    if (act && user) {
      const alreadyJoined = act.participants.some(p => p.id === user.id);
      setHasApplied(alreadyJoined);
    }
  }, [act, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!act || !id) return;

    setIsApplying(true);

    try {
      // 加入活动
      await joinActivity(id, user.id);

      // 如果是拼团，发送系统通知
      if (act.category === 'group_buy') {
        await createActivityNotification(
          id,
          act.title,
          '恭喜！您已成功加入拼团。',
          user.id
        );
      }

      // 刷新数据
      await loadActivity();
      setHasApplied(true);

      alert(act.category === 'group_buy' ? '申请成功！请查看消息通知。' : '申请已提交，你已成功加入活动！');

    } catch (e) {
      console.error(e);
      alert('加入活动失败，请重试');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark h-full">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!act) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-8 text-center h-full">
        <div className="size-32 bg-white dark:bg-surface-dark rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3">
          <span className="material-symbols-outlined text-[64px] text-gray-200 dark:text-gray-700">query_stats</span>
        </div>
        <h2 className="text-2xl font-black mb-3">活动已跑路...</h2>
        <p className="text-text-secondary dark:text-gray-500 mb-10 leading-relaxed text-sm">
          糟糕！这个活动可能已经结束、被发起人取消，或者正在躲避你的搜索。
        </p>
        <button onClick={() => navigate('/home')} className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">home</span> 回到首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark pb-[100px] overflow-y-auto no-scrollbar relative">
      <div className="relative w-full h-[280px] shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${act.images[0]})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-10 text-white">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <div className="flex gap-3">
            <button className="size-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"><span className="material-symbols-outlined">favorite_border</span></button>
            <button className="size-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"><span className="material-symbols-outlined">share</span></button>
          </div>
        </div>
      </div>

      <div className="relative -mt-6 px-4 z-20 space-y-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
              {act.status === 'full' ? '已满员' : '招募中'}
            </div>
            <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">{act.tag}</div>
          </div>
          <h1 className="text-2xl font-bold dark:text-white leading-tight">{act.title}</h1>
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <img src={act.organizer.avatar} className="size-10 rounded-full object-cover" alt="Avatar" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{act.organizer.name}</span>
              <span className="text-xs text-text-secondary dark:text-gray-500">发起人 · 信用分 {act.organizer.creditScore}</span>
            </div>
          </div>
          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[18px]">calendar_today</span></div>
              <span className="text-sm font-medium">{act.time}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-500 shrink-0"><span className="material-symbols-outlined text-[18px]">location_on</span></div>
              <span className="text-sm font-medium">{act.location}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded bg-green-50 dark:bg-green-950 flex items-center justify-center text-green-500 shrink-0"><span className="material-symbols-outlined text-[18px]">payments</span></div>
              <span className="text-sm font-medium">{act.costType} - {act.costDetail}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm p-5">
          <h2 className="text-base font-bold mb-3">活动详情</h2>
          <div className="text-sm text-text-main dark:text-gray-300 whitespace-pre-line leading-relaxed">{act.description}</div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm p-5">
          <h2 className="text-base font-bold mb-4">已加入成员 ({act.participants.length}/{act.maxParticipants})</h2>
          <div className="flex flex-wrap gap-4">
            {act.participants.map(p => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <img src={p.avatar} className="size-12 rounded-full border-2 border-gray-100 dark:border-gray-800" alt={p.name} />
                <span className="text-[10px] text-gray-500 truncate w-12 text-center">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 safe-area-pb z-50">
        <div className="flex gap-4 items-center max-w-lg mx-auto w-full">
          <button className="flex flex-col items-center justify-center gap-1 text-text-secondary dark:text-gray-500 px-2">
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span className="text-[10px] font-medium">咨询</span>
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying || hasApplied || act.status === 'full'}
            className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${hasApplied
                ? 'bg-emerald-500 text-white cursor-default'
                : act.status === 'full'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-primary/20'
              }`}
          >
            {isApplying ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : hasApplied ? (
              <>已加入活动 <span className="material-symbols-outlined text-[18px]">check_circle</span></>
            ) : act.status === 'full' ? (
              '人数已满'
            ) : (
              '立即申请'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
