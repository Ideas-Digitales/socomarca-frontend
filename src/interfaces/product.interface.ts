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

export interface ProductCart {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  unit: string;
  subtotal: number;
}

export interface Cart {
  items: ProductCart[];
  total: number;
}

export interface CartItem extends ProductToBuy {
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

type Operator = 'fulltext' | '=';
type Field = 'name' | 'category_id' | 'subcategory_id' | 'sales' | 'brand_id';

export interface FetchSearchProductsByFiltersProps {
  field?: Field;
  value?: string;
  operator?: Operator;
  min?: number;
  max?: number;
  sort?: 'asc' | 'desc';
}

export interface SearchWithPaginationProps
  extends FetchSearchProductsByFiltersProps {
  page?: number;
  size?: number;
}
