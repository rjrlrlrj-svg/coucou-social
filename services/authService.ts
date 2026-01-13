
import { supabase, DbUser } from './supabase.ts';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar: string;
    creditScore: number;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string): Promise<AuthUser | null> => {
    // 再次检查是否配置了有效 URL
    const url = (supabase as any).supabaseUrl || '';
    if (url.includes('placeholder')) {
        throw new Error('系统配置错误：未检测到 Supabase URL，请检查 Netlify 环境变量');
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) {
        console.error('Sign up error:', error.message);
        throw new Error(error.message);
    }

    if (data.user) {
        // Wait a bit for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 500));
        return getCurrentUser();
    }

    return null;
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('Sign in error:', error.message);
        throw new Error(error.message);
    }

    if (data.user) {
        return getCurrentUser();
    }

    return null;
};

// Sign out
export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Sign out error:', error.message);
        throw new Error(error.message);
    }
};

// Get current authenticated user with profile
export const getCurrentUser = async (): Promise<AuthUser | null> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        console.error('Error fetching user profile:', error?.message);
        return null;
    }

    return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        creditScore: profile.credit_score
    };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<Pick<DbUser, 'name' | 'avatar'>>): Promise<AuthUser | null> => {
    const { error } = await supabase
        .from('users')
        .update({
            name: updates.name,
            avatar: updates.avatar
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error.message);
        throw new Error(error.message);
    }

    return getCurrentUser();
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const user = await getCurrentUser();
            callback(user);
        } else {
            callback(null);
        }
    });
};

// Get session
export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// 修改密码
export const updatePassword = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error('Update password error:', error.message);
        throw new Error(error.message);
    }
};
