import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CRACreate({ projects }) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        type: '',
        date: '',
        hours: '',
        description: '',
    });

    const handleSubmit = e => {
        e.preventDefault();
        post('/cra');
    };

    return (
        <form onSubmit={handleSubmit}>
            <select value={data.project_id} onChange={e => setData('project_id', e.target.value)}>
                <option value="">Sélectionnez un projet</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                ))}
            </select>

            <input type="text" value={data.type} onChange={e => setData('type', e.target.value)} placeholder="Type d'activité" />
            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
            <input type="number" value={data.hours} onChange={e => setData('hours', e.target.value)} placeholder="Heures" />
            <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description"></textarea>

            <button type="submit" disabled={processing}>Soumettre</button>
        </form>
    );
}