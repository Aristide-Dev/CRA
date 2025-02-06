import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    FileText, 
    Plus,
    Filter,
    Search
} from 'lucide-react';

export default function Index({ reports, auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const isManager = auth.user.role === 'manager';

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'draft': return <Clock className="w-5 h-5 text-gray-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <ModernLayout>
            <Head title="Rapports" />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                {/* En-tête avec bouton de création */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isManager ? 'Rapports à examiner' : 'Mes Rapports'}
                    </h1>
                    {!isManager && (
                        <Link
                            href={route('reports.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nouveau Rapport
                        </Link>
                    )}
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
                            <option value="draft">Brouillon</option>
                            <option value="submitted">Soumis</option>
                            <option value="approved">Approuvé</option>
                            <option value="rejected">Rejeté</option>
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
                                        Titre
                                    </th>
                                    {isManager && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Auteur
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de création
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Réponses
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReports.map(report => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                                                <div className="text-sm font-medium text-gray-900">
                                                    {report.title}
                                                </div>
                                            </div>
                                        </td>
                                        {isManager && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{report.user.name}</div>
                                                <div className="text-sm text-gray-500">{report.user.email}</div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                <span className="ml-1.5 capitalize">{report.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.managers.filter(m => m.pivot.status !== 'pending').length} / {report.managers.length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    href={route('reports.show', report.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Voir
                                                </Link>
                                                {!isManager && report.status === 'draft' && (
                                                    <Link
                                                        href={route('reports.edit', report.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Message si aucun rapport */}
                    {filteredReports.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rapport trouvé</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || statusFilter !== 'all' 
                                    ? "Aucun rapport ne correspond à vos critères de recherche" 
                                    : "Commencez par créer un nouveau rapport"}
                            </p>
                            {!isManager && !searchTerm && statusFilter === 'all' && (
                                <div className="mt-6">
                                    <Link
                                        href={route('reports.create')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Nouveau Rapport
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ModernLayout>
    );
} 