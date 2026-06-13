import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { CreditTransaction } from '@/entities/CreditTransaction';
import { Coins, TrendingUp, TrendingDown, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PurchaseCreditsModal from '../components/credits/PurchaseCreditsModal';

export default function Credits() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = await User.me();
            setUser(userData);

            const txns = await CreditTransaction.filter(
                { user_email: userData.email },
                '-created_date',
                50
            );
            setTransactions(txns);
        } catch (error) {
            console.error('Error loading credit data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-8 flex items-center justify-center">
                <div className="text-center">
                    <Coins className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-600">Loading your credits...</p>
                </div>
            </div>
        );
    }

    const stats = {
        current: user?.credits || 0,
        purchased: user?.total_credits_purchased || 0,
        used: user?.total_credits_used || 0
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">My Credits</h1>
                    <Button
                        onClick={() => setShowPurchaseModal(true)}
                        className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Buy Credits
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <Coins className="w-8 h-8 text-yellow-600" />
                            <span className="text-sm text-yellow-700 font-medium">Current Balance</span>
                        </div>
                        <div className="text-5xl font-bold text-yellow-800">{stats.current}</div>
                        <div className="text-xs text-yellow-600 mt-1">Available credits</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">Total Purchased</span>
                        </div>
                        <div className="text-5xl font-bold text-green-800">{stats.purchased}</div>
                        <div className="text-xs text-green-600 mt-1">Credits acquired</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingDown className="w-8 h-8 text-blue-600" />
                            <span className="text-sm text-blue-700 font-medium">Total Used</span>
                        </div>
                        <div className="text-5xl font-bold text-blue-800">{stats.used}</div>
                        <div className="text-xs text-blue-600 mt-1">Credits consumed</div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <Calendar className="w-6 h-6" />
                        Transaction History
                    </h2>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <Coins className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600">No transactions yet</p>
                            <Button
                                onClick={() => setShowPurchaseModal(true)}
                                className="mt-4 bg-gradient-to-br from-purple-400 to-purple-500 text-white"
                            >
                                Get Started
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map(txn => {
                                const isPositive = txn.amount > 0;
                                const Icon = isPositive ? TrendingUp : TrendingDown;
                                
                                return (
                                    <div
                                        key={txn.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                isPositive ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                                <Icon className={`w-5 h-5 ${
                                                    isPositive ? 'text-green-600' : 'text-red-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800">
                                                    {txn.description || txn.transaction_type}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(txn.created_date).toLocaleString()}
                                                </div>
                                                {txn.feature_used && (
                                                    <div className="text-xs text-slate-600 mt-1">
                                                        Feature: {txn.feature_used}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-bold ${
                                            isPositive ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {isPositive ? '+' : ''}{txn.amount}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {showPurchaseModal && (
                <PurchaseCreditsModal
                    onClose={() => setShowPurchaseModal(false)}
                    onPurchaseComplete={loadData}
                />
            )}
        </div>
    );
}