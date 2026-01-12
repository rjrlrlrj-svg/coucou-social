-- CouCou Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '凑凑用户',
    avatar TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOFYQvXk23JKRY9DQMvyfkFbWrBGgJoNritczDGCeuymaLW0KfsnwPKQygIMNvAmUh1xKK1o_KDK2AEr9-WF-6p2LzZJU5o7GgZBSARVIDaZxBFTJqh9gcskYOLW-Wd2F9VLCl7HoIbSJcC4QZbGHYHzwMqZjE35ZRRtITmpMJGmlXFNjSYPBY5eebh59RWR0COaBhD7yEuQ9_SzcebHNU7v0-y83TDTk8-FOzPX8uOfCLJe6qMAEHLqtPjZFdwuQ5sfGxLxE07lay',
    credit_score INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL CHECK (category IN ('badminton', 'basketball', 'group_buy', 'mystery_game')),
    tag TEXT DEFAULT '',
    time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    address TEXT DEFAULT '',
    cost_type TEXT DEFAULT 'AA制',
    cost_detail TEXT DEFAULT '',
    status TEXT DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'full', 'ended')),
    max_participants INTEGER DEFAULT 4,
    images TEXT[] DEFAULT ARRAY['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1000&auto=format&fit=crop'],
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY PARTICIPANTS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'user' CHECK (type IN ('system', 'user', 'group')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY UPDATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'progress' CHECK (type IN ('progress', 'member', 'status')),
    content TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_organizer ON activities(organizer_id);
CREATE INDEX IF NOT EXISTS idx_participants_activity ON activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON activity_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_updates_activity ON activity_updates(activity_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_updates ENABLE ROW LEVEL SECURITY;

-- Users: Anyone can read, users can update their own profile
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Activities: Anyone can read, authenticated users can create, organizers can update/delete
CREATE POLICY "Activities are viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create activities" ON activities FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own activities" ON activities FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete own activities" ON activities FOR DELETE USING (auth.uid() = organizer_id);

-- Participants: Anyone can read, authenticated users can join/leave
CREATE POLICY "Participants are viewable by everyone" ON activity_participants FOR SELECT USING (true);
CREATE POLICY "Users can join activities" ON activity_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave activities" ON activity_participants FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can read their own messages
CREATE POLICY "Users can read own messages" ON chat_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Updates: Anyone can read activity updates
CREATE POLICY "Updates are viewable by everyone" ON activity_updates FOR SELECT USING (true);
CREATE POLICY "System can create updates" ON activity_updates FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTION: Create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', '凑凑用户'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
