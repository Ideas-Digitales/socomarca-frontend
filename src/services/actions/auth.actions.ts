'use server';

import { LoginResponse } from '@/interfaces/user.interface';
import { mockResponse } from '@/mock/login';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { removeDots } from '@/stores/base/utils/removeDots';
import { IS_QA_MODE } from '@/utils/getEnv';

export const fetchLogin = async (
  rut: string,
  password: string,
  role?: string
): Promise<LoginResponse> => {
  if (IS_QA_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (rut === '12.312.312-3') {
          resolve(mockResponse);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 500);
    });
  }

  const { setCookie } = await cookiesManagement();
  const bodyRequest = {
    rut: removeDots(rut),
    password,
    role: role || null,
  };

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        user: null,
        error: {
          message: errorData.message || 'Error en la autenticación',
          status: response.status,
        },
      };
    }

    const data = await response.json();


      // Almacenar el token y datos del usuario en cookies
    const { token, user } = data;
    const roles = user?.roles || [];
    const userId = String(user?.id || null);

    if (token && user) {
      setCookie(token, 'token');
      setCookie(roles.join(','), 'role');
      setCookie(userId, 'userId');
      
      // Guardar datos completos del usuario como JSON
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        rut: user.rut,
        roles: user.roles || [],
      };
      setCookie(JSON.stringify(userData), 'userData');
    }

    if (!token || !data.user) {
      return {
        user: null,
        error: {
          message: 'Usuario inválido',
          status: 401,
        },
      };
    }

    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        rut: data.user.rut,
        roles: data.user.roles || [],
      },
    };
  } catch (error) {
    console.log('Error en la autenticación:', error);
    throw error instanceof Error
      ? error
      : new Error('Error en la autenticación');
  }
};

export const sendRecoveryEmail = async (
  rut: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ rut: removeDots(rut) }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'No se pudo enviar el correo de recuperación',
      };
    }

    return {
      success: true,
      message: 'Correo de recuperación enviado',
    };
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    return {
      success: false,
      message: 'Ocurrió un error inesperado',
    };
  }
};



export async function logoutAction() {
   const { getCookie, deleteCookie } = await cookiesManagement();
      const cookie = getCookie('token');

  if (!cookie) {
    console.warn('No token found in cookies');
    return;
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/token`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to revoke token', await response.text());
    }    // Opcional: eliminar la cookie si la setea el frontend
    deleteCookie('token');
    deleteCookie('role');
    deleteCookie('userId');
    deleteCookie('userData');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
