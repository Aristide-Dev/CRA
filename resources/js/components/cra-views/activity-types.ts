export const activityTypes = {
    sysadmin: {
        id: 'sysadmin',
        label: 'Système Admin',
        icon: 'server', // Nom d'icône suggéré
        colors: {
            soft: 'bg-red-50 text-red-700',
            solid: 'bg-red-600 text-white',
            outline: 'border-2 border-red-600 text-red-700',
            gradient: 'border-l-4 border-l-red-600 bg-gradient-to-r from-red-50 to-white',
            calendar: 'bg-red-100 hover:bg-red-200 text-red-800 border-l-4 border-l-red-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800',
        },
    },
    development: {
        id: 'development',
        label: 'Développement',
        icon: 'code', // Nom d'icône suggéré
        colors: {
            soft: 'bg-blue-50 text-blue-700',
            solid: 'bg-blue-600 text-white',
            outline: 'border-2 border-blue-600 text-blue-700',
            gradient: 'border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-white',
            calendar: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-l-4 border-l-blue-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800',
        },
    },
    travel: {
        id: 'travel',
        label: 'Déplacement',
        icon: 'map-pin', // Nom d'icône suggéré
        colors: {
            soft: 'bg-amber-50 text-amber-700',
            solid: 'bg-amber-600 text-white',
            outline: 'border-2 border-amber-600 text-amber-700',
            gradient: 'border-l-4 border-l-amber-600 bg-gradient-to-r from-amber-50 to-white',
            calendar: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-l-4 border-l-amber-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800',
        },
    },
    research: {
        id: 'research',
        label: 'Recherches',
        icon: 'search', // Nom d'icône suggéré
        colors: {
            soft: 'bg-violet-50 text-violet-700',
            solid: 'bg-violet-600 text-white',
            outline: 'border-2 border-violet-600 text-violet-700',
            gradient: 'border-l-4 border-l-violet-600 bg-gradient-to-r from-violet-50 to-white',
            calendar: 'bg-violet-100 hover:bg-violet-200 text-violet-800 border-l-4 border-l-violet-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800',
        },
    },
    training: {
        id: 'training',
        label: 'Formation',
        icon: 'book-open', // Nom d'icône suggéré
        colors: {
            soft: 'bg-emerald-50 text-emerald-700',
            solid: 'bg-emerald-600 text-white',
            outline: 'border-2 border-emerald-600 text-emerald-700',
            gradient: 'border-l-4 border-l-emerald-600 bg-gradient-to-r from-emerald-50 to-white',
            calendar: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-l-4 border-l-emerald-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800',
        },
    },
    administrative: {
        id: 'administrative',
        label: 'Tâches administratives',
        icon: 'clipboard', // Nom d'icône suggéré
        colors: {
            soft: 'bg-slate-50 text-slate-700',
            solid: 'bg-slate-600 text-white',
            outline: 'border-2 border-slate-600 text-slate-700',
            gradient: 'border-l-4 border-l-slate-600 bg-gradient-to-r from-slate-50 to-white',
            calendar: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-l-4 border-l-slate-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800',
        },
    },
    client_meeting: {
        id: 'client_meeting',
        label: 'RDV client',
        icon: 'users', // Nom d'icône suggéré
        colors: {
            soft: 'bg-green-50 text-green-700',
            solid: 'bg-green-600 text-white',
            outline: 'border-2 border-green-600 text-green-700',
            gradient: 'border-l-4 border-l-green-600 bg-gradient-to-r from-green-50 to-white',
            calendar: 'bg-green-100 hover:bg-green-200 text-green-800 border-l-4 border-l-green-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800',
        },
    },
    communication: {
        id: 'communication',
        label: 'Communication',
        icon: 'message-circle', // Nom d'icône suggéré
        colors: {
            soft: 'bg-rose-50 text-rose-700',
            solid: 'bg-rose-600 text-white',
            outline: 'border-2 border-rose-600 text-rose-700',
            gradient: 'border-l-4 border-l-rose-600 bg-gradient-to-r from-rose-50 to-white',
            calendar: 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-l-4 border-l-rose-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800',
        },
    },
    software_testing: {
        id: 'software_testing',
        label: 'Test Logiciel',
        icon: 'check-circle', // Nom d'icône suggéré
        colors: {
            soft: 'bg-indigo-50 text-indigo-700',
            solid: 'bg-indigo-600 text-white',
            outline: 'border-2 border-indigo-600 text-indigo-700',
            gradient: 'border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50 to-white',
            calendar: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-l-4 border-l-indigo-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800',
        },
    },
    marketing: {
        id: 'marketing',
        label: 'Commercial - Marketing',
        icon: 'trending-up', // Nom d'icône suggéré
        colors: {
            soft: 'bg-cyan-50 text-cyan-700',
            solid: 'bg-cyan-600 text-white',
            outline: 'border-2 border-cyan-600 text-cyan-700',
            gradient: 'border-l-4 border-l-cyan-600 bg-gradient-to-r from-cyan-50 to-white',
            calendar: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-l-4 border-l-cyan-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800',
        },
    },
    other: {
        id: 'other',
        label: 'Autres',
        icon: 'more-horizontal', // Nom d'icône suggéré
        colors: {
            soft: 'bg-neutral-50 text-neutral-700',
            solid: 'bg-neutral-600 text-white',
            outline: 'border-2 border-neutral-600 text-neutral-700',
            gradient: 'border-l-4 border-l-neutral-600 bg-gradient-to-r from-neutral-50 to-white',
            calendar: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-l-4 border-l-neutral-600 shadow-sm',
            badge: 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800',
        },
    },
} as const;

export type ActivityType = keyof typeof activityTypes;
export type ColorVariant = keyof typeof activityTypes[ActivityType]['colors'];

// Fonction améliorée pour récupérer la couleur
export const getActivityColor = (
    type: ActivityType,
    variant: ColorVariant = 'soft',
    fallbackType: ActivityType = 'other'
) => {
    return activityTypes[type]?.colors[variant] || activityTypes[fallbackType].colors[variant];
};

// Fonction pour récupérer le libellé
export const getActivityLabel = (type: ActivityType) => {
    return activityTypes[type]?.label || type;
};

// Fonction pour récupérer l'icône
export const getActivityIcon = (type: ActivityType) => {
    return activityTypes[type]?.icon || 'help-circle';
};

// Fonction pour récupérer à la fois la couleur et l'icône
export const getActivityStyle = (
    type: ActivityType,
    variant: ColorVariant = 'soft'
) => {
    return {
        color: getActivityColor(type, variant),
        icon: getActivityIcon(type),
        label: getActivityLabel(type)
    };
};