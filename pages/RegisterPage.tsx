
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        if (password.length < 6) {
            setError('密码至少需要6个字符');
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password, name);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || '注册失败，请重试');
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

            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 overflow-y-auto">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl border-2 border-primary flex items-center justify-center font-black text-3xl text-primary mx-auto mb-4">C</div>
                        <h1 className="text-2xl font-black">创建账号</h1>
                        <p className="text-text-secondary dark:text-gray-500 mt-2">加入凑凑，发现精彩活动</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">昵称</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary transition-colors"
                                placeholder="你希望别人怎么称呼你？"
                                required
                            />
                        </div>

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
                                placeholder="至少6个字符"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">确认密码</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary transition-colors"
                                placeholder="再次输入密码"
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
                                '注册'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        已有账号？
                        <Link to="/login" className="text-primary font-bold ml-1">立即登录</Link>
                    </p>

                    <p className="text-center text-[10px] text-gray-400 mt-6 px-4">
                        点击注册即代表同意 <a className="underline" href="#">用户协议</a> 和 <a className="underline" href="#">隐私政策</a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
