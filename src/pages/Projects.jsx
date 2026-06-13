import React, { useState, useEffect } from 'react';
import { Project } from '@/entities/Project';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { VideoGeneration } from '@/entities/VideoGeneration';
import { Character } from '@/entities/Character';
import { User } from '@/entities/User';
import { FolderOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const ProjectCard = ({ project, stats, onEdit, onDelete, onOpen }) => {
    return (
        <div 
            onClick={() => onOpen(project)}
            className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300"
            style={{ borderLeftColor: project.color, borderLeftWidth: '6px' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-4xl">{project.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
                        {project.description && (
                            <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                        className="p-2 hover:bg-white rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="p-2 hover:bg-white rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-xl p-3">
                    <div className="text-2xl font-bold text-purple-600">{stats.prompts || 0}</div>
                    <div className="text-xs text-slate-600">Prompts</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-600">{stats.generations || 0}</div>
                    <div className="text-xs text-slate-600">Videos</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-600">{stats.characters || 0}</div>
                    <div className="text-xs text-slate-600">Characters</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                    <div className="text-2xl font-bold text-orange-600">{project.team_members?.length || 0}</div>
                    <div className="text-xs text-slate-600">Team</div>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    {project.status}
                </span>
            </div>
        </div>
    );
};

const ProjectModal = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState(project || {
        name: '',
        description: '',
        color: '#9333ea',
        icon: '📁',
        status: 'active',
        team_members: []
    });

    const colorOptions = [
        { name: 'Purple', value: '#9333ea' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f59e0b' },
        { name: 'Pink', value: '#ec4899' }
    ];

    const iconOptions = ['📁', '🎬', '🎨', '🚀', '💼', '🎯', '⭐', '🔥', '💡', '🎪'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                    {project ? 'Edit Project' : 'New Project'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                            <div className="grid grid-cols-5 gap-2">
                                {iconOptions.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setFormData({...formData, icon})}
                                        className={`text-2xl p-3 rounded-xl border-2 transition-all ${
                                            formData.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'
                                        }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                            <div className="grid grid-cols-3 gap-2">
                                {colorOptions.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setFormData({...formData, color: color.value})}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            formData.color === color.value ? 'border-slate-800' : 'border-slate-200'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            {project ? 'Update Project' : 'Create Project'}
                        </Button>
                        <Button type="button" onClick={onCancel} variant="outline">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [projectStats, setProjectStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const user = await User.me();
        const userProjects = await Project.filter({ created_by: user.email }, '-created_date');
        setProjects(userProjects);

        // Load stats for each project
        const stats = {};
        for (const project of userProjects) {
            const prompts = await SavedPrompt.filter({ 'metadata.project_id': project.id });
            const generations = await VideoGeneration.filter({ 'metadata.project_id': project.id });
            const characters = await Character.filter({ 'metadata.project_id': project.id });
            stats[project.id] = {
                prompts: prompts.length,
                generations: generations.length,
                characters: characters.length
            };
        }
        setProjectStats(stats);
    };

    const handleSave = async (data) => {
        if (editingProject) {
            await Project.update(editingProject.id, data);
        } else {
            await Project.create(data);
        }
        setShowModal(false);
        setEditingProject(null);
        loadProjects();
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this project? This will not delete the content inside.')) {
            await Project.delete(id);
            loadProjects();
        }
    };

    const handleOpen = (project) => {
        // Store selected project in localStorage for filtering
        localStorage.setItem('selected_project_id', project.id);
        window.location.href = createPageUrl('Library') + `?project=${project.id}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">Projects</h1>
                        <p className="text-slate-600 mt-2">Organize your work into projects</p>
                    </div>
                    <Button
                        onClick={() => { setEditingProject(null); setShowModal(true); }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Project
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-16">
                        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg mb-4">No projects yet</p>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                        >
                            Create Your First Project
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                stats={projectStats[project.id] || {}}
                                onEdit={(p) => { setEditingProject(p); setShowModal(true); }}
                                onDelete={handleDelete}
                                onOpen={handleOpen}
                            />
                        ))}
                    </div>
                )}

                {showModal && (
                    <ProjectModal
                        project={editingProject}
                        onSave={handleSave}
                        onCancel={() => { setShowModal(false); setEditingProject(null); }}
                    />
                )}
            </div>
        </div>
    );
}