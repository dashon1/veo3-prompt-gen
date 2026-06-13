import React, { useState } from 'react';
import { X, Coins, Zap, Crown, Rocket, AlertCircle } from 'lucide-react';
import { User } from '@/entities/User';
import { CreditTransaction } from '@/entities/CreditTransaction';

const CREDIT_PACKAGES = [
    {
        id: 'starter',
        name: 'Starter Pack',
        credits: 100,
        price: 9.99,
        icon: Zap,
        popular: false,
        color: 'from-blue-400 to-blue-500'
    },
    {
        id: 'pro',
        name: 'Pro Pack',
        credits: 500,
        price: 39.99,
        bonus: 50,
        icon: Crown,
        popular: true,
        color: 'from-purple-400 to-purple-500'
    },
    {
        id: 'ultimate',
        name: 'Ultimate Pack',
        credits: 1500,
        price: 99.99,
        bonus: 300,
        icon: Rocket,
        popular: false,
        color: 'from-orange-400 to-orange-500'
    }
];

export default function PurchaseCreditsModal({ onClose, onPurchaseComplete }) {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [purchasing, setPurchasing] = useState(false);

    const handlePurchase = async (pkg) => {
        setPurchasing(true);
        try {
            const user = await User.me();
            const totalCredits = pkg.credits + (pkg.bonus || 0);
            
            // Update user credits
            await User.updateMyUserData({
                credits: (user.credits || 0) + totalCredits,
                total_credits_purchased: (user.total_credits_purchased || 0) + totalCredits
            });

            // Log transaction
            await CreditTransaction.create({
                user_email: user.email,
                amount: totalCredits,
                transaction_type: 'purchase',
                description: `Purchased ${pkg.name}`,
                metadata: {
                    package_id: pkg.id,
                    price: pkg.price,
                    base_credits: pkg.credits,
                    bonus_credits: pkg.bonus || 0
                }
            });

            alert(`Success! ${totalCredits} credits added to your account.`);
            onPurchaseComplete?.();
            onClose();
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 max-w-4xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-800">Purchase Credits</h3>
                        <p className="text-slate-600 mt-2">Power up your AI features with credit packs</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Demo Disclaimer */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-orange-900 mb-1">Demo Mode</p>
                        <p className="text-xs text-orange-800">
                            This is a demonstration credit system. No real payments are processed. 
                            Credits will be added to your account instantly for testing purposes.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {CREDIT_PACKAGES.map(pkg => {
                        const Icon = pkg.icon;
                        const totalCredits = pkg.credits + (pkg.bonus || 0);
                        
                        return (
                            <div
                                key={pkg.id}
                                className={`relative bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                                    selectedPackage?.id === pkg.id
                                        ? 'border-purple-500 shadow-[0_8px_24px_rgba(147,112,219,0.3)]'
                                        : 'border-slate-200 hover:border-purple-300'
                                }`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                <h4 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h4>
                                
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-purple-600">${pkg.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Coins className="w-4 h-4 text-yellow-600" />
                                        <span className="font-semibold">{pkg.credits} credits</span>
                                    </div>
                                    {pkg.bonus && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Zap className="w-4 h-4" />
                                            <span className="font-semibold">+{pkg.bonus} bonus credits!</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-slate-200">
                                        <span className="text-2xl font-bold text-slate-800">{totalCredits}</span>
                                        <span className="text-slate-600 ml-2">total credits</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePurchase(pkg);
                                    }}
                                    disabled={purchasing}
                                    className={`w-full py-3 rounded-2xl font-semibold transition-all ${
                                        selectedPackage?.id === pkg.id
                                            ? `bg-gradient-to-br ${pkg.color} text-white shadow-lg hover:shadow-xl`
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    } disabled:opacity-50`}
                                >
                                    {purchasing ? 'Processing...' : 'Select Package'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h4 className="font-bold text-slate-800 mb-3">💡 What can you do with credits?</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li>• <strong>AI Enhancement:</strong> 10 credits per prompt optimization</li>
                        <li>• <strong>Agent Conversations:</strong> 5 credits per message</li>
                        <li>• <strong>Batch Generation:</strong> 20 credits per batch</li>
                        <li>• <strong>Prompt Chains:</strong> 15 credits per chain creation</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}