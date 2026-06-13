import { User } from '@/entities/User';
import { CreditTransaction } from '@/entities/CreditTransaction';

export const CREDIT_COSTS = {
    ai_enhance: 10,
    agent_message: 5,
    batch_generation: 20,
    premium_template: 15,
    prompt_chain: 15,
    video_generation_veo3: 50,
    video_generation_kling: 40,
    video_generation_wan2_5: 45,
    video_generation_seedance: 40,
    video_generation_sora2: 60,
    video_generation_hunyuan: 45,
    video_generation_capcutai: 35
};

export async function consumeCredits(feature, amount) {
    try {
        const user = await User.me();
        const currentCredits = user.credits || 0;

        if (currentCredits < amount) {
            throw new Error(`Insufficient credits. You need ${amount} credits but only have ${currentCredits}.`);
        }

        // Deduct credits
        await User.updateMyUserData({
            credits: currentCredits - amount,
            total_credits_used: (user.total_credits_used || 0) + amount
        });

        // Log transaction
        await CreditTransaction.create({
            user_email: user.email,
            amount: -amount,
            transaction_type: 'consumption',
            feature_used: feature,
            description: `Used ${amount} credits for ${feature}`
        });

        return true;
    } catch (error) {
        console.error('Credit consumption error:', error);
        throw error;
    }
}

export async function checkCredits(amount) {
    try {
        const user = await User.me();
        return (user.credits || 0) >= amount;
    } catch (error) {
        return false;
    }
}