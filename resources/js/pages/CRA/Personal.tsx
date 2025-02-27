import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Cra, type CraStatus } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'CRAs', href: '#' },
];

const STATUS_BADGES: Record<CraStatus, { label: string; class: string }> = {
    draft: { label: 'Brouillon', class: 'bg-gray-100 text-gray-800' },
    submitted: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Approuvé', class: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejeté', class: 'bg-red-100 text-red-800' },
};

const EDITABLE_STATUSES: CraStatus[] = ['draft', 'submitted'];

export default function Personal({ my_cras }: { my_cras: Cra[] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCra, setEditingCra] = useState<Cra | null>(null);

    const createForm = useForm({ month_year: '' });
    const editForm = useForm({
        month_year: '',
    });

    const handleCreateSubmit = () => {
        createForm.post(route('cra.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = () => {
        if (editingCra) {
            editForm.put(route('cra.update', editingCra.id), {
                onSuccess: () => {
                    setEditingCra(null);
                    editForm.reset();
                },
            });
        }
    };

    const startEdit = (cra: Cra) => {
        setEditingCra(cra);
        editForm.setData('month_year', cra.month_year);
    };

    // Grouper par année puis par mois
    const groupedCras = my_cras.reduce((acc: { [key: string]: Cra[] }, cra) => {
        const monthYear = new Date(cra.month_year).toISOString().slice(0, 7);
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(cra);
        return acc;
    }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes CRAs" />
            <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Mes Comptes Rendus d'Activité</h1>
                    <Button onClick={() => setShowCreateModal(true)} variant="default">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau CRA
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(groupedCras)
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .map(([monthYear, cras]) => {
                            const date = new Date(monthYear + '-01');
                            return (
                                <div key={monthYear} className="rounded-lg border bg-white shadow">
                                    <div className="border-b bg-indigo-500 px-4 py-3 rounded-t-xl">
                                        <h3 className="flex items-center text-lg font-medium text-white">
                                            <Calendar className="mr-2 h-5 w-5 text-white" />
                                            {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                        </h3>
                                    </div>
                                    <div className="divide-y">
                                        {cras.map((cra) => (
                                            <div key={cra.id} className="flex items-center justify-between p-4">
                                                <div className="flex items-center space-x-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${STATUS_BADGES[cra.status].class}`}
                                                    >
                                                        {STATUS_BADGES[cra.status].label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {EDITABLE_STATUSES.includes(cra.status) && (
                                                        <Button
                                                            onClick={() => startEdit(cra)}
                                                            className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                                        >
                                                            Modifier
                                                        </Button>
                                                    )}
                                                    <Link
                                                        href={route('cra.show', cra.id)}
                                                        className="rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                                                    >
                                                        Voir détails
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nouveau CRA</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Période</label>
                            <DatePicker
                                selected={createForm.data.month_year ? new Date(createForm.data.month_year) : null}
                                onChange={(date) => createForm.setData('month_year', date ? date.toISOString().slice(0, 7) : '')}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                locale="fr"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <InputError message={createForm.errors.month_year} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleCreateSubmit} disabled={createForm.processing}>
                            Créer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editingCra !== null} onOpenChange={(open) => !open && setEditingCra(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier le CRA</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Période</label>
                            <DatePicker
                                selected={editForm.data.month_year ? new Date(editForm.data.month_year) : null}
                                onChange={(date) => editForm.setData('month_year', date ? date.toISOString().slice(0, 7) : '')}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                locale="fr"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <InputError message={editForm.errors.month_year} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingCra(null)}>
                            Annuler
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={editForm.processing}>
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
