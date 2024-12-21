import { Client } from '@stomp/stompjs';

export class WebSocketService {
  private client: Client;
  private subscriptions: { [key: string]: () => void } = {};

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(topic: string, onMessage: (message: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.onConnect = () => {
        console.log('WebSocket connected');
        const subscription = this.client.subscribe(topic, (message) => {
          onMessage(JSON.parse(message.body));
        });
        
        this.subscriptions[topic] = () => subscription.unsubscribe();
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
    Object.values(this.subscriptions).forEach(unsubscribe => unsubscribe());
    this.subscriptions = {};
    if (this.client.active) {
      this.client.deactivate();
    }
  }
} 