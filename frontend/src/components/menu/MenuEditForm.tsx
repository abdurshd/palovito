import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import type { Menu, Category } from '../../types/Menu';

interface MenuEditDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, menuData: Omit<Menu, 'id'>) => Promise<void>;
  categories: Category[];
}

export function MenuEditForm({ menu, open, onOpenChange, onSave, categories }: MenuEditDialogProps) {
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
    if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        price: menu.price,
        categoryId: menu.category.id,
        imageUrl: menu.imageUrl,
        isBestSeller: menu.isBestSeller,
        isAvailable: menu.isAvailable,
        preparationTime: menu.preparationTime || 0,
        spicyLevel: menu.spicyLevel,
        allergens: menu.allergens?.join(', ') || '',
        nutritionalInfo: menu.nutritionalInfo || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }
      });
    }
  }, [menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu) return;

    try {
      const category = categories.find(c => c.id === formData.categoryId);
      if (!category) throw new Error('Category not found');

      await onSave(menu.id, {
        ...formData,
        category,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean)
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update menu:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields similar to MenuForm component */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              required
              min="0"
              step="0.01"
            />
            <Input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Preparation Time (minutes)"
              value={formData.preparationTime}
              onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
              min="0"
            />
            <Input
              type="number"
              placeholder="Spicy Level (0-5)"
              value={formData.spicyLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, spicyLevel: parseInt(e.target.value) }))}
              min="0"
              max="5"
            />
          </div>

          <Input
            placeholder="Allergens (comma-separated)"
            value={formData.allergens}
            onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Best Seller</label>
              <Switch
                checked={formData.isBestSeller}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestSeller: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Available</label>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Nutritional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Calories"
                value={formData.nutritionalInfo.calories}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalInfo: { ...prev.nutritionalInfo, calories: parseInt(e.target.value) }
                }))}
                min="0"
              />
              <Input
                type="number"
                placeholder="Protein (g)"
                value={formData.nutritionalInfo.protein}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalInfo: { ...prev.nutritionalInfo, protein: parseInt(e.target.value) }
                }))}
                min="0"
              />
              <Input
                type="number"
                placeholder="Carbs (g)"
                value={formData.nutritionalInfo.carbs}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalInfo: { ...prev.nutritionalInfo, carbs: parseInt(e.target.value) }
                }))}
                min="0"
              />
              <Input
                type="number"
                placeholder="Fats (g)"
                value={formData.nutritionalInfo.fats}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nutritionalInfo: { ...prev.nutritionalInfo, fats: parseInt(e.target.value) }
                }))}
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" className="hover:bg-red-100 hover:border-2 hover:border-red-500 transition-all duration-300" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="hover:bg-green-100 hover:border-2 hover:border-green-500 transition-all duration-300">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 