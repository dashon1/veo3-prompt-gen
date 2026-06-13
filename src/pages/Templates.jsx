
import React, { useState, useEffect, useCallback } from 'react';
import { Template } from '@/entities/Template';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Filter } from 'lucide-react';

const TemplateCard = ({ template }) => {
    return (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-blue-100/50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300">
            {template.is_official && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 rounded-full text-xs font-bold mb-3">
                    <Sparkles className="w-3 h-3" />
                    OFFICIAL
                </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-2">{template.name}</h3>
            <p className="text-slate-600 text-sm mb-4">{template.description}</p>
            <div className="flex gap-2 items-center justify-between">
                <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    {template.category.replace('_', ' ')}
                </span>
                <Link to={`${createPageUrl('Builder')}?template=${template.id}`}>
                    <button className="px-4 py-2 bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-2xl text-sm font-semibold shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
                        Use Template
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const loadTemplates = useCallback(async () => {
        const allTemplates = await Template.list('-usage_count');
        setTemplates(allTemplates);
    }, []); // No external dependencies are used inside loadTemplates, so empty array is fine.

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    const filterTemplates = useCallback(() => {
        if (selectedCategory === 'all') {
            setFilteredTemplates(templates);
        } else {
            setFilteredTemplates(templates.filter(t => t.category === selectedCategory));
        }
    }, [selectedCategory, templates]); // Depends on selectedCategory and templates

    useEffect(() => {
        filterTemplates();
    }, [filterTemplates]);

    const categories = [
        { value: 'all', label: 'All Templates' },
        { value: 'product_demo', label: 'Product Demo' },
        { value: 'testimonial', label: 'Testimonial' },
        { value: 'cinematic', label: 'Cinematic' },
        { value: 'social_ad', label: 'Social Ad' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'tech', label: 'Tech' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Prompt Templates</h1>
                    <p className="text-slate-600 text-lg mb-6">Start with pre-built templates for common video types</p>

                    {/* Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Filter className="w-5 h-5 text-slate-500" />
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === cat.value
                                        ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]'
                                        : 'bg-gradient-to-br from-white to-purple-50 text-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-600 text-lg">No templates found in this category</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map(template => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
