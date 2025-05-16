export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  imagen: string;
  description: string;
  category: CategoryProduct;
  brand: BrandProduct;
  created_at: string;
  updated_at: string;
  status: boolean;
}

export interface BrandProduct {
  brand_id: string;
  brand_name: string;
}

export interface CategoryProduct {
  category_id: string;
  category_name: string;
}

export interface ProductToBuy extends Product {
  quantity: number;
  is_favorite?: boolean;
}
