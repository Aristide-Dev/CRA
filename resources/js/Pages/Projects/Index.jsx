import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import ModernLayout from '@/Layouts/ModernLayout';

export default function ProjectsIndex({ projects }) {
    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        id: null,
        name: '',
        description: '',
    });

    const deleteForm = useForm({
        id: null,
    });

    const [editingProjectId, setEditingProjectId] = useState(null);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('projects.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const handleEdit = (project) => {
        setEditingProjectId(project.id);
        editForm.setData({
            id: project.id,
            name: project.name,
            description: project.description,
        });
    };

    const handleDelete = (project) => {
        if(confirm('Are you sure you want to delete this project ?',))
        {
            deleteForm.delete(route('projects.destroy', project.id), {
                preserveScroll: true,
            });
        }
    };

    const handleUpdateSubmit = () => {
        editForm.put(route('projects.update', editForm.data.id), {
            onSuccess: () => {
                setEditingProjectId(null);
                editForm.reset();
            },
        });
    };

    const cancelEdit = () => {
        setEditingProjectId(null);
        editForm.reset();
    };

    return (
        <ModernLayout className="max-w-4xl mx-auto px-4 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
            <div className="bg-white shadow-2xl rounded-2xl p-8">
                <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">Mes Projets</h1>

                {/* Create Project Form */}
                <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                            placeholder="Nom du nouveau projet"
                            className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
                        />
                        {createForm.errors.name && (
                            <p className="text-red-500 text-sm">{createForm.errors.name}</p>
                        )}

                        <textarea
                            value={createForm.data.description}
                            onChange={(e) => createForm.setData('description', e.target.value)}
                            placeholder="Description du projet"
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300 resize-none"
                        />
                        {createForm.errors.description && (
                            <p className="text-red-500 text-sm">{createForm.errors.description}</p>
                        )}

                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Créer un projet</span>
                        </button>
                    </form>
                </div>

                {/* Projects List */}
                <div className="space-y-6">
                    {projects.map((project) => (
                        <div 
                            key={project.id} 
                            className="bg-white border-2 border-indigo-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            {editingProjectId === project.id ? (
                                // Edit Mode
                                <div className="p-6 space-y-4">
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-3 text-xl font-semibold rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-red-500 text-sm">{editForm.errors.name}</p>
                                    )}

                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300 resize-none"
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-red-500 text-sm">{editForm.errors.description}</p>
                                    )}

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={handleUpdateSubmit}
                                            disabled={editForm.processing}
                                            className="flex-1 flex items-center justify-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 space-x-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            <span>Enregistrer</span>
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="flex-1 flex items-center justify-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 space-x-2"
                                        >
                                            <X className="w-5 h-5" />
                                            <span>Annuler</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-indigo-800 mb-2">{project.name}</h2>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="flex-1 flex items-center justify-center bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300 space-x-2"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                            <span>Modifier</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project)}
                                            className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 space-x-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            <span>Supprimer</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </ModernLayout>
    );
}