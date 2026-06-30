import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../Services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'feastfind_user';
const TOKEN_KEY = 'authToken';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const persistSession = useCallback((data) => {
    const token = data?.token || data?.accessToken || data?.jwt;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    const profile = data?.user || data;
    if (profile && profile.role) {
      setUser(profile);
      return profile;
    }
    return null;
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const data = await loginService(credentials);
        const profile = persistSession(data);
        if (!profile) {
          const fallback = { role: credentials.role || 'CUSTOMER', email: credentials.email };
          setUser(fallback);
          return fallback;
        }
        return profile;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await registerService(payload);
        const profile = persistSession(data);
        if (!profile) {
          const fallback = { role: payload.role || 'CUSTOMER', email: payload.email, name: payload.name };
          setUser(fallback);
          return fallback;
        }
        return profile;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: !!user,
      isCustomer: user?.role === 'CUSTOMER',
      isVendor: user?.role === 'VENDOR',
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
