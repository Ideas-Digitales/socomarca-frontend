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

    // Almacenar el token en cookies

    const { token, user } = data;
    const roles = user?.roles || [];
    if (token) {
      setCookie(token, 'token');
      setCookie(roles.join(','), 'role');
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
