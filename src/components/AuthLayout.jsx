import { ShoppingBag, UtensilsCrossed, Truck, Star, ShieldCheck } from 'lucide-react';

const features = [
  { icon: UtensilsCrossed, title: 'Curated local vendors', desc: 'Browse menus from top-rated kitchens near you.' },
  { icon: Truck, title: 'Real-time order tracking', desc: 'From kitchen to doorstep — know exactly when.' },
  { icon: Star, title: 'Ratings you can trust', desc: 'Community reviews on every dish and vendor.' },
  { icon: ShieldCheck, title: 'Secure payments', desc: 'Encrypted checkout with order protection.' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-ink-50 lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent-300/40 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight font-display">FeastFind</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-white font-display">
            Your favorite meals, from every kitchen in town.
          </h1>
          <p className="mt-4 text-base text-white/80">
            One marketplace. Endless vendors. Order from the best local restaurants and track everything in a single dashboard.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <f.icon className="h-6 w-6 text-white" />
                <p className="mt-2.5 text-sm font-bold text-white">{f.title}</p>
                <p className="mt-0.5 text-xs text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-white/70 text-sm">
          <div>
            <p className="text-2xl font-bold text-white font-display">12k+</p>
            <p className="text-xs">Active diners</p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white font-display">850+</p>
            <p className="text-xs">Partner vendors</p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white font-display">4.9</p>
            <p className="text-xs">Avg. rating</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:py-12">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
