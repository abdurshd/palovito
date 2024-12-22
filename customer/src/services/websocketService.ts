import { Client } from '@stomp/stompjs';

export class WebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  async connect(topic: string, onMessage: (data: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.onConnect = () => {
        console.log('Connected to WebSocket');
        
        // Subscribe to both topics
        this.client.subscribe('/topic/orders', (message) => {
          const data = JSON.parse(message.body);
          onMessage(data);
        });
        
        this.client.subscribe('/topic/orders/update', (message) => {
          const data = JSON.parse(message.body);
          onMessage(data);
        });
        
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        reject(new Error('Failed to connect to WebSocket'));
      };

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client.connected) {
      this.client.deactivate();
    }
  }
} 