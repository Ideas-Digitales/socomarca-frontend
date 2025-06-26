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

interface ProductsMock {
  data: Product[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

interface FetchGetProductsProps {
  page: number;
  size: number;
}

const createLaravelStyleResponse = (
  paginatedData: PaginatedResult<Product>,
  baseUrl: string = BACKEND_URL || 'https://api.example.com'
): ProductsMock => {
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

let cachedProducts: Product[] | null = null;
const TOTAL_MOCK_PRODUCTS = 150;

const getCachedProducts = (): Product[] => {
  if (!cachedProducts) {
    cachedProducts = generateProducts(TOTAL_MOCK_PRODUCTS);
  }
  return cachedProducts;
};

export const fetchGetProducts = async ({
  page,
  size,
}: FetchGetProductsProps) => {
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

export const fetchSearchProductsByFilters = async (
  filters: SearchWithPaginationProps
) => {
  try {
    if (IS_QA_MODE) {
      console.log('🔍 fetchSearchProductsByFilters - QA MODE:', filters);
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
      if (filters.sort) {
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
      }      const page = filters.page || 1;
      const size = filters.size || 20;
      const paginatedData = paginateProducts(filteredProducts, page, size);
      const response = createLaravelStyleResponse(paginatedData);

      // Agregar información de filtros simulada para el modo QA
      const mockFilters = {
        min_price: filteredProducts.length > 0 
          ? Math.min(...filteredProducts.map(p => typeof p.price === 'string' ? parseFloat(p.price) : p.price))
          : null,
        max_price: filteredProducts.length > 0 
          ? Math.max(...filteredProducts.map(p => typeof p.price === 'string' ? parseFloat(p.price) : p.price))
          : null,
        unit: null
      };

      return {
        ok: true,
        data: {
          ...response,
          filters: mockFilters
        },
        error: null,
      };
    } else {
      console.log('🔍 fetchSearchProductsByFilters - BACKEND MODE:', filters);
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

      // Construir el body con mejor soporte para múltiples filtros
      const filterObjects = [];

      // Filtro principal (field, value, operator)
      if (filters.field && filters.value) {
        filterObjects.push({
          field: filters.field,
          value: filters.value,
          operator: filters.operator || '=',
        });
      }

      // Filtro de precio como objeto separado
      if (filters.min !== undefined || filters.max !== undefined) {
        filterObjects.push({
          field: 'price',
          min: filters.min,
          max: filters.max,
          operator: 'range',
        });
      }

      const requestBody = {
        filters: filterObjects,
        ...(filters.sort && { sort: filters.sort }),
      };

      const response = await fetch(
        `${BACKEND_URL}/products/search?${queryParams}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${cookie}`,
          },          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('📡 Backend response:', data);

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

// Función adicional para limpiar el cache (útil para testing)
export const clearProductsCache = async () => {
  cachedProducts = null;
};

// Función para pre-cargar el cache (opcional)
export const preloadProductsCache = async () => {
  getCachedProducts();
};

// Funciones auxiliares para casos específicos
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
