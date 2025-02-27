import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    routeName: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    subItems?: Array<{
        title: string;
        url: string;
        routeName: string;
    }>;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    role: string;
    phone: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...

    cras: Cra[];
    reports: Report[];
    managedReports: Report[];
}

export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;

    activities: Activitie[];
}

export type CraStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Cra {
    id: number;
    user_id: number;
    month_year: string;
    status: CraStatus;
    updated_at: string;

    user: User;
    activities: Activitie[];
}

export interface Activitie {
    id: number;
    cra_id: number;
    projet_id: number;
    date: string;
    type: string;
    duration: number;
    remarks: string;

    cra: Cra
    project: Project
}

export interface Report {
    id: number;
    user_id: number;
    title: string;
    content: string;
    status: string;

    managers: User;

}
