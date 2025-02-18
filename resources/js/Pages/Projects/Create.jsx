import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';

export default function ProjectsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = e => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <ModernLayout>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Nom du projet"
            />
            {errors.name && <p>{errors.name}</p>}
                <button type="submit" disabled={processing}>Créer</button>
            </form>
        </ModernLayout>
    );
}