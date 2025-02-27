import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const isActiveRoute = (routeName: string) => route().current(routeName);

    const toggleSubMenu = (title: string) => {
        setOpenSubMenu(openSubMenu === title ? null : title);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isActiveRoute(item.routeName) || item.subItems?.some((sub) => isActiveRoute(sub.routeName));

                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.subItems ? (
                                <>
                                    <SidebarMenuButton
                                        onClick={() => toggleSubMenu(item.title)}
                                        className={cn(
                                            'w-full pr-2 transition-all duration-200',
                                            isActive && 'bg-indigo-500 font-medium text-white shadow-sm hover:bg-indigo-500',
                                        )}
                                    >
                                        {item.icon && <item.icon className={cn('mr-3', isActive && 'text-white')} />}
                                        <span className="flex-1">{item.title}</span>
                                        <ChevronDown className={cn('h-4 w-4 transition-transform', openSubMenu === item.title && 'rotate-180')} />
                                    </SidebarMenuButton>
                                    {openSubMenu === item.title && (
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={cn(
                                                            'transition-all duration-200',
                                                            isActiveRoute(subItem.routeName) &&
                                                                'bg-indigo-500 font-medium text-white shadow-sm hover:bg-indigo-500',
                                                        )}
                                                    >
                                                        <Link href={subItem.url} prefetch>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        'transition-all duration-200',
                                        isActive && 'bg-indigo-500 font-medium text-white shadow-sm hover:bg-indigo-500',
                                    )}
                                >
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon className={cn('mr-3', isActive && 'text-white')} />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
