interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  category?: Category;
  imageUrl: string;
  bestSeller: boolean;
  available: boolean;
  preparationTime?: number; 
  spicyLevel: number;
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export type { Menu, Category }; 