import { useState } from 'react';
import { Button } from '../ui/button';
import { useCart } from '../../hooks/useCart';
import type { Menu } from '../../types/Menu';
import { Minus, Plus } from 'lucide-react';

interface MenuCardProps {
  menu: Menu;
}

export function MenuCard({ menu }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      menuItem: menu,
      quantity,
    });
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={menu.imageUrl} 
        alt={menu.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{menu.name}</h3>
          <span className="text-green-600 font-semibold">${menu.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{menu.description}</p>
        
        {menu.isAvailable ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </Button>
            </div>
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        ) : (
          <span className="text-red-500">Currently Unavailable</span>
        )}
      </div>
    </div>
  );
} 