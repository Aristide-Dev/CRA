import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import { Editor } from '@tinymce/tinymce-react';

export default function Create({ managers, tiny_api_key }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        manager_ids: []
    });

    const handleEditorChange = (content) => {
        setData('content', content);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    return (
        <ModernLayout>
            <Head title="Nouveau Rapport" />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Titre du rapport
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contenu
                        </label>
                        <Editor
                            apiKey={tiny_api_key}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                            }}
                            onEditorChange={handleEditorChange}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Managers à notifier
                        </label>
                        <div className="mt-2 space-y-2">
                            {managers.map(manager => (
                                <label key={manager.id} className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        value={manager.id}
                                        onChange={(e) => {
                                            const newIds = e.target.checked
                                                ? [...data.manager_ids, manager.id]
                                                : data.manager_ids.filter(id => id !== manager.id);
                                            setData('manager_ids', newIds);
                                        }}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">{manager.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.manager_ids && (
                            <p className="mt-1 text-sm text-red-600">{errors.manager_ids}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {processing ? 'Envoi...' : 'Soumettre le rapport'}
                        </button>
                    </div>
                </form>
            </div>
        </ModernLayout>
    );
} 