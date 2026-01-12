
import { supabase, DbUser, DbChatMessage } from './supabase.ts';
import { ChatMessage } from '../types.ts';

// Helper to convert DB message to frontend type
const toChatMessage = (
    dbMessage: DbChatMessage & { sender: DbUser }
): ChatMessage => {
    return {
        id: dbMessage.id,
        senderName: dbMessage.sender.name,
        senderAvatar: dbMessage.sender.avatar,
        lastMessage: dbMessage.content,
        time: formatTime(dbMessage.created_at),
        unreadCount: dbMessage.is_read ? 0 : 1,
        type: dbMessage.type
    };
};

// Format time for display
const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return '昨天';
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

// Get messages for a user (grouped by conversation)
export const getMessages = async (userId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
        .from('chat_messages')
        .select(`
      *,
      sender:users!sender_id(*)
    `)
        .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error.message);
        return [];
    }

    // Group by sender and get latest message per conversation
    const conversationMap = new Map<string, ChatMessage>();

    for (const msg of data || []) {
        const key = msg.type === 'system' ? 'system' :
            msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

        if (!conversationMap.has(key)) {
            conversationMap.set(key, toChatMessage(msg));
        }
    }

    return Array.from(conversationMap.values());
};

// Send a message
export const sendMessage = async (
    senderId: string,
    receiverId: string | null,
    content: string,
    type: 'user' | 'system' | 'group' = 'user',
    activityId?: string
): Promise<boolean> => {
    const { error } = await supabase
        .from('chat_messages')
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            type,
            activity_id: activityId
        });

    if (error) {
        console.error('Error sending message:', error.message);
        return false;
    }

    return true;
};

// Mark messages as read
export const markAsRead = async (userId: string, senderId: string): Promise<void> => {
    await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', senderId)
        .eq('is_read', false);
};

// Get unread count
export const getUnreadCount = async (userId: string): Promise<number> => {
    const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

    return count || 0;
};

// Create system notification for activity events
export const createActivityNotification = async (
    activityId: string,
    activityTitle: string,
    content: string,
    recipientId: string
): Promise<void> => {
    // Get system user or use a placeholder
    await supabase
        .from('chat_messages')
        .insert({
            sender_id: recipientId, // Self-sent system message
            receiver_id: recipientId,
            content: `【${activityTitle}】${content}`,
            type: 'system',
            activity_id: activityId
        });
};
