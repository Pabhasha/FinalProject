
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Admin credentials (in a real app, this would be handled by a backend)
const ADMIN_EMAIL = 'admin@footballtrackr.com';
const ADMIN_PASSWORD = 'admin123';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminToken, setAdminToken] = useLocalStorage<string | null>('footballtrackr-admin-token', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!adminToken);

  useEffect(() => {
    setIsAuthenticated(!!adminToken);
  }, [adminToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple hardcoded authentication (replace with real auth in production)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = btoa(email + ':' + new Date().getTime());
      setAdminToken(token);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAdminToken(null);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
