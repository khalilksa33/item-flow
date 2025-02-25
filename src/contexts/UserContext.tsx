
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/inventory';
import { storage } from '@/lib/storage';

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

  useEffect(() => {
    // Check for stored user session
    const storedUser = storage.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = storage.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Update last login time
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
      };
      storage.updateUser(updatedUser);
      storage.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isAuthorized = (requiredRole: 'admin' | 'manager' | 'viewer'): boolean => {
    if (!currentUser) return false;
    
    // Simple role hierarchy: admin > manager > viewer
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
