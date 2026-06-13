import React, { useState, useEffect } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { VideoGeneration } from '@/entities/VideoGeneration';
import { User } from '@/entities/User';
import { Play, Video, Sparkles, Clock, CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consumeCredits, checkCredits } from '../components/utils/credits';

const AI_MODELS = [
    {
        id: 'veo3',
        name: 'Google Veo 3',
        description: 'Google\'s latest video generation model with exceptional quality',
        credits: 50,
        duration: '5-10s',
        resolution: '1080p',
        icon: '🎬',
        color: 'from-blue-400 to-blue-500'
    },
    {
        id: 'kling',
        name: 'Kling AI',
        description: 'High-quality cinematic video generation',
        credits: 40,
        duration: '5s',
        resolution: '1080p',
        icon: '🎥',
        color: 'from-purple-400 to-purple-500'
    },
    {
        id: 'wan2.5',
        name: 'Wan 2.5 (Alibaba)',
        description: 'Alibaba\'s advanced video synthesis model',
        credits: 45,
        duration: '5-8s',
        resolution: '1080p',
        icon: '🎞️',
        color: 'from-orange-400 to-orange-500'
    },
    {
        id: 'seedance',
        name: 'Seedance 1.0 (ByteDance)',
        description: 'ByteDance\'s creative video generation',
        credits: 40,
        duration: '5s',
        resolution: '720p',
        icon: '💃',
        color: 'from-pink-400 to-pink-500'
    },
    {
        id: 'sora2',
        name: 'SORA 2 (OpenAI)',
        description: 'OpenAI\'s revolutionary video model',
        credits: 60,
        duration: '10-20s',
        resolution: '1080p',
        icon: '🌟',
        color: 'from-green-400 to-green-500'
    },
    {
        id: 'hunyuan',
        name: 'Hunyuan Video',
        description: 'Tencent\'s powerful video generation',
        credits: 45,
        duration: '5-10s',
        resolution: '1080p',
        icon: '🎨',
        color: 'from-teal-400 to-teal-500'
    },
    {
        id: 'capcutai',
        name: 'CapCut AI Video',
        description: 'CapCut\'s AI-powered video creation',
        credits: 35,
        duration: '5s',
        resolution: '1080p',
        icon: '✂️',
        color: 'from-red-400 to-red-500'
    }
];

const ModelCard = ({ model, selected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(model.id)}
            className={`cursor-pointer rounded-3xl p-6 transition-all border-2 ${
                selected
                    ? 'border-purple-500 shadow-[0_8px_24px_rgba(147,112,219,0.3)] bg-white'
                    : 'border-slate-200 hover:border-purple-300 bg-gradient-to-br from-white to-slate-50'
            }`}
        >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {model.icon}
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">{model.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{model.description}</p>
            
            <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{model.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>{model.resolution}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">{model.credits} credits</span>
                </div>
            </div>

            {selected && (
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Selected
                </div>
            )}
        </div>
    );
};

const GenerationCard = ({ generation, onView }) => {
    const statusIcons = {
        queued: <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />,
        processing: <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />,
        completed: <CheckCircle className="w-5 h-5 text-green-600" />,
        failed: <XCircle className="w-5 h-5 text-red-600" />
    };

    const statusColors = {
        queued: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
    };

    const model = AI_MODELS.find(m => m.id === generation.model);

    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{generation.title}</h3>
                    <p className="text-sm text-slate-600">{model?.name || generation.model}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[generation.status]}`}>
                    {statusIcons[generation.status]}
                    {generation.status}
                </span>
            </div>

            {generation.thumbnail_url && (
                <img
                    src={generation.thumbnail_url}
                    alt={generation.title}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                />
            )}

            {generation.status === 'completed' && generation.video_url && (
                <div className="flex gap-2">
                    <Button
                        onClick={() => onView(generation)}
                        className="flex-1"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                    </Button>
                    <Button
                        onClick={() => window.open(generation.video_url, '_blank')}
                        variant="outline"
                        className="flex-1"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                </div>
            )}

            {generation.status === 'failed' && generation.error_message && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-800">
                    {generation.error_message}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                <span>{new Date(generation.created_date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{generation.credits_used} credits used</span>
            </div>
        </div>
    );
};

export default function VideoGenerationPage() {
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [selectedModel, setSelectedModel] = useState('veo3');
    const [generations, setGenerations] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('generate');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await User.me();
        const prompts = await SavedPrompt.filter({ created_by: user.email }, '-created_date', 50);
        setSavedPrompts(prompts);

        const gens = await VideoGeneration.filter({ created_by: user.email }, '-created_date', 20);
        setGenerations(gens);
    };

    const generateVideo = async () => {
        if (!selectedPrompt) {
            alert('Please select a prompt first');
            return;
        }

        const model = AI_MODELS.find(m => m.id === selectedModel);
        const hasCredits = await checkCredits(model.credits);
        
        if (!hasCredits) {
            alert(`You need ${model.credits} credits to generate with ${model.name}. Please purchase more credits.`);
            return;
        }

        setGenerating(true);
        try {
            await consumeCredits(`video_generation_${selectedModel}`, model.credits);

            // Create generation record
            const generation = await VideoGeneration.create({
                title: selectedPrompt.title,
                model: selectedModel,
                prompt_data: selectedPrompt.prompt_data,
                status: 'queued',
                credits_used: model.credits,
                metadata: {
                    model_name: model.name,
                    started_at: new Date().toISOString()
                }
            });

            alert(`Video generation started! This is a demo - in production, this would submit to ${model.name} API via Fal.AI. Check the "My Generations" tab to track progress.`);
            
            // Simulate completion after 10 seconds (in production, this would be webhooks from Fal.AI)
            setTimeout(async () => {
                await VideoGeneration.update(generation.id, {
                    status: 'completed',
                    video_url: 'https://example.com/demo-video.mp4',
                    thumbnail_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400',
                    duration: 5,
                    resolution: model.resolution
                });
                loadData();
            }, 10000);

            setActiveTab('history');
            loadData();
        } catch (error) {
            console.error('Generation error:', error);
            alert('Failed to start generation: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Video Generation</h1>
                    <p className="text-slate-600 text-lg">Generate videos using multiple AI models</p>
                </div>

                {/* Demo Notice */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-3xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Demo Mode - API Integration Required</h3>
                            <p className="text-sm text-orange-800 mb-2">
                                This is a demonstration UI. To enable actual video generation, you need to:
                            </p>
                            <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                                <li>Sign up for Fal.AI platform account</li>
                                <li>Configure API keys for desired models (Kling, Wan2.5, Seedance, etc.)</li>
                                <li>Set up webhooks for generation status updates</li>
                                <li>Configure storage for generated videos</li>
                            </ul>
                            <p className="text-sm text-orange-800 mt-3">
                                Currently, clicking "Generate" will simulate the process and consume credits, but won't create actual videos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                            activeTab === 'generate'
                                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                                : 'bg-white text-slate-700'
                        }`}
                    >
                        Generate Video
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                            activeTab === 'history'
                                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                                : 'bg-white text-slate-700'
                        }`}
                    >
                        My Generations
                    </button>
                </div>

                {/* Generate Tab */}
                {activeTab === 'generate' && (
                    <div className="space-y-8">
                        {/* Select Prompt */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">1. Select Prompt</h3>
                            <select
                                value={selectedPrompt?.id || ''}
                                onChange={(e) => {
                                    const prompt = savedPrompts.find(p => p.id === e.target.value);
                                    setSelectedPrompt(prompt);
                                }}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                            >
                                <option value="">Choose a prompt from your library...</option>
                                {savedPrompts.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            {selectedPrompt && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                                    <pre className="text-xs overflow-auto max-h-48">
                                        {JSON.stringify(selectedPrompt.prompt_data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Select Model */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">2. Choose AI Model</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {AI_MODELS.map(model => (
                                    <ModelCard
                                        key={model.id}
                                        model={model}
                                        selected={selectedModel === model.id}
                                        onSelect={setSelectedModel}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={generateVideo}
                            disabled={!selectedPrompt || generating}
                            className="w-full h-16 text-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                                    Generating Video...
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6 mr-3" />
                                    Generate Video ({AI_MODELS.find(m => m.id === selectedModel)?.credits} credits)
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div>
                        {generations.length === 0 ? (
                            <div className="text-center py-16">
                                <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">No generations yet</p>
                                <Button
                                    onClick={() => setActiveTab('generate')}
                                    className="mt-4"
                                >
                                    Generate Your First Video
                                </Button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {generations.map(gen => (
                                    <GenerationCard
                                        key={gen.id}
                                        generation={gen}
                                        onView={(g) => alert('Video player would open here')}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}