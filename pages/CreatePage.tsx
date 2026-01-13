
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { polishDescription } from '../services/geminiService.ts';
import { createActivity } from '../services/activityService.ts';
import { ActivityCategory } from '../types.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

// 导入合规的活动类别图片
import badmintonImg from '../assets/images/badminton.png';
import basketballImg from '../assets/images/basketball.png';
import groupBuyImg from '../assets/images/group_buy.png';
import mysteryGameImg from '../assets/images/mystery_game.png';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('badminton');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [cost, setCost] = useState('AA制');

  const [isPolishing, setIsPolishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: ActivityCategory; label: string; icon: string }[] = [
    { id: 'badminton', label: '羽毛球', icon: 'sports_tennis' },
    { id: 'basketball', label: '篮球', icon: 'sports_basketball' },
    { id: 'group_buy', label: '拼团', icon: 'shopping_bag' },
    { id: 'mystery_game', label: '剧本杀', icon: 'theater_comedy' }
  ];

  // 根据活动类别选择合规图片
  const categoryImages: Record<ActivityCategory, string> = {
    badminton: badmintonImg,
    basketball: basketballImg,
    group_buy: groupBuyImg,
    mystery_game: mysteryGameImg,
    all: badmintonImg // 默认图片
  };

  const handlePolish = async () => {
    if (!title || !description) return;
    setIsPolishing(true);
    try {
      const polished = await polishDescription(title, description);
      setDescription(polished);
    } catch (e) {
      console.error('Polish failed', e);
      alert('AI 润色失败，请稍后重试');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title || !time || !location) {
      alert('请填写活动标题、时间和地点');
      return;
    }

    setIsSubmitting(true);

    try {
      await createActivity({
        title,
        description: description || '暂无详细描述',
        category,
        time,
        location,
        address: location,
        tag: categories.find(c => c.id === category)?.label || '新活动',
        costType: cost,
        costDetail: cost === 'AA制' ? '按实际发生结算' : '固定费用',
        maxParticipants,
        images: [categoryImages[category]]
      }, user.id);

      navigate('/home');
    } catch (e) {
      console.error(e);
      alert('发布活动失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-hidden relative">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>
        <h1 className="text-lg font-bold">发起新活动</h1>
        <button onClick={() => { setTitle(''); setDescription(''); setTime(''); }} className="text-sm font-bold text-text-secondary">重置</button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-black text-gray-500 uppercase tracking-wider px-1">选择活动类型</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${category === cat.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-white dark:border-surface-dark bg-white dark:bg-surface-dark text-gray-400'
                  }`}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                <span className="font-bold">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
          <div className="space-y-2">
            <label className="text-sm font-bold">活动标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-base"
              placeholder="起一个吸引人的标题吧..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold">详情介绍</label>
              <button
                type="button"
                onClick={handlePolish}
                disabled={isPolishing || !title || !description}
                className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">{isPolishing ? 'sync' : 'magic_button'}</span>
                {isPolishing ? '润色中...' : 'AI 润色'}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none resize-none text-sm leading-relaxed"
              placeholder="详细描述一下活动内容、要求或注意事项..."
            />
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
          <div className="space-y-2">
            <label className="text-sm font-bold">活动时间</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] z-10 pointer-events-none">calendar_month</span>
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm block relative z-0"
              />
              {!time && <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10">点击选择活动日期和时间</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">活动地点</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">location_on</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm"
                placeholder="选择或输入活动地点"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-sm font-bold">人数上限</label>
              <span className="text-[10px] text-gray-400">包含发起人在内</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setMaxParticipants(Math.max(2, maxParticipants - 1))} className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">remove</span></button>
              <span className="w-8 text-center font-black text-lg">{maxParticipants}</span>
              <button onClick={() => setMaxParticipants(maxParticipants + 1)} className="size-8 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">add</span></button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-bold">费用说明</label>
            <div className="flex gap-2">
              {['AA制', '免费', '固定费'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setCost(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cost === opt ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 safe-area-pb z-30">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 text-white text-base font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>确认发布活动 <span className="material-symbols-outlined">rocket_launch</span></>}
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
