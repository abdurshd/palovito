import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import type { Menu, Category } from '../types/Menu';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Select } from './ui/select';

export function MenuList() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, categoryData] = await Promise.all([
          menuService.getAllMenus(),
          categoryService.getAllCategories()
        ]);
        setMenus(menuData);
        setCategories(categoryData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch menu data',
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const filteredMenus = selectedCategory
    ? menus.filter(menu => menu.category.id === selectedCategory)
    : menus;

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-48"
          {...({} as any)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map(menu => (
          <div key={menu.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {menu.imageUrl && (
              <img 
                src={menu.imageUrl} 
                alt={menu.name} 
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{menu.name}</h3>
                <p className="text-sm text-gray-600">{menu.category.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${menu.price}</p>
                {menu.isBestSeller && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600">{menu.description}</p>
            {menu.preparationTime && (
              <p className="text-sm text-gray-500">
                Prep time: {menu.preparationTime} mins
              </p>
            )}
            {typeof menu.spicyLevel === 'number' && menu.spicyLevel > 0 && (
              <p className="text-sm text-red-600">
                Spicy Level: {'🌶️'.repeat(menu.spicyLevel || 0)}
              </p>
            )}
            {menu.allergens && menu.allergens.length > 0 && (
              <p className="text-sm text-gray-500">
                Allergens: {menu.allergens.join(', ')}
              </p>
            )}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className={menu.isAvailable ? 'text-green-600' : 'text-red-600'}
              >
                {menu.isAvailable ? 'Available' : 'Unavailable'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 