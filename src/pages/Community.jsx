
import React, { useState, useEffect, useCallback } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { TrendingUp, Star, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CommunityPromptCard = ({ prompt, onUpvote, currentUser }) => {
    const hasUpvoted = prompt.upvoted_by?.includes(currentUser?.email);

    const copyPrompt = () => {
        navigator.clipboard.writeText(JSON.stringify(prompt.prompt_data, null, 2));
    };

    return (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-green-100/50">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{prompt.title}</h3>
                    {prompt.description && (
                        <p className="text-slate-600 text-sm mb-3">{prompt.description}</p>
                    )}
                    <p className="text-xs text-slate-500">by {prompt.created_by}</p>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
                {prompt.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex gap-2">
                <Link to={`${createPageUrl('Builder')}?prompt=${prompt.id}`}>
                    <button className="px-4 py-2 bg-gradient-to-br from-purple-300 to-purple-400 text-purple-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                        Remix
                    </button>
                </Link>
                <button
                    onClick={copyPrompt}
                    className="px-4 py-2 bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center gap-2"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onUpvote(prompt)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center gap-2 ${
                        hasUpvoted
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900'
                            : 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900'
                    }`}
                >
                    <Star className="w-4 h-4" />
                    {prompt.upvotes || 0}
                </button>
            </div>
        </div>
    );
};

export default function Community() {
    const [prompts, setPrompts] = useState([]);
    const [user, setUser] = useState(null);
    const [sortBy, setSortBy] = useState('trending');

    const loadData = useCallback(async () => {
        const currentUser = await User.me();
        setUser(currentUser);

        const sortField = sortBy === 'trending' ? '-upvotes' : '-created_date';
        const publicPrompts = await SavedPrompt.filter({ is_public: true }, sortField, 50);
        setPrompts(publicPrompts);
    }, [sortBy]); // `sortBy` is a dependency for `loadData`

    useEffect(() => {
        loadData();
    }, [loadData]); // `loadData` is a dependency for `useEffect`

    const handleUpvote = async (prompt) => {
        // Ensure user is not null before proceeding with upvote logic
        if (!user) {
            console.warn("User not logged in, cannot upvote.");
            return;
        }

        const upvotedBy = prompt.upvoted_by || [];
        const hasUpvoted = upvotedBy.includes(user.email);

        await SavedPrompt.update(prompt.id, {
            upvotes: hasUpvoted ? (prompt.upvotes - 1) : (prompt.upvotes + 1),
            upvoted_by: hasUpvoted
                ? upvotedBy.filter(email => email !== user.email)
                : [...upvotedBy, user.email]
        });
        loadData(); // Reload data after upvote to reflect changes
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Community Prompts</h1>
                    <p className="text-slate-600 text-lg mb-6">Discover and remix prompts from the community</p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setSortBy('trending')}
                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                                sortBy === 'trending'
                                    ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
                                    : 'bg-white text-slate-700'
                            }`}
                        >
                            <TrendingUp className="w-4 h-4 inline mr-2" />
                            Trending
                        </button>
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                                sortBy === 'recent'
                                    ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
                                    : 'bg-white text-slate-700'
                            }`}
                        >
                            Recent
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map(prompt => (
                        <CommunityPromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onUpvote={handleUpvote}
                            currentUser={user}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
