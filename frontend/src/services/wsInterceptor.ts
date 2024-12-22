import { Client, IFrame } from '@stomp/stompjs';

export class WebSocketInterceptor {
  private static instance: WebSocketInterceptor;
  private dispatch: any;

  private constructor() {}

  static getInstance(): WebSocketInterceptor {
    if (!WebSocketInterceptor.instance) {
      WebSocketInterceptor.instance = new WebSocketInterceptor();
    }
    return WebSocketInterceptor.instance;
  }

  setDispatch(dispatch: any) {
    this.dispatch = dispatch;
  }

  interceptClient(client: Client): Client {
    const originalActivate = client.activate.bind(client);
    const originalDeactivate = client.deactivate.bind(client);

    client.activate = () => {
      this.dispatch({ type: 'SET_LOADING', payload: true });
      return originalActivate();
    };

    client.deactivate = () => {
      this.dispatch({ type: 'SET_LOADING', payload: false });
      return originalDeactivate();
    };

    client.onStompError = (frame: IFrame) => {
      this.dispatch({ type: 'SET_ERROR', payload: frame.body });
      this.dispatch({ type: 'SET_LOADING', payload: false });
    };

    return client;
  }
} 