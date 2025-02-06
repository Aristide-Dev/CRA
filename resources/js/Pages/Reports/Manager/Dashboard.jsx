import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    FileText,
    AlertCircle,
    MessageCircle,
    Filter,
    Search
} from 'lucide-react';

export default function ManagerDashboard({ reports }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedReport, setSelectedReport] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        status: '',
        feedback: ''
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        post(route('reports.feedback', selectedReport.id), {
            onSuccess: () => {
                setSelectedReport(null);
                reset();
            },
        });
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'pending' && report.pivot.status === 'pending') ||
                            report.pivot.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <ModernLayout>
            <Head title="Tableau de bord Manager - Rapports" />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                {/* En-tête avec statistiques */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Rapports à examiner
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">En attente</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {reports.filter(r => r.pivot.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {reports.filter(r => r.pivot.status === 'approved').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <XCircle className="w-8 h-8 text-red-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rejetés</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {reports.filter(r => r.pivot.status === 'rejected').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par titre ou auteur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="approved">Approuvés</option>
                            <option value="rejected">Rejetés</option>
                        </select>
                    </div>
                </div>

                {/* Liste des rapports */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Titre & Auteur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de soumission
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredReports.map(report => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {report.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {report.user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(report.pivot.status)}`}>
                                                {getStatusIcon(report.pivot.status)}
                                                <span className="ml-1.5 capitalize">{report.pivot.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    href={route('reports.show', report.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Voir
                                                </Link>
                                                {report.pivot.status === 'pending' && (
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Évaluer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal d'évaluation */}
                {selectedReport && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Évaluer le rapport
                                </h3>
                            </div>
                            <form onSubmit={handleSubmitFeedback}>
                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Décision
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Sélectionner...</option>
                                            <option value="approved">Approuver</option>
                                            <option value="rejected">Rejeter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Commentaire
                                        </label>
                                        <textarea
                                            value={data.feedback}
                                            onChange={e => setData('feedback', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedReport(null);
                                            reset();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm disabled:opacity-50"
                                    >
                                        Soumettre l'évaluation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ModernLayout>
    );
} 