import { Link } from 'react-router-dom';
import { Cart } from '../cart/Cart';
import { Home, Menu, History, AlignJustify } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/menu", icon: Menu, label: "Menu" },
    { to: "/orders", icon: History, label: "Orders" },
  ];

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900">
                    <AlignJustify size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h2 className="font-bold text-lg">Menu</h2>
                    </div>
                    <nav className="flex-1 p-4">
                      {navLinks.map(({ to, icon: Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon size={20} />
                          {label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <Link to="/" className="font-bold text-xl text-gray-900 ml-2 md:ml-0">
              Palovito Restaurant
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <Icon size={18} className="mr-1" />
                  {label}
                </Link>
              ))}
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
            © {new Date().getFullYear()} Palovito Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 