
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: 'home', label: '首页', path: '/home' },
    { icon: 'chat_bubble', label: '消息', path: '/messages', badge: true },
    { icon: 'add', label: '发布', path: '/create', special: true },
    { icon: 'explore', label: '动态', path: '/explore' },
    { icon: 'person', label: '我的', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full max-w-md bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          
          if (item.special) {
            return (
              <button 
                key={idx}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 transform transition-transform active:scale-95">
                  <span className="material-symbols-outlined text-[32px] text-white">add</span>
                </div>
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-12 gap-1 group relative"
            >
              <span className={`material-symbols-outlined text-[26px] transition-colors ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary'}`}>
                {item.label}
              </span>
              {item.badge && (
                <div className="absolute top-0.5 right-1.5 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-dark" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
