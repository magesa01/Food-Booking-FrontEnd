import { Clock, ChefHat, CheckCircle2, ArrowRight, MapPin, User } from 'lucide-react';
import Badge from './Badge';

const statusFlow = ['PENDING', 'PREPARING', 'COMPLETED'];
const statusConfig = {
  PENDING: { tone: 'warning', label: 'Pending', icon: Clock, next: 'PREPARING', nextLabel: 'Start preparing', nextIcon: ChefHat },
  PREPARING: { tone: 'accent', label: 'Preparing', icon: ChefHat, next: 'COMPLETED', nextLabel: 'Mark as completed', nextIcon: CheckCircle2 },
  COMPLETED: { tone: 'success', label: 'Completed', icon: CheckCircle2, next: null },
};

export default function VendorOrderCard({ order, onAdvance, advancing }) {
  const cfg = statusConfig[order.status] || statusConfig.PENDING;
  const NextIcon = cfg.nextIcon;
  const items = order.items || order.orderItems || [];
  const total = Number(order.total || order.totalAmount || 0);

  return (
    <div className="rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition-all hover:shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            order.status === 'PENDING' ? 'bg-warning-50 text-warning-600' :
            order.status === 'PREPARING' ? 'bg-accent-50 text-accent-600' :
            'bg-success-50 text-success-600'
          }`}>
            <cfg.icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">
              Order #{String(order.id).slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-ink-500">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>
        <Badge tone={cfg.tone} dot>{cfg.label}</Badge>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-start gap-2 text-sm text-ink-600">
          <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" />
          <div>
            <p className="font-semibold text-ink-800">{order.customerName || order.customer || 'Customer'}</p>
            {order.deliveryAddress && (
              <p className="mt-0.5 flex items-start gap-1 text-xs text-ink-500">
                <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {order.deliveryAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {items.length === 0 ? (
            <p className="text-xs text-ink-400">No item details available</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-ink-700">
                  <span className="font-semibold text-ink-900">{item.quantity}×</span> {item.foodName || item.name}
                </span>
                <span className="font-medium text-ink-600">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {order.notes && (
          <div className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600 ring-1 ring-ink-100">
            <span className="font-semibold text-ink-700">Note: </span>{order.notes}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
          <div>
            <p className="text-xs text-ink-400">Total</p>
            <p className="text-lg font-extrabold text-ink-900 font-display">${total.toFixed(2)}</p>
          </div>
          {cfg.next && (
            <button
              onClick={() => onAdvance(order.id, cfg.next)}
              disabled={advancing === order.id}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 ${
                order.status === 'PENDING' ? 'bg-accent-500 hover:bg-accent-600' : 'bg-success-500 hover:bg-success-600'
              }`}
            >
              {advancing === order.id ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <NextIcon className="h-4 w-4" />
                  <span>{cfg.nextLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
