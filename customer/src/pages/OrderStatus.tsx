import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WebSocketService } from '../services/websocketService';
import { orderService } from '../services/orderService';
import { useToast } from "../hooks/use-toast";
import { Clock, CookingPot, CheckCircle2, XCircle } from 'lucide-react';
import type { Order } from '../types/Order';

export function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const wsService = new WebSocketService();
    let mounted = true;

    const initialize = async () => {
      try {
        // First fetch the order
        const data = await orderService.getOrder(orderId);
        if (mounted) {
          setOrder(data);
        }

        // Then connect to WebSocket
        await wsService.connect('/topic/orders/update', (message) => {
          if (mounted && message.id === orderId) {
            setOrder(message);
            setWsConnected(true);
            
            if (message.status === 'COMPLETED') {
              toast({
                title: 'Order Ready!',
                description: 'Your order is ready for pickup.',
              });
            } else if (message.status === 'CANCELLED') {
              toast({
                title: 'Order Cancelled',
                description: 'Your order has been cancelled.',
                variant: 'destructive',
              });
            }
          }
        });
      } catch (error) {
        console.error('Error:', error);
        if (mounted) {
          toast({
            title: 'Error',
            description: 'Failed to load order details',
            variant: 'destructive',
          });
          navigate('/');
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      wsService.disconnect();
    };
  }, [orderId, toast, navigate]);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading order details...</div>
      </div>
    );
  }

  const statusSteps = [
    { status: 'RECEIVED', icon: Clock, label: 'Order Received', color: 'text-blue-500' },
    { status: 'PROCESSING', icon: CookingPot, label: 'Preparing', color: 'text-yellow-500' },
    { status: 'COMPLETED', icon: CheckCircle2, label: 'Ready for Pickup', color: 'text-green-500' },
    { status: 'CANCELLED', icon: XCircle, label: 'Cancelled', color: 'text-red-500' }
  ];

  const currentStep = statusSteps?.find(step => step?.status === order?.status);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold">{order?.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold">${order?.total?.toFixed(2)}</p>
          </div>
        </div>

        <div className={`flex flex-col items-center p-8 ${currentStep?.color}`}>
          {currentStep && (
            <>
              <currentStep.icon size={48} />
              <p className="text-lg font-semibold mt-4">{currentStep.label}</p>
            </>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
            {order?.items?.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <span>{item?.menu?.name} x {item?.quantity}</span>
              <span>${(item?.menu?.price * item?.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 