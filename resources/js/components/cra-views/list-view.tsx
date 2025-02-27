import { type Activitie, type Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityBadge } from './activity-badge';

interface ListViewProps {
    activities: Activitie[];
    projects: Project[];
    onEdit: (activity: Activitie) => void;
}

export const ListView = ({ activities, projects, onEdit }: ListViewProps) => (
    <div className="space-y-4">
        {activities.map((activity) => (
            <div
                key={activity.id}
                className="cursor-pointer rounded-lg bg-white shadow transition-all duration-200 hover:shadow-md"
                onClick={() => onEdit(activity)}
            >
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            {projects.find((p) => p.id.toString() === activity.projet_id?.toString())?.name}
                        </p>
                        <p className="text-sm text-gray-500">{format(new Date(activity.date), 'PPP', { locale: fr })}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ActivityBadge type={activity.type} />
                        <span className="text-sm font-medium text-gray-900">{activity.duration}h</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
