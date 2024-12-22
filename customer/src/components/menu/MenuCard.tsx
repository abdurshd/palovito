import { useState } from 'react';
import { Button } from '../ui/button';
import { useCart } from '../../hooks/useCart';
import type { Menu } from '../../types/Menu';
import { Minus, Plus, Clock, Flame, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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

  const renderSpicyLevel = () => {
    return Array(menu.spicyLevel).fill('🌶️').join('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={menu.imageUrl} 
          alt={menu.name}
          className="w-full h-48 object-cover"
        />
        {menu.bestSeller && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            <p className="text-sm text-gray-600">{menu.category.name}</p>
          </div>
          <span className="text-green-600 font-semibold">${menu.price}</span>
        </div>

        <p className="text-gray-600 text-sm">{menu.description}</p>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{menu.preparationTime} min</span>
          </div>
          {menu.spicyLevel > 0 && (
            <div className="flex items-center gap-1">
              <Flame size={16} className="text-red-500" />
              <span>{renderSpicyLevel()}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {menu.allergens && menu.allergens.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-amber-600 cursor-help">
                    <Info size={16} />
                    <span>Contains allergens</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Allergens: {menu.allergens.join(', ')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
            <div>Calories: {menu.nutritionalInfo?.calories}</div>
            <div>Protein: {menu.nutritionalInfo?.protein}g</div>
            <div>Carbs: {menu.nutritionalInfo?.carbs}g</div>
            <div>Fats: {menu.nutritionalInfo?.fats}g</div>
          </div>
        </div>
        
        {menu.available ? (
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