// CRA/WorkerIndex.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';

export default function CRAIndex({ cras }) {
  // Fonction de suppression d'un CRA
  const deleteCRA = (id) => {
    if (confirm('Supprimer ce CRA ?')) {
      // La fonction delete() est attendue d'Inertia (ou Inertia.delete)
      // Vous pouvez aussi utiliser router.delete si vous préférez
      router.delete(route('cra.destroy', id));
    }
  };

  return (
    <ModernLayout>
      <Head title="Mes CRAs" />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Mes Comptes Rendus d'Activité
          </h1>
          <Link 
            href={route('cra.create')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Nouveau CRA
          </Link>
        </div>

        {/* Grid de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cras.map((cra) => (
            <a href={route('cra.show', cra.id)} key={cra.id} className="bg-white rounded-xl border shadow-xl p-6 hover:shadow-2xl transition-shadow hover:ring-1 hover:ring-indigo-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {new Date(cra.month_year).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${cra.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : cra.status === 'rejected' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {cra.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Heures Total :</span> {cra.activities.reduce((sum, a) => sum + parseFloat(a.duration), 0)}h
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  href={route('cra.show', cra.id)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Voir +
                </Link>
                <div className="flex space-x-4">
                  <Link 
                    href={route('cra.edit', cra.id)}
                    className="text-yellow-500 hover:text-yellow-600 font-medium"
                  >
                    Éditer
                  </Link>
                  <button 
                    onClick={() => deleteCRA(cra.id)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </ModernLayout>
  );
}
