import { Link } from 'react-router-dom';
import { Cart } from '../cart/Cart';
import { Home, Menu, History } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-xl text-gray-900">
              RGT Restaurant
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
                <Home size={18} className="mr-1" />
                Home
              </Link>
              <Link to="/menu" className="flex items-center text-gray-700 hover:text-gray-900">
                <Menu size={18} className="mr-1" />
                Menu
              </Link>
              <Link to="/orders" className="flex items-center text-gray-700 hover:text-gray-900">
                <History size={18} className="mr-1" />
                Orders
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Cart />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} RGT Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 