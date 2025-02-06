import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
    Clock, 
    FileText, 
    Folder, 
    Calendar,
    TrendingUp,
    BarChart2,
    PieChart,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function CraDetails({ cra, stats }) {
    const [expandedProjects, setExpandedProjects] = useState({});
    const [activeInfoCard, setActiveInfoCard] = useState(null);

    // Improved date formatting with more context
    const monthDate = new Date(cra.month_year);
    const monthName = monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const currentDate = new Date();
    const isCurrentMonth = monthDate.getMonth() === currentDate.getMonth() && 
                           monthDate.getFullYear() === currentDate.getFullYear();

    // Enhanced StatCard with more interactive elements
    const StatCard = ({ 
        title, 
        value, 
        subValue, 
        icon: Icon, 
        className = '', 
        infoText 
    }) => {
        const [showInfo, setShowInfo] = useState(false);

        return (
            <div 
                className={`bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 
                    relative group hover:shadow-xl hover:scale-105 ${className}`}
            >
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <div className="flex items-center space-x-2">
                        {infoText && (
                            <button 
                                onClick={() => setShowInfo(!showInfo)}
                                className="text-gray-500 hover:text-indigo-600 transition-colors"
                            >
                                <Info className="w-5 h-5" />
                            </button>
                        )}
                        <Icon className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-indigo-600 mb-2">{value}</p>
                <p className="text-sm text-gray-500">{subValue}</p>

                {showInfo && infoText && (
                    <div className="absolute z-10 left-0 right-0 mt-2 p-4 bg-indigo-50 rounded-b-2xl shadow-lg">
                        <p className="text-sm text-gray-700">{infoText}</p>
                    </div>
                )}
            </div>
        );
    };

    // Toggle project details expansion
    const toggleProjectExpansion = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    // Color palette for consistent design
    const colorPalette = [
        '#4F46E5', // Indigo
        '#7C3AED', // Purple
        '#EC4899', // Pink
        '#EF4444', // Red
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#6366F1'  // Indigo
    ];

    return (
        <ModernLayout>
            <Head title={`Détails CRA - ${cra.user.name} - ${monthName}`} />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header with More Context */}
                <div className="mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-4xl font-extrabold mb-2">
                                {cra.user.name} - Compte Rendu d'Activités
                            </h1>
                            <p className="text-xl text-indigo-100">
                                {monthName} 
                                {isCurrentMonth && <span className="ml-2 bg-purple-500 px-2 py-1 rounded-full text-xs">Mois en cours</span>}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider ${
                                cra.status === 'approved' ? 'bg-green-500 text-white' :
                                cra.status === 'rejected' ? 'bg-red-500 text-white' :
                                'bg-yellow-500 text-white'
                            }`}>
                                {cra.status === 'approved' ? 'Approuvé' :
                                 cra.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Key Statistics with Enhanced Interactivity */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Heures Totales" 
                        value={`${stats.total_hours}h`} 
                        subValue={`${stats.average_hours_per_day.toFixed(1)}h / jour`}
                        icon={Clock}
                        infoText="Nombre total d'heures travaillées ce mois-ci, avec une moyenne journalière."
                    />
                    <StatCard 
                        title="Activités" 
                        value={stats.total_activities} 
                        subValue={`${stats.average_duration_per_activity.toFixed(1)}h en moyenne`}
                        icon={FileText}
                        infoText="Nombre total d'activités réalisées, avec la durée moyenne par activité."
                    />
                    <StatCard 
                        title="Projets" 
                        value={stats.total_projects} 
                        subValue={`${stats.projects_stats.average_hours_per_project.toFixed(1)}h par projet`}
                        icon={Folder}
                        infoText="Nombre de projets différents, avec le temps moyen consacré à chaque projet."
                    />
                    <StatCard 
                        title="Projet Principal" 
                        value={stats.projects_stats.most_time_consuming.project.name} 
                        subValue={`${stats.projects_stats.most_time_consuming.total_hours}h`}
                        icon={TrendingUp}
                        infoText="Le projet ayant consommé le plus de temps ce mois-ci."
                    />
                </div>

                {/* Visualizations Grid with Improved Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                    {/* Project Distribution Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <BarChart2 className="mr-3 text-indigo-600" />
                            Distribution par Projet
                        </h3>
                        <Pie
                            data={{
                                labels: Object.values(stats.activities_by_project).map(p => p.project.name),
                                datasets: [{
                                    data: Object.values(stats.time_distribution.by_project),
                                    backgroundColor: colorPalette.slice(0, Object.keys(stats.activities_by_project).length)
                                }]
                            }}
                            options={{
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`
                                        }
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Activity Type Distribution */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <PieChart className="mr-3 text-indigo-600" />
                            Distribution par Type d'Activité
                        </h3>
                        <Pie
                            data={{
                                labels: Object.keys(stats.activities_by_type),
                                datasets: [{
                                    data: Object.values(stats.time_distribution.by_type),
                                    backgroundColor: colorPalette.slice(0, Object.keys(stats.activities_by_type).length)
                                }]
                            }}
                            options={{
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`
                                        }
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Daily Hours Trend */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow lg:col-span-2">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <Calendar className="mr-3 text-indigo-600" />
                            Évolution Quotidienne des Heures Travaillées
                        </h3>
                        <Line
                            data={{
                                labels: Object.keys(stats.daily_stats).map(date => 
                                    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                                ),
                                datasets: [{
                                    label: 'Heures travaillées',
                                    data: Object.values(stats.daily_stats).map(day => day.total_hours),
                                    borderColor: '#4F46E5',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    tension: 0.4,
                                    borderWidth: 3
                                }]
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Heures'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Enhanced Project Details Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-indigo-50 px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">Détail Détaillé par Projet</h3>
                        <p className="text-sm text-gray-600">
                            Total: {stats.total_projects} projets
                        </p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {Object.values(stats.activities_by_project).map(({ project, total_hours, activities_count, activities, types }) => (
                            <div 
                                key={project.id} 
                                className="px-6 py-5 hover:bg-gray-50 transition-colors group"
                            >
                                <div 
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleProjectExpansion(project.id)}
                                >
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                                            <span className="text-sm text-gray-500">
                                                {activities_count} activité(s)
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {Object.entries(types).map(([type, count]) => (
                                                <span 
                                                    key={type} 
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    {type}: {count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-medium text-indigo-600">{total_hours}h</span>
                                        {expandedProjects[project.id] ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </div>

                                {expandedProjects[project.id] && (
                                    <div className="mt-4 space-y-4">
                                        {activities.map((activity, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Date</span>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {new Date(activity.date).toLocaleDateString('fr-FR', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Type</span>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {activity.type}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Durée</span>
                                                            <p className="text-sm font-medium text-indigo-600">
                                                                {activity.duration}h
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-medium text-gray-500">Remarques</span>
                                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                            {activity.remarks || 'Aucune remarque'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {activity.created_at !== activity.updated_at && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500">
                                                            Dernière modification le {new Date(activity.updated_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ModernLayout>
    );
}