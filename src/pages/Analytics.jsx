
import React, { useState, useEffect, useCallback } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Analytics() {
    const [prompts, setPrompts] = useState([]);
    const [stats, setStats] = useState(null);

    const calculateStats = useCallback((prompts) => {
        if (prompts.length === 0) {
            setStats(null);
            return;
        }

        // Count usage of each element
        const visualStyles = {};
        const lightingStyles = {};
        const compositions = {};
        const environments = {};
        const collections = {};

        prompts.forEach(p => {
            const data = p.prompt_data;
            
            if (data.visual_style) visualStyles[data.visual_style] = (visualStyles[data.visual_style] || 0) + 1;
            if (data.lighting) lightingStyles[data.lighting] = (lightingStyles[data.lighting] || 0) + 1;
            if (data.shot_composition) compositions[data.shot_composition] = (compositions[data.shot_composition] || 0) + 1;
            if (data.environment) environments[data.environment] = (environments[data.environment] || 0) + 1;
            if (p.collection) collections[p.collection] = (collections[p.collection] || 0) + 1;
        });

        setStats({
            totalPrompts: prompts.length,
            totalUpvotes: prompts.reduce((sum, p) => sum + (p.upvotes || 0), 0),
            avgUpvotes: (prompts.reduce((sum, p) => sum + (p.upvotes || 0), 0) / prompts.length).toFixed(1),
            visualStyles: Object.entries(visualStyles).map(([name, value]) => ({ name, value })),
            lightingStyles: Object.entries(lightingStyles).map(([name, value]) => ({ name, value })),
            compositions: Object.entries(compositions).map(([name, value]) => ({ name, value })),
            environments: Object.entries(environments).map(([name, value]) => ({ name, value })),
            collections: Object.entries(collections).map(([name, value]) => ({ name, value }))
        });
    }, []); // setStats is a stable function reference

    const loadAnalytics = useCallback(async () => {
        const user = await User.me();
        const myPrompts = await SavedPrompt.filter({ created_by: user.email });
        setPrompts(myPrompts);
        calculateStats(myPrompts);
    }, [calculateStats, setPrompts]); // calculateStats and setPrompts are stable function references

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]); // loadAnalytics is a stable function reference

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">No Analytics Yet</h2>
                    <p className="text-slate-600">Create some prompts to see your style analytics!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">Your Creative Analytics</h1>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalPrompts}</div>
                        <div className="text-slate-600">Total Prompts</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalUpvotes}</div>
                        <div className="text-slate-600">Total Upvotes</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-4xl font-bold text-green-600 mb-2">{stats.avgUpvotes}</div>
                        <div className="text-slate-600">Avg Upvotes</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="space-y-8">
                    {stats.visualStyles.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Visual Style DNA</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.visualStyles}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#9333ea" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {stats.lightingStyles.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Lighting Preferences</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.lightingStyles}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.lightingStyles.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {stats.collections.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Collections</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.collections}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
