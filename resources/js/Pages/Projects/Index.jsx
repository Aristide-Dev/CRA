import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProjectsIndex({ projects }) {
    return (
        <div>
            <h1>Liste des Projets</h1>
            <Link href="/projects/create">Ajouter un projet</Link>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.name}
                        <Link href={`/projects/${project.id}/edit`}>Modifier</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}