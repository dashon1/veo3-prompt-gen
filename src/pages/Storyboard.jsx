import React, { useState, useEffect } from 'react';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { User } from '@/entities/User';
import { Plus, Trash2, Edit, Copy, Download, Film, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SceneCard = ({ scene, index, onEdit, onDelete, onMove, totalScenes }) => {
    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{scene.title}</h3>
                        <p className="text-sm text-slate-600">Scene {index + 1}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {index > 0 && (
                        <button
                            onClick={() => onMove(index, 'up')}
                            className="p-2 hover:bg-purple-100 rounded-lg text-purple-600"
                            title="Move up"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    )}
                    {index < totalScenes - 1 && (
                        <button
                            onClick={() => onMove(index, 'down')}
                            className="p-2 hover:bg-purple-100 rounded-lg text-purple-600"
                            title="Move down"
                        >
                            <ArrowDown className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(index)}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                        title="Edit scene"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        title="Delete scene"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">DESCRIPTION</div>
                    <p className="text-sm text-slate-700">{scene.prompt_data?.scene_description || 'No description'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">COMPOSITION</div>
                        <p className="text-sm text-slate-700">{scene.prompt_data?.shot_composition || '-'}</p>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">STYLE</div>
                        <p className="text-sm text-slate-700">{scene.prompt_data?.visual_style || '-'}</p>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">MOVEMENT</div>
                        <p className="text-sm text-slate-700">{scene.prompt_data?.camera_movement || '-'}</p>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">LIGHTING</div>
                        <p className="text-sm text-slate-700">{scene.prompt_data?.lighting || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Storyboard() {
    const [storyboards, setStoryboards] = useState([]);
    const [currentStoryboard, setCurrentStoryboard] = useState(null);
    const [showNewStoryboard, setShowNewStoryboard] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Load all saved prompts with 'storyboard' tag
        const prompts = await SavedPrompt.filter({ created_by: currentUser.email }, '-created_date');
        const storyboardPrompts = prompts.filter(p => p.tags?.includes('storyboard'));
        setStoryboards(storyboardPrompts);
    };

    const createNewStoryboard = async (title) => {
        const newStoryboard = await SavedPrompt.create({
            title: title,
            description: 'Multi-scene storyboard',
            prompt_data: {
                scenes: []
            },
            tags: ['storyboard'],
            collection: 'Storyboards'
        });
        
        setCurrentStoryboard(newStoryboard);
        setShowNewStoryboard(false);
        loadData();
    };

    const addScene = () => {
        window.location.href = createPageUrl('Builder') + '?storyboard=' + currentStoryboard.id;
    };

    const deleteScene = async (index) => {
        if (!confirm('Delete this scene?')) return;
        
        const scenes = [...(currentStoryboard.prompt_data.scenes || [])];
        scenes.splice(index, 1);
        
        await SavedPrompt.update(currentStoryboard.id, {
            prompt_data: { scenes }
        });
        
        setCurrentStoryboard({
            ...currentStoryboard,
            prompt_data: { scenes }
        });
    };

    const moveScene = async (index, direction) => {
        const scenes = [...(currentStoryboard.prompt_data.scenes || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        
        [scenes[index], scenes[newIndex]] = [scenes[newIndex], scenes[index]];
        
        await SavedPrompt.update(currentStoryboard.id, {
            prompt_data: { scenes }
        });
        
        setCurrentStoryboard({
            ...currentStoryboard,
            prompt_data: { scenes }
        });
    };

    const exportStoryboard = () => {
        const dataStr = JSON.stringify(currentStoryboard, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `${currentStoryboard.title.replace(/\s+/g, '_')}_storyboard.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {!currentStoryboard ? (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                                    <Film className="w-10 h-10 text-purple-600" />
                                    Storyboards
                                </h1>
                                <p className="text-slate-600">Create multi-scene video storyboards</p>
                            </div>
                            <Button
                                onClick={() => setShowNewStoryboard(true)}
                                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Storyboard
                            </Button>
                        </div>

                        {storyboards.length === 0 ? (
                            <div className="text-center py-16">
                                <Film className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg mb-4">No storyboards yet</p>
                                <Button
                                    onClick={() => setShowNewStoryboard(true)}
                                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                >
                                    Create Your First Storyboard
                                </Button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {storyboards.map(storyboard => (
                                    <button
                                        key={storyboard.id}
                                        onClick={() => setCurrentStoryboard(storyboard)}
                                        className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all text-left"
                                    >
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{storyboard.title}</h3>
                                        <p className="text-slate-600 text-sm">
                                            {storyboard.prompt_data?.scenes?.length || 0} scenes
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showNewStoryboard && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6">New Storyboard</h3>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            createNewStoryboard(e.target.title.value);
                                        }}
                                        className="space-y-4"
                                    >
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Storyboard title"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                                        />
                                        <div className="flex gap-3">
                                            <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                                Create
                                            </Button>
                                            <Button type="button" onClick={() => setShowNewStoryboard(false)} variant="outline">
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <button
                                    onClick={() => setCurrentStoryboard(null)}
                                    className="text-purple-600 hover:text-purple-700 mb-2"
                                >
                                    ← Back to Storyboards
                                </button>
                                <h1 className="text-4xl font-bold text-slate-800">{currentStoryboard.title}</h1>
                                <p className="text-slate-600">
                                    {currentStoryboard.prompt_data?.scenes?.length || 0} scenes
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={exportStoryboard}
                                    variant="outline"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Export
                                </Button>
                                <Button
                                    onClick={addScene}
                                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Scene
                                </Button>
                            </div>
                        </div>

                        {(!currentStoryboard.prompt_data?.scenes || currentStoryboard.prompt_data.scenes.length === 0) ? (
                            <div className="text-center py-16">
                                <Film className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg mb-4">No scenes yet</p>
                                <Button
                                    onClick={addScene}
                                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                >
                                    Add First Scene
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {currentStoryboard.prompt_data.scenes.map((scene, index) => (
                                    <SceneCard
                                        key={index}
                                        scene={scene}
                                        index={index}
                                        onEdit={(idx) => {
                                            window.location.href = createPageUrl('Builder') + 
                                                '?storyboard=' + currentStoryboard.id + 
                                                '&scene=' + idx;
                                        }}
                                        onDelete={deleteScene}
                                        onMove={moveScene}
                                        totalScenes={currentStoryboard.prompt_data.scenes.length}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}