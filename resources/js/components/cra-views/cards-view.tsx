import { type Activitie, type Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityBadge } from './activity-badge';

interface CardsViewProps {
    activities: Activitie[];
    projects: Project[];
    onEdit: (activity: Activitie) => void;
}

export const CardsView = ({ activities, projects, onEdit }: CardsViewProps) => {
    // Fonction pour obtenir les couleurs en fonction du type d'activité
    const getActivityColor = (type: string) => {
        const colors = {
            development: 'border-l-blue-500 bg-gradient-to-br from-white to-blue-50',
            research: 'border-l-purple-500 bg-gradient-to-br from-white to-purple-50',
            training: 'border-l-green-500 bg-gradient-to-br from-white to-green-50',
            meeting: 'border-l-amber-500 bg-gradient-to-br from-white to-amber-50',
            design: 'border-l-pink-500 bg-gradient-to-br from-white to-pink-50',
            planning: 'border-l-cyan-500 bg-gradient-to-br from-white to-cyan-50',
            review: 'border-l-red-500 bg-gradient-to-br from-white to-red-50',
            documentation: 'border-l-indigo-500 bg-gradient-to-br from-white to-indigo-50',
        };
        return colors[type as keyof typeof colors] || 'border-l-gray-500 bg-gradient-to-br from-white to-gray-50';
    };

    // Fonction pour obtenir le nom du projet pour une activité
    const getProjectName = (projectId: string | number | undefined) => {
        if (!projectId) return 'Sans projet';
        const project = projects.find((p) => p.id.toString() === projectId.toString());
        return project?.name || 'Projet inconnu';
    };

    // Fonction pour formater la durée avec unité
    const formatDuration = (duration: number) => {
        return `${duration} ${duration > 1 ? 'heures' : 'heure'}`;
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className={`cursor-pointer rounded-lg border-l-4 bg-white shadow-2xl transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg ${getActivityColor(activity.type)}`}
                    onClick={() => onEdit(activity)}
                >
                    <div className="p-5 border rounded-lg bg-gray-100">
                        <div className="mb-3 flex items-center justify-between">
                            <ActivityBadge type={activity.type} />
                            <span className="rounded-full bg-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800">
                                {formatDuration(activity.duration)}
                            </span>
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-lg font-medium text-gray-900">{getProjectName(activity.projet_id)}</h3>

                        <div className="mb-3 flex items-center text-sm text-gray-500">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {format(new Date(activity.date), 'PPP', { locale: fr })}
                        </div>

                        {activity.remarks && (
                            <div className="mt-3 border-t border-gray-100 pt-3">
                                <p className="line-clamp-3 text-sm text-gray-600 italic">"{activity.remarks}"</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
