import { api } from './api';
import { LoginCredentials, SignupData, AuthResponse, User } from '../types/user';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
