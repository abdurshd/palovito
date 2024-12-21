import axios from 'axios';
import type { Order, OrderRequest } from '../types/Order';

const API_URL = 'http://localhost:8080/api';

export const orderService = {
  createOrder: async (orderData: OrderRequest): Promise<Order> => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  },

  getCustomerOrders: async (): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/orders/customer`);
    return response.data;
  }
}; 