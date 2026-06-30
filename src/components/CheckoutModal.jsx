import { useState } from 'react';
import { MapPin, CreditCard, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

const paymentMethods = [
  { id: 'CARD', label: 'Credit / Debit card', icon: CreditCard },
  { id: 'WALLET', label: 'Digital wallet', icon: Wallet },
  { id: 'COD', label: 'Cash on delivery', icon: Banknote },
];

export default function CheckoutModal({ open, onClose, items, total, onConfirm, placing }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');
  const [method, setMethod] = useState('CARD');
  const [done, setDone] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + deliveryFee + tax;

  const reset = () => {
    setAddress(''); setCity(''); setZip(''); setNotes(''); setMethod('CARD'); setDone(false);
  };

  const handleClose = () => {
    if (done) reset();
    onClose();
  };

  const handleConfirm = async () => {
    if (!address.trim() || !city.trim() || !zip.trim()) return;
    await onConfirm({
      deliveryAddress: `${address}, ${city} ${zip}`,
      paymentMethod: method,
      notes,
    });
    setDone(true);
  };

  if (done) {
    return (
      <Modal open={open} onClose={handleClose} size="sm">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-500">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-ink-900 font-display">Order placed!</h2>
          <p className="mt-1.5 max-w-xs text-sm text-ink-500">
            Your order has been sent to the vendor. Track its progress in your order history.
          </p>
          <Button onClick={handleClose} size="lg" className="mt-6 w-full">
            Continue browsing
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Checkout"
      description="Confirm your delivery details and payment method."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} loading={placing} disabled={!address.trim() || !city.trim() || !zip.trim()}>
            Place order · ${grandTotal.toFixed(2)}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold text-ink-900">Delivery address</h3>
          </div>
          <div className="space-y-3">
            <Input
              label="Street address"
              placeholder="123 Main Street, Apt 4B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="ZIP code"
                placeholder="94103"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
            <Input
              label="Delivery notes (optional)"
              placeholder="Leave at the front door, ring the bell"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold text-ink-900">Payment method</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {paymentMethods.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                    active ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <m.icon className={`h-5 w-5 ${active ? 'text-brand-600' : 'text-ink-500'}`} />
                  <span className={`text-xs font-semibold ${active ? 'text-brand-700' : 'text-ink-700'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-ink-50 p-4">
          <h3 className="mb-2 text-sm font-bold text-ink-900">Order summary</h3>
          <div className="space-y-1.5 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-ink-600">
                <span className="truncate pr-2">{i.quantity}× {i.name}</span>
                <span className="font-semibold text-ink-800">${(Number(i.price) * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-2 space-y-1 border-t border-ink-200 pt-2 text-ink-600">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-900">
              <span>Total</span>
              <span className="font-display">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
