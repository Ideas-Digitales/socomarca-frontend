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

  // 1. Crear orden
  const orderRes = await fetch(`${BACKEND_URL}/orders/create-from-cart?user_id=${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Juan Perez',
      rut: '12345678-9',
      email: 'juan.perez@gmail.com',
      phone: '999999999',
      address: 'Calle 123',
      region_id: 1,
      municipality_id: 1,
      billing_address: 'Calle 123',
      billing_address_details: 'Apt 123',
    }),
  });

  const orderJson = await orderRes.json();
  console.log('Respuesta creación orden:', orderJson);

  if (!orderRes.ok) {
    throw new Error(`Error al crear orden: ${orderJson.message || 'Desconocido'}`);
  }

  const orderId = orderJson.data?.order?.id;
  if (!orderId) throw new Error('No se recibió el ID de la orden');

  // 2. Llamar a /orders/pay
  const payRes = await fetch(`${BACKEND_URL}/orders/pay?user_id=${userId}&order_id=${orderId}`, {
    method: 'POST',
    headers,
  });

  const payJson = await payRes.json();
  console.log('Respuesta pago orden:', payJson);

  if (!payRes.ok) {
    throw new Error(`Error al iniciar pago: ${payJson.message || 'Desconocido'}`);
  }

  return payJson;
}
