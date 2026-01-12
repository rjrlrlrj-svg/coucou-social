
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/activityService.ts';
import { Activity, ActivityCategory } from '../types.ts';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await getActivities(activeCategory, searchTerm);
      setAllActivities(data);
    } catch (error) {
      console.error('Failed to load activities', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [activeCategory, searchTerm]);

  const categories = [
    { id: 'all', label: '全部', icon: 'grid_view', color: 'bg-primary' },
    { id: 'badminton', label: '羽毛球', icon: 'sports_tennis', color: 'bg-orange-500' },
    { id: 'basketball', label: '篮球', icon: 'sports_basketball', color: 'bg-red-500' },
    { id: 'group_buy', label: '拼团', icon: 'shopping_bag', color: 'bg-blue-500' },
    { id: 'mystery_game', label: '剧本杀', icon: 'theater_comedy', color: 'bg-purple-500' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadActivities();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800/50">
        <form onSubmit={handleSearchSubmit} className="flex flex-col w-full h-11 mb-3">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-gray-100/60 dark:bg-surface-dark border border-transparent focus-within:border-primary/40 transition-all overflow-hidden">
            <div className="text-gray-400 flex items-center justify-center pl-4 pr-2">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-text-main dark:text-white placeholder:text-gray-400 px-0 text-sm"
              placeholder="搜索感兴趣的内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ActivityCategory)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${activeCategory === cat.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 text-gray-500'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {cat.icon}
              </span>
              <p className="text-sm font-bold">{cat.label}</p>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight">
              {activeCategory === 'all' ? '发现活动' : categories.find(c => c.id === activeCategory)?.label}
            </h2>
            {searchTerm && <span className="text-xs text-gray-400 font-medium">“{searchTerm}”</span>}
          </div>
          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
            {allActivities.length} Items
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-xs text-gray-400">正在加载活动...</p>
          </div>
        ) : allActivities.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {allActivities.map((act) => {
              const catInfo = categories.find(c => c.id === act.category);
              return (
                <div
                  key={act.id}
                  onClick={() => navigate(`/activity/${act.id}`)}
                  className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm overflow-hidden active:scale-[0.97] transition-all cursor-pointer border border-gray-50 dark:border-gray-800/50"
                >
                  <div
                    className="w-full aspect-[4/3] bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${act.images[0]})` }}
                  >
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className={`${catInfo?.color || 'bg-primary'} text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase`}>
                        {catInfo?.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="text-xs font-bold truncate dark:text-gray-100">{act.title}</h3>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
                      <span className="text-[9px] truncate font-medium">{act.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 dark:border-gray-800/50">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {act.participants.length > 0 ? (
                          act.participants.slice(0, 3).map(p => (
                            <img key={p.id} src={p.avatar} className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover" />
                          ))
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[8px] text-gray-300">?</div>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-black text-primary">{act.participants.length}</span>
                        <span className="text-[8px] text-gray-300">/</span>
                        <span className="text-[9px] text-gray-400">{act.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-20 bg-gray-50 dark:bg-surface-dark rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px] text-gray-300">event_busy</span>
            </div>
            <h3 className="text-sm font-bold text-gray-500">暂无活动内容</h3>
            <p className="text-[10px] text-gray-400 mt-1">换个分类看看，或者发起一个新活动</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
