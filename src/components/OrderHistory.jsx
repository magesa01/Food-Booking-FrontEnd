import { Receipt, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Badge from './Badge';
import EmptyState from './EmptyState';

const statusConfig = {
  PENDING: { tone: 'warning', label: 'Pending' },
  PREPARING: { tone: 'accent', label: 'Preparing' },
  COMPLETED: { tone: 'success', label: 'Completed' },
  CANCELLED: { tone: 'error', label: 'Cancelled' },
};

export default function OrderHistory({ orders, loading, activeTab, onTabChange }) {
  const pending = orders.filter((o) => ['PENDING', 'PREPARING'].includes(o.status));
  const completed = orders.filter((o) => ['COMPLETED', 'CANCELLED'].includes(o.status));
  const list = activeTab === 'pending' ? pending : completed;

  return (
    <div className="rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-900">Order history</h2>
            <p className="text-xs text-ink-500">Track your active and past orders</p>
          </div>
        </div>
        <div className="flex rounded-xl bg-ink-100 p-1">
          <button
            onClick={() => onTabChange('pending')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Active ({pending.length})
          </button>
          <button
            onClick={() => onTabChange('completed')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'completed' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Past ({completed.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={activeTab === 'pending' ? 'No active orders' : 'No past orders yet'}
          description={activeTab === 'pending' ? 'Place an order to see it tracked here in real time.' : 'Your completed orders will appear here.'}
        />
      ) : (
        <ul className="divide-y divide-ink-100">
          {list.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING;
            return (
              <li key={order.id} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink-50/60">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-ink-900">
                      Order #{String(order.id).slice(-6).toUpperCase()}
                    </p>
                    <Badge tone={cfg.tone} dot size="sm">{cfg.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-500">
                    {order.items?.length || 0} items · {order.vendorName || order.vendor || 'Vendor'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-ink-900 font-display">
                    ${Number(order.total || order.totalAmount || 0).toFixed(2)}
                  </p>
                  <ChevronRight className="ml-auto mt-1 h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
