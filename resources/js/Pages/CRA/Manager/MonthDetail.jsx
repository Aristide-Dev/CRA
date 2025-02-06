import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Calendar,
    Plus,
    FileText,
    CheckCircle2,
    XCircle,
    Copy,
} from "lucide-react";
import ModernLayout from "@/Layouts/ModernLayout";

export default function MonthDetail({ cras, year, month }) {
    const [filterStatus, setFilterStatus] = useState("all");

    const monthDate = new Date(year, month - 1);
    const monthName = monthDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const filteredCras =
        filterStatus === "all"
            ? cras
            : cras.filter((cra) => cra.status === filterStatus);

    const statusCount = {
        all: cras.length,
        draft: cras.filter((cra) => cra.status === "draft").length,
        approved: cras.filter((cra) => cra.status === "approved").length,
        rejected: cras.filter((cra) => cra.status === "rejected").length,
        submitted: cras.filter((cra) => cra.status === "submitted").length,
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "draft":
                return {
                    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                    icon: <Copy className="w-5 h-5 text-yellow-600" />,
                    label: "Brouillon",
                };
            case "approved":
                return {
                    color: "bg-green-100 text-green-800 border-green-200",
                    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
                    label: "Approuvé",
                };
            case "rejected":
                return {
                    color: "bg-red-100 text-red-800 border-red-200",
                    icon: <XCircle className="w-5 h-5 text-red-600" />,
                    label: "Rejeté",
                };
            case "submitted":
                return {
                    color: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: <FileText className="w-5 h-5 text-blue-600" />,
                    label: "Soumis",
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: <FileText className="w-5 h-5 text-gray-600" />,
                    label: status,
                };
        }
    };

    const calculateCraStats = (cra) => {
        const uniqueProjects = new Set(
            cra.activities.map((activity) => activity.project.id)
        );

        return {
            totalHours: cra.activities.reduce(
                (sum, activity) => sum + parseFloat(activity.duration),
                0
            ),
            totalActivities: cra.activities.length,
            totalProjects: uniqueProjects.size,
        };
    };

    return (
        <ModernLayout>
            <Head title={`CRAs - ${monthName}`} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header with Icon */}
                <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                        <Calendar className="w-10 h-10 text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                CRAs de {monthName}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 flex items-center">
                                {cras.length} CRA(s) au total
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("cra.create", {
                            month_year: `${year}-${month
                                .toString()
                                .padStart(2, "0")}`,
                        })}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nouveau CRA</span>
                    </Link>
                </div>

                {/* Improved Filters with Better Visual Distinction */}
                <div className="mb-6 flex space-x-4 bg-white shadow-sm rounded-lg p-4">
                    {Object.entries({
                        all: "Tous",
                        submitted: "Soumis",
                        draft: "Brouillons",
                        approved: "Approuvés",
                        rejected: "Rejetés",
                    }).map(([key, label]) => {
                        const isActive = filterStatus === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(key)}
                                className={`
                                    flex items-center space-x-2 px-4 py-2 rounded-lg 
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                    }
                                `}
                            >
                                {getStatusConfig(key).icon}
                                <span>
                                    {label} ({statusCount[key]})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Enhanced Table with More Refined Design */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {[
                                    "Utilisateur",
                                    "Statut",
                                    "Activités",
                                    "Projets",
                                    "Heures Totales",
                                    "Dernière Modification",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCras.map((cra) => {
                                const stats = calculateCraStats(cra);
                                const statusConfig = getStatusConfig(
                                    cra.status
                                );
                                return (
                                    <a
                                        href={route(
                                            "manager.cra.details",
                                            cra.id
                                        )}
                                        className="cursor-pointer"
                                    >
                                        <tr
                                            key={cra.id}
                                            className="hover:bg-gray-200 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {cra.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {cra.user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`
                                                    inline-flex items-center space-x-2 
                                                    px-3 py-1 rounded-full text-xs font-medium 
                                                    border ${statusConfig.color}
                                                `}
                                                >
                                                    {statusConfig.icon}
                                                    <span>
                                                        {statusConfig.label}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {stats.totalActivities}{" "}
                                                    activité
                                                    {stats.totalActivities > 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(
                                                        stats.totalHours /
                                                        stats.totalActivities
                                                    ).toFixed(1)}
                                                    h en moyenne
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {stats.totalProjects} projet
                                                    {stats.totalProjects > 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(
                                                        stats.totalHours /
                                                        stats.totalProjects
                                                    ).toFixed(1)}
                                                    h par projet
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {stats.totalHours}h
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(
                                                        (stats.totalHours / 7) *
                                                        5
                                                    ).toFixed(1)}
                                                    h / semaine
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    cra.updated_at
                                                ).toLocaleDateString("fr-FR")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={route(
                                                            "manager.cra.details",
                                                            cra.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                    >
                                                        Détails
                                                    </Link>

                                                    {cra.status !==
                                                        "approved" && (
                                                        <>
                                                            <Link
                                                                href={route(
                                                                    "cra.edit",
                                                                    cra.id
                                                                )}
                                                                className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                                            >
                                                                Éditer
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </a>
                                );
                            })}

                            {/* Footer with Totals */}
                            <tr className="bg-gray-50 font-medium border-t border-gray-200">
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
                                    colSpan="2"
                                >
                                    Total
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {filteredCras.reduce(
                                        (sum, cra) =>
                                            sum + cra.activities.length,
                                        0
                                    )}{" "}
                                    activités
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {
                                        new Set(
                                            filteredCras.flatMap((cra) =>
                                                cra.activities.map(
                                                    (activity) =>
                                                        activity.project.id
                                                )
                                            )
                                        ).size
                                    }{" "}
                                    projets
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {filteredCras.reduce(
                                        (sum, cra) =>
                                            sum +
                                            calculateCraStats(cra).totalHours,
                                        0
                                    )}
                                    h
                                </td>
                                <td colSpan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </ModernLayout>
    );
}
