'use server';

import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

interface AddToCartPayload {
  product_id: number;
  quantity: number;
  unit: string;
}

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  unit: string;
  subtotal: number;
}

interface CartResponse {
  items: CartItem[];
  total: number;
}

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export const fetchPostAddToCart = async (
  payload: AddToCartPayload
): Promise<ActionResult<any>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ok: true,
        data: {
          message: 'Producto añadido al carrito (mock)',
          product_id: payload.product_id,
          quantity: payload.quantity,
          cart_id: 123,
        },
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const response = await fetch(`${BACKEND_URL}/carts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('POST response:', response);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

export const fetchGetCart = async (): Promise<ActionResult<CartResponse>> => {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        ok: true,
        data: {
          items: [
            {
              id: 1,
              user_id: 3,
              product_id: 7,
              quantity: 2,
              price: '1000.00',
              unit: 'UN',
              subtotal: 2000,
            },
            {
              id: 3,
              user_id: 3,
              product_id: 7,
              quantity: 6,
              price: '1000.00',
              unit: 'UN',
              subtotal: 6000,
            },
          ],
          total: 8000,
        },
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token found',
      };
    }

    const response = await fetch(`${BACKEND_URL}/carts`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('GET response:', response);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    return {
      ok: true,
      data: result.data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
