import axios from 'axios';
import type { Menu } from '../types/Menu';

const API_URL = 'http://localhost:8080/api';

export const menuService = {
  createMenu: async (menuData: Omit<Menu, 'id'>): Promise<Menu> => {
    try {
      const response = await axios.post(`${API_URL}/menu`, menuData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create menu item');
    }
  },

  getAllMenus: async (): Promise<Menu[]> => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch menu items');
    }
  },

  getMenusByCategory: async (categoryId: string): Promise<Menu[]> => {
    try {
      const response = await axios.get(`${API_URL}/menu/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch menu items by category');
    }
  }
}; 