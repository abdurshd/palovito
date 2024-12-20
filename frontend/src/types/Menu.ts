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
  category: Category;
  imageUrl: string;
  isBestSeller: boolean;
  isAvailable: boolean;
  preparationTime?: number; // in minutes
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