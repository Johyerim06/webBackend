import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: { name: string; email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const userData = await authService.login(credentials);
    setUser(userData.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signup = async (userData: { name: string; email: string; password: string }) => {
    const response = await authService.signup(userData);
    if (response.user) {
      setUser(response.user);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    signup,
  };
};
