import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { authApi } from '@/lib/api';
import { seedData } from '@/lib/seed';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Seed data on first load
    seedData();

    // Check for existing session
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      setState({
        user: currentUser,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = authApi.login(username, password);
    if (user) {
      setState({
        user,
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    authApi.logout();
    setState({
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
