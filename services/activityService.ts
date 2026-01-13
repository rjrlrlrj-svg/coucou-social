
import { supabase, DbActivity, DbUser } from './supabase.ts';
import { Activity, Participant, ActivityCategory } from '../types.ts';

// Helper to convert DB activity to frontend Activity type
const toActivity = (
    dbActivity: DbActivity & {
        organizer: DbUser;
        participants: Array<{ user: DbUser; joined_at: string }>
    }
): Activity => {
    return {
        id: dbActivity.id,
        title: dbActivity.title,
        description: dbActivity.description,
        category: dbActivity.category,
        tag: dbActivity.tag,
        time: new Date(dbActivity.time).toLocaleString('zh-CN'),
        location: dbActivity.location,
        address: dbActivity.address,
        costType: dbActivity.cost_type,
        costDetail: dbActivity.cost_detail,
        status: dbActivity.status,
        maxParticipants: dbActivity.max_participants,
        images: dbActivity.images,
        organizer: {
            name: dbActivity.organizer.name,
            avatar: dbActivity.organizer.avatar,
            creditScore: dbActivity.organizer.credit_score
        },
        participants: dbActivity.participants.map(p => ({
            id: p.user.id,
            name: p.user.name,
            avatar: p.user.avatar
        }))
    };
};

// Get all activities with optional filters
export const getActivities = async (
    category?: ActivityCategory,
    searchTerm?: string
): Promise<Activity[]> => {
    let query = supabase
        .from('activities')
        .select(`
      *,
      organizer:users!organizer_id(*),
      participants:activity_participants(
        user:users(*),
        joined_at
      )
    `)
        .order('created_at', { ascending: false });

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching activities:', error.message);
        return [];
    }

    return (data || []).map(toActivity);
};

// Get single activity by ID
export const getActivityById = async (id: string): Promise<Activity | null> => {
    const { data, error } = await supabase
        .from('activities')
        .select(`
      *,
      organizer:users!organizer_id(*),
      participants:activity_participants(
        user:users(*),
        joined_at
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching activity:', error.message);
        return null;
    }

    return toActivity(data);
};

// Create a new activity
export const createActivity = async (
    activity: Omit<Activity, 'id' | 'organizer' | 'participants' | 'status'>,
    organizerId: string
): Promise<Activity | null> => {
    const { data, error } = await supabase
        .from('activities')
        .insert({
            title: activity.title,
            description: activity.description,
            category: activity.category,
            tag: activity.tag,
            time: new Date(activity.time).toISOString(),
            location: activity.location,
            address: activity.address,
            cost_type: activity.costType,
            cost_detail: activity.costDetail,
            max_participants: activity.maxParticipants,
            images: activity.images,
            organizer_id: organizerId,
            status: 'recruiting'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating activity:', error.message);
        throw new Error(error.message);
    }

    // Auto-join the organizer as first participant
    await joinActivity(data.id, organizerId);

    return getActivityById(data.id);
};

// Join an activity
export const joinActivity = async (activityId: string, userId: string): Promise<boolean> => {
    // Check if already joined
    const { data: existing } = await supabase
        .from('activity_participants')
        .select('id')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single();

    if (existing) {
        return true; // Already joined
    }

    const { error } = await supabase
        .from('activity_participants')
        .insert({
            activity_id: activityId,
            user_id: userId
        });

    if (error) {
        console.error('Error joining activity:', error.message);
        throw new Error(error.message);
    }

    // Check if activity is now full and update status
    await updateActivityStatus(activityId);

    return true;
};

// Leave an activity
export const leaveActivity = async (activityId: string, userId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('activity_participants')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error leaving activity:', error.message);
        throw new Error(error.message);
    }

    // Update activity status
    await updateActivityStatus(activityId);

    return true;
};

// Update activity status based on participant count
const updateActivityStatus = async (activityId: string): Promise<void> => {
    const { data: activity } = await supabase
        .from('activities')
        .select('max_participants')
        .eq('id', activityId)
        .single();

    const { count } = await supabase
        .from('activity_participants')
        .select('*', { count: 'exact', head: true })
        .eq('activity_id', activityId);

    if (activity && count !== null) {
        const newStatus = count >= activity.max_participants ? 'full' : 'recruiting';
        await supabase
            .from('activities')
            .update({ status: newStatus })
            .eq('id', activityId);
    }
};

// Get activities for a specific user (organized or joined)
export const getUserActivities = async (userId: string): Promise<{
    organized: Activity[];
    joined: Activity[];
}> => {
    // Get organized activities
    const { data: organized } = await supabase
        .from('activities')
        .select(`
      *,
      organizer:users!organizer_id(*),
      participants:activity_participants(
        user:users(*),
        joined_at
      )
    `)
        .eq('organizer_id', userId);

    // Get joined activities
    const { data: participations } = await supabase
        .from('activity_participants')
        .select(`
      activity:activities(
        *,
        organizer:users!organizer_id(*),
        participants:activity_participants(
          user:users(*),
          joined_at
        )
      )
    `)
        .eq('user_id', userId);

    return {
        organized: (organized || []).map(toActivity),
        joined: (participations || [])
            .map(p => p.activity)
            .filter(Boolean)
            .map(toActivity)
    };
};

// Get user stats
export const getUserStats = async (userId: string): Promise<{ started: number; joined: number }> => {
    const { count: started } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', userId);

    const { count: joined } = await supabase
        .from('activity_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    return {
        started: started || 0,
        joined: joined || 0
    };
};

// 更新活动信息
export const updateActivity = async (
    activityId: string,
    updates: Partial<{
        title: string;
        description: string;
        time: string;
        location: string;
        address: string;
        costType: string;
        costDetail: string;
        maxParticipants: number;
    }>,
    organizerId: string
): Promise<Activity | null> => {
    // 验证是否为发起人
    const { data: existing } = await supabase
        .from('activities')
        .select('organizer_id, title')
        .eq('id', activityId)
        .single();

    if (!existing || existing.organizer_id !== organizerId) {
        throw new Error('无权编辑此活动');
    }

    // 构建更新对象
    const dbUpdates: Record<string, any> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.time !== undefined) dbUpdates.time = new Date(updates.time).toISOString();
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.costType !== undefined) dbUpdates.cost_type = updates.costType;
    if (updates.costDetail !== undefined) dbUpdates.cost_detail = updates.costDetail;
    if (updates.maxParticipants !== undefined) dbUpdates.max_participants = updates.maxParticipants;

    const { error } = await supabase
        .from('activities')
        .update(dbUpdates)
        .eq('id', activityId);

    if (error) {
        console.error('Error updating activity:', error.message);
        throw new Error(error.message);
    }

    // 通知所有参与者
    await notifyParticipantsOnUpdate(activityId, existing.title);

    return getActivityById(activityId);
};

// 向活动的所有参与者发送更新通知
const notifyParticipantsOnUpdate = async (activityId: string, activityTitle: string): Promise<void> => {
    // 获取所有参与者
    const { data: participants } = await supabase
        .from('activity_participants')
        .select('user_id')
        .eq('activity_id', activityId);

    if (!participants || participants.length === 0) return;

    // 为每个参与者创建系统通知
    const notifications = participants.map(p => ({
        sender_id: p.user_id,
        receiver_id: p.user_id,
        content: `【${activityTitle}】活动信息已更新，请查看最新详情。`,
        type: 'system',
        activity_id: activityId
    }));

    await supabase.from('chat_messages').insert(notifications);
};
