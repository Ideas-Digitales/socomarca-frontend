'use server'

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { SiteInformation } from '@/interfaces/siteInformation.interface';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

// Obtener información del sitio
export const fetchGetSiteInformation = async (): Promise<ActionResult<SiteInformation>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: SiteInformation = {
        header: {
          contact_phone: '+56 9 1234 5678',
          contact_email: 'contacto@socomarca.com'
        },
        footer: {
          contact_phone: '+56 9 1234 5678',
          contact_email: 'info@socomarca.com'
        },
        social_media: [
          {
            label: 'instagram',
            link: 'https://instagram.com/socomarca'
          },
          {
            label: 'facebook',
            link: 'https://facebook.com/socomarca'
          }
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

    const endpointUrl = `${BACKEND_URL}/siteinfo`;

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
    console.error('Error fetching site information:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Actualizar información del sitio
export const fetchUpdateSiteInformation = async (
  siteInfo: SiteInformation
): Promise<ActionResult<SiteInformation>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: SiteInformation = {
        ...siteInfo,
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

    const endpointUrl = `${BACKEND_URL}/siteinfo`;

    const response = await fetch(endpointUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(siteInfo),
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
    console.error('Error updating site information:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
