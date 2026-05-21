import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-600 transition-vl btn-pill cursor-pointer whitespace-nowrap',
          size === 'sm' && 'px-5 py-2 text-sm',
          size === 'md' && 'px-7 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-base',
          variant === 'primary' && [
            'text-[#0A0A0B]',
            'hover:opacity-90 active:scale-[0.98]',
          ],
          variant === 'ghost' && [
            'border border-[var(--border)] text-[var(--text-primary)]',
            'hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]',
          ],
          variant === 'outline' && [
            'border border-[var(--accent-volt)] text-[var(--accent-volt)]',
            'hover:bg-[var(--accent-volt-dim)]',
          ],
          variant === 'gold' && [
            'text-[#0A0A0B]',
            'hover:opacity-90 active:scale-[0.98]',
          ],
          className
        )}
        style={{
          background:
            variant === 'primary'
              ? 'var(--accent-volt)'
              : variant === 'gold'
              ? 'var(--accent-gold)'
              : undefined,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
