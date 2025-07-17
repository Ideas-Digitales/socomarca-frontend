'use server';

import { BACKEND_URL } from '@/utils/getEnv';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';

export interface WebpayConfig {
  WEBPAY_COMMERCE_CODE: string;
  WEBPAY_API_KEY: string;
  WEBPAY_ENVIRONMENT: string;
  WEBPAY_RETURN_URL: string;
}

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export async function fetchGetWebpayConfig(): Promise<ActionResult<WebpayConfig>> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');
    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }
    const res = await fetch(`${BACKEND_URL}/webpay/config`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Error HTTP: ${res.status}`);
    }
    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error fetching Webpay config:', errorMessage);
    return {
      ok: false,
      data: null,
      error: errorMessage,
    };
  }
}

export async function fetchUpdateWebpayConfig(
  config: WebpayConfig
): Promise<ActionResult<WebpayConfig>> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');
    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }
    const res = await fetch(`${BACKEND_URL}/webpay/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Error HTTP: ${res.status}`);
    }
    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error updating Webpay config:', errorMessage);
    return {
      ok: false,
      data: null,
      error: errorMessage,
    };
  }
} 