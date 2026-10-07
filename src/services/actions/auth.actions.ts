'use server';

import {
  LoginResponse,
  RestoreCredentialsResponse,
} from '@/interfaces/user.interface';
import { mockResponse } from '@/mock/login';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { IS_QA_MODE, BACKEND_URL } from '@/utils/getEnv';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// Traduce las respuestas de error del backend en el login a mensajes claros
// para el usuario final. El backend suele devolver textos técnicos en inglés
// (p. ej. "Unauthorized") que no deben mostrarse tal cual.
const getFriendlyLoginError = async (response: Response): Promise<string> => {
  if (response.status === 422) {
    const data = await response.json().catch(() => null);
    const fieldError = data?.errors?.email?.[0] ?? data?.errors?.password?.[0];
    if (fieldError) return fieldError;
  }

  if (response.status === 429) {
    return 'Demasiados intentos. Espera unos minutos.';
  }

  if (response.status >= 500) {
    return 'Error del servidor. Inténtalo más tarde.';
  }

  return 'Email o contraseña incorrectos.';
};

export const fetchLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const normalizedEmail = normalizeEmail(email);

  if (IS_QA_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (normalizedEmail === 'qa@socomarca.cl') {
          resolve(mockResponse);
        } else {
          reject(new Error('Email o contraseña incorrectos.'));
        }
      }, 500);
    });
  }

  const { setCookie } = await cookiesManagement();
  const bodyRequest = {
    email: normalizedEmail,
    password,
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
      return {
        user: null,
        error: {
          message: await getFriendlyLoginError(response),
          status: response.status,
        },
      };
    }

    const data = await response.json();

    // Almacenar el token y datos del usuario en cookies
    const { token, user } = data;
    const roles = user?.roles || [];
    const permissions = user?.permissions || [];
    const userId = String(user?.id || null);

    if (token && user) {
      setCookie(token, 'token');
      setCookie(roles.join(','), 'role');
      const permissionsValue =
        permissions.length > 0 ? permissions.join(',') : 'none';
      setCookie(permissionsValue, 'permissions');
      setCookie(userId, 'userId');

      // Guardar datos completos del usuario como JSON
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        rut: user.rut,
        roles: user.roles || [],
        permissions: user.permissions || [],
        branch_type: user.branch_type ?? null,
        can_order_for_branches: Boolean(user.can_order_for_branches),
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
        permissions: data.user.permissions || [],
        branch_type: data.user.branch_type ?? null,
        can_order_for_branches: Boolean(data.user.can_order_for_branches),
      },
      extra: data.extra
        ? { weak_password: Boolean(data.extra.weak_password) }
        : undefined,
    };
  } catch (error) {
    console.log('Error en la autenticación:', error);
    throw error instanceof Error
      ? error
      : new Error('Error en la autenticación');
  }
};

// POST /auth/restore responde 200 con el email enmascarado exista o no la cuenta,
// para no revelar qué correos están registrados.
export const sendRecoveryEmail = async (
  email: string
): Promise<RestoreCredentialsResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.errors?.email?.[0] ||
          data.message ||
          'No se pudo enviar el correo de recuperación',
      };
    }

    return {
      success: true,
      message: data.message || 'Revisa tu bandeja de entrada',
      email: data.data?.email,
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
    } // Opcional: eliminar la cookie si la setea el frontend
    deleteCookie('token');
    deleteCookie('role');
    deleteCookie('permissions');
    deleteCookie('userId');
    deleteCookie('userData');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  passwordConfirmation: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        success: false,
        message: 'No hay sesión activa',
        error: 'TOKEN_NOT_FOUND'
      };
    }

    const response = await fetch(`${BACKEND_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar diferentes tipos de errores del backend
      let errorMessage = 'Error al cambiar la contraseña';
      
      if (response.status === 401) {
        errorMessage = 'La contraseña actual es incorrecta';
      } else if (response.status === 422) {
        // Errores de validación
        if (data.errors?.current_password) {
          errorMessage = data.errors.current_password[0];
        } else if (data.errors?.password) {
          errorMessage = data.errors.password[0];
        } else if (data.errors?.password_confirmation) {
          errorMessage = data.errors.password_confirmation[0];
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (data.message) {
        errorMessage = data.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: 'API_ERROR'
      };
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente'
    };

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return {
      success: false,
      message: 'Ocurrió un error inesperado al cambiar la contraseña',
      error: 'NETWORK_ERROR'
    };
  }
}
