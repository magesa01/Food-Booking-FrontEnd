import { User, Store } from 'lucide-react';

const roles = [
  { value: 'CUSTOMER', label: 'Customer', icon: User, desc: 'Order food from vendors' },
  { value: 'VENDOR', label: 'Vendor', icon: Store, desc: 'Sell food & manage orders' },
];

export default function RoleSelector({ value, onChange, name = 'role' }) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-3">
      {roles.map((r) => {
        const active = value === r.value;
        return (
          <button
            key={r.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange({ target: { name, value: r.value } })}
            className={`group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
              active
                ? 'border-brand-500 bg-brand-50 shadow-glow'
                : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                active ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500 group-hover:bg-ink-200'
              }`}
            >
              <r.icon className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-bold ${active ? 'text-brand-700' : 'text-ink-800'}`}>{r.label}</p>
              <p className="text-xs text-ink-500">{r.desc}</p>
            </div>
            {active && (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-brand-100" />
            )}
          </button>
        );
      })}
    </div>
  );
}
