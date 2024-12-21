import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { orderService } from '../services/orderService';
import { useToast } from "../hooks/use-toast"

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.createOrder({
        customerInfo: formData,
        items: items.map(item => ({
          menuId: item.menuItem.id,
          quantity: item.quantity
        }))
      });

      clearCart();
      toast({
        title: 'Success',
        description: 'Your order has been placed successfully!',
        variant: 'default'
      });
      navigate(`/order-status/${order.id}`);
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
        {items.map((item) => (
          <div key={item.menuItem.id} className="flex justify-between py-2">
            <span>
              {item.menuItem.name} x {item.quantity}
            </span>
            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <Textarea
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order Notes</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special instructions?"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
} 