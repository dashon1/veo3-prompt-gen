import React, { useState, useEffect } from 'react';
import { ABTest } from '@/entities/ABTest';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { FlaskConical, Plus, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ABTesting() {
    const [tests, setTests] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await User.me();
        const userTests = await ABTest.filter({ created_by: user.email }, '-created_date');
        setTests(userTests);

        const userPrompts = await SavedPrompt.filter({ created_by: user.email }, '-created_date', 50);
        setPrompts(userPrompts);
    };

    const createTest = async (formData) => {
        await ABTest.create({
            ...formData,
            metrics: {
                views: 0,
                engagement: 0,
                conversions: 0,
                winner: null
            },
            status: 'draft'
        });
        loadData();
        setShowModal(false);
    };

    const recordMetric = async (testId, variant, metric, value) => {
        const test = tests.find(t => t.id === testId);
        const updatedMetrics = { ...test.metrics };
        
        if (!updatedMetrics[variant]) updatedMetrics[variant] = {};
        updatedMetrics[variant][metric] = (updatedMetrics[variant][metric] || 0) + value;

        await ABTest.update(testId, { metrics: updatedMetrics });
        loadData();
    };

    const declareWinner = async (testId, winner) => {
        await ABTest.update(testId, {
            status: 'completed',
            'metrics.winner': winner,
            results: {
                winner,
                concluded_at: new Date().toISOString()
            }
        });
        loadData();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">A/B Testing</h1>
                        <p className="text-slate-600 mt-2">Compare prompt variations scientifically</p>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Test
                    </Button>
                </div>

                <div className="grid gap-6">
                    {tests.map(test => (
                        <div key={test.id} className="bg-white rounded-3xl p-8 shadow-lg">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{test.name}</h3>
                                    <p className="text-slate-600">{test.hypothesis}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    test.status === 'running' ? 'bg-blue-100 text-blue-800' :
                                    test.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {test.status}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Variant A */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-bold text-blue-900">
                                            Variant A: {test.variant_a.name}
                                        </h4>
                                        {test.metrics?.winner === 'a' && (
                                            <Award className="w-6 h-6 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Views:</span>
                                            <span className="font-bold text-blue-900">
                                                {test.metrics?.a?.views || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Engagement:</span>
                                            <span className="font-bold text-blue-900">
                                                {test.metrics?.a?.engagement || 0}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Conversions:</span>
                                            <span className="font-bold text-blue-900">
                                                {test.metrics?.a?.conversions || 0}
                                            </span>
                                        </div>
                                    </div>
                                    {test.status === 'running' && (
                                        <Button
                                            onClick={() => declareWinner(test.id, 'a')}
                                            className="w-full mt-4 bg-blue-600 text-white"
                                            size="sm"
                                        >
                                            Declare Winner
                                        </Button>
                                    )}
                                </div>

                                {/* Variant B */}
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-bold text-purple-900">
                                            Variant B: {test.variant_b.name}
                                        </h4>
                                        {test.metrics?.winner === 'b' && (
                                            <Award className="w-6 h-6 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Views:</span>
                                            <span className="font-bold text-purple-900">
                                                {test.metrics?.b?.views || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Engagement:</span>
                                            <span className="font-bold text-purple-900">
                                                {test.metrics?.b?.engagement || 0}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Conversions:</span>
                                            <span className="font-bold text-purple-900">
                                                {test.metrics?.b?.conversions || 0}
                                            </span>
                                        </div>
                                    </div>
                                    {test.status === 'running' && (
                                        <Button
                                            onClick={() => declareWinner(test.id, 'b')}
                                            className="w-full mt-4 bg-purple-600 text-white"
                                            size="sm"
                                        >
                                            Declare Winner
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {test.status === 'draft' && (
                                <Button
                                    onClick={() => ABTest.update(test.id, { status: 'running' })}
                                    className="mt-6 bg-gradient-to-br from-green-500 to-green-600 text-white"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Start Test
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {tests.length === 0 && (
                    <div className="text-center py-16">
                        <FlaskConical className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg mb-4">No A/B tests yet</p>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                        >
                            Create Your First Test
                        </Button>
                    </div>
                )}

                {showModal && (
                    <ABTestModal
                        prompts={prompts}
                        onSave={createTest}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

function ABTestModal({ prompts, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        hypothesis: '',
        variant_a: { name: 'Control', prompt_id: '', prompt_data: {} },
        variant_b: { name: 'Variation', prompt_id: '', prompt_data: {} }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Create A/B Test</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Test Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hypothesis</label>
                        <textarea
                            value={formData.hypothesis}
                            onChange={(e) => setFormData({...formData, hypothesis: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 resize-none"
                            rows={3}
                            placeholder="What are you testing and why?"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Variant A (Control)</label>
                            <select
                                value={formData.variant_a.prompt_id}
                                onChange={(e) => {
                                    const prompt = prompts.find(p => p.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        variant_a: {
                                            ...formData.variant_a,
                                            prompt_id: e.target.value,
                                            prompt_data: prompt?.prompt_data || {}
                                        }
                                    });
                                }}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                                required
                            >
                                <option value="">Select prompt...</option>
                                {prompts.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Variant B (Test)</label>
                            <select
                                value={formData.variant_b.prompt_id}
                                onChange={(e) => {
                                    const prompt = prompts.find(p => p.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        variant_b: {
                                            ...formData.variant_b,
                                            prompt_id: e.target.value,
                                            prompt_data: prompt?.prompt_data || {}
                                        }
                                    });
                                }}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                                required
                            >
                                <option value="">Select prompt...</option>
                                {prompts.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            Create Test
                        </Button>
                        <Button type="button" onClick={onCancel} variant="outline">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}