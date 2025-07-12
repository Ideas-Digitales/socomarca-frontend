'use server'

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export interface TermsAndConditions {
  id?: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// Obtener términos y condiciones
export const fetchGetTermsAndConditions = async (): Promise<ActionResult<TermsAndConditions>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: TermsAndConditions = {
        id: 1,
        content: '<h1>Términos y Condiciones</h1><p>Este es un contenido de ejemplo para términos y condiciones. Puedes editar este contenido usando el editor de texto enriquecido.</p><h2>1. Aceptación de los términos</h2><p>Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso.</p>',
        created_at: '2025-01-01T00:00:00.000000Z',
        updated_at: '2025-01-01T00:00:00.000000Z'
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

    const endpointUrl = `${BACKEND_URL}/terms`;

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
    console.error('Error fetching terms and conditions:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Actualizar términos y condiciones
export const fetchUpdateTermsAndConditions = async (
  content: string
): Promise<ActionResult<TermsAndConditions>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: TermsAndConditions = {
        id: 1,
        content: content,
        created_at: '2025-01-01T00:00:00.000000Z',
        updated_at: new Date().toISOString()
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

    const endpointUrl = `${BACKEND_URL}/terms`;

    const requestBody = {
      content: content,
    };

    const response = await fetch(endpointUrl, {
      method: 'PUT',
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

    // Extraer la estructura correcta que espera el slice
    const responseData = data.respuesta || data;

    return {
      ok: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Error updating terms and conditions:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};