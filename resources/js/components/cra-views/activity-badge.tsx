import { cn } from '@/lib/utils';
import { type ActivityType, getActivityColor, getActivityLabel } from './activity-types';

interface ActivityBadgeProps {
    type: ActivityType;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline' | 'soft';
}

export const ActivityBadge = ({ type, size = 'md', variant = 'soft' }: ActivityBadgeProps) => {
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap',
                sizes[size],
                getActivityColor(type, variant),
            )}
        >
            {getActivityLabel(type)}
        </span>
    );
};
