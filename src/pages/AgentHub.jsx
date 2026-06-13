
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/entities/User';
import { agentSDK } from '@/agents';
import { MessageSquare, Sparkles, Palette, UserCircle, FileText, Wrench } from 'lucide-react';
import { createPageUrl } from '@/utils';

const AGENTS = [
    {
        name: 'prompt_optimizer',
        title: 'Prompt Optimizer',
        description: 'Transform simple ideas into detailed, high-quality Veo3 prompts',
        icon: Sparkles,
        color: 'from-purple-400 to-purple-500',
        features: ['Prompt enhancement', 'Character assistance', 'Template suggestions']
    },
    {
        name: 'character_creator',
        title: 'Character Creator',
        description: 'Design rich, detailed characters for your Veo3 videos',
        icon: UserCircle,
        color: 'from-blue-400 to-blue-500',
        features: ['Character design', 'Visual traits', 'Personality development']
    },
    {
        name: 'style_consultant',
        title: 'Style Consultant',
        description: 'Discover optimal visual styles and aesthetics for your videos',
        icon: Palette,
        color: 'from-pink-400 to-pink-500',
        features: ['Style analysis', 'Visual recommendations', 'Trend research']
    },
    {
        name: 'script_writer',
        title: 'Script Writer',
        description: 'Craft compelling video scripts and scene sequences',
        icon: FileText,
        color: 'from-green-400 to-green-500',
        features: ['Scene writing', 'Dialogue creation', 'Story structure']
    },
    {
        name: 'technical_advisor',
        title: 'Technical Advisor',
        description: 'Get expert guidance on Veo3 best practices and optimization',
        icon: Wrench,
        color: 'from-orange-400 to-orange-500',
        features: ['Technical guidance', 'Prompt optimization', 'Troubleshooting']
    }
];

const AgentCard = ({ agent }) => {
    const Icon = agent.icon;
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadConversations = useCallback(async () => {
        try {
            const convos = await agentSDK.listConversations({ agent_name: agent.name });
            setConversations(convos || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    }, [agent.name]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const createNewConversation = async () => {
        try {
            const conversation = await agentSDK.createConversation({
                agent_name: agent.name,
                metadata: {
                    name: `${agent.title} Chat`,
                    description: `New conversation with ${agent.title}`
                }
            });
            window.location.href = createPageUrl('AgentChat') + `?agent=${agent.name}&conversation=${conversation.id}`;
        } catch (error) {
            console.error('Error creating conversation:', error);
            alert('Failed to create conversation');
        }
    };

    const whatsappUrl = agentSDK.getWhatsAppConnectURL(agent.name);

    return (
        <div className={`bg-gradient-to-br ${agent.color} rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)] text-white`}>
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{agent.title}</h3>
                    <p className="text-sm text-white/80">{agent.description}</p>
                </div>
            </div>

            <div className="mb-4 space-y-1">
                {agent.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-white/70 flex items-center gap-2">
                        <span>•</span>
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <button
                    onClick={createNewConversation}
                    className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-medium transition-all flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Start New Chat
                </button>

                {conversations.length > 0 && (
                    <div className="text-xs text-white/70 text-center">
                        {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
                    </div>
                )}

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-medium transition-all text-center"
                >
                    💬 Connect via WhatsApp
                </a>
            </div>
        </div>
    );
};

export default function AgentHub() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await User.me();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Agent Hub</h1>
                    <p className="text-slate-600 text-lg">
                        Your team of AI assistants ready to help with every aspect of video creation
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {AGENTS.map(agent => (
                        <AgentCard key={agent.name} agent={agent} />
                    ))}
                </div>

                <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">💡 How to Use AI Agents</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">In-App Chat</h3>
                            <p className="text-slate-600 text-sm">
                                Click "Start New Chat" to begin a conversation with any agent. They can access your prompts, 
                                characters, and preferences to provide personalized assistance.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">WhatsApp Integration</h3>
                            <p className="text-slate-600 text-sm">
                                Connect via WhatsApp for on-the-go assistance. Get help creating prompts, developing characters, 
                                or optimizing your videos from anywhere.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">Context-Aware</h3>
                            <p className="text-slate-600 text-sm">
                                All agents have access to your library and can read/create content on your behalf. 
                                They learn from your preferences and style over time.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">Credit Usage</h3>
                            <p className="text-slate-600 text-sm">
                                Each agent message costs 5 credits. They can help you save time and improve quality, 
                                making them worth the investment for serious creators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
