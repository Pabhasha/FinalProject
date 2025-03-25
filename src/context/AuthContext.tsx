
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Team } from '@/utils/teamData';

export interface User {
  id: string;
  username: string;
  email: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('footballtrackr-user', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

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
      id: crypto.randomUUID(), // generate a random ID
      username,
      email,
      favoriteTeamId,
      createdAt: new Date().toISOString(),
    };
    
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser }}>
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
