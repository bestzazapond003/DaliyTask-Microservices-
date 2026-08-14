import type { User, RegisterUserDto } from '../type';
import { apiClient } from './api';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<any, any>('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user?.id) {
        localStorage.setItem('current_user_id', response.user.id);
      }
    }
    return response;
  },

  register: async (dto: RegisterUserDto): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<any, any>('/auth/register', dto);
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user?.id) {
        localStorage.setItem('current_user_id', response.user.id);
      }
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user_id');
  },
};

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[], User[]>('/users');
    return response || [];
  },

  getCurrentUser: async (): Promise<User> => {
    return await apiClient.get<User, User>('/users/me');
  },

  register: async (dto: RegisterUserDto): Promise<User> => {
    const res = await authService.register(dto);
    return res.user;
  },
};
