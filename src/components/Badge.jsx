const tones = {
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
};

const dotTones = {
  neutral: 'bg-ink-400',
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export default function Badge({ tone = 'neutral', dot = false, size = 'md', className = '', children }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotTones[tone]}`} />}
      {children}
    </span>
  );
}
