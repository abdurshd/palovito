interface MenuItem {
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

interface OrderItem {
  menu: MenuItem;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
  total: number;
}

export type { Order, OrderItem, MenuItem }; 