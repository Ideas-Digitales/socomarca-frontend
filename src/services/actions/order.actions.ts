'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export async function createOrderFromCart() {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');
  const userId = getCookie('userId');

  if (!token || !userId) {
    throw new Error('Faltan las cookies necesarias');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Crear orden
  const orderRes = await fetch(`${BACKEND_URL}/orders/create-from-cart?user_id=${userId}`, {
    method: 'POST',
    headers
  });

  const orderJson = await orderRes.json();
  console.log('Respuesta creación orden:', orderJson);

  if (!orderJson.ok) {
    throw new Error(`Error al crear orden: ${orderJson.message || 'Desconocido'}`);
  }
console.log('Orden creada con éxito:', orderJson);
  const orderId = orderJson.data?.order?.id;
  if (!orderId) throw new Error('No se recibió el ID de la orden');

  // Crear url de pago
  const payRes = await fetch(`${BACKEND_URL}/orders/pay?user_id=${userId}&order_id=${orderId}`, {
    method: 'POST',
    headers,
  });

  const payJson = await payRes.json();
  console.log('Respuesta pago orden:', payJson);

  if (!payRes.ok) {
    throw new Error(`Error al iniciar pago: ${payJson.message || 'Desconocido'}`);
  }
console.log('Pago iniciado con éxito:', payJson);
  return payJson;
}
