import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import ModernLayout from "@/Layouts/ModernLayout";
import { Head } from "@inertiajs/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Composant pour les KPI Cards
const KpiCard = ({ icon, title, value, trend, link, linkText, bgColor }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
          {icon}
        </div>
        <div className="ml-5">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className="ml-2 text-xs font-medium text-green-600">
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    {link && (
      <div className="bg-gray-50 px-5 py-3">
        <Link href={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          {linkText}
        </Link>
      </div>
    )}
  </div>
);

// Composant pour les statistiques CRA
const CraStatsSection = ({ craStats }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Statistiques CRAS</h3>
    </div>
    <div className="px-6 py-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
          <div className="flex-shrink-0 p-3 bg-indigo-200 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-indigo-700">Heures totales</h4>
            <p className="text-xl font-semibold text-gray-900">{craStats.total_hours}</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <div className="flex-shrink-0 p-3 bg-green-200 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-green-700">Activités totales</h4>
            <p className="text-xl font-semibold text-gray-900">{craStats.total_activities}</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
          <div className="flex-shrink-0 p-3 bg-purple-200 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-purple-700">Projets impliqués</h4>
            <p className="text-xl font-semibold text-gray-900">{craStats.total_projects}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour les taux d'approbation
const ApprovalRates = ({ approvalRate, rejectionRate }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Taux d'approbation et de rejet</h3>
    </div>
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Approbation</h4>
        <div className="relative pt-1">
          <div className="overflow-hidden h-4 text-xs flex rounded-full bg-green-200">
            <div 
              style={{ width: `${approvalRate}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500">
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">0%</div>
            <div className="text-sm font-semibold text-gray-700">{approvalRate}%</div>
            <div className="text-xs text-gray-500">100%</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Rejet</h4>
        <div className="relative pt-1">
          <div className="overflow-hidden h-4 text-xs flex rounded-full bg-red-200">
            <div 
              style={{ width: `${rejectionRate}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500">
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">0%</div>
            <div className="text-sm font-semibold text-gray-700">{rejectionRate}%</div>
            <div className="text-xs text-gray-500">100%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour la distribution des activités
const ActivityDistribution = ({ activitiesByType }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Distribution des Activités</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique circulaire */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Object.entries(activitiesByType).map(([type, data]) => ({
                  name: type,
                  value: data.count
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {Object.entries(activitiesByType).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Liste détaillée */}
        <div className="space-y-4">
          {Object.entries(activitiesByType).map(([type, data], index) => (
            <div key={type} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{type}</h4>
                <span className="text-xs font-medium text-gray-500">
                  {data.percentage_count}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nombre d'activités</p>
                  <p className="text-lg font-semibold text-gray-900">{data.count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total d'heures</p>
                  <p className="text-lg font-semibold text-gray-900">{data.total_hours}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                    <div
                      style={{
                        width: `${data.percentage_count}%`,
                        backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Composant pour les statistiques de projet
const ProjectStats = ({ projectStats, filters, handleFilterSubmit, handleChange, projectsList }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Statistiques par Projet</h3>
    </div>
    <div className="px-6 py-5">
      <form onSubmit={handleFilterSubmit} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Date de début</label>
          <input 
            type="date" 
            name="start_date" 
            value={filters.start_date} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium">Date de fin</label>
          <input 
            type="date" 
            name="end_date" 
            value={filters.end_date} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium">Projet (optionnel)</label>
          <select 
            name="project_id" 
            value={filters.project_id || ''} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300">
            <option value="">Tous les projets</option>
            {projectsList.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button 
            type="submit" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Filtrer
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {projectStats && Object.keys(projectStats).length > 0 ? (
          Object.values(projectStats).map((stats, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{stats.project.name}</h4>
              <p>Total d'heures : {stats.total_hours}</p>
              <p>Nombre d'activités : {stats.total_activities}</p>
              <p>Durée moyenne : {stats.average_duration}h</p>
            </div>
          ))
        ) : (
          <p>Aucune donnée pour ces filtres.</p>
        )}
      </div>
    </div>
  </div>
);

// Composant pour les graphiques des projets
const ProjectCharts = ({ projectActivitiesData, projectHoursData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Projets les plus actifs</h3>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectActivitiesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="activités" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Projets par heures consommées</h3>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectHoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="heures" fill="#06B6D4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Composant pour les statistiques utilisateurs
const UserStats = ({ totalUsers, adminCount, userCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <h4 className="text-sm font-medium text-gray-500">Utilisateurs actifs</h4>
            <p className="text-xl font-semibold text-gray-900">{totalUsers}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-5">
            <h4 className="text-sm font-medium text-gray-500">Administrateurs</h4>
            <p className="text-xl font-semibold text-gray-900">{adminCount}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <h4 className="text-sm font-medium text-gray-500">Utilisateurs standard</h4>
            <p className="text-xl font-semibold text-gray-900">{userCount}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour la liste des utilisateurs récents
const RecentUsersList = ({ users }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Derniers utilisateurs</h3>
    </div>
    <ul className="divide-y divide-gray-200">
      {users.map((user) => (
        <li key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <div className="ml-auto">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                user.role === 'admin' 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
    <div className="bg-gray-50 px-6 py-3">
      <Link href={route('manager.users.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Voir tous les utilisateurs
      </Link>
    </div>
  </div>
);

// Nouveau composant pour les statistiques globales
const GlobalStats = ({ totalProjects, totalReports, projectStatuses }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {/* Total Projets */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="ml-5">
            <h4 className="text-sm font-medium text-gray-500">Total Projets</h4>
            <p className="text-xl font-semibold text-gray-900">{totalProjects}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Total Rapports */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-5">
            <h4 className="text-sm font-medium text-gray-500">Total Rapports</h4>
            <p className="text-xl font-semibold text-gray-900">{totalReports}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Statuts des Projets */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Statuts des Projets</h4>
        <div className="space-y-3">
          {Object.entries(projectStatuses).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{status}</span>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-900">{count}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  status === 'active' ? 'bg-green-100 text-green-800' :
                  status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {Math.round((count / totalProjects) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Composant pour les filtres de projet
const ProjectFilters = ({ filters, handleChange, handleFilterSubmit, projectsList }) => (
  <form onSubmit={handleFilterSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de début
        </label>
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de fin
        </label>
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Projet
        </label>
        <select
          name="project_id"
          value={filters.project_id || ''}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Tous les projets</option>
          {projectsList.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  </form>
);

// Composant pour les statistiques détaillées des projets
const ProjectDetailedStats = ({ projectStats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {Object.values(projectStats).map((stats, idx) => (
      <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-indigo-50 border-b border-gray-200">
          <h3 className="font-medium text-lg text-indigo-900">{stats.project.name}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Heures totales</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_hours}</p>
              <div className="mt-2 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-indigo-200">
                  <div
                    style={{ width: `${Math.min((stats.total_hours / stats.planned_hours) * 100, 100)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {Math.round((stats.total_hours / stats.planned_hours) * 100)}% des heures prévues
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Activités</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_activities}</p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.average_duration}h en moyenne par activité
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Employés impliqués</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.employee_count}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Dernière activité</h4>
              <p className="mt-1 text-sm text-gray-900">
                {stats.last_activity ? new Date(stats.last_activity).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Progression du projet</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    {stats.progress || 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${stats.progress || 0}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Composant pour les statistiques détaillées des CRAS
const CraDetailedStats = ({ craStats }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Statistiques détaillées des CRAS</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-200 rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-indigo-900">Heures totales</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{craStats.total_hours}</p>
              <p className="mt-1 text-sm text-gray-500">
                Moyenne : {craStats.average_hours_per_day}h/jour
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-200 rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-green-900">CRAS soumis</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{craStats.total_cras}</p>
              <p className="mt-1 text-sm text-gray-500">
                {craStats.pending_approval} en attente
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-200 rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-purple-900">Activités</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{craStats.total_activities}</p>
              <p className="mt-1 text-sm text-gray-500">
                {craStats.average_activities_per_cra} en moyenne par CRA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Répartition mensuelle</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={craStats.monthly_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#4F46E5" name="Heures" />
            <Line yAxisId="right" type="monotone" dataKey="cras" stroke="#06B6D4" name="CRAS" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Composant pour les statistiques des approbations
const ApprovalStats = ({ approvalRate, rejectionRate, craStats }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Statistiques d'approbation</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Taux d'approbation</h4>
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-green-200">
              <div 
                style={{ width: `${approvalRate}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">0%</div>
              <div className="text-sm font-semibold text-gray-700">{approvalRate}%</div>
              <div className="text-xs text-gray-500">100%</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Taux de rejet</h4>
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-red-200">
              <div 
                style={{ width: `${rejectionRate}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">0%</div>
              <div className="text-sm font-semibold text-gray-700">{rejectionRate}%</div>
              <div className="text-xs text-gray-500">100%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Statut des CRAS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <span className="text-sm text-green-700">Approuvés</span>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {craStats.approved_count || 0}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <span className="text-sm text-yellow-700">En attente</span>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {craStats.pending_count || 0}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <span className="text-sm text-red-700">Rejetés</span>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {craStats.rejected_count || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour les tendances mensuelles
const MonthlyTrends = ({ monthlyData }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
    <div className="px-6 py-5 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Tendances Mensuelles</h3>
    </div>
    <div className="p-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="hours"
              stroke="#4F46E5"
              name="Heures"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="activities"
              stroke="#06B6D4"
              name="Activités"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Composant principal Dashboard
export default function Dashboard() {
  const {
    totalUsers,
    adminCount,
    userCount,
    latestUsers,
    craStats,
    approvalRate,
    rejectionRate,
    projectStats,
    projectFilters,
    projectsList,
    topProjectsActive,
    topProjectsByHours,
    activitiesByType,
    totalProjects,
    totalReports,
    projectStatuses,
    monthlyData,
  } = usePage().props;

  const [filters, setFilters] = useState(projectFilters);
  const [activeTab, setActiveTab] = useState('overview');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    window.location.href = route('dashboard', filters);
  };

  // Préparation des données pour les graphiques
  const projectActivitiesData = topProjectsActive ? topProjectsActive.map(item => ({
    name: item.project.name.length > 15 ? item.project.name.substring(0, 15) + '...' : item.project.name,
    activités: item.total_activities
  })) : [];

  const projectHoursData = topProjectsByHours ? topProjectsByHours.map(item => ({
    name: item.project.name.length > 15 ? item.project.name.substring(0, 15) + '...' : item.project.name,
    heures: item.total_hours
  })) : [];

  return (
    <ModernLayout>
      <Head title="Tableau de bord" />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête avec onglets */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <div className="flex mt-4 md:mt-0 space-x-2">
              {/* ... Boutons d'onglets ... */}
            </div>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'overview' && (
            <>
              <GlobalStats 
                totalProjects={totalProjects}
                totalReports={totalReports}
                projectStatuses={projectStatuses}
              />
              <CraStatsSection craStats={craStats} />
              <CraDetailedStats craStats={craStats} />
              <ApprovalStats 
                approvalRate={approvalRate}
                rejectionRate={rejectionRate}
                craStats={craStats}
              />
              <ApprovalRates 
                approvalRate={approvalRate}
                rejectionRate={rejectionRate}
              />
              <ActivityDistribution activitiesByType={activitiesByType} />
              <MonthlyTrends monthlyData={monthlyData} />
            </>
          )}

          {activeTab === 'projects' && (
            <>
              <ProjectFilters
                filters={filters}
                handleChange={handleChange}
                handleFilterSubmit={handleFilterSubmit}
                projectsList={projectsList}
              />
              <ProjectStats projectStats={projectStats} />
              <ProjectDetailedStats projectStats={projectStats} />
              <ProjectCharts
                projectActivitiesData={projectActivitiesData}
                projectHoursData={projectHoursData}
              />
            </>
          )}

          {activeTab === 'users' && (
            <>
              <UserStats
                totalUsers={totalUsers}
                adminCount={adminCount}
                userCount={userCount}
              />
              <RecentUsersList users={latestUsers} />
            </>
          )}
        </div>
      </div>
    </ModernLayout>
  );
}

