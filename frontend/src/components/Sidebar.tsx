import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronLeft, LayoutDashboard, UtensilsCrossed, ListPlus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const linkClass = `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
    isOpen ? 'justify-start' : 'justify-center'
  }`;
  
  const activeLinkClass = `flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 ${
    isOpen ? 'justify-start' : 'justify-center'
  }`;

  const mobileMenuClass = `fixed inset-0 bg-white z-50 transform transition-transform duration-200 ease-in-out ${
    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
  }`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-100 md:hidden z-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Mobile Menu */}
      <div className={mobileMenuClass}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/categories" 
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ListPlus size={20} />
              <span>Categories</span>
            </NavLink>
            <NavLink
              to="/menuItems"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UtensilsCrossed size={20} />
              <span>Menu Items</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-200 hidden md:block ${
        isOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            {isOpen && <h1 className="text-xl font-bold">Palovito Restaurant</h1>}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className={`transform transition-transform ${isOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <LayoutDashboard size={20} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
            <NavLink 
              to="/categories" 
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <ListPlus size={20} />
              {isOpen && <span>Categories</span>}
            </NavLink>
            <NavLink
              to="/menuItems"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <UtensilsCrossed size={20} />
              {isOpen && <span>Menu Items</span>}
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
} 