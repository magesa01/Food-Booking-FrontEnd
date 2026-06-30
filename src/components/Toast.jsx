import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, d) => addToast(msg, 'success', d),
    error: (msg, d) => addToast(msg, 'error', d),
    info: (msg, d) => addToast(msg, 'info', d),
    warning: (msg, d) => addToast(msg, 'warning', d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const config = {
  success: { icon: CheckCircle2, bar: 'bg-success-500', iconColor: 'text-success-500', ring: 'ring-success-100' },
  error: { icon: XCircle, bar: 'bg-error-500', iconColor: 'text-error-500', ring: 'ring-error-100' },
  warning: { icon: AlertTriangle, bar: 'bg-warning-500', iconColor: 'text-warning-500', ring: 'ring-warning-100' },
  info: { icon: Info, bar: 'bg-accent-500', iconColor: 'text-accent-600', ring: 'ring-accent-100' },
};

function ToastItem({ toast, onClose }) {
  const { icon: Icon, bar, iconColor, ring } = config[toast.type] || config.info;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-white shadow-card ring-1 ${ring} transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
      <div className="flex items-start gap-3 py-3.5 pl-5 pr-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <p className="flex-1 text-sm font-medium text-ink-700 leading-snug">{toast.message}</p>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
