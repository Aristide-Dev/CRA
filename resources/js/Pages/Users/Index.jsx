import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { UserPlus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import ModernLayout from '@/Layouts/ModernLayout';

export default function UsersIndex({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');

    const deleteForm = useForm({});

    // Filter and search logic
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRole === '' || user.role === filterRole)
    );

    const handleDelete = (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            deleteForm.delete(route('users.destroy', userId), {
                preserveScroll: true,
            });
        }
    };

    // Extract unique roles for filtering
    const uniqueRoles = [...new Set(users.map(user => user.role))];

    return (
        <ModernLayout>
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-indigo-800">Gestion des Utilisateurs</h1>
                        <Link
                            href={route('users.create')}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>Ajouter un utilisateur</span>
                        </Link>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-6 flex space-x-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                <option value="">Tous les rôles</option>
                                {uniqueRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end space-x-2">
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="text-yellow-600 hover:text-yellow-900 transition duration-300 flex items-center"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900 transition duration-300 flex items-center"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No users found message */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Aucun utilisateur trouvé
                        </div>
                    )}
                </div>
            </div>
        </ModernLayout>
    );
}