import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Switch } from '../ui/switch';
import { useState, useEffect } from 'react';
import type { Category, Menu } from '../../types/Menu';

interface MenuFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (menuData: Omit<Menu, 'id'>) => Promise<void>;
  categories: Category[];
}

export function MenuAddForm({ open, onOpenChange, onSave, categories }: MenuFormProps) {
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

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const category = categories.find(c => c.id === formData.categoryId);
      if (!category) throw new Error('Choose a category');

      await onSave({
        ...formData,
        categoryId: category.id,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean)
      });

      // Only reset form on successful save
      setFormData(initialFormState);
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save menu item');
      // Form data persists on error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                maxLength={100}
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger id="category">
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
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              maxLength={500}
              minLength={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price (₩) </label>
              <Input
                id="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                required
                min="1000"
                max="99999999"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
              <Input
                id="imageUrl"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                maxLength={255}
                pattern="https?:\/\/.+"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="prepTime" className="text-sm font-medium">Preparation Time (minutes)</label>
              <Input
                id="prepTime"
                type="number"
                placeholder="Preparation Time"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
                required
                min="1"
                max="180"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="spicyLevel" className="text-sm font-medium">Spicy Level (0-5)</label>
              <Input
                id="spicyLevel"
                type="number"
                placeholder="Spicy Level"
                value={formData.spicyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, spicyLevel: parseInt(e.target.value) }))}
                required
                min="0"
                max="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="allergens" className="text-sm font-medium">Allergens</label>
            <Input
              id="allergens"
              placeholder="Allergens (comma-separated)"
              value={formData.allergens}
              onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
              maxLength={255}
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
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Nutritional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium">Calories</label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Calories"
                  value={formData.nutritionalInfo.calories}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, calories: parseInt(e.target.value) }
                  }))}
                  required
                  min="0"
                  max="9999"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="protein" className="text-sm font-medium">Protein (g)</label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="Protein (g)"
                  value={formData.nutritionalInfo.protein}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, protein: parseFloat(e.target.value) }
                  }))}
                  required
                  min="0"
                  max="999"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="Carbs (g)"
                  value={formData.nutritionalInfo.carbs}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, carbs: parseFloat(e.target.value) }
                  }))}
                  required
                  min="0"
                  max="999"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="fats" className="text-sm font-medium">Fats (g)</label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="Fats (g)"
                  value={formData.nutritionalInfo.fats}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalInfo: { ...prev.nutritionalInfo, fats: parseFloat(e.target.value) }
                  }))}
                  required
                  min="0"
                  max="999"
                  step="1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Menu Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 