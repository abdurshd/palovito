import { useState } from 'react';
import { orderService } from '../services/orderService';

export function OrderForm() {
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      try {
        await orderService.createOrder(foodName, quantity);
        setFoodName('');
        setQuantity(1);
        alert('Order received successfully!');
      } catch (err) {
        setError('Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Food Name</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            required
            disabled={loading}
          />
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