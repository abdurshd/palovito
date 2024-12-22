import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { menuService } from '../services/menuService';
import type { Menu } from '../types/Menu';
import { Select } from '../components/ui/select';
import { useToast } from '../hooks/useToast';

export function OrderForm() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await menuService.getAllMenus();
        setMenuItems(items.filter(item => item.isAvailable));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch menu items',
          variant: 'error'
        });
      }
    };
    fetchMenuItems();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      toast({
        title: 'Error',
        description: 'Please select a menu item',
        variant: 'error'
      });
      return;
    }

    setLoading(true);
    const selectedItem = menuItems.find(item => item.id === selectedItemId);

    try {
      await orderService.createOrder(selectedItem!.name, quantity);
      setSelectedItemId('');
      setQuantity(1);
      toast({
        title: 'Success',
        description: 'Order received successfully!',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Menu Item</label>
        <Select
          value={selectedItemId}
          onValueChange={setSelectedItemId}
          required
        >
          <option value="">Select a menu item</option>
          {menuItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} - ${item.price}
            </option>
          ))}
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          min="1"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          required
          disabled={loading}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}