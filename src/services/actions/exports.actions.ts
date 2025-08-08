'use server';
import { Field } from '@/interfaces/product.interface';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

interface Filters {
  start?: string;
  end?: string;
  type: string;
  client?: string;
  total_min?: number;
  total_max?: number;
}

export const fetchExportTotalDeVentas = async (filters: Filters) => {
  const { start, end, type, client, total_min, total_max } = filters;

  // Determinar la URL según el tipo
  let url: string;
  const body: any = {};

  if (start) {
    body.start = start;
  }
  if (end) {
    body.end = end;
  }
  if (client) {
    body.client = client;
  }
  if (total_min) {
    body.total_min = total_min;
  }
  if (total_max) {
    body.total_max = total_max;
  }

  // Configurar URL y parámetros según el tipo
  if (type === 'failed') {
    url = `${BACKEND_URL}/orders/reports/transactions/export`;
    body.status = 'failed'; // Usar status en lugar de type para transacciones fallidas
  } else {
    url = `${BACKEND_URL}/orders/reports/export`;
    if (type) {
      body.type = type;
    }
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar el reporte',
    };
  }
};

export const fetchExportTransacciones = async (filters: Filters) => {
  const { start, end, type, client, total_min, total_max } = filters;

  // URL específica para transacciones
  const url = `${BACKEND_URL}/orders/reports/transactions/export`;

  const body: any = {};

  if (start) {
    body.start = start;
  }
  if (end) {
    body.end = end;
  }
  if (client) {
    body.client = client;
  }
  if (total_min) {
    body.total_min = total_min;
  }
  if (total_max) {
    body.total_max = total_max;
  }

  // Para transacciones, usar status en lugar de type
  if (type === 'failed') {
    body.status = 'failed';
  } else if (type === 'sales') {
    body.status = 'completed'; // Transacciones exitosas
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar las transacciones',
    };
  }
};

// Interface específica para filtros de clientes
interface ClientesFilters {
  start?: string;
  end?: string;
  total_min?: number;
  total_max?: number;
  region?: number;
}

export const fetchExportClientesMasCompra = async (
  filters: ClientesFilters
) => {
  const { start, end, total_min, total_max, region } = filters;

  // URL específica para clientes con más compras
  const url = `${BACKEND_URL}/orders/reports/clients/export`;

  const body: any = {};

  if (start) {
    body.start = start;
  }
  if (end) {
    body.end = end;
  }
  if (total_min) {
    body.total_min = total_min;
  }
  if (total_max) {
    body.total_max = total_max;
  }
  if (region) {
    body.region = region;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar el reporte de clientes',
    };
  }
};

// Interface específica para filtros de productos
interface ProductosFilters {
  start?: string;
  end?: string;
}

export const fetchExportProductosMasVentas = async (
  filters: ProductosFilters
) => {
  const { start, end } = filters;

  // URL específica para productos con más ventas
  const url = `${BACKEND_URL}/orders/reports/products/export`;

  const body: any = {};

  if (start) {
    body.start = start;
  }
  if (end) {
    body.end = end;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar el reporte de productos',
    };
  }
};

// Interface específica para filtros de municipalidades
interface MunicipalidadesFilters {
  start?: string;
  end?: string;
}

// Interface específica para filtros de categorías
interface CategoriasFilters {
  start?: string;
  end?: string;
}

export const fetchExportCategoriasMasVentas = async (
  filters: CategoriasFilters
) => {
  const { start, end } = filters;

  // URL específica para categorías con más ventas
  const url = `${BACKEND_URL}/orders/reports/categories/export`;

  const body: any = {};

  if (start) {
    body.start = start;
  }
  if (end) {
    body.end = end;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar el reporte de categorías',
    };
  }
};

// Interface específica para filtros de exportación de categorías
interface CategoriesExportFilters {
  sort?: 'id' | 'created_at';
  sort_direction?: 'asc' | 'desc';
}

export const fetchExportCategories = async (
  filters: CategoriesExportFilters
) => {
  const { sort, sort_direction } = filters;

  console.log(filters);

  // URL específica para exportar categorías
  const url = `${BACKEND_URL}/orders/reports/categories/export`;

  const body: any = {};
  if (sort) {
    body.sort = sort;
  }
  if (sort_direction) {
    body.sort_direction = sort_direction;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar las categorías',
    };
  }
};

// Interface específica para filtros de exportación de clientes
interface ClientsExportFilters {
  sort?: 'id' | 'created_at';
  sort_direction?: 'asc' | 'desc';
}

export const fetchExportClients = async (filters: ClientsExportFilters) => {
  const { sort, sort_direction } = filters;

  // URL específica para exportar clientes
  const url = `${BACKEND_URL}/orders/reports/clients/export`;

  const body: any = {};
  if (sort) {
    body.sort = sort;
  }
  if (sort_direction) {
    body.sort_direction = sort_direction;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar los clientes',
    };
  }
};

// Interface específica para filtros de exportación de productos
interface ProductsExportFilters {
  sort?: 'id' | 'created_at';
  sort_direction?: 'asc' | 'desc';
}

export const fetchExportProducts = async (filters: ProductsExportFilters) => {
  const { sort, sort_direction } = filters;

  console.log(filters);

  // URL específica para exportar productos
  const url = `${BACKEND_URL}/orders/reports/products/export`;

  const body: any = {};
  if (sort) {
    body.sort = sort;
  }
  if (sort_direction) {
    body.sort_direction = sort_direction;
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar los productos',
    };
  }
};

export const fetchExportMunicipalidadesMasVentas = async (
  filters: MunicipalidadesFilters
) => {
  const { start, end } = filters;

  // Construir URL con query parameters
  const url = new URL(`${BACKEND_URL}/orders/reports/municipalities/export`);

  if (start) {
    url.searchParams.append('start', start);
  }
  if (end) {
    url.searchParams.append('end', end);
  }

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Obtener el contenido como ArrayBuffer para archivos binarios
    const responseBuffer = await response.arrayBuffer();

    return {
      success: true,
      data: responseBuffer as any,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error al exportar el reporte de municipalidades',
    };
  }
};
