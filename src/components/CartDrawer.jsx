import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from './Button';
import EmptyState from './EmptyState';

export default function CartDrawer({ open, onClose, items, onIncrement, onDecrement, onRemove, onCheckout, placing }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md animate-slide-in-right flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900">Your cart</h2>
              <p className="text-xs text-ink-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse the marketplace and add your favorite dishes to get started."
            />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-100"
                >
                  <img
                    src={item.imageUrl || item.image || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200`}
                    alt={item.name}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200`;
                    }}
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
                        <p className="text-xs text-ink-500">${Number(item.price).toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-error-50 hover:text-error-500"
                        aria-label="Remove item"
                  >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-lg bg-white ring-1 ring-ink-200">
                        <button
                          onClick={() => onDecrement(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-l-lg text-ink-600 transition-colors hover:bg-ink-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-ink-900">{item.quantity}</span>
                        <button
                          onClick={() => onIncrement(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-r-lg text-ink-600 transition-colors hover:bg-ink-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-extrabold text-ink-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-100 bg-ink-50/50 px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-ink-800">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-ink-800">${tax.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-ink-200 pt-2.5">
                  <span className="font-bold text-ink-900">Total</span>
                  <span className="text-lg font-extrabold text-brand-600 font-display">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={onCheckout} loading={placing} size="lg" className="mt-4 w-full">
                {!placing && <><span>Checkout</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}
