import { useState } from 'react';
import { orderService } from '../services/orderService';
import { Toast, ToastTitle, ToastDescription, ToastClose } from './ui/toast';

export function OrderForm() {
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'success' });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        await orderService.createOrder(foodName, quantity);
        setFoodName('');
        setQuantity(1);
        setToastMessage({
          title: 'Success',
          description: 'Order received successfully!',
          type: 'success'
        });
      } catch (err) {
        setToastMessage({
          title: 'Error',
          description: 'Failed to place order. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
        setShowToast(true);
      }
    };
  
    return (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {showToast && (
            <Toast
              variant={toastMessage.type === 'error' ? 'error' : 'success'}
              onOpenChange={setShowToast}
            >
              <div className="flex flex-col gap-1">
                <ToastTitle>{toastMessage.title}</ToastTitle>
                <ToastDescription>{toastMessage.description}</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )}
        </>
    );
  }