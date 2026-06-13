import React, { useState, useEffect } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { InvokeLLM } from '@/integrations/Core';
import { Plus, Sparkles, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consumeCredits, checkCredits, CREDIT_COSTS } from '../components/utils/credits';

export default function BatchGenerator() {
    const [basePrompt, setBasePrompt] = useState(null);
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [variations, setVariations] = useState([]);
    const [variationCount, setVariationCount] = useState(3);
    const [variationType, setVariationType] = useState('style');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadSavedPrompts();
    }, []);

    const loadSavedPrompts = async () => {
        const user = await User.me();
        const prompts = await SavedPrompt.filter({ created_by: user.email }, '-created_date', 50);
        setSavedPrompts(prompts);
    };

    const generateVariations = async () => {
        if (!basePrompt) {
            alert('Please select a base prompt first');
            return;
        }

        const hasCredits = await checkCredits(CREDIT_COSTS.batch_generation);
        if (!hasCredits) {
            alert(`You need ${CREDIT_COSTS.batch_generation} credits to generate batch variations. Please purchase more credits.`);
            return;
        }

        setGenerating(true);
        try {
            await consumeCredits('batch_generation', CREDIT_COSTS.batch_generation);

            const variationPrompts = {
                style: 'Create variations with different visual styles (e.g., Cinematic, Documentary, Anime)',
                lighting: 'Create variations with different lighting setups (e.g., Golden hour, Studio lighting, Neon)',
                composition: 'Create variations with different camera compositions (e.g., Wide shot, Close-up, Dutch angle)',
                mood: 'Create variations with different moods and atmospheres (e.g., Suspenseful, Upbeat, Melancholic)'
            };

            const result = await InvokeLLM({
                prompt: `You are a Veo3 prompt variation generator. Given this base prompt:
                
${JSON.stringify(basePrompt.prompt_data, null, 2)}

Create ${variationCount} variations focusing on: ${variationPrompts[variationType]}

Each variation should maintain the core concept but change the specified element significantly.
Return an array of ${variationCount} complete prompt objects with the same structure as the input.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        variations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scene_description: { type: "string" },
                                    shot_composition: { type: "string" },
                                    camera_movement: { type: "string" },
                                    visual_style: { type: "string" },
                                    lighting: { type: "string" },
                                    environment: { type: "string" },
                                    audio_cue: { type: "string" },
                                    dialogue: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            setVariations(result.variations || []);
        } catch (error) {
            console.error('Error generating variations:', error);
            alert('Failed to generate variations: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const copyVariation = (variation) => {
        navigator.clipboard.writeText(JSON.stringify(variation, null, 2));
        alert('Variation copied to clipboard!');
    };

    const saveVariation = async (variation, index) => {
        try {
            await SavedPrompt.create({
                title: `${basePrompt.title} - Variation ${index + 1}`,
                description: `Auto-generated ${variationType} variation`,
                prompt_data: variation,
                tags: ['batch-generated', variationType]
            });
            alert('Variation saved to library!');
        } catch (error) {
            console.error('Error saving variation:', error);
            alert('Failed to save variation');
        }
    };

    const downloadAllVariations = () => {
        const data = {
            base_prompt: basePrompt.prompt_data,
            variations: variations
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'veo3-batch-variations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Batch Variation Generator</h1>
                    <p className="text-slate-600 text-lg">Create multiple variations of a prompt with AI assistance</p>
                </div>

                {/* Configuration */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Setup</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Base Prompt</label>
                            <select
                                value={basePrompt?.id || ''}
                                onChange={(e) => {
                                    const prompt = savedPrompts.find(p => p.id === e.target.value);
                                    setBasePrompt(prompt);
                                }}
                                className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                            >
                                <option value="">Choose a prompt...</option>
                                {savedPrompts.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Variation Type</label>
                                <select
                                    value={variationType}
                                    onChange={(e) => setVariationType(e.target.value)}
                                    className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                                >
                                    <option value="style">Visual Style</option>
                                    <option value="lighting">Lighting</option>
                                    <option value="composition">Composition</option>
                                    <option value="mood">Mood & Atmosphere</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Number of Variations</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={variationCount}
                                    onChange={(e) => setVariationCount(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={generateVariations}
                            disabled={!basePrompt || generating}
                            className="w-full bg-gradient-to-br from-purple-500 to-purple-600 text-white disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Generate Variations (20 credits)
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {variations.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Generated Variations</h3>
                            <Button
                                onClick={downloadAllVariations}
                                variant="outline"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download All
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {variations.map((variation, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl p-6 shadow-lg"
                                >
                                    <h4 className="text-lg font-bold text-slate-800 mb-4">Variation {index + 1}</h4>
                                    
                                    <pre className="bg-slate-50 rounded-2xl p-4 text-xs overflow-auto mb-4 max-h-64">
                                        {JSON.stringify(variation, null, 2)}
                                    </pre>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => saveVariation(variation, index)}
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() => copyVariation(variation)}
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}