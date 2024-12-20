import axios from 'axios';
import type { Order } from '../types/Order';

const API_URL = 'http://localhost:8080/api';

export const orderService = {
  createOrder: async (foodName: string, quantity: number): Promise<Order> => {
    try {
      const response = await axios.post(`${API_URL}/order`, {
        foodName,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }
}; 