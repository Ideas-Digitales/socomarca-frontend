'use server'

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

// Lista por transacciones
// La función recibe los siguientes valores en el body:
// - start: "2025-01-01"
// - end: "2025-01-31"
// - per_page: 15
// - page: 1

type TableDetail = {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Response {
  table_detail: TableDetail[];
  pagination: Pagination;
}

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export const fetchGetOrdersReportsTransactionsList = async (
  start: string,
  end: string,
  per_page: number,
  page: number
): Promise<ActionResult<Response>> => {
  try {
    if (IS_QA_MODE) {
      console.log('QA MODE: Using mock data for transactions list');
      console.log('Request params:', { start, end, per_page, page });
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockData: TableDetail[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        customer: `Cliente ${i + 1}`,
        amount: Math.floor(Math.random() * 500000) + 50000,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'successful'
      }));

      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = mockData.slice(startIndex, endIndex);

      const mockResponse = {
        table_detail: paginatedData,
        pagination: {
          current_page: page,
          last_page: Math.ceil(mockData.length / per_page),
          per_page: per_page,
          total: mockData.length,
        }
      };
      
      console.log('QA MODE: Mock response:', mockResponse);

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

    const response = await fetch(`${BACKEND_URL}/orders/reports/transactions-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        start,
        end,
        per_page,
        page,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Verificar el content-type antes de parsear JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.log('Non-JSON response:', textResponse);
      return {
        ok: false,
        data: null,
        error: `Server returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}`,
      };
    }

    const data = await response.json();
    console.log({respuesta: data});

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Extraer la estructura correcta que espera el slice
    const responseData = data.respuesta || data;
    console.log('Extracted responseData:', responseData);

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