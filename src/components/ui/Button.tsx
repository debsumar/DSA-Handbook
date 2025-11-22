import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
                    {
                        'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)]': variant === 'primary',
                        'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]': variant === 'secondary',
                        'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]': variant === 'ghost',
                        'border border-[var(--border-color)] bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]': variant === 'outline',
                        'h-9 px-3 text-sm': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-11 px-8': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
