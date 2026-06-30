import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import { FullPageSpinner } from './components/Spinner';

type AuthView = 'login' | 'register';

function AppRoutes() {
  const { isAuthenticated, isVendor, loading } = useAuth();
  const [view, setView] = useState<AuthView>('login');

  if (loading && !isAuthenticated) {
    return <FullPageSpinner label="Preparing your experience…" />;
  }

  if (!isAuthenticated) {
    return view === 'login' ? (
      <Login onSwitchToRegister={() => setView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setView('login')} />
    );
  }

  return isVendor ? <VendorDashboard /> : <CustomerDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
