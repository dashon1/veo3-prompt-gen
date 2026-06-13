import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SavePromptModal({ onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        collection: '',
        tags: '',
        is_public: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Save Prompt</h3>
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400 resize-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Collection (optional)</label>
                        <input
                            type="text"
                            value={formData.collection}
                            onChange={(e) => setFormData({...formData, collection: e.target.value})}
                            placeholder="e.g., Product Videos"
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated, optional)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="e.g., cinematic, dark, moody"
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_public"
                            checked={formData.is_public}
                            onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                            className="w-5 h-5 rounded border-purple-300"
                        />
                        <label htmlFor="is_public" className="text-sm text-slate-700">
                            Share with community
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-3xl font-semibold shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                        >
                            Save Prompt
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 rounded-3xl font-semibold shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}