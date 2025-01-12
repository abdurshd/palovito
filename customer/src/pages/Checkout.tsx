import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { orderService } from '../services/orderService';
import { useToast } from "../hooks/use-toast"

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items?.length === 0) return;

    setLoading(true);
    try {
      const orderRequest = {
        items: items?.map(item => ({
          menuId: item?.menuItem?.id,
          quantity: item?.quantity
        }))
      };

      const order = await orderService.createOrder(orderRequest);
      clearCart();
      toast({
        title: 'Success',
        description: 'Your order has been placed successfully!',
        variant: 'success'
      });
      navigate(`/orders/${order.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items?.map((item) => (
          <div key={item?.menuItem?.id} className="flex justify-between py-2">
            <span>
              {item?.menuItem?.name} x {item?.quantity}
            </span>
            <span>${(item?.menuItem?.price * item?.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full" 
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </div>
  );
} 