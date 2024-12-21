import axios from 'axios';
import type { Category } from '../types/Menu';

const API_URL = 'http://localhost:8080/api';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axios.get(`${API_URL}/category`);
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await axios.get(`${API_URL}/category/${id}`);
    return response.data;
  }
}; 