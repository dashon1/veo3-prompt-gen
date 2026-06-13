import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Coins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreditDisplay({ onPurchaseClick }) {
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCredits();
    }, []);

    const loadCredits = async () => {
        try {
            const user = await User.me();
            setCredits(user.credits || 0);
        } catch (error) {
            console.error('Error loading credits:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl">
                <Coins className="w-5 h-5 text-yellow-600 animate-pulse" />
                <span className="text-sm font-medium text-yellow-800">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-800">{credits}</span>
                <span className="text-xs text-yellow-600">credits</span>
            </div>
            <Button
                onClick={onPurchaseClick}
                size="sm"
                className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
            >
                <Plus className="w-4 h-4 mr-1" />
                Buy
            </Button>
        </div>
    );
}