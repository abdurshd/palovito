import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = "flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors";
  const activeLinkClass = "flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-semibold";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40
          ${isOpen ? 'w-64' : 'w-20'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen && <h1 className="text-xl font-bold">Restaurant</h1>}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/order"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ClipboardList size={20} />
              {isOpen && <span>New Order</span>}
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 