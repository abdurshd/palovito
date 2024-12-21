import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/Menu';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CategoryAddForm } from '../components/category/CategoryAddForm';
import { CategoryEditForm } from '../components/category/CategoryEditForm';
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

export function CategoryPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name: string, description: string) => {
    try {
      await categoryService.createCategory(name, description);
      await fetchCategories();
      setIsAddingCategory(false);
      toast({
        title: 'Success',
        description: 'Category created successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'error',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'error',
      });
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleEditCategory = async (id: string, name: string, description: string) => {
    try {
      await categoryService.updateCategory(id, name, description);
      await fetchCategories();
      toast({
        title: 'Success',
        description: 'Category updated successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'error',
      });
    }
  };
  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col h-[calc(100vh-theme(spacing.32))]">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="w-full py-8 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Category
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">No categories yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding a new category above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categories.map(category => (
                <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => setCategoryToEdit(category)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => setCategoryToDelete(category.id)}
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

      <CategoryAddForm
        open={isAddingCategory}
        onOpenChange={setIsAddingCategory}
        onSave={handleAddCategory}
      />

      <CategoryEditForm
        category={categoryToEdit}
        open={!!categoryToEdit}
        onOpenChange={(open) => !open && setCategoryToEdit(null)}
        onSave={handleEditCategory}
      />

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 