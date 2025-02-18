import React from 'react';
import ModernLayout from '@/Layouts/ModernLayout';
import CRAForm from '@/Components/CRA/CRAForm';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { CalendarDaysIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Create({ projects }) {
    const { auth } = usePage().props;
    const authUser = auth.user;
    const url = authUser.role === 'manager' ? 'manager.cra.store' : 'cra.store';
    console.log('url',url,url);
    return (
        <ModernLayout>
            <Head title="Nouveau CRA" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête de page */}
                    <div className="md:flex md:items-center md:justify-between mb-8">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <CalendarDaysIcon className="h-10 w-10 text-indigo-600 mr-4" />
                                <div>
                                    <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                        Nouveau Compte Rendu d'Activité
                                    </h2>
                                    <p className="mt-2 text-lg text-gray-600">
                                        Créez votre rapport mensuel d'activités
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="bg-white shadow-xl sm:rounded-lg">
                        <div className="p-8">
                            {/* Section d'information */}
                            <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <div className="p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <InformationCircleIcon className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-base font-medium text-indigo-800">
                                                Instructions importantes
                                            </h3>
                                            <div className="mt-2 text-sm text-indigo-700">
                                                <p>
                                                    Pour créer votre CRA, sélectionnez le mois concerné. 
                                                    Notez qu'un seul CRA peut être créé par mois.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire */}
                            <div className="max-w-2xl mx-auto">
                                <CRAForm url={url} />
                            </div>
                        </div>
                    </div>

                    {/* Section d'aide */}
                    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                        <div className="px-6 py-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Besoin d'aide ?
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>
                                            Si vous rencontrez des difficultés pour créer votre CRA, 
                                            n'hésitez pas à contacter votre responsable ou le support technique.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModernLayout>
    );
}