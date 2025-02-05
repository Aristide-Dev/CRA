import { Head, Link } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
// import { Inertia } from '@inertiajs/inertia';

export default function CRAIndex({ cras }) {
    const deleteCRA = (id) => {
        if (confirm('Supprimer ce CRA ?')) {
            delete(route('cra.destroy', id));
        }
    };

    return (
        <ModernLayout>
            <Head title="Mes CRAs" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mes Comptes Rendus d'Activité</h1>
                    <Link 
                        href={route('cra.create')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nouveau CRA
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mois/Année</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heures Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cras.map((cra) => (
                                <tr key={cra.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(cra.month_year).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            cra.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            cra.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {cra.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {cra.activities.reduce((sum, a) => sum + parseFloat(a.duration), 0)}h
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <Link 
                                            href={route('cra.show', cra.id)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            Voir+
                                        </Link>
                                        <Link 
                                            href={route('cra.edit', cra.id)}
                                            className="text-yellow-500 hover:text-yellow-600"
                                        >
                                            Éditer
                                        </Link>
                                        <button 
                                            onClick={() => deleteCRA(cra.id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ModernLayout>
    );
}