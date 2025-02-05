import React from 'react';
import { format } from 'date-fns';

export default function CardView({ activities, projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((act, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <div className="mb-2 font-bold">
            {act.date ? format(new Date(act.date), 'dd/MM/yyyy') : 'Sans date'}
          </div>
          <div>
            <strong>Projet : </strong>
            {projects.find(p => p.id.toString() === act.project_id.toString())?.name || 'Inconnu'}
          </div>
          <div>
            <strong>Type : </strong>
            {act.type}
          </div>
          <div>
            <strong>Durée : </strong>
            {act.duration} heures
          </div>
          <div>
            <strong>Remarques : </strong>
            {act.remarks}
          </div>
        </div>
      ))}
    </div>
  );
}
