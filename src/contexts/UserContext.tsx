
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

  // Load user session on mount
  useEffect(() => {
    // Check localStorage directly for user info
    const userJson = localStorage.getItem('inventory_current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
      }
    }
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
      
      // Update in storage
      storage.updateUser(updatedUser);
      
      // Set in both localStorage and state
      localStorage.setItem('inventory_current_user', JSON.stringify(updatedUser));
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
    // Clear from localStorage first
    localStorage.removeItem('inventory_current_user');
    localStorage.removeItem('adminAuth');
    
    // Then clear state
    setCurrentUser(null);
    
    // Finally, clear from storage
    storage.setCurrentUser(null);
    
    toast.success(t('auth.logoutSuccess'));
  };

  const isAdmin = () => {
    // First check localStorage for admin status
    if (localStorage.getItem('adminAuth') === 'true') {
      return true;
    }
    
    // Then check current user
    if (currentUser?.role === 'admin') {
      return true;
    }
    
    // Finally check localStorage for user data
    const userJson = localStorage.getItem('inventory_current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user.role === 'admin';
      } catch (e) {
        console.error("Failed to parse user data in isAdmin:", e);
      }
    }
    
    return false;
  };

  const isAuthorized = (requiredRole: 'admin' | 'manager' | 'viewer'): boolean => {
    // First check admin override
    if (requiredRole === 'admin' && localStorage.getItem('adminAuth') === 'true') {
      return true;
    }
    
    // Get user from localStorage if not in state
    let userToCheck = currentUser;
    
    if (!userToCheck) {
      const userJson = localStorage.getItem('inventory_current_user');
      if (userJson) {
        try {
          userToCheck = JSON.parse(userJson);
        } catch (e) {
          console.error("Failed to parse user data in isAuthorized:", e);
        }
      }
    }
    
    if (!userToCheck) return false;
    
    // Check authorization based on role
    if (userToCheck.role === 'admin') return true;
    if (userToCheck.role === 'manager' && requiredRole !== 'admin') return true;
    if (userToCheck.role === 'viewer' && requiredRole === 'viewer') return true;
    
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
