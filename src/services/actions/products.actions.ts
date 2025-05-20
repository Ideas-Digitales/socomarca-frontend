'use server';
import { ProductsMock, productsMock } from '@/mock/products';
import { BACKEND_URL, IS_QA_MODE, QA_JWT } from '@/utils/getEnv';

interface FetchGetProductsProps {
  page: number;
  size: number;
}

export const fetchGetProducts = async ({
  page,
  size,
}: FetchGetProductsProps) => {
  try {
    if (IS_QA_MODE) {
      const response = await new Promise<ProductsMock>((resolve) => {
        setTimeout(() => {
          resolve(productsMock);
        }, 1000);
      });

      return {
        ok: true,
        data: response,
        error: null,
      };
    } else {
      const response = await fetch(
        `${BACKEND_URL}/products/?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${QA_JWT}`,
          },
        }
      );

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
    console.log('Error fetching products:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
