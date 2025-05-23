export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  imagen: string;
  category: Category;
  subcategory: Subcategory;
  brand: Brand;
  status: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Brand {
  id: number;
  name: string;
  logo_url: string;
}

export interface ProductToBuy extends Product {
  quantity: number;
  is_favorite?: boolean;
}
