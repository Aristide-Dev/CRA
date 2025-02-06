import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Show({ report, isManager, managerFeedback }) {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    
    const { data, setData, post, processing } = useForm({
        status: '',
        feedback: ''
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        post(route('reports.feedback', report.id), {
            onSuccess: () => setShowFeedbackForm(false)
        });
    };

    return (
        <ModernLayout>
            <Head title={`Rapport - ${report.title}`} />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                {/* En-tête du rapport */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {report.title}
                            </h1>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(report.status)}
                                <span className="text-sm font-medium capitalize">
                                    {report.status}
                                </span>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Par {report.user.name} - {new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Contenu du rapport */}
                    <div className="px-6 py-4">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.content }} />
                    </div>

                    {/* Section des managers */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Feedback des managers</h2>
                        <div className="space-y-4">
                            {report.managers.map(manager => (
                                <div key={manager.id} className="flex items-start space-x-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{manager.name}</span>
                                            {getStatusIcon(manager.pivot.status)}
                                        </div>
                                        {manager.pivot.feedback && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                {manager.pivot.feedback}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulaire de feedback pour les managers */}
                        {isManager && !managerFeedback?.status && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Donner mon feedback
                                </button>

                                {showFeedbackForm && (
                                    <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Statut
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Sélectionner...</option>
                                                <option value="approved">Approuver</option>
                                                <option value="rejected">Rejeter</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Feedback
                                            </label>
                                            <textarea
                                                value={data.feedback}
                                                onChange={e => setData('feedback', e.target.value)}
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Envoyer le feedback
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModernLayout>
    );
} 