export interface Category {
  id: number;
  name: string;
  description: string;
  code: string;
  level: number;
  key: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  description: string;
  code: string;
  level: number;
  key: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: number;
  product_id: number;
  price_list_id: string;
  unit: string;
  price: string; 
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  brand: Brand;
  price_id: number | null;
  price: Price;
  sku: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}


export interface ProductToBuy extends Product {
  quantity: number;
}
