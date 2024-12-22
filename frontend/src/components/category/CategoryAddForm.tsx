import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useState, useEffect } from 'react';
import { Category } from '@/types/Menu';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Partial<Category>) => void;
}

export function CategoryAddForm({ open, onOpenChange, onSave }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave({ name, description });
      setName('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save category');
      // Form data persists on error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-new-category">Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <Input
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
            minLength={2}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
          />
          <Button type="submit" className="w-full">Save Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 