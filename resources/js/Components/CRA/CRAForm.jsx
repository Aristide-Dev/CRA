import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CRAForm({ cra = null, projects }) {
    const [activities, setActivities] = useState(cra?.activities || [{
        date: new Date(),
        project_id: projects[0]?.id || '',
        type: 'development',
        duration: 1,
        remarks: ''
    }]);

    const { data, setData, post, put, processing, errors } = useForm({
        month_year: cra?.month_year || new Date().toISOString().slice(0, 7),
        status: cra?.status || 'draft',
        activities: activities
    });

    const addActivity = () => {
        setActivities([...activities, {
            date: new Date(),
            project_id: projects[0]?.id || '',
            type: 'development',
            duration: 1,
            remarks: ''
        }]);
    };

    const updateActivity = (index, field, value) => {
        const updatedActivities = [...activities];
        updatedActivities[index][field] = value;
        setActivities(updatedActivities);
        setData('activities', updatedActivities);
    };

    const removeActivity = (index) => {
        const updatedActivities = activities.filter((_, i) => i !== index);
        setActivities(updatedActivities);
        setData('activities', updatedActivities);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = cra ? put : post;
        method(cra ? route('cra.update', cra.id) : route('cra.store'), {
            onSuccess: () => {
                // Redirection ou feedback
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mois/Année du rapport
                    </label>
                    <input
                        type="month"
                        value={data.month_year}
                        onChange={e => setData('month_year', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.month_year && <p className="text-red-500 text-sm mt-1">{errors.month_year}</p>}
                </div>

                {activities.map((activity, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <DatePicker
                                    selected={activity.date}
                                    onChange={date => updateActivity(index, 'date', date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors[`activities.${index}.date`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`activities.${index}.date`]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Projet
                                </label>
                                <select
                                    value={activity.project_id}
                                    onChange={e => updateActivity(index, 'project_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                    onChange={e => updateActivity(index, 'type', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                    step="0.5"
                                    min="0.5"
                                    max="24"
                                    value={activity.duration}
                                    onChange={e => updateActivity(index, 'duration', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors[`activities.${index}.duration`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`activities.${index}.duration`]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Remarques
                            </label>
                            <textarea
                                value={activity.remarks}
                                onChange={e => updateActivity(index, 'remarks', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={2}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => removeActivity(index)}
                            className="text-red-500 text-sm hover:text-red-600"
                        >
                            Supprimer cette activité
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addActivity}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Ajouter une activité
                </button>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="submit"
                    name="status"
                    value="draft"
                    disabled={processing}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    {processing ? 'Enregistrement...' : 'Enregistrer brouillon'}
                </button>
                
                <button
                    type="submit"
                    name="status"
                    value="submitted"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {processing ? 'Soumission...' : 'Soumettre pour validation'}
                </button>
            </div>
        </form>
    );
}