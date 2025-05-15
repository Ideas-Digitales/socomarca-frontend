'use client';

import { Product, ProductToBuy } from '@/interfaces/product.interface';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { create } from 'zustand';
import { useEffect } from 'react';
import { Category } from '@/interfaces/category.interface';
import { fetchGetCategories } from '@/services/actions/categories.actions';

// Añadimos la interfaz para la metadata de paginación
interface PaginationMeta {
  total_items: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  links: {
    self: string | null;
    prev: string | null;
    next: string | null;
  };
}

// Actualizamos la interfaz StoreState para incluir la meta y páginación
interface StoreState {
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchTerm: string;
  isMobile: boolean;
  isTablet: boolean;
  cartProducts: ProductToBuy[];
  paginationMeta: PaginationMeta | null;
  currentPage: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  isQaMode: boolean;
  addProductToCart: (product: Product, quantity: number) => void;
  incrementProductInCart: (productId: number) => void;
  decrementProductInCart: (productId: number) => void;
  removeProductFromCart: (productId: number) => void;
  removeAllQuantityByProductId: (productId: number) => void;
  clearCart: () => void;
  setProducts: (products: Product[], meta?: PaginationMeta) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: (page?: number, size?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  checkIsMobile: () => void;
  checkIsTablet: () => void;
}

// Las funciones de normalización y ranking se mantienen iguales
const normalizeText = (text: string): string => {
  // Tu código existente...
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const levenshteinDistance = (a: string, b: string): number => {
  // Tu código existente...
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // eliminación
        matrix[j - 1][i] + 1, // inserción
        matrix[j - 1][i - 1] + substitutionCost // sustitución
      );
    }
  }

  return matrix[b.length][a.length];
};

const calculateRelevanceScore = (
  product: Product,
  searchWords: string[]
): number => {
  // Tu código existente...
  // Normalizar nombre y descripción del producto
  const normalizedName = normalizeText(product.name);
  const normalizedDescription = product.description
    ? normalizeText(product.description)
    : '';

  // Dividir el nombre del producto en palabras
  const productWords = normalizedName
    .split(/\s+/)
    .filter((word) => word.length > 1);
  const descriptionWords = normalizedDescription
    ? normalizedDescription.split(/\s+/).filter((word) => word.length > 1)
    : [];

  let totalScore = 0;

  // Para cada palabra de búsqueda
  for (const searchWord of searchWords) {
    let bestWordMatch = 0;

    // Coincidencia exacta en el nombre completo (mejor puntuación)
    if (normalizedName.includes(searchWord)) {
      // Bonus por coincidencia exacta en el nombre
      bestWordMatch = Math.max(bestWordMatch, 100 + searchWord.length * 2);
    }

    // Coincidencia exacta en la descripción
    if (normalizedDescription.includes(searchWord)) {
      // Bonus menor por coincidencia en descripción
      bestWordMatch = Math.max(bestWordMatch, 50 + searchWord.length);
    }

    // Comparar con cada palabra del nombre del producto
    for (const productWord of productWords) {
      // Coincidencia exacta de palabra completa
      if (productWord === searchWord) {
        bestWordMatch = Math.max(bestWordMatch, 90 + searchWord.length * 2);
        continue;
      }

      // Palabra de producto contiene la palabra de búsqueda
      if (productWord.includes(searchWord) && searchWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 80 + searchWord.length);
        continue;
      }

      // Palabra de búsqueda contiene la palabra de producto
      if (searchWord.includes(productWord) && productWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 70 + productWord.length);
        continue;
      }

      // Similitud por distancia de Levenshtein
      const distance = levenshteinDistance(searchWord, productWord);
      const maxAllowedDistance = Math.min(
        2,
        Math.floor(productWord.length / 3)
      );

      if (distance <= maxAllowedDistance) {
        // Cuanto menor sea la distancia, mayor será la puntuación
        const similarityScore =
          60 +
          (maxAllowedDistance - distance) * 10 +
          Math.min(searchWord.length, productWord.length);
        bestWordMatch = Math.max(bestWordMatch, similarityScore);
      }
    }

    // Comparar con palabras de la descripción (menor prioridad)
    for (const descWord of descriptionWords) {
      // Coincidencia exacta de palabra completa en descripción
      if (descWord === searchWord) {
        bestWordMatch = Math.max(bestWordMatch, 40 + searchWord.length);
        continue;
      }

      // Palabra de descripción contiene la palabra de búsqueda
      if (descWord.includes(searchWord) && searchWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 30 + searchWord.length);
        continue;
      }

      // Similitud por distancia de Levenshtein en descripción
      const distance = levenshteinDistance(searchWord, descWord);
      const maxAllowedDistance = Math.min(2, Math.floor(descWord.length / 3));

      if (distance <= maxAllowedDistance) {
        const similarityScore =
          20 +
          (maxAllowedDistance - distance) * 5 +
          Math.min(searchWord.length, descWord.length);
        bestWordMatch = Math.max(bestWordMatch, similarityScore);
      }
    }

    // Sumar la mejor puntuación encontrada para esta palabra de búsqueda
    totalScore += bestWordMatch;
  }

  // Bonus por coincidencia de múltiples términos
  if (searchWords.length > 1 && totalScore > 0) {
    // Mayor bonus si hay coincidencia con todas las palabras de búsqueda
    let matchedTermsCount = 0;
    for (const searchWord of searchWords) {
      if (
        normalizedName.includes(searchWord) ||
        normalizedDescription.includes(searchWord)
      ) {
        matchedTermsCount++;
      }
    }

    // Porcentaje de palabras coincidentes (0 a 1)
    const matchRatio = matchedTermsCount / searchWords.length;
    // Añadir bonus basado en la proporción de términos coincidentes
    totalScore += totalScore * matchRatio * 0.5;
  }

  return totalScore;
};

function filterAndRankProducts(products: Product[], term: string): Product[] {
  // Tu código existente...
  if (!term) return products;

  // Normalizar y dividir el término de búsqueda en palabras individuales
  const normalizedTerm = normalizeText(term);
  const searchWords = normalizedTerm
    .split(/\s+/)
    .filter((word) => word.length > 1);

  // Si no hay palabras significativas, devolver todos los productos
  if (searchWords.length === 0) return products;

  // Calcular puntuación de relevancia para cada producto
  const scoredProducts = products.map((product) => {
    const score = calculateRelevanceScore(product, searchWords);
    return { product, score };
  });

  // Filtrar productos con puntuación > 0 (al menos alguna coincidencia)
  const matchingProducts = scoredProducts.filter((item) => item.score > 0);

  // Ordenar por puntuación descendente (más relevantes primero)
  matchingProducts.sort((a, b) => b.score - a.score);

  // Devolver solo los productos ordenados
  return matchingProducts.map((item) => item.product);
}

// Actualizamos el store para incluir la paginación
const useStore = create<StoreState>((set, get) => ({
  isLoading: false,
  products: [],
  categories: [],
  filteredProducts: [],
  searchTerm: '',
  isMobile: false,
  isTablet: false,
  cartProducts: [],
  paginationMeta: null,
  currentPage: 1,
  isQaMode: process.env.NEXT_PUBLIC_QA_MODE === 'true',
  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProducts(page);
  },
  nextPage: () => {
    const { currentPage, paginationMeta } = get();
    if (paginationMeta && currentPage < paginationMeta.total_pages) {
      const nextPage = currentPage + 1;
      set({ currentPage: nextPage });
      get().fetchProducts(nextPage);
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      set({ currentPage: prevPage });
      get().fetchProducts(prevPage);
    }
  },

  // Métodos del carrito sin cambios...
  addProductToCart: (product: Product, quantity) => {
    const { cartProducts } = get();
    const existingProduct = cartProducts.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cartProducts.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ cartProducts: updatedCart });
    } else {
      const newProduct = { ...product, quantity };
      set({ cartProducts: [...cartProducts, newProduct] });
    }
  },
  incrementProductInCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    set({ cartProducts: updatedCart });
  },
  decrementProductInCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    set({ cartProducts: updatedCart });
  },
  removeProductFromCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.reduce((acc: ProductToBuy[], item) => {
      if (item.id === productId) {
        if (item.quantity && item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    set({ cartProducts: updatedCart });
  },
  clearCart: () => {
    set({ cartProducts: [] });
  },
  removeAllQuantityByProductId: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.filter((item) => item.id !== productId);
    set({ cartProducts: updatedCart });
  },

  // Actualiza productos y metadata
  setProducts: (products: Product[], meta?: PaginationMeta) => {
    const searchTerm = get().searchTerm;
    set({
      products,
      filteredProducts: searchTerm
        ? filterAndRankProducts(products, searchTerm)
        : products,
      paginationMeta: meta || get().paginationMeta,
    });
  },

  setSearchTerm: (term: string) => {
    const { products } = get();
    set({
      searchTerm: term,
      filteredProducts: term ? filterAndRankProducts(products, term) : products,
    });
  },

  fetchProducts: async (page = 1, size = 9) => {
    try {
      set({ isLoading: true });
      const response = await fetchGetProducts({ page, size });

      if (response.ok && response.data) {
        console.log(response.data);
        set({
          products: response.data.data,
          filteredProducts: response.data.data,
          paginationMeta: response.data.meta,
          currentPage: response.data.meta.current_page,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetCategories();

      if (response.ok && response.data) {
        console.log(response.data);
        set({
          categories: response.data,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ isLoading: false });
    }
  },

  checkIsMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      set({ isMobile });
    }
  },
  checkIsTablet: () => {
    if (typeof window !== 'undefined') {
      const isTablet = window.innerWidth < 1024;
      set({ isTablet });
    }
  },
}));

export const useInitMobileDetection = () => {
  const checkIsMobile = useStore((state) => state.checkIsMobile);
  const checkIsTablet = useStore((state) => state.checkIsTablet);

  useEffect(() => {
    checkIsMobile();
    checkIsTablet();
    const handleResize = () => {
      checkIsMobile();
      checkIsTablet();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIsMobile, checkIsTablet]);
};

export default useStore;
