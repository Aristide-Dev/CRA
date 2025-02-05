import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CRAForm from '@/Components/CRA/CRAForm';

export default function Create({ projects }) {
    return (
        <AuthenticatedLayout>
            <h1 className="text-2xl font-bold mb-6">Nouveau Compte Rendu d'Activité</h1>
            <CRAForm projects={projects} />
        </AuthenticatedLayout>
    );
}