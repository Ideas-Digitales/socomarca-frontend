'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export interface PaymentMethod {
  id: number;
  name: string;
  active: boolean;
  code: string;
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');

  const res = await fetch(`${BACKEND_URL}/payment-methods`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const json = await res.json();
  return (json.data as PaymentMethod[]).filter((m) => m.active);
}

/**
 * Consulta el detalle del pago en el backend usando el token_ws
 */
export async function getWebpayPaymentDetail(token_ws: string) {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie('token'); // si tu endpoint requiere auth

  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(
    `${BACKEND_URL}/webpay/return?token_ws=${encodeURIComponent(token_ws)}`,
    { method: 'GET', headers }
  );

  const json = await res.json();
  if (!res.ok) {
    /* Lanzamos el texto de error del backend o uno genérico */
    throw new Error(json.message || 'Error al consultar el estado del pago');
  }

  /** Esperamos que el backend responda algo como:
   * {
   *   "data": { "order": { ... }, "payment_status": "AUTHORIZED", ... }
   * }
   */
  return json;
}
