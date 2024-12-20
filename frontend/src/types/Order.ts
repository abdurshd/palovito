interface Order {
  id: string;
  foodName: string;
  quantity: number;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
}

export type { Order }; 