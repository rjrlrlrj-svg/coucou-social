
export type ActivityCategory = 'badminton' | 'basketball' | 'group_buy' | 'mystery_game' | 'all';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  organizer: {
    name: string;
    avatar: string;
    creditScore: number;
  };
  category: ActivityCategory;
  tag: string;
  time: string;
  timeLeft?: string;
  location: string;
  address: string;
  costType: string;
  costDetail: string;
  participants: Participant[];
  maxParticipants: number;
  description: string;
  images: string[];
  status: 'recruiting' | 'full' | 'ended';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  creditScore: number;
  stats: {
    started: number;
    joined: number;
    collected: number;
  };
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  type: 'system' | 'user' | 'group';
}

export interface ActivityUpdate {
  id: string;
  activityId: string;
  activityTitle: string;
  type: 'progress' | 'member' | 'status';
  content: string;
  time: string;
  progress?: number; // 0-100 for group buys
  userAvatar?: string;
}
