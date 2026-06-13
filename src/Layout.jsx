import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Sparkles, BookOpen, Coins, Bot, Folder, Layers } from 'lucide-react';
import CreditDisplay from './components/credits/CreditDisplay';
import PurchaseCreditsModal from './components/credits/PurchaseCreditsModal';

export default function Layout({ children, currentPageName }) {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const navItems = [
        { name: 'Home', path: 'Home', icon: Home },
        { name: 'Builder', path: 'Builder', icon: Sparkles },
        { name: 'Templates', path: 'Templates', icon: BookOpen },
        { name: 'Library', path: 'Library', icon: Folder },
        { name: 'Storyboard', path: 'Storyboard', icon: Layers },
        { name: 'AI Agents', path: 'AgentHub', icon: Bot }
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100">
            {/* Navigation */}
            <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to={createPageUrl('Home')}>
                            <div className="text-white font-bold text-xl flex items-center gap-2">
                                ✨ Veo3 Studio
                            </div>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map(item => {
                                const Icon = item.icon;
                                const isActive = currentPageName === item.path;
                                return (
                                    <Link key={item.path} to={createPageUrl(item.path)}>
                                        <button
                                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.name}
                                        </button>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Credit Display */}
                        <div className="hidden md:block">
                            <CreditDisplay onPurchaseClick={() => setShowPurchaseModal(true)} />
                        </div>

                        {/* Mobile menu */}
                        <div className="md:hidden flex items-center gap-2">
                            <button 
                                onClick={() => setShowPurchaseModal(true)}
                                className="p-2 bg-white/20 rounded-xl"
                            >
                                <Coins className="w-5 h-5 text-white" />
                            </button>
                            <select
                                value={currentPageName}
                                onChange={(e) => window.location.href = createPageUrl(e.target.value)}
                                className="bg-white/20 text-white px-3 py-2 rounded-2xl text-sm focus:outline-none"
                            >
                                {navItems.map(item => (
                                    <option key={item.path} value={item.path} className="text-slate-800">
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-slate-600">
                        Made with ❤️ for Veo3 creators | Create amazing AI videos with 7+ AI models
                    </p>
                </div>
            </footer>

            {/* Purchase Modal */}
            {showPurchaseModal && (
                <PurchaseCreditsModal
                    onClose={() => setShowPurchaseModal(false)}
                    onPurchaseComplete={() => window.location.reload()}
                />
            )}
        </div>
    );
}