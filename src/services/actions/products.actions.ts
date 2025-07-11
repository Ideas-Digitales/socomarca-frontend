/**
 * Product Actions Service
 * 
 * This module provides functions to fetch, search, and manage product data, supporting both QA (mock) and real API modes.
 * It includes utilities for pagination, filtering, cache management, and price range retrieval.
 *
 * @module services/actions/products.actions
 */

'use server';
import {
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import {
  PaginatedResult,
  generateProducts,
  paginateProducts,
} from '@/mock/products';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';

/**
 * Formats paginated product data into a Laravel-style API response.
 * @param paginatedData - Paginated product data
 * @param baseUrl - Base URL for links (defaults to BACKEND_URL)
 * @returns Formatted response object
 */
const createLaravelStyleResponse = (
  paginatedData: PaginatedResult<Product>,
  baseUrl: string = BACKEND_URL || 'https://api.example.com'
) => {
  const { data, total, page, per_page, total_pages, has_next, has_prev } =
    paginatedData;

  const links = {
    first: `${baseUrl}/products?page=1&size=${per_page}`,
    last: `${baseUrl}/products?page=${total_pages}&size=${per_page}`,
    prev: has_prev
      ? `${baseUrl}/products?page=${page - 1}&size=${per_page}`
      : null,
    next: has_next
      ? `${baseUrl}/products?page=${page + 1}&size=${per_page}`
      : null,
  };

  const metaLinks = [];

  metaLinks.push({
    url: has_prev
      ? `${baseUrl}/products?page=${page - 1}&size=${per_page}`
      : null,
    label: '&laquo; Previous',
    active: false,
  });

  for (let i = 1; i <= total_pages; i++) {
    metaLinks.push({
      url: `${baseUrl}/products?page=${i}&size=${per_page}`,
      label: i.toString(),
      active: i === page,
    });
  }

  metaLinks.push({
    url: has_next
      ? `${baseUrl}/products?page=${page + 1}&size=${per_page}`
      : null,
    label: 'Next &raquo;',
    active: false,
  });

  const from = total > 0 ? (page - 1) * per_page + 1 : 0;
  const to = Math.min(page * per_page, total);

  return {
    data,
    links,
    meta: {
      current_page: page,
      from,
      last_page: total_pages,
      path: `${baseUrl}/products`,
      per_page,
      to,
      total,
      links: metaLinks,
    },
  };
};

/**
 * In-memory cache for mock products (QA mode only)
 */
let cachedProducts: Product[] | null = null;
const TOTAL_MOCK_PRODUCTS = 150;

/**
 * Returns cached mock products, generating them if not present.
 * @returns Array of mock products
 */
const getCachedProducts = (): Product[] => {
  if (!cachedProducts) {
    cachedProducts = generateProducts(TOTAL_MOCK_PRODUCTS);
  }
  return cachedProducts;
};

/**
 * Fetches paginated products (mock or real API).
 * @param params - Pagination params: page, size
 * @returns API-like response with product data
 */
export const fetchGetProducts = async ({
  page ,
  size ,
}: {
  page: number;
  size: number;
}) => {
  try {
    if (IS_QA_MODE) {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      const allProducts = getCachedProducts();

      const paginatedData = paginateProducts(allProducts, page, size);

      const response = createLaravelStyleResponse(paginatedData);

      return {
        ok: true,
        data: response,
        error: null,
      };
    } else {
      const { getCookie } = await cookiesManagement();
      const cookie = getCookie('token');

      if (!cookie) {
        return {
          ok: false,
          data: null,
          error: 'Unauthorized: No token provided',
        };
      }

      const response = await fetch(
        `${BACKEND_URL}/products/?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookie}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      return {
        ok: true,
        data,
        error: null,
      };
    }
  } catch (error) {
    console.log('Error fetching products:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Fetches products by filters (mock or real API).
 * Supports filtering by name, category, subcategory, brand, price range, favorites, and sorting.
 * @param filters - Filtering and pagination options
 * @returns API-like response with filtered product data and filter info
 */
export const fetchSearchProductsByFilters = async (
  filters: SearchWithPaginationProps
) => {
  try {
    if (IS_QA_MODE) {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      const allProducts = getCachedProducts();

      // Aplicar filtros según el tipo
      let filteredProducts = allProducts;

      if (filters.field && filters.value) {
        const searchTerm = filters.value.toLowerCase();
        filteredProducts = allProducts.filter((product) => {
          switch (filters.field) {
            case 'name':
              return product.name.toLowerCase().includes(searchTerm);
            case 'category_id':
              return product.category.id.toString() === filters.value;
            case 'subcategory_id':
              return product.subcategory.id.toString() === filters.value;
            case 'brand_id':
              // NUEVO: Soporte para filtros por marca
              return product.brand.id.toString() === filters.value;
            case 'sales':
              return true;
            case 'is_favorite':
              return product.is_favorite.toString() === filters.value;
            default:
              return product.name.toLowerCase().includes(searchTerm);
          }
        });
      }

      // Aplicar filtros de rango de precio si existen
      if (filters.min !== undefined || filters.max !== undefined) {
        filteredProducts = filteredProducts.filter((product) => {
          const price =
            typeof product.price === 'string'
              ? parseFloat(product.price)
              : product.price;
          const min = filters.min !== undefined ? filters.min : 0;
          const max = filters.max !== undefined ? filters.max : Infinity;
          return price >= min && price <= max;
        });
      }

      // Aplicar ordenamiento si existe
      if (filters.sort_field && filters.sort_direction) {
        filteredProducts.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sort_field) {
            case 'id':
              aValue = a.id;
              bValue = b.id;
              break;
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'price':
              aValue = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
              bValue = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
              break;
            case 'stock':
              aValue = a.stock;
              bValue = b.stock;
              break;
            case 'category_name':
              aValue = a.category.name.toLowerCase();
              bValue = b.category.name.toLowerCase();
              break;
            case 'brand_name':
              aValue = a.brand.name.toLowerCase();
              bValue = b.brand.name.toLowerCase();
              break;
            default:
              return 0;
          }

          if (filters.sort_direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      } else if (filters.sort) {
        // Mantener compatibilidad con el ordenamiento anterior (solo por precio)
        filteredProducts.sort((a, b) => {
          const aPrice =
            typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const bPrice =
            typeof b.price === 'string' ? parseFloat(b.price) : b.price;

          switch (filters.sort) {
            case 'asc':
              return aPrice - bPrice;
            case 'desc':
              return bPrice - aPrice;
            default:
              return 0;
          }
        });
      }
      const page = filters.page || 1;
      const size = filters.size || 20;
      const paginatedData = paginateProducts(filteredProducts, page, size);
      const response = createLaravelStyleResponse(paginatedData);

      // Agregar información de filtros simulada para el modo QA
      const mockFilters = {
        min_price:
          filteredProducts.length > 0
            ? Math.min(
                ...filteredProducts.map((p) =>
                  typeof p.price === 'string' ? parseFloat(p.price) : p.price
                )
              )
            : null,
        max_price:
          filteredProducts.length > 0
            ? Math.max(
                ...filteredProducts.map((p) =>
                  typeof p.price === 'string' ? parseFloat(p.price) : p.price
                )
              )
            : null,
        unit: null,
      };

      return {
        ok: true,
        data: {
          ...response,
          filters: mockFilters,
        },
        error: null,
      };
    } else {
      const { getCookie } = await cookiesManagement();
      const cookie = getCookie('token');

      if (!cookie) {
        return {
          ok: false,
          data: null,
          error: 'Unauthorized: No token provided',
        };
      }

      // Construir query parameters
      const page = filters.page || 1;
      const per_page = filters.size || 20;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      // Construir el body con la nueva estructura
      const requestBody: any = {
        filters: {
          // Price siempre va sin excepción
          price: {
            min: filters.min !== undefined ? filters.min : 0,
            max: filters.max !== undefined ? filters.max : 999999,
          },
        },
      };

      // Agregar unit solo si tiene valor
      if (filters.unit) {
        requestBody.filters.price.unit = filters.unit;
      }

      // Agregar otros filtros solo si vienen en filters
      if (filters.category_id !== undefined) {
        requestBody.filters.category_id = filters.category_id;
      }

      if (filters.subcategory_id !== undefined) {
        requestBody.filters.subcategory_id = filters.subcategory_id;
      }

      if (filters.brand_id !== undefined) {
        requestBody.filters.brand_id = filters.brand_id;
      }

      if (filters.field === 'name' && filters.value) {
        requestBody.filters.name = filters.value;
      }

      if (filters.is_favorite !== undefined) {
        requestBody.filters.is_favorite = filters.is_favorite;
      }

      // Agregar sort si existe
      if (filters.sort) {
        requestBody.sort = filters.sort;
      }

      // Agregar sort_field y sort_direction si existen
      if (filters.sort_field && filters.sort_direction) {
        requestBody.filters.sort = filters.sort_field;
        requestBody.filters.sort_direction = filters.sort_direction;
      }

      const response = await fetch(
        `${BACKEND_URL}/products/search?${queryParams}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${cookie}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return {
        ok: true,
        data,
        error: null,
      };
    }
  } catch (error: any) {
    console.log('Error fetching products by filters:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Clears the in-memory product cache (QA mode only).
 * Useful for testing or refreshing mock data.
 */
export const clearProductsCache = async () => {
  cachedProducts = null;
};

/**
 * Preloads the in-memory product cache (QA mode only).
 * Useful for warming up the cache before tests.
 */
export const preloadProductsCache = async () => {
  getCachedProducts();
};

/**
 * Fetches products by category (mock or real API).
 * @param categoryId - Category ID
 * @param page - Page number (default 1)
 * @param size - Page size (default 21)
 * @returns API-like response with category-filtered products
 */
export const fetchGetProductsByCategory = async (
  categoryId: number,
  page: number = 1,
  size: number = 21
) => {
  if (IS_QA_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const allProducts = getCachedProducts();
    const categoryProducts = allProducts.filter(
      (p) => p.category.id === categoryId
    );
    const paginatedData = paginateProducts(categoryProducts, page, size);
    const response = createLaravelStyleResponse(paginatedData);

    return {
      ok: true,
      data: response,
      error: null,
    };
  }

  // Lógica para API real aquí
  return fetchGetProducts({ page, size });
};

/**
 * Searches products by a text query (mock or real API).
 * @param query - Search string
 * @param page - Page number (default 1)
 * @param size - Page size (default 21)
 * @returns API-like response with search results
 */
export const fetchSearchProducts = async (
  query: string,
  page: number = 1,
  size: number = 21
) => {
  if (IS_QA_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const allProducts = getCachedProducts();
    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm) ||
        product.brand.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
    );

    const paginatedData = paginateProducts(filteredProducts, page, size);
    const response = createLaravelStyleResponse(paginatedData);

    return {
      ok: true,
      data: response,
      error: null,
    };
  }

  // Lógica para API real aquí
  return fetchGetProducts({ page, size });
};

/**
 * Fetches the minimum and maximum product prices (mock or real API).
 * @returns Object with min_price and max_price
 */
export const fetchMinMaxPrice = async () => {
  try {
    if (IS_QA_MODE) {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      // Obtener precios desde los productos mock
      const allProducts = getCachedProducts();
      if (allProducts.length === 0) {
        return {
          ok: true,
          data: {
            min_price: 0,
            max_price: 1000,
          },
          error: null,
        };
      }
      
      const prices = allProducts.map(product => {
        let price = product.price;
        if (typeof price === 'string') {
          price = parseFloat((price as string).replace(/[^\d.,]/g, '').replace(',', '.'));
        }
        return price;
      }).filter(price => !isNaN(price) && price >= 0);
      
      const min_price = Math.floor(Math.min(...prices));
      const max_price = Math.ceil(Math.max(...prices));
      
      return {
        ok: true,
        data: {
          min_price,
          max_price,
        },
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const cookie = getCookie('token');

    if (!cookie) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    const response = await fetch(`${BACKEND_URL}/products/price-extremes`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return {
      ok: true,
      data: {
        min_price: data.lowest_price_product,
        max_price: data.highest_price_product,
      },
      error: null,
    };
  } catch (error) {
    console.log('Error fetching min/max price:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Fetches the product list from the backend with pagination and sorting.
 * @param params - { page, per_page, sort, sort_direction }
 * @returns API response with product data
 */
export const fetchGetProductsList = async ({
  page = 1,
  per_page = 15,
  sort = 'id',
  sort_direction = 'asc',
}: {
  page?: number;
  per_page?: number;
  sort?: 'id' | 'price' | 'category_name' | 'stock';
  sort_direction?: 'asc' | 'desc';
}) => {
  try {
    const { getCookie } = await cookiesManagement();
    const cookie = getCookie('token');

    if (!cookie) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    const url = new URL(`${BACKEND_URL}/products`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', per_page.toString());
    url.searchParams.set('sort', sort);
    url.searchParams.set('sort_direction', sort_direction);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching products list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
