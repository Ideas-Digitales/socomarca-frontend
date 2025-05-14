'use client';

/**
 * Sistema de búsqueda inteligente con las siguientes características:
 * - Ignora acentos/tildes (ej: buscar "cafe" encuentra "café")
 * - Tolera errores ortográficos comunes (ej: "arros" encuentra "arroz")
 * - Búsqueda de múltiples términos (ej: "arroz aceite" encuentra ambos productos)
 * - Ordenación por relevancia (productos con más coincidencias aparecen primero)
 */

import { Product, ProductToBuy } from '@/interfaces/product.interface';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { create } from 'zustand';
import { useEffect } from 'react';

interface StoreState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchTerm: string;
  isMobile: boolean;
  cart: ProductToBuy[];
  addProcuctToCart: (product: Product, quantity: number) => void;
  removeProductFromCart: (productId: number) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
  checkIsMobile: () => void;
}

/**
 * Normaliza el texto eliminando acentos y convirtiendo a minúsculas
 * Permite búsquedas sin importar mayúsculas/minúsculas o acentos
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Calcula la distancia de Levenshtein entre dos palabras
 * Permite detectar términos similares con errores ortográficos
 * @see https://www.geeksforgeeks.org/introduction-to-levenshtein-distance/
 */
const levenshteinDistance = (a: string, b: string): number => {
  // Implementación de algoritmo Levenshtein
  // Retorna cuántos cambios se necesitan para transformar una palabra en otra
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  // Resto del código sin cambios...
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

/**
 * Calcula una puntuación de relevancia entre un producto y los términos de búsqueda
 * Usa un sistema de puntos que prioriza coincidencias en el siguiente orden:
 * 1. Coincidencias exactas en nombre (mayor prioridad)
 * 2. Coincidencias parciales en nombre
 * 3. Palabras similares en nombre
 * 4. Coincidencias en descripción (menor prioridad)
 */
const calculateRelevanceScore = (
  product: Product,
  searchWords: string[]
): number => {
  // Normalizar nombre y descripción del producto
  const normalizedName = normalizeText(product.name);
  const normalizedDescription = product.description
    ? normalizeText(product.description)
    : '';

  // Resto del código sin cambios...
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

    // Resto del código sin cambios...
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

    // Resto del código sin cambios...
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

/**
 * Filtra y ordena productos según relevancia con la búsqueda
 * Maneja múltiples términos y ordena resultados por relevancia
 * @example "arroz aceite" → Muestra primero productos que contienen ambos términos
 */
function filterAndRankProducts(products: Product[], term: string): Product[] {
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

/**
 * Store global de la aplicación utilizando Zustand
 * Gestiona productos, búsqueda inteligente y carrito de compras
 */
const useStore = create<StoreState>((set, get) => ({
  isLoading: false,
  products: [],
  filteredProducts: [],
  searchTerm: '',
  isMobile: false,
  cart: [],

  // Métodos del carrito sin cambios...
  addProcuctToCart: (product: Product, quantity) => {
    const { cart } = get();
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ cart: updatedCart });
    } else {
      const newProduct = { ...product, quantity };
      set({ cart: [...cart, newProduct] });
    }
  },
  removeProductFromCart: (productId: number) => {
    const { cart } = get();
    const updatedCart = cart.reduce((acc: ProductToBuy[], item) => {
      if (item.id === productId) {
        if (item.quantity && item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    set({ cart: updatedCart });
  },
  clearCart: () => {
    set({ cart: [] });
  },

  /**
   * Actualiza productos y aplica filtro de búsqueda si existe término
   */
  setProducts: (products: Product[]) => {
    const searchTerm = get().searchTerm;
    set({
      products,
      filteredProducts: searchTerm
        ? filterAndRankProducts(products, searchTerm)
        : products,
    });
  },

  /**
   * Actualiza término de búsqueda y filtra productos según relevancia
   */
  setSearchTerm: (term: string) => {
    const { products } = get();
    set({
      searchTerm: term,
      filteredProducts: term ? filterAndRankProducts(products, term) : products,
    });
  },

  /**
   * Obtiene productos desde el servidor
   */
  fetchProducts: async () => {
    try {
      set({ isLoading: true });
      const { data } = await fetchGetProducts();

      if (Array.isArray(data)) {
        set({
          products: data,
          filteredProducts: data,
          isLoading: false,
        });
      } else {
        console.error('La respuesta no contiene un array de productos:', data);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Detecta si el dispositivo es móvil para adaptación responsive
   */
  checkIsMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      set({ isMobile });
    }
  },
}));

/**
 * Hook para inicializar y gestionar la detección de dispositivos móviles
 */
export const useInitMobileDetection = () => {
  const checkIsMobile = useStore((state) => state.checkIsMobile);

  useEffect(() => {
    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIsMobile]);
};

export default useStore;
