'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

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
  return json.data;
}
