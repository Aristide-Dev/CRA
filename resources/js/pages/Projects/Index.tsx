import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Project } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, Briefcase, Calendar, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Liste des projets',
        href: '#',
    },
];

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm<{
        id: number | null;
        name: string;
        description: string;
    }>({
        id: null,
        name: '',
        description: '',
    });

    const deleteForm = useForm({
        id: null,
    });

    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createForm.post(route('projects.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    };

    const handleEdit = (project: Project) => {
        setEditingProjectId(project.id);
        editForm.setData({
            id: project.id,
            name: project.name,
            description: project.description,
        });
    };

    const confirmDelete = (project: Project) => {
        setProjectToDelete(project);
    };

    const handleDelete = () => {
        if (projectToDelete) {
            deleteForm.delete(route('projects.destroy', projectToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setProjectToDelete(null);
                },
            });
        }
    };

    const handleUpdateSubmit = () => {
        if (editForm.data.id) {
            editForm.put(route('projects.update', editForm.data.id), {
                onSuccess: () => {
                    setEditingProjectId(null);
                    editForm.reset();
                },
            });
        }
    };

    const cancelEdit = () => {
        setEditingProjectId(null);
        editForm.reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste des projets" />

            {/* Arrière-plan décoratif */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
            <div
                className="bg-grid-indigo-100/50 absolute inset-0 -z-10 bg-[size:var(--bg-size)]"
                style={{ '--bg-size': '20px' } as React.CSSProperties}
            />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="flex items-center text-3xl font-bold text-indigo-900">
                        <Briefcase className="mr-3 h-8 w-8 text-indigo-600" />
                        Mes Projets
                    </h1>

                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg"
                    >
                        {showCreateForm ? (
                            <>
                                <X className="mr-2 h-5 w-5" />
                                <span>Annuler</span>
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-5 w-5" />
                                <span>Nouveau Projet</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Create Project Form - collapsible */}
                {showCreateForm && (
                    <div className="animate-fadeIn mb-10 transform rounded-xl border border-indigo-100 bg-white p-8 shadow-lg transition-all duration-300">
                        <h2 className="mb-6 flex items-center text-xl font-semibold text-indigo-800">
                            <Plus className="mr-2 h-5 w-5 text-indigo-500" />
                            Créer un nouveau projet
                        </h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nom du projet
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="Entrez le nom du projet"
                                    className="w-full rounded-lg border border-indigo-200 px-4 py-3 transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div>
                                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    placeholder="Décrivez votre projet en détail..."
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-indigo-200 px-4 py-3 transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />

                                <InputError message={createForm.errors.description} />
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-white shadow-md transition duration-200 hover:bg-indigo-700"
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    <span>Enregistrer</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects List */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="group flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-md transition-all duration-200 hover:shadow-xl"
                            >
                                {editingProjectId === project.id ? (
                                    // Edit Mode
                                    <>
                                        <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                                        <div className="flex h-full flex-col justify-between space-y-4 bg-amber-50 p-6">
                                            <div>
                                                <h3 className="mb-3 flex items-center text-sm font-medium tracking-wider text-amber-600 uppercase">
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Modification en cours
                                                </h3>
                                                <Input
                                                    type="text"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                    className="mb-4 w-full rounded-lg border border-amber-200 bg-white px-4 py-2 text-lg font-semibold transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                                />

                                                <InputError message={editForm.errors.name} />

                                                <Textarea
                                                    value={editForm.data.description}
                                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                                    rows={3}
                                                    className="w-full resize-none rounded-lg border border-amber-200 bg-white px-4 py-2 transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                                />
                                                <InputError message={editForm.errors.description} />
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button
                                                    onClick={handleUpdateSubmit}
                                                    disabled={editForm.processing}
                                                    className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-amber-500 py-2 text-white transition duration-200 hover:bg-amber-600"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    <span>Enregistrer</span>
                                                </Button>
                                                <Button
                                                    onClick={cancelEdit}
                                                    className="flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                                        <div className="flex h-full w-full min-w-xs flex-col justify-between space-y-4 p-6">
                                            <div>
                                                <h2 className="mb-3 line-clamp-1 text-xl font-bold text-indigo-800 transition-colors group-hover:text-indigo-600">
                                                    {project.name}
                                                </h2>
                                                <p className="mb-4 line-clamp-3 text-gray-600">{project.description}</p>

                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="mr-1 h-3.5 w-3.5 text-indigo-500" />
                                                    <span>Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button
                                                    onClick={() => handleEdit(project)}
                                                    className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-indigo-100 py-2 text-indigo-700 transition duration-200 hover:bg-indigo-200"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    <span>Modifier</span>
                                                </Button>
                                                <Button
                                                    onClick={() => confirmDelete(project)}
                                                    className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition duration-200 hover:bg-red-100 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-16 text-center shadow-md">
                            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                <Briefcase className="h-10 w-10" />
                            </div>
                            <h3 className="mb-3 text-2xl font-medium text-gray-800">Aucun projet pour le moment</h3>
                            <p className="mx-auto mb-8 max-w-lg text-lg text-gray-500">
                                Commencez par créer votre premier projet en cliquant sur le bouton "Nouveau Projet" ci-dessus.
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="mx-auto flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-indigo-700"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                <span>Créer mon premier projet</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Boîte de dialogue de confirmation de suppression */}
            <Dialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le projet <span className="font-semibold text-gray-700">{projectToDelete?.name}</span>{' '}
                            ?<p className="mt-2 text-red-500">Cette action est irréversible.</p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                            onClick={() => setProjectToDelete(null)}
                            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                            className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                        >
                            {deleteForm.processing ? (
                                'Suppression...'
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer définitivement
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
