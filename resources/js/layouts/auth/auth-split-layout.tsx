import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    background?: {
        type: 'color' | 'image';
        value: string;
    };
}

export default function AuthSplitLayout({ 
    children, 
    title, 
    description, 
    background = { type: 'color', value: 'bg-gradient-to-br from-blue-900 to-indigo-900' } 
}: AuthLayoutProps) {
    const { quote } = usePage<SharedData>().props;
    const [fadeIn, setFadeIn] = useState(false);
    
    useEffect(() => {
        // Animation d'apparition pour la citation
        setFadeIn(true);
    }, []);

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div 
                    className={cn(
                        "absolute inset-0",
                        background.type === 'color' ? background.value : '',
                        "overflow-hidden"
                    )}
                    style={
                        background.type === 'image' 
                            ? {
                                backgroundImage: `url(${background.value})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }
                            : undefined
                    }
                >
                    {/* Élément décoratif - cercles flous */}
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                </div>
                
                {/* Logo et contenu supérieur */}
                <div className="relative z-20">
                    <Link href={route('home')} className="flex items-center text-lg font-medium">
                        <AppLogoIcon className="mr-2 size-20 fill-current text-black drop-shadow-lg" />
                    </Link>
                </div>
                
                {/* Citation */}
                {quote && (
                    <div className={cn(
                        "relative z-20 mt-auto transition-opacity duration-1000 ease-in-out",
                        fadeIn ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="mb-6 flex items-center">
                            <div className="h-px flex-1 bg-white/20"></div>
                            <span className="mx-4 text-sm font-medium uppercase tracking-wider text-white/60">Citation</span>
                            <div className="h-px flex-1 bg-white/20"></div>
                        </div>
                        <blockquote className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                            <p className="mb-4 text-xl font-light italic leading-relaxed text-white">
                                &ldquo;{quote.message}&rdquo;
                            </p>
                            <footer className="flex items-center">
                                <div className="h-0.5 w-6 bg-white/40 mr-3"></div>
                                <span className="text-sm font-medium text-white/80">{quote.author}</span>
                            </footer>
                        </blockquote>
                    </div>
                )}
            </div>
            
            {/* Panneau droit - formulaire */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center mb-8 lg:hidden">
                        <AppLogoIcon className="h-12 fill-current text-black sm:h-14" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance max-w-md mb-2">{description}</p>
                    </div>
                    
                    {/* Contenu du formulaire */}
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
