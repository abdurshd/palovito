import { io, Socket } from 'socket.io-client';
import type { Order } from '../types/Order';

export class SocketService {
  private socket: Socket | null = null;
  private connectHandler: (() => void) | null = null;
  private disconnectHandler: (() => void) | null = null;

  connect(onNewOrder: (order: Order) => void, onUpdateOrder: (order: Order) => void) {
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.connectHandler?.();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.disconnectHandler?.();
    });

    this.socket.on('newOrder', onNewOrder);
    this.socket.on('updateOrder', onUpdateOrder);
  }

  onConnect(handler: () => void) {
    this.connectHandler = handler;
    // If already connected, call handler immediately
    if (this.socket?.connected) {
      handler();
    }
  }

  onDisconnect(handler: () => void) {
    this.disconnectHandler = handler;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectHandler = null;
    this.disconnectHandler = null;
  }
} 