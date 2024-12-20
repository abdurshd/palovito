import { useState, useEffect, ChangeEvent } from 'react';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/Menu';

// TODO: Add pages folder and move this file to it
// TODO: Add a borders for the form area and make it beautiful
// TODO: add error handling for the form, and toast messages for succussful and failed operations

export function MenuForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
    isBestSeller: false,
    isAvailable: true,
    preparationTime: 0,
    spicyLevel: 0,
    allergens: '',
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    }
  });

  useEffect(() => {
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
      }
    };
    fetchCategories();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const category = categories.find(c => c.id === formData.categoryId);
      if (!category) throw new Error('Category not found');

      await menuService.createMenu({
        ...formData,
        category,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean)
      });

      toast({
        title: 'Success',
        description: 'Menu item created successfully!',
        variant: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        imageUrl: '',
        isBestSeller: false,
        isAvailable: true,
        preparationTime: 0,
        spicyLevel: 0,
        allergens: '',
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create menu item. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <Input
            type="url"
            value={formData.imageUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preparation Time (minutes)</label>
          <Input
            type="number"
            min="0"
            value={formData.preparationTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Spicy Level (0-3)</label>
          <Input
            type="number"
            min="0"
            max="3"
            value={formData.spicyLevel}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, spicyLevel: parseInt(e.target.value) }))}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Allergens (comma-separated)</label>
        <Input
          type="text"
          value={formData.allergens}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
          placeholder="e.g., nuts, dairy, gluten"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories</label>
          <Input
            type="number"
            min="0"
            value={formData.nutritionalInfo.calories}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              nutritionalInfo: { ...prev.nutritionalInfo, calories: parseInt(e.target.value) }
            }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
          <Input
            type="number"
            min="0"
            value={formData.nutritionalInfo.protein}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              nutritionalInfo: { ...prev.nutritionalInfo, protein: parseInt(e.target.value) }
            }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
          <Input
            type="number"
            min="0"
            value={formData.nutritionalInfo.carbs}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              nutritionalInfo: { ...prev.nutritionalInfo, carbs: parseInt(e.target.value) }
            }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fats (g)</label>
          <Input
            type="number"
            min="0"
            value={formData.nutritionalInfo.fats}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              nutritionalInfo: { ...prev.nutritionalInfo, fats: parseInt(e.target.value) }
            }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Best Seller</span>
          <Switch
            checked={formData.isBestSeller}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isBestSeller: checked }))}
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Available</span>
          <Switch
            checked={formData.isAvailable}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
          />
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Menu Item'}
      </Button>
    </form>
  );
} 