import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 24, className = '' }) {
  return <Loader2 style={{ width: size, height: size }} className={`animate-spin text-brand-500 ${className}`} />;
}

export function FullPageSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-ink-100" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-brand-500" />
      </div>
      <p className="text-sm font-medium text-ink-500">{label}</p>
    </div>
  );
}

export function InlineSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Spinner size={20} />
      <span className="text-sm font-medium text-ink-500">{label}</span>
    </div>
  );
}
