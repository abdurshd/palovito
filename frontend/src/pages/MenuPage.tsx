import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import type { Menu, Category } from '../types/Menu';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { MenuAddForm } from '../components/menu/MenuAddForm';
import { MenuEditForm } from '../components/menu/MenuEditForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Select } from '../components/ui/select';

export function MenuPage() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const [menuToEdit, setMenuToEdit] = useState<Menu | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

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
        description: 'Failed to fetch data',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async (menuData: Omit<Menu, 'id'>) => {
    try {
      await menuService.createMenu(menuData);
      await fetchData();
      setIsAddingMenu(false);
      toast({
        title: 'Success',
        description: 'Menu item created successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create menu item',
        variant: 'error'
      });
    }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      await menuService.deleteMenu(id);
      setMenus(prev => prev.filter(menu => menu.id !== id));
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'error'
      });
    } finally {
      setMenuToDelete(null);
    }
  };

  const handleEditMenu = async (id: string, menuData: Omit<Menu, 'id'>) => {
    try {
      await menuService.updateMenu(id, menuData);
      await fetchData();
      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update menu item',
        variant: 'error'
      });
    }
  };

  const filteredMenus = selectedCategory
    ? menus.filter(menu => menu.category.id === selectedCategory)
    : menus;

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col h-[calc(100vh-theme(spacing.32))]">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <Button
            onClick={() => setIsAddingMenu(true)}
            className="w-full py-8 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Menu Item
          </Button>
        </div>

        <div className="mb-4">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex-1 overflow-auto">
          {menus.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">No menu items yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding a new menu item above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMenus.map(menu => (
                <div key={menu.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {menu.imageUrl && (
                        <img
                          src={menu.imageUrl}
                          alt={menu.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{menu.name}</h3>
                        <p className="text-sm text-gray-600">{menu.category.name}</p>
                        <p className="text-gray-600 mt-1">{menu.description}</p>
                        <p className="text-lg font-bold mt-2">${menu.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => setMenuToEdit(menu)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => setMenuToDelete(menu.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MenuAddForm
        open={isAddingMenu}
        onOpenChange={setIsAddingMenu}
        onSave={handleAddMenu}
        categories={categories}
      />

      <MenuEditForm
        menu={menuToEdit}
        open={!!menuToEdit}
        onOpenChange={(open) => !open && setMenuToEdit(null)}
        onSave={handleEditMenu}
        categories={categories}
      />

      <AlertDialog open={!!menuToDelete} onOpenChange={() => setMenuToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => menuToDelete && handleDeleteMenu(menuToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 