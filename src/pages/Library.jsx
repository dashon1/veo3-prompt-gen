import React, { useState, useEffect, useCallback } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { Search, Folder, Tag, Star, Trash2, Copy, Edit, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PromptLibraryModal from '../components/library/PromptLibraryModal';

const PromptCard = ({ prompt, onDelete, onUpvote, isOwner }) => {
    const [showJson, setShowJson] = useState(false);

    const copyPrompt = () => {
        navigator.clipboard.writeText(JSON.stringify(prompt.prompt_data, null, 2));
    };

    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-purple-100/50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{prompt.title}</h3>
                    {prompt.description && (
                        <p className="text-slate-600 text-sm mb-3">{prompt.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {prompt.collection && (
                            <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                                <Folder className="w-3 h-3" />
                                {prompt.collection}
                            </span>
                        )}
                        {prompt.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setShowJson(!showJson)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    {showJson ? 'Hide' : 'Show'} JSON
                </button>
            </div>

            {showJson && (
                <pre className="bg-slate-100 rounded-2xl p-4 text-xs overflow-auto mb-4 max-h-48">
                    {JSON.stringify(prompt.prompt_data, null, 2)}
                </pre>
            )}

            <div className="flex gap-2 flex-wrap">
                <Link to={`${createPageUrl('Builder')}?prompt=${prompt.id}`}>
                    <button className="px-4 py-2 bg-gradient-to-br from-purple-300 to-purple-400 text-purple-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </Link>
                <button
                    onClick={copyPrompt}
                    className="px-4 py-2 bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center gap-2"
                >
                    <Copy className="w-4 h-4" />
                    Copy
                </button>
                <button
                    onClick={() => onUpvote(prompt)}
                    className="px-4 py-2 bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center gap-2"
                >
                    <Star className="w-4 h-4" />
                    {prompt.upvotes || 0}
                </button>
                {isOwner && (
                    <button
                        onClick={() => onDelete(prompt.id)}
                        className="px-4 py-2 bg-gradient-to-br from-rose-300 to-rose-400 text-rose-900 rounded-2xl text-sm font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default function Library() {
    const [prompts, setPrompts] = useState([]);
    const [filteredPrompts, setFilteredPrompts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('all');
    const [user, setUser] = useState(null);
    const [showLibraryModal, setShowLibraryModal] = useState(false);

    const loadData = useCallback(async () => {
        const currentUser = await User.me();
        setUser(currentUser);
        const allPrompts = await SavedPrompt.filter({ created_by: currentUser.email }, '-created_date');
        setPrompts(allPrompts);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filterPrompts = useCallback(() => {
        let filtered = prompts;

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedCollection !== 'all') {
            filtered = filtered.filter(p => p.collection === selectedCollection);
        }

        setFilteredPrompts(filtered);
    }, [prompts, searchQuery, selectedCollection]);

    useEffect(() => {
        filterPrompts();
    }, [filterPrompts]);

    const handleDelete = async (id) => {
        if (confirm('Delete this prompt?')) {
            await SavedPrompt.delete(id);
            loadData();
        }
    };

    const handleUpvote = async (prompt) => {
        const upvotedBy = prompt.upvoted_by || [];
        const hasUpvoted = upvotedBy.includes(user.email);

        await SavedPrompt.update(prompt.id, {
            upvotes: hasUpvoted ? (prompt.upvotes - 1) : (prompt.upvotes + 1),
            upvoted_by: hasUpvoted
                ? upvotedBy.filter(email => email !== user.email)
                : [...upvotedBy, user.email]
        });
        loadData();
    };

    const collections = ['all', ...new Set(prompts.map(p => p.collection).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-bold text-slate-800">My Prompt Library</h1>
                        <button
                            onClick={() => setShowLibraryModal(true)}
                            className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            Browse Prompt Library
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-[inset_0_3px_6px_rgba(0,0,0,0.07)] border border-purple-100/50 focus:outline-none focus:border-purple-300"
                            />
                        </div>
                        <select
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            className="px-4 py-3 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-[inset_0_3px_6px_rgba(0,0,0,0.07)] border border-blue-100/50 focus:outline-none focus:border-blue-300"
                        >
                            {collections.map(col => (
                                <option key={col} value={col}>
                                    {col === 'all' ? 'All Collections' : col}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Prompts Grid */}
                {filteredPrompts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-600 text-lg mb-4">No prompts found</p>
                        <Link to={createPageUrl('Builder')}>
                            <button className="px-6 py-3 bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-3xl font-semibold shadow-[0_8px_16px_rgba(147,112,219,0.3)]">
                                Create Your First Prompt
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrompts.map(prompt => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onDelete={handleDelete}
                                onUpvote={handleUpvote}
                                isOwner={true}
                            />
                        ))}
                    </div>
                )}

                {showLibraryModal && (
                    <PromptLibraryModal
                        onClose={() => {
                            setShowLibraryModal(false);
                            loadData(); // Refresh after importing
                        }}
                    />
                )}
            </div>
        </div>
    );
}