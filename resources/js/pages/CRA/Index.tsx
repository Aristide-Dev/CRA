// CRA/ManagerIndex.jsx
import AppLayout from '@/layouts/app-layout';
import { type Cra } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface CrasByYear {
    [year: string]: Cra[];
}

export default function CRAIndex({ cras }: { cras: CrasByYear }) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const years = Object.keys(cras).sort((a, b) => Number(b) - Number(a));
    const displayedCras = cras[selectedYear] || [];

    // Grouper les CRAs par mois
    const crasByMonth = displayedCras.reduce<{ [key: string]: Cra[] }>((acc, cra) => {
        const monthKey = format(new Date(cra.month_year), 'yyyy-MM');
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(cra);
        return acc;
    }, {});

    return (
        <AppLayout>
            <Head title="Gestion des CRAs" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* En-tête avec sélection d'année */}
                <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 md:mb-0">Gestion des Comptes Rendus d'Activité</h1>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <Link
                            href={route('cra.create')}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-white shadow transition-colors hover:bg-indigo-700"
                        >
                            Nouveau CRA
                        </Link>
                    </div>
                </div>

                {/* Grid de cartes */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(crasByMonth).map(([monthYear, monthCras]) => {
                        const date = new Date(monthYear);
                        const totalCras = monthCras.length;
                        const statusCounts = monthCras.reduce(
                            (acc, cra) => {
                                acc[cra.status] = (acc[cra.status] || 0) + 1;
                                return acc;
                            },
                            {} as Record<string, number>,
                        );

                        return (
                            <div
                                key={monthYear}
                                className="rounded-xl border bg-white p-6 shadow-xl transition-shadow hover:shadow-2xl hover:ring-1 hover:ring-indigo-500"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 uppercase">{format(date, 'MMMM yyyy', { locale: fr })}</h2>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                        {totalCras} CRA{totalCras > 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>En attente:</span>
                                        <span className="font-medium text-yellow-600">{statusCounts.submitted || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Approuvés:</span>
                                        <span className="font-medium text-green-600">{statusCounts.approved || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Rejetés:</span>
                                        <span className="font-medium text-red-600">{statusCounts.rejected || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Brouillons:</span>
                                        <span className="font-medium text-gray-600">{statusCounts.draft || 0}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={route('cra.month.detail', {
                                            year: format(date, 'yyyy'),
                                            month: format(date, 'MM'),
                                        })}
                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Voir détails
                                    </Link>
                                    <Link
                                        href={route('cra.create', { month_year: monthYear })}
                                        className="font-medium text-green-600 hover:text-green-800"
                                    >
                                        Nouveau CRA
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
