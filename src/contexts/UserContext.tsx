
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/inventory';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UserContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthorized: (requiredRole: 'admin' | 'manager' | 'viewer') => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUserSession = () => {
      const storedUser = storage.getCurrentUser();
      if (storedUser) {
        setCurrentUser(storedUser);
      } else if (localStorage.getItem('adminAuth') === 'true') {
        const adminUser = storage.getUsers().find(u => u.role === 'admin');
        if (adminUser) {
          setCurrentUser(adminUser);
        }
      }
    };

    loadUserSession();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'inventory_current_user' || event.key === 'adminAuth') {
        loadUserSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = storage.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
      };
      storage.updateUser(updatedUser);
      storage.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
      
      if (user.role === 'admin') {
        localStorage.setItem('adminAuth', 'true');
      }
      
      toast.success(t('auth.loginSuccess'));
      return true;
    }
    toast.error(t('auth.invalid'));
    return false;
  };

  const logout = () => {
    storage.setCurrentUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('inventory_current_user');
    setCurrentUser(null);
    toast.success(t('auth.logoutSuccess'));
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin' || localStorage.getItem('adminAuth') === 'true';
  };

  const isAuthorized = (requiredRole: 'admin' | 'manager' | 'viewer'): boolean => {
    if (requiredRole === 'admin' && localStorage.getItem('adminAuth') === 'true') {
      return true;
    }
    
    if (!currentUser) return false;
    
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && requiredRole !== 'admin') return true;
    if (currentUser.role === 'viewer' && requiredRole === 'viewer') return true;
    
    return false;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthorized,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
