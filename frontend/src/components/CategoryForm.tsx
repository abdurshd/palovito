import { useState, ChangeEvent } from 'react';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { categoryService } from '../services/categoryService';

export function CategoryForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await categoryService.createCategory(name, description);
      toast({
        title: 'Success',
        description: 'Category created successfully!',
        variant: 'success',
      });
      setName('');
      setDescription('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create category. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
          placeholder="Enter category name"
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Enter category description"
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  );
} 