export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  imagen: string;
  description: string;
  brand: string;
}

export interface ProductToBuy extends Product {
  quantity: number;
}
