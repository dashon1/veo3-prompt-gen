import React, { useState, useEffect } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { PromptVersion } from '@/entities/PromptVersion';
import { User } from '@/entities/User';
import { GitBranch, Clock, TrendingUp, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Versions() {
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [versions, setVersions] = useState([]);

    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        const user = await User.me();
        const myPrompts = await SavedPrompt.filter({ created_by: user.email }, '-updated_date', 50);
        setPrompts(myPrompts);
    };

    const loadVersions = async (promptId) => {
        const promptVersions = await PromptVersion.filter({ prompt_id: promptId }, '-version_number');
        setVersions(promptVersions);
    };

    const handleSelectPrompt = async (prompt) => {
        setSelectedPrompt(prompt);
        await loadVersions(prompt.id);
    };

    const createVersion = async (prompt, description) => {
        const existingVersions = await PromptVersion.filter({ prompt_id: prompt.id });
        const versionNumber = existingVersions.length + 1;

        await PromptVersion.create({
            prompt_id: prompt.id,
            version_number: versionNumber,
            prompt_data: prompt.prompt_data,
            change_description: description || `Version ${versionNumber}`,
            parent_version_id: existingVersions[existingVersions.length - 1]?.id
        });

        loadVersions(prompt.id);
    };

    const restoreVersion = async (version) => {
        if (confirm('Restore this version? This will update the current prompt.')) {
            await SavedPrompt.update(version.prompt_id, {
                prompt_data: version.prompt_data
            });
            
            await createVersion(
                { ...selectedPrompt, prompt_data: version.prompt_data },
                `Restored from v${version.version_number}`
            );
            
            alert('Version restored successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">Version History</h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Prompts List */}
                    <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Your Prompts</h3>
                        <div className="space-y-2">
                            {prompts.map(prompt => (
                                <button
                                    key={prompt.id}
                                    onClick={() => handleSelectPrompt(prompt)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all ${
                                        selectedPrompt?.id === prompt.id
                                            ? 'bg-purple-100 border-2 border-purple-500'
                                            : 'bg-slate-50 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="font-semibold text-slate-800">{prompt.title}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Updated {new Date(prompt.updated_date).toLocaleDateString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Version Timeline */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
                        {selectedPrompt ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        Version History: {selectedPrompt.title}
                                    </h3>
                                    <Button
                                        onClick={() => {
                                            const desc = prompt('Version description:');
                                            if (desc) createVersion(selectedPrompt, desc);
                                        }}
                                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                    >
                                        <GitBranch className="w-4 h-4 mr-2" />
                                        Save Current as Version
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {versions.map((version, idx) => (
                                        <div key={version.id} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">
                                                            v{version.version_number}
                                                        </span>
                                                        <span className="text-sm text-slate-600">
                                                            <Clock className="w-4 h-4 inline mr-1" />
                                                            {new Date(version.created_date).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-700 font-medium">{version.change_description}</p>
                                                    {version.performance_score && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm text-green-600 font-semibold">
                                                                Score: {version.performance_score}/10
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(JSON.stringify(version.prompt_data, null, 2));
                                                            alert('Version copied!');
                                                        }}
                                                        className="p-2 hover:bg-white rounded-lg transition-all"
                                                        title="Copy JSON"
                                                    >
                                                        <Copy className="w-4 h-4 text-slate-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => restoreVersion(version)}
                                                        className="p-2 hover:bg-white rounded-lg transition-all"
                                                        title="Restore this version"
                                                    >
                                                        <RotateCcw className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            <details className="mt-4">
                                                <summary className="cursor-pointer text-sm text-purple-600 font-medium hover:text-purple-700">
                                                    View Prompt Data
                                                </summary>
                                                <pre className="mt-2 p-4 bg-white rounded-xl text-xs overflow-auto max-h-64">
                                                    {JSON.stringify(version.prompt_data, null, 2)}
                                                </pre>
                                            </details>

                                            {idx < versions.length - 1 && (
                                                <div className="absolute left-8 top-full h-4 w-0.5 bg-purple-300" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {versions.length === 0 && (
                                    <div className="text-center py-12">
                                        <GitBranch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600">No versions yet. Save the current state to start tracking.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <GitBranch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600">Select a prompt to view its version history</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}