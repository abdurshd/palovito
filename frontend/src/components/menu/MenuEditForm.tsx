import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
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
  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
    bestSeller: false,
    available: true,
    preparationTime: 0,
    spicyLevel: 0,
    allergens: '',
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog is closed or menu changes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setError(null);
    } else if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        price: menu.price,
        categoryId: menu.category.id,
        imageUrl: menu.imageUrl,
        bestSeller: menu.bestSeller,
        available: menu.available,
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
  }, [open, menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu) return;
    setError(null);

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
      setError(error instanceof Error ? error.message : 'Failed to update menu item');
      // Form data persists on error
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="editName" className="text-sm font-medium">Name</label>
              <Input
                id="editName"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="editCategory" className="text-sm font-medium">Category</label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger id="editCategory">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Select Category</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="editDescription" className="text-sm font-medium">Description</label>
            <Textarea
              id="editDescription"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="editPrice" className="text-sm font-medium">Price ($)</label>
              <Input
                id="editPrice"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="editImageUrl" className="text-sm font-medium">Image URL</label>
              <Input
                id="editImageUrl"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="editPrepTime" className="text-sm font-medium">Preparation Time (minutes)</label>
              <Input
                id="editPrepTime"
                type="number"
                placeholder="Preparation Time"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="editSpicyLevel" className="text-sm font-medium">Spicy Level (0-5)</label>
              <Input
                id="editSpicyLevel"
                type="number"
                placeholder="Spicy Level"
                value={formData.spicyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, spicyLevel: parseInt(e.target.value) }))}
                min="0"
                max="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="editAllergens" className="text-sm font-medium">Allergens</label>
            <Input
              id="editAllergens"
              placeholder="Allergens (comma-separated)"
              value={formData.allergens}
              onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Best Seller</label>
              <Switch
                checked={formData.bestSeller}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bestSeller: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Available</label>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Nutritional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="editCalories" className="text-sm font-medium">Calories</label>
                <Input
                  id="editCalories"
                  type="number"
                  placeholder="Calories"
                  value={formData.nutritionalInfo.calories}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, calories: parseInt(e.target.value) }
                  }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editProtein" className="text-sm font-medium">Protein (g)</label>
                <Input
                  id="editProtein"
                  type="number"
                  placeholder="Protein"
                  value={formData.nutritionalInfo.protein}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, protein: parseInt(e.target.value) }
                  }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editCarbs" className="text-sm font-medium">Carbs (g)</label>
                <Input
                  id="editCarbs"
                  type="number"
                  placeholder="Carbs"
                  value={formData.nutritionalInfo.carbs}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, carbs: parseInt(e.target.value) }
                  }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editFats" className="text-sm font-medium">Fats (g)</label>
                <Input
                  id="editFats"
                  type="number"
                  placeholder="Fats"
                  value={formData.nutritionalInfo.fats}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, fats: parseInt(e.target.value) }
                  }))}
                  min="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}