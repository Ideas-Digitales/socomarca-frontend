export interface Category {
  id: number;
  name: string;
  level?: number | string | null;
}

export interface CategoryComplexData extends Category {
  description?: string | null;
  code?: string | null;
  key?: string | null;
  categories?: CategoryComplexData[];
  subcategories?: CategoryComplexData[];
  categories_count?: number | string;
  subcategories_count?: number | string;
  products_count?: number | string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface CategoryComponent extends Category {
  description?: string;
  code?: string;
  level?: number;
  key?: string;
  subcategories_count?: number;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
  isOpen?: boolean;
  hasSubCategories?: boolean;
  subCategories?: SubCategory[];
}
