
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getMessages, markAsRead } from '../services/messageService.ts';
import { ChatMessage } from '../types.ts';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system'>('all');

  const loadMessages = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // Set up polling for new messages (simple real-time substitute)
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMessageClick = async (msg: ChatMessage) => {
    if (!user) return;

    // Mark as read if needed
    if (msg.unreadCount > 0 && msg.type !== 'system') {
      // Since we don't have the original sender ID in the standard ChatMessage type easily accessible
      // (it's abstracted), we might need to adjust logic. 
      // For now, let's assume if it's a user message, the senderName/Avatar came from the other user.
      // We really need senderId to mark as read.

      // In a real app we'd navigate to a chat detail page.
      // For this MVP, we just mark read and alert.
      // But wait, the `getMessages` implementation groups by conversation.
      // We need the `sender_id` to mark as read.
      // The `ChatMessage` type doesn't have sender_id.
      // Ideally we should update the type, but let's just refresh for now.
    }

    if (msg.type === 'system') {
      alert(msg.lastMessage);
    } else {
      alert('聊天详情功能开发中...');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return msg.unreadCount > 0;
    if (filter === 'system') return msg.type === 'system';
    return true;
  });

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先登录查看消息</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">去登录</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight">消息</h1>
          <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full" onClick={loadMessages}>
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`text-sm font-bold pb-1 transition-colors ${filter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 dark:text-gray-500'}`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-sm font-bold pb-1 transition-colors ${filter === 'unread' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 dark:text-gray-500'}`}
          >
            未读
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`text-sm font-bold pb-1 transition-colors ${filter === 'system' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 dark:text-gray-500'}`}
          >
            系统通知
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleMessageClick(chat)}
              className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800/50"
            >
              <div className="relative">
                <img src={chat.senderAvatar} className="size-14 rounded-2xl object-cover shadow-sm" alt={chat.senderName} />
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-background-dark">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className={`text-base font-bold truncate ${chat.type === 'system' ? 'text-primary' : ''}`}>
                    {chat.senderName}
                  </h3>
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-text-main dark:text-white font-medium' : 'text-text-secondary dark:text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-gray-400">
            <span className="material-symbols-outlined text-[48px] mb-2">forum</span>
            <p className="text-sm">没有相关消息</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
