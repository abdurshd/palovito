import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import type { Category, Menu } from '../../types/Menu';

interface MenuFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (menuData: Omit<Menu, 'id'>) => Promise<void>;
  categories: Category[];
}

export function MenuAddForm({ open, onOpenChange, onSave, categories }: MenuFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) return;

    await onSave({
      ...formData,
      category,
      allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean)
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Button type="button" onClick={() => onOpenChange(false)} styleType='red'>
              Cancel
            </Button>
            <Button type="submit" styleType='green'>
              Add Menu Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 