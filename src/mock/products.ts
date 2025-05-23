import { Category } from '@/interfaces/category.interface';
import {
  Subcategory,
  Brand,
  Product,
  ProductToBuy,
} from '@/interfaces/product.interface';

const CATEGORIES: Category[] = [
  { id: 1, name: 'Alimentos Básicos' },
  { id: 2, name: 'Verduras y Hortalizas' },
  { id: 3, name: 'Carnes y Proteínas' },
  { id: 4, name: 'Lácteos' },
  { id: 5, name: 'Bebidas' },
  { id: 6, name: 'Snacks y Dulces' },
  { id: 7, name: 'Cuidado Personal' },
  { id: 8, name: 'Limpieza del Hogar' },
];

const SUBCATEGORIES: Subcategory[] = [
  { id: 1, name: 'Cereales y Granos', category_id: 1 },
  { id: 2, name: 'Legumbres', category_id: 1 },
  { id: 3, name: 'Pastas', category_id: 1 },
  { id: 4, name: 'Verduras Frescas', category_id: 2 },
  { id: 5, name: 'Tubérculos', category_id: 2 },
  { id: 6, name: 'Carnes Rojas', category_id: 3 },
  { id: 7, name: 'Aves', category_id: 3 },
  { id: 8, name: 'Pescados', category_id: 3 },
  { id: 9, name: 'Leches', category_id: 4 },
  { id: 10, name: 'Quesos', category_id: 4 },
  { id: 11, name: 'Yogures', category_id: 4 },
  { id: 12, name: 'Jugos', category_id: 5 },
  { id: 13, name: 'Refrescos', category_id: 5 },
  { id: 14, name: 'Aguas', category_id: 5 },
];

const BRANDS: Brand[] = [
  { id: 1, name: 'Marca Premium', logo_url: 'assets/brands/premium-logo.png' },
  { id: 2, name: 'DeliciFood', logo_url: 'assets/brands/delicifood-logo.png' },
  { id: 3, name: 'NutriVida', logo_url: 'assets/brands/nutrivida-logo.png' },
  { id: 4, name: 'Orgánico Plus', logo_url: 'assets/brands/organico-logo.png' },
  { id: 5, name: 'SaludMax', logo_url: 'assets/brands/saludmax-logo.png' },
  { id: 6, name: 'FreshMart', logo_url: 'assets/brands/freshmart-logo.png' },
  {
    id: 7,
    name: 'SuperNatural',
    logo_url: 'assets/brands/supernatural-logo.png',
  },
  { id: 8, name: 'BioSelect', logo_url: 'assets/brands/bioselect-logo.png' },
  { id: 9, name: 'PureTaste', logo_url: 'assets/brands/puretaste-logo.png' },
  {
    id: 10,
    name: 'GreenChoice',
    logo_url: 'assets/brands/greenchoice-logo.png',
  },
];

const PRODUCT_NAMES = {
  cereales: [
    'Arroz Grano Largo Premium',
    'Arroz Integral Orgánico',
    'Arroz Basmati Aromático',
    'Arroz Arborio para Risotto',
    'Arroz Sushi Japonés',
    'Arroz Salvaje Mezcla Gourmet',
    'Quínoa Orgánica',
    'Bulgur Fino',
    'Couscous Integral',
    'Avena Instantánea',
  ],
  legumbres: [
    'Lentejas Rojas Partidas',
    'Lentejas Verdes',
    'Garbanzos Seleccionados',
    'Porotos Negros Selectos',
    'Porotos Blancos Medianos',
    'Frijoles Rojos Mexicanos',
    'Arvejas Secas',
    'Habas Secas',
  ],
  pastas: [
    'Fideos Spaghetti N°5',
    'Fideos Tallarines al Huevo',
    'Fideos Rigati Tricolor',
    'Fideos Lasaña Precocidos',
    'Fideos Cabello de Ángel',
    'Fideos Ramen Pack',
    'Ñoquis Frescos',
    'Ravioles de Ricota',
  ],
  verduras: [
    'Papas Russet Premium',
    'Papas Amarillas',
    'Papas Camote Orgánicas',
    'Papas Nativas Mix',
    'Tomates Cherry',
    'Lechuga Hidropónica',
    'Zanahorias Baby',
    'Brócoli Fresco',
  ],
};

// Utility functions
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomPrice = (): number => {
  const prices = [
    490, 690, 890, 990, 1190, 1290, 1490, 1590, 1690, 1890, 1990, 2190, 2490,
    2790, 2990, 3190, 3490, 3790,
  ];
  return getRandomElement(prices);
};

const generateSKU = (
  category: string,
  productName: string,
  id: number
): string => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const productCode = productName.split(' ')[0].substring(0, 3).toUpperCase();
  const numericCode = String(id).padStart(3, '0');
  return `${categoryCode}-${productCode}-${numericCode}`;
};

const getSubcategoriesByCategory = (categoryId: number): Subcategory[] => {
  return SUBCATEGORIES.filter((sub) => sub.category_id === categoryId);
};

// Main generator functions
export const generateProduct = (id: number): Product => {
  const category = getRandomElement(CATEGORIES);
  const availableSubcategories = getSubcategoriesByCategory(category.id);
  const subcategory = getRandomElement(availableSubcategories);
  const brand = getRandomElement(BRANDS);

  // Seleccionar nombre basado en la categoría
  let productName: string;
  if (category.id === 1) {
    // Alimentos Básicos
    if (subcategory.name.includes('Cereales')) {
      productName = getRandomElement(PRODUCT_NAMES.cereales);
    } else if (subcategory.name.includes('Legumbres')) {
      productName = getRandomElement(PRODUCT_NAMES.legumbres);
    } else {
      productName = getRandomElement(PRODUCT_NAMES.pastas);
    }
  } else if (category.id === 2) {
    // Verduras
    productName = getRandomElement(PRODUCT_NAMES.verduras);
  } else {
    productName = `Producto ${category.name} ${id}`;
  }

  const sku = generateSKU(category.name, productName, id);
  const price = getRandomPrice();
  const stock = getRandomNumber(0, 200);
  const status = stock > 0 && Math.random() > 0.1; // 90% de productos activos

  return {
    id,
    name: `${productName} ${getRandomNumber(100, 999)}g`,
    price,
    stock,
    sku,
    imagen: `assets/products/product-${id}.jpg`,
    category,
    subcategory,
    brand,
    status,
  };
};

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) =>
    generateProduct(index + 1)
  );
};

export const generateProductToBuy = (
  product: Product,
  quantity?: number
): ProductToBuy => {
  return {
    ...product,
    quantity: quantity || getRandomNumber(1, 5),
    is_favorite: Math.random() > 0.7, // 30% de probabilidad de ser favorito
  };
};

export const generateProductsToBuy = (
  products: Product[],
  count?: number
): ProductToBuy[] => {
  const selectedProducts = count
    ? products.slice(0, count)
    : products.filter(() => Math.random() > 0.5);

  return selectedProducts.map((product) => generateProductToBuy(product));
};

// Funciones para obtener datos específicos
export const getCategories = (): Category[] => [...CATEGORIES];

export const getSubcategories = (): Subcategory[] => [...SUBCATEGORIES];

export const getBrands = (): Brand[] => [...BRANDS];

export const getProductsByCategory = (
  categoryId: number,
  count: number = 10
): Product[] => {
  return generateProducts(count * 3)
    .filter((product) => product.category.id === categoryId)
    .slice(0, count);
};

export const getProductsByBrand = (
  brandId: number,
  count: number = 10
): Product[] => {
  return generateProducts(count * 2)
    .filter((product) => product.brand.id === brandId)
    .slice(0, count);
};

export const searchProducts = (
  query: string,
  allProducts: Product[]
): Product[] => {
  const searchTerm = query.toLowerCase();
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.name.toLowerCase().includes(searchTerm) ||
      product.brand.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
  );
};

// Funciones de utilidad para paginación
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export const paginateProducts = (
  products: Product[],
  page: number = 1,
  perPage: number = 20
): PaginatedResult<Product> => {
  const total = products.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const data = products.slice(start, end);

  return {
    data,
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
};
