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
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response = await axios.get(`${API_URL}/order`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await axios.patch(`${API_URL}/order/${orderId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update order status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update order status');
    }
  },

  updateOrderQuantity: async (orderId: string, quantity: number): Promise<Order> => {
    try {
      const response = await axios.patch(`${API_URL}/order/${orderId}/quantity`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update order quantity');
    }
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    try {
      const response = await axios.patch(`${API_URL}/order/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to cancel order');
    }
  },

  updateItemQuantity: async (orderId: string, itemId: string, quantity: number): Promise<Order> => {
    try {
      const response = await axios.patch(`${API_URL}/order/${orderId}/items/${itemId}/quantity`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update item quantity');
    }
  }
}; 