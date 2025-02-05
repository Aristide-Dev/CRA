import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

export default function CalendarView({ activities, projects }) {
  // Vous pouvez, par exemple, grouper les activités par date
  const activitiesByDate = activities.reduce((acc, activity) => {
    const dateStr = activity.date ? format(new Date(activity.date), 'yyyy-MM-dd') : 'sans date';
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(activity);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (activitiesByDate[dateStr]) {
        return (
          <ul className="text-xs">
            {activitiesByDate[dateStr].map((act, index) => (
              <li key={index}>
                {projects.find(p => p.id.toString() === act.project_id.toString())?.name || 'Projet inconnu'}
              </li>
            ))}
          </ul>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        tileContent={tileContent}
      />
    </div>
  );
}
