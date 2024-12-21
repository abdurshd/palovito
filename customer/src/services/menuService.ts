import axios from 'axios';
import type { Menu } from '../types/Menu';

const API_URL = 'http://localhost:8080/api';

export const menuService = {
  getAllMenus: async (): Promise<Menu[]> => {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
  },

  getMenusByCategory: async (categoryId: string): Promise<Menu[]> => {
    const response = await axios.get(`${API_URL}/menu/category/${categoryId}`);
    return response.data;
  },

  getMenu: async (id: string): Promise<Menu> => {
    const response = await axios.get(`${API_URL}/menu/${id}`);
    return response.data;
  }
}; 