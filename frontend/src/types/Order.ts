interface Order {
  id: string;
  foodName: string;
  quantity: number;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED';
  timestamp: string;
}

export type { Order }; 