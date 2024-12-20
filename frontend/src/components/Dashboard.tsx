import { useEffect, useState } from 'react';
import { SocketService } from '../services/socketService';
import { orderService } from '../services/orderService';
import type { Order } from '../types/Order';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function Dashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingQuantity, setEditingQuantity] = useState<{id: string, quantity: number} | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null);

  useEffect(() => {
    const socketService = new SocketService();

    const handleConnect = () => {
      setConnected(true);
    };

    socketService.connect(
      (newOrder) => {
        setOrders(prev => [...prev, newOrder]);
      },
      (updatedOrder) => {
        setOrders(prev => 
          prev.map(order => 
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      },
      (deletedOrderId) => {
        setOrders(prev => prev.filter(order => order.id !== deletedOrderId));
      },
      handleConnect
    );

    const fetchOrders = async () => {
      try {
        const existingOrders = await orderService.getAllOrders();
        setOrders(existingOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      socketService.disconnect();
      setConnected(false);
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to update order status. Please try again."
      });
      console.error('Failed to update order status:', error);
    }
  };

  const handleQuantityUpdate = async (orderId: string, newQuantity: number) => {
    try {
      await orderService.updateOrderQuantity(orderId, newQuantity);
      setEditingQuantity(null);
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to update order quantity. Please try again."
      });
      console.error('Failed to update quantity:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      setOrderToCancel(null);
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to cancel order. Please try again."
      });
      console.error('Failed to cancel order:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">
      <div className="text-gray-600">Loading orders...</div>
    </div>;
  }

  const thClass = (width: string) => `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[${width}]`;

  const tdClass =  'px-6 py-4 whitespace-nowrap text-sm text-gray-900';

  const orderStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="w-full">
      {!connected && (
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
          Connecting to server...
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600 p-8">
          No orders yet
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto">
            <thead className="bg-blue-200">
              <tr>
                <th className={thClass('150px')}>Order ID</th>
                <th className={thClass('200px')}>Food Name</th>
                <th className={thClass('100px')}>Quantity</th>
                <th className={thClass('150px')}>Status</th>
                <th className={thClass('150px')}>Actions</th>
                <th className={thClass('200px')}>Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className={tdClass}>{order.id}</td>
                  <td className={tdClass}>{order.foodName}</td>
                  <td className={tdClass}>
                    {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && editingQuantity?.id === order.id ? (
                      <input
                        type="number"
                        min="1"
                        value={editingQuantity.quantity}
                        onChange={(e) => setEditingQuantity({ id: order.id, quantity: parseInt(e.target.value) })}
                        onBlur={() => handleQuantityUpdate(order.id, editingQuantity.quantity)}
                        className="w-20 px-2 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <span>{order.quantity}</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <span className={`px-2 py-1 text-sm rounded-full ${orderStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      {order.status === 'PROCESSING' && (
                        <Button
                          variant="ghost"
                          className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          onClick={() => setOrderToComplete(order.id)}
                        >
                          Complete
                        </Button>
                      )}
                      {(order.status === 'RECEIVED' || order.status === 'PROCESSING') && (
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => setOrderToCancel(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className={tdClass}>{new Date(order.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AlertDialog open={!!orderToCancel} onOpenChange={() => setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToCancel(null)}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => orderToCancel && handleCancelOrder(orderToCancel)}
            >
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!orderToComplete} onOpenChange={() => setOrderToComplete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToComplete(null)}>
              No, not yet
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => orderToComplete && handleStatusUpdate(orderToComplete, 'COMPLETED')}
            >
              Yes, complete order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 