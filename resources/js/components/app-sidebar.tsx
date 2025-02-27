import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, FolderKanban, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdminOrManager = ['admin', 'manager'].includes(auth.user.role);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: route('dashboard'),
            icon: LayoutGrid,
            routeName: 'dashboard',
        },
        // Projets uniquement pour admin et manager
        ...(isAdminOrManager
            ? [
                  {
                      title: 'Projets',
                      url: route('projects.index'),
                      icon: FolderKanban,
                      routeName: 'projects.index',
                  },
              ]
            : []),
        // Menu CRA conditionnel
        ...(isAdminOrManager
            ? [
                  {
                      title: 'CRAs',
                      url: '#',
                      icon: Calendar,
                      routeName: 'cra',
                      subItems: [
                          {
                              title: 'Tous les CRAs',
                              url: route('cra.index'),
                              routeName: 'cra.index',
                          },
                          {
                              title: 'Mes CRAs',
                              url: route('cra.personal.index'),
                              routeName: 'cra.personal.index',
                          },
                      ],
                  },
              ]
            : [
                  {
                      title: 'CRAs',
                      url: route('cra.personal.index'),
                      icon: Calendar,
                      routeName: 'cra.personal.index',
                  },
              ]),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="xl" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo className="h-20" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
