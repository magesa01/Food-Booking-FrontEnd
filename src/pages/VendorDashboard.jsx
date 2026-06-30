import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, UtensilsCrossed, Receipt, DollarSign, Package, Search, Trash2, Pencil, ChefHat } from 'lucide-react';
import { getAllFoods, createFood, deleteFood, updateFood } from '../Services/foodService';
import { getAllCategories } from '../Services/categoryService';
import { getOrdersByVendor, updateOrderStatus } from '../Services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DashboardNavbar from '../components/DashboardNavbar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import AddFoodModal from '../components/AddFoodModal';
import VendorOrderCard from '../components/VendorOrderCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export default function VendorDashboard({ onLogout } = {}) {
  const { user } = useAuth();
  const toast = useToast();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [tab, setTab] = useState('menu'); // Imefunguka kwenye Menu moja kwa moja
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [advancing, setAdvancing] = useState(null);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [foodSearch, setFoodSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [foodData, catData] = await Promise.all([
        getAllFoods().catch(() => []),
        getAllCategories().catch(() => []),
      ]);
      const foodList = Array.isArray(foodData) ? foodData : foodData?.content || [];
      const catList = Array.isArray(catData) ? catData : catData?.content || [];
      
      // Kitambulisho cha muuzaji (Kama hakuna kwenye auth, inatumia ID 2 kulingana na Supabase yako)
      const currentVendorId = user?.id || 2; 
      
      const vendorFoods = foodList.filter((f) => {
        const fVendorId = f.vendor?.id || f.vendorId || f.vendor_id;
        return String(fVendorId) === String(currentVendorId);
      });

      setFoods(vendorFoods);
      setCategories(catList);
    } catch {
      toast.error('Could not load your store data.');
    } finally {
      setLoading(false);
    }
  }, [toast, user?.id]);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    const currentVendorId = user?.id || 2; 
    try {
      const data = await getOrdersByVendor(currentVendorId).catch(() => []);
      setOrders(Array.isArray(data) ? data : data?.content || []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
    loadOrders();
  }, [loadData, loadOrders]);

  const handleAddFood = async (payload) => {
    setSaving(true);
    try {
      const springBootPayload = {
        name: payload.name,
        price: Number(payload.price),
        description: payload.description || '', // Inahakikisha description inatumwa kwenda Java
        imageUrl: payload.imageUrl || payload.image || '',
        category: {
          id: Number(payload.categoryId || payload.category_id)
        },
        vendor: {
          id: Number(user?.id || 2)
        }
      };

      const created = await createFood(springBootPayload);
      setFoods((prev) => [created, ...prev]);
      toast.success(`${created.name || payload.name} added to your menu`);
      setAddOpen(false);
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add food item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFood(deleteTarget.id);
      setFoods((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      toast.success(`${deleteTarget.name} removed from your menu`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete item.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAdvanceOrder = async (id, nextStatus) => {
    setAdvancing(id);
    try {
      const updated = await updateOrderStatus(id, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: nextStatus, ...(updated || {}) } : o)));
      toast.success(`Order #${String(id).slice(-6).toUpperCase()} moved to ${nextStatus.toLowerCase()}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update order status.');
    } finally {
      setAdvancing(null);
    }
  };

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);
    const pending = orders.filter((o) => o.status === 'PENDING').length;
    const preparing = orders.filter((o) => o.status === 'PREPARING').length;
    return { revenue, pending, preparing, totalOrders: orders.length, menuCount: foods.length };
  }, [orders, foods.length]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  const filteredFoods = useMemo(() => {
    if (!foodSearch.trim()) return foods;
    const q = foodSearch.toLowerCase();
    return foods.filter((f) => f.name?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q));
  }, [foods, foodSearch]);

  const orderTabs = [
    { value: 'ALL', label: 'All', count: orders.length },
    { value: 'PENDING', label: 'Pending', count: stats.pending },
    { value: 'PREPARING', label: 'Preparing', count: stats.preparing },
  ];

  // Kushughulikia jina la category kwa usalama
  const getCategoryLabel = (food) => {
    if (food.category && typeof food.category === 'object') {
      return food.category.name || 'Uncategorized';
    }
    if (food.categoryName) return food.categoryName;
    
    const catId = food.category_id || food.categoryId;
    const found = categories.find((c) => String(c.id) === String(catId));
    return found ? found.name : 'Uncategorized';
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <DashboardNavbar
        title="Vendor dashboard"
        subtitle={user?.name ? `${user.name}'s store` : "Elisha Dai's store"}
        onLogout={onLogout}
        right={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add item</span>
          </Button>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP STATS CARDS */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={DollarSign} label="Revenue" value={`$${stats.revenue.toFixed(2)}`} tone="success" hint="From completed orders" />
          <StatCard icon={Receipt} label="Total orders" value={stats.totalOrders} tone="brand" hint={`${stats.pending} pending`} />
          <StatCard icon={ChefHat} label="In the kitchen" value={stats.preparing} tone="accent" hint="Being prepared" />
          <StatCard icon={Package} label="Menu items" value={stats.menuCount} tone="neutral" hint="Dishes on your store" />
        </section>

        {/* TABS SWITCHER */}
        <div className="mt-6 flex rounded-2xl bg-white p-1.5 shadow-card ring-1 ring-ink-100">
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={Receipt} label="Orders" count={orders.length} />
          <TabButton active={tab === 'menu'} onClick={() => setTab('menu')} icon={UtensilsCrossed} label="My menu" count={foods.length} />
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <section className="mt-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink-900 font-display">Incoming orders</h2>
                <p className="text-sm text-ink-500">Accept and track orders as they come in.</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {orderTabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setOrderFilter(t.value)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      orderFilter === t.value ? 'bg-brand-500 text-white shadow-soft' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {t.label}
                    <span className={`rounded-full px-1.5 text-[10px] ${orderFilter === t.value ? 'bg-white/20' : 'bg-white'}`}>{t.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100"><div className="skeleton h-5 w-1/3" /></div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
                <EmptyState icon={Receipt} title="No orders here yet" description="When customers place orders, they will appear here." />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredOrders.map((order) => (
                  <VendorOrderCard key={order.id} order={order} onAdvance={handleAdvanceOrder} advancing={advancing} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* MENU TAB (HAPA NDIPO VYAKULA VYAKO VYOTE VINAPOONESHWA) */}
        {tab === 'menu' && (
          <section className="mt-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink-900 font-display">My menu</h2>
                <p className="text-sm text-ink-500">Manage the dishes available on your store.</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
                <input
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Search your menu…"
                  className="h-10 w-full rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-ink-800 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-400 sm:w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100"><div className="skeleton aspect-[4/3] w-full rounded-xl" /></div>
                ))}
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
                <EmptyState
                  icon={UtensilsCrossed}
                  title="Your menu is empty"
                  description="Add your first dish to start receiving orders."
                  action={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add your first dish</Button>}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFoods.map((food) => (
                  <div key={food.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition-all hover:shadow-soft">
                    
                    {/* SEHEMU YA PICHA */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
                      <img
                        src={food.image_url || food.imageUrl || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600`}
                        alt={food.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { 
                          // Kama link ya google share ikifeli kusoma moja kwa moja, weka picha hii ya chakula kama mbadala
                          e.currentTarget.src = `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600`; 
                        }}
                      />
                      <div className="absolute right-2 top-2 flex gap-1.5">
                        <button onClick={() => setDeleteTarget(food)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-error-500 shadow-sm backdrop-blur hover:bg-error-500 hover:text-white">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* SEHEMU YA DATA (NAME, PRICE, DESCRIPTION, CATEGORY) */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        {/* JINA LA CHAKULA */}
                        <h3 className="text-base font-bold text-ink-900 line-clamp-1">{food.name}</h3>
                        {/* BEI YA CHAKULA */}
                        <p className="flex-shrink-0 text-base font-extrabold text-brand-600">${Number(food.price).toFixed(2)}</p>
                      </div>

                      {/* MAELEZO / DESCRIPTION */}
                      <p className="mt-1 text-sm text-ink-500 line-clamp-2 min-h-[40px]">
                        {food.description || "No description provided for this dish."}
                      </p>

                      {/* BADGE YA CATEGORY */}
                      <div className="mt-auto pt-3">
                        <Badge tone="brand" size="sm">
                          {getCategoryLabel(food)}
                        </Badge>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <AddFoodModal open={addOpen} onClose={() => setAddOpen(false)} categories={categories} onSubmit={handleAddFood} saving={saving} />

      <Modal
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove from menu?"
        footer={<><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button></>}
      >
        <p className="text-sm text-ink-600">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = { success: 'bg-success-50 text-success-600', brand: 'bg-brand-50 text-brand-600', accent: 'bg-accent-50 text-accent-600', neutral: 'bg-ink-100 text-ink-600' };
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="truncate text-lg font-extrabold text-ink-900 sm:text-xl">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, count }) {
  return (
    <button onClick={onClick} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${active ? 'bg-brand-500 text-white' : 'text-ink-600'}`}>
      <Icon className="h-4 w-4" /> {label} <span className="rounded-full px-1.5 text-[10px] bg-ink-100 text-ink-800">{count}</span>
    </button>
  );
}