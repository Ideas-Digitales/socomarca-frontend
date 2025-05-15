// Define types for our categories
export interface SubCategory {
  id: string;
  name: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  isOpen?: boolean;
  hasSubCategories?: boolean;
  subCategories?: SubCategory[];
}
