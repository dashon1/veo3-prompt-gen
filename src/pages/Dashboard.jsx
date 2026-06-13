import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { VideoGeneration } from '@/entities/VideoGeneration';
import { Character } from '@/entities/Character';
import { CreditTransaction } from '@/entities/CreditTransaction';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Sparkles, Video, Users, BookOpen, Zap, 
    FolderOpen, GitBranch, FlaskConical, Calendar, FileText,
    UserCircle, BarChart3, Clock, Coins
} from 'lucide-react';

const QuickAction = ({ icon: Icon, title, description, to, color }) => (
    <Link to={createPageUrl(to)}>
        <div className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer text-white`}>
            <Icon className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
        </div>
    </Link>
);

const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-white rounded-3xl p-6 shadow-md">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-sm text-slate-600">{label}</div>
                {change && (
                    <div className={`text-xs font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '+' : ''}{change}% this week
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        prompts: 0,
        generations: 0,
        characters: 0,
        credits: 0,
        creditsUsedThisWeek: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const userData = await User.me();
            setUser(userData);

            const [prompts, generations, characters, transactions] = await Promise.all([
                SavedPrompt.filter({ created_by: userData.email }),
                VideoGeneration.filter({ created_by: userData.email }),
                Character.filter({ created_by: userData.email }),
                CreditTransaction.filter({ user_email: userData.email }, '-created_date', 5)
            ]);

            // Calculate weekly credit usage
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const weeklyTransactions = transactions.filter(t => 
                new Date(t.created_date) > oneWeekAgo && t.amount < 0
            );
            const creditsUsedThisWeek = weeklyTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

            setStats({
                prompts: prompts.length,
                generations: generations.length,
                characters: characters.length,
                credits: userData.credits || 0,
                creditsUsedThisWeek
            });

            setRecentActivity(transactions);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-8 flex items-center justify-center">
                <div className="text-center">
                    <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">
                        Welcome back, {user?.full_name?.split(' ')[0] || 'Creator'}! 👋
                    </h1>
                    <p className="text-slate-600">Here's what's happening with your projects today</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={BookOpen}
                        label="Total Prompts"
                        value={stats.prompts}
                        color="from-purple-400 to-purple-500"
                    />
                    <StatCard
                        icon={Video}
                        label="Videos Generated"
                        value={stats.generations}
                        color="from-blue-400 to-blue-500"
                    />
                    <StatCard
                        icon={UserCircle}
                        label="Characters"
                        value={stats.characters}
                        color="from-green-400 to-green-500"
                    />
                    <StatCard
                        icon={Coins}
                        label="Available Credits"
                        value={stats.credits}
                        color="from-yellow-400 to-yellow-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickAction
                            icon={Sparkles}
                            title="Create Prompt"
                            description="Start building a new video prompt"
                            to="Builder"
                            color="from-purple-500 to-purple-600"
                        />
                        <QuickAction
                            icon={Video}
                            title="Generate Video"
                            description="Turn prompts into videos with AI"
                            to="VideoGeneration"
                            color="from-blue-500 to-blue-600"
                        />
                        <QuickAction
                            icon={FolderOpen}
                            title="Browse Projects"
                            description="Manage your project collections"
                            to="Projects"
                            color="from-green-500 to-green-600"
                        />
                        <QuickAction
                            icon={GitBranch}
                            title="Version History"
                            description="Track prompt iterations"
                            to="Versions"
                            color="from-orange-500 to-orange-600"
                        />
                    </div>
                </div>

                {/* Tools & Features */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Tools & Features</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link to={createPageUrl('Templates')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">Templates</h3>
                                <p className="text-sm text-slate-600">15+ professional templates</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('Community')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <Users className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">Community</h3>
                                <p className="text-sm text-slate-600">Discover shared prompts</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('Analytics')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">Analytics</h3>
                                <p className="text-sm text-slate-600">Track your style DNA</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('ABTesting')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <FlaskConical className="w-8 h-8 text-orange-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">A/B Testing</h3>
                                <p className="text-sm text-slate-600">Compare prompt variants</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('BatchGenerator')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <Zap className="w-8 h-8 text-yellow-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">Batch Generator</h3>
                                <p className="text-sm text-slate-600">Create multiple variations</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('PromptChains')}>
                            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                <Calendar className="w-8 h-8 text-pink-600 mb-3" />
                                <h3 className="font-bold text-slate-800 mb-1">Prompt Chains</h3>
                                <p className="text-sm text-slate-600">Multi-shot sequences</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <Clock className="w-6 h-6" />
                        Recent Activity
                    </h2>
                    {recentActivity.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">No recent activity</p>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl"
                                >
                                    <div>
                                        <div className="font-medium text-slate-800">{activity.description}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {new Date(activity.created_date).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${
                                        activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {activity.amount > 0 ? '+' : ''}{activity.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}