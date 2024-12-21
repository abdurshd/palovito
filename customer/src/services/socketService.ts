import { Client } from '@stomp/stompjs';
import type { Order } from '../types/Order';

export class SocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(
    orderId: string,
    onOrderUpdate: (order: Order) => void,
    onConnect?: () => void
  ) {
    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      
      // Subscribe to order updates
      this.client.subscribe(`/topic/orders/${orderId}`, (message) => {
        const order = JSON.parse(message.body);
        onOrderUpdate(order);
      });

      if (onConnect) {
        onConnect();
      }
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client.connected) {
      this.client.deactivate();
    }
  }
} 