import { cn } from '@/lib/utils';
import React from 'react';

interface InputErrorProps {
    message?: string;
    className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, className = '', ...props }) => {
    if (!message) return null;

    return (
        <div className={cn('mt-1 text-sm text-red-600', className)} {...props}>
            {message}
        </div>
    );
};

export default InputError;
