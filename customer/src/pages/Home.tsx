import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to RGT Restaurant</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Experience the finest dining with our carefully curated menu. Order online for pickup or delivery.
      </p>
      
      <div className="flex justify-center gap-4">
        <Button 
          size="lg"
          onClick={() => navigate('/menu')}
          className="gap-2"
        >
          View Menu
          <ArrowRight size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Easy Ordering</h3>
          <p className="text-gray-600">Browse our menu and order with just a few clicks</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Track Orders</h3>
          <p className="text-gray-600">Real-time updates on your order status</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Order History</h3>
          <p className="text-gray-600">View your past orders and track your order history</p>
        </div>
      </div>
    </div>
  );
} 