import AppLayout from '@/layouts/app-layout';
import { type Cra } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, CheckCircle2, Copy, FileText, Plus, XCircle } from 'lucide-react';
import React, { useState } from 'react';

type Status = 'all' | 'draft' | 'approved' | 'rejected' | 'submitted';

interface MonthDetailProps {
    cras: Cra[];
    year: string;
    month: string;
}

interface StatusConfig {
    color: string;
    icon: React.ReactElement;
    label: string;
}

export default function MonthDetail({ cras, year, month }: MonthDetailProps) {
    const [filterStatus, setFilterStatus] = useState<Status>('all');

    console.log('cras', cras);

    const monthDate = new Date(Number(year), Number(month) - 1);
    const monthName = format(monthDate, 'MMMM yyyy', { locale: fr });

    const filteredCras = filterStatus === 'all' ? cras : cras.filter((cra) => cra.status === filterStatus);

    const statusCount: Record<Status, number> = {
        all: cras.length,
        draft: cras.filter((cra) => cra.status === 'draft').length,
        approved: cras.filter((cra) => cra.status === 'approved').length,
        rejected: cras.filter((cra) => cra.status === 'rejected').length,
        submitted: cras.filter((cra) => cra.status === 'submitted').length,
    };

    const getStatusConfig = (status: Status): StatusConfig => {
        switch (status) {
            case 'draft':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <Copy className="h-5 w-5 text-yellow-600" />,
                    label: 'Brouillon',
                };
            case 'approved':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
                    label: 'Approuvé',
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    label: 'Rejeté',
                };
            case 'submitted':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <FileText className="h-5 w-5 text-blue-600" />,
                    label: 'Soumis',
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <FileText className="h-5 w-5 text-gray-600" />,
                    label: 'Tous',
                };
        }
    };

    const calculateCraStats = (cra: Cra) => {
        const uniqueProjects = new Set(cra.activities.map((activity) => activity.project.id));

        return {
            totalHours: cra.activities.reduce((sum: number, activity) => sum + parseFloat(activity.duration.toString()), 0),
            totalActivities: cra.activities.length,
            totalProjects: uniqueProjects.size,
        };
    };

    return (
        <AppLayout>
            <Head title={`CRAs - ${monthName}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Enhanced Header with Icon */}
                <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Calendar className="h-10 w-10 text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">CRAs de {monthName}</h1>
                            <p className="mt-1 flex items-center text-sm text-gray-600">{cras.length} CRA(s) au total</p>
                        </div>
                    </div>
                    <Link
                        href={route('cra.create', {
                            month_year: `${year}-${month.toString().padStart(2, '0')}`,
                        })}
                        className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nouveau CRA</span>
                    </Link>
                </div>

                {/* Improved Filters with Better Visual Distinction */}
                <div className="mb-6 flex space-x-4 rounded-lg bg-white p-4 shadow-sm">
                    {Object.entries({
                        all: 'Tous',
                        submitted: 'Soumis',
                        draft: 'Brouillons',
                        approved: 'Approuvés',
                        rejected: 'Rejetés',
                    }).map(([key, label]) => {
                        const isActive = filterStatus === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(key as Status)}
                                className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'bg-indigo-100 font-semibold text-indigo-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                } `}
                            >
                                {getStatusConfig(key as Status).icon}
                                <span>
                                    {label} ({statusCount[key as Status]})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Enhanced Table with More Refined Design */}
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                    <table className="min-w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                {['Utilisateur', 'Statut', 'Activités', 'Projets', 'Heures Totales', 'Dernière Modification', 'Actions'].map(
                                    (header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            {header}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCras.map((cra) => {
                                const stats = calculateCraStats(cra);
                                const statusConfig = getStatusConfig(cra.status as Status);
                                return (
                                    <tr key={cra.id} className="transition-colors duration-150 hover:bg-gray-200">
                                        <td
                                            onClick={() => (window.location.href = route('cra.details', cra.id))}
                                            className="cursor-pointer px-6 py-4 whitespace-nowrap"
                                        >
                                            <div className="text-sm font-medium text-gray-900">{cra.user.name}</div>
                                            <div className="text-sm text-gray-500">{cra.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                                            >
                                                {statusConfig.icon}
                                                <span>{statusConfig.label}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {stats.totalActivities} activité
                                                {stats.totalActivities > 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(stats.totalHours / stats.totalActivities).toFixed(1)}h en moyenne
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {stats.totalProjects} projet
                                                {stats.totalProjects > 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(stats.totalHours / stats.totalProjects).toFixed(1)}h par projet
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{stats.totalHours}h</div>
                                            <div className="text-xs text-gray-500">{((stats.totalHours / 7) * 5).toFixed(1)}h / semaine</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {new Date(cra.updated_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    href={route('cra.details', cra.id)}
                                                    className="text-indigo-600 transition-colors hover:text-indigo-900"
                                                >
                                                    Détails
                                                </Link>
                                                {cra.status !== 'approved' && (
                                                    <Link
                                                        href={route('cra.edit', cra.id)}
                                                        className="text-yellow-600 transition-colors hover:text-yellow-900"
                                                    >
                                                        Éditer
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Footer with Totals */}
                            <tr className="border-t border-gray-200 bg-gray-50 font-medium">
                                <td colSpan={2} className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">
                                    Total
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                    {filteredCras.reduce((sum, cra) => sum + cra.activities.length, 0)} activités
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                    {new Set(filteredCras.flatMap((cra) => cra.activities.map((activity) => activity.project.id))).size} projets
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                    {filteredCras.reduce((sum, cra) => sum + calculateCraStats(cra).totalHours, 0)}h
                                </td>
                                <td colSpan={2} className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">
                                    Total
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
