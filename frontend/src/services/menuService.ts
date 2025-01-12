import type { Menu } from '../types/Menu';
import { api } from './api';

export const menuService = {
  createMenu: async (menuData: Omit<Menu, 'id'>): Promise<Menu> => {
    const response = await api.post('/menu', menuData);
    return response?.data;
  },

  getAllMenus: async (): Promise<Menu[]> => {
    const response = await api.get('/menu');
    return response?.data;
  },

  getMenusByCategory: async (categoryId: string): Promise<Menu[]> => {
    const response = await api.get(`/menu/category/${categoryId}`);
    return response?.data;
  },

  updateMenu: async (id: string, menuData: Omit<Menu, 'id'>): Promise<Menu> => {
    const response = await api.put(`/menu/${id}`, menuData);
    return response?.data;
  },

  deleteMenu: async (id: string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  }
}; 