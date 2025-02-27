import { type Activitie, type Project } from '@/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { ActivityBadge } from './activity-badge';

interface CalendarViewProps {
    activities: Activitie[];
    projects: Project[];
    monthYear: string;
    onEdit: (activity: Activitie) => void;
}

export const CalendarView = ({ activities, projects, monthYear, onEdit }: CalendarViewProps) => {
    const parsedMonthYear = typeof monthYear === 'string' ? monthYear : format(new Date(), 'yyyy-MM-dd');
    const startDate = startOfMonth(parseISO(parsedMonthYear));
    const calendarStart = startOfWeek(startDate, { weekStartsOn: 1 });
    const endDate = endOfMonth(parseISO(parsedMonthYear));
    const calendarEnd = endOfWeek(endDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const safeParseISO = (dateString: string | Date) => {
        if (!dateString) return null;
        if (dateString instanceof Date) return dateString;
        try {
            return parseISO(dateString);
        } catch (error) {
            console.error('Erreur lors du parsing de la date :', dateString, error);
            return null;
        }
    };

    const getActivityColor = (type: string) => {
        const colors = {
            // Couleurs plus vives et distinctives pour chaque type d'activité
            development: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 border-l-4 border-l-blue-500',
            research: 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 border-l-4 border-l-purple-500',
            training: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300 border-l-4 border-l-green-500',
            meeting: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 border-l-4 border-l-amber-500',
            // Types supplémentaires avec des couleurs distinctives
            design: 'bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-300 border-l-4 border-l-pink-500',
            planning: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-300 border-l-4 border-l-cyan-500',
            review: 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300 border-l-4 border-l-red-500',
            documentation: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-300 border-l-4 border-l-indigo-500',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 border-l-4 border-l-gray-500';
    };

    // Obtenir le nom du projet pour une activité
    const getProjectName = (projectId: string | number | undefined) => {
        if (!projectId) return 'Sans projet';
        const project = projects.find((p) => p.id.toString() === projectId.toString());
        return project?.name || 'Projet inconnu';
    };

    return (
        <div className="ring-opacity-5 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black">
            {/* En-tête des jours de la semaine */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-sm font-semibold">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <div key={day} className="px-3 py-3 text-center text-gray-800">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 divide-x divide-gray-200 bg-white text-sm">
                {days.map((day) => {
                    const dayActivities = activities.filter((activity) => {
                        const parsedDate = safeParseISO(activity.date);
                        return parsedDate && isSameDay(parsedDate, day);
                    });
                    const isCurrentMonth = isSameMonth(day, parseISO(parsedMonthYear));
                    const isToday = isSameDay(day, new Date());
                    const hasActivities = dayActivities.length > 0;
                    const maxActivitiesToShow = 3;
                    const hasMoreActivities = dayActivities.length > maxActivitiesToShow;

                    return (
                        <div
                            key={day.toISOString()}
                            className={`min-h-[8rem] border-b border-gray-200 p-2 transition-colors ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'} ${isToday ? 'ring-primary ring-opacity-20 ring-2 ring-inset' : ''}`}
                        >
                            {/* Numéro du jour */}
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                        isToday ? 'bg-primary font-semibold text-white shadow-sm' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                >
                                    {format(day, 'd')}
                                </div>

                                {/* Indicateur de disponibilité optionnel */}
                                {hasActivities && isCurrentMonth && <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>}
                            </div>

                            {/* Liste des activités */}
                            <div className="mt-2 space-y-1.5">
                                {dayActivities.slice(0, maxActivitiesToShow).map((activity) => (
                                    <div
                                        key={activity.id}
                                        onClick={() => onEdit(activity)}
                                        className={`cursor-pointer rounded-md p-1.5 text-xs shadow-sm transition-all duration-150 hover:shadow ${getActivityColor(activity.type)} hover:translate-y-[-1px]`}
                                    >
                                        <div className="truncate font-medium">{getProjectName(activity.projet_id)}</div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <ActivityBadge type={activity.type} />
                                            <span className="font-medium">{activity.duration}h</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Indicateur "plus d'activités" */}
                                {hasMoreActivities && (
                                    <div className="mt-1 rounded-md bg-gray-50 py-1 text-center text-xs font-medium text-gray-500">
                                        +{dayActivities.length - maxActivitiesToShow} autres
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
