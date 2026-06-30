import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, UtensilsCrossed, ShoppingBag, X, Sparkles, RefreshCw, Heart, Clock } from 'lucide-react';
import { getAllFoods } from '../Services/foodService';
import { getAllCategories } from '../Services/categoryService';
import { searchFoods } from '../Services/searchService';
import { createOrder, getOrdersByCustomer } from '../Services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DashboardNavbar from '../components/DashboardNavbar';
import FoodCard, { FoodCardSkeleton } from '../components/FoodCard';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import OrderHistory from '../components/OrderHistory';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

const sortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

export default function CustomerDashboard({ onLogout } = {}) {
  const { user } = useAuth();
  const toast = useToast();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  
  const [orderTab, setOrderTab] = useState('PENDING'); 

  // ✨ REKEBISHO: Mabano ya dependency mwishoni yamebaki tupu [] ili kuzuia Infinite Loop
  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [foodData, catData] = await Promise.all([
          getAllFoods().catch(() => []),
          getAllCategories().catch(() => []),
        ]);
        if (!active) return;
        setFoods(Array.isArray(foodData) ? foodData : foodData?.content || []);
        setCategories(Array.isArray(catData) ? catData : catData?.content || []);
      } catch (err) {
        toast.error('Could not load the marketplace. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []); // 👈 Hapa pameshakaa sawa, hapatasumbua tena!

  // Njia ya kuvuta orders kutoka Backend
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrdersByCustomer(user?.id || 'me').catch(() => []);
      const fetchedOrders = Array.isArray(data) ? data : data?.content || [];
      
      const normalizedOrders = fetchedOrders.map(o => ({
        ...o,
        status: o.status ? o.status.toUpperCase() : 'PENDING'
      }));
      
      setOrders(normalizedOrders);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Feature Mpya: Kuweka/Kutoa Chakula kwenye Favorites
  const toggleFavorite = (foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
    const isFav = favorites.includes(foodId);
    if (isFav) {
      toast.success('Removed from favorites');
    } else {
      toast.success('Added to favorites!');
    }
  };

  // Angalia kama kuna Active Order yoyote kwa sasa
  const hasActiveOrder = useMemo(() => {
    return orders.some(o => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'DELIVERING');
  }, [orders]);

  const filteredFoods = useMemo(() => {
    let list = foods;
    if (activeCategory === 'favorites') {
      list = list.filter((f) => favorites.includes(f.id));
    } else if (activeCategory !== 'all') {
      list = list.filter(
        (f) =>
          String(f.categoryId) === String(activeCategory) ||
          String(f.category?.id) === String(activeCategory) ||
          f.categoryName === activeCategory ||
          f.category === activeCategory
      );
    }
    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [foods, activeCategory, sortBy, favorites]);

  const displayedFoods = useMemo(() => {
    if (!debouncedSearch.trim()) return filteredFoods;
    return filteredFoods.filter((f) =>
      f.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [filteredFoods, debouncedSearch]);

  const handleSearchSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    if (!search.trim()) return;
    try {
      const results = await searchFoods(search).catch(() => null);
      if (Array.isArray(results)) {
        setFoods(results);
      }
    } catch {
      // fall back to local filtering
    }
  }, [search]);

  const addToCart = useCallback((food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) => (i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    toast.success(`${food.name} added to cart`);
  }, [toast]);

  const incrementItem = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  const decrementItem = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const handleCheckout = async (details) => {
    setPlacing(true);
    try {
      const activeVendorId = cart[0]?.vendorId || cart[0]?.vendor?.id || 2;

      const orderPayload = {
        userId: user?.id, 
        vendorId: activeVendorId, 
        items: cart.map((i) => ({
          foodId: i.id,
          foodName: i.name,
          price: Number(i.price),
          quantity: i.quantity,
        })),
        totalAmount: Number((cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)),
        deliveryAddress: details.deliveryAddress,
        paymentMethod: details.paymentMethod,
        notes: details.notes || '',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      console.log("Inatuma oda kwenda backend na payload hii:", orderPayload);

      const response = await createOrder(orderPayload);
      
      const savedOrder = response?.data || response || orderPayload;
      setOrders(prev => [
        { ...savedOrder, status: 'PENDING' }, 
        ...prev
      ]);

      toast.success('Order placed successfully!');
      setCart([]);
      setCartOpen(false);
      setCheckoutOpen(false);
      setOrderTab('PENDING'); 

      setTimeout(() => {
        loadOrders();
      }, 1000);

    } catch (err) {
      console.error("Kosa la Checkout:", err.response?.data || err);
      toast.error(err?.response?.data?.message || 'Failed to place order. Please check data fields.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <DashboardNavbar
        title="Marketplace"
        subtitle={`Hungry, ${user?.name?.split(' ')[0] || 'there'}? Explore vendors near you.`}
        onLogout={onLogout}
        right={
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition-colors hover:bg-ink-200"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {hasActiveOrder && (
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">You have an active order running!</h3>
                <p className="text-xs text-amber-700">Check the progress in the Order History section below.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const element = document.getElementById('order-history-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Track Order
            </button>
          </div>
        )}

        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-6 py-8 text-white shadow-card sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-accent-300/30 blur-2xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Fresh picks daily
            </div>
            <h2 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight font-display sm:text-3xl">
              Crave it. Find it. Feast.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Search across hundreds of vendors and dishes. Add to cart and check out in seconds.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-5 flex max-w-xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for dishes, cuisines, vendors…"
                  className="h-12 w-full rounded-xl border-0 bg-white pl-11 pr-10 text-sm text-ink-800 placeholder:text-ink-400 shadow-soft focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="h-12 flex-shrink-0 rounded-xl bg-ink-900 px-5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-ink-800"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Category Navigation Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-900">Browse by category</h2>
                <p className="text-xs text-ink-500">{categories.length} categories available</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ink-50 sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            <CategoryChip
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              label="All Dishes"
              count={foods.length}
            />
            <button
              onClick={() => setActiveCategory('favorites')}
              className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === 'favorites'
                  ? 'bg-red-500 text-white shadow-soft'
                  : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${activeCategory === 'favorites' ? 'fill-white' : 'text-red-500 fill-red-500'}`} />
              Favorites
              {favorites.length > 0 && (
                <span className={`ml-1 rounded-md px-1.5 py-0.5 text-xs font-bold ${activeCategory === 'favorites' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                  {favorites.length}
                </span>
              )}
            </button>

            {categories.map((c) => (
              <CategoryChip
                key={c.id || c.name}
                active={activeCategory === (c.id || c.name)}
                onClick={() => setActiveCategory(c.id || c.name)}
                label={c.name}
                count={foods.filter((f) => String(f.categoryId) === String(c.id) || f.categoryName === c.name || f.category === c.name).length}
              />
            ))}
          </div>
        </section>

        {/* Filter / Info Bar */}
        <div className={`mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          <p className="text-sm text-ink-500">
            {loading ? 'Loading dishes…' : `${displayedFoods.length} dishes available`}
            {debouncedSearch && <span className="text-ink-400"> for "{debouncedSearch}"</span>}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink-500">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border-0 bg-white py-2 pl-3 pr-8 text-sm font-medium text-ink-700 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Foods Grid */}
        <section className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <FoodCardSkeleton key={i} />)}
            </div>
          ) : displayedFoods.length === 0 ? (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
              <EmptyState
                icon={UtensilsCrossed}
                title={activeCategory === 'favorites' ? "No favorites added yet" : "No dishes found"}
                description={activeCategory === 'favorites' ? "Tap the heart icon on any dish to save it here." : debouncedSearch ? `Try a different search term or category.` : 'Check back soon — vendors are adding new dishes daily.'}
                action={
                  (activeCategory !== 'all' || debouncedSearch) && (
                    <button
                      onClick={() => { setActiveCategory('all'); setSearch(''); setDebouncedSearch(''); }}
                      className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-600"
                    >
                      Clear filters
                    </button>
                  )
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedFoods.map((food) => (
                <div key={food.id} className="relative group">
                  <button 
                    onClick={() => toggleFavorite(food.id)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm text-ink-600 transition-transform active:scale-95 hover:bg-white hover:text-red-500"
                    aria-label="Favorite"
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(food.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  
                  <FoodCard food={food} onAdd={addToCart} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order History Section */}
        <section id="order-history-section" className="mt-12 pt-6 border-t border-ink-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Your Order History</h2>
            <button 
              onClick={loadOrders}
              disabled={ordersLoading}
              className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-600 ring-1 ring-ink-200 transition-colors hover:bg-ink-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${ordersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <OrderHistory 
            orders={orders} 
            loading={ordersLoading} 
            activeTab={orderTab} 
            onTabChange={setOrderTab} 
          />
        </section>
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        placing={placing}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        total={cartTotal}
        onConfirm={handleCheckout}
        placing={placing}
      />
    </div>
  );
}

function CategoryChip({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-brand-500 text-white shadow-soft'
          : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300'
      }`}
    >
      {label}
      {count > 0 && (
        <Badge tone={active ? 'neutral' : 'brand'} size="sm" className={active ? 'bg-white/20 text-white ring-white/20' : ''}>
          {count}
        </Badge>
      )}
    </button>
  );
}