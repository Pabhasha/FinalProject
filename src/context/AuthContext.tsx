
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Team } from '@/utils/teamData';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Add password field for authentication purposes
  avatar?: string;
  bio?: string;
  banner?: string;
  favoriteTeamId?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  register: (username: string, email: string, password: string, favoriteTeamId: string) => Promise<User>;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('footballtrackr-user', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);
  const [userCredentials, setUserCredentials] = useLocalStorage<{[email: string]: string}>('footballtrackr-credentials', {});

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (username: string, email: string, password: string, favoriteTeamId: string): Promise<User> => {
    // In a real app, this would be an API call to register the user
    const newUser: User = {
      id: crypto.randomUUID(), 
      username,
      email,
      favoriteTeamId,
      createdAt: new Date().toISOString(),
    };
    
    // Store password separately in a credentials store
    // In a real app, this would be handled securely on the server
    setUserCredentials({ ...userCredentials, [email]: password });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store the user in localStorage
    setUser(newUser);
    
    return newUser;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Verify current user is logged in
    if (!user || !user.email) return false;
    
    // Check if current password is correct
    if (userCredentials[user.email] !== currentPassword) {
      return false;
    }
    
    // Update password
    setUserCredentials({ 
      ...userCredentials, 
      [user.email]: newPassword 
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
