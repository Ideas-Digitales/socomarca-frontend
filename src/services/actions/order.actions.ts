"use server";

import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { BACKEND_URL } from "@/utils/getEnv";

import type { OrderResponse } from "@/interfaces/order.interface";

export async function createOrderFromCart({ shippingAddressId }: { shippingAddressId: number }) {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token no disponible");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const res = await fetch(`${BACKEND_URL}/orders/pay`, {
    method: "POST",
    headers,
    body: JSON.stringify({ address_id: shippingAddressId }),
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
    throw new Error("No se obtuvo la URL ni el token de pago");
  }

  return { payment_url, token: webpayToken };
}


export async function getUserOrders(page = 1, per_page = 20): Promise<OrderResponse | null> {

  console.log("Obteniendo órdenes del usuario...");
 const { getCookie } = await cookiesManagement();
  const token = getCookie("token");
  if (!token) return null

  try {
    const res = await fetch(`${BACKEND_URL}/orders?page=${page}&per_page=${per_page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('Error al obtener órdenes:', res.statusText)
      return null
    }

    const data = await res.json()
    return data as OrderResponse
  } catch (error) {
    console.error('Error de red al obtener órdenes:', error)
    return null
  }
}
