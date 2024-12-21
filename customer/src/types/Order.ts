export interface OrderItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
  total: number;
}

export interface OrderRequest {
  items: {
    menuId: string;
    quantity: number;
  }[];
} 