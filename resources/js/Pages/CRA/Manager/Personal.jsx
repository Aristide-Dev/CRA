import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Personal({ my_cras }) {
  // Fonction pour grouper les CRAs par mois
  const groupCrasByMonth = (crasArray) => {
    return crasArray.reduce((acc, cra) => {
      // On s'assure que month_year est bien une chaîne de type "YYYY-MM"
      const monthYear = new Date(cra.month_year).toISOString().slice(0, 7);
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(cra);
      return acc;
    }, {});
  };

  const groupedCras = groupCrasByMonth(my_cras);

  return (
    <ModernLayout>
      <Head title="Mes CRAS" />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mes Comptes Rendus d'Activité</h1>
          <Link 
            href={route('manager.cra.create')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Nouveau CRA
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedCras).map(([monthYear, monthCras]) => {
            // On s'assure que monthCras est un tableau
            const crasArray = Array.isArray(monthCras) ? monthCras : Object.values(monthCras);
            // Générer un objet Date valide à partir de la clé monthYear en ajoutant "-01"
            const date = new Date(monthYear + '-01');
            const totalCras = crasArray.length;
            const submittedCount = crasArray.filter(cra => cra.status === 'submitted').length;
            const approvedCount = crasArray.filter(cra => cra.status === 'approved').length;
            const rejectedCount = crasArray.filter(cra => cra.status === 'rejected').length;
            const draftCount = crasArray.filter(cra => cra.status === 'draft').length;

            return (
              <a 
                href={route('manager.cra.month.detail', {
                  year: date.getFullYear(),
                  month: String(date.getMonth() + 1).padStart(2, '0')
                })}
                key={monthYear} 
                className="bg-white rounded-xl border shadow-xl p-6 hover:shadow-2xl transition-shadow hover:ring-1 hover:ring-indigo-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 uppercase">
                    {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {totalCras} CRA{totalCras > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>En attente :</span>
                    <span className="font-medium text-yellow-600">{submittedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approuvés :</span>
                    <span className="font-medium text-green-600">{approvedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rejetés :</span>
                    <span className="font-medium text-red-600">{rejectedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Brouillons :</span>
                    <span className="font-medium text-gray-600">{draftCount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Link 
                    href={route('manager.cra.month.detail', {
                      year: date.getFullYear(),
                      month: String(date.getMonth() + 1).padStart(2, '0')
                    })}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Voir détails
                  </Link>
                  <Link 
                    href={route('manager.cra.create', { month_year: monthYear })}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Nouveau CRA
                  </Link>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </ModernLayout>
  );
} 