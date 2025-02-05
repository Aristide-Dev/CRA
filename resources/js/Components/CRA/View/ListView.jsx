import React from 'react';
import { format } from 'date-fns';

export default function ListView({ activities, projects }) {
  return (
    <div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Projet</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Durée (heures)</th>
            <th className="border p-2">Remarques</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act, index) => (
            <tr key={index}>
              <td className="border p-2">{act.date ? format(new Date(act.date), 'dd/MM/yyyy') : '-'}</td>
              <td className="border p-2">
                {projects.find(p => p.id.toString() === act.project_id.toString())?.name || '-'}
              </td>
              <td className="border p-2">{act.type}</td>
              <td className="border p-2">{act.duration}</td>
              <td className="border p-2">{act.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
