import { Plus, Star, UtensilsCrossed } from 'lucide-react';
import Badge from './Badge';

function placeholderImage(name) {
  const seed = encodeURIComponent(name || 'food');
  return `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600`;
}

export default function FoodCard({ food, onAdd }) {
  const img = food.imageUrl || food.image || placeholderImage(food.name);
  const rating = food.rating ?? (4 + Math.random() * 0.9);
  const ratingValue = Number(rating).toFixed(1);

  // 🚀 Tunasoma jina la category kwa usalama (kama ni object, tunachukua .name)
  const categoryDisplayName = food.categoryName || food.category?.name || 'Chakula';

  // 🚀 Tunasoma jina la Vendor kwa usalama kama Spring Boot inarudisha object ya Vendor
  const vendorDisplayName = food.vendorName || food.vendor?.name;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <img
          src={img}
          alt={food.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = placeholderImage(food.name);
          }}
        />
        <div className="absolute left-3 top-3">
          <Badge tone="brand" size="sm" className="backdrop-blur bg-white/90">
            {/* ✨ Sasa hivi inasoma jina la herufi, haitacrash tena */}
            {categoryDisplayName}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-ink-800 shadow-sm backdrop-blur">
          <Star className="h-3 w-3 fill-warning-500 text-warning-500" />
          {ratingValue}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-ink-900">{food.name}</h3>
        
        {/* ✨ Jina la Vendor sasa liko salama */}
        {vendorDisplayName && (
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">by {vendorDisplayName}</p>
        )}
        
        {food.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{food.description}</p>
        )}

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-ink-400">Price</p>
            <p className="text-lg font-extrabold text-ink-900 font-display">
              ${Number(food.price).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onAdd?.(food)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft transition-all duration-200 hover:bg-brand-600 hover:scale-105 active:scale-95"
            aria-label={`Add ${food.name} to cart`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton mt-2 h-3 w-1/2" />
        <div className="skeleton mt-3 h-3 w-full" />
        <div className="mt-4 flex items-center justify-between">
          <div className="skeleton h-6 w-14" />
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { UtensilsCrossed };