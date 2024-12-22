import { Client } from '@stomp/stompjs';
import type { Order } from '../types/Order';

export class SocketService {
  private client: Client | null = null;

  connect(
    onNewOrder: (order: Order) => void, 
    onUpdateOrder: (order: Order) => void,
    onDeleteOrder: (orderId: string) => void,
    onConnect?: () => void
  ) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        onConnect?.();
        if (this.client) {
          this.client.subscribe('/topic/orders', message => {
            onNewOrder(JSON.parse(message.body));
          });
          this.client.subscribe('/topic/orders/update', message => {
            onUpdateOrder(JSON.parse(message.body));
          });
          this.client.subscribe('/topic/orders/delete', message => {
            onDeleteOrder(JSON.parse(message.body));
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
    this.client = null;
  }
}