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
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { OrderDetailsDialog } from '../components/OrderDetailsDialog';

export function Dashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderToProcess, setOrderToProcess] = useState<Order | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const socketService = new SocketService();

    const handleConnect = () => {
      setConnected(true);
      // Show any pending orders that are still in RECEIVED state
      const pendingOrders = orders.filter(order => order.status === 'RECEIVED');
      if (pendingOrders.length > 0) {
        setOrderToProcess(pendingOrders[0]);
      }
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

  useEffect(() => {
    // Only show dialog if there isn't one already showing
    if (!orderToProcess) {
      // Find the first order in RECEIVED state
      const nextOrder = orders.find(order => order.status === 'RECEIVED');
      if (nextOrder) {
        setOrderToProcess(nextOrder);
      }
    }
  }, [orders]);

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

  const handleItemQuantityUpdate = async (orderId: string, itemId: string, quantity: number) => {
    try {
      await orderService.updateItemQuantity(orderId, itemId, quantity);
      toast({
        title: "Success",
        description: "Order quantity updated successfully",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to update order quantity. Please try again."
      });
      console.error('Failed to update quantity:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">
      <div className="text-gray-600">Loading orders...</div>
    </div>;
  }

  const thClass = (width: string, extraClass?: string) => `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center whitespace-nowrap ${width} ${extraClass}`;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th scope='col' className={thClass('150px')}>Order ID</th>
                <th scope='col' className={thClass('100px')}>Items</th>
                <th scope='col' className={thClass('100px')}>Total</th>
                <th scope='col' className={thClass('120px')}>Status</th>
                <th scope='col' className={thClass('150px')}>Actions</th>
                <th scope='col' className={thClass('120px')}>Details</th>
                <th scope='col' className={thClass('180px')}>Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className={tdClass}>{order.id}</td>
                  <td className={tdClass}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className={tdClass}>${order.total.toFixed(2)}</td>
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
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
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
      <AlertDialog open={!!orderToProcess} onOpenChange={() => setOrderToProcess(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Order Received</AlertDialogTitle>
            <AlertDialogDescription>
              Review the order details before accepting it for processing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Items</p>
              {orderToProcess?.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span>{item.menu.name} x {item.quantity}</span>
                  <span>${(item.menu.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-semibold">${orderToProcess?.total.toFixed(2)}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Reject
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => orderToProcess && handleStatusUpdate(orderToProcess.id, 'PROCESSING')}
            >
              Accept Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <OrderDetailsDialog 
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onQuantityUpdate={handleItemQuantityUpdate}
      />
    </div>
  );
} 