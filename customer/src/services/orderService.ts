import axios from 'axios';
import type { Order, OrderRequest } from '../types/Order';

const API_URL = 'http://localhost:8080/api';

export const orderService = {
  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await axios.post(`${API_URL}/order`, orderRequest);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/order`);
    return response.data;
  }
}; 