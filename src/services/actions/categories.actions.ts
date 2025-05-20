'use server';

import { mockCategories } from '@/mock/categories';
import { BACKEND_URL, IS_QA_MODE, QA_JWT } from '@/utils/getEnv';

export const fetchGetCategories = async () => {
  console.log(BACKEND_URL);
  try {
    if (IS_QA_MODE) {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockCategories);
        }, 1000);
      });

      return {
        ok: true,
        data: response,
        error: null,
      };
    } else {
      const response = await fetch(`${BACKEND_URL}/categories`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${QA_JWT}`,
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
    console.log('Error fetching categories:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
