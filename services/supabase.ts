
import { createClient } from '@supabase/supabase-js';

// Supabase configuration

// Supabase configuration
// Sanitize URL: remove trailing slashes, spaces, and frequent mistake suffixes like /v1
const cleanUrl = (url?: string) => {
  if (!url) return '';
  return url.trim().replace(/\/+$/, '').replace(/\/v1$/, '');
};

const supabaseUrl = cleanUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
  console.error('CRITICAL: Supabase config missing/invalid. Check .env.local or Netlify env vars.');
} else {
  console.log(`Supabase Client Initialized: ${supabaseUrl.substring(0, 15)}...`);
}

// Create client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// 验证与 Supabase 的连接状态，用于在应用启动时进行健康检查
// 验证与 Supabase 的连接状态，用于在应用启动时进行健康检查
export const verifyConnection = async () => {
  // 如果使用的是占位符 URL，直接视为连接失败
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.error('Connection check failed: Using placeholder URL');
    return false;
  }

  try {
    // 并行检查数据库和认证服务
    const [dbCheck, authCheck] = await Promise.all([
      supabase.from('activities').select('count', { count: 'exact', head: true }),
      supabase.auth.getSession()
    ]);

    if (dbCheck.error) throw dbCheck.error;
    if (authCheck.error) throw authCheck.error;

    return true;
  } catch (e) {
    console.error('Supabase connection failed:', e);
    return false;
  }
};

// Database types
export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credit_score: number;
  created_at: string;
}

export interface DbActivity {
  id: string;
  title: string;
  description: string;
  category: 'badminton' | 'basketball' | 'group_buy' | 'mystery_game';
  tag: string;
  time: string;
  location: string;
  address: string;
  cost_type: string;
  cost_detail: string;
  status: 'recruiting' | 'full' | 'ended';
  max_participants: number;
  images: string[];
  organizer_id: string;
  created_at: string;
}

export interface DbActivityParticipant {
  id: string;
  activity_id: string;
  user_id: string;
  joined_at: string;
}

export interface DbChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  activity_id: string | null;
  content: string;
  type: 'system' | 'user' | 'group';
  is_read: boolean;
  created_at: string;
}

export interface DbActivityUpdate {
  id: string;
  activity_id: string;
  type: 'progress' | 'member' | 'status';
  content: string;
  progress: number;
  created_at: string;
}
