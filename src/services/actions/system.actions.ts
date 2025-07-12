'use server'

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

interface CustomerMessageData {
  header_color: string;
  header_content: string;
  banner_desktop_image?: File;
  banner_mobile_image?: File;
  banner_enabled: boolean;
  modal_image?: File;
  modal_enabled: boolean;
}

interface CustomerMessageResponse {
  header: {
    color: string;
    content: string;
  };
  banner: {
    desktop_image: string;
    mobile_image: string;
    enabled: boolean;
  };
  modal: {
    image: string;
    enabled: boolean;
  };
}

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

// Obtener mensajes del cliente
export const fetchGetCustomerMessage = async (): Promise<ActionResult<CustomerMessageResponse>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse: CustomerMessageResponse = {
        header: {
          color: '#ffffff',
          content: 'Bienvenido a Socomarca'
        },
        banner: {
          desktop_image: '',
          mobile_image: '',
          enabled: true
        },
        modal: {
          image: '',
          enabled: false
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

    const endpointUrl = `${BACKEND_URL}/customer-message`;

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
    console.error('Error fetching customer message:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Enviar mensajes del cliente
export const fetchSendCustomerMessage = async (
  messageData: CustomerMessageData
): Promise<ActionResult<any>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data para QA
      const mockResponse = {
        message: 'Mensaje del cliente enviado exitosamente',
        data: messageData
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

    const endpointUrl = `${BACKEND_URL}/customer-message`;

    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('header_color', messageData.header_color);
    formData.append('header_content', messageData.header_content);
    formData.append('banner_enabled', messageData.banner_enabled ? '1' : '0');
    formData.append('modal_enabled', messageData.modal_enabled ? '1' : '0');
    
    // Agregar archivos si existen
    if (messageData.banner_desktop_image) {
      formData.append('banner_desktop_image', messageData.banner_desktop_image);
    }
    
    if (messageData.banner_mobile_image) {
      formData.append('banner_mobile_image', messageData.banner_mobile_image);
    }
    
    if (messageData.modal_image) {
      formData.append('modal_image', messageData.modal_image);
    }

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
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
    console.error('Error sending customer message:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}; 