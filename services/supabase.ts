
import { createClient } from '@supabase/supabase-js';

// Supabase configuration

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing!');
}

// Create client only if credentials exist, otherwise create a dummy or throw controlled error
// For now we create it, but catching errors is hard for sync createClient.
// Better to pass empty strings if undefined, as createClient might validate format.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

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
