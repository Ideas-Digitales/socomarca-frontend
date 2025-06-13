'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export async function createOrderFromCart() {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');

  if (!token) {
    throw new Error('Token no disponible');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const res = await fetch(`${BACKEND_URL}/orders/pay`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      address_id: 13
    }),
  });

  const json = await res.json();
  console.log('Respuesta de crear orden:', json);
  if (!res.ok) {
    throw new Error(
      json.message || 'Error al crear la orden y generar el pago'
    );
  }

  const { payment_url, token: webpayToken } = json.data;

  if (!payment_url || !webpayToken) {
    throw new Error('No se obtuvo la URL ni el token de pago');
  }

  return { payment_url, token: webpayToken };
}
