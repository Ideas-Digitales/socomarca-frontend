export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface CategoryComponent extends Category {
  isOpen?: boolean;
  hasSubCategories: boolean;
  subCategories?: SubCategory[];
}
