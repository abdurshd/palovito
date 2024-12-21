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
  imageUrl?: string;
  category: Category;
  isAvailable: boolean;
  preparationTime?: number;
  spicyLevel?: number;
  allergens?: string[];
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