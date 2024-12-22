import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import type { Order } from '../types/Order';
import { useState } from "react";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuantityUpdate: (orderId: string, itemId: string, quantity: number) => Promise<void>;
}

export function OrderDetailsDialog({ 
  order, 
  open, 
  onOpenChange,
  onQuantityUpdate 
}: OrderDetailsDialogProps) {
  const [editingItem, setEditingItem] = useState<{itemId: string, quantity: number} | null>(null);

  if (!order) return null;

  const handleQuantityUpdate = async (itemId: string) => {
    if (!editingItem) return;
    
    await onQuantityUpdate(order.id, itemId, editingItem.quantity);
    setEditingItem(null);
  };

  const canEditQuantity = (status: Order['status']) => {
    return status !== 'COMPLETED' && status !== 'CANCELLED';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{new Date(order.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.menu.id}>
                    <td className="px-4 py-2">
                      <div>
                        <p className="font-medium">{item.menu.name}</p>
                        <p className="text-sm text-gray-500">{item.menu.category.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {canEditQuantity(order.status) && editingItem?.itemId === item.menu.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={editingItem.quantity}
                            onChange={(e) => setEditingItem({ 
                              itemId: item.menu.id, 
                              quantity: parseInt(e.target.value) || 1 
                            })}
                            className="w-20 px-2 py-1 border rounded"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.menu.id)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{item.quantity}</span>
                          {canEditQuantity(order.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem({ 
                                itemId: item.menu.id, 
                                quantity: item.quantity 
                              })}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">${item.menu.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">
                      ${(item.menu.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">Total</td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 