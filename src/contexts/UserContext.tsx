
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/inventory';
import { authApi, tokenStore } from '@/lib/api';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UserContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthorized: (requiredRole: 'admin' | 'manager' | 'viewer') => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const SESSION_USER_KEY = 'itemflow_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { t } = useTranslation();

  // Restore session on mount
  useEffect(() => {
    const userJson = sessionStorage.getItem(SESSION_USER_KEY);
    const token = tokenStore.get();
    if (userJson && token) {
      try {
        setCurrentUser(JSON.parse(userJson));
        // Trigger background database sync
        storage.syncWithBackend();
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        sessionStorage.removeItem(SESSION_USER_KEY);
        tokenStore.clear();
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { token, user: apiUser } = await authApi.login(username, password);

      // Persist token and user
      tokenStore.set(token);

      const user: User = {
        id: apiUser.id,
        username: apiUser.username,
        role: apiUser.role as User['role'],
        password: '', // never stored client-side
        lastLogin: apiUser.lastLogin,
      };

      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);

      // Sync data from database to localStorage cache
      await storage.syncWithBackend();

      toast.success(t('auth.loginSuccess'));
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.error || t('auth.invalid');
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    tokenStore.clear();
    sessionStorage.removeItem(SESSION_USER_KEY);
    setCurrentUser(null);
    toast.success(t('auth.logoutSuccess'));
  };

  const isAdmin = (): boolean => currentUser?.role === 'admin';

  const isAuthorized = (requiredRole: 'admin' | 'manager' | 'viewer'): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && (requiredRole === 'manager' || requiredRole === 'viewer')) return true;
    if (currentUser.role === 'viewer' && requiredRole === 'viewer') return true;
    return false;
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, isAdmin, isAuthorized }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
