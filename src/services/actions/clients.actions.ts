'use server';

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { ClientsListResponse } from '@/interfaces/client.interface';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export const fetchGetClientsList = async (
  start: string,
  end: string,
  per_page: number,
  page: number,
  total_min?: number,
  total_max?: number
): Promise<ActionResult<ClientsListResponse>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data para QA
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: 1000 + i + 1,
        cliente: `Cliente ${i + 1}`,
        monto: Math.floor(Math.random() * 1000000) + 50000,
        fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        estado: 'completed',
      }));

      // Aplicar filtros de monto si están presentes
      let filteredData = mockData;
      if (total_min !== undefined) {
        filteredData = filteredData.filter((item) => item.monto >= total_min);
      }
      if (total_max !== undefined) {
        filteredData = filteredData.filter((item) => item.monto <= total_max);
      }

      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      const mockResponse: ClientsListResponse = {
        detalle_tabla: paginatedData,
        pagination: {
          current_page: page,
          last_page: Math.ceil(filteredData.length / per_page),
          per_page: per_page,
          total: filteredData.length,
        },
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

    const endpointUrl = `${BACKEND_URL}/orders/reports/clients-list`;

    // Crear el body según la documentación del API
    const requestBody: any = {
      per_page,
      page,
    };

    // Agregar filtros opcionales solo si tienen valores válidos
    if (start && start.trim() !== '') requestBody.start = start;
    if (end && end.trim() !== '') requestBody.end = end;
    if (total_min !== undefined && total_min !== null && total_min >= 0)
      requestBody.total_min = total_min;
    if (total_max !== undefined && total_max !== null && total_max > 0)
      requestBody.total_max = total_max;

    console.log('Request body para clients-list:', requestBody);

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
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

    console.log('Response de clients-list:', data);
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
    console.error('Error fetching clients list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Nueva interfaz para el endpoint /users/customers
export interface Customer {
  id: number;
  customer: string;
}

export const fetchGetCustomersList = async (): Promise<
  ActionResult<Customer[]>
> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data para QA
      const mockCustomers: Customer[] = [
        { id: 1, customer: 'Juan Perez' },
        { id: 2, customer: 'Pedro Neza' },
        { id: 3, customer: 'Armando Meza' },
        { id: 5, customer: 'Eduardo Fuentes' },
        { id: 8, customer: 'Miguel Rojas Soto' },
      ];

      return {
        ok: true,
        data: mockCustomers,
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

    const endpointUrl = `${BACKEND_URL}/users/customers`;

    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
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

    //console.log('Response de /users/customers:', data);
    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    return {
      ok: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching customers list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
