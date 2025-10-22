'use server'

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

interface FCMTokenRequest {
  fcm_token: string;
}

interface FCMTokenResponse {
  success: boolean;
  message: string;
}

const getAuthHeaders = async () => {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');
  
  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Enviar token FCM al backend
export const sendFCMToken = async (fcmToken: string): Promise<ActionResult<FCMTokenResponse>> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${process.env.BACKEND_URL}/fcm/token`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        fcm_token: fcmToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.message || `Error ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    
    return {
      ok: true,
      data: {
        success: true,
        message: data.message || 'Token FCM enviado correctamente'
      },
      error: null
    };

  } catch (error) {
    console.error('Error enviando token FCM:', error);
    
    // Si el error es de autenticación, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return {
        ok: false,
        data: null,
        error: 'No autorizado: Debe iniciar sesión para actualizar el token FCM'
      };
    }
    
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error inesperado al enviar token FCM'
    };
  }
};

// Obtener token FCM actual del usuario (opcional)
export const getFCMToken = async (): Promise<ActionResult<{ fcm_token: string | null }>> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${process.env.BACKEND_URL}/fcm/token`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.message || `Error ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    
    return {
      ok: true,
      data: {
        fcm_token: data.fcm_token || null
      },
      error: null
    };

  } catch (error) {
    console.error('Error obteniendo token FCM:', error);
    
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error inesperado al obtener token FCM'
    };
  }
};
