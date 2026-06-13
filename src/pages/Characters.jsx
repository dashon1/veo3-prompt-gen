import React, { useState, useEffect } from 'react';
import { Character } from '@/entities/Character';
import { User } from '@/entities/User';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CharacterCard = ({ character, onEdit, onDelete }) => {
    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-purple-100/50">
            <div className="mb-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-800">{character.name}</h3>
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                        {character.category}
                    </span>
                </div>
                
                {character.demographics && (
                    <p className="text-sm text-slate-600 mb-2">
                        <span className="font-semibold">Demographics:</span> {character.demographics}
                    </p>
                )}
                
                <p className="text-sm text-slate-700 mb-3">
                    <span className="font-semibold">Visual Traits:</span> {character.visual_traits}
                </p>
                
                {character.personality && (
                    <p className="text-sm text-slate-600 mb-3">
                        <span className="font-semibold">Personality:</span> {character.personality}
                    </p>
                )}

                {character.tags && character.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {character.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() => onEdit(character)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                </Button>
                <Button
                    onClick={() => onDelete(character.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

const CharacterEditor = ({ character, onSave, onCancel }) => {
    const [formData, setFormData] = useState(character || {
        name: '',
        demographics: '',
        visual_traits: '',
        personality: '',
        category: 'protagonist',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tag)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">
                        {character ? 'Edit Character' : 'New Character'}
                    </h3>
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                            placeholder="e.g., Detective Sarah Chen"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Visual Traits <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.visual_traits}
                            onChange={(e) => setFormData({ ...formData, visual_traits: e.target.value })}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400 resize-none"
                            placeholder="Physical appearance, clothing, distinctive features..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Demographics</label>
                        <input
                            type="text"
                            value={formData.demographics}
                            onChange={(e) => setFormData({ ...formData, demographics: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                            placeholder="e.g., Mid-30s, Asian American, female"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Personality</label>
                        <textarea
                            value={formData.personality}
                            onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400 resize-none"
                            placeholder="Character traits, behaviors, mannerisms..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                        >
                            <option value="protagonist">Protagonist</option>
                            <option value="supporting">Supporting</option>
                            <option value="background">Background</option>
                            <option value="archetype">Archetype</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                                placeholder="Add a tag..."
                            />
                            <Button type="button" onClick={addTag} size="sm">
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Save Character
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Characters() {
    const [characters, setCharacters] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState(null);

    useEffect(() => {
        loadCharacters();
    }, []);

    const loadCharacters = async () => {
        const user = await User.me();
        const chars = await Character.filter({ created_by: user.email }, '-created_date');
        setCharacters(chars);
    };

    const handleSave = async (characterData) => {
        try {
            if (editingCharacter) {
                await Character.update(editingCharacter.id, characterData);
            } else {
                await Character.create(characterData);
            }
            setShowEditor(false);
            setEditingCharacter(null);
            loadCharacters();
        } catch (error) {
            console.error('Error saving character:', error);
            alert('Failed to save character');
        }
    };

    const handleEdit = (character) => {
        setEditingCharacter(character);
        setShowEditor(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this character?')) {
            await Character.delete(id);
            loadCharacters();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Character Library</h1>
                        <p className="text-slate-600 text-lg">Create consistent characters for your videos</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCharacter(null);
                            setShowEditor(true);
                        }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Character
                    </Button>
                </div>

                {characters.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-600 text-lg mb-4">No characters yet</p>
                        <Button
                            onClick={() => setShowEditor(true)}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                        >
                            Create Your First Character
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map(character => (
                            <CharacterCard
                                key={character.id}
                                character={character}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {showEditor && (
                    <CharacterEditor
                        character={editingCharacter}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowEditor(false);
                            setEditingCharacter(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}