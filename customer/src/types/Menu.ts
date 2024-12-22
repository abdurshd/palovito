export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
    description: string;
  };
  imageUrl: string;
  preparationTime: number;
  spicyLevel: number;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  bestSeller: boolean;
  available: boolean;
}

export interface MenuRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  preparationTime?: number;
  spicyLevel?: number;
  allergens?: string[];
} 