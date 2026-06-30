import { useState } from 'react';
import { Mail, Lock, User, ShoppingBag, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import RoleSelector from '../components/RoleSelector';

export default function Register({ onSwitchToLogin }) {
  const { register, loading } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [errors, setErrors] = useState({});

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    else if (form.name.trim().length < 2) next.name = 'Name is too short';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Minimum 6 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    if (form.phone && !/^[\d\s+()-]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...payload } = form;
    try {
      const profile = await register(payload);
      toast.success(`Account created. Welcome, ${profile?.name || form.name}!`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-ink-900 font-display">FeastFind</span>
      </div>

      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-ink-900 font-display">Create your account</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Join FeastFind as a customer or vendor in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-700">I want to join as</p>
          <RoleSelector name="role" value={form.role} onChange={update} />
        </div>

        <Input
          label="Full name"
          name="name"
          placeholder={form.role === 'VENDOR' ? 'Vendor / store name' : 'Your full name'}
          icon={User}
          autoComplete="name"
          value={form.name}
          onChange={update}
          error={errors.name}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            autoComplete="email"
            value={form.email}
            onChange={update}
            error={errors.email}
          />
          <Input
            label="Phone (optional)"
            name="phone"
            type="tel"
            placeholder="+1 555 000 1234"
            icon={Phone}
            autoComplete="tel"
            value={form.phone}
            onChange={update}
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            icon={Lock}
            autoComplete="new-password"
            value={form.password}
            onChange={update}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            icon={Lock}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update}
            error={errors.confirmPassword}
          />
        </div>

        <label className="flex items-start gap-2.5 pt-1 text-sm text-ink-600">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400"
          />
          <span>
            I agree to the <span className="font-semibold text-brand-600">Terms of Service</span> and{' '}
            <span className="font-semibold text-brand-600">Privacy Policy</span>.
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {!loading && <><span>Create account</span><ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
