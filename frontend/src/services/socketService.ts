import { Client, Message } from '@stomp/stompjs';
import type { Order } from '../types/Order';

export class SocketService {
  private client: Client;
  private onOrderCallback!: (order: Order) => void;
  private onUpdateCallback!: (order: Order) => void;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str: string) => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });
  }

  connect(onOrder: (order: Order) => void, onUpdate: (order: Order) => void) {
    this.onOrderCallback = onOrder;
    this.onUpdateCallback = onUpdate;

    this.client.onConnect = () => {
      this.client.subscribe('/topic/orders', (message: Message) => {
        const order = JSON.parse(message.body);
        this.onOrderCallback(order);
      });

      this.client.subscribe('/topic/orders/update', (message: Message) => {
        const order = JSON.parse(message.body);
        this.onUpdateCallback(order);
      });
    };

    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }
} 