import { PaginationMeta } from '@/interfaces/pagination.interface';
import { Product } from '@/interfaces/product.interface';

export const productos: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    category_id: '1',
    subcategory_id: '1',
    brand_id: '1',
    sku: 'SKU123',
    status: true,
    price: 1000,
    stock: 100,
    imagen: 'assets/global/product-mock.png',
    created_at: '2021-01-01 00:00:00',
    updated_at: '2021-01-01 00:00:00',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    category_id: '2',
    subcategory_id: '2',
    brand_id: '2',
    sku: 'SKU123',
    status: true,
    price: 2000,
    stock: 200,
    imagen: 'assets/global/product-mock.png',
    created_at: '2021-01-01 00:00:00',
    updated_at: '2021-01-01 00:00:00',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description 3',
    category_id: '3',
    subcategory_id: '3',
    brand_id: '3',
    sku: 'SKU123',
    status: true,
    price: 3000,
    stock: 300,
    imagen: 'assets/global/product-mock.png',
    created_at: '2021-01-01 00:00:00',
    updated_at: '2021-01-01 00:00:00',
  },
];

// Metadatos para paginación
export const productsMeta: PaginationMeta = {
  total_items: 6,
  page_size: 3,
  current_page: 1,
  total_pages: 2,
  links: {
    self: '/api/products?page=1&size=3',
    prev: null,
    next: '/api/products?page=2&size=3',
  },
};

export interface ProductsMock {
  data: Product[];
  meta: PaginationMeta;
}

export const productsMock = {
  data: productos,
  meta: productsMeta,
};
