import axios from 'axios';
import type { Category } from '../types/Menu';

const API_URL = 'http://localhost:8080/api';

export const categoryService = {
  createCategory: async (name: string, description?: string): Promise<Category> => {
    try {
      const response = await axios.post(`${API_URL}/category`, {
        name,
        description
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create category');
    }
  },

  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_URL}/category`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/category/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error('Cannot delete category with existing menu items');
      }
      throw new Error('Failed to delete category');
    }
  },

  updateCategory: async (id: string, name: string, description?: string): Promise<Category> => {
    try {
      const response = await axios.put(`${API_URL}/category/${id}`, {
        name,
        description
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update category');
    }
  }
}; 