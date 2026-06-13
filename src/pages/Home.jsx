
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Users, BookOpen, TrendingUp, Layers, Video } from 'lucide-react'; // Added Video import
import { User } from '@/entities/User';
import WelcomeModal from '../components/onboarding/WelcomeModal';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-purple-100/50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300">
        <div className="text-purple-600 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

export default function Home() {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        checkFirstVisit();
    }, []);

    const checkFirstVisit = async () => {
        try {
            const user = await User.me();
            const hasSeenWelcome = localStorage.getItem('veo3_welcome_seen');
            
            if (!hasSeenWelcome) {
                setShowWelcome(true);
                localStorage.setItem('veo3_welcome_seen', 'true');
            }
        } catch (error) {
            console.error('Error checking first visit:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Veo3 Prompt Studio
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
                        Create perfect prompts and generate videos with 7+ AI models: Veo3, Kling, Wan2.5, Seedance, SORA 2, Hunyuan & CapCut AI
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={createPageUrl('Builder')}>
                            <button className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-[0_8px_16px_rgba(147,112,219,0.3)] hover:shadow-[0_12px_24px_rgba(147,112,219,0.4)] transition-all duration-300 active:scale-95">
                                Start Creating →
                            </button>
                        </Link>
                        <Link to={createPageUrl('VideoGeneration')}>
                            <button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-[0_8px_16px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-95">
                                Generate Videos
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-6 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-3xl font-bold text-rose-600">7+</div>
                        <div className="text-sm text-slate-600">AI Models</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-3xl font-bold text-blue-600">20+</div>
                        <div className="text-sm text-slate-600">Templates</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-3xl font-bold text-green-600">5</div>
                        <div className="text-sm text-slate-600">AI Agents</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]">
                        <div className="text-3xl font-bold text-purple-600">∞</div>
                        <div className="text-sm text-slate-600">Possibilities</div>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">
                        Everything You Need to Create Perfect Videos
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Video className="w-8 h-8" />}
                            title="Multi-Model Generation"
                            description="Generate videos with Veo3, Kling, SORA 2, Wan2.5, Seedance, Hunyuan & CapCut AI"
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-8 h-8" />}
                            title="AI Enhancement"
                            description="Let AI improve your prompts with professional suggestions and optimizations"
                        />
                        <FeatureCard
                            icon={<Layers className="w-8 h-8" />}
                            title="Prompt Library"
                            description="Save, organize, and reuse your best prompts with collections and tags"
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8" />}
                            title="Community"
                            description="Discover and remix prompts shared by other creators"
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8" />}
                            title="Templates"
                            description="Start fast with pre-built templates for every video type"
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-8 h-8" />}
                            title="Analytics"
                            description="Track your style evolution and discover your creative DNA"
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-12 text-center shadow-[0_12px_32px_rgba(147,112,219,0.3)]">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Create Amazing Videos?
                    </h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Join creators who are already making magic with 7+ AI video models
                    </p>
                    <Link to={createPageUrl('VideoGeneration')}>
                        <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.2)] active:scale-95">
                            Start Generating Videos →
                        </button>
                    </Link>
                </div>
            </div>

            {/* Welcome Modal */}
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
        </div>
    );
}
