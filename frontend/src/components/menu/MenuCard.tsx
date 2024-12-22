import { Button } from '../ui/button';
import { Clock, Flame, Pencil, Trash2 } from 'lucide-react';
import type { Menu } from '../../types/Menu';

interface MenuCardProps {
  menu: Menu;
  onEdit?: (menu: Menu) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export function MenuCard({ menu, onEdit, onDelete, isAdmin = false }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {menu.imageUrl && (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            className="w-full h-48 object-cover"
          />
        )}
        {menu.bestSeller && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            <p className="text-sm text-gray-600">{menu.category.name}</p>
            <p className="text-gray-600 mt-1">{menu.description}</p>
            <p className="text-lg font-bold mt-2">${menu.price}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                onClick={() => onEdit?.(menu)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
                onClick={() => onDelete?.(menu.id)}
                aria-label="Delete menu item"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{menu.preparationTime} min</span>
          </div>
          {menu.spicyLevel > 0 && (
            <div className="flex items-center gap-1">
              <Flame size={16} className="text-red-500" />
              <span>{Array(menu.spicyLevel).fill('🌶️').join('')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 