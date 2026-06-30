import { useState } from 'react';
import { Mail, Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import RoleSelector from '../components/RoleSelector';

export default function Login({ onSwitchToRegister }) {
  const { login, loading } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '', role: 'CUSTOMER' });
  const [errors, setErrors] = useState({});

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Minimum 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const profile = await login(form);
      toast.success(`Welcome back${profile?.name ? ', ' + profile.name : ''}!`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unable to sign in. Check your credentials.';
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

      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-ink-900 font-display">Welcome back</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Sign in to continue to your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-700">I am signing in as</p>
          <RoleSelector name="role" value={form.role} onChange={update} />
        </div>

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
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          autoComplete="current-password"
          value={form.password}
          onChange={update}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400"
            />
            Remember me
          </label>
          <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {!loading && <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Create one
        </button>
      </p>
    </AuthLayout>
  );
}
