import React from 'react';
import { X, Sparkles, Zap, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WelcomeModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Veo3 Studio! ✨</h2>
                        <p className="text-slate-600">Your journey to creating perfect AI video prompts starts here</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">🎬 Start Creating</h3>
                                <p className="text-slate-600 text-sm">Use the Builder to craft detailed Veo3 prompts with scene descriptions, camera movements, lighting, and more.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">📚 Browse Templates</h3>
                                <p className="text-slate-600 text-sm">Start fast with 15+ official templates for product demos, testimonials, cinematic scenes, and more.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">✨ AI Enhancement</h3>
                                <p className="text-slate-600 text-sm">Let AI improve your prompts with professional suggestions. You start with 100 free credits!</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">🤝 AI Agents</h3>
                                <p className="text-slate-600 text-sm">Chat with specialized AI agents for prompt optimization, character creation, style consulting, and more!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-slate-800 mb-2">💡 Quick Tips</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li>• Use the 🎲 Random button to get inspiration</li>
                        <li>• Save your best prompts to your Library</li>
                        <li>• Create character profiles for consistent people in videos</li>
                        <li>• Share prompts with the community to get upvotes</li>
                        <li>• Build prompt chains for multi-shot sequences</li>
                    </ul>
                </div>

                <div className="flex gap-3">
                    <Link to={createPageUrl('Builder')} className="flex-1">
                        <button 
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
                        >
                            Start Creating →
                        </button>
                    </Link>
                    <Link to={createPageUrl('Templates')} className="flex-1">
                        <button 
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-white text-purple-600 rounded-2xl font-semibold border-2 border-purple-200 hover:border-purple-300 transition-all"
                        >
                            Browse Templates
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}