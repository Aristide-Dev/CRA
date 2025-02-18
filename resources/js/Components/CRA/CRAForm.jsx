import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Popover } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function CRAForm({ cra = null, url=null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        month_year: cra?.month_year || new Date().toISOString().slice(0, 7),
    });

    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date(data.month_year + '-01'));

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = cra ? put : post;
        method(cra ? route(url, cra.id) : route(url));
    };

    const handlePreviousYear = () => {
        setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)));
    };

    const handleNextYear = () => {
        setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)));
    };

    const handleMonthSelect = (monthIndex) => {
        const newDate = new Date(currentDate.setMonth(monthIndex));
        const formattedDate = newDate.toISOString().slice(0, 7);
        setData('month_year', formattedDate);
        setIsOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-6 space-y-6">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois/Année du rapport
                </label>
                <Popover className="relative">
                    <Popover.Button
                        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span>
                            {months[new Date(data.month_year + '-01').getMonth()]} {' '}
                            {new Date(data.month_year + '-01').getFullYear()}
                        </span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={handlePreviousYear}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                                </button>
                                <span className="text-lg font-medium">
                                    {currentDate.getFullYear()}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleNextYear}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((month, index) => {
                                    const isCurrentMonth = 
                                        index === new Date(data.month_year + '-01').getMonth() &&
                                        currentDate.getFullYear() === new Date(data.month_year + '-01').getFullYear();
                                    
                                    return (
                                        <button
                                            key={month}
                                            type="button"
                                            onClick={() => handleMonthSelect(index)}
                                            className={`
                                                p-2 text-sm rounded-md
                                                ${isCurrentMonth 
                                                    ? 'bg-blue-100 text-blue-700 font-medium' 
                                                    : 'hover:bg-gray-100 text-gray-700'}
                                            `}
                                        >
                                            {month}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Popover.Panel>
                </Popover>
                {errors.month_year && (
                    <p className="text-red-500 text-sm mt-1">{errors.month_year}</p>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}