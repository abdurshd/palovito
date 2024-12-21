import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { WebSocketService } from '../services/websocketService';
import { useToast } from "../hooks/use-toast"
import { Button } from "../components/ui/button"
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types/Order';

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const wsService = new WebSocketService();
    
    // Connect to WebSocket for real-time updates
    wsService.connect('all', (updatedOrder) => {
      setOrders(prevOrders => {
        const orderExists = prevOrders.some(order => order.id === updatedOrder.id);
        if (orderExists) {
          return prevOrders.map(order => 
            order.id === updatedOrder.id ? updatedOrder : order
          );
        }
        return [...prevOrders, updatedOrder];
      });
    });

    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch order history',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      wsService.disconnect();
    };
  }, [toast]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RECEIVED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{item.menuItem.name} x {item.quantity}</span>
                    <span className="text-gray-600">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">
                  Total: ${order.total.toFixed(2)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 