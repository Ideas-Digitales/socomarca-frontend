export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  imagen: string;
  description: string;
  brand_id: string;
  subcategory_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  status: boolean
}

export interface ProductToBuy extends Product {
  quantity: number;
  is_favorite: boolean;
}
