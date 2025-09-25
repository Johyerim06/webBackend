import api from './api';
import { User } from '../types';

export const authService = {
  // 로그인
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // 회원가입
  signup: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 비밀번호 재설정
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
};
