import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 저장된 사용자 정보 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (userData: { name: string; email: string; password: string }) => {
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 로그아웃 API 호출이 실패해도 로컬 상태는 초기화
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
