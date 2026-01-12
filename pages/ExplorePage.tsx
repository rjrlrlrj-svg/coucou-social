import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_UPDATES } from '../constants.tsx';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-black tracking-tight">项目动态</h1>
        <p className="text-[11px] text-text-secondary dark:text-gray-500 font-medium">实时追踪你参与的项目进展</p>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Pulse List */}
        <div className="space-y-4">
          {MOCK_UPDATES.map((update) => (
            <div 
              key={update.id}
              onClick={() => navigate(`/activity/${update.activityId}`)}
              className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex gap-3 mb-3">
                {update.userAvatar ? (
                  <img src={update.userAvatar} className="size-10 rounded-xl object-cover" alt="User" />
                ) : (
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">notification_important</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold truncate pr-2">{update.activityTitle}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0">{update.time}</span>
                  </div>
                  <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 leading-relaxed">
                    {update.content}
                  </p>
                </div>
              </div>

              {/* Progress Bar for 'progress' type */}
              {update.type === 'progress' && update.progress !== undefined && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-secondary">成团进度</span>
                    <span>{update.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-1000" 
                      style={{ width: `${update.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Link */}
              <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                <span className="text-[10px] font-bold text-primary flex items-center">
                  查看详情 <span className="material-symbols-outlined text-[14px] ml-0.5">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State / Footer */}
        <div className="py-16 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
          <div className="size-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">已加载全部动态</p>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;