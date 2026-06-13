import React, { useState, useEffect } from 'react';
import { PromptChain } from '@/entities/PromptChain';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { Plus, Play, Edit, Trash2, Save, X, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChainCard = ({ chain, onEdit, onDelete, onPreview }) => {
    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-purple-100/50">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{chain.title}</h3>
                    {chain.description && (
                        <p className="text-slate-600 text-sm mb-3">{chain.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>🎬 {chain.prompts?.length || 0} shots</span>
                        <span>⏱️ {chain.total_duration || 0}s total</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={() => onPreview(chain)}
                    className="bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                </Button>
                <Button
                    onClick={() => onEdit(chain)}
                    variant="outline"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
                <Button
                    onClick={() => onDelete(chain.id)}
                    variant="outline"
                    className="text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

const ChainEditor = ({ chain, onSave, onCancel }) => {
    const [formData, setFormData] = useState(chain || {
        title: '',
        description: '',
        prompts: [],
        total_duration: 0
    });
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [showPromptSelector, setShowPromptSelector] = useState(false);

    useEffect(() => {
        loadSavedPrompts();
    }, []);

    const loadSavedPrompts = async () => {
        const user = await User.me();
        const prompts = await SavedPrompt.filter({ created_by: user.email }, '-created_date', 50);
        setSavedPrompts(prompts);
    };

    const addPrompt = (savedPrompt) => {
        const newPrompt = {
            order: formData.prompts.length + 1,
            prompt_data: savedPrompt.prompt_data,
            duration: 5,
            notes: savedPrompt.title,
            prompt_id: savedPrompt.id
        };
        
        const newPrompts = [...formData.prompts, newPrompt];
        const totalDuration = newPrompts.reduce((sum, p) => sum + (p.duration || 0), 0);
        
        setFormData({
            ...formData,
            prompts: newPrompts,
            total_duration: totalDuration
        });
        setShowPromptSelector(false);
    };

    const updatePromptDuration = (index, duration) => {
        const newPrompts = [...formData.prompts];
        newPrompts[index].duration = parseFloat(duration) || 0;
        const totalDuration = newPrompts.reduce((sum, p) => sum + (p.duration || 0), 0);
        
        setFormData({
            ...formData,
            prompts: newPrompts,
            total_duration: totalDuration
        });
    };

    const removePrompt = (index) => {
        const newPrompts = formData.prompts.filter((_, i) => i !== index);
        const totalDuration = newPrompts.reduce((sum, p) => sum + (p.duration || 0), 0);
        
        setFormData({
            ...formData,
            prompts: newPrompts.map((p, i) => ({ ...p, order: i + 1 })),
            total_duration: totalDuration
        });
    };

    const movePrompt = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= formData.prompts.length) return;

        const newPrompts = [...formData.prompts];
        [newPrompts[index], newPrompts[newIndex]] = [newPrompts[newIndex], newPrompts[index]];
        
        setFormData({
            ...formData,
            prompts: newPrompts.map((p, i) => ({ ...p, order: i + 1 }))
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.1)] mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {chain ? 'Edit Prompt Chain' : 'Create Prompt Chain'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chain Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400 resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-slate-700">
                            Shots ({formData.prompts.length}) - Total: {formData.total_duration}s
                        </label>
                        <Button
                            type="button"
                            onClick={() => setShowPromptSelector(true)}
                            className="bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Shot
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {formData.prompts.map((prompt, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-200">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => movePrompt(index, 'up')}
                                            disabled={index === 0}
                                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                        >
                                            ▲
                                        </button>
                                        <span className="text-sm font-bold text-slate-600">{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => movePrompt(index, 'down')}
                                            disabled={index === formData.prompts.length - 1}
                                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-800 mb-2">{prompt.notes}</div>
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm text-slate-600">Duration:</label>
                                            <input
                                                type="number"
                                                value={prompt.duration}
                                                onChange={(e) => updatePromptDuration(index, e.target.value)}
                                                className="w-20 px-2 py-1 bg-slate-50 rounded border border-slate-200 text-sm"
                                                step="0.5"
                                                min="0"
                                            />
                                            <span className="text-sm text-slate-600">seconds</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removePrompt(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-400 to-purple-500 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Chain
                    </Button>
                    <Button type="button" onClick={onCancel} variant="outline">
                        Cancel
                    </Button>
                </div>
            </form>

            {showPromptSelector && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-slate-800">Select a Prompt</h4>
                            <button onClick={() => setShowPromptSelector(false)} className="text-slate-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {savedPrompts.map(prompt => (
                                <button
                                    key={prompt.id}
                                    onClick={() => addPrompt(prompt)}
                                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    <div className="font-medium text-slate-800">{prompt.title}</div>
                                    {prompt.description && (
                                        <div className="text-sm text-slate-600 mt-1">{prompt.description}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChainPreview = ({ chain, onClose }) => {
    const exportChain = () => {
        const dataStr = JSON.stringify(chain, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `${chain.title.replace(/\s+/g, '_')}_chain.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const copyChain = () => {
        navigator.clipboard.writeText(JSON.stringify(chain, null, 2));
        alert('Chain copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">{chain.title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {chain.description && (
                    <p className="text-slate-600 mb-6">{chain.description}</p>
                )}

                <div className="mb-6 flex gap-3">
                    <Button onClick={copyChain} variant="outline">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy JSON
                    </Button>
                    <Button onClick={exportChain} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>

                <div className="space-y-4">
                    {chain.prompts?.map((prompt, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{prompt.notes}</div>
                                    <div className="text-sm text-slate-600">{prompt.duration}s</div>
                                </div>
                            </div>
                            <pre className="bg-white rounded-xl p-4 text-xs overflow-auto max-h-48">
                                {JSON.stringify(prompt.prompt_data, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function PromptChains() {
    const [chains, setChains] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingChain, setEditingChain] = useState(null);
    const [previewChain, setPreviewChain] = useState(null);

    useEffect(() => {
        loadChains();
    }, []);

    const loadChains = async () => {
        const user = await User.me();
        const allChains = await PromptChain.filter({ created_by: user.email }, '-created_date');
        setChains(allChains);
    };

    const handleSave = async (data) => {
        if (editingChain) {
            await PromptChain.update(editingChain.id, data);
        } else {
            await PromptChain.create(data);
        }
        setShowEditor(false);
        setEditingChain(null);
        loadChains();
    };

    const handleEdit = (chain) => {
        setEditingChain(chain);
        setShowEditor(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this prompt chain?')) {
            await PromptChain.delete(id);
            loadChains();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">Prompt Chains</h1>
                        <p className="text-slate-600 mt-2">Create multi-shot video sequences with consistent styling</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingChain(null);
                            setShowEditor(true);
                        }}
                        className="bg-gradient-to-br from-purple-400 to-purple-500 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Chain
                    </Button>
                </div>

                {showEditor && (
                    <ChainEditor
                        chain={editingChain}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowEditor(false);
                            setEditingChain(null);
                        }}
                    />
                )}

                {chains.length === 0 && !showEditor ? (
                    <div className="text-center py-16">
                        <Play className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg mb-4">No prompt chains yet</p>
                        <Button
                            onClick={() => setShowEditor(true)}
                            className="bg-gradient-to-br from-purple-400 to-purple-500 text-white"
                        >
                            Create Your First Chain
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chains.map(chain => (
                            <ChainCard
                                key={chain.id}
                                chain={chain}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onPreview={setPreviewChain}
                            />
                        ))}
                    </div>
                )}

                {previewChain && (
                    <ChainPreview
                        chain={previewChain}
                        onClose={() => setPreviewChain(null)}
                    />
                )}
            </div>
        </div>
    );
}