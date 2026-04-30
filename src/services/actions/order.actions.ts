"use server";

import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { BACKEND_URL } from "@/utils/getEnv";

import type { OrderResponse } from "@/interfaces/order.interface";

export async function createOrderFromCart({
  shippingAddressId,
  paymentMethod,
}: {
  shippingAddressId: number;
  paymentMethod: string;
}) {
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
    body: JSON.stringify({ address_id: shippingAddressId, payment_method: paymentMethod }),
  });

  const json = await res.json();
  console.log('[orders/pay] Respuesta cruda:', JSON.stringify(json, null, 2));
  if (!res.ok || json?.success === false) {
    throw new Error(json.message || 'Error al crear la orden y generar el pago');
  }

  return json;
}


export async function getUserOrders(
  page = 1,
  per_page = 20,
  sort: string = 'created_at',
  sort_direction: 'asc' | 'desc' = 'desc',
  payment_method_code?: string,
): Promise<OrderResponse | null> {

 const { getCookie } = await cookiesManagement();
  const token = getCookie("token");
  if (!token) return null

  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
      sort,
      sort_direction,
      ...(payment_method_code ? { payment_method_code } : {}),
    });
    const res = await fetch(`${BACKEND_URL}/orders?${params}`, {
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
