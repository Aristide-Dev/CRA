import { type Activitie, type Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityBadge } from './activity-badge';

interface KanbanViewProps {
    activities: Activitie[];
    projects: Project[];
    onEdit: (activity: Activitie) => void;
}

export const KanbanView = ({ activities, projects, onEdit }: KanbanViewProps) => {
    const columns = {
        'À faire': activities.filter((a) => !a.status),
        'En cours': activities.filter((a) => a.status === 'in_progress'),
        Terminé: activities.filter((a) => a.status === 'completed'),
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Object.entries(columns).map(([title, items]) => (
                <div key={title} className="space-y-4">
                    <h3 className="mb-4 font-medium text-gray-900">{title}</h3>
                    <div className="space-y-3">
                        {items.map((activity) => (
                            <div
                                key={activity.id}
                                className="cursor-pointer rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
                                onClick={() => onEdit(activity)}
                            >
                                <div className="mb-2">
                                    <ActivityBadge type={activity.type} />
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    {projects.find((p) => p.id.toString() === activity.projet_id?.toString())?.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">{format(new Date(activity.date), 'PPP', { locale: fr })}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
