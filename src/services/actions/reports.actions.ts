'use server'

// Mapeo de los posibles endpoints y el valor con el que se va a mostrar 
const ENDPOINTS = {
  products: 'top-products-list',
  transactions: 'transactions-list',
  failedTransactions: 'failed-transactions-list',
  clients: 'clients-list',
}

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

// Lista por transacciones
// La función recibe los siguientes valores en el body:
// - start: "2025-01-01"
// - end: "2025-01-31"
// - per_page: 15
// - page: 1
// total_min: 350000
// total_max: 600000

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

type Endpoint = 'products' | 'transactions' | 'failedTransactions' | 'clients';

type ChartReportType = 'transactions' | 'sales' | 'revenue' | 'top-clients' | 'top-products' | 'top-categories' | 'transactions-failed' | 'top-municipalities';

// Interfaz para la respuesta de productos más vendidos
interface TopProductsChartResponse {
  top_products: {
    month: string;
    product: string;
    total: number;
  }[];
  total_sales: number;
}

interface ChartReportsResponse {
  months: string[];
  clients: string[];
  totals: {
    month: string;
    sales_by_client: {
      client: string;
      total: number;
    }[];
  }[];
  total_buyers_per_month: {
    month: string;
    total_buyers: number;
  }[];
}

export const fetchGetOrdersReportsTransactionsList = async (
  start: string,
  end: string,
  per_page: number,
  page: number,
  endpoint: Endpoint,
  client: string | null = null,
  type: 'exitosa',
  total_min?: number,
  total_max?: number
): Promise<ActionResult<any>> => {
  
  try {
    if (IS_QA_MODE) {
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA usando la nueva estructura del backend
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        cliente: `Cliente ${i + 1}`,
        monto: Math.floor(Math.random() * 500000) + 50000,
        fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'completed'
      }));

      // Aplicar filtros mock si están presentes
      let filteredData = mockData;
      if (client) {
        filteredData = filteredData.filter(item => item.cliente.includes(client));
      }
      
      // Aplicar filtros de monto si están presentes
      if (total_min !== undefined) {
        filteredData = filteredData.filter(item => item.monto >= total_min);
      }
      if (total_max !== undefined) {
        filteredData = filteredData.filter(item => item.monto <= total_max);
      }

      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      const mockResponse = {
        detalle_tabla: paginatedData,
        pagination: {
          current_page: page,
          last_page: Math.ceil(filteredData.length / per_page),
          per_page: per_page,
          total: filteredData.length,
        },
        parameters: {
          start: start || undefined,
          end: end || undefined,
          client: client || null,
          type: type || null,
          total_min: total_min || undefined,
          total_max: total_max || undefined,
        }
      };

      return {
        ok: true,
        data: mockResponse,
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const endpointUrl = `${BACKEND_URL}/orders/reports/${ENDPOINTS[endpoint]}`;

    // Crear el body según la documentación del API
    const requestBody: any = {
      per_page,
      page,
    };
    
    // Agregar filtros opcionales solo si tienen valores válidos
    if (start && start.trim() !== '') requestBody.start = start;
    if (end && end.trim() !== '') requestBody.end = end;
    if (client && client.trim() !== '') requestBody.client = client;
    if (type) requestBody.type = type;
    
    // Si se envía total_min, usarlo; si no se envía pero se envía total_max, usar 0 como default
    if (total_min !== undefined && total_min !== null) {
      requestBody.total_min = total_min;
    } else if (total_max !== undefined && total_max !== null && total_max > 0) {
      // Si no hay total_min pero sí hay total_max, usar 0 como total_min
      requestBody.total_min = 0;
    }
    
    if (total_max !== undefined && total_max !== null && total_max > 0) {
      requestBody.total_max = total_max;
    }
    console.log('requestBody', requestBody);
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    // Verificar el content-type antes de parsear JSON
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Response: ${textResponse}`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Extraer la estructura correcta que espera el slice
    const responseData = data.respuesta || data;

    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders reports transactions list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Lista por transacciones fallidas
// La función recibe los siguientes valores en el body:
// - start: "2025-01-01"
// - end: "2025-01-31"
// - per_page: 15
// - page: 1

export const fetchGetOrdersReportsFailedTransactionsList = async (
  start: string,
  end: string,
  per_page: number,
  page: number,
  endpoint: Endpoint, 
  client: string | null = null,
  type: 'fallida',
  total_min?: number,
  total_max?: number
) => {

  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const endpointUrl = `${BACKEND_URL}/orders/reports/${ENDPOINTS[endpoint]}`;

    const requestBody: any = {
      per_page,
      page,
    };
    
    if (start && start.trim() !== '') requestBody.start = start;
    if (end && end.trim() !== '') requestBody.end = end;
    if (client && client.trim() !== '') requestBody.client = client;
    if (type) requestBody.type = type;
    
    if (total_min !== undefined && total_min !== null) {
      requestBody.total_min = total_min;
    } else if (total_max !== undefined && total_max !== null && total_max > 0) {
      // Si no hay total_min pero sí hay total_max, usar 0 como total_min
      requestBody.total_min = 0;
    }
    
    if (total_max !== undefined && total_max !== null && total_max > 0) {
      requestBody.total_max = total_max;
    }

    console.log('fetchGetOrdersReportsFailedTransactionsList requestBody:', requestBody);

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Response: ${textResponse}`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }


    const responseData = data.respuesta || data;

    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders reports failed transactions list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }

}

// Reportes para gráficos
// La función recibe los siguientes valores en el body:
// - start: "2025-01-01"
// - end: "2025-06-30"  
// - type: "sales" | "transactions" | "revenue" | etc.

export const fetchGetOrdersReportsCharts = async (
  start: string,
  end: string,
  type: ChartReportType,
  total_min?: number,
  total_max?: number
): Promise<ActionResult<any>> => {
  try {
    if (IS_QA_MODE) {
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data específico según el tipo
      if (type === 'top-products') {
        const mockTopProductsResponse: TopProductsChartResponse = {
          top_products: [
            { month: "2025-01", product: "Pan de pasas", total: 17534144 },
            { month: "2025-01", product: "Pastas secas", total: 26128752 },
            { month: "2025-02", product: "Avena instantánea", total: 15000000 },
            { month: "2025-02", product: "Vinos", total: 8500000 },
            { month: "2025-03", product: "Chuleta de cerdo", total: 19234144 },
            { month: "2025-03", product: "Leche", total: 24128752 }
          ],
          total_sales: 112425792
        };

        return {
          ok: true,
          data: mockTopProductsResponse,
          error: null,
        };
      }
      
      if (type === 'top-categories') {
        const mockTopCategoriesResponse = {
          top_categories: [
            { month: "2025-01", category: "Higiene personal", total: 6622885 },
            { month: "2025-02", category: "Salsas y condimentos", total: 5021690 },
            { month: "2025-03", category: "Pescados y mariscos", total: 6643559 },
            { month: "2025-04", category: "Temporada", total: 6318263 },
            { month: "2025-05", category: "Lácteos y derivados", total: 6174085 },
            { month: "2025-06", category: "Pescados y mariscos", total: 4503683 }
          ],
          total_sales: 35284165,
          average_sales: 5880694
        };

        return {
          ok: true,
          data: mockTopCategoriesResponse,
          error: null,
        };
      }
      
      if (type === 'top-municipalities') {
        const mockTopMunicipalitiesResponse = {
          top_municipalities: [
            { month: "2025-01", municipality: "Santiago", total_purchases: 17534144, quantity: 45 },
            { month: "2025-01", municipality: "Las Condes", total_purchases: 26128752, quantity: 38 },
            { month: "2025-02", municipality: "Providencia", total_purchases: 15000000, quantity: 32 },
            { month: "2025-02", municipality: "Ñuñoa", total_purchases: 8500000, quantity: 28 },
            { month: "2025-03", municipality: "La Reina", total_purchases: 19234144, quantity: 41 },
            { month: "2025-03", municipality: "Vitacura", total_purchases: 24128752, quantity: 35 }
          ],
          total_purchases: 112425792,
          quantity: 219
        };

        return {
          ok: true,
          data: mockTopMunicipalitiesResponse,
          error: null,
        };
      }
      
      // Mock data para otros tipos de gráficos
      const mockResponse: ChartReportsResponse = {
        months: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"],
        clients: ["Armando Meza", "Brody Hoeger PhD", "Cliente 3", "Cliente 4"],
        totals: [
          {
            month: "2025-01",
            sales_by_client: [
              { client: "Armando Meza", total: 17534144 },
              { client: "Brody Hoeger PhD", total: 26128752 },
              { client: "Cliente 3", total: 15000000 },
              { client: "Cliente 4", total: 8500000 }
            ]
          },
          {
            month: "2025-02", 
            sales_by_client: [
              { client: "Armando Meza", total: 19234144 },
              { client: "Brody Hoeger PhD", total: 24128752 },
              { client: "Cliente 3", total: 17000000 },
              { client: "Cliente 4", total: 9500000 }
            ]
          }
        ],
        total_buyers_per_month: [
          { month: "2025-01", total_buyers: 12 },
          { month: "2025-02", total_buyers: 15 },
          { month: "2025-03", total_buyers: 18 },
          { month: "2025-04", total_buyers: 14 },
          { month: "2025-05", total_buyers: 20 },
          { month: "2025-06", total_buyers: 16 }
        ]
      };

      return {
        ok: true,
        data: mockResponse,
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const endpointUrl = `${BACKEND_URL}/orders/reports`;

    const requestBody: any = {
      start,
      end,
      type,
    };

    // Agregar filtros de montos si están presentes
    if (total_min !== undefined && total_min !== null) {
      requestBody.total_min = total_min;
    } else if (total_max !== undefined && total_max !== null && total_max > 0) {
      // Si no hay total_min pero sí hay total_max, usar 0 como total_min
      requestBody.total_min = 0;
    }
    
    if (total_max !== undefined && total_max !== null && total_max > 0) {
      requestBody.total_max = total_max;
    }


    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Response: ${textResponse}`,
      };
    }

    const data = await response.json();

    console.log('fetchGetOrdersReportsCharts data:', data);

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Extraer la estructura correcta que espera el slice
    const responseData = data.respuesta || data;

    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders reports charts:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Detalles de transacción específica
export interface TransactionDetails {
  order: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    status: string;
    subtotal: number;
    amount: number;
    order_meta: {
      user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        phone: string;
        rut: string;
        business_name: string;
        is_active: boolean;
        last_login: string;
        password_changed_at: string | null;
        created_at: string;
        updated_at: string;
      };
      address: {
        id: number;
        user_id: number;
        address_line1: string;
        address_line2: string;
        municipality_id: number;
        postal_code: string;
        is_default: boolean;
        type: string;
        phone: string;
        contact_name: string;
        created_at: string;
        updated_at: string;
        alias: string | null;
      };
    };
    created_at: string;
    updated_at: string;
    order_items: Array<{
      id: number;
      product_id: number;
      product: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
  };
}

export const fetchGetTransactionDetails = async (
  transactionId: number
): Promise<ActionResult<TransactionDetails>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: TransactionDetails = {
        order: {
          id: transactionId,
          user: {
            id: 7,
            name: "Admin",
            email: "admin@admin.com"
          },
          status: "canceled",
          subtotal: 632887,
          amount: 632887,
          order_meta: {
            user: {
              id: 7,
              name: "Admin",
              email: "admin@admin.com",
              email_verified_at: null,
              phone: "1234567890",
              rut: "22375589-5",
              business_name: "Admin",
              is_active: true,
              last_login: "2025-07-01 20:12:54",
              password_changed_at: null,
              created_at: "2025-07-01T20:12:54.000000Z",
              updated_at: "2025-07-01T20:12:54.000000Z"
            },
            address: {
              id: 19,
              user_id: 7,
              address_line1: "666 Billy Crossroad Suite 478\nNew Aaronfort, OR 29951-2341",
              address_line2: "Suite 251",
              municipality_id: 222,
              postal_code: "2534550",
              is_default: false,
              type: "billing",
              phone: "971204893",
              contact_name: "Austyn Schiller",
              created_at: "2025-07-01T20:12:54.000000Z",
              updated_at: "2025-07-01T20:12:54.000000Z",
              alias: null
            }
          },
          created_at: "2025-01-03T11:01:32.000000Z",
          updated_at: "2025-07-01T20:13:10.000000Z",
          order_items: [
            {
              id: 13,
              product_id: 537,
              product: "Pan de pasas",
              quantity: 5,
              price: 40359,
              subtotal: 201795
            },
            {
              id: 14,
              product_id: 592,
              product: "Pastas secas producto 575 15",
              quantity: 6,
              price: 30757,
              subtotal: 184542
            },
            {
              id: 15,
              product_id: 82,
              product: "Avena instantánea 14",
              quantity: 8,
              price: 5165,
              subtotal: 41320
            },
            {
              id: 16,
              product_id: 1189,
              product: "Vinos producto 299 12",
              quantity: 6,
              price: 21840,
              subtotal: 131040
            },
            {
              id: 17,
              product_id: 241,
              product: "Chuleta de cerdo 1",
              quantity: 3,
              price: 24730,
              subtotal: 74190
            }
          ]
        }
      };

      return {
        ok: true,
        data: mockResponse,
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const endpointUrl = `${BACKEND_URL}/orders/reports/transaction/${transactionId}`;

    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Response: ${textResponse}`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Extraer la estructura correcta que espera el slice
    const responseData = data.respuesta || data;

    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Obtener clientes con más compras
export const fetchGetClientsMostPurchasesList = async (
  start: string,
  end: string,
  per_page: number,
  page: number,
  total_min?: number,
  total_max?: number
): Promise<ActionResult<any>> => {
  console.log('total_min', total_min);
  console.log('total_max', total_max);
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const endpointUrl = `${BACKEND_URL}/orders/reports/clients-list`;

    const requestBody: any = {
      start,
      end,
      per_page,
      page,
    };
    
    if (total_min !== undefined && total_min !== null) {
      requestBody.total_min = total_min;
    } else if (total_max !== undefined && total_max !== null && total_max > 0) {
      // Si no hay total_min pero sí hay total_max, usar 0 como total_min
      requestBody.total_min = 0;
    }
    
    if (total_max !== undefined && total_max !== null && total_max > 0) {
      requestBody.total_max = total_max;
    }

    console.log('requestBody', requestBody);
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Response: ${textResponse}`,
      };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }
    const responseData = data.respuesta || data;
    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};