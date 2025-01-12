import { useState, useEffect } from 'react';
import { MenuCard } from '../components/menu/MenuCard';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import { useToast } from "../hooks/use-toast"
import type { Menu, Category } from '../types/Menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export function MenuPage() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  const menusByCategory = categories?.reduce((acc, category) => {
    acc[category?.id] = menus?.filter(menu => menu?.category?.id === category?.id);
    return acc;
  }, {} as Record<string, Menu[]>);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
      
      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <TabsList className="mb-8">
          {categories?.map(category => (
            <TabsTrigger key={category?.id} value={category?.id}>
              {category?.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories?.map(category => (
          <TabsContent key={category?.id} value={category?.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menusByCategory[category?.id]?.map(menu => (
                <MenuCard key={menu?.id} menu={menu} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 