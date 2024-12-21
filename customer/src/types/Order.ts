export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  menuId: string;
  quantity: number;
}

export interface OrderRequest {
  customerInfo: CustomerInfo;
  items: OrderItem[];
}

export interface Order {
  id: string;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  items: Array<{
    menuItem: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  }>;
  customerInfo: CustomerInfo;
  total: number;
  createdAt: string;
  estimatedDeliveryTime?: string;
} 