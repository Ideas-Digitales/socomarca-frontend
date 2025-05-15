'use server';

import { mockCategories } from '@/mock/categories';

const BACKEND_URL = process.env.BACKEND_URL;
const QA_JWT = process.env.QA_JWT;
const NEXT_PUBLIC_QA_MODE = process.env.NEXT_PUBLIC_QA_MODE;

export const fetchGetCategories = async () => {
  console.log(BACKEND_URL)
  try {
    if (NEXT_PUBLIC_QA_MODE) {
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
