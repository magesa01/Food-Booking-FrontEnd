import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, type = 'text', className = '', containerClassName = '', ...props },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
            Icon ? 'pl-11' : ''
          } ${isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-error-300 focus:border-error-400 focus:ring-error-100'
              : 'border-ink-200 focus:border-brand-400 focus:ring-brand-100'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-error-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
