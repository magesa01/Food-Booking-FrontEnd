import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from './Badge';

export default function DashboardNavbar({ title, subtitle, onLogout, right }) {
  const { user, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = (user?.name || user?.email || 'U')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-ink-900 font-display">{title}</h1>
            {subtitle && <p className="truncate text-xs text-ink-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {right}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-ink-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-bold text-white">
                {initials || <UserCircle className="h-5 w-5" />}
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[140px] truncate text-sm font-semibold text-ink-800">
                  {user?.name || 'Account'}
                </p>
                <div className="flex items-center gap-1">
                  <Badge tone={role === 'VENDOR' ? 'accent' : 'brand'} size="sm">{role || 'USER'}</Badge>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 animate-scale-in overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
                <div className="border-b border-ink-100 px-4 py-3">
                  <p className="truncate text-sm font-bold text-ink-900">{user?.name || 'Account'}</p>
                  <p className="truncate text-xs text-ink-500">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
