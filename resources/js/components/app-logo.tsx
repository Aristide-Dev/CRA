import AppLogoIcon from './app-logo-icon';
import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <>
            <div className="bg-transparent text-sidebar-primary-foreground flex aspect-square size-20 items-center justify-center rounded-md">
                <AppLogoIcon className={cn("size-35 fill-current text-indigo-900 dark:text-blue-700", className)} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">CRA APP</span>
            </div>
        </>
    );
}
