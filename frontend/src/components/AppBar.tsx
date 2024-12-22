import { useLocation } from 'react-router-dom';

export function AppBar() {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/menuItems':
        return 'Menu Items';
      case '/categories':
        return 'Categories';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="bg-white border-b px-4 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
          {getPageTitle(location.pathname)}
        </h1>
      </div>
    </div>
  );
} 