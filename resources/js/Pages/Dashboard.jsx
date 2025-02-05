import React from "react";
import { usePage } from "@inertiajs/react";
import ModernLayout from '@/Layouts/ModernLayout';

export default function Dashboard() {
  const { totalUsers, adminCount, userCount, latestUsers } = usePage().props;

  return (
    <ModernLayout className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Utilisateurs</h2>
          <p className="text-2xl">{totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Admins</h2>
          <p className="text-2xl">{adminCount}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Utilisateurs</h2>
          <p className="text-2xl">{userCount}</p>
        </div>
      </div>

      {/* Liste des derniers utilisateurs */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Derniers utilisateurs</h2>
        <ul className="bg-gray-100 p-4 rounded-lg">
          {latestUsers.map((user) => (
            <li key={user.id} className="border-b py-2 last:border-none">
              <span className="font-semibold">{user.name}</span> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </ModernLayout>
  );
}
