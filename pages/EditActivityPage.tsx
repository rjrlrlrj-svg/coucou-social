
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { polishDescription } from '../services/geminiService.ts';
import { getActivityById, updateActivity } from '../services/activityService.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

const EditActivityPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(4);
    const [cost, setCost] = useState('AA制');

    const [isPolishing, setIsPolishing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // 加载活动数据
    useEffect(() => {
        const loadActivity = async () => {
            if (!id) return;
            try {
                const activity = await getActivityById(id);
                if (activity) {
                    setTitle(activity.title);
                    setDescription(activity.description);
                    // 将显示时间转换回 datetime-local 格式
                    // activity.time 格式如 "2026/1/15 14:00:00"，需要转换
                    setLocation(activity.location);
                    setMaxParticipants(activity.maxParticipants);
                    setCost(activity.costType);
                }
            } catch (error) {
                console.error('Failed to load activity', error);
            } finally {
                setLoading(false);
            }
        };
        loadActivity();
    }, [id]);

    const handlePolish = async () => {
        if (!title || !description) return;
        setIsPolishing(true);
        try {
            const polished = await polishDescription(title, description);
            setDescription(polished);
        } catch (e) {
            console.error('Polish failed', e);
            alert('AI 润色失败，请稍后重试');
        } finally {
            setIsPolishing(false);
        }
    };

    const handleSubmit = async () => {
        if (!user || !id) return;
        if (!title || !location) {
            alert('请填写活动标题和地点');
            return;
        }

        setIsSubmitting(true);

        try {
            await updateActivity(id, {
                title,
                description: description || '暂无详细描述',
                time: time || undefined,
                location,
                address: location,
                costType: cost,
                costDetail: cost === 'AA制' ? '按实际发生结算' : '固定费用',
                maxParticipants
            }, user.id);

            alert('活动信息已更新，所有参与者已收到通知！');
            navigate(`/activity/${id}`);
        } catch (e: any) {
            console.error(e);
            alert(e.message || '更新活动失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark h-full">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-hidden relative">
            <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">close</span>
                </button>
                <h1 className="text-lg font-bold">编辑活动</h1>
                <div className="w-10" /> {/* 占位 */}
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">活动标题</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 px-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-base"
                            placeholder="活动标题..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">详情介绍</label>
                            <button
                                type="button"
                                onClick={handlePolish}
                                disabled={isPolishing || !title || !description}
                                className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[14px]">{isPolishing ? 'sync' : 'magic_button'}</span>
                                {isPolishing ? '润色中...' : 'AI 润色'}
                            </button>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none resize-none text-sm leading-relaxed"
                            placeholder="详细描述活动内容..."
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">活动时间（可选更改）</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] z-10 pointer-events-none">calendar_month</span>
                            <input
                                type="datetime-local"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm block relative z-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">活动地点</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">location_on</span>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-background-dark border-none rounded-xl outline-none text-sm"
                                placeholder="活动地点"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm space-y-5 border border-gray-50 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold">人数上限</label>
                            <span className="text-[10px] text-gray-400">包含发起人在内</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMaxParticipants(Math.max(2, maxParticipants - 1))} className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">remove</span></button>
                            <span className="w-8 text-center font-black text-lg">{maxParticipants}</span>
                            <button onClick={() => setMaxParticipants(maxParticipants + 1)} className="size-8 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">add</span></button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold">费用说明</label>
                        <div className="flex gap-2">
                            {['AA制', '免费', '固定费'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setCost(opt)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cost === opt ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 safe-area-pb z-30">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 text-white text-base font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>保存更改 <span className="material-symbols-outlined">check_circle</span></>}
                </button>
            </div>
        </div>
    );
};

export default EditActivityPage;
