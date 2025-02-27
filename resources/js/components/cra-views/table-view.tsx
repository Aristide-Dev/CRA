import { type Activitie, type Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityBadge } from './activity-badge';

interface TableViewProps {
    activities: Activitie[];
    projects: Project[];
    onEdit: (activity: Activitie) => void;
}

export const TableView = ({ activities, projects, onEdit }: TableViewProps) => (
    <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Projet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Durée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Remarques</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {activities.map((activity) => (
                    <tr key={activity.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onEdit(activity)}>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{format(new Date(activity.date), 'P', { locale: fr })}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            {projects.find((p) => p.id.toString() === activity.projet_id?.toString())?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <ActivityBadge type={activity.type} />
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{activity.duration}h</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{activity.remarks || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
