import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-soft hover:shadow-card',
  secondary: 'bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-800',
  danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-soft',
  success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-soft',
  outline: 'bg-transparent text-brand-600 ring-1 ring-brand-300 hover:bg-brand-50 hover:ring-brand-400',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
