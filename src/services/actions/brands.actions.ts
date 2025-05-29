'use server';

import { mockBrands } from '@/mock/brands';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';

export const fetchGetBrands = async () => {
  try {
    if (IS_QA_MODE) {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockBrands);
        }, 1000);
      });

      return {
        ok: true,
        data: response,
        error: null,
      };
    } else {
      const { getCookie } = await cookiesManagement();
      const cookie = getCookie('token');
      if (!cookie) {
        return {
          ok: false,
          data: null,
          error: 'Unauthorized: No token provided',
        };
      }
      const response = await fetch(`${BACKEND_URL}/brands`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      return {
        ok: true,
        data,
        error: null,
      };
    }
  } catch (error) {
    console.log('Error fetching brands:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
