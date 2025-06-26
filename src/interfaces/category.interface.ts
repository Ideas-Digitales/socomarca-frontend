export interface Category {
  id: number;
  name: string;
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
