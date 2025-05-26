'use server';

import { LoginResponse } from '@/interfaces/user.interface';
import { IS_QA_MODE } from '@/utils/getEnv';

export const fetchLogin = async (
  rut: string,
  password: string
): Promise<LoginResponse> => {
  if (IS_QA_MODE || !IS_QA_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (rut === '12.312.312-3') {
          resolve({
            user: {
              id: '1',
              name: 'Maria',
              email: 'maria@socomarca.cl',
              rut,
            },
            jwt: 'fake-jwt-token',
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 500);
    });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales inválidas');
    }

    const data = await response.json();

    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        rut: data.user.rut,
      },
      jwt: data.jwt,
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Error en la autenticación');
  }
};
