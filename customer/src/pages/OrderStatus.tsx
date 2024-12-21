import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Client } from '@stomp/stompjs';
import { useToast } from "../hooks/use-toast"
import { CheckCircle2, Clock, CookingPot, Truck } from 'lucide-react';

interface OrderStatus {
  id: string;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  items: Array<{
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        client.subscribe(`/topic/orders/${orderId}`, (message) => {
          const updatedOrder = JSON.parse(message.body);
          setOrder(updatedOrder);
          
          if (updatedOrder.status === 'COMPLETED') {
            toast({
              title: 'Order Completed',
              description: 'Your order has been delivered!',
              variant: 'default',
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId!);
        setOrder(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch order details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      client.deactivate();
    };
  }, [orderId, toast]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  const statusSteps = [
    { status: 'RECEIVED', icon: Clock, label: 'Order Received' },
    { status: 'PROCESSING', icon: CookingPot, label: 'Preparing' },
    { status: 'COMPLETED', icon: Truck, label: 'Out for Delivery' },
    { status: 'DELIVERED', icon: CheckCircle2, label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
          <div className="relative z-10 flex justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="text-sm mt-2">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Delivery Details</h3>
            <p className="text-sm">{order.customerInfo.name}</p>
            <p className="text-sm">{order.customerInfo.phone}</p>
            <p className="text-sm">{order.customerInfo.address}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>
                  {item.menuItem.name} x {item.quantity}
                </span>
                <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {order.estimatedDeliveryTime && (
            <div className="text-center mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">
                Estimated delivery time: {order.estimatedDeliveryTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 