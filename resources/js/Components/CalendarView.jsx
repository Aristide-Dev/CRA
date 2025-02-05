import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarView({ activities }) {
    const events = activities.map(activity => ({
        title: `${activity.project.name} (${activity.duration}h)`,
        start: activity.date,
        color: activity.type === 'development' ? '#3B82F6' : 
               activity.type === 'meeting' ? '#10B981' : '#F59E0B'
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Calendrier" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-6 shadow rounded-lg">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locale="fr"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}