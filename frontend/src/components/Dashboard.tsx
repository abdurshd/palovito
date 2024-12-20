import { useEffect, useState } from 'react';
import { SocketService } from '../services/socketService';
import type { Order } from '../types/Order';

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketService = new SocketService();

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
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div>
      {!connected && (
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
          Connecting to server...
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.foodName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 