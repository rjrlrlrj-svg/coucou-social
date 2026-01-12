
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || '登录失败，请检查邮箱和密码');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            <header className="sticky top-0 z-20 flex items-center px-4 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl border-2 border-primary flex items-center justify-center font-black text-3xl text-primary mx-auto mb-4">C</div>
                        <h1 className="text-2xl font-black">欢迎回来</h1>
                        <p className="text-text-secondary dark:text-gray-500 mt-2">登录您的凑凑账号</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">邮箱地址</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary transition-colors"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">密码</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 text-white text-base font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                '登录'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        还没有账号？
                        <Link to="/register" className="text-primary font-bold ml-1">立即注册</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
