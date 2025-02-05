import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ActivityList({ activities, projects, onDelete }) {
    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <DatePicker
                                selected={new Date(activity.date)}
                                onChange={() => {}}
                                dateFormat="dd/MM/yyyy"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Projet
                            </label>
                            <select
                                value={activity.project_id}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                readOnly
                            >
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Type d'activité
                            </label>
                            <select
                                value={activity.type}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                readOnly
                            >
                                <option value="development">Développement</option>
                                <option value="research">Recherche</option>
                                <option value="training">Formation</option>
                                <option value="meeting">Réunion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Durée (heures)
                            </label>
                            <input
                                type="number"
                                value={activity.duration}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                readOnly
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Remarques
                        </label>
                        <textarea
                            value={activity.remarks}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={2}
                            readOnly
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => onDelete(activity.id)}
                        className="text-red-500 text-sm hover:text-red-600"
                    >
                        Supprimer cette activité
                    </button>
                </div>
            ))}
        </div>
    );
}