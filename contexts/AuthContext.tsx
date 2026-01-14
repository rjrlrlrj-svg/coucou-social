
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, getCurrentUser, onAuthStateChange, signIn, signUp, signOut } from '../services/authService.ts';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthUser | null>;
    signUp: (email: string, password: string, name: string) => Promise<AuthUser | null>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial session
        getCurrentUser().then((user) => {
            setUser(user);
        }).catch((err) => {
            console.warn('Auth check failed:', err);
            setUser(null);
        }).finally(() => {
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignIn = async (email: string, password: string) => {
        const user = await signIn(email, password);
        setUser(user);
        return user;
    };

    const handleSignUp = async (email: string, password: string, name: string) => {
        const user = await signUp(email, password, name);
        setUser(user);
        return user;
    };

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn: handleSignIn,
            signUp: handleSignUp,
            signOut: handleSignOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};
