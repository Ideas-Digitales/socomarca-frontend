'use server'

import { Region } from '@/interfaces/region.interface';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';

/**
 * Fetches paginated .
 * @returns API-like response with product data
 */
export const fetchGetRegions = async () => {
  try {
    const { getCookie } = await cookiesManagement();
    const cookie = getCookie('token');

    if (!cookie) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    const response = await fetch(
      `${BACKEND_URL}/regions`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${cookie}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: Region[] = await response.json();

    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.log('Error fetching products:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};