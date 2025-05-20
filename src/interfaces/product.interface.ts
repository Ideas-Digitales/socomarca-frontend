export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  imagen: string;
  description: string;
  category_id: number;
  subcategory_id: number;
  brand_id: number;
  created_at: string;
  updated_at: string;
  status: boolean;
}

export interface ProductToBuy extends Product {
  quantity: number;
  is_favorite?: boolean;
}