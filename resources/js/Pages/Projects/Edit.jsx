import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ProjectsEdit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
    });

    const handleSubmit = e => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="Nom du projet"
            />
            {errors.name && <p>{errors.name}</p>}
            <button type="submit" disabled={processing}>Mettre à jour</button>
        </form>
    );
}