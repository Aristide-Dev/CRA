import React from 'react';
import { Link } from '@inertiajs/react';

export default function CRAIndex({ activities }) {
    return (
        <div>
            <h1>Mes Activités</h1>
            <Link href="/cra/create">Ajouter une activité</Link>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>
                        {activity.project.name} - {activity.type} ({activity.hours}h) - {activity.date}
                    </li>
                ))}
            </ul>
        </div>
    );
}