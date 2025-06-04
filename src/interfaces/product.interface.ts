export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  category: Category;
  subcategory: Subcategory;
  brand: Brand;
  status: boolean;
  unit: string;
  is_favorite: boolean;
  
}

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ProductToBuy extends Product {
  quantity: number;
}
