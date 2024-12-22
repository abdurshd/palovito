export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
    description: string;
  };
  imageUrl: string;
  available: boolean;
}

export interface OrderItem {
  menu: MenuItem;
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